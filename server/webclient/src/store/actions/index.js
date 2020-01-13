import { TYPE_PASSWORD, SELECT_MODE, BEGIN_LOGIN, FAILED_LOGIN } from "../actionTypes";
import SocketFactory from "../../services/SocketFactory";

export const typePassword = (mode, newPwd) => ({
    type: TYPE_PASSWORD,
    payload: {
        mode,
        newPwd
    }
});

export const selectMode = (mode, socket) => ({
    type: SELECT_MODE,
    payload: {
        mode,
        socket
    }
});

export const beginLogin = mode => ({
    type: BEGIN_LOGIN,
    payload: {
        mode
    }
});

export const failedLogin = (mode, err) => ({
    type: FAILED_LOGIN,
    payload: {
        mode,
        err
    }
})

export const createSocket = (mode, pwd) => {
    return async dispatch => {
        if (mode !== "steerman" && mode !== "watcher") {
            throw new Error("Unexpected mode: " + mode);
        }
        dispatch(beginLogin(mode));
        try {
            const socket = SocketFactory.connect(mode, pwd);
            await new Promise(res => setTimeout(res, 250));
            if (!socket.connected) {
                throw new Error("Failed to connect!");
            }
            window.localStorage[`${mode}_pwd`] = pwd;
            window.localStorage[`${mode}_pwd_time`] = new Date();
            dispatch(selectMode(mode, socket));
        } catch (e) {
            dispatch(failedLogin(mode, e.message));
        }
    };
};