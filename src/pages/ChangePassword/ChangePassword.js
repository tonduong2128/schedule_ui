import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Alert, Container, Slide, Snackbar } from "@mui/material";
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RESPONSE_CODE } from "../../common/constantsUiAndApi";
import { Header } from "../../components";
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import Auth from "../../services/auth";

function ChangePassword() {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [showPassword, setShowPassword] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showRetypePassword, setShowRetypePassword] = useState(false);

    const [oldPassword, setOldPasswd] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);
    const [focusTag, setFocusTag] = useState("oldPassword");


    useEffect(() => {
        const { stateNotify } = state || {};
        stateNotify && notificationContext.dispatch(openActionNotification(stateNotify.message, stateNotify.type))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state])
    const handleSubmit = useCallback(async () => {
        if (!oldPassword) {
            notificationContext.dispatch(openActionNotification("Mật khẩu cũ không được bỏ trống.", "error"))
            setFocusTag("oldPassword")
            return
        }
        if (!password) {
            notificationContext.dispatch(openActionNotification("Mật khẩu mới không được bỏ trống.", "error"))
            setFocusTag("password")
            return
        }
        if (!retypePassword) {
            notificationContext.dispatch(openActionNotification("Nhập lại mật khẩu mới không được bỏ trống.", "error"))
            setFocusTag("retypePassword")
            return
        }
        if (password !== retypePassword) {
            notificationContext.dispatch(openActionNotification("Nhập lại mật khẩu mới không giống", "warning"))
            setFocusTag("retypePassword")
            return;
        }
        loadingContext.dispatch(openActionLoading())
        const response = await Auth.changePassword(oldPassword, password)
        loadingContext.dispatch(closeActionLoading())
        const { code } = response;
        if (code === RESPONSE_CODE.SUCCESS) {
            navigate("/")
        } else if (code === RESPONSE_CODE.OLD_PASSWORD_NOT_MATCH) {
            notificationContext.dispatch(openActionNotification("Mật khẩu cũ không đúng", "warning"))
        } else {
            notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau.", "error"))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oldPassword, password, retypePassword])
    useEffect(() => {
        window.onkeyup = e => {
            if (e.code === "Enter") {
                handleSubmit()
            }
            return () => window.onkeyup = () => { }
        }
    }, [handleSubmit])
    return (
        <div>
            <Header />
            <Container fixed>
                <div className="container" style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ maxWidth: 500, flex: 1 }} className="container-body">
                            <div className="container-title-login" >
                                <h2 style={{ paddingTop: 10 }}>Đổi mật khẩu</h2>
                            </div>
                            <div className="input-info">
                                <div className="input-pass">
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel htmlFor="oldPassword">Mật khẩu cũ</InputLabel>
                                        <OutlinedInput
                                            onFocus={() => setFocusTag("oldPassword")}
                                            inputRef={input => focusTag === "oldPassword" && input && input.focus()}
                                            id="oldPassword"
                                            type={showOldPassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowOldPassword((show) => !show)}
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        edge="end"
                                                    >
                                                        {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Mật khẩu cũ"
                                            value={oldPassword}
                                            onChange={(e) => setOldPasswd(e.nativeEvent.target.value)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="input-pass">
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel htmlFor="password">Mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            onFocus={() => setFocusTag("password")}
                                            inputRef={input => focusTag === "password" && input && input.focus()}
                                            id="password"
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
                                            label="Mật khẩu mới"
                                            value={password}
                                            onChange={(e) => setPassword(e.nativeEvent.target.value)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="input-pass">
                                    <FormControl sx={{ width: '100%' }} variant="outlined">
                                        <InputLabel htmlFor="retypePassword">Nhập lại mật khẩu mới</InputLabel>
                                        <OutlinedInput
                                            onFocus={() => setFocusTag("retypePassword")}
                                            inputRef={input => focusTag === "retypePassword" && input && input.focus()}
                                            id="retypePassword"
                                            type={showRetypePassword ? 'text' : 'password'}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => setShowRetypePassword((show) => !show)}
                                                        onMouseDown={(event) => {
                                                            event.preventDefault();
                                                        }}
                                                        edge="end"
                                                    >
                                                        {showRetypePassword ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Nhập lại mật khẩu mới"
                                            value={retypePassword}
                                            onChange={(e) => setRetypePassword(e.nativeEvent.target.value)}
                                        />
                                    </FormControl>
                                </div>
                                <div className="btn-login">
                                    <Button onClick={handleSubmit} sx={{ width: '100%' }} variant="contained" disableElevation>
                                        Lưu
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </div>
    )

}
export default ChangePassword;