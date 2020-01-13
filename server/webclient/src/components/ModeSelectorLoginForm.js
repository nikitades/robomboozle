import React from 'react';
import { connect } from "react-redux";
import { createSocket, typePassword } from "../store/actions";

class ModeSelectorLoginForm extends React.PureComponent {

    handleLogin(e) {
        this.props.createSocket(this.props.mode, this.props.state[this.props.mode].password);
    }

    handleType(e) {
        this.props.typePassword(this.props.mode, e.target.value);
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
            <div className="columns">
                <div className="column">
                    <input disabled={disabled} className="input" type="text" name="steermanPassword" value={this.props.state[this.props.mode].password} onChange={this.handleType.bind(this)} />
                </div>
                <div className="column">
                    <button disabled={disabled} onClick={this.handleLogin.bind(this)} className="button is-primary">Enter password</button>
                </div>
            </div>
        </div>
    }
}

export default connect(
    state => ({
        state
    }),
    dispatch => ({
        typePassword: (mode, newPwd) => dispatch(typePassword(mode, newPwd)),
        createSocket: (mode, pwd) => dispatch(createSocket(mode, pwd)),
    })
)(ModeSelectorLoginForm);