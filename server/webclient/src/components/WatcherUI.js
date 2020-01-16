import React from 'react';
import UI from "./Video";
import Notifications from "./Notifications";
import ExitButton from "./ExitButton";

export default class WatcherUI extends React.Component {
    render() {
        return <div className="container is-fluid">
            <UI />
            <Notifications />
            <ExitButton />
        </div>;
    }
}