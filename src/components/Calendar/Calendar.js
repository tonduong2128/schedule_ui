
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Modal } from "@mui/material";
import moment from "moment";
import 'moment/locale/vi';
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { isMobile } from 'react-device-detect';
import { MODE_REGISTER_SHEDULE, PER_PAGE, RESPONSE_CODE, ROLE, STATUS_RESERVATION } from "../../common";
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { Reservation } from "../../services";
import { getUser } from "../../utils";
import Register from "../Register";
import Busy from './Busy';
import "./Calendar.css";
import CalenderOf from './CalendarOf';
moment.locale("vi");
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: "92vh",
    // minHeight: "80vh",
    minWidth: "386px",
    overflowY: "hidden"
};


const CustomCalendar = (props) => {
    const _user = getUser();
    const [calendarOf, setCalendarOf] = useState({ isMe: true, id: _user.id });
    const [modeModal, setModeModal] = useState(MODE_REGISTER_SHEDULE.ADD);
    const [openModal, setOpenModal] = useState(false);
    const [modeCalendar, setModeCalendar] = useState(localStorage.getItem("calendar_type") || "day");
    const [infoRegister, setInfoRegister] = useState({});
    const [targetDate, setTargetDate] = useState(moment().toDate());
    const [targetDateRange, setTargetDateRange] = useState([
        moment().startOf('month').toDate(),
        moment().endOf('month').toDate()
    ]);
    const roleIds = _user.Roles.map(r => r.id);
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);

    const clickRef = useRef(null)
    const [events, setEvents] = useState([
        // {
        //     start: moment().toDate(),
        //     end: moment().toDate(),
        //     // end: moment().add(1, "days").toDate(),
        //     title: "Lịch học",
        //     info: {}
        // },
    ])
    const search = () => {
        handleRangeChange(targetDateRange, modeCalendar, true)
    }
    useEffect(() => {
        handleRangeChange(targetDateRange, modeCalendar, true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [calendarOf])
    useEffect(() => {
        const calendar = document.querySelector(".rbc-toolbar-label");
        calendar.addEventListener("click", (e) => {
            console.log(calendar);
        })
        return () => {
            calendar.removeEventListener("click", (e) => {
                //remove before event
            })
        }
    }, [])

    useEffect(() => {
        /**
         * What Is This?
         * This is to prevent a memory leak, in the off chance that you
         * teardown your interface prior to the timed method being called.
         */
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            window.clearTimeout(clickRef?.current)
        }
    }, [])

    const handleEventResize = (slotInfo) => {
        if (modeCalendar === "month") { return }
        const { start, end, event } = slotInfo;
        const { info } = event;
        if (!(info.studentId === _user.id || calendarOf.isMe)) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch học người khác.", "error"))
            return;
        }
        if (moment(`${info.targetDate} ${info.startTime}`, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch đã học.", "error"))
            return;
        }
        if (moment(start).isBefore(moment())) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch học về quá khứ.", "error"))
            return;
        }
        loadingContext.dispatch(openActionLoading())
        Reservation.updateReservation({
            ...info,
            targetDate: moment(start).format("YYYY-MM-DD"),
            startTime: moment(start).format("HH:mm:ss"),
            endTime: moment(end).format("HH:mm:ss"),
        })
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const slot = records[0]
                    const indexOldEvent = events.findIndex(ev => ev.info.id === slot.id)
                    const oldEvent = events[indexOldEvent];
                    const newEvent = {
                        ...oldEvent,
                        start,
                        end,
                        info: slot
                    };
                    events.splice(indexOldEvent, 1, newEvent);
                    setEvents([...events])
                    notificationContext.dispatch(openActionNotification("Chỉnh sửa lịch học thành công.", "success"))
                } else if (code === RESPONSE_CODE.RESERVATION_EXISTS) {
                    notificationContext.dispatch(openActionNotification("Giáo viên dã dạy giờ này rồi.", "error"))
                } else if (code === RESPONSE_CODE.RESERVATION_EXISTS_USER) {
                    notificationContext.dispatch(openActionNotification("Bạn đã đặt lịch giờ này rồi.", "error"))
                } else if (code === RESPONSE_CODE.RESERVATION_TIME_NOT_VALID) {
                    notificationContext.dispatch(openActionNotification("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.", "error"))
                } else {
                    //Handle error
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
    };
    const handleEventSelectSlot = (slotInfo) => {
        handleSelectEmptyCell(slotInfo)
    }
    // const handleEnventSelecting = (slotInfo) => {
    //     handleSelectEmptyCell(slotInfo)
    // }
    const handleSelectEmptyCell = (slotInfo) => {
        if (roleIds.includes(ROLE.admin)) {
            notificationContext.dispatch(openActionNotification("Admin không thể đăng ký lịch học.", "error"))
            return;
        }
        let { start: startTime, end: endTime } = slotInfo;
        if ((moment(startTime).isBefore(moment()) && modeCalendar !== "month")
            || (modeCalendar === "month" && moment(startTime).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD"))) {
            notificationContext.dispatch(openActionNotification("Không thể đăng ký lịch học trong quá khứ.", "error"))
            return;
        }
        if (modeCalendar === "month" && moment(startTime).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")) {
        }
        setModeModal(MODE_REGISTER_SHEDULE.ADD)
        setInfoRegister({
            targetDate: moment(startTime).format("YYYY-MM-DD"),
            startTime: moment(startTime).format("HH:mm:ss"),
            endTime: moment(endTime).format("HH:mm:ss"),
        })
        setOpenModal(true)
    }
    const handleEventDrop = (slotInfo) => {
        const { start, end, event } = slotInfo;
        const { info } = event;
        if (!(info.studentId === _user.id || calendarOf.isMe)) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch học người khác.", "error"))
            return;
        }
        if (moment(`${info.targetDate} ${info.startTime}`, 'YYYY-MM-DD HH:mm:ss').isBefore(moment())) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch đã học.", "error"))
            return;
        }
        if (moment(start).isBefore(moment())) {
            notificationContext.dispatch(openActionNotification("Không thể đăng ký lịch học trong quá khứ.", "error"))
            return;
        }
        loadingContext.dispatch(openActionLoading())
        Reservation.updateReservation({
            ...info,
            targetDate: moment(start).format("YYYY-MM-DD"),
            startTime: moment(start).format("HH:mm:ss"),
            endTime: moment(end).format("HH:mm:ss"),
        })
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const slot = records[0]
                    const indexOldEvent = events.findIndex(ev => ev.info.id === slot.id)
                    const oldEvent = events[indexOldEvent];
                    const newEvent = {
                        ...oldEvent,
                        start,
                        end,
                        info: slot
                    };
                    events.splice(indexOldEvent, 1, newEvent);
                    setEvents([...events])
                    notificationContext.dispatch(openActionNotification("Chỉnh sửa lịch học thành công.", "success"))
                } else if (code === RESPONSE_CODE.RESERVATION_EXISTS) {
                    notificationContext.dispatch(openActionNotification("Giáo viên dã dạy giờ này rồi.", "error"))
                } else if (code === RESPONSE_CODE.RESERVATION_EXISTS_USER) {
                    notificationContext.dispatch(openActionNotification("Bạn đã đặt lịch giờ này rồi.", "error"))
                } else if (code === RESPONSE_CODE.RESERVATION_TIME_NOT_VALID) {
                    notificationContext.dispatch(openActionNotification("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.", "error"))
                } else {
                    //Handle error
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
    };
    const hanldeClickEvent = useCallback((slotInfo) => {
        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            const { start, end, info } = slotInfo;
            setInfoRegister({
                targetDate: moment(start).format("YYYY-MM-DD"),
                startTime: moment(start).format("HH:mm:ss"),
                endTime: moment(end).format("HH:mm:ss"),
                info,
            })
            setModeModal(MODE_REGISTER_SHEDULE.EDIT)
            setOpenModal(true)
        }, 250)

    }, [])
    const hanldeDoubleClickEvent = useCallback((slotInfo) => {
        /**
      * Notice our use of the same ref as above.
      */
        window.clearTimeout(clickRef?.current)
        clickRef.current = window.setTimeout(() => {
            console.log(slotInfo);
        }, 250)
    }, [])

    const hanldeSubmit = (slotInfo, mode = MODE_REGISTER_SHEDULE.ADD) => {
        if (slotInfo?.status === STATUS_RESERVATION.ofWeek) {
            notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch bận của tuần.", "error"))
            return
        }

        if (mode === MODE_REGISTER_SHEDULE.ADD) {
            if (moment(moment(`${slotInfo.targetDate} ${slotInfo.startTime}`, "YYYY-MM-DD HH:mm:ss")).isBefore(moment())) {
                notificationContext.dispatch(openActionNotification("Không thể đăng ký lịch học trong quá khứ.", "error"))
                return;
            }
            loadingContext.dispatch(openActionLoading())
            Reservation.addReservation(slotInfo)
                .then(response => {
                    const { code, records } = response
                    if (code === RESPONSE_CODE.SUCCESS) {
                        const slot = records[0]
                        const newEvent = {
                            start: moment(`${slot.targetDate} ${slot.startTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                            end: moment(`${slot.targetDate} ${slot.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                            title: slot?.Student?.fullname,
                            info: slot
                        }
                        notificationContext.dispatch(openActionNotification("Đăng ký lịch học thành công.", "success"))
                        setEvents([...events, newEvent])
                    } if (code === RESPONSE_CODE.RESERVATION_EXISTS) {
                        notificationContext.dispatch(openActionNotification("Giáo viên dã dạy giờ này rồi.", "error"))
                    } else if (code === RESPONSE_CODE.RESERVATION_EXISTS_USER) {
                        notificationContext.dispatch(openActionNotification("Bạn đã đăng ký giờ này rồi.", "error"))
                    } else if (code === RESPONSE_CODE.RESERVATION_TIME_NOT_VALID) {
                        notificationContext.dispatch(openActionNotification("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.", "error"))
                    } else {
                        //hanlde error
                    }
                })
                .finally(() => {
                    loadingContext.dispatch(closeActionLoading())
                })
        } else if (mode === MODE_REGISTER_SHEDULE.EDIT) {
            if (moment(moment(`${slotInfo.targetDate} ${slotInfo.startTime}`, "YYYY-MM-DD HH:mm:ss")).isBefore(moment())) {
                notificationContext.dispatch(openActionNotification("Không thể chỉnh sửa lịch đã học.", "error"))
                return;
            }
            loadingContext.dispatch(openActionLoading())
            Reservation.updateReservation(slotInfo)
                .then(response => {
                    const { code, records } = response
                    if (code === RESPONSE_CODE.SUCCESS) {
                        const slot = records[0]
                        const indexEventEdit = events.findIndex(event => event.info?.id === slot.id)
                        const { startTime, endTime, targetDate } = slot;
                        const newEventEdit = {
                            start: moment(`${targetDate} ${startTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                            end: moment(`${targetDate} ${endTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                            // end: moment().add(1, "days").toDate(),
                            title: slot?.Student?.fullname,
                            info: slot
                        }
                        events.splice(indexEventEdit, 1, newEventEdit)
                        setEvents([...events])
                        notificationContext.dispatch(openActionNotification("Chỉnh sửa lịch học thành công.", "success"))
                    } else if (code === RESPONSE_CODE.RESERVATION_EXISTS) {
                        notificationContext.dispatch(openActionNotification("Giáo viên dã dạy giờ này rồi.", "error"))
                    } else if (code === RESPONSE_CODE.RESERVATION_EXISTS_USER) {
                        notificationContext.dispatch(openActionNotification("Bạn đã đăng ký giờ này rồi.", "error"))
                    } else if (code === RESPONSE_CODE.RESERVATION_TIME_NOT_VALID) {
                        notificationContext.dispatch(openActionNotification("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.", "error"))
                    } else {
                        //Handle error
                    }
                })
                .finally(() => {
                    loadingContext.dispatch(closeActionLoading())
                })
        } else if (mode === MODE_REGISTER_SHEDULE.DELETE) {
            if (moment(moment(`${slotInfo.targetDate} ${slotInfo.startTime}`, "YYYY-MM-DD HH:mm:ss")).isBefore(moment())) {
                notificationContext.dispatch(openActionNotification("Không thể xóa lịch đã học.", "error"))
                return;
            }
            const reservationIds = [slotInfo.id]
            loadingContext.dispatch(openActionLoading())
            Reservation.deleteReservations(reservationIds)
                .then(response => {
                    const { code } = response
                    if (code === RESPONSE_CODE.SUCCESS) {
                        const indexEventDelete = events.findIndex(event => event.info.id === slotInfo.id)
                        events.splice(indexEventDelete, 1)
                        setEvents([...events])
                        notificationContext.dispatch(openActionNotification("Xóa lịch học thành công.", "success"))
                    } else {
                        //hanlde error
                    }
                })
                .finally(() => {
                    loadingContext.dispatch(closeActionLoading())
                })
        } else {
            //donothing
            notificationContext.dispatch(openActionNotification("Vui lòng thử lại sau.", "error"))
        }
        setModeModal(MODE_REGISTER_SHEDULE.ADD);
        setOpenModal(false)
    }
    const handleRangeChange = async (range, type, first = false) => {
        const mode = type || modeCalendar;
        let startDate = null;
        let endDate = null;
        if (first) {
            startDate = moment(range[0]).format("YYYY-MM-DD");
            endDate = moment(range[1]).format("YYYY-MM-DD");
        } else if (mode === "day") {
            startDate = moment(range[0]).format("YYYY-MM-DD");
            endDate = moment(range[0]).format("YYYY-MM-DD");
        } else if (mode === "month") {
            startDate = moment(range.start).format("YYYY-MM-DD");
            endDate = moment(range.end).format("YYYY-MM-DD");
        } else if (mode === "week") {
            startDate = moment(range[0]).format("YYYY-MM-DD");
            endDate = moment(range[6]).format("YYYY-MM-DD");
        } else if (mode === "work_week") {
            startDate = moment(range[0]).format("YYYY-MM-DD");
            endDate = moment(range[4]).format("YYYY-MM-DD");
        } else if (mode === "agenda") {
            startDate = moment(range.start).format("YYYY-MM-DD");
            endDate = moment(range.end).format("YYYY-MM-DD");
        } else {
            //donothing
        }
        const searchOption = {
            limit: 1000000 || PER_PAGE,
            page: 1
        };
        const seacherModel = {
            targetDate: {
                $between: [startDate, endDate]
            },
        };
        const isStudent = _user.Roles.some(r => r.id === ROLE.student)
        if (calendarOf.isMe && isStudent) {
            seacherModel.studentId = calendarOf.id
        } else {
            seacherModel.teacherId = calendarOf.id
        }
        loadingContext.dispatch(openActionLoading())
        const newEvents = await Reservation.getReservations(
            searchOption,
            seacherModel
        )
            .then(response => {
                const { code, records } = response;
                if (code === RESPONSE_CODE.SUCCESS) {
                    return records.map(rc => ({
                        title: rc?.Student?.fullname,
                        start: moment(`${rc.targetDate} ${rc.startTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                        end: moment(`${rc.targetDate} ${rc.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate(),
                        info: rc
                    }))
                }
                return []
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
        setTargetDateRange([moment(startDate, "YYYY-MM-DD").toDate(), moment(endDate, "YYYY-MM-DD").toDate()]);
        setEvents(newEvents)
    }
    const handleShoreMore = (events, date) => {
        setTimeout(() => {
            const targetDate = document.querySelector(".rbc-overlay .rbc-overlay-header");
            targetDate.removeEventListener("click", () => { })
            targetDate.style.cursor = "pointer"
            targetDate.addEventListener("click", (e) => {
                setModeCalendar("day")
                localStorage.setItem("calendar_type", "day")
                setTargetDate(moment(date).toDate())
            })
        }, 250)
    }
    const handleNavigate = (datas) => {
        setTargetDate(moment(datas).toDate())
    }
    const handleChangeCalendarOf = (calendarOf) => {
        setCalendarOf(calendarOf)
    }

    const Component = isMobile ? Calendar : DnDCalendar;
    return <div>
        <div style={{ padding: "10px 0px", display: "flex" }}>
            <CalenderOf style={{ flex: 1, width: 250 }} onChange={handleChangeCalendarOf} />
            <Busy search={search} calendarOf={calendarOf} />
        </div>
        <Component
            formats={{
                eventTimeRangeFormat: () => {
                    return "";
                },
            }}
            defaultDate={moment().toDate()}
            date={targetDate}
            resizable
            selectable
            messages={{
                agenda: "Lịch trình",
                allDay: "Tất cả các ngày",
                date: "Ngày",
                day: "Ngày",
                event: "Sự kiện",
                month: "Tháng",
                next: "Tiếp",
                noEventsInRange: "Không có sự kiện nào",
                previous: "Trước",
                showMore: (total) => {
                    return !!isMobile ? `+ (${total})` : `+ (${total}) sự kiện`
                },
                time: "Thời gian",
                today: "Hôm nay",
                tomorrow: "Ngày mai",
                week: "Tuần",
                work_week: "Ngày làm việc",
                yesterday: "Ngày hôm qua"
            }}
            longPressThreshold={250}
            defaultView="day"
            view={modeCalendar}
            views={["day", "week", "month"]}
            events={events}
            localizer={localizer}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            onSelectSlot={handleEventSelectSlot}
            // onSelecting={handleEnventSelecting}
            onSelectEvent={hanldeClickEvent}
            // onDoubleClickEvent={hanldeDoubleClickEvent}
            onRangeChange={handleRangeChange}
            // onDoubleClickEvent={e => { console.log("Double Click Event", e) }}
            // onDragStart={e => { console.log("Drag start", e) }}
            // onDrillDown={e => { console.log("Drill Down", e) }}
            // onDragOver={e => { console.log("Drag over", e) }}
            // onDropFromOutside={e => { console.log("Drop From Outside", e) }} //kéo ở ngoài vào
            // onKeyPressEvent={e => { console.log("Key Press Event", e) }}
            onNavigate={handleNavigate}
            onShowMore={handleShoreMore}
            onView={mode => {
                setModeCalendar(() => mode)
                localStorage.setItem("calendar_type", mode)
            }}
            style={{ height: "100vh" }}
            popup // show popup or deirect to day this
            // dayLayoutAlgorithm="overlap"
            // dayPropGetter={(date) => {
            //     console.log("dayPropGetter: ", date);
            //     return { className: "", style: {} }
            // }}
            // elementProps={{}} //prop to main div canlender
            eventPropGetter={(event, start, end, isSelected) => {
                const { info } = event;
                if (info.status === STATUS_RESERVATION.special) {
                    if (moment(start).isBefore(moment())) {
                        return {
                            className: "cell-hover",
                            style: {
                                backgroundColor: "#eb7867",
                                color: "white"
                            }
                        }
                    }
                    return {
                        className: "cell-hover",
                        style: {
                            backgroundColor: "#e85e4a",
                            color: "white"
                        }
                    }
                }
                if (info.status === STATUS_RESERVATION.ofWeek) {
                    return {
                        className: "cell-hover",
                        style: {
                            backgroundColor: "#e03b24",
                            color: "white"
                        }
                    }
                }
                if (!(info.studentId === _user.id || calendarOf.isMe)) {
                    return {
                        className: "cell-hover",
                        style: {
                            backgroundColor: "#687477",
                            color: "white"
                        }
                    }
                } else {
                    if (moment(start).isBefore(moment())) {
                        return {
                            className: "cell-hover",
                            style: {
                                backgroundColor: "#87a2c7",
                                color: "white"
                            }
                        }
                    }
                    return {
                        className: "cell-hover",
                        style: {
                        }
                    }
                }
            }}
            components={
                {
                    day: {
                        event: events => {
                            const { info } = events.event;
                            return <>{events.title} ({info?.VehicleType?.name})</>
                        }
                    },
                    week: {
                        event: events => {
                            const { info } = events.event;
                            const { startTime, endTime } = info;
                            return isMobile ? <div style={{ fontSize: 12 }}>{startTime.slice(3, 5)}<br />{endTime.slice(3, 5)} </div>
                                : <div style={{ fontSize: 14 }}>{startTime.slice(0, 5)}-{endTime.slice(0, 5)} ({info?.VehicleType?.name})</div>;
                        }
                    },
                    month: {
                        event: events => {
                            const { info } = events.event;
                            const { startTime, endTime } = info;
                            return isMobile ? <div style={{ fontSize: 10 }}>{startTime.slice(0, 5)}-{endTime.slice(0, 5)} ({info?.VehicleType?.name})</div>
                                : <div style={{ fontSize: 12 }}>{startTime.slice(0, 5)}-{endTime.slice(0, 5)} ({info?.VehicleType?.name})</div>;
                        },
                    },
                    work_week: {
                        event: events => {
                            return isMobile ? <></> : events.title;
                        },
                    },
                    agenda: {
                        event: event => {
                            return <div>{event.title}</div>
                        }
                    },
                }
            }
        //step //Determines the selectable time increments in week and day views
        //timeslots //step khi chon
        />
        <Modal
            open={openModal}
            onClose={() => {
                setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"

        >
            <Box sx={style} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => setOpenModal(false)}
                >
                    <ClearIcon />
                </div>
                <Register
                    targetDate={infoRegister.targetDate}
                    startTime={infoRegister.startTime}
                    endTime={infoRegister.endTime}
                    info={infoRegister.info}
                    calendarOf={calendarOf}
                    mode={modeModal}
                    onSumit={hanldeSubmit}
                />
            </Box>
        </Modal>
    </div>
}
export default CustomCalendar  