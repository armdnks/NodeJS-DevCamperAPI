const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authorization");
const { registerUser, loginUser, logoutUser, getMe, forgotPassword, resetPassword, updateDetails, updatePassword } = require("../controllers/auth-controllers");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/me").get(protect, getMe);
router.route("/updatedetails").put(protect, updateDetails);
router.route("/updatepassword").put(protect, updatePassword);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resettoken").put(resetPassword);

module.exports = router;
