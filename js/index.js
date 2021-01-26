import TaskManager  from "./taskManager.js";

let selectedTaskId = '';
// Initialize a new TaskManager with currentId set to 0
const taskManager = new TaskManager(0);

taskManager.load();
console.log(`loaded tasks: ${taskManager.tasks}`);


// Select the New Task Form
const newTaskForm = document.querySelector('#newTaskForm');

// Add an 'onsubmit' event listener
newTaskForm.addEventListener('submit', (event) => {
    // Prevent default action
    event.preventDefault();

    // Select the inputs
    const newTaskNameInput = document.querySelector('#newTaskNameInput');
    const newTaskDescription = document.querySelector('#newTaskDescription');
    const newTaskAssignedTo = document.querySelector('#newTaskAssignedTo');
    const newTaskDueDate = document.querySelector('#newTaskDueDate');
    const submitButton = document.querySelector('#submitButton');



    /*
        Validation code here
    */

    // Get the values of the inputs
    const name = newTaskNameInput.value;
    const description = newTaskDescription.value;
    const assignedTo = newTaskAssignedTo.value;
    const dueDate = newTaskDueDate.value;

    if(submitButton.innerHTML === "Add Task") {
        // Add the task to the task manager
        taskManager.addTask(name, description, assignedTo, dueDate);
    } else {
        taskManager.getTaskById(selectedTaskId)
            .then((task)=>{
                task.name  = name;
                task.description = description;
                task.assignedTo = assignedTo;
                task.dueDate = dueDate;

                taskManager.update(task);
            })
            .catch((error)=>{
                console.log(error);
            });

        submitButton.innerHTML = "Add Task";
    }

    // Clear the form
    newTaskNameInput.value = '';
    newTaskDescription.value = '';
    newTaskAssignedTo.value = '';
    newTaskDueDate.value = '';
});

// Select the Tasks List
const tasksList = document.querySelector('#tasksList');

// Add an 'onclick' event listener to the Tasks List
tasksList.addEventListener('click', (event) => {
    // Check if a "Mark As Done" button was clicked
    if (event.target.classList.contains('done-button')) {
        processDone(event);
    }

    // Check if a "Delete" button was clicked
    if (event.target.classList.contains('delete-button')) {
        processDelete(event);
    }

    // Check if a "Edit" button was clicked
    if (event.target.classList.contains('edit-button')) {
        processEdit(event);
    }
});

function processDone(event) {
    // Get the parent Task
    const parentTask = event.target.parentElement.parentElement;

    // Get the taskId of the parent Task.
    const taskId = parentTask.dataset.taskId;

    // Get the task from the TaskManager using the taskId
    const task = taskManager.getTaskById(taskId)
        .then((task)=>{
            console.log(`task to process: ${task.id}`);
            task.status = 'DONE';
            taskManager.update(task);
        })
        .catch((error)=>{
            console.log(error);
        });

    //Async-Await method
    // try {
    //     const task = await taskManager.getTaskById(taskId);
    //     task.status = 'DONE';
    //     taskManager.update(task);  
    // } catch (error) {
    //     console.log(error);
    // }
    

}

function processDelete(event) {
    // Get the parent Task
    console.log("processDelete()");
    const parentTask = event.target.parentElement.parentElement;

    // Get the taskId of the parent Task.
    const taskId = parentTask.dataset.taskId;

    // Delete the task
    taskManager.deleteTask(taskId);
}

function processEdit(event) {
    // Get the parent Task
    console.log("processEdit()");
    const parentTask = event.target.parentElement.parentElement;

    // Get the taskId of the parent Task.
    const taskId = parentTask.dataset.taskId;

    const task = taskManager.getTaskById(taskId)
        .then((task)=>{
                selectedTaskId = taskId;
                submitButton.innerHTML = "Update Task";
                newTaskNameInput.value = task.name;
                newTaskDescription.value = task.description;
                newTaskAssignedTo.value = task.assignedTo;
                newTaskDueDate.value = task.dueDate;
            })
            .catch((error)=>{
                console.log(error);
            });

    // Async-Await method
    // try {
    //     const task = await taskManager.getTaskById(taskId);

    //     submitButton.innerHTML = "Update Task";
    
    //     selectedTaskId = task.id;
    //     newTaskNameInput.value = task.name;
    //     newTaskDescription.value = task.description;
    //     newTaskAssignedTo.value = task.assignedTo;
    //     newTaskDueDate.value = task.dueDate;
    // } catch (error) {
    //     console.log(error);
    // }

}

// window.onbeforeunload = function() {
//     console.log('Page is about to be closed!');
//     taskManager.unsubscribe();
//     return '';
// }

// window.addEventListener("beforeunload", function (e) {
//     var confirmationMessage = "\o/";
//     console.log('Page is about to be closed!');
//     taskManager.unsubscribe();

//     (e || window.event).returnValue = confirmationMessage; //Gecko + IE
//     return confirmationMessage;                            //Webkit, Safari, Chrome
// });

// document.querySelector('#unsubscribe').addEventListener('click', function (e) {
//     e.preventDefault();
//     const answer = confirm('Do you really want to close?');

//     if(answer) taskManager.unsubscribe();

// });