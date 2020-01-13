import React from 'react';
import Video from "./Video";
import Controls from "./Controls";

export default class SteermanUI extends React.Component {
    render() {
        return <div className="ui">
            <Video />
            <Controls />
        </div>;
    }
}