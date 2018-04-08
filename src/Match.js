import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent, CardActions } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';
import { withRouter } from 'react-router-dom';

const styles = theme => ({
  card: {
    minWidth: 275,
    margin: '10px'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary
  }
});

function SimpleCard(props) {
  const {
    classes,
    onTeamSelected,
    history,
    onMatchVotingClosed,
    isAdmin
  } = props;
  const {
    matchId,
    team1,
    team2,
    location,
    selection,
    votingClosed,
    date
  } = props.matchData;

  const handleViewSelections = matchId => e => {
    history.push(`/matches/${matchId}`);
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}>{date.toString()}</Typography>
          <Typography variant="headline" component="h2">
            {team1} vs {team2}
          </Typography>
          <Typography className={classes.pos}>{location}</Typography>

          {!votingClosed ? (
            <FormControl
              component="fieldset"
              required
              className={classes.formControl}
            >
              <FormLabel component="legend">Make a choice</FormLabel>
              <RadioGroup
                aria-label="My Team"
                name="myTeam"
                className={classes.group}
                value={selection}
                onChange={(event, value) => onTeamSelected(value)}
              >
                <FormControlLabel
                  value={team1}
                  control={<Radio color="primary" />}
                  label={team1}
                />
                <FormControlLabel
                  value={team2}
                  control={<Radio color="primary" />}
                  label={team2}
                />
              </RadioGroup>
            </FormControl>
          ) : (
            <Typography>
              {' '}
              The voting has closed. Your selection - {selection}
            </Typography>
          )}
          <CardActions>
            {votingClosed ? (
              <Button size="small" onClick={handleViewSelections(matchId)}>
                View selection
              </Button>
            ) : null}
            {isAdmin && !votingClosed ? (
              <Button size="small" onClick={() => onMatchVotingClosed()}>
                Close Voting
              </Button>
            ) : null}
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SimpleCard));
