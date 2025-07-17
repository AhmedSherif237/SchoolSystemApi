const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); 

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_DIALECT = process.env.DB_DIALECT;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
    console.error('CRITICAL ERROR: Database environment variables are not fully set.');
    console.error('Please ensure DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, and DB_DIALECT are set in your .env file.');
    process.exit(1);
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT,
    logging: false, 
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


module.exports = {
    sequelize,
};