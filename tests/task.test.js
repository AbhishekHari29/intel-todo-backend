const request = require("supertest");
const Task = require("../src/models/task");
const app = require("../src/app");
const {
	userOne,
	userOneId,
	userTwo,
	userTwoId,
	taskOne,
	taskOneId,
	taskTwo,
	taskTwoId,
	taskThree,
	taskThreeId,
	populateDatabase
} = require("./fixtures/db");

beforeEach(populateDatabase);

test("Create Task", async () => {
	const response = await request(app)
		.post("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send({ description: "Sample Task One" })
		.expect(200);

	const task = await Task.findById(response.body._id);
	expect(task).not.toBeNull();
	expect(task.completed).toBe(false);
	expect(task.owner.toString()).toBe(userOneId.toString());
});

test("Get User's tasks", async () => {
	const response = await request(app)
		.get("/tasks")
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	expect(response.body.length).toBe(2);
	expect(
		response.body.every(
			(task) => task.owner.toString === userOneId.toString()
		)
	);
});

test("Delete unauthorized task", async () => {
	await request(app)
		.delete(`/tasks/${taskOneId.toString()}`)
		.set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
		.send()
		.expect(404);
	const task = await Task.findById(taskOneId);
	expect(task).not.toBeNull();
});

test("Delete authorized task", async () => {
	await request(app)
		.delete(`/tasks/${taskOneId.toString()}`)
		.set("Authorization", `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200);
	const task = await Task.findById(taskOneId);
	expect(task).toBeNull();
});
