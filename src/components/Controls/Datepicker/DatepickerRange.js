import { IconButton, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from "moment";
import { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';


const DatepickerRange = ({ value: _value, onChange, label, ...props }) => {
    const [value, setValue] = useState(_value || [])

    useEffect(() => {
        !!onChange && onChange(value)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])
    return <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <MobileDatePicker
                label={label}
                inputFormat="DD/MM/YYYY"
                toolbarPlaceholder={label}
                value={value?.[0] ? moment(value[0], "YYYY-MM-DD") : null}
                onChange={_value => {
                    value[0] = moment(_value.$d).startOf("day").format("YYYY-MM-DD HH:mm:ss");
                    setValue([
                        ...value
                    ])
                }}
                renderInput={(params) => <TextField fullWidth size="small" {...params} />}
            />
            <div style={{ display: "inline-block", padding: "0 6px" }}>
                đến
            </div>
            <MobileDatePicker
                label={label}
                toolbarPlaceholder={label}
                inputFormat="DD/MM/YYYY"
                value={value?.[1] ? moment(value[1], "YYYY-MM-DD") : null}
                onChange={_value => {
                    value[1] = moment(_value.$d).endOf("day").format("YYYY-MM-DD HH:mm:ss");
                    setValue([
                        ...value
                    ])
                }}
                renderInput={(params) => <TextField fullWidth size="small" {...params} />}
            />
        </div>
    </LocalizationProvider>
}

export default DatepickerRange