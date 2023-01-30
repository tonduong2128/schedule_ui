
import ClearIcon from '@mui/icons-material/Clear';
import { Box, InputAdornment, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { memo, useContext, useState } from 'react';
import { PASSWORD_DEFAULT, RESPONSE_CODE, ROLE } from '../../common';
import TeacherAutocomplete from '../../components/Controls/Teacher/TeacherAutocomplete';
import UserStatus from '../../components/Controls/User/UserStatus';
import { UserTypeAutocomplete } from '../../components/Controls/UserType';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { User } from '../../services';
import { getUser } from '../../utils';
import DateRangeIcon from '@mui/icons-material/DateRange';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { TextFieldCustom } from '../../components/Custom';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
    overflowY: "hidden",
};

function ProfilePage({
    selectModel = [],
    search,
    ...props
}) {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState({
        username: "",
        fullname: "",
        password: PASSWORD_DEFAULT,//default
        phone: "",
        email: "",
        status: 1,
        User_Roles: [],
        Students_Teacher: [],
    });
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);

    const roleIds = _user.Roles.map(r => r.id);
    const handleSumit = () => {
        if (roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher)) {
            user.Students_Teacher = [_user.id]
        }
        if (!user.fullname) {
            notificationContext.dispatch(openActionNotification("Họ và tên không được bỏ trống.", "error"))
            return
        }
        if (!user.phone) {
            notificationContext.dispatch(openActionNotification("Số điện thoại không được bỏ trống.", "error"))
            return
        }
        user.User_Roles = user.User_Roles.map(id => ({
            roleId: id,
            createdBy: _user.id
        }))
        user.Students_Teacher = user.Students_Teacher.map(id => ({
            teacherId: id,
            createdBy: _user.id
        }))
        loadingContext.dispatch(openActionLoading())
        User.updateUser(user)
            .then(response => {
                const { code } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setOpenModal(false)
                    notificationContext.dispatch(openActionNotification("Lưu thành công.", "success"))
                } else {
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
    }
    const handleBeforeShow = async () => {
        loadingContext.dispatch(openActionLoading())
        const response = await User.getUserById(_user.id)
        loadingContext.dispatch(closeActionLoading())
        const { code, records } = response
        if (code === RESPONSE_CODE.SUCCESS) {
            const user = records[0]
            user.User_Roles = user.User_Roles.map(ur => ur.roleId)
            user.Students_Teacher = user.Students_Teacher.map(ur => ur.teacherId)
            setUser(user)
            setOpenModal(true)
        } else {
        }

    }
    return (<div style={{
        width: "100%",
        height: "100%",
    }}>
        <div style={{
            fontWeight: "400",
            fontSize: "16px",
            width: "100%",
            height: "100%",
            color: "#000",
            lineHeight: 1.5,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif ',
            letterSpacing: "0.00938em",
            padding: "6px 16px"
        }} onClick={() => handleBeforeShow()}>
            Tài khoản của tôi
        </div>
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
                <div style={{ paddingBottom: 20, width: "100%" }}>
                    <div className="container-title">
                        <h2>TÀI KHOẢN CỦA TÔI</h2>
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
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                disabled
                                fullWidth
                                id="username"
                                placeholder="Tên đăng nhập"
                                variant="outlined"
                                size="small"
                                label="Tên đăng nhập"
                                value={user.username}
                                onChange={event => {
                                    setUser({
                                        ...user,
                                        username: event.nativeEvent.target.value?.replace(/ /g, "")
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <UserTypeAutocomplete
                                disabled
                                label="Loại người dùng"
                                onChange={value => {
                                    setUser({
                                        ...user,
                                        User_Roles: [value]
                                    })
                                }}
                                value={user.User_Roles?.[0]}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                                <DatePicker
                                    disabled
                                    className="date-input"
                                    label={roleIds.includes(ROLE.admin) ? "Vô thời hạn" : "Ngày hết hạn"}
                                    renderInput={(params) => <TextField
                                        size='small'
                                        {...params} />}
                                    inputFormat="DD/MM/YYYY"
                                    value={moment(user.dateExpired, "YYYY-MM-DD").toDate()}
                                    onChange={() => { }}
                                />
                            </LocalizationProvider>
                        </div>
                        {
                            user.User_Roles?.[0] === ROLE.student &&
                            <div className="container-car-type container-car-location">
                                <TeacherAutocomplete
                                    disabled
                                    size='small'
                                    onChange={value => {
                                        setUser({
                                            ...user,
                                            Students_Teacher: [value]
                                        })
                                    }}
                                    value={user.Students_Teacher?.[0]}
                                />
                            </div>
                        }
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                fullWidth
                                id="fullname"
                                placeholder="Họ và tên"
                                variant="outlined"
                                size="small"
                                label="Họ và tên"
                                value={user.fullname}
                                onChange={event => {
                                    setUser({
                                        ...user,
                                        fullname: event.nativeEvent.target.value?.trimStart()
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                fullWidth
                                id="phone"
                                placeholder="Số điện thoại"
                                variant="outlined"
                                size="small"
                                label="Số điện thoại"
                                value={user.phone}
                                onChange={event => {
                                    setUser({
                                        ...user,
                                        phone: event.nativeEvent.target.value?.replace(/ /g, "")
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                fullWidth
                                id="email"
                                placeholder="Email"
                                variant="outlined"
                                size="small"
                                label="Email"
                                value={user.email || null}
                                onChange={event => {
                                    setUser({
                                        ...user,
                                        email: event.nativeEvent.target.value?.replace(/ /g, "")
                                    })
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <UserStatus
                                disabled
                                label="Trạng thái"
                                value={user.status}
                                onChange={value => {
                                    setUser({
                                        ...user,
                                        status: value
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                fullWidth
                                disabled
                                id="createdDate"
                                placeholder="Ngày tạo"
                                variant="outlined"
                                size="small"
                                label="Ngày tạo"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment style={{ marginLeft: -8 }} position="start">
                                            <DateRangeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={user?.createdDate ? moment(user?.createdDate).format("DD/MM/YYYY HH:mm") : ""}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
                                fullWidth
                                disabled
                                id="updatedDate"
                                placeholder="Ngày cập nhập"
                                variant="outlined"
                                size="small"
                                label="Ngày cập nhập"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment style={{ marginLeft: -8 }} position="start">
                                            <DateRangeIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={user?.updatedDate ? moment(user?.updatedDate).format("DD/MM/YYYY HH:mm") : ""}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <Link to="change-password">
                                <Button style={{ fontSize: 12 }} variant="contained" disableElevation>
                                    Đổi mật khẩu
                                </Button>
                            </Link>
                            <Button style={{ fontSize: 12, marginLeft: 10 }} onClick={() => handleSumit()} variant="contained" disableElevation>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div >
            </Box>
        </Modal>
    </div>)
}
export default memo(ProfilePage)
