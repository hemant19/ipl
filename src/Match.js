import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Radio, { RadioGroup } from 'material-ui/Radio';
import { FormLabel, FormControl, FormControlLabel, FormHelperText } from 'material-ui/Form';


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
  const { classes } = props;
  const { team1, team2, location } = props.match;

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography className={classes.title}>Match of the day</Typography>
          <Typography variant="headline" component="h2">
            {team1} vs {team2}
          </Typography>
          <Typography className={classes.pos}>{location}</Typography>
          <Typography component="p">
            <FormControl component="fieldset" required error className={classes.formControl}>
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender2"
                className={classes.group}
                value={selection}
                onChange={}
              >
                <FormControlLabel value={team1} control={<Radio color="primary" />} label={team1} />
                <FormControlLabel value={team2} control={<Radio color="primary" />} label={team2} />
              </RadioGroup>
              <FormHelperText>You can display an error</FormHelperText>
            </FormControl>
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleCard);
