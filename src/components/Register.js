
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import moment from 'moment';
import { useContext, useState } from 'react';
import { MODE_REGISTER_SHEDULE, ROLE } from '../common';
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
    const notificationContext = useContext(NotificationContext);

    const roleIds = _user.Roles.map(r => r.id);
    const handleSumit = (mode) => {
        if (!teacherId) {
            notificationContext.dispatch(openActionNotification("Giáo viên không được bỏ trống.", "error"))
            return
        }
        if (!vehicleTypeId) {
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
        if (!studentId && roleIds.some(id => id === ROLE.admin || id === ROLE.teacher || id === ROLE.teacher_vip)) {
            notificationContext.dispatch(openActionNotification("Học viên không được bỏ trống.", "error"))
            return
        }
        //handle before summit
        onSumit({
            ...info,
            teacherId,
            vehicleTypeId,
            targetDate,
            startTime,
            endTime,
            studentId: mode === MODE_REGISTER_SHEDULE.ADD ? studentId || _user.id : studentId
        }, mode)
    }
    const disabled = !calendarOf?.isMe && mode === MODE_REGISTER_SHEDULE.EDIT && info.studentId !== _user.id;

    return (
        <div style={{ paddingBottom: 20, width: "100%", paddingRight: -8 }}>
            <div className="container-title">
                {mode === MODE_REGISTER_SHEDULE.ADD ?
                    <h2>ĐĂNG KÝ LỊCH HỌC</h2>
                    :
                    <h2>THÔNG TIN LỊCH HỌC</h2>
                }
            </div>
            <div
                className="container-type"
                style={{ overflowY: "overlay", maxHeight: "calc(92vh - 96px)", height: "100%", width: "100%", paddingRight: 8 }}
            >
                <TeacherAutocomplete
                    studentId={roleIds.includes(ROLE.student) ? _user.id : undefined}
                    disabled={disabled || roleIds.some(id => id === ROLE.teacher || id === ROLE.teacher_vip)}
                    onChange={teacherId => setTeacherId(teacherId)}
                    value={teacherId}
                />
                <VehicleTypeAutocomplete
                    disabled={disabled || !teacherId}
                    teacherId={teacherId}
                    onChange={vehicleTypeId => setVehicleTypeId(vehicleTypeId)}
                    vehicleTypeId={vehicleTypeId}
                />
                {roleIds.some(id => id === ROLE.admin || id === ROLE.teacher || id === ROLE.teacher_vip) &&
                    <StudentAutocomplete
                        disabled={disabled}
                        teacherId={teacherId}
                        onChange={value => setStudentId(value)}
                        value={studentId}
                    />
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
                            value={moment(endTime || moment().format("HH:mm:ss"), "HH:mm:ss").toDate()}
                            onChange={newValue => {
                                setEndTime(moment(newValue.$d).format("HH:mm:ss"))
                            }}
                        />
                    </LocalizationProvider>
                </div>
                <div className="container-car-type container-car-location">
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
