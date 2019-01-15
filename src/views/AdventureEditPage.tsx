import React, { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import DateRangePicker from "react-daterange-picker";
import "react-daterange-picker/dist/css/react-calendar.css";
import * as originalMoment from "moment";
import { extendMoment, DateRange } from "moment-range";
const moment = extendMoment(originalMoment);
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faMinus, faCheck } from '@fortawesome/free-solid-svg-icons';
import { User } from 'firebase';
import { IReactionDisposer, autorun } from 'mobx';
import { Adventure, IDateRangeWithResponse } from '../vo/adventure';
import { Model } from '../model';

import { USER_TYPE_GUEST, USER_TYPE_CREATOR } from '../Constants';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

interface P extends RouteComponentProps<any> {
  children?: any;
}

interface S {
  user?: User | null,
  adventure?: Adventure,
  title?: string,
  description?: string,
  location?: string,
  dateRanges?: IDateRangeWithResponse[],
  openDateRangeIndex?: number
}

class AdventureEditPage extends React.Component<P, S> {

  private cancellers: IReactionDisposer[] = [];

  constructor(public props: P, public state: S) {
    super(props)
    this.state = {
      user: null,
      adventure: null,

      title: '',
      description: '',
      location: '',
      dateRanges: [],
      openDateRangeIndex: -1
    }

    this.handleSubmitUpdatedAdventure = this.handleSubmitUpdatedAdventure.bind(this)
    this.handleAdventureTitleChange = this.handleAdventureTitleChange.bind(this)
    this.handleAdventureDescriptionChange = this.handleAdventureDescriptionChange.bind(this)
    this.handleAdventureLocationChange = this.handleAdventureLocationChange.bind(this)
    this.handleAdventureDateRangeChange = this.handleAdventureDateRangeChange.bind(this)

    this.handleAddDateRange = this.handleAddDateRange.bind(this)
    this.onOpenDateRange = this.onOpenDateRange.bind(this)
    this.onDeleteDateRange = this.onDeleteDateRange.bind(this)

    this.handleCloseDateRange = this.handleCloseDateRange.bind(this)
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
      if (adventure && user) {
        // adventure = adventures.find((test) => { return test.key === id });
        // if (!adventure) {
        //   this.props.history.push('/dashboard');
        //   return;
        // }

        if (adventure.members[user.uid] !== USER_TYPE_CREATOR) {
          this.props.history.push(`/adventure/${adventure.key}`);
        }
      }

      if (!adventure.dateRanges || !adventure.dateRanges.length) {

        adventure.dateRanges.push({
          responses: {},
          range: moment.range(
            moment().add(1, 'days'),
            moment().add(2, 'weeks').add(6, 'days')
          )
        });
      }
      this.setState({
        adventure: adventure,
        title: adventure ? adventure.title : '',
        description: adventure ? adventure.description : '',
        location: adventure ? adventure.location : '',
        dateRanges: adventure ? adventure.dateRanges : [],
        openDateRangeIndex: -1
      });

    });
  }


  componentWillUnmount() {
    this.cancellers.forEach(canceller => {
      canceller();
    })
  }

  handleAddDateRange(e) {
    let newRanges = this.state.dateRanges ? this.state.dateRanges.slice() : [];
    const today = moment();
    let range = moment.range(today.clone().subtract(7, "days"), today.clone());

    newRanges.push({ range: range, responses: {} });
    this.setState({ dateRanges: newRanges });
  }

  handleAdventureTitleChange(e) {
    //    let adventure = Object.assign({}, this.state.adventure, { title: e.target.value});
    this.setState({ title: e.target.value });
  }

  handleAdventureDescriptionChange(e) {
    //  let adventure = Object.assign({}, this.state.adventure, { description: e.target.value});
    this.setState({ description: e.target.value });
  }

  handleAdventureLocationChange(e) {
    //   let adventure = Object.assign({}, this.state.adventure, { location: e.target.value});
    this.setState({ location: e.target.value });
  }

  handleAdventureDateRangeChange(e) {
    //    let adventure = Object.assign({}, this.state.adventure, { dateRanges: e.target.value});
    this.setState({ dateRanges: e.target.value });
  }

  handleSubmitUpdatedAdventure(e) {
    e.preventDefault();

    this.state.adventure.title = this.state.title;
    this.state.adventure.description = this.state.description;
    this.state.adventure.location = this.state.location;
    this.state.adventure.dateRanges = this.state.dateRanges;
    this.state.adventure.update().then(
      success => {
        this.props.history.push('/adventure/' + this.state.adventure.key);
      },
      error => {
      }
    )
  }

  onOpenDateRange(index: number) {
    return (e: React.MouseEvent<HTMLElement>) => {
      this.setState({
        openDateRangeIndex: index
      });
    }
  }

  onChangeDateRange(index: number) {
    return (value: DateRange, states: any) => {
      let newRanges = this.state.dateRanges.slice();
      newRanges[index].range = value;
      this.setState({
        dateRanges: newRanges
      });
    }
  }

  onDeleteDateRange(index: number) {
    return (e: React.MouseEvent<HTMLElement>) => {

      e.stopPropagation();

      let newRanges = this.state.dateRanges.slice();
      newRanges = newRanges.filter((range, testIndex) => {
        return testIndex !== index;
      });
      this.setState({
        dateRanges: newRanges
      });
    }
  }

  handleCloseDateRange() {
    this.setState({
      openDateRangeIndex: -1
    });
  }

  render() {
    if (!this.state.adventure) return (<div></div>);

    let listDateRangeInputs = [];
    if (this.state.dateRanges) {

      listDateRangeInputs = this.state.dateRanges.map((item, index: number) => {
        if (this.state.openDateRangeIndex !== index) {
          // TODO, determine if year should be shown
          let dateFormat = 'MMM Do, YYYY';
          return (
            <div
              key={index + 'dateDisplay'}
              onClick={this.onOpenDateRange(index)}>

              {item.range.start.format(dateFormat)}
              {" - "}
              {item.range.end.format(dateFormat)}

              {(this.state.openDateRangeIndex === -1) &&
                (this.state.dateRanges.length == 0 || (index === (this.state.dateRanges.length - 1))) &&
                <button
                  className="btn btn-default"
                  key={index + 'add'}
                  onClick={this.handleAddDateRange}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              }
              {(this.state.openDateRangeIndex === -1 && index > 0) &&
                <button
                  className="btn btn-default"
                  key={index + 'delete'}
                  onClick={this.onDeleteDateRange(index)}>
                  <FontAwesomeIcon icon={faMinus} />
                </button>
              }

            </div>
          );
        } else {
          return (
            <div
              key={index + 'pickerContainer'}>
              <DateRangePicker
                key={index + 'picker'}
                value={item.range}
                onSelect={this.onChangeDateRange(index)}
                singleDateRange={true} />
              <button
                className="btn btn-default"
                key={index + 'closepicker'}
                onClick={this.handleCloseDateRange}>
                <FontAwesomeIcon icon={faCheck} />
              </button>
            </div>
          );
        }
      });
    }

    return (
      <div className="container">
        <input type="text" className="form-control text-input col-xs-12"
          value={this.state.title}
          onChange={this.handleAdventureTitleChange} placeholder="Enter Adventure Name" />

        <input type="text" className="form-control text-input"
          value={this.state.description}
          onChange={this.handleAdventureDescriptionChange} placeholder="Enter Adventure Description" />

        <input type="text" className="form-control text-input"
          value={this.state.location}
          onChange={this.handleAdventureLocationChange} placeholder="Enter Adventure Location" />

        {listDateRangeInputs}

        <br></br>
        <button type="submit" className="btn btn-default" onClick={this.handleSubmitUpdatedAdventure}>Submit</button>
      </div>
    );
    // return (
    //   <div className={classes.root}>
    //   <Grid container spacing={24}>
    //     <Grid item xs={12}>
    //       <Paper className={classes.paper}>
    //       xs=12</Paper>
    //     </Grid>
    //     <Grid item xs={6}>
    //       <Paper className={classes.paper}>xs=6</Paper>
    //     </Grid>
    //     <Grid item xs={6}>
    //       <Paper className={classes.paper}>xs=6</Paper>
    //     </Grid>
    //     <Grid item xs={3}>
    //       <Paper className={classes.paper}>xs=3</Paper>
    //     </Grid>
    //     <Grid item xs={3}>
    //       <Paper className={classes.paper}>xs=3</Paper>
    //     </Grid>
    //     <Grid item xs={3}>
    //       <Paper className={classes.paper}>xs=3</Paper>
    //     </Grid>
    //     <Grid item xs={3}>
    //       <Paper className={classes.paper}>xs=3</Paper>
    //     </Grid>
    //   </Grid>
    // </div>
    // );

    // // return (
    //   <div className="Home">
    //     <h1>{this.state.adventure.title}
    //       {this.state.canEdit && <button>Edit</button>}
    //     </h1>

    //   </div>
    // );
  }
}

//export default withStyles(styles)(AdventureEditPage);
export default withRouter(AdventureEditPage);
