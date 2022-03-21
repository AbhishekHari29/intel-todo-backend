const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth")

const router = new express.Router();

/**
 * HTTP Endpoints for 'Task' performing CRUD Operation
 */

//Create Task
router.post("/tasks", auth, async (req, res) => {
	const task = new Task({ ...req.body, owner: req.user._id })
	try {
		const result = await task.save();
		res.send(result);
	} catch (error) {
		res.status(400).send();
	}
});

//Read all Tasks
router.get("/tasks", auth, async (req, res) => {
	const limit = parseInt(req.query.limit)
	const skip = parseInt(req.query.skip)
	const match = {}
	const sort = {}

	if (req.query.completed)
		match.completed = req.query.completed === 'true'

	if (req.query.sortBy) {
		const parts = req.query.sortBy.split(":")
		sort[parts[0]] = parts[1] === "desc" ? -1 : 1
	}

	try {
		await req.user.populate({
			path: "tasks",
			match,
			options: {
				limit,
				skip,
				sort
			}
		}).execPopulate()
		res.send(req.user.tasks)
	} catch (error) {
		res.status(500).send(error);
	}
});

//Read Task by Id
router.get("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOne({ _id, owner: req.user._id })
		if (!task) return res.status(404).send();
		res.send(task);
	} catch (error) {
		res.status(500).send();
	}
});

//Update Task by Id
router.patch("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;

	const updates = Object.keys(req.body);
	const allowedUpdates = ["description", "completed"];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation)
		return res.status(400).send({ error: "Invalid Update Operation" });

	try {
		const task = await Task.findOne({ _id, owner: req.user._id })
		if (!task) return res.status(404).send();
		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();
		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

//Delete Task by Id
router.delete("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id;
	try {
		const task = await Task.findOneAndDelete({ _id, owner: req.user._id })
		if (!task) return res.status(404).send();
		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = router;
