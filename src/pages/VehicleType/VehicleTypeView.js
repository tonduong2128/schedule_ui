
import ClearIcon from '@mui/icons-material/Clear';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import { Box, InputAdornment, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import moment from 'moment';
import { memo, useContext, useState } from 'react';
import { RESPONSE_CODE, ROLE } from '../../common';
import TeacherAutocomplete from '../../components/Controls/Teacher/TeacherAutocomplete';
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

function VehicleTypeView({
    selectModel = [],
    ...props
}) {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false);
    const [vehicleType, setVehicleType] = useState({});
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);


    const roleIds = _user.Roles.map(r => r.id);
    const handleBeforeShow = async () => {
        if (selectModel.length === 1) {
            loadingContext.dispatch(openActionLoading())
            const response = await VehicleType.getVehicleTypeById(selectModel[0])
            loadingContext.dispatch(closeActionLoading())

            const { code, records } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                const vehicleType = records[0]
                setVehicleType(vehicleType)
                setOpenModal(true)
            }
        } else if (selectModel.length === 0) {
            notificationContext.dispatch(openActionNotification("Vui lòng chọn một dòng dữ liệu.", "warning"))
        } else {
            notificationContext.dispatch(openActionNotification("Vui lòng chỉ chọn một dòng dữ liệu.", "warning"))
        }
    }
    const handleSumit = () => {
        //handle before summit
    }
    return (<div style={{ display: "inline-block" }}>
        <Button variant="outlined" size="medium" onClick={() => handleBeforeShow()}>
            Xem
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
                        <h2>XEM THÔNG TIN LOẠI XE</h2>
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
                                disabled
                                fullWidth
                                id="name"
                                placeholder="Tên loại xe"
                                variant="outlined"
                                size="small"
                                label="Tên loại xe"
                                value={vehicleType.name}
                                onChange={event => {
                                }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                fullWidth
                                disabled
                                id="description"
                                placeholder="Mô tả"
                                variant="outlined"
                                size="small"
                                label="Mô tả"
                                value={vehicleType.description}
                                InputProps={{
                                    startAdornment: (
                                        <></>
                                    ),
                                }}
                            />
                        </div>
                        {
                            roleIds.includes(ROLE.admin) &&
                            <div className="container-car-type container-car-location">
                                <TeacherAutocomplete
                                    size='small'
                                    disabled
                                    onChange={value => {
                                    }}
                                    value={vehicleType.teacherId}
                                />
                            </div>
                        }
                        <div className="container-car-type container-car-location">
                            <TextField
                                fullWidth
                                disabled
                                id="createdBy"
                                placeholder="Người tạo"
                                variant="outlined"
                                size="small"
                                label="Người tạo"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment style={{ marginLeft: -8 }} position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={vehicleType?.CreatedBy?.fullname}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                fullWidth
                                disabled
                                id="updatedBy"
                                placeholder="Người cập nhập"
                                variant="outlined"
                                size="small"
                                label="Người cập nhập"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment style={{ marginLeft: -8 }} position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                                value={vehicleType?.UpdatedBy?.fullname}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
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
                                value={vehicleType?.createdDate ? moment(vehicleType?.createdDate).format("DD/MM/YYYY HH:mm") : ""}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
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
                                value={vehicleType?.updatedDate ? moment(vehicleType?.updatedDate).format("DD/MM/YYYY HH:mm") : ""}
                            />
                        </div>
                    </div>
                </div >
            </Box>
        </Modal>
    </div>)
}
export default memo(VehicleTypeView)
