const readline = require("readline");
const fs = require("fs");
const path = "./tasks.json";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let taskList = [];

function saveTasksToFile() {
  fs.writeFileSync(path, JSON.stringify(taskList, null, 2));
}

function loadTasksFromFile() {
  try {
    if (fs.existsSync(path)) {
      const data = fs.readFileSync(path, "utf8");
      taskList = JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading tasks from file:", error.message);
    taskList = [];
  }
}

function taskManager() {
  console.clear();
  rl.question(
    `Welcome to your task manager, Press:
1. to see all your tasks
2. to add a task
3. to delete a task
4. to mark a task as done
5. to Exit the task manager
Your choice: `,
    function (answer) {
      if (answer == 1) {
        seeTasks();
      } else if (answer == 2) {
        addTask();
      } else if (answer == 3) {
        rmTask();
      } else if (answer == 4) {
        markTask();
      } else if (answer == 5) {
        saveTasksToFile();
        exitTaskManager();
      } else {
        taskManager();
        console.log("\nError: You have to choose a number between 1 and 5:");
      }
    }
  );
}

function seeTasks() {
  console.clear();
  if (taskList != "") {
    console.log(`Task List:\n${taskList.join("")}\n`);
    rl.question(
      "Press ENTER to go back to the Task Manager: ",
      function (answer) {
        if (answer == "") {
          console.clear();
          taskManager();
        } else {
          seeTasks();
          console.log("\nError, retry");
        }
      }
    );
  } else {
    console.log("You still haven't defined any task\n");
    rl.question(
      "Press ENTER to go back to the Task Manager: ",
      function (answer) {
        if (answer == "") {
          console.clear();
          taskManager();
        } else {
          seeTasks();
          console.log("\nError, retry:");
        }
      }
    );
  }
}

function addTask() {
  console.clear();
  rl.question("Write here the task you want to add: ", function (answer) {
    if (answer != "") {
      taskList.push("\n* " + answer);
      saveTasksToFile();
      console.clear();
      taskManager();
    } else if (answer == "") {
      taskManager();
    } else {
      addTask();
      console.log("\nError, retry or press ENTER to exit:");
    }
  });
}

function rmTask() {
  console.clear();
  rl.question(
    "Write here the number task you want to remove:",
    function (answer) {
      if (isNaN(answer)) {
        rmTask();
        console.log("\nError misspelled, retry or press ENTER to exit:");
      } else if (answer == "") {
        taskManager();
      } else {
        taskList.splice(answer - 1, 1);
        saveTasksToFile();
        console.clear();
        taskManager();
      }
    }
  );
}

function markTask() {
  console.clear();
  rl.question("Which task have you finished?", function (answer) {
    if (isNaN(answer)) {
      markTask();
      console.log("\nError misspelled, retry or press ENTER to exit:");
    } else if (answer == "") {
      taskManager();
    } else if (taskList[answer - 1].includes("✅")) {
      taskList[answer - 1] = taskList[answer - 1].replace(" ✅", "");
      saveTasksToFile();
      taskManager();
    } else if (taskList[answer - 1].includes("✅") == false) {
      taskList[answer - 1] = taskList[answer - 1] + " ✅";
      saveTasksToFile();
      taskManager();
    } else {
      markTask();
      console.log("\nError, retry or press ENTER to exit:");
    }
  });
  saveTasksToFile();
  taskManager();
}

function exitTaskManager() {
  console.clear();
  process.exit();
}

loadTasksFromFile();

taskManager();
