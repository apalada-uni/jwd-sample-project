import {db} from "./database.js";

// Create the HTML for a task
// Add an data-task-id attribute to each task
// OPTIONAL 1: Add visible or invisible class to the "Mark As Done" button depending on if the status is 'TODO'
// OPTIONAL 2: Change the styling of the status pill depending on the passed in status
// Add a Delete button with the class delete-button
const createTaskHtml = (id, name, description, assignedTo, dueDate, status) => `
    <li class="list-group-item" data-task-id=${id}>
        <div class="d-flex w-100 mt-2 justify-content-between align-items-center">
            <h5>${name}</h5>
            <span class="badge ${status === 'TODO' ? 'badge-danger' : 'badge-success'}">${status}</span>
        </div>
        <div class="d-flex w-100 mb-3 justify-content-between">
            <small>Assigned To: ${assignedTo}</small>
            <small>Due: ${dueDate}</small>
        </div>
        <p>${description}</p>
        <div class="d-flex w-100 justify-content-end">
            <button class="btn btn-outline-success done-button mr-1 ${status === 'TODO' ? 'visible' : 'invisible'}">Mark As Done</button>
            <button class="btn btn-outline-primary edit-button mr-1 ${status === 'TODO' ? 'visible' : 'invisible'}">Edit</button>
            <button class="btn btn-outline-danger delete-button">Delete</button>
        </div>
    </li>
`;

// Create a TaskManager class
export default class TaskManager {
    // Set up the tasks and currentId property in the contructor
    constructor(currentId = 0) {
        this.tasks = [];

        // Use onSnapshot() to get a synchronous and live data updates
        // this.unsubscribe = db.collection("tasks")
        //     .orderBy('name', 'asc')
        //     .onSnapshot((snapshot) => {
        //         this.tasks = snapshot.docs.map((doc) => ({
        //             id: doc.id,
        //             ...doc.data(),
        //         }));

        //         this.render();
        //     });
    }

    // Create the addTask method
    addTask(name, description, assignedTo, dueDate) {
        //Adding document to a collection in the Firestore
        db.collection("tasks").add({
            name: name,
            description: description,
            assignedTo: assignedTo,
            dueDate: dueDate,
            status: 'TODO'
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            this.load();
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    }

    // Create the deleteTask method
    deleteTask(taskId) {
        //Deleting a document from a collection in the Firestore
        db.collection("tasks")
            .doc(taskId)
            .delete()
            .then(() => {
                console.log("Document deleted");
                this.load();
            }) 
            .catch((error) => console.error("Error deleting document", error));
    }


    getTaskById(taskId) {
        // Getting data from the collection in Firestore
        return db.collection("tasks")
            .doc(taskId)
            .get()
            .then((doc) => {
                if (!doc.exists) return;
                
                const data = {
                    id: doc.id,
                    ...doc.data()
                }
                console.log("Document:", data);

                return data;
              })
            .catch((error)=> {
                console.error("Error in getting task: ", error);
                return error;
            })
    }

    // Load the collection data from the database
    load() {
        db.collection("tasks")
            .orderBy('name', 'desc') // set order by name
            .get()
            .then((snapshot) => {
                this.tasks = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("All data in 'tasks' collection", this.tasks);
                this.render()
            });
    }

    // Create the render method
    render() {
        // Create an array to store the tasks' HTML
        const tasksHtmlList = [];
        console.log(`tasks: ${this.tasks.length}`);

        // Loop over our tasks and create the html, storing it in the array
        for (let i = 0; i < this.tasks.length; i++) {
            // Get the current task in the loop
            const task = this.tasks[i];

            // Format the date
            const date = new Date(task.dueDate);
            const formattedDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();

            // Create the task html
            // Pass the task id as a parameter
            const taskHtml = createTaskHtml(task.id, task.name, task.description, task.assignedTo, formattedDate, task.status);

            // Push it to the tasksHtmlList array
            tasksHtmlList.push(taskHtml);
        }

        // Create the tasksHtml by joining each item in the tasksHtmlList
        // with a new line in between each item.
        const tasksHtml = tasksHtmlList.join('\n');

        // Set the inner html of the tasksList on the page
        const tasksList = document.querySelector('#tasksList');
        tasksList.innerHTML = tasksHtml;
    }

    // Create the update method
    update(task) {
        return db.collection("tasks")
            .doc(task.id)
            .update({
                // id: task.id,
                  ...task,
              })
              .then(() => {
                console.log("Document updated"); // Document updated
                this.load();
            })
              .catch((error) => {
                console.error("Error updating doc", error);
              });	
    }
}

