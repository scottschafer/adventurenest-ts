import React, { Component, ChangeEvent } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import firebaseApp from '../firebase/Firebase';
import AdventureItemList from './AdventureItemList';
import PropTypes from 'prop-types';
//import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../styles/styles';
import { IReactionDisposer, autorun } from 'mobx';
import { User } from 'firebase';
import { Model } from '../model';
import { Adventure } from '../vo/adventure';


interface P extends RouteComponentProps<any> {
	children?: any;
}

interface S {
	user?: User | null,
	adventureName?: string,
	adventures?: Adventure[]
}

class Dashboard extends React.Component<P, S> {

	private cancellers: IReactionDisposer[] = [];

	static propTypes = {
		//	classes: PropTypes.object.isRequired,
	};


	constructor(public props: P, public state: S) {
		super(props)
		this.state = {
			user: null,
			adventureName: "",
			adventures: []
		}
		this.handleSubmitNewAdventure = this.handleSubmitNewAdventure.bind(this)
		this.handleAdventureNameChange = this.handleAdventureNameChange.bind(this)
	}

	componentWillMount() {

		let canceller = autorun(() => {
			switch (Model.instance.user) {
				case undefined:
					break;

				case null:
					this.setState({ user: null });
					this.props.history.push('/login');
					break;

				default:
					this.setState({ user: Model.instance.user });
					break;
			}
		});
		this.cancellers.push(canceller);

		canceller = autorun(() => {
			let adventures = Model.instance.adventuresForUser;

			this.setState({ adventures: adventures ? adventures : [] });
		});
		this.cancellers.push(canceller);
	}

	public componentWillUnmount() {
		this.cancellers.forEach(canceller => {
			canceller();
		});
	}


	// loadAdventures() {
	// 	if (!this.state.user) {
	// 		this.props.history.push('/');
	// 		return;
	// 	}
	// 	var adventures = firebaseApp.database().ref('adventures')
	// 		.orderByChild('members/' + this.state.user.uid).startAt(0);

	// 	let adventureSets = {};

	// 	adventures.on("value", (snapshot: any) => {
	// 		//console.log(snapshot.val());
	// 		let arr: any[] = [];
	// 		snapshot.forEach(function (data: any) {
	// 			let item = data.val();
	// 			let key = data.key;
	// 			item.key = key;
	// 			console.log(data.key);
	// 			arr.push(item);
	// 		});
	// 		this.setState({ adventures: arr });
	// 	});
	// }

	handleAdventureNameChange(e: ChangeEvent<HTMLElement>) {
		this.setState({ adventureName: (e.target as any).value });
	}

	handleSubmitNewAdventure(e: React.FormEvent<HTMLFormElement>) {
		var _this = this;
		e.preventDefault();

		if (this.state.user) {
			const uid = this.state.user.uid;
			let newAventure = new Adventure({
				title: _this.state.adventureName,
				creator: uid,
				members: {}
			});
			newAventure.members[uid] = 'creator';

			firebaseApp.database().ref('adventures').push(newAventure.asJSON)
				.then(
					success => {
						this.props.history.push('/adventureEditor/' + success.key);
					},
					error => {
						debugger;
					}
				)
		}
	}

	render() {
		if (!this.state.user) {
			return (<div></div>);
		}
		return (
			<div className="Dashboard">
				<br />
				<p>You’re signed in as: {this.state.user.displayName} | {this.state.user.email}</p>

				<div className="form-group">
					<h4 className="note-title">Add a new adventure: </h4>
					<form onSubmit={this.handleSubmitNewAdventure} className="form-inline col-xs-12">
						<input type="text" className="form-control text-input"
							value={this.state.adventureName}
							onChange={this.handleAdventureNameChange} placeholder="Enter Adventure Name" />
						<button type="submit" className="btn btn-default">Submit</button>
					</form>
					<br /> <br />
					<div>
						<h4>Upcoming Adventures </h4>
						<AdventureItemList items={this.state.adventures} />
					</div>
				</div>


			</div>
		);
	}
}

//export default withRouter(Dashboard);
// Dashboard.propTypes = {
// 	classes: PropTypes.object.isRequired,
// };
export default withStyles(styles)(withRouter(Dashboard));

// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// function Album(props) {
//   const { classes } = props;

//   return (
//     <React.Fragment>
//       <CssBaseline />
//       <AppBar position="static" className={classes.appBar}>
//         <Toolbar>
//           <CameraIcon className={classes.icon} />
//           <Typography variant="h6" color="inherit" noWrap>
//             Album layout
//           </Typography>
//         </Toolbar>
//       </AppBar>
//       <main>
//         {/* Hero unit */}
//         <div className={classes.heroUnit}>
//           <div className={classes.heroContent}>
//             <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
//               Album layout
//             </Typography>
//             <Typography variant="h6" align="center" color="textSecondary" paragraph>
//               Something short and leading about the collection below—its contents, the creator, etc.
//               Make it short and sweet, but not too short so folks don&apos;t simply skip over it
//               entirely.
//             </Typography>
//             <div className={classes.heroButtons}>
//               <Grid container spacing={16} justify="center">
//                 <Grid item>
//                   <Button variant="contained" color="primary">
//                     Main call to action
//                   </Button>
//                 </Grid>
//                 <Grid item>
//                   <Button variant="outlined" color="primary">
//                     Secondary action
//                   </Button>
//                 </Grid>
//               </Grid>
//             </div>
//           </div>
//         </div>
//         <div className={classNames(classes.layout, classes.cardGrid)}>
//           {/* End hero unit */}
//           <Grid container spacing={40}>
//             {cards.map(card => (
//               <Grid item key={card} sm={6} md={4} lg={3}>
//                 <Card className={classes.card}>
//                   <CardMedia
//                     className={classes.cardMedia}
//                     image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
//                     title="Image title"
//                   />
//                   <CardContent className={classes.cardContent}>
//                     <Typography gutterBottom variant="h5" component="h2">
//                       Heading
//                     </Typography>
//                     <Typography>
//                       This is a media card. You can use this section to describe the content.
//                     </Typography>
//                   </CardContent>
//                   <CardActions>
//                     <Button size="small" color="primary">
//                       View
//                     </Button>
//                     <Button size="small" color="primary">
//                       Edit
//                     </Button>
//                   </CardActions>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </div>
//       </main>
//       {/* Footer */}
//       <footer className={classes.footer}>
//         <Typography variant="h6" align="center" gutterBottom>
//           Footer
//         </Typography>
//         <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
//           Something here to give the footer a purpose!
//         </Typography>
//       </footer>
//       {/* End footer */}
//     </React.Fragment>
//   );
// }

// Album.propTypes = {
//   classes: PropTypes.object.isRequired,
// };

// export default withStyles(styles)(Album);