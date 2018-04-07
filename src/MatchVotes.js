import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import { getVoteDetails } from './service';

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
    const { match } = this.props;
    getVoteDetails(match.params.matchId).then(details => {
      this.setState({ details });
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Paper className={classes.root}>
          <Typography variant="headline" className={classes.title}>
            {this.state.details.team1}
          </Typography>
          <List className={classes.root} subheader={<li />}>
            {this.state.details.team1Players.map((name, i) => (
              <ListItem key={i}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Paper>
        <Paper className={classes.root}>
          <Typography variant="headline" className={classes.title}>
            {this.state.details.team2}
          </Typography>
          <List className={classes.root} subheader={<li />}>
            {this.state.details.team2Players.map((name, i) => (
              <ListItem key={i}>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </div>
    );
  }
}

export default withStyles(styles)(MatchVotes);
