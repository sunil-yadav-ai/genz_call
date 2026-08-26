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

const allowedOrigins = [
    "http://localhost:5173",

    // Apne actual frontend Render URL ko yahan daalo
    "https://genz-call-3.onrender.com"
];

const corsOptions = {
    origin: function (origin, callback) {

        // Postman / server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true
};

app.use(cors(corsOptions));

// ==========================================
// BODY PARSER
// ==========================================

app.use(express.json({ limit: "40kb" }));

app.use(
    express.urlencoded({
        limit: "40kb",
        extended: true
    })
);

// ==========================================
// SOCKET.IO
// ==========================================

const io = connectToSocket(server, {
    cors: corsOptions
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
        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("✅ Database is connected");

        const port = app.get("port");

        server.listen(port, "0.0.0.0", () => {
            console.log(`🚀 App is listening on port ${port}`);
        });

    } catch (error) {
        console.error("❌ Server startup error:", error);
    }
};

start();