import React from 'react';
import SocketFactory from '../services/SocketFactory';
import ModeSelectorLoginForm from './ModeSelectorLoginForm';

export default class ModeSelector extends React.Component {
    constructor(props) {
        super(props);
        this.connect = props.connect;
    }

    state = {
        steerman: {
            password: "",
            isLogging: false,
            error: "",
        },
        watcher: {
            password: "",
            isLogging: false,
            error: "",
        },
    }

    checkAndSetMode(mode, pwd) {
        if (mode !== "steerman" && mode !== "watcher") {
            throw new Error("Unexpected mode!");
        }

        this.setState({
            [mode]: {
                isLogging: true
            }
        });

        let socket;
        try {
            socket = SocketFactory.connect(mode, pwd);
            if (!socket.connected) {
                throw new Error("Failed to connect!");
            }
        } catch (e) {
            this.setState({
                [mode]: {
                    isLogging: false,
                    error: e.message
                }
            });
            return;
        }
        this.setState({
            [mode]: {
                isLogging: false
            }
        });
        this.connect(mode, socket);
    }

    render() {
        return <div className="ModeSelector">
            <div className="columns">
                <div className="column">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="This is how you control the robot" />
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="media">
                                <div className="media-content">
                                    <p className="title is-4">Family member</p>
                                </div>
                            </div>
                            <h1>{this.state.steerman.error}</h1>
                            <ModeSelectorLoginForm />
                        </div>
                    </div>
                </div>
                {/* <div className="column">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-4by3">
                                <img src="https://bulma.io/images/placeholders/1280x960.png" alt="This is how you watch the robot ride" />
                            </figure>
                        </div>
                        <div className="card-content">
                            <div className="media">
                                <div className="media-content">
                                    <p className="title is-4">Dear guest</p>
                                </div>
                            </div>

                            <div className="content">
                                Just watch.
                                <br />
                                <br />
                                <div className="columns">
                                    <div className="column">
                                        <input className="input" type="text" name="watcherPassword" />
                                    </div>
                                    <div className="column">
                                        <button className="button is-info">Enter password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    }
}