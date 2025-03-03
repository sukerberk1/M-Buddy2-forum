import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { GMobiledata,  Logout,  Notifications,  School, SmartToy } from '@mui/icons-material';
import { Avatar, Badge, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, List, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';
import { NavBarCustomIconButton, StyledListSubheader, StyledSwipeableDrawer } from './NavBar-customelements';
import { pages, unloggedUserOptions, loggedUserOptions } from "../pages.config"



function NavBar(props) {

  const [ ResponsiveNav, setResponsiveNav] = React.useState(null);
  const [ userMenu, setUserMenu ] = React.useState(null);
  const [ logoutDialog, setLogoutDialog ] = React.useState(false);
  const { accessToken, loggedUser, logoutUser } = React.useContext(AuthContext);

  const handleOpenNavMenu = (event) => {
    setResponsiveNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setResponsiveNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setUserMenu(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    setUserMenu(null);
  };

  const handleLogoutDialog = () => {
    setLogoutDialog(!logoutDialog);
  }

  return (
    <AppBar position="sticky" sx={{backgroundColor: "#262626;", boxShadow: 'none'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <School sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: "#65a30d"}} />
          <Typography
            variant="h6"
            noWrap
            LinkComponent={Link} to="/"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GUIDANCE
          </Typography>

            {/* --- this box handles mobile version  ---*/}
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

            <StyledSwipeableDrawer
              anchorEl={ResponsiveNav}
              open={Boolean(ResponsiveNav)}
              onClose={handleCloseNavMenu}
            >
              <GMobiledata sx={{color: "#52525b", fontSize: 72, textAlign: 'center'}}/>
              <List>
              {pages.map(page=>(
                <ListItemButton component={Link} to={page.link} onClick={handleCloseNavMenu}>
                    <ListItemIcon sx={{color: 'white'}}>
                      {page.icon}
                    </ListItemIcon>
                    <ListItemText>{page.title}</ListItemText>
                </ListItemButton>
              ))}
              <Divider/>
              {accessToken ? 
              (<StyledListSubheader color='inherit'>Hej, {loggedUser.username}</StyledListSubheader>) 
              : (<StyledListSubheader>Jesteś niezalogowany/a</StyledListSubheader>)}
              {accessToken ? (<>
                {loggedUserOptions.map((opt => (<>
                <ListItemButton component={Link} to={`users/${loggedUser.username}${opt.link}`} onClick={handleCloseNavMenu}>
                    <ListItemIcon sx={{color: 'white'}}>
                      {opt.icon}
                    </ListItemIcon>
                    <ListItemText>{opt.title}</ListItemText>
                </ListItemButton>
                </>)))}
                <ListItemButton onClick={()=>{handleCloseNavMenu(); handleLogoutDialog();}}>
                    <ListItemIcon sx={{color: 'white'}}>
                      <Logout/>
                    </ListItemIcon>
                    <ListItemText>Wyloguj się</ListItemText>
                </ListItemButton>
                </>
              ) : (
              unloggedUserOptions.map((opt) => (<>
              <ListItemButton component={Link} to={opt.link} onClick={handleCloseNavMenu}>
                  <ListItemIcon sx={{color: 'white'}}>
                    {opt.icon}
                  </ListItemIcon>
                  <ListItemText>{opt.title}</ListItemText>
              </ListItemButton>
              </>
              )))}
              </List>
            </StyledSwipeableDrawer>
          </Box>

          <School sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, color: "#65a30d"}} />
          <Typography
            variant="h5"
            noWrap
            LinkComponent={Link} to="/"
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
            GUIDANCE
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
                <NavBarCustomIconButton option={page}/>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            {accessToken ? (<>
              <IconButton
              size="large"
              aria-label="show 17 new notifications"
              color="inherit"
            >
              <Badge badgeContent={17}>
                <Notifications/>
              </Badge>
            </IconButton>
              <Tooltip title="Panel konta">
              <IconButton onClick={handleOpenUserMenu} >
                <Avatar alt={loggedUser.username} src={`http://127.0.0.1:8000/${loggedUser.avatar}`} />
              </IconButton>
              </Tooltip>
              </>
            ) : (
              unloggedUserOptions.map((opt) => (
                  <NavBarCustomIconButton option={opt}/>
              ))
            )}

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={userMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(userMenu)}
              onClose={handleCloseUserMenu}
            >
              {loggedUserOptions.map((opt) => (
                <MenuItem key={opt.title} onClick={handleCloseUserMenu} component={Link} to={`users/${loggedUser.username}${opt.link}`}>
                  <Typography textAlign="center">{opt.title}</Typography>
                </MenuItem>
              ))}
              <MenuItem key={"Logout"} onClick={handleLogoutDialog}>
                  <Typography textAlign="center">Wyloguj się</Typography>
              </MenuItem>
            </Menu>
              
              {/** logout dialog */}
            <Dialog
              open={logoutDialog}
              onClose={handleLogoutDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Na pewno chcesz się wylogować?"}
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Nastąpi wylogowanie z konta @{loggedUser.username}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleLogoutDialog}>Anuluj</Button>
                <Button onClick={()=>{handleLogoutDialog();logoutUser();}} autoFocus>
                  Wyloguj
                </Button>
              </DialogActions>
            </Dialog>

          </Box>
          
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default NavBar;