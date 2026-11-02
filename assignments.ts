
interface Assignment {
    name: string;
    course: string;
    dueDate: string;
    completed: boolean;
}

let assignments: Assignment[] = [];

async function loadAssignments() {
    try {
        let data = await Deno.readTextFile("assignments.json");
        assignments = JSON.parse(data);
        console.log("Assignments loaded.");
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.log("No saved assignments found.");
        } else {
            console.log("Error loading assignments:", error);
        }
    }
}

async function saveAssignments() {
    try {
        await Deno.writeTextFile("assignments.json", JSON.stringify(assignments, null, 2));
        console.log("Assignments saved.");
    } catch (error) {
        console.log("Error saving assignments:", error);
    }
}

function addAssignment() {
    try {
        let name = prompt("Assignment name:");
        let course = prompt("Course name:");
        let dueDate = prompt("Due date (YYYY-MM-DD):");

        if (!name || !course || !dueDate) {
            throw new Error("All fields must be filled out.");
        }

        let date = new Date(dueDate);

        if (isNaN(date.getTime())) {
            throw new Error("Invalid date.");
        }

        assignments.push({
            name: name,
            course: course,
            dueDate: dueDate,
            completed: false
        });

        console.log("Assignment added.");
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        }
    }
}

function viewAssignments() {
    if (assignments.length === 0) {
        console.log("No assignments found.");
        return;
    }

    for (let i = 0; i < assignments.length; i++) {
        let assignment = assignments[i];
        let status = assignment.completed ? "Completed" : "Not Completed";

        console.log(`${i + 1}. ${assignment.name} | ${assignment.course} | Due: ${assignment.dueDate} | ${status}`);
    }
}

function completeAssignment() {
    viewAssignments();

    if (assignments.length === 0) {
        return;
    }

    let choice = Number(prompt("Enter assignment number:"));

    if (!Number.isInteger(choice) || choice < 1 || choice > assignments.length) {
        console.log("Invalid assignment number.");
        return;
    }

    assignments[choice - 1].completed = true;
    console.log("Assignment completed.");
}

function checkOverdue() {
    let today = new Date();
    let found = false;

    for (let assignment of assignments) {
        let due = new Date(assignment.dueDate + "T23:59:59");

        if (due < today && !assignment.completed) {
            console.log(`${assignment.name} for ${assignment.course} is overdue.`);
            found = true;
        }
    }

    if (!found) {
        console.log("No overdue assignments.");
    }
}

await loadAssignments();

let running = true;

while (running) {
    console.log("\nCollege Assignment Tracker");
    console.log("1. Add Assignment");
    console.log("2. View Assignments");
    console.log("3. Complete Assignment");
    console.log("4. Check Overdue Assignments");
    console.log("5. Save Assignments");
    console.log("6. Exit");

    let choice = prompt("Choose an option:");

    switch (choice) {
        case "1":
            addAssignment();
            break;
        case "2":
            viewAssignments();
            break;
        case "3":
            completeAssignment();
            break;
        case "4":
            checkOverdue();
            break;
        case "5":
            await saveAssignments();
            break;
        case "6":
            await saveAssignments();
            running = false;
            break;
        default:
            console.log("Invalid option.");
    }
}

console.log("Goodbye!");