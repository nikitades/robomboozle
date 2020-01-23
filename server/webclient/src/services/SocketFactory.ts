import io from 'socket.io-client';
import store from "../store";
import { notifyNewConnection } from "../store/actions";

export default class SocketFactory {
    static connect(mode: string, pwd: string): any {
        const params = {
            path: `/ws/${mode}/` + pwd
        };
        const socket = io("/", params);
        socket.on("new_client", (data: any) => {
            store.dispatch(notifyNewConnection(
                data.role,
                data.name
            ));
        });
        return socket;
    }
}