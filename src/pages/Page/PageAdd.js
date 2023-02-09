import ClearIcon from '@mui/icons-material/Clear';
import { Box, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import moment from 'moment';
import React, { memo, useContext, useState } from 'react';
import { PASSWORD_DEFAULT, RESPONSE_CODE, ROLE } from '../../common';
import TeacherAutocomplete from '../../components/Controls/Teacher/TeacherAutocomplete';
import { UserTypeAutocomplete } from '../../components/Controls/UserType';
import { TextFieldCustom } from '../../components/Custom/TextFieldCustom';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { User } from '../../services';
import { getUser } from '../../utils';
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


function PageAdd({
    search,
    styleBtn = {},
    ...props
}) {
    const _user = getUser()
    const roleIds = _user.Roles.map(r => r.id);

    const initUser = {
        username: "",
        fullname: "",
        password: PASSWORD_DEFAULT,//default
        phone: "",
        email: "",
        dateExpired: roleIds.includes(ROLE.teacher_vip) ? _user.dateExpired : moment().add(1, "month").format("YYYY-MM-DD"),
        status: 1,
        User_Roles: [],
        Students_Teacher: [],
    }

    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState(initUser);
    const loadingContext = useContext(LoadingContext);
    const notificationContext = useContext(NotificationContext);

    const handleSumit = () => {
        if (roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher)) {
            user.Students_Teacher = [_user.id]
        }
        if (!user.username) {
            notificationContext.dispatch(openActionNotification("Tên đăng nhập không được bỏ trống.", "error"))
            return
        }
        if (!user.fullname) {
            notificationContext.dispatch(openActionNotification("Họ và tên không được bỏ trống.", "error"))
            return
        }
        if (!user.dateExpired) {
            notificationContext.dispatch(openActionNotification("Ngày hết hạn không được bỏ trống.", "error"))
            return
        }
        if (!user.User_Roles?.length && roleIds.includes(ROLE.admin)) {
            notificationContext.dispatch(openActionNotification("Loại người dùng không được bỏ trống.", "error"))
            return
        }
        if (user.User_Roles?.[0]?.roleId === ROLE.student && !user.Students_Teacher?.length) {
            notificationContext.dispatch(openActionNotification("Giáo viên không được bỏ trống.", "error"))
            return
        }
        if (!user.phone) {
            notificationContext.dispatch(openActionNotification("Số điện thoại không được bỏ trống.", "error"))
            return
        }
        //check before create
        user.User_Roles = user.User_Roles.map(id => ({
            roleId: id,
            createdBy: _user.id
        }))
        user.Students_Teacher = user.Students_Teacher.map(id => ({
            teacherId: id,
            createdBy: _user.id
        }))

        loadingContext.dispatch(openActionLoading())
        User.createUser(user)
            .then(respones => {
                const { code } = respones
                if (code === RESPONSE_CODE.SUCCESS) {
                    !!search && search()
                    setOpenModal(false);
                    setUser({ ...initUser })
                } else if (code === RESPONSE_CODE.USERNAME_HAD_USED) {
                    notificationContext.dispatch(openActionNotification("Tên đăng nhập đã tồn tại.", "warning"))
                } else {
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
                // setOpenModal(false);
            })
    }
    return (<div style={{ display: "inline-block" }}>
        <Button style={styleBtn} variant="outlined" size="medium" onClick={() => setOpenModal(true)}>
            Thêm
        </Button>
        <Modal
            open={openModal}
            onClose={() => {
                setUser({ ...initUser })
                setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => {
                        setUser({ ...initUser })
                        setOpenModal(false)
                    }}
                >
                    <ClearIcon />
                </div>
                <div style={{ paddingBottom: 20, width: "100%" }}>
                    <div className="container-title">
                        <h2>THÊM NGƯỜI DÙNG</h2>
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
                            <UserTypeAutocomplete
                                label="Loại người dùng"
                                onChange={value => {
                                    setUser({
                                        ...user,
                                        User_Roles: !!value ? [value] : []
                                    })
                                }}
                                disabled={roleIds.includes(ROLE.teacher_vip)}
                                value={roleIds.includes(ROLE.teacher_vip) ? ROLE.student : user.User_Roles?.[0]}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker
                                    className="date-input"
                                    label="Ngày hết hạn"
                                    renderInput={(params) => <TextField
                                        size='small'
                                        {...params} />}
                                    inputFormat="DD/MM/YYYY"
                                    minDate={moment().toDate()}
                                    value={moment(user.dateExpired, "YYYY-MM-DD").toDate()}
                                    onChange={newValue => {
                                        setUser({
                                            ...user,
                                            dateExpired: moment(newValue.$d).format("YYYY-MM-DD")
                                        })
                                    }}
                                />
                            </LocalizationProvider>
                        </div>
                        {
                            roleIds.includes(ROLE.admin) && user.User_Roles?.[0] === ROLE.student &&
                            <div className="container-car-type container-car-location">
                                <TeacherAutocomplete
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
                                value={user.email}
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
                            <Button onClick={() => handleSumit()} variant="contained" disableElevation>
                                Lưu
                            </Button>
                        </div>
                    </div>
                </div >
            </Box>
        </Modal>
    </div >)
}
export default memo(PageAdd)
