const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const auth = require("../middleware/auth");
const User = require("../models/user");

const router = new express.Router();
const upload = multer({
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
			return cb(new Error("Please upload a Image File"));
		cb(undefined, true);
	}
});

//Login User
router.post("/users/login", async (req, res) => {
	try {
		const user = await User.findByCredentials(
			req.body.email,
			req.body.password
		);
		const token = await user.generateAuthToken();
		res.send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

//Logout User
router.post("/users/logout", auth, async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter(
			(token) => token.token !== req.token
		);
		await req.user.save();
		res.send();
	} catch (error) {
		res.send(500).send(error);
	}
});

//Logout All
router.post("/users/logoutAll", auth, async (req, res) => {
	try {
		req.user.tokens = [];
		await req.user.save();
		res.send();
	} catch (error) {
		res.send(500).send(error);
	}
});

//Create User
router.post("/users", async (req, res) => {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (error) {
		res.status(400).send(error);
	}
});

//Read User Profile
router.get("/users/me", auth, async (req, res) => {
	res.send(req.user);
});

//Update User
router.patch("/users/me", auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ["name", "email", "password", "age"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation)
		return res.status(400).send({ error: "Invalid Update Operation" });

	try {
		updates.forEach((update) => (req.user[update] = req.body[update]));
		await req.user.save();
		res.send(req.user);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Delete User
router.delete("/users/me", auth, async (req, res) => {
	try {
		await req.user.remove();
		res.send(req.user);
	} catch (error) {
		res.status(500).send(error);
	}
});

//Upload Profile avatar
router.post(
	"/users/me/avatar",
	auth,
	upload.single("avatar"),
	async (req, res) => {
		const buffer = await sharp(req.file.buffer)
			.resize({ width: 250, height: 250 })
			.png()
			.toBuffer();
		req.user.avatar = buffer;
		await req.user.save();
		res.send("Profile avatar uploaded successfully");
	},
	(error, req, res, next) => {
		res.status(400).send({ error: error.message });
	}
);

//Get Profile avatar
router.get("/users/:id/avatar", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		if (!user || !user.avatar) throw new Error();
		res.set("Content-Type", "image/jpg");
		res.send(user.avatar);
	} catch (error) {
		res.status(404).send();
	}
});

//Delete Profile avatar
router.delete("/users/me/avatar", auth, async (req, res) => {
	req.user.avatar = undefined;
	await req.user.save();
	res.send("Profile avatar deleted successfully");
});

module.exports = router;
