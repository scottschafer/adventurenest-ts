import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EjectIcon from '@material-ui/icons/Eject';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import firebaseApp from '../firebase/Firebase';
import { RouteComponentProps, withRouter } from 'react-router-dom';

interface P {
  loggedin: boolean;
  history: { push(h: string): void };
  classes?: any;
}

interface S {
}

const styles = (theme: any) => ({
  root: {
    width: '100%',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  // search: {
  //   position: 'relative',
  //   borderRadius: theme.shape.borderRadius,
  //   backgroundColor: fade(theme.palette.common.white, 0.15),
  //   '&:hover': {
  //     backgroundColor: fade(theme.palette.common.white, 0.25),
  //   },
  //   marginRight: theme.spacing.unit * 2,
  //   marginLeft: 0,
  //   width: '100%',
  //   [theme.breakpoints.up('sm')]: {
  //     marginLeft: theme.spacing.unit * 3,
  //     width: 'auto',
  //   },
  // },
  // searchIcon: {
  //   width: theme.spacing.unit * 9,
  //   height: '100%',
  //   position: 'absolute',
  //   pointerEvents: 'none',
  //   display: 'flex',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: { // was md
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: { // was md
      display: 'none',
    },
  },
});

// type RouteParams = {
//   teamId: string; // must be type string since route params
// }

// interface Props extends RouteComponentProps<RouteParams>, React.Props<RouteParams> {
//   loggedin: boolean;
//   history: any;
//   location: any;
//   match: any;
// }

// type State = {
//   //  players: Array<Player>;
// }

// interface NavbarProps extends RouteComponentProps<any> {
//   loggedin: boolean;
// }


class Navbar extends React.Component<P, S> {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  constructor(public props: P) {
    super(props);
  }

  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  };

  // handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   this.setState({ anchorEl: event.currentTarget });
  // };
  handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    //    handleMobileMenuOpen = (event: MouseEvent) => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleSignout = () => {
    let history = this.props.history;
    firebaseApp.auth().signOut().then(() => {
      console.log("sign out succesful");
      //debugger;
      //history.push('/login');
      this.props.history.push('/login');
    }, function (error) {
      console.log("an error happened");
    });
  };

  // render() {
  //   debugger;
  //   return <div>Hi</div>;
  // }
  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const { classes } = this.props;
    //const classes = this.props;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <MailIcon />
            </Badge>
          </IconButton>
          <p>Messages</p>
        </MenuItem>
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={11} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color="inherit">
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
        <MenuItem onClick={this.handleSignout}>
          <IconButton color="inherit">
            <EjectIcon />
          </IconButton>
          <p>Sign out</p>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              AdventureNest
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit">
                <AccountCircle />
              </IconButton>

              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleSignout}
                color="inherit">
                <EjectIcon />
            </IconButton>

            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit">
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </div>
    );
  }
}

// Navbar.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// function mapStateToProps(state: any, ownProps: NavbarProps): NavbarProps => {
//   // Map state to props (add the properties after the spread)
//   return { ...ownProps };
// }

export default withStyles(styles)(Navbar);//withRouter(Navbar));

// import React, { Component } from 'react';
// import { Link, hashHistory } from 'react-router-dom'
// import firebaseApp from './firebase/Firebase';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faHome } from '@fortawesome/free-solid-svg-icons';

// class Navbar extends Component {
//   constructor(props) {
//     super(props);
//     //
//     this.signout = this.signout.bind(this);
//   }
//   signout() {
//     firebaseApp.auth().signOut().then(function () {
//       console.log("sign out succesful");
//       hashHistory.push('/login');
//     }, function (error) {
//       console.log("an error happened");
//     });
//   }
//   render() {
//     var loginButton;
//     var signup;
//     if (this.props.loggedin) {
//       loginButton = <button className="btn btn-default" onClick={this.signout}>Logout</button>;
//       signup = "";
//     } else {
//       loginButton = <Link to="/login"><button className="btn btn-default">login</button></Link>;
//       signup = <Link to="/signup"><button className="btn btn-default">Sign up</button></Link>;
//     }
//     return (
//       <div className="Navbar">
//         <Link to="/"><button className="btn btn-default"><FontAwesomeIcon icon={faHome} />
//         </button></Link>
//         {loginButton}
//         {signup}

//       </div>
//     );
//     // <Link to="/dashboard"><button className="btn btn-default dash-btn">Dashboard</button></Link>
//   }
// }

// export default Navbar;
