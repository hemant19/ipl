import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import AccountCircle from 'material-ui-icons/AccountCircle';
import ExitToApp from 'material-ui-icons/ExitToApp';
import { withRouter } from 'react-router-dom';

const styles = {
  root: {
    'flex-grow': 1
  },
  title: {
    flex: 1
  }
};

function Header(props, state) {
  const { loggedIn, onLogout, classes, history } = props;

  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography
          variant="title"
          color="inherit"
          className={classes.title}
          onClick={_ => history.push('/')}
        >
          IPL 2018
        </Typography>
        {loggedIn ? (
          <IconButton color="inherit" onClick={e => onLogout()}>
            <ExitToApp />
          </IconButton>
        ) : (
          <IconButton color="inherit" onClick={_ => history.push('/login')}>
            <AccountCircle />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(withStyles(styles)(Header));
