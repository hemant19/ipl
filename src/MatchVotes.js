import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
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
  }
});

class MatchVotes extends React.Component {
  constructor() {
    super();
    this.state = {
      details: {
        team1Players: []
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
      <Paper className={classes.root}>
        <List className={classes.root} subheader={<li />}>
          {this.state.details.team1Players.map((name, i) => (
            <ListItem key={i}>
              <ListItemText primary={name} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(MatchVotes);
