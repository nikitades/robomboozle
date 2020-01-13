import { TYPE_PASSWORD, SELECT_MODE, BEGIN_LOGIN, FAILED_LOGIN, CREATE_PLAYER, EXIT } from "../actionTypes";
import BroadwayFactory from "../../services/BroadwayFactory";

function getInitialPassword(mode) {
    try {
        const pwd = window.localStorage[`${mode}_pwd`];
        const pwdTime = window.localStorage[`${mode}_pwd_time`];
        if (!pwd || !pwdTime) return "";
        const curDate = new Date();
        const oldDate = new Date(pwdTime);
        if ((curDate.getTime() - 86400000) > oldDate.getTime()) return "";
        return pwd;
    } catch (e) {
        return "";
    }
}

const initialState = {
    mode: null,
    socket: null,
    player: null,
    steerman: {
        password: getInitialPassword("steerman"),
        isLoggingIn: false,
        error: null
    },
    watcher: {
        password: getInitialPassword("watcher"),
        isLoggingIn: false,
        error: null
    }
}

function rootReducer(state = initialState, action) {
    switch (action.type) {
        case TYPE_PASSWORD:
            return {
                ...state,
                [action.payload.mode]: {
                    ...state[action.payload.mode],
                    password: action.payload.newPwd
                }
            };
        case SELECT_MODE:
            return {
                ...state,
                mode: action.payload.mode,
                socket: action.payload.socket
            };
        case BEGIN_LOGIN:
            return {
                ...state,
                [action.payload.mode]: {
                    ...state[action.payload.mode],
                    isLoggingIn: true
                }
            };
        case FAILED_LOGIN:
            return {
                ...state,
                [action.payload.mode]: {
                    ...state[action.payload.mode],
                    isLoggingIn: false,
                    error: action.payload.err
                }
            };
        case CREATE_PLAYER:
            return {
                ...state,
                player: BroadwayFactory.getPlayer(action.payload.w, action.payload.h)
            }
        case EXIT:
            return initialState;
        default:
            return state;
    }
}

export default rootReducer;