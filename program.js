const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes.js');
const dashRoutes = require('./routes/dash.routes.js');
const cookieParser = require('cookie-parser'); 
const authMiddleware = require('./middlewares/auth.middleware.js');


const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/DashBoard',authMiddleware.protect,dashRoutes);

module.exports = app