
import ClearIcon from '@mui/icons-material/Clear';
import DateRangeIcon from '@mui/icons-material/DateRange';
import PersonIcon from '@mui/icons-material/Person';
import { Box, InputAdornment, Modal, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import moment from 'moment';
import { memo, useContext, useState } from 'react';
import { RESPONSE_CODE, ROLE } from '../../common';
import UserStatus from '../../components/Controls/User/UserStatus';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { User } from '../../services';
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

function PageView({
    selectModel = [],
    styleBtn = {},
    ...props
}) {
    const _user = getUser()
    const [openModal, setOpenModal] = useState(false);
    const [user, setUser] = useState({});
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);


    const roleIds = _user.Roles.map(r => r.id);
    const handleBeforeShow = async () => {
        if (selectModel.length === 1) {
            loadingContext.dispatch(openActionLoading())
            const response = await User.getUserById(selectModel[0])
            loadingContext.dispatch(closeActionLoading())

            const { code, records } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                const user = records[0]
                user.User_Roles = user.User_Roles.map(ur => ur.roleId)
                user.Students_Teacher = user.Students_Teacher.map(ur => ur.teacherId)
                setUser(user)
                setOpenModal(true)
            } else {
                notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
            }
        } else if (selectModel.length === 0) {
            notificationContext.dispatch(openActionNotification("Vui lòng chọn một dòng dữ liệu.", "warning"))
        } else {
            notificationContext.dispatch(openActionNotification("Vui lòng chỉ chọn một dòng dữ liệu.", "warning"))
        }
    }
    return (<div style={{ display: "inline-block" }}>
        <Button style={styleBtn} variant="outlined" size="medium" onClick={() => handleBeforeShow()}>
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
                        <h2>XEM NGƯỜI DÙNG</h2>
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
                                disabled
                                id="username"
                                placeholder="Tên đăng nhập"
                                variant="outlined"
                                size="small"
                                label="Tên đăng nhập"
                                value={user.username}
                                onChange={() => { }}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                disabled
                                fullWidth
                                id="userType"
                                placeholder="Loại người dùng"
                                variant="outlined"
                                size="small"
                                label="Loại người dùng"
                                value={user.Roles?.[0]?.name}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <DatePicker
                                    disabled
                                    className="date-input"
                                    label="Ngày hết hạn"
                                    renderInput={(params) => <TextField
                                        size='small'
                                        {...params} />}
                                    minDate={moment().toDate()}
                                    inputFormat="DD/MM/YYYY"
                                    value={user.dateExpired ? moment(user.dateExpired, "YYYY-MM-DD").toDate() : null}
                                    onChange={() => { }}
                                />
                            </LocalizationProvider>
                        </div>
                        {
                            roleIds.includes(ROLE.admin) && user.User_Roles?.[0] === ROLE.student &&
                            <div className="container-car-type container-car-location">
                                <TextField
                                    disabled
                                    fullWidth
                                    id="fullname"
                                    placeholder="Giáo viên"
                                    variant="outlined"
                                    size="small"
                                    label="Giáo viên"
                                    value={user.Teachers?.[0].fullname}
                                />
                            </div>
                        }
                        <div className="container-car-type container-car-location">
                            <TextField
                                disabled
                                fullWidth
                                id="fullname"
                                placeholder="Họ và tên"
                                variant="outlined"
                                size="small"
                                label="Họ và tên"
                                value={user.fullname}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                disabled
                                fullWidth
                                id="phone"
                                placeholder="Số điện thoại"
                                variant="outlined"
                                size="small"
                                label="Số điện thoại"
                                value={user.phone}
                            />
                        </div>
                        <div className="container-car-type container-car-location">
                            <TextField
                                disabled
                                fullWidth
                                id="email"
                                placeholder="Email"
                                variant="outlined"
                                size="small"
                                label="Email"
                                value={user.email}
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
                                onChange={() => { }}
                            />
                        </div>
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
                                value={user?.CreatedBy?.fullname}
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
                                value={user?.UpdatedBy?.fullname}
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
                                value={user?.createdDate ? moment(user?.createdDate).format("DD/MM/YYYY HH:mm") : ""}
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
                                value={user?.updatedDate ? moment(user?.updatedDate).format("DD/MM/YYYY HH:mm") : ""}
                            />
                        </div>
                    </div>
                </div >
            </Box>
        </Modal>
    </div>)
}
export default memo(PageView)
