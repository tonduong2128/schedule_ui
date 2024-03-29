import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RESPONSE_CODE } from '../../common';
import { closeActionLoading, LoadingContext, openActionLoading } from '../../reducer/loading';
import { NotificationContext, openActionNotification } from '../../reducer/notification';
import Auth from '../../services/auth';

export default function VerticalLinearStepper() {
    const navigator = useNavigate();
    const [step, setStep] = useState(1);
    const [otpCode, setOtpCode] = useState("");
    const [username, setUsername] = useState("");
    const [phoneOrEmail, setPhoneOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [repassword, setRepassword] = useState("");
    const [showRepassword, setShowRepassword] = useState(false);
    const notificationContext = useContext(NotificationContext);
    const loadingContext = useContext(LoadingContext);
    const [focusTag, setFocusTag] = useState("username");

    const handleNext = useCallback(async (step) => {
        if (step === 1) {
            if (!username) {
                notificationContext.dispatch(openActionNotification("Tên đăng nhập không được bỏ trống.", "error"))
                setFocusTag("username")
                return
            }
            if (!phoneOrEmail) {
                notificationContext.dispatch(openActionNotification("Email không được bỏ trống.", "error"))
                setFocusTag("phoneOrEmail")
                return
            }
            loadingContext.dispatch(openActionLoading())
            const respose = await Auth.reset({
                user: {
                    username: username,
                    email: phoneOrEmail
                }
            })
            loadingContext.dispatch(closeActionLoading())
            if (respose.code === RESPONSE_CODE.SUCCESS) {
                setStep(step => step + 1);
            } else {
                notificationContext.dispatch(openActionNotification("Tài khoản cung cấp không chính xác. Vui lòng kiểm tra lại.", "error"))
            }
        } else if (step === 2) {
            if (!otpCode) {
                notificationContext.dispatch(openActionNotification("Opt mã không được bỏ trống.", "error"))
                setFocusTag("otpCode")
                return
            }
            loadingContext.dispatch(openActionLoading())
            const respose = await Auth.reset({
                optCode: otpCode,
                user: {
                    username: username,
                    email: phoneOrEmail
                }
            })
            loadingContext.dispatch(closeActionLoading())
            if (respose.code === RESPONSE_CODE.SUCCESS) {
                setStep(step => step + 1);
            } else {
                notificationContext.dispatch(openActionNotification("Opt mã không chính xác.", "error"))
            }
        } else if (step === 3) {
            if (!password) {
                notificationContext.dispatch(openActionNotification("Mật khẩu không được bỏ trống.", "error"))
                setFocusTag("password")
                return
            }
            if (!repassword) {
                notificationContext.dispatch(openActionNotification("Nhập lại mật khẩu không được bỏ trống.", "error"))
                setFocusTag("repassword")
                return
            }
            if (!!repassword && password !== repassword) {
                notificationContext.dispatch(openActionNotification("Nhập lại mật khẩu không giống.", "error"))
                setFocusTag("repassword")
                return
            }
            loadingContext.dispatch(openActionLoading())
            const respose = await Auth.reset({
                optCode: otpCode,
                user: {
                    username: username,
                    email: phoneOrEmail,
                    password,
                }
            })
            loadingContext.dispatch(closeActionLoading())
            if (respose.code === RESPONSE_CODE.SUCCESS) {
                navigator("/login", {
                    state: {
                        stateNotify: {
                            open: true,
                            message: "Vui lòng đăng nhập lại.",
                            type: "success"
                        }
                    }
                })
            } else {
                notificationContext.dispatch(openActionNotification("Đã xảy ra lỗi vui lòng thử lại sau.", "error"))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otpCode, password, phoneOrEmail, repassword, username]);
    useEffect(() => {
        window.onkeyup = e => {
            if (e.code === "Enter") {
                handleNext(step)
            }
            return () => window.onkeyup = () => { }
        }
    }, [handleNext, step])
    return (
        <div>
            <div className="container" style={{ textAlign: "center" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <div style={{ maxWidth: 500, flex: 1 }} className="container-body">
                        <div className="container-title-login">
                            <h2>Quên mật khẩu</h2>
                        </div>
                        <div hidden={step !== 1}>
                            <TextField
                                inputRef={input => focusTag === "username" && input && input.focus()}
                                style={{ margin: 10 }}
                                sx={{ width: '100%' }}
                                id="username"
                                label="Tên đăng nhập"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.nativeEvent.target.value?.replace(/ /g, ""))}
                            />
                            <TextField
                                inputRef={input => focusTag === "phoneOrEmail" && input && input.focus()}
                                style={{ margin: 10 }}
                                sx={{ width: '100%' }}
                                id="email-phone"
                                label="Email tài khoản đăng ký"
                                variant="outlined"
                                value={phoneOrEmail}
                                onChange={(e) => setPhoneOrEmail(e.nativeEvent.target.value?.replace(/ /g, ""))}
                            />
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleNext(1)}
                                >
                                    Tiếp tục
                                </Button>
                            </div>
                        </div>
                        <div hidden={step !== 2}>
                            <TextField
                                inputRef={input => focusTag === "otpCode" && input && input.focus()}
                                style={{ margin: 10 }}
                                sx={{ width: '100%' }}
                                id="otp"
                                label="Nhập otp nhận từ email."
                                variant="outlined"
                                value={otpCode}
                                onChange={(e) => setOtpCode(e.nativeEvent.target.value?.replace(/ /g, ""))}
                            />
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleNext(2)}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                        <div hidden={step !== 3}>
                            <FormControl
                                style={{ margin: 10, width: '100%' }}
                                variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">Mật khẩu</InputLabel>
                                <OutlinedInput
                                    inputRef={input => focusTag === "password" && input && input.focus()}
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowPassword(show => !show)}
                                                onMouseDown={event => {
                                                    event.preventDefault();
                                                }}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.nativeEvent.target.value)}
                                />
                            </FormControl>
                            <FormControl
                                style={{ margin: 10, width: '100%' }}
                                variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-repassword">Nhập lại mật khẩu</InputLabel>
                                <OutlinedInput
                                    inputRef={input => focusTag === "repassword" && input && input.focus()}
                                    id="outlined-adornment-repassword"
                                    type={showRepassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={() => setShowRepassword(show => !show)}
                                                onMouseDown={event => {
                                                    event.preventDefault();
                                                }}
                                                edge="end"
                                            >
                                                {showRepassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Mật khẩu"
                                    value={repassword}
                                    onChange={(e) => setRepassword(e.nativeEvent.target.value)}
                                />
                            </FormControl>
                            <div style={{ textAlign: "right" }}>
                                <Button
                                    variant="contained"
                                    onClick={() => handleNext(3)}
                                >
                                    Xác nhận
                                </Button>
                            </div>
                        </div>
                        <div>Nhấn <Link to="/login" >tại đây</Link> để đăng nhập.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
