// src/components/AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await axios.get('http://localhost:5000/api/requests'); // Реализуйте этот метод в бэкенде
      setRequests(response.data);
    }
    fetchRequests();
  }, []);

  const handleStatusChange = async (requestId, newStatus) => {
    await axios.put(`http://localhost:5000/api/requests/${requestId}`, { status: newStatus });
    // Обновите локальный список запросов
  };

  return (
    <div>
      <h2>Панель администратора</h2>
      <ul>
        {requests.map(request => (
          <li key={request.id}>
            <p>{request.customerName} - {request.status}</p>
            <button onClick={() => handleStatusChange(request.id, 'completed')}>Выполнено</button>
            <button onClick={() => handleStatusChange(request.id, 'cancelled')}>Отменить</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
