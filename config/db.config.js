const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('CRITICAL ERROR: DATABASE_URL is not set in .env file.');
    process.exit(1);
}

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres', // علشان Railway بيستخدم PostgreSQL
    protocol: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false, // مهم علشان متعملش مشاكل SSL
        },
    },
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

module.exports = {
    sequelize,
};
