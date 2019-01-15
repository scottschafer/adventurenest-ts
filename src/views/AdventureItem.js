import React, { Component } from 'react';
import { Link, hashHistory } from 'react-router-dom'
import firebaseApp from '../firebase/Firebase';

class AdventureItem extends Component {
  constructor(props) {
    super(props)
    this.deleteAdventure = this.deleteAdventure.bind(this)
  }
  deleteAdventure() {
    firebaseApp.database().ref("adventures/" + this.props.item.key).remove();
  }
  render() {
    return (
      <div className="adventure" key={this.props.item.key}>
        <Link to={`/adventure/${this.props.item.key}`}>
          {this.props.item.title}
        </Link>


        <button className="btn btn-default btn-xs" onClick={this.deleteAdventure}>delete</button></div>
    );
  }
}

export default AdventureItem;
