import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  render() {
    return (
      <div className="Home">
        <h1>The Adventure Awaits!</h1>
        <h4>AdventureNest is an online app to help make unforgettable offline experiences happen.
           We take the stress out of trip planning, coordination, travel, packing and more.</h4>

        <h4>You have no adventures or aren't signed in. Please click below to continue.</h4>

        <Link to="/dashboard"><button className="btn btn-default dash-btn">Dashboard</button></Link>

      </div>
    );
  }
}

export default Home;
