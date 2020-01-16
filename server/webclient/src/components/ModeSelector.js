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
                                <figure className="image is-4by3">
                                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt={Localize(this.props.language, "THIS_IS_HOW_YOU_CONTROL")} />
                                </figure>
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
                                <figure className="image is-4by3">
                                    <img src="https://bulma.io/images/placeholders/1280x960.png" alt={Localize(this.props.language, "THIS_IS_HOW_YOU_LOOK")} />
                                </figure>
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