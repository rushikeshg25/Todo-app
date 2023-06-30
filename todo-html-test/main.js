// show message
function showMessage(message, type) {
  const messageContainer = document.getElementById("messageContainer");

  const messageElement = document.createElement("div");
  messageElement.classList.add("message", type);
  messageElement.textContent = message;

  messageContainer.appendChild(messageElement);

  setTimeout(() => {
    messageContainer.removeChild(messageElement);
  }, 3000);
}

// display data in table
function createTd(className, content) {
  const td = document.createElement("td");
  td.setAttribute("class", className);
  td.textContent = content;
  return td;
}
// function createButton(className,){

// }
function deleteTodo(id) {
  fetch(`/todos/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (!res.ok) {
        // alert("Not found.");
        showMessage(`Failed, ${res.status}`, "error");
        return;
      }
      let tr = document.getElementById(id);
      if (!tr) return;
      tr.innerHTML = "";
      showMessage("Deleted", "success");
    })
    .catch((err) => {
      //   alert(err);
      showMessage(`Failed, ${err}`, "error");
      console.log(err);
    });
}
function updateTable(data) {
  const tbody = document.getElementById("tbody");
  tbody.innerHTML = "";
  data.forEach((todo) => {
    const tr = document.createElement("tr");
    tr.setAttribute("id", todo.id);
    tr.setAttribute("class", "tr");

    const tdTitle = createTd("title", todo.data.title);
    const tdDescription = createTd("description", todo.data.description);
    const tdId = createTd("id", todo.id);

    const tdAction = document.createElement("td");
    tdAction.setAttribute("id", "action");
    const tdButton = document.createElement("button");
    tdButton.innerHTML = "delete";
    tdButton.setAttribute("class", "button");
    tdButton.onclick = () => deleteTodo(todo.id);
    tdAction.appendChild(tdButton);

    tr.append(tdTitle, tdDescription, tdId, tdAction);
    tbody.appendChild(tr);
  });
}
// get all
function getTodos() {
  fetch("/todos")
    .then((res) => {
      if (res.ok) {
        return res;
      }
      showMessage(`Empty, ${res.status}`, 'error');
      throw Error("Empty");
    })
    .then((response) => response.json())
    .then(updateTable)
    .catch((err) => {
      //   alert(err);
      if (err.message != "Empty") showMessage(`Failed, ${err}`, "error");
      console.log(err);
    });
}

// handle form submit

// add form event
const addForm = document.getElementById("add");
addForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission
  const formData = new FormData(addForm);
  const searchParams = new URLSearchParams(formData).toString();
  fetch("/todos", {
    method: "POST",
    body: searchParams,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => {
      if (response.ok) {
        // alert("Todo added successfully");
        showMessage("Todo added successfully", "success");
        getTodos();
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// update form event
const updateForm = document.getElementById("update");
updateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(updateForm);
  const id = formData.get("id");
  const searchParams = new URLSearchParams(formData).toString();
  fetch(`/todos/id`, {
    method: "PUT",
    body: searchParams,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((res) => {
      if (!res.ok) {
        // alert(res.status);
        showMessage(`Failed, ${res.status}`, "error");
        console.log(res.status);
        return;
      }
      const id = formData.get("id");
      const tr = document.getElementById(id);
      if (!tr) return;
      tr.innerHTML = "";
      const tdTitle = createTd("title", formData.get("title"));
      const tdDescription = createTd(
        "description",
        formData.get("description")
      );
      const tdId = createTd("id", formData.get("id"));
      const tdAction = document.createElement("td");
      tdAction.setAttribute("id", "action");
      const tdButton = document.createElement("button");
      tdButton.innerHTML = "delete";
      tdButton.setAttribute("class", "button");
      tdButton.onclick = () => deleteTodo(id);
      tdAction.appendChild(tdButton);
      tr.append(tdTitle, tdDescription, tdId, tdAction);
    })
    .catch((err) => {
      //   alert(err);
      showMessage(`Failed, ${err}`, "error");
      console.log(err);
    });
});

// delete form event
const deleteForm = document.getElementById("delete");
deleteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(deleteForm);
  deleteTodo(formData.get("id"));
});

// get by id form event
const getForm = document.getElementById("getid");
getForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(getForm);
  const id = formData.get("id");
  fetch(`/todos/${id}`, {
    method: "get",
  })
    .then((res) => {
      if (!res.ok) {
        showMessage(`Failed, ${res.status}`, "error");
        throw Error(res.status);
      }
      return res;
    })
    .then((res) => res.json())
    .then((data) =>
      updateTable([
        {
          data: { title: data.title, description: data.description },
          id: data.id,
        },
      ])
    )
    .catch((err) => console.log(err));
});
