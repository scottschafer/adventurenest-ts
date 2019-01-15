import * as React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import withRoot from './withRoot';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const styles = (theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  page: {
    flexGrow: 1,
    margin: 20
  },
  inlineRightButtonBar: {
    display: 'inline-block',
    float: 'right'
  }
});

// const styles = (theme: Theme) => createStyles({
//   root: {
//     // textAlign: 'center',
//     // paddingTop: theme.spacing.unit * 20,
//   },
// });

type BaseProps<P> = RouteComponentProps<P> & WithStyles<typeof styles>

export class BasePage<P, S> extends React.Component<BaseProps<P>, S> {
  constructor(public props: BaseProps<P>, public state: S) {
    super(props);
  }
};

export function exportView(component: any) {
  return withRoot(withStyles(styles)(withRouter(component)));
}
