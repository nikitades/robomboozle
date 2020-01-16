import React from 'react';
import { connect } from "react-redux";
import Flag from "react-flags";
import 'bulma/css/bulma.css'
import '../styles/App.css';
import ModeSelector from './ModeSelector';
import SteermanUI from './SteermanUI';
import WatcherUI from './WatcherUI';
import { setLang } from "../store/actions";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.connect = this.connect.bind(this);
  }

  connect(mode, socket) {
    this.setState({
      selectedMode: mode,
      socket: socket
    });
  }

  handleLangChange(lang) {
    this.props.setLang(lang);
  }

  render() {
    let content;
    switch (this.props.mode) {
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
      <div className="app">
        {content}
        <div id="langSwitcher">
          <div className={"field has-addons"}>
            <p className={"control"}>
              <button className={"button" + (this.props.language === "en" ? " is-info" : "")} onClick={this.handleLangChange.bind(this, "en")}>
                <span className={"icon is-small"}>
                  <Flag
                    name="USA"
                    format="png"
                    pngSize={32}
                    shiny={true}
                    basePath="/img/flags/"
                    alt="USA Flag"
                  />
                </span>
                <span>
                  EN
                </span>
              </button>
            </p>
            <p className={"control"}>
              <button className={"button" + (this.props.language === "ru" ? " is-info" : "")} onClick={this.handleLangChange.bind(this, "ru")}>
                <span className={"icon is-small"}>
                  <Flag
                    name="RU"
                    format="png"
                    pngSize={32}
                    shiny={true}
                    basePath="/img/flags/"
                    alt="Russian Flag"
                  />
                </span>
                <span>
                  RU
                </span>
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => ({
    mode: state.mode,
    language: state.language,
  }),
  dispatch => ({
    setLang: lang => dispatch(setLang(lang))
  })
)(App);