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
import { User } from '../../services';
import { getUser } from '../../utils';
import { defaultResultModel, defaultSearchModel, ResultModel, SearchModel } from './Model';
import PageAdd from './PageAdd';
import PageEdit from './PageEdit';
import PageSearch from './PageSearch';
import PageSidebar from './PageSidebar';
import PageView from './PageView';

const Page = ({ ...props }) => {

    const _user = getUser()
    const [searchOption, setSearchOption] = useState({
        limit: PER_PAGE,
        page: 1,
        page_count: 1,
        total_count: 0,
    });
    const [searchModel, setSearchModel] = useState({});
    const [users, setUsers] = useState([]);
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
        if (!!searchModel.username) {
            _searchModel.$or.push({ username: { $like: `%25${searchModel.username}%25` } })
        }
        if (!!searchModel.email) {
            _searchModel.$or.push({ email: { $like: `%25${searchModel.email}%25` } })
        }
        if (!!searchModel.phone) {
            _searchModel.$or.push({ phone: { $like: `%25${searchModel.phone}%25` } })
        }
        if (searchModel.createdDate?.length > 0) {
            _searchModel.$or.push({ createdDate: { $between: searchModel.createdDate } })
        }
        if (searchModel.updatedDate?.length > 0) {
            _searchModel.$or.push({ updatedDate: { $between: searchModel.updatedDate } })
        }
        if (searchModel.createdBy?.length > 0) {
            _searchModel.$or.push({ createdBy: { $in: searchModel.createdBy } })
        }
        if (searchModel.updatedBy?.length > 0) {
            _searchModel.$or.push({ updatedBy: { $in: searchModel.updatedBy } })
        }
        if (_searchModel.$or.length <= 0) {
            delete _searchModel.$or
        }
        if (roleIds.includes(ROLE.teacher_vip)) {
            searchOther.student = true;
            searchOther.teacherId = _user.id;
        }
        loadingContext.dispatch(openActionLoading())
        User.getUsers(searchOption, _searchModel, searchOther)
            .then(response => {
                const { code, records, _metadata } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const users = records
                    const { limit, page, page_count, total_count } = _metadata
                    searchOption.limit = limit;
                    searchOption.page = page;
                    searchOption.page_count = page_count;
                    searchOption.total_count = total_count;
                    setSearchOption(searchOption)
                    setUsers(users)
                    setSelectModel([])
                } else {
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
        document.title = "Quản lý học viên"
    }, [])
    const handleSelectRow = (event, userId) => {
        selectModel.includes(userId) ? selectModel = selectModel.filter(sl => sl !== userId)
            : selectModel.push(userId)
        setSelectModel([...selectModel])
    }
    const handleSelectAll = (event) => {
        const checkAll = users.every(user => selectModel.includes(user.id));
        if (checkAll) {
            setSelectModel([])
        } else {
            setSelectModel(users.map(user => user.id))
        }
    }
    const handleDelete = async () => {
        if (selectModel.length === 1) {
            loadingContext.dispatch(openActionLoading())
            const response = await User.deletes(selectModel)
            loadingContext.dispatch(closeActionLoading())
            const { code } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                notificationContext.dispatch(openActionNotification("Xóa thành công.", "success"))
                search()
            } if (code === RESPONSE_CODE.USER_HAD_USED) {
                notificationContext.dispatch(openActionNotification("Không thể xóa! Người dùng đang được sử dụng.", "warning"))
                search()
            } else {
                notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau", "error"))
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
    return (
        <div>
            <Header />
            <Container fixed>
                <div>
                    <PageSearch option={option1} onChange={value => setSearchModel(value)} />
                </div>
                <div>
                    <div style={{ display: "flex", alignItems: "center", padding: "6px 0" }}>
                        <div style={{ flex: 1 }}>
                            <Button variant="outlined" onClick={() => search()} size="medium">
                                Tìm kiếm
                            </Button>
                            <PageAdd search={search} />
                            <PageView selectModel={selectModel} />
                            <PageEdit search={search} selectModel={selectModel} />
                            <Button onClick={() => handleClickDelete()} variant="outlined" size="medium">
                                Xóa
                            </Button>
                        </div>
                        <div >
                            <PageSidebar
                                option1={{
                                    defaultValue: defaultSearchModel,
                                    label: "Tìm kiếm",
                                    values: SearchModel,
                                    code: `User_Page_Search${isMobile ? '_mb' : ''}`
                                }}
                                option2={{
                                    defaultValue: defaultResultModel,
                                    label: "Kết quả",
                                    values: ResultModel,
                                    code: `User_Page_Research${isMobile ? '_mb' : ''}`
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
                                                checked={users.length > 0 && users.every(user => selectModel.includes(user.id))}
                                                inputProps={{
                                                    'aria-labelledby': "",
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className={!option2.includes("fullname") ? "hidden" : ""} align="left" >Họ và tên</TableCell>
                                        <TableCell className={!option2.includes("phone") ? "hidden" : ""} align="left">Số điện thoại</TableCell>
                                        <TableCell className={!option2.includes("username") ? "hidden" : ""} align="left">Tên đăng nhập</TableCell>
                                        <TableCell className={!option2.includes("email") ? "hidden" : ""} align="left">Email</TableCell>
                                        <TableCell className={!option2.includes("createdDate") ? "hidden" : ""} align="left">Ngày tạo</TableCell>
                                        <TableCell className={!option2.includes("updatedDate") ? "hidden" : ""} align="left">Ngày cập nhập</TableCell>
                                        <TableCell className={!option2.includes("createdBy") ? "hidden" : ""} align="left">Người tạo</TableCell>
                                        <TableCell className={!option2.includes("updatedBy") ? "hidden" : ""} align="left">Người cập nhập</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user, index) => {
                                        const selected = selectModel.includes(user.id);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return <TableRow
                                            key={user.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            onClick={(event) => handleSelectRow(event, user.id)}
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
                                            <TableCell className={!option2.includes("fullname") ? "hidden" : ""} align="left" component="th" scope="row">
                                                {user.fullname}
                                            </TableCell>
                                            <TableCell className={!option2.includes("phone") ? "hidden" : ""} align="left">{user.phone}</TableCell>
                                            <TableCell className={!option2.includes("username") ? "hidden" : ""} align="left">{user.username}</TableCell>
                                            <TableCell className={!option2.includes("email") ? "hidden" : ""} align="left">{user.email}</TableCell>
                                            <TableCell className={!option2.includes("createdDate") ? "hidden" : ""} align="left">{!!user.createdDate ?
                                                moment(user.createdDate).format("DD//MM/YYYY HH:mm") : ""}</TableCell>
                                            <TableCell className={!option2.includes("updatedDate") ? "hidden" : ""} align="left">{!!user.updatedDate ?
                                                moment(user.updatedDate).format("DD//MM/YYYY HH:mm") : ""}</TableCell>
                                            <TableCell className={!option2.includes("createdBy") ? "hidden" : ""} align="left">{user.CreatedBy?.fullname}</TableCell>
                                            <TableCell className={!option2.includes("updatedBy") ? "hidden" : ""} align="left">{user.UpdatedBy?.fullname}</TableCell>
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
                                    page: page + 1,
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
export default Page 