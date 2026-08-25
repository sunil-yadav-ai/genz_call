const { Router } = require("express");
const { login, register, addToHistory, getUserHistory } = require("../controllers/user.controller");
const protect = require("../middleware/authmiddleware")

const router = Router();

router.route("/login").post(login)
router.route("/register").post(register)
router.route("/add_to_activity").post(protect,addToHistory)
router.route("/get_all_activity").get(protect,getUserHistory)

module.exports =  router ;