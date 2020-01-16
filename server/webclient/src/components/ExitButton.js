import React from 'react';
import { connect } from "react-redux";
import "../styles/ExitButton.css";
import Localize from "../services/Localize";
import { exit } from "../store/actions";

class ExitButton extends React.Component {
    handleExit() {
        this.props.exit(this.props.mode);
    }

    render() {
        return <button onClick={this.handleExit.bind(this)} id="exitButton">{Localize(this.props.language, "EXIT")}</button>
    }
}

export default connect(
    state => ({
        mode: state.mode
    }),
    dispatch => ({
        exit: mode => dispatch(exit(mode))
    })
)(ExitButton);