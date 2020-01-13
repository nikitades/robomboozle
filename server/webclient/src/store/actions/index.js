import { TYPE_PASSWORD, SELECT_MODE, BEGIN_LOGIN, FAILED_LOGIN, CREATE_PLAYER, EXIT } from "../actionTypes";
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

export const createPlayer = (w, h) => ({
    type: CREATE_PLAYER,
    payload: {
        w, h
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
            await new Promise(res => setTimeout(res, 150));
            if (!socket.connected) {
                throw new Error("Failed to connect!");
            }
            window.localStorage[`${mode}_pwd`] = pwd;
            window.localStorage[`${mode}_pwd_time`] = new Date();
            dispatch(createPlayer(1270, 960));
            dispatch(selectMode(mode, socket));
        } catch (e) {
            dispatch(failedLogin(mode, e.message));
        }
    };
};

export const exit = mode => {
    delete window.localStorage[`${mode}_pwd`];
    delete window.localStorage[`${mode}_pwd_time`];
    return {
        type: EXIT,
        payload: {
            mode
        }
    };
}