import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchUsersAction } from './actions';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        padding: "10px"
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
})

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

class LeaderBoard extends Component {
    componentDidMount() {
        this.props.dispatch(fetchUsersAction());
    }

    render() {
        const { classes, leaderBoard: { users } } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell component="th">Name</CustomTableCell>
                            <CustomTableCell component="th">Points</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow className={classes.row} key={user.id}>
                                <CustomTableCell>{user.name}</CustomTableCell>
                                <CustomTableCell>{user.points}</CustomTableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        )
    }
}

export default connect(state => state)(withStyles(styles)(LeaderBoard));

