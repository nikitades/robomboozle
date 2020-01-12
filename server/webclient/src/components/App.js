import React from 'react';
import { observer } from "mobx-react";
import 'bulma/css/bulma.css'
import '../styles/App.css';
import ModeSelector from './ModeSelector';
import SteermanUI from './SteermanUI';
import WatcherUI from './WatcherUI';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.store = props.store;
    this.connect = this.connect.bind(this);
  }

  connect(mode, socket) {
    this.setState({
      selectedMode: mode,
      socket: socket
    });
  }

  render() {

    let content;
    switch (this.state.selectedMode) {
      case "steerman":
        content = <SteermanUI />;
        break;
      case "watcher":
        content = <WatcherUI />;
        break;
      default:
        content = <ModeSelector connect={this.connect} />;
        break;
    }

    return (
      <div className="container">
        {content}
      </div>
    );
  }
}

export default observer(() => <App />);