const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);



require("dotenv").config();
const express = require("express");
const { createServer } = require("node:http");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./src/routes/userRoutes.js");
const { connectToSocket } = require("./src/controllers/socketManager.js");


const app = express();
const server = createServer(app);

// ==========================================
// CORS
// ==========================================

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

app.use(cors(corsOptions));

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: "40kb" }));

app.use(
    express.urlencoded({
        limit: "40kb",
        extended: true,
    })
);

// ==========================================
// SOCKET.IO
// ==========================================

const io = connectToSocket(server, {
    cors: corsOptions,
});



// ==========================================
// ROUTES
// ==========================================

app.use("/api/v1/users", userRoutes);

// ==========================================
// PORT
// ==========================================

app.set("port", process.env.PORT || 8000);

// ==========================================
// DATABASE + SERVER
// ==========================================

const start = async () => {
    try {
        console.log("MONGO_URI:", process.env.MONGO_URI);
        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log("✅ Database is connected");

        server.listen(app.get("port"), () => {
            console.log(
                `🚀 App is listening on port ${app.get("port")}`
            );
            console.log(
                `🌐 Server: http://localhost:${app.get("port")}`
            );
        });

    } catch (error) {
        console.error("❌ Server startup error:", error);
    }
};

start();