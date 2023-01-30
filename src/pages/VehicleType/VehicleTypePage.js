import { Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TablePagination } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { PER_PAGE, RESPONSE_CODE, ROLE } from '../../common';
import { Header } from '../../components';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import { VehicleType } from '../../services';
import { getUser } from '../../utils';
import { defaultResultModel, defaultSearchModel, ResultModel, SearchModel } from './Model';
import VehicleTypeAdd from './VehicleTypeAdd';
import VehicleTypeEdit from './VehicleTypeEdit';
import VehicleTypeSearch from './VehicleTypeSearch';
import VehicleTypeSidebar from './VehicleTypeSidebar';
import VehicleTypeView from './VehicleTypeView';

const VehicleTypePage = ({ ...props }) => {

    const _user = getUser()
    const [searchOption, setSearchOption] = useState({
        limit: PER_PAGE,
        page: 1,
        page_count: 1,
        total_count: 0,
    });
    const [searchModel, setSearchModel] = useState({});
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [option1, setOption1] = useState([]);
    const [option2, setOption2] = useState([]);
    let [selectModel, setSelectModel] = useState([]);
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);

    const roleIds = _user.Roles.map(r => r.id);
    const search = () => {
        const _searchModel = {
            $or: []
        };
        const searchOther = {}
        if (searchModel.id?.length > 0) {
            _searchModel.$or.push({ id: { $in: searchModel.id } })
        }
        if (!!searchModel.name) {
            _searchModel.$or.push({ name: { $like: `%25${searchModel.name}%25` } })
        }
        if (!!searchModel.description) {
            _searchModel.$or.push({ description: { $like: `%25${searchModel.description}%25` } })
        }
        if (!!searchModel.teacherId) {
            _searchModel.$or.push({ teacherId: searchModel.teacherId })
        }

        const createdDateF = searchModel.createdDate?.filter(i => !!i);
        if (createdDateF?.length === 2) {
            _searchModel.$or.push({ createdDate: { $between: createdDateF } })
        } else if (!!createdDateF?.[0]) {
            _searchModel.$or.push({ createdDate: { $gte: createdDateF[0] } })
        } else if (!!createdDateF?.[1]) {
            _searchModel.$or.push({ createdDate: { $lte: createdDateF[1] } })
        }

        const updatedDateF = searchModel.updatedDate?.filter(i => !!i);
        if (updatedDateF?.length === 2) {
            _searchModel.$or.push({ updatedDate: { $between: updatedDateF } })
        } else if (!!updatedDateF?.[0]) {
            _searchModel.$or.push({ updatedDate: { $gte: updatedDateF[0] } })
        } else if (!!updatedDateF?.[1]) {
            _searchModel.$or.push({ updatedDate: { $lte: updatedDateF[1] } })
        }


        if (searchModel.createdBy?.length > 0) {
            _searchModel.$or.push({ createdBy: { $in: searchModel.createdBy } })
        }
        if (searchModel.updatedBy?.length > 0) {
            _searchModel.$or.push({ updatedBy: { $in: searchModel.updatedBy } })
        }
        if (roleIds.some(id => id === ROLE.teacher_vip || id === ROLE.teacher)) {
            _searchModel.teacherId = _user.id;
        }
        if (_searchModel.$or.length <= 0) {
            delete _searchModel.$or
        }
        loadingContext.dispatch(openActionLoading())
        VehicleType.getVehicleTypes(searchOption, _searchModel, searchOther)
            .then(response => {
                const { code, records, _metadata } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const vehicleTypes = records
                    const { limit, page, page_count, total_count } = _metadata
                    searchOption.limit = limit;
                    searchOption.page = page;
                    searchOption.page_count = page_count;
                    searchOption.total_count = total_count;
                    setSearchOption(searchOption)
                    setVehicleTypes(vehicleTypes)
                    setSelectModel([])
                } else {
                    //handle error
                    notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
                }
            })
            .finally(() => {
                loadingContext.dispatch(closeActionLoading())
            })
    }
    useEffect(() => {
        search()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchOption])
    useEffect(() => {
        document.title = "Quản lý loại xe"
    }, [])
    const handleSelectRow = (event, userId) => {
        selectModel.includes(userId) ? selectModel = selectModel.filter(sl => sl !== userId)
            : selectModel.push(userId)
        setSelectModel([...selectModel])
    }
    const handleSelectAll = (event) => {
        const checkAll = vehicleTypes.every(user => selectModel.includes(user.id));
        if (checkAll) {
            setSelectModel([])
        } else {
            setSelectModel(vehicleTypes.map(user => user.id))
        }
    }
    const handleDelete = async () => {
        if (selectModel.length > 0) {
            loadingContext.dispatch(openActionLoading())
            const response = await VehicleType.deletes(selectModel)
            loadingContext.dispatch(closeActionLoading())
            const { code } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                notificationContext.dispatch(openActionNotification("Xóa thành công.", "success"))
                search()
            } else {
                notificationContext.dispatch(openActionNotification("Không thể xóa! Loại xe đang được sử dụng.", "warning"))
            }
        } else if (selectModel.length === 0) {
            notificationContext.dispatch(openActionNotification("Vui lòng chọn một dòng dữ liệu.", "warning"))
        }
        setOpenConfirm(false)
    }
    const handleClickDelete = () => {
        if (selectModel.length === 0) {
            notificationContext.dispatch(openActionNotification("Bạn chưa chọn dòng dữ liệu nào.", "warning"))
            return
        }
        setOpenConfirm(true)
    }

    const styleBtn = isMobile ? {
        fontSize: 12,
        padding: "4px 2px",
        marginRight: "2px",
        marginBottom: "2px",
    } : {
        marginRight: "2px",
        marginBottom: "2px",
    }

    return (
        <div>
            <Header />
            <Container fixed style={{ paddingTop: 8 }}>
                <h6>QUẢN LÝ LOẠI XE</h6>
                <div>
                    <VehicleTypeSearch option={option1} onChange={value => setSearchModel(value)} />
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", padding: "6px 0" }}>
                        <div style={{ flex: 1 }}>
                            <Button style={styleBtn} variant="outlined" onClick={() => search()} size="medium">
                                Tìm kiếm
                            </Button>
                            <VehicleTypeAdd styleBtn={styleBtn} search={search} />
                            <VehicleTypeView styleBtn={styleBtn} selectModel={selectModel} />
                            <VehicleTypeEdit styleBtn={styleBtn} search={search} selectModel={selectModel} />
                            <Button style={styleBtn} onClick={() => handleClickDelete()} variant="outlined" size="medium">
                                Xóa
                            </Button>
                        </div>
                        <div >
                            <VehicleTypeSidebar
                                option1={{
                                    defaultValue: defaultSearchModel,
                                    label: "Tìm kiếm",
                                    values: SearchModel,
                                    code: `VehicleType_Page_Search${isMobile ? '_mb' : ''}`
                                }}
                                option2={{
                                    defaultValue: defaultResultModel,
                                    label: "Kết quả",
                                    values: ResultModel,
                                    code: `VehicleType_Research${isMobile ? '_mb' : ''}`
                                }}
                                onChange1={value => setOption1(value)}
                                onChange2={value => setOption2(value)} />
                        </div>
                    </div>
                </div>
                <Box sx={{ width: '100%' }}>
                    <Paper sx={{ width: '100%', mb: 2 }}>
                        <TableContainer >
                            <Table >
                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={event => handleSelectAll(event)} align="center" padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={vehicleTypes.length > 0 && vehicleTypes.every(user => selectModel.includes(user.id))}
                                                inputProps={{
                                                    'aria-labelledby': "",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className={!option2.includes("name") ? "hidden" : ""} align="left" >Tên loại xe</TableCell>
                                        <TableCell className={!option2.includes("description") ? "hidden" : ""} align="left">Mô tả</TableCell>
                                        <TableCell className={!option2.includes("teacher") ? "hidden" : ""} align="left">Giáo viên</TableCell>
                                        <TableCell className={!option2.includes("createdDate") ? "hidden" : ""} align="left">Ngày tạo</TableCell>
                                        <TableCell className={!option2.includes("updatedDate") ? "hidden" : ""} align="left">Ngày cập nhập</TableCell>
                                        <TableCell className={!option2.includes("createdBy") ? "hidden" : ""} align="left">Người tạo</TableCell>
                                        <TableCell className={!option2.includes("updatedBy") ? "hidden" : ""} align="left">Người cập nhập</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vehicleTypes.map((vehicleType, index) => {
                                        const selected = selectModel.includes(vehicleType.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return <TableRow
                                            key={vehicleType.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            onClick={(event) => handleSelectRow(event, vehicleType.id)}
                                            selected={selected}
                                        >
                                            <TableCell align="center" padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={selected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell className={!option2.includes("name") ? "hidden" : ""} align="left" component="th" scope="row">
                                                {vehicleType.name}
                                            </TableCell>
                                            <TableCell className={!option2.includes("description") ? "hidden" : ""} align="left">{vehicleType.description}</TableCell>
                                            <TableCell className={!option2.includes("teacher") ? "hidden" : ""} align="left">{vehicleType.Teacher.fullname}</TableCell>
                                            <TableCell className={!option2.includes("createdDate") ? "hidden" : ""} align="left">{!!vehicleType.createdDate ?
                                                moment(vehicleType.createdDate).format("DD/MM/YYYY HH:mm") : ""}</TableCell>
                                            <TableCell className={!option2.includes("updatedDate") ? "hidden" : ""} align="left">{!!vehicleType.updatedDate ?
                                                moment(vehicleType.updatedDate).format("DD/MM/YYYY HH:mm") : ""}</TableCell>
                                            <TableCell className={!option2.includes("createdBy") ? "hidden" : ""} align="left">{vehicleType.CreatedBy?.fullname}</TableCell>
                                            <TableCell className={!option2.includes("updatedBy") ? "hidden" : ""} align="left">{vehicleType.UpdatedBy?.fullname}</TableCell>
                                        </TableRow>
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            labelRowsPerPage="Mỗi trang"
                            component="div"
                            count={searchOption.total_count}
                            page={searchOption.page - 1}
                            rowsPerPage={searchOption.limit}
                            onPageChange={(event, page) => {
                                setSearchOption({
                                    ...searchOption,
                                    page: page + 1
                                })
                            }}
                            onRowsPerPageChange={event => {
                                setSearchOption({
                                    ...searchOption,
                                    limit: event.target.value
                                })
                            }}
                        />
                    </Paper>
                </Box>
                <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">
                        Xác nhận
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Bạn có chắc chắn muốn xóa, thao tác này không thể khôi phục.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button variant='outlined' onClick={() => setOpenConfirm(false)} >
                            Quay lại
                        </Button>
                        <Button variant='contained' onClick={() => handleDelete()}>
                            Đồng ý
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container >
        </div >
    );
}
export default VehicleTypePage 