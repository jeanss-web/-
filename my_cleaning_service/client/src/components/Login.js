// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Используйте useNavigate

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Инициализируйте useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });
      localStorage.setItem('token', response.data.accessToken); // Сохраните токен
      alert('Вы успешно вошли в систему!');
      navigate('/request'); // Настройка перехода
    } catch (error) {
      console.error('Ошибка при входе', error);
      alert('Неверный логин или пароль');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="text" placeholder="Логин" onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Войти</button>

      </form>
  );
};

export default Login;
