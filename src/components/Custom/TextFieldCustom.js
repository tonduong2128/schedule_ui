import { TextField } from "@mui/material"
import { useState } from "react"
import ClearIcon from '@mui/icons-material/Clear';

const TextFieldCustom = ({ value, disable, onChange = () => { }, ...props }) => {
    const [hiddenClear, setHiddenClear] = useState(true)

    return <TextField
        {...props}
        value={value}
        onChange={event => {

            onChange(event)
        }}
        onFocus={() => {
            setHiddenClear(false)
        }}
        onBlur={() => {
            setTimeout(() => {
                setHiddenClear(true)
            }, 150)
        }}
        InputProps={{
            ...props?.InputProps,
            endAdornment: (
                <div hidden={hiddenClear || !value || !!disable} onClick={(event) => {
                    event.stopPropagation();
                    event.target.value = ""
                    event.currentTarget.value = ""
                    event.nativeEvent.target.value = ""
                    onChange(event)
                }}>
                    <ClearIcon fontSize="20px" style={{ cursor: "pointer", marginTop: -3, marginRight: -4 }} />
                </div>
            ),
        }}
    />
}
export { TextFieldCustom }