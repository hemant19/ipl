import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import List, { ListItem, ListItemText } from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Share from '@material-ui/icons/Share';
import LinearProgress from '@material-ui/core/LinearProgress';

import { getVoteDetails } from './api';

const styles = theme => ({
  root: {
    margin: '10px',
    backgroundColor: theme.palette.background.paper,
    position: 'relative'
  },
  listSection: {
    backgroundColor: 'inherit'
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0
  },
  title: {
    padding: '10px'
  },
  button: {
    position: 'fixed',
    bottom: '10px',
    right: '10px'
  }
});

class MatchVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      details: {
        team1: '',
        team2: '',
        team1Players: [],
        team2Players: []
      }
    };
  }

  componentDidMount() {
    const { match, user } = this.props;
    const isAdmin = user && user.role && user.role.admin;
    getVoteDetails(isAdmin, match.params.matchId).then(details => {
      this.setState({ details });
    });
  }

  shareCurrentPage = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${this.state.details.team1} vs ${this.state.details.team2}`,
          url: window.location.href
        })
        .then(() => console.log('Successful share'))
        .catch(error => console.log('Error sharing', error));
    } else {
      console.log('No Share available!');
    }
  };

  render() {
    const { classes } = this.props;
    const { details } = this.state;

    if (
      details.team1Players.length === 0 &&
      details.team2Players.length === 0
    ) {
      return <LinearProgress />;
    }

    const shareAvailable = !!navigator.share;
    const team1Points = parseFloat(
      details.team2Players.length * 50.0 / details.team1Players.length
    ).toFixed(2);
    const team2Points = parseFloat(
      details.team1Players.length * 50.0 / details.team2Players.length
    ).toFixed(2);

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Paper>
              <Typography
                className={classes.title}
                variant="title"
                component="p"
              >
                {details.team1}: <b>{team1Points}</b>
              </Typography>
              <Typography
                className={classes.title}
                variant="title"
                component="p"
              >
                {details.team2}: <b>{team2Points}</b>
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Typography variant="headline" className={classes.title}>
                {details.team1}
              </Typography>
              <List className={classes.root} subheader={<li />}>
                {details.team1Players.map((name, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <Typography variant="headline" className={classes.title}>
                {this.state.details.team2}
              </Typography>
              <List subheader={<li />}>
                {this.state.details.team2Players.map((name, i) => (
                  <ListItem key={i}>
                    <ListItemText primary={name} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {shareAvailable ? (
          <Button
            variant="fab"
            color="primary"
            aria-label="add"
            className={classes.button}
            onClick={this.shareCurrentPage}
          >
            <Share />
          </Button>
        ) : null}
      </div>
    );
  }
}

export default withStyles(styles)(MatchVotes);
