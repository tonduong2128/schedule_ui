import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { User } from "../../../services";
const StudentAutocomplete = ({ onChange, teacherId, value, disabled = false, ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [students, setStudents] = useState([])
    const [student, setStudent] = useState(value)
    useEffect(() => {
        const searchOption = {
            limit: 100000,
            page: 1
        };
        const seacherModel = {
        };
        const searchOther = { student: true, teacherId }
        User.getStudents(searchOption, seacherModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setStudents(records)
                } else {
                    //handle error
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teacherId, value])
    return <div className="container-car-type container-car-location">
        <Autocomplete
            disablePortal
            disabled={disabled}
            options={students}
            getOptionLabel={option => option.fullname}
            renderInput={(params) => (
                <TextField
                    required
                    {...params}
                    className="search-car-input"
                    label="Học viên"
                    placeholder="Học viên"
                    size='small'
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
            value={students.find(st => st?.id === student && !!student) || null}
            onChange={(event, newValue) => {
                setStudent(newValue?.id)
                onChange(newValue?.id || 0)
            }}
        />
    </div>
}
export default StudentAutocomplete;