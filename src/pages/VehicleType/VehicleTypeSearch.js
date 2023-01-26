import { Grid, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { ROLE } from "../../common";
import DatepickerRange from "../../components/Controls/Datepicker/DatepickerRange";
import TeacherAutocomplete from "../../components/Controls/Teacher/TeacherAutocomplete";
import UserAutocomplete from "../../components/Controls/User/UserAutocomplete";
import { getUser } from "../../utils";


const VehicleTypeSearch = ({ option = [], searchModel: _searchModel, onChange, ...props }) => {
    const _user = getUser()
    const [searchModel, setSearchModel] = useState(_searchModel || {})

    const roleIds = _user.Roles.map(r => r.id);
    useEffect(() => {
        !!onChange && onChange(searchModel)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchModel])
    return <Grid container style={{ paddingTop: 10 }} spacing={1}>
        <Grid item
            className={!option.includes("name") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="name"
                placeholder="name"
                label="name"
                variant="outlined"
                size="small"
                value={searchModel.name}
                onChange={value => setSearchModel({
                    ...searchModel,
                    name: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("description") ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TextField
                fullWidth
                id="description"
                placeholder="Mô tả"
                variant="outlined"
                size="small"
                label="Mô tả"
                value={searchModel.description}
                onChange={value => setSearchModel({
                    ...searchModel,
                    description: value.nativeEvent.target.value,
                })}
            />
        </Grid>
        <Grid item
            className={!option.includes("teacher") || roleIds.some(id => id === ROLE.teacher || id === ROLE.teacher_vip) ? "hidden" : ""}
            xs={12} sm={12} md={6} lg={6} xl={6}>
            <TeacherAutocomplete
                style={{ marginTop: -20 }}
                onChange={value => setSearchModel({
                    ...searchModel,
                    teacherId: value,
                })}
                value={searchModel.teacherId}
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

export default memo(VehicleTypeSearch) 