import { Container } from "@mui/material"
import { useEffect } from "react"
import { Calendar, Header } from "../../components"

const CalenderPage = (props) => {
    useEffect(() => {
        document.title = "Quản lý lịch học"
    }, [])
    return <div>
        <Header />
        <Container fixed>
            <Calendar />
        </Container>
    </div>
}
export default CalenderPage