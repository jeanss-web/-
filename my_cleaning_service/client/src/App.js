// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Request from './components/Request';
import AdminPanel from './components/AdminPanel';
import './App.css'; // Подключаем файл стилей

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>Клиниговые Услуги</h1>
          <nav>
            <Link to="/login">Войти</Link>
            <Link to="/register">Зарегистрироваться</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/request" element={<Request />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
};

const HomePage = () => {
  return (
    <div className="home">
      <h2>Добро пожаловать на наш портал клининговых услуг!</h2>
      <p>
        Мы предлагаем широкий спектр услуг по уборке: от бытовой до коммерческой уборки. 
        Вы можете зарегистрироваться или войти в систему, чтобы получить доступ ко всем нашим услугам.
      </p>
      <Link to="/register" className="button">Зарегистрироваться</Link>
      <Link to="/login" className="button">Войти</Link>
    </div>
  );
};

export default App;
