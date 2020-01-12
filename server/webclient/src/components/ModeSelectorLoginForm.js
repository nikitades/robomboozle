import React from 'react';

export default class ModeSelectorLoginForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state.title = props.title;
        this.state.mode = props.mode;
        this.state.disabled = props.disabled;
        this.state.pwd = props.pwd;
        this.state.error = props.error;
        this.onLogin = props.onLogin;
        this.onType = props.onType;
    }

    state = {
        title: "",
        mode: "",
        disabled: false,
        pwd: "",
        error: "",
    }

    render() {
        const blockErrorsClassName = "columns" + (!!this.error ? "" : " is-hidden");
        return <div className="content">
            {blockErrorsClassName}
            {this.error}
            {this.title}
            <br />
            <br />
            <div className={blockErrorsClassName}>
                <div className="column">
                    <div className="notification is-danger">
                        {this.error}
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <input disabled={this.disabled} className="input" type="text" name="steermanPassword" value={this.pwd} onChange={this.onType} />
                </div>
                <div className="column">
                    <button disabled={this.disabled} onClick={this.onLogin} className="button is-primary">Enter password</button>
                </div>
            </div>
        </div>
    }
}