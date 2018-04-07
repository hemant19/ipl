import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardContent } from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form';


const styles = theme => ({
  card: {
    minWidth: 275,
    margin: "10px"
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

function SimpleCard(props) {
  const { classes, onTeamSelected } = props;
  const { team1, team2, location, selection, started, date } = props.match;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}>{date.toString()}</Typography>
          <Typography variant="headline" component="h2">
            {team1} vs {team2}
          </Typography>
          <Typography className={classes.pos}>{location}</Typography>

          {!started ?
            <FormControl component="fieldset" required className={classes.formControl}>
              <FormLabel component="legend">Make a choice</FormLabel>
              <RadioGroup
                aria-label="My Team"
                name="myTeam"
                className={classes.group}
                value={selection}
                onChange={(event, value) => onTeamSelected(value)}
              >
                <FormControlLabel value={team1} control={<Radio color="primary" />} label={team1} />
                <FormControlLabel value={team2} control={<Radio color="primary" />} label={team2} />
              </RadioGroup>
            </FormControl> :
            <Typography > The match has already started your selection is {selection}</Typography>
          }
        </CardContent>

      </Card>
    </div>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
