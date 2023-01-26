import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { RESPONSE_CODE } from "../../common/constantsUiAndApi";
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from "../../reducer/notification";
import Auth from "../../services/auth";

function Login() {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);

    useEffect(() => {
        const { stateNotify } = state || {};
        stateNotify && notificationContext.dispatch(openActionNotification(stateNotify.message, stateNotify.type))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])
    const handleLogin = async (e) => {
        if (!!password && !!username) {
            loadingContext.dispatch(openActionLoading())
            const response = await Auth.login(username, password);
            loadingContext.dispatch(closeActionLoading())
            const { code } = response
            if (code === RESPONSE_CODE.SUCCESS) {
                navigate("/calendar")
            } else if (code === RESPONSE_CODE.USER_EXPIRED) {
                notificationContext.dispatch(openActionNotification(`Tài khoản của bạn đã hết hạn vui lòng liên hệ giáo viên của bạn hoặc admin.`, "error"))
            } else {
                notificationContext.dispatch(openActionNotification(`Tài khoản của bạn không chính xác. Vui lòng kiểm tra lại.`, "error"))
                //handle login error
            }
        } else {
            //handle empty data 
        }
    }
    return (
        <div>
            <div className="container" style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ maxWidth: 500, flex: 1 }} className="container-body">
                        <div className="container-title-login">
                            <h2>Đăng nhập</h2>
                        </div>
                        <div className="input-info">
                            <div className="input-username">
                                <TextField
                                    sx={{ width: '100%' }}
                                    id="outlined-basic"
                                    label="Tên đăng nhập"
                                    variant="outlined"
                                    value={username}
                                    onChange={(e) => setUsername(e.nativeEvent.target.value)}
                                />
                            </div>
                            <div className="input-pass">
                                <FormControl sx={{ width: '100%' }} variant="outlined">
                                    <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-password"
                                        type={showPassword ? 'text' : 'password'}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword((show) => !show)}
                                                    onMouseDown={(event) => {
                                                        event.preventDefault();
                                                    }}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Mật khẩu"
                                        value={password}
                                        onChange={(e) => setPassword(e.nativeEvent.target.value)}
                                    />
                                </FormControl>
                            </div>

                            <div className="btn-login">
                                <Button onClick={handleLogin} sx={{ width: '100%' }} variant="contained" disableElevation>
                                    Đăng nhập
                                </Button>
                            </div>
                        </div>
                        <div>Bạn chưa có tài khoản? Đăng ký <Link to="/about" >tại đây.</Link></div>
                        <div>Bạn đã quên mật khẩu? Lấy lại <Link to="/forgot-password" >tại đây.</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )

}
export default Login;