const httpStatus = require("http-status");
const { User } = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {Meeting} = require("../models/meeting_model")

const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Please provide username and password"
        });
    }

    try {

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                message: "User Not Found"
            });
        }

        // Check password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }

        // Generate token
        const token = crypto
            .randomBytes(20)
            .toString("hex");

        user.token = token;

        await user.save();

        return res.status(200).json({
            message: "Login successful",
            token: token,
            user: {
                name: user.name,
                username: user.username
            }
        });

    } catch (e) {

        console.log("LOGIN ERROR:", e);

        return res.status(500).json({
            message: e.message
        });
    }
};



const register = async (req, res) => {

    const { name, username, password } = req.body;

    if (!name || !username || !password) {
        return res.status(400).json({
            message: "Please provide all fields"
        });
    }

    try {

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        return res.status(201).json({
            message: "User Registered"
        });

    } catch (e) {

        console.log("REGISTER ERROR:", e);

        return res.status(500).json({
            message: e.message
        });
    }
};

const getUserHistory = async (req, res) => {
    try {
        const meetings = await Meeting.find({
            user_id: req.user.username
        }).sort({ date: -1 });

        return res.status(200).json(meetings);
    } catch (error) {
        console.error("GET HISTORY ERROR:", error);

        return res.status(500).json({
            message: "Unable to load meeting history"
        });
    }
};

const addToHistory = async (req, res) => {
    const meetingCode = req.body?.meeting_code;

    if (typeof meetingCode !== "string" || !meetingCode.trim()) {
        return res.status(400).json({
            message: "Please provide a meeting code"
        });
    }

    try {
        const newMeeting = new Meeting({
            user_id: req.user.username,
            meetingCode: meetingCode.trim()
        });

        await newMeeting.save();

        return res.status(201).json({
            message: "Added code to history"
        });
    } catch (error) {
        console.error("ADD HISTORY ERROR:", error);

        return res.status(500).json({
            message: "Unable to save meeting history"
        });
    }
};

module.exports = {
    login,
    register,
    getUserHistory,
    addToHistory
};