import { observable } from "mobx-react";

@observable
class Store {
    mode = "";
    steerman = {
        password: "",
        error: null,
        isLoggingIn: false,
    };
    watchman = {
        password: "",
        error: null,
        isLoggingIn: false,
    };
}

const store = new Store()
export { store };