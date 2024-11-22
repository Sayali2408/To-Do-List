document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskCategory = document.getElementById("taskCategory");
    const taskPriority = document.getElementById("taskPriority");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
    const showAllButton = document.getElementById("showAll");
    const showPendingButton = document.getElementById("showPending");
    const showCompletedButton = document.getElementById("showCompleted");
    const searchInput = document.getElementById("searchInput");
  
    let tasks = [];
  
    function renderTasks(filter = "All", searchQuery = "") {
      taskList.innerHTML = "";
      let filteredTasks = tasks.filter(task => {
        if (filter === "Pending") return !task.completed;
        if (filter === "Completed") return task.completed;
        return true;
      });
  
      if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => {
          return (
            task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.priority.toLowerCase().includes(searchQuery.toLowerCase())
          );
        });
      }
  
      filteredTasks.sort((a, b) => {
        const priorityOrder = { High: 1, Medium: 2, Low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
  
      filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = `list-group-item d-flex justify-content-between align-items-center priority-${task.priority.toLowerCase()}`;
        if (task.completed) taskItem.classList.add("completed");
  
        taskItem.innerHTML = `
          <span>
            <strong>${task.name}</strong> 
            <em>${task.date ? `(${task.date})` : ""}</em> 
            <span class="badge bg-info">${task.category}</span>
          </span>
          <div>
            <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}" class="mark-complete">
            <button class="btn btn-danger btn-sm delete-task" data-index="${index}">Delete</button>
          </div>
        `;
  
        taskList.appendChild(taskItem);
      });
    }
  
    addTaskButton.addEventListener("click", () => {
      const taskName = taskInput.value.trim();
      const taskDateValue = taskDate.value;
      const taskCategoryValue = taskCategory.value;
      const taskPriorityValue = taskPriority.value || "Low";
  
      if (taskName) {
        tasks.push({
          name: taskName,
          date: taskDateValue,
          category: taskCategoryValue,
          priority: taskPriorityValue,
          completed: false
        });
  
        taskInput.value = "";
        taskDate.value = "";
        taskCategory.value = "";
        taskPriority.value = "";
        renderTasks();
      }
    });
  
    taskList.addEventListener("click", e => {
      if (e.target.classList.contains("mark-complete")) {
        const index = e.target.dataset.index;
        tasks[index].completed = e.target.checked;
        renderTasks();
      } else if (e.target.classList.contains("delete-task")) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        renderTasks();
      }
    });
  
    showAllButton.addEventListener("click", () => renderTasks("All"));
    showPendingButton.addEventListener("click", () => renderTasks("Pending"));
    showCompletedButton.addEventListener("click", () => renderTasks("Completed"));
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.trim();
      renderTasks("All", query);
    });
  });
  