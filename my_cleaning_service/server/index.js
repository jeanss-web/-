// server/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Sequelize, DataTypes } = require('sequelize');

// Настройка базы данных
const sequelize = new Sequelize('postgres://username:null@localhost:5432/my_cleaning_service');

// Определение модели пользователя
const User = sequelize.define('User', {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Начало приложения
const app = express();
app.use(cors());
app.use(bodyParser.json());

// server/index.js
const { body, validationResult } = require('express-validator');

// Вариант регистрации с валидацией
app.post('/register',
  body('fullName').isString().isLength({ min: 2 }).withMessage('ФИО должно содержать не менее 2 символов'),
  body('phone').isMobilePhone('any', { strict: false }).withMessage('Некорректный номер телефона'),
  body('email').isEmail().withMessage('Некорректный адрес электронной почты'),
  body('username').isAlphanumeric().isLength({ min: 3 }).withMessage('Логин должен содержать как минимум 3 символа'),
  body('password').isLength({ min: 6 }).withMessage('Пароль должен содержать как минимум 6 символов'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { fullName, phone, email, username, password } = req.body;
    // Оставшаяся логика...
  }
);

app.post('/register', async (req, res) => {
  const { fullName, phone, email, username, password } = req.body;

  

  const hashedPassword = bcrypt.hashSync(password, 8);
  try {
    const newUser = await User.create({
      fullName,
      phone,
      email,
      username,
      password: hashedPassword,
    });
    res.status(201).send({ message: 'Пользователь успешно зарегистрирован!' });
  } catch (error) {
    res.status(500).send({ message: 'Ошибка при регистрации', error });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(404).send({ message: 'Пользователь не найден.' });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);
  if (!passwordIsValid) {
    return res.status(401).send({ accessToken: null, message: 'Неверный пароль!' });
  }

  const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: 86400 });
  res.status(200).send({ id: user.id, username: user.username, accessToken: token });
});

// Запускаем приложение
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

// Определение модели заявки
const Request = sequelize.define('Request', {
    customerId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    serviceType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'new', // статусы могут быть: new, in progress, completed, cancelled
    },
  });
// Создание заявки
app.post('/api/requests', async (req, res) => {
    const { serviceType, customerAddress, contactNumber, date, paymentMethod } = req.body;
  
    try {
      const newRequest = await Request.create({
        customerId: req.userId, // предполагается, что ID пользователя был установлен при авторизации
        serviceType,
        customerAddress,
        contactNumber,
        date,
        paymentMethod,
      });
      res.status(201).json(newRequest);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка создания заявки', error });
    }
  });
  
  // Получение всех заявок текущего пользователя
  app.get('/api/requests', async (req, res) => {
    try {
      const requests = await Request.findAll({ where: { customerId: req.userId } });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении заявок', error });
    }
  });
  const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(403).send({ message: 'Требуется токен!' });
    }
  
    jwt.verify(token, 'your_secret_key', (err, decoded) => {
      if (err) {
        return res.status(401).send({ message: 'Ошибка токена!' });
      }
      req.userId = decoded.id; // Сохраните ID пользователя в запросе
      next();
    });
  };
  
  // Применение middleware к защищенным маршрутам
  app.use(['/api/requests'], verifyToken);
// Получение всех заявок
app.get('/api/admin/requests', async (req, res) => {
    try {
      const requests = await Request.findAll();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при получении заявок', error });
    }
  });
  
  // Изменение статуса заявки
  app.put('/api/requests/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      const request = await Request.findByPk(id);
      if (!request) {
        return res.status(404).json({ message: 'Заявка не найдена' });
      }
  
      request.status = status;
      await request.save();
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: 'Ошибка при изменении статуса', error });
    }
  });
        
