import { Box, Button, Checkbox, FormControlLabel, Modal, TextField } from "@mui/material";
import ClearIcon from '@mui/icons-material/Clear';
import moment from "moment";
import { useContext, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { ROLE } from "../../common";
import { getUser } from "../../utils";
import "react-big-calendar/lib/css/react-big-calendar.css";
import 'moment/locale/vi';
import { isMobile } from "react-device-detect";
import { DatePicker, LocalizationProvider, MobileTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { NotificationContext } from "../../reducer/notification";
import TeacherAutocomplete from "../Controls/Teacher/TeacherAutocomplete";
import VehicleTypeAutocomplete from "../Controls/VehicleType/VehicleTypeAutocomplete";
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
const Busy = ({ teacherId, ...props }) => {
    const _user = getUser();
    const [openModal, setOpenModal] = useState(false)
    const [openModalDetail, setOpenModalDetail] = useState(false)
    const [dataModalDetail, setDataModalDetail] = useState()
    const roleIds = _user.Roles.map(r => r.id);
    const [events, setEvents] = useState([
        {
            start: moment().toDate(),
            end: moment().toDate(),
            title: "Lịch học",
            info: {
                targetDate: moment().format("YYYY-MM-DD"),
                startTime: moment().format("HH:MM:ss"),
                endTime: moment().format("HH:MM:ss"),
            }
        },
    ])
    const notificationContext = useContext(NotificationContext);

    const handleClickOpenBusy = () => {
        setOpenModal(true);
    }
    const handleClickEvent = (event) => {
        setDataModalDetail(event)
        setOpenModalDetail(true)
    }
    const handleSelectSlot = (slotInfo) => {
        let { start: startTime, end: endTime } = slotInfo;
        setEvents([
            ...events,
            {
                ...slotInfo,
                info: {
                    targetDate: moment(startTime).format("YYYY-MM-DD"),
                    startTime: moment(startTime).format("HH:MM:ss"),
                    endTime: moment(endTime).format("HH:MM:ss"),
                }
            },
        ])
    }
    return <>
        <Button
            hidden={!roleIds.some(id => id === ROLE.admin || id === ROLE.teacher || id === ROLE.teacher_vip)}
            onClick={handleClickOpenBusy}
            variant='contained'>Lịch bận</Button>
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
                <div className="container-title" >
                    <h2>LỊCH BẬN HÀNG TUẦN </h2>
                    <FormControlLabel
                        style={{ marginTop: -12 }}
                        labelPlacement="start"
                        control={<Checkbox size="small" defaultChecked />}
                        label="Sử dụng"
                    />
                </div>
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
                        onSelectEvent={handleClickEvent}
                        style={{ height: "calc(92vh - 162px)", width: "100%" }}
                        eventPropGetter={(event, start, end, isSelected) => {
                            return {
                                className: "cell-hover",
                                style: {
                                    backgroundColor: "#e03b24",
                                    color: "white"
                                }
                            }
                        }}
                        events={events}
                        components={{
                            week: {
                                header: (info) => {
                                    const title = info.label.split(" ")[1];
                                    return title
                                }
                            }
                        }}
                        onSelectSlot={handleSelectSlot}
                        defaultView="week"
                        views={["week"]}
                        selectable
                        localizer={localizer}
                        toolbar={false}
                    // step={60}
                    />
                    <div style={{ textAlign: "right", padding: "10px 20px" }}>

                        <Button onClick={() => { setOpenModal(false) }} variant="contained" disableElevation>
                            Quay lại
                        </Button>
                        <span style={{ padding: 4 }} />
                        <Button onClick={() => { }} variant="contained" disableElevation>
                            Lưu
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
        <Modal
            open={openModalDetail}
            onClose={() => {
                setOpenModalDetail(false);
            }}
        >
            <Box sx={styleDetail} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => {
                        setOpenModalDetail(false)
                    }}
                >
                    <ClearIcon />
                </div>
                <div className="container-title" style={{ fontSize: 30 }}>
                    <h2>CHI TIẾT LỊCH BẬN</h2>
                </div>
                <div style={{ overflowY: "overlay", maxHeight: "calc(92vh - 96px)", height: "100%", width: "100%", paddingRight: 8 }}>
                    <TeacherAutocomplete
                        disabled={true}
                        onChange={() => { }}
                        value={teacherId}
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
                                }}
                            />
                        </LocalizationProvider>
                    </div>
                    <div className="container-car-type container-car-location">
                        <TextField
                            fullWidth
                            id="name"
                            placeholder="Lý do"
                            variant="outlined"
                            size="small"
                            label="Lý do"
                            onChange={event => {
                            }}
                            InputProps={{
                                startAdornment: (
                                    <></>
                                ),
                            }}
                        />
                    </div>
                    <div style={{ textAlign: "right", padding: "10px 20px" }}>
                        <Button onClick={() => { setOpenModalDetail(false) }} variant="contained" disableElevation>
                            Xóa
                        </Button>
                        <span style={{ padding: 4 }} />
                        <Button onClick={() => { }} variant="contained" disableElevation>
                            Lưu
                        </Button>
                    </div>
                </div>
            </Box>
        </Modal>
    </>
}

export default Busy