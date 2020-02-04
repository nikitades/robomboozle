import React from 'react';
import { connect } from "react-redux";
import ModeSelectorLoginForm from './ModeSelectorLoginForm';
import Localize from "../services/Localize";

class ModeSelector extends React.Component {

    render() {
        return <div className="container">
            <div className="ModeSelector">
                <div className="columns">
                    <div className="column">
                        <div className="card">
                            <div className="card-image">
                                <video onLoadedMetadata={this.onVideoLoaded} alt={Localize(this.props.language, "THIS_IS_HOW_YOU_CONTROL")} autoPlay muted loop playsInline>
                                    <source src="/videos/steerman.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">{Localize(this.props.language, "FAMILY_MEMBER")}</p>
                                    </div>
                                </div>
                                <ModeSelectorLoginForm mode={"steerman"} title={Localize(this.props.language, "WATCH_AND_CONTROL")} />
                            </div>
                        </div>
                    </div>
                    <div className="column">
                        <div className="card">
                            <div className="card-image">
                                <video alt={Localize(this.props.language, "THIS_IS_HOW_YOU_LOOK")} autoPlay muted loop playsInline>
                                    <source src="/videos/watcher.mp4" type="video/mp4" />
                                </video>
                            </div>
                            <div className="card-content">
                                <div className="media">
                                    <div className="media-content">
                                        <p className="title is-4">{Localize(this.props.language, "DEAR_GUEST")}</p>
                                    </div>
                                </div>
                                <ModeSelectorLoginForm mode={"watcher"} title={Localize(this.props.language, "JUST_WATCH")} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="has-text-centered">
                    <a href="https://github.com/nikitades/robomboozle">
                        <img src="https://img.shields.io/github/watchers/nikitades/robomboozle?label=Watch&style=social" />
                    </a>
                    &nbsp;
                    <a href="https://raspberrypi.org">
                        <img src="https://img.shields.io/badge/raspberry-pi-red" />
                    </a>
                </div>
            </div>
        </div>
    }
}

export default connect(
    state => ({
        language: state.language
    }),
    dispatch => ({

    })
)(ModeSelector);