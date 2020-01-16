import { TYPE_PASSWORD, TYPE_NAME, SELECT_MODE, BEGIN_LOGIN, FAILED_LOGIN, CREATE_PLAYER, EXIT, CREATE_NEW_NOTIFICATION, REMOVE_LAST_NOTIFICATION, SET_LANG } from "../actionTypes";
import BroadwayFactory from "../../services/BroadwayFactory";
import nameGen from "../../services/NameGenerator";

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

function getInitialName(mode) {
    try {
        const name = window.localStorage[`${mode}_name`];
        if (!name) return "";
        return name;
    } catch (e) {
        return "";
    }
}

const initialState = {
    mode: null,
    socket: null,
    player: null,
    notifications: [],
    language: "ru",
    steerman: {
        password: getInitialPassword("steerman"),
        name: getInitialName("steerman"),
        isLoggingIn: false,
        error: null
    },
    watcher: {
        password: getInitialPassword("watcher"),
        name: nameGen(),
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
        case TYPE_NAME:
            return {
                ...state,
                [action.payload.mode]: {
                    ...state[action.payload.mode],
                    name: action.payload.name
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
            window.localStorage[`${state.mode}_pwd`] = "";
            window.localStorage[`${state.mode}_name`] = "";
            window.localStorage[`${state.mode}_pwd_time`] = "";
            return {
                ...initialState,
                steerman: {
                    ...initialState.steerman,
                    name: "",
                    password: "",
                },
                watcher: {
                    ...initialState.watcher,
                    name: "",
                    password: "",
                },
            };
        case CREATE_NEW_NOTIFICATION:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        type: action.payload.type,
                        id: action.payload.id,
                        payload: action.payload.payload
                    }
                ]
            };
        case REMOVE_LAST_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.slice(1, state.notifications.length - 1)
            };
        case SET_LANG:
            return {
                ...state,
                language: action.payload.lang
            };
        default:
            return state;
    }
}

export default rootReducer;