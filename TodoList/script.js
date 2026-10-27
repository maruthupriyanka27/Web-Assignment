
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

let tasks = [];
let nextTaskId = 1;

function addTask(taskText) {
    const text = taskText.trim();

    if (text === "") {
        return;
    }

    const task = {
        id: nextTaskId++,
        text: text,
        completed: false
    };

    tasks.push(task);
    renderTasks();
}

function updateTaskStatus(taskId, isCompleted) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (task) {
        task.completed = isCompleted;
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    renderTasks();
}

function updateTaskCount() {
    const remaining = tasks.filter(function (task) {
        return !task.completed;
    }).length;

    taskCount.textContent =
        remaining + (remaining === 1 ? " task left" : " tasks left");
}

function renderTasks() {
    taskList.replaceChildren();

    emptyMessage.hidden = tasks.length !== 0;

    tasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as completed"
        );

        checkbox.addEventListener("change", function () {
            updateTaskStatus(task.id, checkbox.checked);
        });

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + task.text
        );

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        listItem.append(checkbox, taskText, deleteButton);
        taskList.appendChild(listItem);
    });

    updateTaskCount();
}

taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    addTask(taskInput.value);
    taskInput.value = "";
    taskInput.focus();
});

renderTasks();
