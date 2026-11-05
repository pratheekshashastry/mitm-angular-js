let tasks = [
    {
        id: 1,
        title: "Submit AngularJS Assignment",
        priority: "High",
        completed: false
    },
    {
        id: 2,
        title: "Read Supabase Documentation",
        priority: "Medium",
        completed: true
    }
];

let currentFilter = "all";

// Add Task Function
function addTask() {

    const input = document.getElementById("taskInput");
    const priority = document.getElementById("priority");

    const title = input.value.trim();

    if (title === "") {
        alert("Please enter a task!");
        input.focus();
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        priority: priority.value,
        completed: false
    };

    tasks.push(newTask);

    input.value = "";

    currentFilter = "all";

    updateFilterButtons();

    displayTasks();

    input.focus();
}

// Enter Key Submit
document.getElementById("taskInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        event.preventDefault();
        addTask();
    }

});

// Update Filter Buttons
function updateFilterButtons() {

    document.querySelectorAll(".filter-btn").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );

    });

}

// Display Tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return task.completed === false;
        }

        if (currentFilter === "completed") {
            return task.completed === true;
        }

        return true;

    });

    if (filteredTasks.length === 0) {

        const empty = document.createElement("li");

        empty.className = "empty";
        empty.textContent = "No tasks found!";

        taskList.appendChild(empty);

    }

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = "task";

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        checkbox.addEventListener("change", function() {
            toggleTask(task.id);
        });

        // Task Information
        const info = document.createElement("div");

        info.className = "task-info";

        const title = document.createElement("div");

        title.className = "task-title";
        title.textContent = task.title;

        const badge = document.createElement("span");

        badge.className = "priority " + task.priority;
        badge.textContent = task.priority + " Priority";

        info.appendChild(title);
        info.appendChild(badge);

        // Delete Button
        const deleteBtn = document.createElement("button");

        deleteBtn.type = "button";
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function() {
            deleteTask(task.id);
        });

        li.appendChild(checkbox);
        li.appendChild(info);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);

    });

    updateProgress();

}

// Toggle Task Completion
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };

        }

        return task;

    });

    displayTasks();

}

// Delete Task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    displayTasks();

}

// Filter Tasks
document.querySelectorAll(".filter-btn").forEach(button => {

    button.addEventListener("click", function() {

        currentFilter = this.dataset.filter;

        updateFilterButtons();

        displayTasks();

    });

});

// Mark All as Done
function markAllDone() {

    tasks = tasks.map(task => {

        return {
            ...task,
            completed: true
        };

    });

    displayTasks();

}

// Clear All Completed
function clearCompleted() {

    tasks = tasks.filter(task => !task.completed);

    displayTasks();

}

// Progress Counter
function updateProgress() {

    const total = tasks.length;

    const completed = tasks.filter(
        task => task.completed
    ).length;

    let percentage = total === 0
        ? 0
        : (completed / total) * 100;

    document.getElementById("counter").textContent =
        completed + " of " + total + " tasks completed";

    document.getElementById("progressBar").style.width =
        percentage + "%";

}

// Button Event Listeners
document.getElementById("addBtn")
    .addEventListener("click", addTask);

document.getElementById("markAllBtn")
    .addEventListener("click", markAllDone);

document.getElementById("clearBtn")
    .addEventListener("click", clearCompleted);

// Initial Display
displayTasks();