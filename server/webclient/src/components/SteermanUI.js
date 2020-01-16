import React from 'react';
import Video from "./Video";
import Controls from "./Controls";
import Notifications from "./Notifications";
import ExitButton from "./ExitButton";

export default class SteermanUI extends React.Component {
    render() {
        return <div className="ui">
            <Video />
            <Notifications />
            <Controls />
            <ExitButton />
        </div>;
    }
}