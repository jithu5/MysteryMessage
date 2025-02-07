import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

export const useSocket = (): Socket | null => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io("http://localhost:3001", {
            autoConnect: true,
            reconnection: true,
            reconnectionAttempts: 5, // Number of attempts before failing
            reconnectionDelay: 2000, // Time (ms) between attempts
        });

        newSocket.on("connect", () => console.log("Socket connected:", newSocket.id));
        newSocket.on("disconnect", () => console.log("Socket disconnected"));
        newSocket.on("connect_error", (err) => console.error("Connection error:", err));

        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
