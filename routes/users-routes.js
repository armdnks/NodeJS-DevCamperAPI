const express = require("express");
const router = express.Router({ mergeParams: true });

const User = require("../models/user-model");
const advancedResults = require("../middleware/advanced-results");
const { protect, authorize } = require("../middleware/authorization");
const { getUsers, getUser, createUser, updateUser, deleteUser } = require("../controllers/users-controllers");

router.use(protect);
router.use(authorize("admin"));

router.route("/").get(advancedResults(User), getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
