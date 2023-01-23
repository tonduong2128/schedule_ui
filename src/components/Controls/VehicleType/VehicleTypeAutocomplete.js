import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { Autocomplete, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { RESPONSE_CODE } from "../../../common";
import { VehicleType } from "../../../services";
const VehicleTypeAutocomplete = ({ onChange, vehicleTypeId, teacherId = 0, disabled = false, ...props }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const [vehicleTypes, setVehicleTypes] = useState([])
    useEffect(() => {
        const searchOption = {
            limit: 100000,
            page: 1
        };
        const seacherModel = {
            teacherId: teacherId
        };
        VehicleType.getVehicleTypes(searchOption, seacherModel)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    setVehicleTypes(records)
                } else {
                    //handle error
                }
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [teacherId])
    return <div className="container-car-type container-car-location">
        <Autocomplete
            disablePortal
            disabled={disabled}
            options={vehicleTypes}
            getOptionLabel={option => option.name}
            renderInput={(params) => (
                <TextField
                    {...params}
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