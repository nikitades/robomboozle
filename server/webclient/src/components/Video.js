import React from 'react';
import { connect } from "react-redux";
import "../styles/Video.css";

class Video extends React.Component {
    async componentDidMount() {
        this.props.player.canvas.id = "playerCanvas";
        document.getElementById("video").appendChild(this.props.player.canvas);
        this.props.socket.on("nalucast", data => {
            const arr = new Uint8Array(data);
            this.props.player.decode(arr);
        });
    }

    render() {
        return (
            <div id="player">
                <div id="video"></div>
            </div>
        );
    }
}

export default connect(
    state => ({
        mode: state.mode,
        socket: state.socket,
        player: state.player
    }),
    dispatch => ({

    })
)(Video);