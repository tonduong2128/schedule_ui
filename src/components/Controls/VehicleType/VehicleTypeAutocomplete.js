import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Autocomplete, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { VehicleType } from "../../../services";
import { useDebounce } from '../../CustomHook';
const VehicleTypeAutocomplete = ({ onChange, vehicleTypeId, teacherId = 0, disabled = false, ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [vehicleTypes, setVehicleTypes] = useState([])
    const [textSearch, setTextSearch] = useState("");
    const debounceValue = useDebounce(textSearch, 800);
    const search = useCallback(() => {
        const searchOption = {
            limit: 10,
            page: 1
        };
        const searchModel = {
            teacherId: teacherId
        };
        searchModel.name = debounceValue ? { $like: `%25${debounceValue}%25` } : undefined;
        VehicleType.getVehicleTypes(searchOption, searchModel)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setVehicleTypes(records)
                } else {
                    //handle error
                }
            })
    }, [teacherId, debounceValue])
    useEffect(() => {
        search()
    }, [search])
    return <div className="container-car-type container-car-location">
        <Autocomplete
            key="VehicleTypeAutocomplete"
            disablePortal
            disabled={disabled}
            options={vehicleTypes}
            getOptionLabel={option => option.name}
            renderInput={(params) => (
                <TextField
                    {...params}
                    onChange={(e) => {
                        setTextSearch(e.currentTarget.value)
                    }}
                    onBlur={e => {
                        if (!vehicleTypeId?.name) {
                            setTextSearch("")
                        }
                    }}
                    className="search-car-input"
                    size='small'
                    label="Loại xe"
                    placeholder="Loại xe"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <>
                                <DirectionsCarIcon />
                                {params.InputProps.startAdornment}
                            </>
                        ),
                    }}
                />
            )}
            value={vehicleTypes.find(tc => tc.id === vehicleTypeId) || null}
            onChange={(event, newValue) => {
                onChange(newValue?.id || 0)
            }}
        />
    </div>
}
export default VehicleTypeAutocomplete;