import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { User } from "../../../services";
import { useDebounce } from '../../CustomHook';
const TeacherAutocomplete = ({ onChange, value, label, disabled = false, studentId, ...props }) => {
    const [teachers, setTeachers] = useState([])
    const [textSearch, setTextSearch] = useState("");
    const debounceValue = useDebounce(textSearch, 800);
    const search = useCallback(() => {
        const searchOption = {
            limit: 20,
            page: 1
        };
        const searchModel = {
        };
        const searchOther = { teacher: true }
        if (studentId) {
            searchOther.student = true
            searchOther.studentId = studentId
        }
        searchModel.fullname = debounceValue ? { $like: debounceValue } : undefined;
        User.getStudents(searchOption, searchModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const teacher = records
                    setTeachers(teacher)
                } else {
                    //handle error
                }
            })
    }, [studentId, debounceValue])
    useEffect(() => {
        search()
    }, [search])
    return <div className="container-car-type container-car-location">
        <Autocomplete
            {...props}
            disablePortal
            disabled={disabled}
            options={teachers}
            getOptionLabel={option => option.fullname}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size='small'
                    onChange={(e) => {
                        setTextSearch(e.currentTarget.value)
                    }}
                    onBlur={e => {
                        if (!value?.fullname) {
                            setTextSearch("")
                        }
                    }}
                    className="search-car-input"
                    label={label || "Giáo viên"}
                    placeholder={label || "Giáo viên"}
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
            value={teachers.find(tc => tc?.id === value && !!value) || null}
            onChange={(event, newValue) => {
                onChange(newValue?.id || 0)
            }}
        />
    </div>
}
export default TeacherAutocomplete;