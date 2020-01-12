import io from 'socket.io-client';

export default class SocketFactory {
    static connect(mode: string, pwd: string): any {
        const socket = io("http://" + document.location.hostname + ":8000", {
            path: `/${mode}/` + pwd
        });
        return socket;
    }
}