import { Autocomplete, TextField } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { RESPONSE_CODE, ROLE } from '../../common';
import { User } from '../../services';
import { getUser } from '../../utils';
import { useDebounce } from '../CustomHook';

export default function CalenderOf({ onChange = () => { }, disabled = false, ...props }) {
    const _user = getUser()
    const [user, setUser] = useState(null)
    const [users, setUsers] = useState(() => {
        const isAdmin = _user.Roles.some(role => role.id === ROLE.admin)
        if (isAdmin) {
            return []
        } else {
            return [{
                ..._user,
                fullname: `(Tôi) ${_user.fullname}`
            }]
        }
    })
    const [textSearch, setTextSearch] = useState("");
    const debounceValue = useDebounce(textSearch, 800);

    const search = useCallback(() => {
        const searchOption = {
            limit: 10,
            page: 1
        };
        const searchOther = {}
        const searchModel = {}
        const roleIds = _user.Roles.map(role => role.id)
        if (roleIds.includes(ROLE.admin)) {
            searchOther.teacher = true;
        } else {
            searchModel.id = {
                $and: [
                    { $ne: _user.id },
                    { $in: _user.Teachers.map(tc => tc.id) }
                ]
            };
        }
        searchModel.fullname = debounceValue ? { $like: `%25${debounceValue}%25` } : undefined;
        User.getStudents(searchOption, searchModel, searchOther)
            .then(response => {
                const { code, records } = response
                if (code === RESPONSE_CODE.SUCCESS) {
                    const newRecords = records.map(user => ({ ...user, fullname: "(GV) " + user.fullname }))
                    const newUsers = [...users, ...newRecords]
                    setUsers(newUsers)
                    if (newUsers?.[0]) {
                        const user = newUsers[0]
                        setUser(user)
                        onChange({
                            isMe: user.id === _user.id,
                            id: user.id,
                        })
                    }
                } else {
                    //handle error
                }
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounceValue])
    useEffect(() => {
        search()
    }, [search])

    return (
        <div
            {...props}
        >
            <Autocomplete
                disablePortal
                disabled={disabled}
                options={users}
                getOptionLabel={option => option.fullname}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        onChange={(e) => {
                            setTextSearch(e.currentTarget.value)
                        }}
                        onBlur={e => {
                            if (!e.currentTarget.value) {
                                setTextSearch(e.currentTarget.value)
                            }
                        }}
                        label="Lịch của"
                        placeholder="Lịch của"
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    {params.InputProps.startAdornment}
                                </>
                            ),
                        }}
                        size='small'
                    />
                )}
                value={user}
                style={{ width: 250 }}
                onChange={(event, newValue) => {
                    if (!newValue) { return }
                    setUser(newValue)
                    onChange({
                        isMe: newValue.id === _user.id,
                        id: newValue.id
                    })
                }}
            />
        </div>
    );
}