import React from 'react';

import { connect } from "react-redux";
import { createSocket, typePassword, typeName } from "../store/actions";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserSecret, faAngry } from '@fortawesome/free-solid-svg-icons'

import Input from "./Input";
import Localize from '../services/Localize';

class ModeSelectorLoginForm extends React.PureComponent {

    handleLogin(e) {
        this.props.createSocket(
            this.props.mode,
            this.props.state[this.props.mode].name,
            this.props.state[this.props.mode].password
        );
    }

    handleType(e) {
        this.props.typePassword(this.props.mode, e.target.value);
    }

    handleNameChange(e) {
        this.props.typeName(this.props.mode, e.target.value);
    }

    localize(text) {
        return Localize(this.props.state.language, text);
    }

    render() {
        const err = this.props.state[this.props.mode] ? this.props.state[this.props.mode].error : null;
        const disabled = this.props.state[this.props.mode] ? this.props.state[this.props.mode].isLoggingIn ? true : false : false;
        const blockErrorsClassName = "columns" + (err ? "" : " is-hidden");
        return <div className="content">
            {this.props.title}
            <br />
            <br />
            <div className={blockErrorsClassName}>
                <div className="column">
                    <div className="notification is-danger">
                        {err}
                    </div>
                </div>
            </div>
            <Input
                disabled={disabled}
                placeholder={this.localize("PASSWORD")}
                name="steermanPassword"
                value={this.props.state[this.props.mode].password}
                onChange={this.handleType.bind(this)}
                icon={<FontAwesomeIcon icon={faUserSecret} />}
            />
            <Input
                disabled={disabled}
                placeholder={this.localize("NAME")}
                name="clientName"
                value={this.props.state[this.props.mode].name}
                onChange={this.handleNameChange.bind(this)}
                icon={<FontAwesomeIcon icon={faAngry} />}
            />
            <button disabled={disabled} onClick={this.handleLogin.bind(this)} className="button is-primary">{this.localize("ENTER_THE_PASSWORD")}</button>
        </div>
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        typePassword: (mode, newPwd) => dispatch(typePassword(mode, newPwd)),
        typeName: (mode, name) => dispatch(typeName(mode, name)),
        createSocket: (mode, name, pwd) => dispatch(createSocket(mode, name, pwd)),
    })
)(ModeSelectorLoginForm);