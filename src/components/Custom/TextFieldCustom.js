import ClearIcon from '@mui/icons-material/Clear';
import { TextField } from "@mui/material";
import { useRef, useState } from "react";

const TextFieldCustom = ({ value, disable, onChange = () => { }, ...props }) => {
    const [hiddenClear, setHiddenClear] = useState(true)
    const [focus, setFocus] = useState(false)
    const ref = useRef()
    return <TextField
        {...props}
        inputRef={input => focus && input && input.focus()}
        value={value || ""}


        InputProps={{
            ...props?.InputProps,
            onFocus: e => {
                setFocus(true)
                setHiddenClear(false)
            },
            onBlur: e => {
                setFocus(false)
                clearTimeout(ref.current)
            },
            onChange: event => {
                onChange(event)
            },
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
