import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROLE } from '../../common/constantsUiAndApi';
import { getUser } from '../../utils';

const settings = [
    {
        name: 'Tài khoản',
        to: "/profile"
    },
    {
        name: 'Đổi mật khẩu',
        to: "/change-password"
    },
    {
        name: 'Đăng xuất',
        to: "/logout"
    }
];
const handleSelectHeader = () => {
    const user = getUser();
    const roleIds = user.Roles.map(r => r.id);
    if (roleIds.includes(ROLE.student)) {
        return [
            {
                name: "Lịch",
                to: "/calendar"
            }
        ]
    } else if (roleIds.includes(ROLE.teacher)) {
        return [
            {
                name: "Lịch",
                to: "/calendar"
            },
            {
                name: "Loại xe",
                to: "/vehicle-type"
            }
        ];
    } else {
        return [
            {
                name: "Lịch",
                to: "/calendar"
            },
            {
                name: "Người dùng",
                to: "/page"
            },
            {
                name: "Loại xe",
                to: "/vehicle-type"
            }
        ];
    }
}
function Header() {
    const [pages, setPages] = useState(handleSelectHeader)
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <DriveEtaIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TRANG CHỦ
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <Link key={page.to} to={page.to} style={{ color: "#000", textDecoration: "none" }}>
                                    <MenuItem key={page.to} onClick={handleCloseNavMenu}>
                                        <Typography textAlign="center">{page.name}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                    <DriveEtaIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                        <Typography
                            variant="h5"
                            noWrap
                            component=""
                            href=""
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TRANG CHỦ
                        </Typography>
                    </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Link key={page.to} to={page.to} style={{ color: "#fff", textDecoration: "none" }}>
                                <Button
                                    key={page.to}
                                    onClick={handleCloseNavMenu}
                                    sx={{ my: 2, color: 'white', display: 'block' }}
                                >
                                    {page.name}
                                </Button>
                            </Link>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <AccountCircleIcon style={{ fontSize: 36, color: "#fff" }} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <Link key={setting.to} to={setting.to} style={{ color: "#000", textDecoration: "none" }}>
                                    <MenuItem key={setting.to} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting.name}</Typography>
                                    </MenuItem>
                                </Link>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;