const input = document.getElementById('todo-input');
const addbtn = document.getElementById('add-btn');
const list = document.querySelector('.todo-list');
const priority = document.querySelector("#priority-task");
const pendingCount = document.querySelector("#pending-count");

const saved = localStorage.getItem('todos');
const todos = saved ? JSON.parse(saved) : [];

let currentFilter = 'all'
const priorityMap = {
    "High": 3,
    "Medium": 2,
    "Low": 1
};

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Create a single todo list item
function createTodo(todo) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener("change", () => {
        todo.completed = checkbox.checked;

        textspan.style.textDecoration = todo.completed ? 'line-through' : "";
        priorityspan.style.textDecoration = todo.completed ? 'line-through' : "";

        saveTodos();
        render(currentFilter)
    })

    const textspan = document.createElement("span");
    textspan.textContent = todo.text;
    const priorityspan = document.createElement("span");
    priorityspan.textContent = todo.priority;
    priorityspan.classList.remove("priority-high", "priority-medium", "priority-low");

    if (todo.priority === "High") {
        priorityspan.classList.add("priority-high");
    } else if (todo.priority === "Medium") {
        priorityspan.classList.add("priority-medium");
    }

    else {
        priorityspan.classList.add("priority-low");

    }
    if (todo.completed) {
        textspan.style.textDecoration = 'line-through';
        priorityspan.style.textDecoration = 'line-through';
        textspan.style.color = 'gray';
        priorityspan.style.color = 'gray';
    }
    textspan.addEventListener("dblclick", () => {
        const newText = prompt('Edit todo', todo.text);
        if (newText !== null && newText.trim() !== "") {
            todo.text = newText.trim();
            saveTodos();
            render(currentFilter);
        }
    });

    if (!todo.completed) {
        priorityspan.addEventListener("click", () => {
            const select = document.createElement('select');
            ['High', 'Medium', 'Low'].forEach(level => {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = level;
                if (level === todo.priority) option.selected = true;
                select.appendChild(option);
            });
            li.insertBefore(select, delbtn);
            select.focus();

            select.addEventListener('change', () => {
                // if (todo.priority !== select.value) {
                // }
                todo.priority = select.value;
                saveTodos();
                render(currentFilter);
            });
            select.addEventListener('blur', () => {
                if (li.contains(select)) li.removeChild(select);
            });

        });
    }

    // Delete
    const delbtn = document.createElement('button');
    delbtn.textContent = 'Delete'
    delbtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task?')) {
            const index = todos.indexOf(todo);
            if (index > -1) todos.splice(index, 1);
            saveTodos();
            render(currentFilter);
        }


    })


    li.appendChild(checkbox);
    li.appendChild(textspan);
    li.appendChild(priorityspan);
    li.appendChild(delbtn);
    return li;


}


// Render todos based on active filter
function render(filter = 'all') {
    currentFilter = filter;
    list.innerHTML = '';
    let filteredTodos = todos;

    if (filter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    else if (filter === 'pending') {
        filteredTodos = todos.filter(todo => !todo.completed);
    }

    let pendingTodos = filteredTodos.filter(todo => !todo.completed);
    let completedTodos = filteredTodos.filter(todo => todo.completed);


    pendingTodos.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority])
    completedTodos.sort((a, b) => priorityMap[b.priority] - priorityMap[a.priority])

    let displayTodos = pendingTodos.concat(completedTodos)
    displayTodos.forEach(todo => {
        const node = createTodo(todo)
        list.appendChild(node);
    });

    const count = todos.filter(todo => !todo.completed).length;
    pendingCount.textContent = `${count} tasks remaining`;

}


// Adds a new todo item
function addTodo() {
    const text = input.value.trim();
    const selectedPriority = priority.value;
    if (!text) {
        return;
    }

    todos.push({ text: text, completed: false, priority: selectedPriority });
    input.value = "";
    saveTodos();
    render(currentFilter);

}

// Filter button active states
function setActiveFilterButton(activeId) {
    document.querySelectorAll('#filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(activeId).classList.add('active');
}

// Event listeners
addbtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        addTodo();
    }
})

document.getElementById('all-btn').addEventListener('click', () => {
    render('all');
    setActiveFilterButton('all-btn');
});

document.getElementById('completed-btn').addEventListener('click', () => {
    render('completed');
    setActiveFilterButton('completed-btn');
});

document.getElementById('pending-btn').addEventListener('click', () => {
    render('pending');
    setActiveFilterButton('pending-btn');
});

// Initial render
render(currentFilter)
setActiveFilterButton('all-btn');
