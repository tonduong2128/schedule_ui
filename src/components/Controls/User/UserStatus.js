import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";
import { STATUS_USER } from "../../../common";
const UserStatus = ({ onChange, label, disabled = false, value = [], ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [status, setStatus] = useState([
        {
            code: STATUS_USER.using,
            name: "Đang xử dụng",
        },
        {
            code: STATUS_USER.exprid,
            name: "Ngừng sử dụng",
        }
    ])
    return <Autocomplete
        disablePortal
        disabled={disabled}
        options={status}
        size='small'
        getOptionLabel={option => option.name}
        renderInput={(params) => (
            <TextField
                required
                {...params}
                className="search-car-input"
                label={label}
                placeholder={label}
                InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                        <>
                            <CheckCircleOutlineIcon />
                            {params.InputProps.startAdornment}
                        </>
                    ),
                }}
            />
        )}
        value={status.find(st => st.code === value) || null}
        onChange={(event, newValue) => {
            !!onChange && onChange(newValue.code)
        }}
    />
}
export default UserStatus;