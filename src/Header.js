import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';

import Typography from 'material-ui/Typography';

export function Header(props, state) {
  const { loggedIn, onLogout } = props;

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">
          IPL 2018
        </Typography>
        {loggedIn ? <Button color="inherit" onClick={e => onLogout()}>Logout</Button> : null}
      </Toolbar>
    </AppBar>
  );
}