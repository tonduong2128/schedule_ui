import React, { memo, useContext } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { PASSWORD_DEFAULT, RESPONSE_CODE, ROLE } from '../../common';
import { UserTypeAutocomplete } from '../../components/Controls/UserType';
import { User } from '../../services';
import { getUser } from '../../utils';
import CloseIcon from '@mui/icons-material/Close';
import TeacherAutocomplete from '../../components/Controls/Teacher/TeacherAutocomplete';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';

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
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    bgcolor: '#222',
    border: '8px solid #fff',
    boxShadow: 24,
    pb: 5,
};
function PageAdd({
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
        nickname: "",
        User_Roles: [],
        Students_Teacher: [],
    });
    const [showError, setShowError] = React.useState(false);
    const [errorText, setErrorText] = React.useState('');
    const loadingContext = useContext(LoadingContext);

    const roleIds = _user.Roles.map(r => r.id);
    const handleOpenError = (text) => {
        setErrorText(text);
        setShowError(true);
    };
    const handleClose = () => {
        setShowError(false);
    };
    const handleSumit = () => {
        if (roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher)) {
            user.Students_Teacher = [_user.id]
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
                } else {
                    if (!user.username) {
                        handleOpenError('Vui lòng nhập tên đăng nhập');
                        return;
                    }
                    if (!user.fullname) {
                        handleOpenError('Vui lòng nhập họ và tên');
                        return;
                    }
                    if (!user.phone) {
                        handleOpenError('Vui lòng nhập vui số điện thoại');
                        return;
                    }
                    if (!user.email) {
                        handleOpenError('Vui lòng nhập email');
                        return;
                    }
                    if (!user.nickname) {
                        handleOpenError('Vui lòng nhập nickname');
                        return;
                    }
                    console.log("username exit");
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
                // setOpenModal(false);
            })
        //handle before summit
    }
    return (<div style={{ display: "inline-block" }}>
        <Button variant="outlined" size="medium" onClick={() => setOpenModal(true)}>
            Thêm
        </Button>
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
                        <h2>THÊM NGƯỜI DÙNG</h2>
                    </div>
                    <div
                        className="container-type"
                        style={{ overflowY: "overlay", maxHeight: "calc(92vh - 96px)", height: "100%", width: "100%" }}
                    >
                        <div className="container-car-type container-car-location">
                            <TextField
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
                                        username: event.nativeEvent.target.value
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
                                        User_Roles: [value]
                                    })
                                }}
                                disabled={roleIds.includes(ROLE.teacher_vip)}
                                value={roleIds.includes(ROLE.teacher_vip) ? ROLE.student : user.User_Roles?.[0]}
                            />
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
                            <TextField
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
                                        fullname: event.nativeEvent.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
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
                                        phone: event.nativeEvent.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
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
                                        email: event.nativeEvent.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                fullWidth
                                id="nicname"
                                placeholder="Nickname"
                                variant="outlined"
                                size="small"
                                label="Nickname"
                                value={user.nickname}
                                onChange={event => {
                                    setUser({
                                        ...user,
                                        nickname: event.nativeEvent.target.value
                                    })
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
        <div>
            <Modal
                open={showError}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={modalStyle}>
                    <div className="button-close-modal">
                        <button className="btn" onClick={handleClose}>
                            <CloseIcon style={{ color: 'white' }} />
                        </button>
                    </div>
                    <p className="registration-error-title">ERROR</p>
                    <p className="registration-error-body">{errorText}</p>
                </Box>
            </Modal>
        </div>
    </div >)
}
export default memo(PageAdd)
