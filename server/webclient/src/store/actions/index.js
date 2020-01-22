import {
    TYPE_PASSWORD,
    SELECT_MODE,
    BEGIN_LOGIN,
    FAILED_LOGIN,
    CREATE_PLAYER,
    EXIT,
    TYPE_NAME,
    CREATE_NEW_NOTIFICATION,
    REMOVE_LAST_NOTIFICATION,
    SET_LANG
} from "../actionTypes";
import SocketFactory from "../../services/SocketFactory";
import NameGenerator from "../../services/NameGenerator";

export const typePassword = (mode, newPwd) => ({
    type: TYPE_PASSWORD,
    payload: {
        mode,
        newPwd
    }
});

export const typeName = (mode, name) => {
    window.localStorage[`${mode}_name`] = name;
    return {
        type: TYPE_NAME,
        payload: {
            mode,
            name
        }
    }
};

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

export const createSocket = (mode, name, pwd) => {
    return async dispatch => {
        if (mode !== "steerman" && mode !== "watcher") {
            throw new Error("Unexpected mode: " + mode);
        }
        dispatch(beginLogin(mode));
        try {
            const socket = SocketFactory.connect(mode, pwd);
            await new Promise(res => setTimeout(res, 150));
            if (!socket.connected) {
                socket = null;
                throw new Error("Failed to connect!");
            }
            window.localStorage[`${mode}_pwd`] = pwd;
            window.localStorage[`${mode}_pwd_time`] = new Date();
            dispatch(informConnected(socket, name));
            dispatch(createPlayer(1270, 960));
            dispatch(selectMode(mode, socket));
        } catch (e) {
            dispatch(failedLogin(mode, e.message));
        }
    };
};

export const exit = () => {
    return {
        type: EXIT,
        payload: {}
    };
}

export const informConnected = (socket, name) => {
    return async () => {
        socket.emit("connected", name);
    };
}

export const createNewNotification = payload => {
    return {
        type: CREATE_NEW_NOTIFICATION,
        payload
    }
}

export const removeLastNotification = () => {
    return {
        type: REMOVE_LAST_NOTIFICATION,
        payload: {}
    }
}

export const notifyNewConnection = (role, name) => {
    return async dispatch => {
        dispatch(createNewNotification({
            type: "NEW_CLIENT",
            id: Math.random().toString(16).slice(2, 15),
            payload: {
                role,
                name: name ?? NameGenerator()
            }
        }));
        setTimeout(() => {
            dispatch(removeLastNotification())
        }, 5000);
    };
}

export const setLang = lang => ({
    type: SET_LANG,
    payload: {
        lang
    }
})