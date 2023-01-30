import { TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import moment from "moment";
import { useEffect, useState } from "react";
import ClearIcon from '@mui/icons-material/Clear';
import { isMobile } from "react-device-detect";

const DatepickerRange = ({ value: _value, onChange, label, ...props }) => {
    const [value, setValue] = useState(_value || [])
    const [hiddenClear1, setHiddenClear1] = useState(true && !isMobile)
    const [hiddenClear2, setHiddenClear2] = useState(true && !isMobile)

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
                renderInput={(params) => <TextField
                    {...params}
                    onMouseEnter={() => {
                        setHiddenClear1(false && !isMobile)
                    }}
                    onMouseLeave={() => {
                        setHiddenClear1(true && !isMobile)
                    }}
                    fullWidth
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <span hidden={hiddenClear1 || !value?.[0]} onClick={(e) => {
                                e.stopPropagation();
                                setValue([null, value?.[1]])
                            }}>
                                <ClearIcon fontSize="20px" style={{ cursor: "pointer", marginRight: -8, marginTop: -4 }} />
                            </span>
                        ),
                    }}
                />}
            />
            <div style={{ display: "inline-block", fontSize: isMobile ? 14 : 16, padding: "0 6px", textTransform: "none" }}>
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
                renderInput={(params) => <TextField
                    {...params}
                    onMouseEnter={() => {
                        setHiddenClear2(false)
                    }}
                    onMouseLeave={() => {
                        setHiddenClear2(true)
                    }}
                    fullWidth
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <span hidden={hiddenClear2 || !value?.[1]} onClick={(e) => {
                                e.stopPropagation();
                                setValue([value?.[0], null])
                            }}>
                                <ClearIcon fontSize="20px" style={{ cursor: "pointer", marginRight: -8, marginTop: -4 }} />
                            </span>
                        ),
                    }}
                />}
            />
        </div>
    </LocalizationProvider >
}

export default DatepickerRange