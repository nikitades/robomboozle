import React from 'react';
import { connect } from "react-redux";
import Localize from "../services/Localize";
import "../styles/Notifications.css";

class Notifications extends React.Component {
    render() {
        return <div id="notifications">
            <div className="notifications-list">
                {this.props.notifications.map(
                    notification => {
                        console.log({ notification });
                        return <Notification
                            key={notification.id}
                            type={notification.type}
                            payload={notification.payload}
                            language={this.props.language}
                        />
                    }
                )}
            </div>
        </div>;
    }
}

class Notification extends React.PureComponent {
    getTypeText() {
        return Localize(this.props.language, this.props.type + "_TYPE");
    }

    getMessageText() {
        return Localize(this.props.language, this.props.type + "_TEXT", this.props.payload);
    }

    render() {
        return <div className="notification">
            <p>{this.getTypeText()}</p>
            <p><b>{this.getMessageText()}</b></p>
        </div>;
    }
}

export default connect(
    state => ({
        notifications: state.notifications,
        language: state.language
    }),
    dispatch => ({

    })
)(Notifications);