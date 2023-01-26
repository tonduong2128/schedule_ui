import { Grid, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { ROLE } from "../../common";
import DatepickerRange from "../../components/Controls/Datepicker/DatepickerRange";
import UserAutocomplete from "../../components/Controls/User/UserAutocomplete";
import { getUser } from "../../utils";


const PageSearch = ({ option = [], searchModel: _searchModel, onChange, ...props }) => {
    const _user = getUser()
    const [searchModel, setSearchModel] = useState(_searchModel || {})

    const roleIds = _user.Roles.map(r => r.id);
    useEffect(() => {
        !!onChange && onChange(searchModel)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchModel])
    return <Grid container style={{ paddingTop: 10 }} spacing={1}>
        <Grid item
            className={!option.includes("fullname") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <UserAutocomplete
                label="Người dùng"
                value={searchModel.id || []}
                onChange={value => setSearchModel({
                    ...searchModel,
                    id: value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("username") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="username"
                placeholder="Tên đăng nhập"
                variant="outlined"
                size="small"
                label="Tên đăng nhập"
                value={searchModel.username}
                onChange={value => setSearchModel({
                    ...searchModel,
                    username: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("email") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="email"
                placeholder="email"
                label="Email"
                variant="outlined"
                size="small"
                value={searchModel.email}
                onChange={value => setSearchModel({
                    ...searchModel,
                    email: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("phone") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="phone"
                placeholder="Số điện thoại"
                label="Số điện thoại"
                variant="outlined"
                size="small"
                value={searchModel.phone}
                onChange={value => setSearchModel({
                    ...searchModel,
                    phone: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("nickname") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="nickname"
                placeholder="Nickanme"
                label="Nickanme"
                variant="outlined"
                size="small"
                value={searchModel.nickname}
                onChange={value => setSearchModel({
                    ...searchModel,
                    nickname: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("createdDate") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <DatepickerRange label="Ngày tạo" onChange={value => setSearchModel({
                ...searchModel,
                createdDate: value
            })} />
        </Grid>
        <Grid item
            className={!option.includes("updatedDate") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <DatepickerRange label="Ngày cập nhập" onChange={value => setSearchModel({
                ...searchModel,
                createdDate: value
            })} />
        </Grid>
        {roleIds.includes(ROLE.admin) &&
            <>
                <Grid item
                    className={!option.includes("createdBy") ? "hidden" : ""}
                    xs={12} sm={12} md={6} lg={6} xl={6}>
                    <UserAutocomplete
                        admin
                        label="Người tạo"
                        value={searchModel.createdBy || []}
                        onChange={value => setSearchModel({
                            ...searchModel,
                            createdBy: value,
                        })} />
                </Grid>
                <Grid item
                    className={!option.includes("updatedBy") ? "hidden" : ""}
                    xs={12} sm={12} md={6} lg={6} xl={6}>
                    <UserAutocomplete
                        admin
                        label="Người cập nhập"
                        value={searchModel.updatedBy || []}
                        onChange={value => setSearchModel({
                            ...searchModel,
                            updatedBy: value,
                        })} />
                </Grid>
            </>
        }
    </Grid>
}

export default memo(PageSearch) 