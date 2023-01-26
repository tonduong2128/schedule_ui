import { Container } from "@mui/material";
import { Header } from "../../components";

const AboutPage = (props) => {
    return <div>
        <Header />
        <Container>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Bạn là giáo viên muốn đăng ký tài khoản vui lòng liên hệ qua:</div>
            <ul>
                <li>Sdt: <a href="tel:tonduong2128@gmail.com">0987795761</a></li>
                <li>Email: <a href="mailto:tonduong2128@gmail.com">tonduong2128@gmail.com</a></li>
                <li>Zalo: 0987795761(<a href="https://zalo.me/0987795761" rel="noreferrer" target="_blank">Tồn dương</a>)</li>
            </ul>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Thông tin về trang web:</div>
            <ul>
                <li>Cung cấp khả năng đăng ký lịch học linh động cho học viên </li>
                <li>Cung cấp khả năng xe lịch học đã được đăng ký cho giáo viên</li>
            </ul>
            <div style={{ fontSize: 20, fontWeight: 600 }}>Phí:</div>
            <ul>
                <li>Tài khoản thường: 100k cho tài khoản giáo viên, 50k cho mỗi tài khoản học viên. </li>
                <li>Tài khoản vip: 2000k cho tài khoản giáo viên, khả năng tạo tài khoản giáo viên vô hạn.</li>
            </ul>
        </Container>
    </div>
}
export default AboutPage;