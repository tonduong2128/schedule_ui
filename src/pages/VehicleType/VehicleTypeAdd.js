import React, { memo, useContext } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { RESPONSE_CODE, ROLE } from '../../common';
import { UserTypeAutocomplete } from '../../components/Controls/UserType';
import { User, VehicleType } from '../../services';
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
function VehicleTypeAdd({
    search,
    ...props
}) {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false);
    const [vehicleType, setVehicleType] = useState({
        name: "",
        description: "",
        teacherId: 0,
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
            vehicleType.teacherId = _user.id
        }
        loadingContext.dispatch(openActionLoading())
        VehicleType.createVehicleType(vehicleType)
            .then(respones => {
                const { code } = respones
                if (code === RESPONSE_CODE.SUCCESS) {
                    !!search && search()
                    setOpenModal(false);
                } else {
                    if (!vehicleType.name) {
                        handleOpenError('Vui lòng nhập tên đăng nhập');
                        return;
                    }
                    if (!vehicleType.description) {
                        handleOpenError('Vui lòng nhập họ và tên');
                        return;
                    }
                    if (!vehicleType.teacherId) {
                        handleOpenError('Vui lòng nhập vui số điện thoại');
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
                        <h2>THÊM LOẠI XE</h2>
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
                            <TextField
                                fullWidth
                                id="name"
                                placeholder="Tên loại xe"
                                variant="outlined"
                                size="small"
                                label="Tên loại xe"
                                value={vehicleType.name}
                                onChange={event => {
                                    setVehicleType({
                                        ...vehicleType,
                                        name: event.nativeEvent.target.value
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                fullWidth
                                id="description"
                                placeholder="Mô tả"
                                variant="outlined"
                                size="small"
                                label="Mô tả"
                                value={vehicleType.description}
                                onChange={event => {
                                    setVehicleType({
                                        ...vehicleType,
                                        description: event.nativeEvent.target.value
                                    })
                                }}
                            />
                        </div>
                        {
                            roleIds.includes(ROLE.admin) &&
                            <div className="container-car-type container-car-location">
                                <TeacherAutocomplete
                                    size='small'
                                    onChange={value => {
                                        setVehicleType({
                                            ...vehicleType,
                                            teacherId: value
                                        })
                                    }}
                                    value={vehicleType.teacherId}
                                />
                            </div>
                        }
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
export default memo(VehicleTypeAdd)
