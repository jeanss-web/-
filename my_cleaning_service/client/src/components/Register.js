// src/components/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Отменяем стандартное поведение формы

    try {
      await axios.post('http://localhost:5000/register', {
        fullName,
        phone,
        email,
        username,
        password,
      });
      alert('Регистрация прошла успешно!');
      navigate('/login'); // Переход на страницу логина
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert('Ошибка при регистрации. Попробуйте еще раз');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Регистрация</h2>
      <input type="text" placeholder="ФИО" onChange={(e) => setFullName(e.target.value)} required />
      <input type="text" placeholder="Телефон" onChange={(e) => setPhone(e.target.value)} required />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
      <input type="text" placeholder="Логин" onChange={(e) => setUsername(e.target.value)} required />
      <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Зарегистрироваться</button>
    </form>
  );
};

export default Register;
