import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/auth/login';
import Register from './components/auth/register';
import TaskList from './components/taskManager/taskList';
import { AuthProvider } from './context/AuthContext';

const App = () => (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/tasks" element={<TaskList />} />
            </Routes>
        </Router>
    </AuthProvider>
);

export default App;
