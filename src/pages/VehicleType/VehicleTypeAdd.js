import ClearIcon from '@mui/icons-material/Clear';
import { Box, Modal } from '@mui/material';
import Button from '@mui/material/Button';
import React, { memo, useContext, useState } from 'react';
import { RESPONSE_CODE, ROLE } from '../../common';
import TeacherAutocomplete from '../../components/Controls/Teacher/TeacherAutocomplete';
import { TextFieldCustom } from '../../components/Custom';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { VehicleType } from '../../services';
import { getUser } from '../../utils';

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
const initVehicleType = {
    name: "",
    description: "",
    teacherId: 0,
}
function VehicleTypeAdd({
    search,
    styleBtn = {},
    ...props
}) {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false);
    const [vehicleType, setVehicleType] = useState(initVehicleType);
    const loadingContext = useContext(LoadingContext);
    const notificationContext = useContext(NotificationContext);
    const roleIds = _user.Roles.map(r => r.id);
    const handleSumit = () => {
        if (roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher)) {
            vehicleType.teacherId = _user.id
        }

        if (!vehicleType.name) {
            notificationContext.dispatch(openActionNotification("Tên loại xe không được bỏ trống.", "error"))
            return
        }
        if (!vehicleType.teacherId) {
            notificationContext.dispatch(openActionNotification("Giáo viên không được bỏ trống.", "error"))
            return
        }

        loadingContext.dispatch(openActionLoading())
        VehicleType.createVehicleType(vehicleType)
            .then(respones => {
                const { code } = respones
                if (code === RESPONSE_CODE.SUCCESS) {
                    !!search && search()
                    setOpenModal(false);
                } else {
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
                }
            })
            .finally(() => {
                setVehicleType({ ...initVehicleType })
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
                setVehicleType({ ...initVehicleType })
                setOpenModal(false);
            }}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} >
                <div
                    style={{ position: "absolute", top: 12, right: 16, cursor: "pointer" }}
                    onClick={() => {
                        setVehicleType({ ...initVehicleType })
                        setOpenModal(false)
                    }}
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
                            <TextFieldCustom
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
                                        name: event.nativeEvent.target.value?.trimStart()
                                    })
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextFieldCustom
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
                                        description: event.nativeEvent.target.value?.trimStart()
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
    </div >)
}
export default memo(VehicleTypeAdd)
