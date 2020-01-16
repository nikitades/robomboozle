import React from 'react';
import { connect } from "react-redux";
import { create } from 'nipplejs';
import { exit } from "../store/actions";
import Params from "../common/params";
import { MoveCommand, BamboozleCommand } from "../common/commands";
import "../styles/Controls.css";
import Localize from '../services/Localize';

class Controls extends React.Component {
    nippleManager = null;
    cmdBus = {
        moveInterval: null,
        curMoveCmd: null,
        bamboozleInterval: null
    };

    apply(cmd) {
        this.props.socket.emit(cmd.code, cmd);
    }

    componentDidMount() {
        this.initNippleManager();
    }

    initNippleManager() {
        this.nippleManager = create({
            dataOnly: false,
            zone: document.getElementById("joystick")
        });

        this.nippleManager.on("start", () => {
            this.cmdBus.moveInterval = setInterval(() => {
                if (!this.cmdBus.curMoveCmd) return;
                this.apply(this.cmdBus.curMoveCmd);
            }, Params.tickRate);
        });

        this.nippleManager.on("move", (event, data) => {
            if (!this.cmdBus.curMoveCmd) {
                this.cmdBus.curMoveCmd = new MoveCommand(data.angle.degree, data.distance * 2, data.angle.degree <= 180);
            } else {
                this.cmdBus.curMoveCmd.angle = data.angle.degree;
                this.cmdBus.curMoveCmd.speed = data.distance * 2;
                this.cmdBus.curMoveCmd.direction = data.angle.degree <= 180;
            }
        });

        this.nippleManager.on("end", () => {
            clearInterval(this.cmdBus.moveInterval);
        });
    }

    handleExit(e) {
        this.props.exit()
    }

    render() {
        return (
            <div id="controls">
                <div id="joystick"></div>
                <button
                    onMouseDown={() => { this.cmdBus.bambInterval = setInterval(this.apply.bind(this, new BamboozleCommand()), Params.tickRate) }}
                    onMouseUp={() => { clearInterval(this.cmdBus.bambInterval) }}
                    id="bamboozleButton"></button>
                <button onClick={this.handleExit.bind(this)} id="exitButton">{Localize(this.props.language, "EXIT")}</button>
            </div>
        );
    }
}

export default connect(
    state => ({
        language: state.language,
        socket: state.socket
    }),
    dispatch => ({
        exit: mode => dispatch(exit(mode))
    })
)(Controls);