import React, { useState, useEffect } from "react";
import { Nav } from "react-bootstrap";
import { useHistory, NavLink, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/auth";
import PropTypes from "prop-types";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  IconButton,
  Drawer,
  MenuItem,
  useScrollTrigger,
  Slide,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";

import { fade } from "@material-ui/core/styles";

import "./Header.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiPaper-root": {
      backgroundColor: "#333",
    },
  },
  header: {
    marginBottom: "30px",
    backgroundColor: "#444",
    padding: "5px 25px",
  },
  logo: {
    fontFamily: "Work Sans, sans-serif",
    fontWeight: 600,
    color: "#FFFEFE",
    textAlign: "left",
  },
  menuButton: {
    fontFamily: "Open Sans, sans-serif",
    fontWeight: 700,
    size: "18px",
    marginLeft: "38px",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  drawerContainer: {
    fontWeight: "bold",
    padding: "20px 30px",
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
  },
  searchIcon: {
    // padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // zIndex: 5
    color: "white",
  },
  IconSearch: {
    color: "white",
    // maxHeight: '32px',
    // maxWidth: '32px',
    maxHeight: "36px",
    maxWidth: "36px",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    // padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    // paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
    minWidth: "220px",
    // paddingRight: '8px',
    paddingLeft: "12px",
  },
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

const Header = ({ user, setUser, filterChanged, props }) => {
  const history = useHistory();
  const {
    root,
    header,
    logo,
    menuButton,
    toolbar,
    drawerContainer,
    search,
    searchIcon,
    inputRoot,
    inputInput,
  } = useStyles();

  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 1200
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={toolbar}>
        <NavLink to="/" className="header__logo" onClick={filterChanged}>
          {/* <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" /> */}
          <Typography variant="h6" component="h1" className={logo}>
            StarLabs Task
          </Typography>
        </NavLink>

        {/* Navigation */}
        <Nav className="header__links">
          <NavLink to="/" className="header__option">
            Products
          </NavLink>

          {currentUser ? (
            <>
              <NavLink to="/createproduct" className="header__option">
                Create Product
              </NavLink>
              <NavLink to="/login" className="header__option" onClick={logOut}>
                Log Out
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={"/login"} className="logged__out">
                Log In
              </NavLink>

              <NavLink to={"/register"} className="logged__out--signup">
                Sign Up
              </NavLink>
            </>
          )}
        </Nav>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar className="mobile__responsive">
        <NavLink to="/" className="header__logo" onClick={filterChanged}>
          {/* <img src={ninjsLogo} alt="ninjs logo" width="45" height="45" /> */}
        </NavLink>
        <IconButton
          {...{
            edge: "start",
            color: "inherit",
            "aria-label": "menu",
            "aria-haspopup": "true",
            onClick: handleDrawerOpen,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          {...{
            anchor: "left",
            open: drawerOpen,
            onClose: handleDrawerClose,
          }}
          className={root}
        >
          <div className={drawerContainer}>{getDrawerChoices()}</div>
        </Drawer>
      </Toolbar>
    );
  };

  const getDrawerChoices = () => {
    return (
      <Nav className="nav__mobile">
        <NavLink to="/" className="header__option">
          Home
        </NavLink>
        <NavLink to="/products" className="header__option">
          Products
        </NavLink>
        {currentUser ? (
          <>
            <NavLink to="/login" className="header__option" onClick={logOut}>
              LogOut
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to={"/login"} className="header__option">
              LogIn
            </NavLink>
            <NavLink to="/register" className="header__option">
              SignUp
            </NavLink>
          </>
        )}
      </Nav>
    );
  };

  return (
    <>
      <header className="main__header">
        <React.Fragment>
          <HideOnScroll {...props}>
            <AppBar className={header}>
              {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
          </HideOnScroll>
        </React.Fragment>
      </header>
    </>
  );
};

export default Header;
