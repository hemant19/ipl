import React from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

export function Header(props, state) {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="title" color="inherit">
          IPL 2018
        </Typography>
      </Toolbar>
    </AppBar>
  );
}