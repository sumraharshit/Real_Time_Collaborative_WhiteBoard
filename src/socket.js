import {io} from "socket.io-client";

export const initSocket = async () =>{

    const option = {
        "force new connection": true,
        reconnectionAttempt: "infinity",
        timeout: 1000,
        transports: ["websocket"],

    };
    return io("http://localhost:54321/", option);
};


