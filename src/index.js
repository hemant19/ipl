import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#f05545",
      main: "#b71c1c",
      dark: "#7f0000",
    }
  }
});

ReactDOM.render((
  <MuiThemeProvider theme={theme}>
      <App />
  </MuiThemeProvider>
), document.getElementById('root'));
registerServiceWorker();
