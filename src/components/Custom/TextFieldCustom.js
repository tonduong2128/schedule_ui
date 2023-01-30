import ClearIcon from '@mui/icons-material/Clear';
import { TextField } from "@mui/material";
import { useState } from "react";

const TextFieldCustom = ({ value, disable, onChange = () => { }, ...props }) => {
    const [hiddenClear, setHiddenClear] = useState(true)
    const [focus, setFocus] = useState(false)
    return <TextField
        {...props}
        inputRef={input => focus && input && input.focus()}
        value={value}
        onChange={event => {
            onChange(event)
        }}
        onFocus={e => {
            setFocus(true)
            setHiddenClear(false)
        }}
        InputProps={{
            ...props?.InputProps,
            endAdornment: (
                <div hidden={hiddenClear || !value || !!disable} onClick={(event) => {
                    event.stopPropagation();
                    event.target.value = ""
                    event.currentTarget.value = ""
                    event.nativeEvent.target.value = ""
                    setFocus(true)
                    setHiddenClear(false)
                    onChange(event)
                }}>
                    <ClearIcon style={{ cursor: "pointer", fontSize: 26, marginTop: -3, marginRight: -4 }} />
                </div>
            ),
        }}
    />
}
export { TextFieldCustom };
