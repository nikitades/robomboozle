import React from 'react';

export default class ModeSelector extends React.Component {
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

                            <div className="content">
                                Watch & control the robot.
                                <br />
                                <br />
                                <div className="columns">
                                    <div className="column">
                                        <input className="input" type="text" name="steermanPassword" />
                                    </div>
                                    <div className="column">
                                        <button className="button is-primary">Enter password</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="column">
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
                </div>
            </div>
        </div>
    }
}