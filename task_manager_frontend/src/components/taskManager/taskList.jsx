import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskForm from './taskForm';
import './tasklist.css'; // Import the CSS for styling

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [updatedTitle, setUpdatedTitle] = useState('');
    const [updatedDescription, setUpdatedDescription] = useState('');
    const [updatedIsCompleted, setUpdatedIsCompleted] = useState(false);
    const [errors, setErrors] = useState({});
    const accessToken = sessionStorage.getItem('accessToken');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await axios.get('http://localhost:8000/api/tasks/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTasks(res.data);
        };
        fetchTasks();
    }, [accessToken]);

    const validateInputs = () => {
        let errors = {};
        if (!updatedTitle) {
            errors.title = "Title is required";
        }
        if (!updatedDescription) {
            errors.description = "Description is required";
        }
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleUpdateClick = (task) => {
        setEditingTask(task.id);
        setUpdatedTitle(task.title);
        setUpdatedDescription(task.description);
        setUpdatedIsCompleted(task.is_completed);
    };

    const handleSaveUpdate = async () => {
        if (!validateInputs()) return;

        try {
            await axios.put(
                `http://localhost:8000/api/tasks/${editingTask}/`,
                {
                    title: updatedTitle,
                    description: updatedDescription,
                    is_completed: updatedIsCompleted,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const res = await axios.get('http://localhost:8000/api/tasks/', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTasks(res.data);

            setEditingTask(null);
            setUpdatedTitle('');
            setUpdatedDescription('');
            setUpdatedIsCompleted(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/tasks/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTasks(tasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    return (
        <div className="container mt-5 task-list-container">
            <TaskForm setTasks={setTasks} />
            <h3 className="task-list-heading">Your Tasks:</h3>
            <div className="task-list-table">
                <div className="task-list-header">
                    <div className="task-column">Title</div>
                    <div className="task-column">Description</div>
                    <div className="task-column">Status</div>
                    <div className="task-column">Actions</div>
                </div>
                {tasks.map((task, i) => (
                    <div key={i} className="task-row">
                        {editingTask === task.id ? (
                            <>
                                <div className="task-column">
                                    <input
                                        type="text"
                                        value={updatedTitle}
                                        onChange={(e) => setUpdatedTitle(e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.title && <p className="error-message">{errors.title}</p>}
                                </div>
                                <div className="task-column">
                                    <textarea
                                        value={updatedDescription}
                                        onChange={(e) => setUpdatedDescription(e.target.value)}
                                        className="form-control"
                                    ></textarea>
                                    {errors.description && <p className="error-message">{errors.description}</p>}
                                </div>
                                <div className="task-column">
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={updatedIsCompleted}
                                            onChange={(e) => setUpdatedIsCompleted(e.target.checked)}
                                        />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                                <div className="task-column">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={handleSaveUpdate}
                                    >
                                        <i className="fa fa-save"></i> Save
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setEditingTask(null)}
                                    >
                                        <i className="fa fa-times"></i> Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="task-column">{task.title}</div>
                                <div className="task-column">{task.description}</div>
                                <div className="task-column">
                                    {task.is_completed ? 'Completed' : 'Pending'}
                                </div>
                                <div className="task-column">
                                    <button
                                        className="btn btn-warning btn-sm"
                                        onClick={() => handleUpdateClick(task)}
                                    >
                                        <i className="fa fa-pencil"></i> Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(task.id)}
                                    >
                                        <i className="fa fa-trash"></i> Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <button
                className="btn btn-logout mt-3"
                onClick={() => {
                    sessionStorage.removeItem('accessToken');
                    sessionStorage.removeItem('refreshToken');
                    navigate('/');
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default TaskList;
