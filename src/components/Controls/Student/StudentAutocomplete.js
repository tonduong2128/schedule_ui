import PersonIcon from '@mui/icons-material/Person';
import { Autocomplete, CircularProgress, InputAdornment, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { User } from "../../../services";
import { useDebounce } from '../../CustomHook';
const StudentAutocomplete = ({ onChange, teacherId, value, disabled = false, ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [students, setStudents] = useState([])
    const [student, setStudent] = useState(value)
    const [textSearch, setTextSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const debounceValue = useDebounce(textSearch, 800);
    const search = useCallback(() => {
        const searchOption = {
            limit: 20,
            page: 1
        };
        const searchModel = {
        };
        searchModel.fullname = debounceValue ? { $like: `%25${debounceValue}%25` } : undefined;
        const searchOther = { student: true, teacherId }
        setLoading(() => true)
        User.getStudents(searchOption, searchModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setStudents(records)
                } else {
                    //handle error
                }
            })
            .finally(() => {
                setLoading(false)
            })

    }, [teacherId, debounceValue])
    useEffect(() => {
        search()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])
    return <div className="container-car-type container-car-location" style={{ position: "relative" }}>
        <Autocomplete
            disablePortal
            key="StudentAutocomplete"
            disabled={disabled}
            options={students}
            getOptionLabel={option => option.fullname}
            renderInput={(params) => (
                <TextField
                    {...params}
                    className="search-car-input"
                    label="Học viên"
                    placeholder="Học viên"
                    size='small'
                    onChange={(e) => {
                        setTextSearch(e.currentTarget.value)
                    }}
                    onBlur={e => {
                        if (!student?.fullname) {
                            setTextSearch("")
                        }
                    }}
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <PersonIcon />
                                {params.InputProps.startAdornment}
                            </>
                        )
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