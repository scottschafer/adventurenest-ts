import { Theme } from '@material-ui/core/styles/createMuiTheme';
import createStyles from '@material-ui/core/styles/createStyles';

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing.unit * 20,
    },
    page: {
      margin: '20px'
    }
  });

  // import { createStyles, Theme } from "@material-ui/core";

// export const styles = (theme: Theme) => createStyles({
//   appBar: {
//     position: 'relative',
//   },
//   icon: {
//     marginRight: theme.spacing.unit * 2,
//   },
//   heroUnit: {
//     backgroundColor: theme.palette.background.paper,
//   },
//   heroContent: {
//     maxWidth: 600,
//     margin: '0 auto',
//     padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`,
//   },
//   heroButtons: {
//     marginTop: theme.spacing.unit * 4,
//   },
//   layout: {
//     width: 'auto',
//     marginLeft: theme.spacing.unit * 3,
//     marginRight: theme.spacing.unit * 3,
//     [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
//       width: 1100,
//       marginLeft: 'auto',
//       marginRight: 'auto',
//     },
//   },
//   cardGrid: {
//     padding: `${theme.spacing.unit * 8}px 0`,
//   },
//   card: {
//     height: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   cardMedia: {
//     paddingTop: '56.25%', // 16:9
//   },
//   cardContent: {
//     flexGrow: 1,
//   },
//   footer: {
//     backgroundColor: theme.palette.background.paper,
//     padding: theme.spacing.unit * 6,
//   },
// });
