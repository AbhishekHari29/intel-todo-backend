const postmark = require("postmark");

const client = new postmark.ServerClient(process.env.POSTMARK_APIKEY);

/**
 *Sends a Welcome Mail to the Account User
 * @param {string} email Receiver's Email
 * @param {string} name Receiver's Name
 */
const sendWelcomeEmail = (email, name) => {
	try {
		client.sendEmail({
			From: "abhishek.t2018@vitstudent.ac.in",
			To: email,
			Subject: "Welcome to Task Manager",
			HtmlBody: `<strong>Hello</strong>, ${name}.`,
			TextBody: "We are happy to see you here!",
			MessageStream: "task-manager-api"
		});
	} catch (error) {
		console.log(error);
	}
};

/**
 *Sends a Cancellation Mail to the Account User
 * @param {string} email Receiver's Email
 * @param {string} name Receiver's Name
 */
const sendCancellationEmail = (email, name) => {
	try {
		client.sendEmail({
			From: "abhishek.t2018@vitstudent.ac.in",
			To: email,
			Subject: "Sorry that you're leaving!",
			HtmlBody: `<strong>Hello</strong>, ${name}.`,
			TextBody:
				"We are sad to see you leave. Hope that you join us soon.",
			MessageStream: "task-manager-api"
		});
	} catch (error) {
		console.log(error);
	}
};

module.export = {
	sendWelcomeEmail,
	sendCancellationEmail
};
