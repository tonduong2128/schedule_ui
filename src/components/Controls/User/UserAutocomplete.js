import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { RESPONSE_CODE, ROLE } from "../../../common";
import { User } from "../../../services";
import { getUser } from '../../../utils';
const UserAutocomplete = ({ onChange, label, disabled = false, value = [], ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const _user = getUser()
    const [users, setUsers] = useState([])
    const roleIds = _user.Roles.map(r => r.id);
    useEffect(() => {
        const searchOption = {
            limit: 100000,
            page: 1
        };
        const searchModel = {
        };
        const searchOther = {}
        if (roleIds.includes(ROLE.teacher_vip)) {
            searchOther.student = true;
            searchOther.teacherId = _user.id;
        }
        User.getUsers(searchOption, searchModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const users = records
                    setUsers(users)
                } else {
                    //handle error
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return <Autocomplete
        disablePortal
        disabled={disabled}
        options={users}
        multiple
        size='small'
        getOptionLabel={option => option.fullname}
        renderInput={(params) => (
            <TextField
                required
                {...params}
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
                    ),
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