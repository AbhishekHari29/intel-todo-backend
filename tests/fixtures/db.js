const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
	_id: userOneId,
	name: "User One",
	email: "userone@example.com",
	password: "UserOne@123",
	tokens: [
		{
			token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
		}
	]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
	_id: userTwoId,
	name: "User Two",
	email: "usertwo@example.com",
	password: "UserTwo@987",
	tokens: [
		{
			token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
		}
	]
};

const taskOneId = new mongoose.Types.ObjectId();
const taskOne = {
	_id: taskOneId,
	description: "Task One",
	completed: true,
	owner: userOneId
};

const taskTwoId = new mongoose.Types.ObjectId();
const taskTwo = {
	_id: taskTwoId,
	description: "Task Two",
	completed: false,
	owner: userOneId
};

const taskThreeId = new mongoose.Types.ObjectId();
const taskThree = {
	_id: taskThreeId,
	description: "Task Three",
	owner: userTwoId
};

const populateDatabase = async () => {
	await User.deleteMany();
	await Task.deleteMany();

	await new User(userOne).save();
	await new User(userTwo).save();

	await new Task(taskOne).save();
	await new Task(taskTwo).save();
	await new Task(taskThree).save();
};

module.exports = {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	taskOneId,
	taskOne,
	taskTwo,
	taskTwoId,
	taskThree,
	taskThreeId,
	populateDatabase
};
