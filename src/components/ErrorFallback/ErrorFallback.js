import { Button } from "@mui/material";
import { Link } from "react-router-dom";

function ErrorFallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert">
            <p>LỖI KHÔNG MONG MUỐN. VUI LÒNG THỬ LẠI</p>
            <pre hidden>{error.message}</pre>
            <Link to="/">
                <Button variant="contained" onClick={e => {
                    resetErrorBoundary(e);
                }}>Quay lại trang chủ</Button>
            </Link>
        </div>
    )
}
export default ErrorFallback