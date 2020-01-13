import React from 'react';
import { connect } from "react-redux";
import ModeSelectorLoginForm from './ModeSelectorLoginForm';

class ModeSelector extends React.Component {

    render() {
        return <div className="container">
            <div className="ModeSelector">
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
                                <ModeSelectorLoginForm mode={"steerman"} title={"Watch & control the robot."} />
                            </div>
                        </div>
                    </div>
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
                                        <p className="title is-4">Dear guest</p>
                                    </div>
                                </div>
                                <ModeSelectorLoginForm mode={"watcher"} title={"Watch & control the robot."} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default connect(
    state => ({

    }),
    dispatch => ({

    })
)(ModeSelector);