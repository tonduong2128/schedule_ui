import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
    const navigate = useNavigate()
    return (
        <div role="alert">
            <p>LỖI KHÔNG MONG MUỐN. VUI LÒNG THỬ LẠI</p>
            <pre hidden>{error.message}</pre>
            <Button variant="contained" onClick={e => {
                resetErrorBoundary(e);
                navigate("/")
            }}>Quay lại trang chủ</Button>
        </div>
    )
}
export default ErrorFallback