const { Server } = require("socket.io");

let connections = {};
let timeOnline = {};
let messages = {};

const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true,
        },

        // WebSocket + polling dono allow
        transports: ["websocket", "polling"],
    });

    io.on("connection", (socket) => {
        console.log("User Connected:", socket.id);

        // =========================================
        // JOIN CALL
        // =========================================

        socket.on("join-call", (path) => {
            if (!path) {
                console.log(
                    "join-call received without room path"
                );
                return;
            }

            if (!connections[path]) {
                connections[path] = [];
            }

            // Duplicate socket ko room mein dobara add
            // hone se prevent karo
            if (!connections[path].includes(socket.id)) {
                connections[path].push(socket.id);
            }

            socket.join(path);

            timeOnline[socket.id] = new Date();

            console.log(
                `Socket ${socket.id} joined room: ${path}`
            );

            console.log(
                "Users in room:",
                connections[path]
            );

            // =========================================
            // NOTIFY USERS
            // =========================================

            connections[path].forEach((id) => {
                io.to(id).emit(
                    "user-joined",
                    socket.id,
                    connections[path]
                );
            });

            // =========================================
            // SEND OLD CHAT MESSAGES
            // =========================================

            if (messages[path]) {
                messages[path].forEach((msg) => {
                    io.to(socket.id).emit(
                        "chat-message",
                        msg.data,
                        msg.sender,
                        msg["socket-id-sender"]
                    );
                });
            }
        });

        // =========================================
        // WEBRTC SIGNALING
        // =========================================

        socket.on(
            "signal",
            (toId, signalMessage) => {
                if (!toId || !signalMessage) {
                    return;
                }

                io.to(toId).emit(
                    "signal",
                    socket.id,
                    signalMessage
                );
            }
        );

        // =========================================
        // CHAT MESSAGE
        // =========================================

        socket.on(
            "chat-message",
            (data, sender) => {
                if (!data || !sender) {
                    return;
                }

                let matchingRoom = null;

                for (const [room, users] of Object.entries(
                    connections
                )) {
                    if (users.includes(socket.id)) {
                        matchingRoom = room;
                        break;
                    }
                }

                if (!matchingRoom) {
                    console.log(
                        "Chat message: room not found"
                    );
                    return;
                }

                if (!messages[matchingRoom]) {
                    messages[matchingRoom] = [];
                }

                const messageObject = {
                    sender,
                    data,
                    "socket-id-sender":
                        socket.id,
                };

                messages[matchingRoom].push(
                    messageObject
                );

                // Room ke sabhi users ko message
                connections[matchingRoom].forEach(
                    (id) => {
                        io.to(id).emit(
                            "chat-message",
                            data,
                            sender,
                            socket.id
                        );
                    }
                );
            }
        );

        // =========================================
        // DISCONNECT
        // =========================================

        socket.on("disconnect", (reason) => {
            console.log(
                "Disconnected:",
                socket.id,
                reason
            );

            if (timeOnline[socket.id]) {
                const diffTime =
                    Math.abs(
                        new Date() -
                            timeOnline[socket.id]
                    );

                console.log(
                    "Time Online:",
                    diffTime / 1000,
                    "seconds"
                );
            }

            // Find user's room
            for (const [room, users] of Object.entries(
                connections
            )) {
                if (!users.includes(socket.id)) {
                    continue;
                }

                // Remove user
                connections[room] =
                    users.filter(
                        (id) =>
                            id !== socket.id
                    );

                // Notify remaining users
                connections[room].forEach(
                    (id) => {
                        io.to(id).emit(
                            "user-left",
                            socket.id
                        );
                    }
                );

                // Empty room cleanup
                if (
                    connections[room].length ===
                    0
                ) {
                    delete connections[room];

                    // Optional:
                    // room ke messages bhi remove
                    // karne hain to uncomment:
                    //
                    // delete messages[room];
                }

                break;
            }

            delete timeOnline[socket.id];
        });
    });

    return io;
};

module.exports = {
    connectToSocket,
};