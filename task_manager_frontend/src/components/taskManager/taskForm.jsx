import React, { useState } from 'react';
import axios from 'axios';
import './taskForm.css';

const TaskForm = ({ setTasks }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        
        // Front-end validation
        if (!title || !description) {
            setError('Both title and description are required.');
            return;
        }
        setError('');

        const accessToken = sessionStorage.getItem('accessToken');
        
        try {
            // Make the POST request to add a new task with Authorization header
            const res = await axios.post(
                'http://localhost:8000/api/tasks/',
                { 
                    title: title,
                    description: description,
                    is_completed: isCompleted
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            
            // Update the tasks state with the new task
            setTasks((prev) => [...prev, res.data]);
            
            // Reset the title input field
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Error adding task:', error);
            if (error.response && error.response.status === 401) {
                alert('Unauthorized. Please log in again.');
            }
        }
    };
    
    return (
        <form onSubmit={handleAdd} className="mb-3">
            <div className="input-group">

                <h3 className="task-list-heading">Add Task:</h3>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <input
                    type="text"
                    className="form-control"
                    placeholder="Add task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Add task description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <label htmlFor="is_completed">Is Completed:</label>
                <input
                    type="checkbox"
                    className="form-control toggle-switch"
                    value={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    id="toggleSwitch"
                />
                <label htmlFor="toggleSwitch" className="toggle-label"></label>

                <button type="submit" className="btn btn-primary">
                    Add
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
