// ===== Elements =====
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const countEl = document.getElementById("count");
const clearDoneBtn = document.getElementById("clearDone");
const filterButtons = document.querySelectorAll(".chip[data-filter]");

// Safety check (prevents the null addEventListener crash)
if (!taskForm || !taskInput || !taskList || !emptyState || !countEl || !clearDoneBtn) {
  console.error("Missing HTML IDs. Make sure you're using the modern index.html with taskForm/taskInput/taskList.");
}

// ===== Storage =====
const STORAGE_KEY = "david_todo_tasks_v1";
let tasks = [];
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    tasks = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    tasks = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ===== Helpers =====
function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function updateCount() {
  countEl.textContent = String(tasks.length);
}

function updateEmptyState() {
  emptyState.style.display = tasks.length === 0 ? "block" : "none";
}

function setActiveFilterButton(filter) {
  filterButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filter));
}

function filteredTasks() {
  if (currentFilter === "active") return tasks.filter(t => !t.done);
  if (currentFilter === "done") return tasks.filter(t => t.done);
  return tasks;
}

// ===== Render =====
function render() {
  taskList.innerHTML = "";

  const visible = filteredTasks();

  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = "task" + (task.done ? " done" : "");

    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "check";
    checkbox.checked = task.done;

    checkbox.addEventListener("change", () => {
      task.done = !task.done;
      saveTasks();
      render();
    });

    const text = document.createElement("span");
    text.className = "text";
    text.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(text);

    const actions = document.createElement("div");
    actions.className = "actions";

    const delBtn = document.createElement("button");
    delBtn.className = "iconBtn";
    delBtn.type = "button";
    delBtn.title = "Delete task";
    delBtn.textContent = "🗑️";

    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      render();
    });

    actions.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  updateCount();
  updateEmptyState();
}

// ===== Events =====
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = cleanText(taskInput.value);
  if (!text) return;

  tasks.unshift({
    id: String(Date.now()),
    text,
    done: false
  });

  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  render();
});

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    setActiveFilterButton(currentFilter);
    render();
  });
});

clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done);
  saveTasks();
  render();
});

// ===== Init =====
loadTasks();
setActiveFilterButton(currentFilter);
render();