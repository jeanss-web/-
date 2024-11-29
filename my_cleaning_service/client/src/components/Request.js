// src/components/Request.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Request = () => {
  const [requests, setRequests] = useState([]);
  const [serviceType, setServiceType] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [date, setDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/requests', {
        serviceType,
        customerAddress,
        contactNumber,
        date,
        paymentMethod,
      }, {
        headers: {
          'x-access-token': token,
        }
      });
      alert('Заявка успешно создана');
      fetchRequests(); // Обновление списка заявок после создания
    } catch (error) {
      console.error('Ошибка при создании заявки', error);
      alert('Ошибка при создании заявки');
    }
  };

  const fetchRequests = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/api/requests', {
      headers: {
        'x-access-token': token,
      },
    });
    setRequests(response.data);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div>
      <h2>Создать заявку</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Адрес" onChange={(e) => setCustomerAddress(e.target.value)} required />
        <input type="text" placeholder="Контактный номер" onChange={(e) => setContactNumber(e.target.value)} required />

        <input type="date" placeholder="Дата" onChange={(e) => setDate(e.target.value)} required />
        <select onChange={(e) => setServiceType(e.target.value)} required>
          <option value="">Выберите услугу</option>
          <option value="Общий клининг">Общий клининг</option>
          <option value="Генеральная уборка">Генеральная уборка</option>
          <option value="Послестроительная уборка">Послестроительная уборка</option>
          <option value="Химчистка ковров">Химчистка ковров</option>
        </select>
        <select onChange={(e) => setPaymentMethod(e.target.value)} required>
          <option value="cash">Наличные</option>
          <option value="card">Банковская карта</option>
        </select>
        <button type="submit">Отправить заявку</button>
      </form>

      <h2>Мои заявки</h2>
      <ul>
        {requests.map(req => (
          <li key={req.id}>{req.serviceType} - {req.customerAddress} - {req.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Request;
