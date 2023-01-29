import { TextField } from "@mui/material"
import { useState } from "react"
import ClearIcon from '@mui/icons-material/Clear';

const TextFieldCustom = ({ value, onChange = () => { }, ...props }) => {
    const [hiddenClear, setHiddenClear] = useState(true)

    return <TextField
        {...props}
        value={value}
        onChange={event => {

            onChange(event)
        }}
        onMouseEnter={() => {
            setHiddenClear(false)
        }}
        onMouseLeave={() => {
            setHiddenClear(true)
        }}
        InputProps={{
            endAdornment: (
                <span hidden={hiddenClear} onClick={(event) => {
                    event.stopPropagation();
                    event.target.value = ""
                    event.currentTarget.value = ""
                    event.nativeEvent.target.value = ""
                    onChange(event)
                }}>
                    <ClearIcon fontSize="20px" style={{ cursor: "pointer" }} />
                </span>
            ),
        }}
    />
}
export default TextFieldCustom