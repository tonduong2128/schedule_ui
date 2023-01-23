import { Box, Button, Checkbox, Drawer, FormControlLabel, FormGroup, Grid, List } from "@mui/material"
import { memo, useEffect, useState } from "react"
import SettingsIcon from '@mui/icons-material/Settings';

const PageSidebar = ({ option1 = {
    label: "",
    defaultValue: [],
    values: [],
    code: "",
}, onChange1, option2 = {
    label: "",
    defaultValue: [],
    values: [],
    code: "",
}, onChange2, ...props }) => {
    const [open, setOpen] = useState()
    let [value1, setValue1] = useState(JSON.parse(localStorage.getItem(option1.code)) || option1.defaultValue)
    let [value2, setValue2] = useState(JSON.parse(localStorage.getItem(option2.code)) || option2.defaultValue)
    const handleOption1 = (event, code) => {
        const checked = event.nativeEvent.target.checked;
        if (checked) {
            value1.push(code)
        } else {
            value1 = value1.filter(i => i !== code)
        }
        localStorage.setItem(option1.code, JSON.stringify(value1))
        setValue1([...value1])
        !!onChange1 && onChange1(value1)
    }
    const handleOption2 = (event, code) => {
        const checked = event.nativeEvent.target.checked;
        if (checked) {
            value2.push(code)
        } else {
            value2 = value2.filter(i => i !== code)
        }
        localStorage.setItem(option2.code, JSON.stringify(value2))
        setValue2([...value2])
        !!onChange2 && onChange2(value2)
    }
    useEffect(() => {
        !!onChange1 && onChange1(value1)
        !!onChange2 && onChange2(value2)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const resetSidebar = () => {
        setValue1([...option1.defaultValue])
        !!onChange1 && onChange1([...option1.defaultValue])
        localStorage.setItem(option1.code, JSON.stringify(option1.defaultValue))
        setValue2([...option2.defaultValue])
        !!onChange2 && onChange2([...option2.defaultValue])
        localStorage.setItem(option2.code, JSON.stringify(option2.defaultValue))
    }
    return <div >
        <div onClick={() => setOpen(true)}>
            <SettingsIcon />
        </div>
        <Drawer
            key={"right"}
            anchor={"right"}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box
                style={{ paddingLeft: 28, width: 320 }}
                role="presentation"
            >
                <List>
                    <div style={{ fontSize: 20, color: "#000" }}>{option1.label}</div>
                </List>
                <List>
                    <Grid container>
                        {
                            option1.values.map(value => {
                                return <Grid item key={value.code}
                                    xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormControlLabel
                                        control={<Checkbox
                                            size="small"
                                            checked={value1.includes(value.code)}
                                            onChange={(event) => handleOption1(event, value.code)} />}
                                        label={<span style={{ fontSize: 14 }}>{value.label}</span>} />
                                </Grid>
                            })
                        }
                    </Grid>
                </List>
                <List>
                    <div style={{ fontSize: 20, color: "#000" }}>{option2.label}</div>
                </List>
                <List>
                    <Grid container>
                        {
                            option2.values.map(value => {
                                return <Grid item key={value.code}
                                    xs={6} sm={6} md={6} lg={6} xl={6}>
                                    <FormControlLabel

                                        control={<Checkbox
                                            size="small"
                                            checked={value2.includes(value.code)}
                                            onChange={event => handleOption2(event, value.code)} />}
                                        label={<span style={{ fontSize: 14 }}>{value.label}</span>} />
                                </Grid>
                            })
                        }
                    </Grid>
                </List>
                <List>
                    <Button variant="contained" size="small" onClick={() => resetSidebar()}>
                        Đặt lại
                    </Button>
                </List>
            </Box >
        </Drawer>
    </div >

}

export default memo(PageSidebar)