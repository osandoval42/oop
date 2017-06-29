const readline = require('readline');
const es6Promise = require('es6-promise');
const reader = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promiseStart(reader){
	askQuestion(reader, "Give me the super secret password\n")
	.then((password) => {
		if (password === "password"){
			return askQuestion(reader, "Now give me the secure token\n");
		} else {
			throw "incorrect password"
		}
	})
	.then((token) => {
		if (token === "password"){
			console.log("SUCCESS");
			reader.close()
		} else {
			throw "incorrect token"
		}
	}).catch((error) => {
		console.log(error);
		promiseStart(reader);
	})
}

function askQuestion(reader, question){
	return new es6Promise.Promise((resolve, reject) => {
		reader.question(question, (answer) => {
			resolve(answer);
		})
	})
}

promiseStart(reader);