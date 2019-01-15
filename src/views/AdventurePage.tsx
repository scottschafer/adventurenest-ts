import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import firebaseApp from '../firebase/Firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';
import { USER_TYPE_GUEST, USER_TYPE_HOST, USER_TYPE_CREATOR } from '../Constants';
import { User } from 'firebase';
import { Adventure, IDateRangeWithResponse } from '../vo/adventure';
import { IReactionDisposer, autorun } from 'mobx';
import { Model } from '../model';
import { BasePage, exportView } from './BasePage';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import { Typography, Paper, Grid } from '@material-ui/core';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

import YesIcon from '@material-ui/icons/ThumbUp';
import NoIcon from '@material-ui/icons/ThumbDown';

interface P {
  id?: string;
}

interface S {
  user?: User | null,
  adventure?: Adventure,
  canEdit?: boolean,
  dateRanges?: IDateRangeWithResponse[]

}

class AdventurePage extends BasePage<P, S> {

  private cancellers: IReactionDisposer[] = [];

  // constructor(public props: P, public state: S) {
  //   super(props, state);
  //   this.onChangeDateResponse = this.onChangeDateResponse.bind(this);
  // }
  // constructor(public props: P, public state: S) {
  //   super(props)
  //   this.state = {
  //     user: null,
  //     adventure: null
  //   }
  // }

  componentWillMount() {
    this.onChangeDateResponse = this.onChangeDateResponse.bind(this);
  }
  
  componentDidMount() {
    // get the adventure id from the URL
    const id = this.props.match.params.id;

    Model.instance.setSelectedAdventureId(id);

    let canceller = autorun(() => {
      switch (Model.instance.user) {
        case undefined:
          break;

        case null:
          this.setState({ user: null });

          // for now - eventually show adventure, or a message "sign in to view"
          this.props.history.push('/login?redirect=/adventure/' + id);
          break;

        default:
          this.setState({ user: Model.instance.user });
          break;
      }
    });
    this.cancellers.push(canceller);

    canceller = autorun(() => {
      let user = Model.instance.user;

      
      let adventure: Adventure = Model.instance.selectedAdventure;
      if (adventure && user && !adventure.members.hasOwnProperty(user.uid)) {
        // we are viewing an adventure that we don't have access to.

        // for now(!), add this user to the adventure as a guest.
        adventure.members[user.uid] = USER_TYPE_GUEST;
        adventure.update();
      }

      this.setState({
        adventure: adventure,
        canEdit: (adventure && user && adventure.members[user.uid] === USER_TYPE_CREATOR),
        dateRanges: adventure && adventure.dateRanges
      });
    });
    this.cancellers.push(canceller);
  }

  componentWillUnmount() {
    this.cancellers.forEach(canceller => {
      canceller();
    })
  }


  onChangeDateResponse(index: number) {
    return (e: React.MouseEvent<HTMLElement>, response: string) => {

      e.stopPropagation();

      let dateRanges = this.state.dateRanges.slice();
      let user = Model.instance.user;
      dateRanges[index].responses[user.uid] = response;
      this.setState({
        dateRanges: dateRanges
      });

      this.state.adventure.dateRanges = dateRanges;
      this.state.adventure.update();
    }
  }

  render() {
    if (!this.state.adventure) return (<div></div>);

    const { classes } = this.props;

    let listDateRangeInputs = [];
    let user = Model.instance.user;

    listDateRangeInputs = this.state.dateRanges.map((item: IDateRangeWithResponse, index: number) => {
      // TODO, determine if year should be shown
      let dateFormat = 'MMM Do, YYYY';
      return (
        <Grid item xs={12} key={index + '_dateProposal'}>
        <Paper className={classes.paper} elevation={1}>
          <Typography variant="h4" align="left" key={index + 'dateDisplay'}>

            {item.range.start.format(dateFormat)}{" - "}{item.range.end.format(dateFormat)}

            <ToggleButtonGroup exclusive className={classes.inlineRightButtonBar}
              value={item.responses[user.uid]} onChange={this.onChangeDateResponse(index)}>
              <ToggleButton value="yes">
                <YesIcon />
              </ToggleButton>
              <ToggleButton value="no">
                <NoIcon />
              </ToggleButton>
            </ToggleButtonGroup>

          </Typography>
          </Paper>
        </Grid>
      );
    });

    const editLink = `/adventureEditor/${this.state.adventure.key}`;
    return (
      <div className={classes.page}>
        {this.state.canEdit &&
          <Link to={editLink}>
            <button className="btn btn-default EditButton">
              <FontAwesomeIcon icon={faEdit} />
            </button>
          </Link>
        }
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h3" align="left" gutterBottom>
              {this.state.adventure.title}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              {this.state.adventure.description}
            </Typography>
          </Grid>

          <Grid container spacing={24}>
            {listDateRangeInputs}
          </Grid>
        </Grid>
      </div>

      // <div className="Home">

      //   <Typography variant="h4" gutterBottom>
      //     Material-UI
      //   </Typography>
      //   <Typography variant="subtitle1" gutterBottom>
      //     example project
      //   </Typography>
      //   <Button variant="contained" color="secondary" >
      //     Super Secret Password
      //   </Button>
      //   {/* value={alignment}  onChange={this.handleAlignment} */}
      //   <ToggleButtonGroup exclusive>
      //     <ToggleButton value="center">
      //       <YesIcon />
      //     </ToggleButton>
      //     <ToggleButton value="center">
      //       <NoIcon />
      //     </ToggleButton>
      //   </ToggleButtonGroup>

      //   
      //   <h1>{this.state.adventure.title}</h1>
      //   <h2>{this.state.adventure.description}</h2>
      //   {listDateRangeInputs}
      // </div>
    );
  }
}

export default exportView(AdventurePage);

    // export default withRouter(AdventurePage);
