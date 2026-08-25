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
            token: token
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
    console.log(req.body)

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

const getUserHistory = async (req,res) =>{
    const {token} = req.query;
    try{
        const user = await User.findOne({token:token});
        const meetings = await Meeting.find({user_id: user.username})
        res.json(meetings)
    }catch(e){
        res.json({message:`Something went  wrong${e}`})
    }
} 

const addToHistory = async (req,res)=>{
    const {token ,meeting_code} = req.body;
    try{
        const user = await User.findOne({token:token});
        const newMeeting  = new Meeting({
            user_id : user.username,
            meetingCode:meeting_code
        })
        await newMeeting.save();
        res.status(201).json({message:"Added code to history"})
    }catch(e){
        res.json({message:`Something went wrong ${e}`})
    }
}

module.exports = {
    login,
    register,
    getUserHistory,
    addToHistory
};