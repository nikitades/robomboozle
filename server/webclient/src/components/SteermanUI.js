import React from 'react';
import Video from "./Video";
import Controls from "./Controls";
import Notifications from "./Notifications";

export default class SteermanUI extends React.Component {
    render() {
        return <div className="ui">
            <Video />
            <Notifications />           
            <Controls />
        </div>;
    }
}