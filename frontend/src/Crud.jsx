import { useEffect, useState } from "react";
import "./Crud.css"; // Import the external CSS

export default function Crud() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [editId, setEditId] = useState("-1");
  const [message, setMessage] = useState("");

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  const handleSubmit = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiUrl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos([...todos, { title, description }]);
            setMessage("Item added successfully");
            setTimeout(() => setMessage(""), 3000);
            setTitle("");
            setDescription("");
          } else {
            setError("Unable to create item");
          }
        })
        .catch(() => {
          setError("Unable to create item");
        });
    } else {
      setError("Both fields are required");
    }
  };

  const handleUpdate = () => {
    setError("");
    setMessage("");

    if (editTitle.trim() !== "" && editDescription.trim() !== "") {
      fetch(`${apiUrl}/todos/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editTitle, description: editDescription }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo._id === editId
                  ? { ...todo, title: editTitle, description: editDescription }
                  : todo
              )
            );
            setMessage("Item updated successfully");
            setTimeout(() => setMessage(""), 3000);
            setEditId("-1");
          } else {
            setError("Unable to update item");
          }
        })
        .catch(() => {
          setError("Unable to update item");
        });
    } else {
      setError("Both fields are required for update");
    }
  };

  const handleDelete = (id) => {
    setError("");
    setMessage("");

    fetch(`${apiUrl}/todos/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
          setMessage("Item deleted successfully");
          setTimeout(() => setMessage(""), 3000);
        } else {
          setError("Unable to delete item");
        }
      })
      .catch(() => {
        setError("Unable to delete item");
      });
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => {
        setTodos(data);
      });
  };

  return (
    <div className="crud-container">
      <header className="crud-header">
        <h1>CRUD Application</h1>
      </header>

      <div className="form-container">
        <h2>Add Task</h2>
        {message && <p className="message success">{message}</p>}
        {error && <p className="message error">{error}</p>}

        <div className="form-inputs">
          <input
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <input
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
          />
          <button onClick={handleSubmit}>Submit</button>
        </div>
      </div>

      <div className="tasks-container">
        <h2>Tasks</h2>
        <ul>
          {todos.map((item) => (
            <li key={item._id} className="task-item">
              {editId === item._id ? (
                <div className="edit-inputs">
                  <input
                    placeholder="Title"
                    onChange={(e) => setEditTitle(e.target.value)}
                    value={editTitle}
                  />
                  <input
                    placeholder="Description"
                    onChange={(e) => setEditDescription(e.target.value)}
                    value={editDescription}
                  />
                </div>
              ) : (
                <>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </>
              )}

              <div className="task-actions">
                {editId === item._id ? (
                  <button onClick={handleUpdate}>Update</button>
                ) : (
                  <button
                    onClick={() => {
                      setEditId(item._id);
                      setEditTitle(item.title);
                      setEditDescription(item.description);
                    }}
                  >
                    Edit
                  </button>
                )}
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
