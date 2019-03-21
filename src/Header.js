import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ExitToApp from '@material-ui/icons/ExitToApp';
import { withRouter } from 'react-router-dom';

const styles = {
  root: {
    'flex-grow': 1
  },
  title: {
    flex: 1
  }
};

function Header({ loggedIn, onLogout, classes, history }) {
  return (
    <AppBar position="static" className={classes.root}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          className={classes.title}
          onClick={_ => history.push('/')}
        >
          IPL 2019
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
