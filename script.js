window.onload = () => {
    const form1 = document.querySelector("#addForm");

    let items = document.getElementById("items");
    let submit = document.getElementById("submit");

    let editItem = null;

    form1.addEventListener("submit", addItem);
    items.addEventListener("click", removeItem);

    // Load tasks from local storage when the page loads
    loadTasksFromLocalStorage();
};

function addItem(e) {
    e.preventDefault();

    if (submit.value != "ADD") {
        console.log("Hello");

        editItem.target.parentNode.childNodes[0].data
            = document.getElementById("item").value;

        submit.value = "ADD";
        document.getElementById("item").value = "";

        document.getElementById("lblsuccess").innerHTML
            = "Task edited successfully";
           
        document.getElementById("lblsuccess")
                        .style.display = "block";

        setTimeout(function() {
            document.getElementById("lblsuccess")
                            .style.display = "none";
        }, 3000);

        return false;
    }

    let newItem = document.getElementById("item").value;
    if (newItem.trim() == "" || newItem.trim() == null)
        return false;
    else
        document.getElementById("item").value = "";

    let li = document.createElement("li");
    li.className = "list-group-item";

    let completeButton = document.createElement("button");
    completeButton.className = "btn btn-success btn-sm float-right complete";
    completeButton.appendChild(document.createTextNode("Complete"));

    let deleteButton = document.createElement("button");
    deleteButton.className = "btn-danger btn btn-sm float-right delete";
    deleteButton.appendChild(document.createTextNode("Delete"));

    let editButton = document.createElement("button");
    editButton.className = "btn-success btn btn-sm float-right edit";
    editButton.appendChild(document.createTextNode("Edit"));

    li.appendChild(document.createTextNode(newItem));
    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    li.appendChild(editButton);

    items.appendChild(li);

    // Save tasks to local storage
    saveTasksToLocalStorage();
}

function removeItem(e) {
    e.preventDefault();
    if (e.target.classList.contains("delete")) {
        if (confirm("Are you Sure?")) {
            let li = e.target.parentNode;
            items.removeChild(li);
            document.getElementById("lblsuccess").innerHTML= "Task deleted successfully";
           
            document.getElementById("lblsuccess").style.display = "block";

            setTimeout(function() {
                document.getElementById("lblsuccess")
                        .style.display = "none";
            }, 3000);

            // Save tasks to local storage after deletion
            saveTasksToLocalStorage();

        }
    }
    if (e.target.classList.contains("edit")) {
        document.getElementById("item").value =
            e.target.parentNode.childNodes[0].data;
        submit.value = "EDIT";
        editItem = e;
    }

    if (e.target.classList.contains("complete")) {
        let taskItem = e.target.parentNode;
        taskItem.classList.add("completed");

        // Remove the buttons for completed task
        let buttons = taskItem.querySelectorAll("button");
        buttons.forEach(button => {
            button.remove();
        });

        // Save tasks to local storage after completion
        saveTasksToLocalStorage();
    }
}

function toggleButton(ref, btnID) {
    document.getElementById(btnID).disabled = false;
}

function saveTasksToLocalStorage() {
    let taskItems = document.querySelectorAll(".list-group-item");
    let tasks = [];
    taskItems.forEach(item => {
        let task = {
            text: item.innerText,
            completed: item.classList.contains("completed")
        };
        tasks.push(task);
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    let tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        tasks.forEach(task => {
            let li = document.createElement("li");
            li.className = "list-group-item";

            // Check if the task is completed
            if (task.completed) {
                li.classList.add("completed");
            }

            // Add text of the task without button names
            let taskText = document.createTextNode(task.text.split('\n')[0]);
            li.appendChild(taskText);

            if (!task.completed) {
                // Add complete button for incomplete task
                let completeButton = document.createElement("button");
                completeButton.className = "btn btn-success btn-sm float-right complete";
                completeButton.appendChild(document.createTextNode("Complete"));
                li.appendChild(completeButton);

                // Add edit button for incomplete task
                let editButton = document.createElement("button");
                editButton.className = "btn-success btn btn-sm float-right edit";
                editButton.appendChild(document.createTextNode("Edit"));
                li.appendChild(editButton);

                // Add delete button for incomplete task
                let deleteButton = document.createElement("button");
                deleteButton.className = "btn-danger btn btn-sm float-right delete";
                deleteButton.appendChild(document.createTextNode("Delete"));
                li.appendChild(deleteButton);
            } else {
                // Add delete button for completed task
                let deleteButton = document.createElement("button");
                deleteButton.className = "btn-danger btn btn-sm float-right delete";
                deleteButton.appendChild(document.createTextNode("Delete"));
                li.appendChild(deleteButton);
            }

            items.appendChild(li);
        });
    }
}