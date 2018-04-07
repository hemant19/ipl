import React from 'react';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import { getVoteDetails } from './service';


const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    overflow: 'auto',
    maxHeight: 300,
  },
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
});

class MatchVotes extends React.Component {

  constructor() {
    super();
    this.state = {
      details: {}
    }
  }


  componentDidMount() {

    const { matchId } = this.props;

    getVoteDetails(matchId).then((details) => {
      this.setState({ details })
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.root}>
        <List className={classes.root} subheader={<li />}>
          {this.state.details.team1Players.map(name =>
            <ListItem>
              <ListItemText> {name} </ListItemText>
            </ListItem>
          )}
        </List>
      </Paper>
    )
  }
}

export default withStyles(styles)(MatchVotes);
