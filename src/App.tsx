import React, { Component } from 'react';
import firebaseApp from './firebase/Firebase';
import Navbar from './components/Navbar';
import './styles/font-awesome.css'
import './styles/bootstrap-social.css';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { autorun, IReactionDisposer } from 'mobx';
import { Model } from './model';


interface P extends RouteComponentProps<any> {
  children?: any;
}

interface S {
  loggedin: boolean;
}

class App extends React.Component<P, S> {
  constructor(public props: P, public state: S) {
    super(props);
  };

  private cancellers: IReactionDisposer[] = [];

  getInitialState() {
    return {
      loggedin: false
    };
  }

  public componentDidMount() {

    let canceller = autorun(() => {
      let user = Model.instance.user;
      switch (user) {
        case undefined:
          break;

        case null:
          // not logged in, so we're here
          break;

        default:
          let redirectIndex = window.location.hash.indexOf('?redirect');
          if (redirectIndex !== -1) {
            this.props.history.push(window.location.hash.substr(redirectIndex + 10));
          } else if (window.location.hash === '#/') {
            this.props.history.push('/dashboard');
          }
      }
      // }
      // if (Model.instance.user === null) {
      //   //if not logged in...
      //   this.setState({ loggedin: false });
      // } else {
      //   //if logged in...
      //   this.setState({ loggedin: true });
      //   if (window.location.pathname === '/') {
      //     this.props.history.push('/dashboard');
      //   }
      // }
    });
    this.cancellers.push(canceller);
  }

  public componentWillUnmount() {
    this.cancellers.forEach(canceller => {
      canceller();
    });
  }

  render() {
    return (
      <div className="App">
        <Navbar loggedin={this.state.loggedin} history={this.props.history} />

        {this.props.children}

        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header> */}
      </div>
    );
  }
}

export default withRouter(App);
