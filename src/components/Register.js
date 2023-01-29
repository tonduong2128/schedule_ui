
import { Checkbox, FormControlLabel } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import moment from 'moment';
import { useContext, useState } from 'react';
import { MODE_REGISTER_SHEDULE, ROLE, STATUS_RESERVATION } from '../common';
import { NotificationContext, openActionNotification } from '../reducer/notification';
import { getUser } from '../utils';
import { StudentAutocomplete } from './Controls/Student';
import TeacherAutocomplete from './Controls/Teacher/TeacherAutocomplete';
import VehicleTypeAutocomplete from './Controls/VehicleType/VehicleTypeAutocomplete';
function Register({
    startTime: _startTime,
    endTime: _endTime,
    targetDate: _targetDate,
    onSumit,
    info = {},
    mode = MODE_REGISTER_SHEDULE.ADD,
    calendarOf,
    ...props
}) {
    const _user = getUser()
    const [teacherId, setTeacherId] = useState(info.teacherId || calendarOf.id);
    const [studentId, setStudentId] = useState(info?.studentId || 0);
    const [vehicleTypeId, setVehicleTypeId] = useState(info.vehicleTypeId);
    const [targetDate, setTargetDate] = useState(_targetDate);
    const [startTime, setStartTime] = useState(_startTime);
    const [endTime, setEndTime] = useState(_endTime);
    const [reason, setReason] = useState(info.reason);
    const roleIds = _user.Roles.map(r => r.id);
    const [isBusy, setIsBusy] = useState(info?.status === STATUS_RESERVATION.ofWeek
        || info?.status === STATUS_RESERVATION.special
        || (mode === MODE_REGISTER_SHEDULE.ADD && roleIds.some(id => id === ROLE.teacher || id === ROLE.teacher_vip)));
    const notificationContext = useContext(NotificationContext);

    const handleSumit = (mode) => {
        if (!teacherId) {
            notificationContext.dispatch(openActionNotification("Giáo viên không được bỏ trống.", "error"))
            return
        }
        if (!vehicleTypeId && !isBusy) {
            notificationContext.dispatch(openActionNotification("Loại xe không được bỏ trống.", "error"))
            return
        }
        if (!targetDate) {
            notificationContext.dispatch(openActionNotification("Ngày học không được bỏ trống.", "error"))
            return
        }
        if (!startTime) {
            notificationContext.dispatch(openActionNotification("Giờ bắt đầu không được bỏ trống.", "error"))
            return
        }
        if (!endTime) {
            notificationContext.dispatch(openActionNotification("Giờ kết thúc không được bỏ trống.", "error"))
            return
        }
        if (startTime >= endTime) {
            notificationContext.dispatch(openActionNotification("Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc.", "error"))
            return
        }
        if (!studentId && !isBusy && roleIds.some(id => id === ROLE.admin || id === ROLE.teacher || id === ROLE.teacher_vip)) {
            notificationContext.dispatch(openActionNotification("Học viên không được bỏ trống.", "error"))
            return
        }
        if (isBusy) {
            console.log("Handle data before sumit");
        }
        onSumit({
            ...info,
            teacherId,
            vehicleTypeId,
            targetDate,
            startTime,
            endTime,
            reason,
            status: !info?.id && (mode === MODE_REGISTER_SHEDULE.EDIT ||
                mode === MODE_REGISTER_SHEDULE.DELETE) ? STATUS_RESERVATION.ofWeek :
                (isBusy ? STATUS_RESERVATION.special : STATUS_RESERVATION.new),
            studentId: isBusy ? _user.id : (mode === MODE_REGISTER_SHEDULE.ADD ? studentId || _user.id : studentId),
        }, mode)
    }
    const disabled = !calendarOf?.isMe && mode === MODE_REGISTER_SHEDULE.EDIT && info.studentId !== _user.id;
    return (
        <div style={{ paddingBottom: 20, width: "100%", paddingRight: -8 }}>
            <div className="container-title">
                {mode === MODE_REGISTER_SHEDULE.ADD ?
                    <h2>ĐĂNG KÝ LỊCH HỌC</h2>
                    :
                    <h2>THÔNG TIN {info?.status === STATUS_RESERVATION.ofWeek || info?.status === STATUS_RESERVATION.special ? "LỊCH BẬN" : "LỊCH HỌC"}</h2>
                }
            </div>
            <div
                className="container-type"
                style={{
                    overflowY: "overlay",
                    maxHeight: "calc(92vh - 96px)",
                    height: "100%",
                    width: "100%",
                    paddingRight: 10,
                    marginRight: -10,
                }}
            >
                {
                    roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher) && calendarOf?.isMe &&
                    <div className="container-car-type container-car-location" style={{ marginTop: 0, marginBottom: -16 }}>
                        <FormControlLabel
                            labelPlacement="start"
                            style={{ marginLeft: 0 }}
                            control={<Checkbox size="small" />}
                            label="Lịch bận"
                            checked={isBusy}
                            onChange={(e, checked) => { setIsBusy(checked) }}
                        />
                        {info?.status === STATUS_RESERVATION.ofWeek &&
                            <FormControlLabel
                                labelPlacement="start"
                                style={{ marginLeft: 0, paddingLeft: 10 }}
                                control={<Checkbox size="small" />}
                                label="Của tuần"
                                checked={info.status === STATUS_RESERVATION.ofWeek}
                            />
                        }
                    </div>
                }
                <TeacherAutocomplete
                    studentId={roleIds.includes(ROLE.student) ? _user.id : undefined}
                    disabled={disabled || roleIds.some(id => id === ROLE.teacher || id === ROLE.teacher_vip)}
                    onChange={teacherId => setTeacherId(teacherId)}
                    value={teacherId}
                />
                {!isBusy &&
                    <>
                        <VehicleTypeAutocomplete
                            disabled={disabled || !teacherId}
                            teacherId={teacherId}
                            onChange={vehicleTypeId => setVehicleTypeId(vehicleTypeId)}
                            vehicleTypeId={vehicleTypeId}
                        />
                        <StudentAutocomplete
                            disabled={disabled || roleIds.includes(ROLE.student)}
                            teacherId={teacherId}
                            onChange={value => setStudentId(value)}
                            value={studentId || _user.id}
                        />
                    </>
                }

                <div className="container-car-type container-car-location">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            disabled={disabled}
                            className="date-input"
                            label="Ngày học"
                            renderInput={(params) => <TextField
                                size='small'
                                {...params} />}
                            inputFormat="DD/MM/YYYY"
                            value={moment(targetDate, "YYYY-MM-DD")}
                            onChange={newValue => {
                                setTargetDate(moment(newValue.$d).format("YYYY-MM-DD"))
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="container-car-type container-car-location">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                            disabled={disabled}
                            className="time-input"
                            label="Giờ bắt đầu"
                            renderInput={(params) => <TextField
                                size='small'
                                {...params} />}
                            value={moment(startTime || moment().format("HH:mm:ss"), "HH:mm:ss").toDate()}
                            onChange={newValue => {
                                setStartTime(moment(newValue.$d).format("HH:mm:ss"))
                            }}
                        />
                    </LocalizationProvider>

                </div>
                <div className="container-car-type container-car-location">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                            disabled={disabled}
                            className="time-input"
                            label="Giờ kết thúc"
                            renderInput={(params) => <TextField
                                size='small'
                                {...params} />}
                            minTime={startTime ? moment(startTime, "HH:mm:ss") : null}
                            value={moment(endTime || moment().format("HH:mm:ss"), "HH:mm:ss").toDate()}
                            onChange={newValue => {
                                setEndTime(moment(newValue.$d).format("HH:mm:ss"))
                            }}
                        />
                    </LocalizationProvider>
                </div>
                {
                    isBusy && <div className="container-car-type container-car-location">
                        <TextField
                            disabled={disabled}
                            fullWidth
                            id="reason"
                            placeholder="Lý do"
                            variant="outlined"
                            size="small"
                            label="Lý do"
                            value={reason}
                            onChange={(e) => {
                                setReason(e.nativeEvent.target.value?.trimStart())
                            }}
                            InputProps={{
                                startAdornment: (
                                    <></>
                                ),
                            }}
                        />
                    </div>
                }
                <div className="container-car-type container-car-location" style={{ marginTop: 8 }}>
                    {mode === MODE_REGISTER_SHEDULE.ADD &&
                        <Button onClick={() => handleSumit(MODE_REGISTER_SHEDULE.ADD)} variant="contained" disableElevation>
                            Đăng Ký
                        </Button>
                    }
                    {mode === MODE_REGISTER_SHEDULE.EDIT && (info.studentId === _user.id
                        || roleIds.some(id => id === ROLE.teacher || id === ROLE.teacher_vip)) &&
                        <>
                            <Button onClick={() => handleSumit(MODE_REGISTER_SHEDULE.EDIT)} variant="contained" disableElevation>
                                Lưu
                            </Button>
                            <span style={{ padding: 4 }} />
                            <Button onClick={() => handleSumit(MODE_REGISTER_SHEDULE.DELETE)} variant="contained" disableElevation>
                                Xóa
                            </Button>
                        </>
                    }
                </div>
            </div>
        </div >
    )
}
export default Register
