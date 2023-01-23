import { Header, HeaderHomePage } from "../../components";
import home from "../../assets/home.jpeg"
import homepc from "../../assets/background-pc.jpg"
import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";
function HomePage() {
    return (
        <div>
            <Header />
            <Container fixed>
                <div className="container-home-page">
                    <div className='background-home'>
                        <img
                            src={isMobile ? home : homepc}
                            className="background-container"
                            style={{ width: "100%", objectFit: "cover" }}
                        />
                    </div>
                    <div className="container-title-regis">
                        {
                            isMobile && <span>
                                Cùng bạn bứt phá <br></br>
                                mọi giới hạn
                            </span>
                        }
                        {
                            isMobile &&
                            <div style={{ textAlign: "center" }}>
                                <Link to="/calendar">
                                    <Button variant="contained" disableElevation>
                                        Xem lịch học
                                    </Button>
                                </Link>
                            </div>
                        }

                    </div>
                </div>
            </Container>
        </div>
    )

}
export default HomePage;