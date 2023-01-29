import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RESPONSE_CODE, ROLE } from "../../../common";
import { User } from "../../../services";
import { getUser } from '../../../utils';
import { useDebounce } from '../../CustomHook';
const UserAutocomplete = ({ onChange, label, disabled = false, admin, value = [], ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _user = getUser()
    const [users, setUsers] = useState([])
    const [textSearch, setTextSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const debounceValue = useDebounce(textSearch, 800);
    const roleIds = _user.Roles.map(r => r.id);
    const search = useCallback(() => {
        const searchOption = {
            limit: 20,
            page: 1
        };
        const searchModel = {
        };
        const searchOther = {}
        if (roleIds.includes(ROLE.teacher_vip)) {
            searchOther.student = true;
            searchOther.teacherId = _user.id;
        }
        if (admin) {
            searchOther.admin = true;
        }
        searchModel.fullname = debounceValue ? { $like: `%25${debounceValue}%25` } : undefined;
        setLoading(true)
        User.getUsers(searchOption, searchModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setUsers(records)
                } else {
                    //handle error
                }
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, debounceValue])
    useEffect(() => {
        search()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
    return <Autocomplete
        disablePortal
        disabled={disabled}
        options={users}
        multiple
        size='small'
        freeSolo
        getOptionLabel={option => option.fullname}
        key="UserAutocomplete"
        renderInput={(params) => (
            <TextField
                {...params}
                onChange={(e) => {
                    setTextSearch(e.currentTarget.value)
                }}
                onBlur={e => {
                    if (!e.currentTarget.value) {
                        setTextSearch(e.currentTarget.value)
                    }
                }}
                className="search-car-input"
                size='small'
                label={label}
                placeholder={label}
                InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <>
                            <PersonIcon />
                            {params.InputProps.startAdornment}
                        </>
                    )
                }}
            />
        )}
        value={users.filter(user => value.includes(user.id)) || []}
        onChange={(event, newValue) => {
            !!onChange && onChange(newValue.map(user => user.id))
        }}
    />
}
export default UserAutocomplete;