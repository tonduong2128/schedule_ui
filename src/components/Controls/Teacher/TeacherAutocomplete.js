import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { PER_PAGE, RESPONSE_CODE } from "../../../common";
import { User } from "../../../services";
const TeacherAutocomplete = ({ onChange, value, disabled = false, studentId, ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [teachers, setTeachers] = useState([])
    useEffect(() => {
        const searchOption = {
            limit: PER_PAGE,
            page: 1
        };
        const seacherModel = {
        };
        const searchOther = { teacher: true }
        if (studentId) {
            searchOther.student = true
            searchOther.studentId = studentId
        }
        User.getStudents(searchOption, seacherModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const teacher = records
                    setTeachers(teacher)
                } else {
                    //handle error
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studentId])
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
                    className="search-car-input"
                    label="Giáo viên"
                    placeholder="Giáo viên"
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