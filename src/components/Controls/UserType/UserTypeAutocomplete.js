import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { Role } from "../../../services";
const UserTypeAutocomplete = ({ onChange, label, disabled = false, value, ...props }) => {
    const [roles, setRoles] = useState([])

    useEffect(() => {
        const searchOption = {
            limit: 10,
            page: 1
        };
        const searchModel = {
        };
        Role.getRoles(searchOption, searchModel)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const roles = records
                    setRoles(roles)
                    !!onChange && onChange(value)
                } else {
                    //handle error
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <Autocomplete
        disablePortal
        disabled={disabled}
        options={roles}
        size='small'
        getOptionLabel={option => option.name}
        renderInput={(params) => (
            <TextField
                required
                {...params}
                className="search-car-input"
                label={label}
                size='small'
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
        value={roles.find(role => role.id === value) || null}
        onChange={(event, newValue) => {
            !!onChange && onChange(newValue?.id)
        }}
    />
}
export default memo(UserTypeAutocomplete);