import ClearIcon from '@mui/icons-material/Clear';
import { Box, Button, Checkbox, FormControlLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import moment from "moment";
import 'moment/locale/vi';
import { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { isMobile } from "react-device-detect";
import { RESPONSE_CODE, ROLE, STATUS_SPECIFIC_SCHEDULE, TYPEOF_SPECIFIC_SCHEDULE } from "../../common";
import { closeActionLoading, LoadingContext, openActionLoading } from "../../reducer/loading";
import { NotificationContext, openActionNotification } from "../../reducer/notification";
import { TeacherHour } from "../../services";
import { getUser } from '../../utils';
import TeacherAutocomplete from "../Controls/Teacher/TeacherAutocomplete";
moment.locale("vi");
const localizer = momentLocalizer(moment);
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
    minWidth: isMobile ? "386px" : "600px",
    overflowY: "hidden"
};
const styleDetail = {
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
}
const CONST_DATE = "2023-01-23"
const handleResponseData = (data) => {
    return data.reduce((pre, cur, index) => {
        pre.push(...cur.reduce((pre, cur) => {
            pre.push({
                start: moment(`${CONST_DATE} ${cur.startTime}`, "YYYY-MM-DD HH:mm:ss").add(index ? index - 1 : 6, "day").toDate(),
                end: moment(`${CONST_DATE} ${cur.endTime}`, "YYYY-MM-DD HH:mm:ss").add(index ? index - 1 : 6, "day").toDate(),
                info: {
                    ...cur
                }
            })
            return pre
        }, []))
        return pre
    }, [])
}
const Busy = ({ calendarOf, search, ...props }) => {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [dataModalDetail, setDataModalDetail] = useState()
    const [typeOf, setTypeOf] = useState(TYPEOF_SPECIFIC_SCHEDULE.BUSY)
    const [used, setUsed] = useState(STATUS_SPECIFIC_SCHEDULE.used)
    const [data, setData] = useState({
        hours: []
    })
    const roleIds = _user.Roles.map(r => r.id);
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);

    const handleClickOpenBusy = () => {
        loadingContext.dispatch(openActionLoading())
        const searchOption = {
            limit: 1,
            page: 1
        };
        const searchModel = {
            // status: STATUS_SPECIFIC_SCHEDULE.used,
            createdBy: calendarOf.id
        }
        TeacherHour.getTeacherHour(searchOption, searchModel)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    if (records?.length > 0) {
                        const data = records[0]
                        let hours = []
                        try {
                            hours = handleResponseData(data.hours)
                        } catch (error) {
                            hours = handleResponseData(JSON.parse(data.hours))
                        }
                        delete data.hours
                        setData({
                            ...data,
                            hours
                        })
                        setTypeOf(data.typeOf)
                        setUsed(data.status)
                    } else {
                        setData({
                            ...data,
                            hours: []
                        })
                    }
                } else {
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau.", "error"))
                }
                setOpenModal(true);
            }).finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
    }
    const handleClickEvent = (event) => {
        setDataModalDetail(event)
        setOpenModalDetail(true)
    }
    const handleSelectSlot = (slotInfo) => {
        let { start, end } = slotInfo;
        const startTime = moment(start)
        const endTime = moment(end)
        const oldEvent = data.hours.find(event => {
            const oldStartTime = moment(event.start);
            const oldEndTime = moment(event.end);
            return !((oldEndTime.isSameOrBefore(startTime)) || oldStartTime.isSameOrAfter(endTime))
        })
        if (oldEvent) {
            notificationContext.dispatch(openActionNotification("Lịch đăng ký bị trùng.", "error"))
            return;
        }
        setData({
            ...data,
            hours: [
                ...data.hours,
                {
                    ...slotInfo,
                    info: {
                        targetDate: startTime.format("YYYY-MM-DD"),
                        startTime: startTime.format("HH:mm:ss"),
                        endTime: endTime.format("HH:mm:ss"),
                    }
                }],
        })
    }
    const handleSubmit = () => {
        loadingContext.dispatch(openActionLoading())
        const initHours = [[], [], [], [], [], [], []]; // index 0 sunday, 1 monday,...
        const hours = data.hours.reduce((pre, cur) => {
            const date = moment(cur.start);
            const startTime = moment(cur.start).format("HH:mm:ss");
            const endTime = moment(cur.end).format("HH:mm:ss");
            const index = date.day()
            pre[index].push({
                startTime,
                endTime,
                reason: cur?.info?.reason
            })
            return pre
        }, initHours)
        const dataSubmit = {
            ...data,
            typeOf: typeOf,
            status: used,
            hours: hours,
        }
        const action = !!dataSubmit.id ? "updateTeacherHour" : "creaTeacherHour";
        TeacherHour[action](dataSubmit).then(response => {
            const { code, records } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                if (records?.length > 0) {
                    const data = records[0]
                    let hours = []
                    try {
                        hours = handleResponseData(data.hours)
                    } catch (error) {
                        hours = handleResponseData(JSON.parse(data.hours))
                    }
                    delete data.hours
                    setData({
                        ...data,
                        hours
                    })
                    setTypeOf(data.typeOf)
                    setUsed(data.status)
                    setOpenModal(false)
                    search()
                    notificationContext.dispatch(openActionNotification("Lưu thành công.", "success"))
                } else {
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau.", "error"))
                }
            } else {
                notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau.", "error"))
            }
        }).finally(() => {
            loadingContext.dispatch(closeActionLoading())
        })
    }
    const handleDeleteDetail = () => {
        const { start, end } = dataModalDetail;
        setData({
            ...data,
            hours: data.hours.filter(hour => !(hour.start === start && hour.end === end))
        })
        setOpenModalDetail(false)
        setDataModalDetail(undefined)
    }
    const handleUpdatedDetail = () => {
        const { start, end, info } = dataModalDetail;
        const day = moment(start).format("YYYY-MM-DD")
        const newStart = moment(`${day} ${info.startTime}`, "YYYY-MM-DD HH:mm:ss").toDate()
        const newEnd = moment(`${day} ${info.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate()
        const index = data.hours.findIndex(hour => hour.start === start && hour.end === end)
        dataModalDetail.start = newStart
        dataModalDetail.end = newEnd
        data.hours.splice(index, 1, dataModalDetail)
        setData({
            ...data,
            hours: [...data.hours]
        })
        setOpenModalDetail(false)
    }
    return <>
        <Button
            hidden={roleIds.includes(ROLE.student) && calendarOf.isMe}
            onClick={handleClickOpenBusy}
            variant='contained' style={{ fontSize: isMobile ? 12 : 16, padding: isMobile ? "2px 4px" : "6px 16px" }}>LỊCH TUẦN</Button>
        <Modal
            open={openModal}
            onClose={() => {
                setOpenModal(false);
            }}
        >
            <Box sx={style} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => {
                        setOpenModal(false)
                    }}
                >
                    <ClearIcon />
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }} className="container-title" >
                    <h2 style={{ fontSize: 18 }}>LỊCH {typeOf === TYPEOF_SPECIFIC_SCHEDULE.BUSY ? "BẬN" : "RẢNH"} HÀNG TUẦN</h2>
                    <div style={{ marginTop: -6, marginLeft: 4 }}>
                        (<FormControlLabel
                            onChange={(e, value) => setUsed(value)}
                            style={{ marginLeft: 0 }}
                            labelPlacement="start"
                            control={<Checkbox checked={!!used} size="small" style={{ marginLeft: -6 }} />}
                            label={<span style={{ fontWeight: 600 }}>SỬ DỤNG</span>}
                        />)
                    </div>
                </div>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    value={typeOf}
                    style={{ display: "flex", justifyContent: "center", flexDirection: "row", marginTop: -8 }}
                    onChange={(e, type) => { setTypeOf(Number.parseInt(type)) }}
                >
                    <FormControlLabel
                        labelPlacement="start"
                        value={TYPEOF_SPECIFIC_SCHEDULE.BUSY}
                        control={<Radio size="small" style={{ marginLeft: -6 }} />}
                        label="Lịch bận"
                    />
                    <FormControlLabel
                        value={TYPEOF_SPECIFIC_SCHEDULE.UNBUSY}
                        labelPlacement="start"
                        control={<Radio size="small" style={{ marginLeft: -6 }} />}
                        label="Lịch rảnh"
                    />
                </RadioGroup>
                <div style={{ overflowY: "overlay", maxHeight: "calc(92vh - 96px)", height: "100%", width: "100%", paddingRight: 8 }}>
                    <Calendar
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
                            yesterday: "Ngày hôm qua",
                        }}
                        defaultDate={moment(CONST_DATE, "YYYY-MM-DD")}
                        onSelectEvent={handleClickEvent}
                        style={{ height: "calc(92vh - 162px)", width: "100%" }}
                        eventPropGetter={(event, start, end, isSelected) => {
                            if (!used) {
                                return {
                                    className: "cell-hover",
                                    style: {
                                        backgroundColor: "#687477",
                                        color: "white"
                                    }
                                }
                            }
                            if (typeOf === TYPEOF_SPECIFIC_SCHEDULE.BUSY) {
                                return {
                                    className: "cell-hover",
                                    style: {
                                        backgroundColor: "#e03b24",
                                        color: "white"
                                    }
                                }
                            } else {
                                return {
                                    className: "cell-hover",
                                    style: {
                                        backgroundColor: "#64a338",
                                        color: "white"
                                    }
                                }
                            }
                        }}
                        events={data.hours}
                        components={{
                            week: {
                                event: (event) => {
                                    const { info } = event.event;
                                    const { startTime, endTime } = info;
                                    return <div style={{ fontSize: 12 }}>{startTime.slice(3, 5)}<br />{endTime.slice(3, 5)}</div>
                                },
                                header: (info) => {
                                    const title = info.label.split(" ")[1];
                                    return title
                                }
                            }
                        }}
                        formats={{
                            eventTimeRangeFormat: () => {
                                return "";
                            },
                        }}
                        onSelectSlot={handleSelectSlot}
                        defaultView="week"
                        views={["week"]}
                        selectable
                        localizer={localizer}
                        toolbar={false}
                    // step={60}
                    />
                    <div style={{ textAlign: "right", padding: "10px" }}>
                        <Button onClick={() => setOpenModal(false)} variant="contained" disableElevation>
                            Quay lại
                        </Button>

                        {
                            calendarOf.isMe &&
                            <>
                                <span style={{ padding: 4 }} />
                                <Button onClick={() => setData({ ...data, hours: [] })} variant="contained" disableElevation>
                                    Xóa hết
                                </Button>
                                <span style={{ padding: 4 }} />
                                <Button onClick={() => handleSubmit()} variant="contained" disableElevation>
                                    Lưu
                                </Button>
                            </>
                        }
                    </div>
                </div>
            </Box>
        </Modal>
        <Modal
            open={openModalDetail}
            onClose={() => {
                setOpenModalDetail(false);
                setDataModalDetail(undefined)
            }}
        >
            <Box sx={styleDetail} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => {
                        setOpenModalDetail(false)
                        setDataModalDetail(undefined)
                    }}
                >
                    <ClearIcon />
                </div>
                <div className="container-title" style={{ fontSize: 20 }}>
                    <h2>CHI TIẾT LỊCH {typeOf === TYPEOF_SPECIFIC_SCHEDULE.BUSY ? "BẬN" : "RẢNH"} </h2>
                </div>
                <div style={{ overflowY: "overlay", maxHeight: "calc(92vh - 96px)", height: "100%", width: "100%", paddingRight: 8 }}>
                    <TeacherAutocomplete
                        disabled={true}
                        onChange={() => { }}
                        value={calendarOf.id}
                    />
                    <div className="container-car-type container-car-location">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                                className="time-input"
                                label="Giờ bắt đầu"
                                renderInput={(params) => <TextField
                                    size='small'
                                    {...params} />}
                                value={moment(dataModalDetail?.info.startTime, "HH:mm:ss").toDate()}
                                onChange={newValue => {
                                    setDataModalDetail({
                                        ...dataModalDetail,
                                        info: {
                                            ...dataModalDetail.info,
                                            startTime: moment(newValue.$d).format("HH:mm:ss")
                                        }
                                    })
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="container-car-type container-car-location">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <MobileTimePicker
                                className="time-input"
                                label="Giờ kết thúc"
                                renderInput={(params) => <TextField
                                    size='small'
                                    {...params} />}
                                value={moment(dataModalDetail?.info.endTime, "HH:mm:ss").toDate()}
                                onChange={newValue => {
                                    setDataModalDetail({
                                        ...dataModalDetail,
                                        info: {
                                            ...dataModalDetail.info,
                                            endTime: moment(newValue.$d).format("HH:mm:ss")
                                        }
                                    })
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="container-car-type container-car-location">
                        <TextField
                            fullWidth
                            id="name"
                            placeholder="Lý do bận"
                            variant="outlined"
                            size="small"
                            label="Lý do bận"
                            value={dataModalDetail?.info?.reason}
                            onChange={event => {
                                setDataModalDetail({
                                    ...dataModalDetail,
                                    info: {
                                        ...dataModalDetail.info,
                                        reason: event.nativeEvent.target.value
                                    }
                                })
                            }}
                            InputProps={{
                                startAdornment: (
                                    <></>
                                ),
                            }}
                        />
                    </div>
                    {
                        calendarOf.isMe &&
                        <div style={{ textAlign: "right", padding: "10px 20px" }}>
                            <Button onClick={() => handleDeleteDetail()} variant="contained" disableElevation>
                                Xóa
                            </Button>
                            <span style={{ padding: 4 }} />
                            <Button onClick={() => handleUpdatedDetail()} variant="contained" disableElevation>
                                Lưu
                            </Button>
                        </div>
                    }
                </div>
            </Box>
        </Modal>
    </>
}

export default Busy