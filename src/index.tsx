import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter, Route } from 'react-router-dom'


import Login from './authscreens/Login.js';
import Signup from './authscreens/Signup.js';
import Recover from './authscreens/Recover.js';

import Home from './views/Home';
import Dashboard from './views/Dashboard';
import AdventurePage from './views/AdventurePage';
import AdventureEditPage from './views/AdventureEditPage';
import 'typeface-roboto';

import 'bootstrap/dist/css/bootstrap.css';
import './styles/index.css';

ReactDOM.render(
  <HashRouter>
    <App>
      <Route exact={true} path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/recover" component={Recover} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/adventure/:id" component={AdventurePage} />
      <Route path="/adventureEditor/:id" component={AdventureEditPage} />
    </App>
  </HashRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
