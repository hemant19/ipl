import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Typography,
  FormControl,
  FormControlLabel,
  FormLabel
} from '@material-ui/core';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = theme => ({
  root: {},
  date: {
    fontSize: 14,
    color: theme.palette.text.secondary
  },
  location: {
    color: theme.palette.text.secondary
  }
});

const renderVotingForm = (team1, team2, vote, isVoting, onVote, classes) => {
  return (
    <div>
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
          value={vote}
          onChange={(event, value) => onVote(value)}
        >
          <FormControlLabel
            value={team1}
            control={<Radio color="primary"/>}
            label={team1}
            disabled={isVoting}
          />
          <FormControlLabel
            value={team2}
            control={<Radio color="primary"/>}
            label={team2}
            disabled={isVoting}
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
};

function renderVote(vote) {
  return vote ?
    <Typography component="p">Your Vote -
      <b>{vote}</b>
    </Typography> :
    <Typography component="p">Hard Luck Mate!</Typography>;
}

function renderDetailsButton(onViewDetails) {
  return (
    <Button onClick={onViewDetails} variant="raised">
      View Details
    </Button>
  );
}

function renderCloseVotingButton(onVotingClose) {
  return (
    <Button onClick={onVotingClose} color="primary" variant="raised">
      Close Voting
    </Button>
  );
}

function renderWinner(winner) {
  return winner ?
    <Typography component="p">Match Winner -
      <b>{winner}</b>
    </Typography> :
    null;
}

const Match = ({
                 classes,
                 className,
                 team1,
                 team2,
                 vote,
                 winner,
                 isVoting,
                 date,
                 location,
                 onVote,
                 onMatchWinnerSelected,
                 onCloseVoting,
                 onViewDetails
               }) => {
  const votingEnabled = !!onVote;
  const matchWinnerSelectionEnabled = !!onMatchWinnerSelected;
  const closeVotingEnabled = !!onCloseVoting;
  const viewDetailsEnabled = !!onViewDetails;

  return (
    <Card className={classNames(classes.root, className)}>
      <CardContent>
        <Typography className={classes.date} component="p">{date.toString()}</Typography>
        <Typography variant="h5" component="h2">
          {team1} vs {team2}
        </Typography>
        <Typography className={classes.location}>{location}</Typography>
        <br/>

        {votingEnabled ? renderVotingForm(team1, team2, vote, isVoting, onVote, classes) : renderVote(vote)}
        {renderWinner(winner)}
        {matchWinnerSelectionEnabled ? renderVotingForm(team1, team2, winner, isVoting, onMatchWinnerSelected, classes) : null}
        <CardActions>
          {viewDetailsEnabled ? renderDetailsButton(onViewDetails) : null}
          {closeVotingEnabled ? renderCloseVotingButton(onCloseVoting) : null}
        </CardActions>
      </CardContent>
    </Card>
  );
};

Match.propTypes = {
  classes: PropTypes.object.isRequired,
  team1: PropTypes.string.isRequired,
  team2: PropTypes.string.isRequired,
  vote: PropTypes.string,
  isVoting: PropTypes.bool,
  date: PropTypes.instanceOf(Date),
  location: PropTypes.string.isRequired,
  onVote: PropTypes.func,
  onMatchWinnerSelected: PropTypes.func,
  onCloseVoting: PropTypes.func,
  onViewDetails: PropTypes.func,
  className: PropTypes.string
};

export default withStyles(styles)(Match);