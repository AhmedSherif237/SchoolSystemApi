const app = require('./program.js');
const { sequelize, User, Grade, Student, AttendanceRecord, LateArrival } = require('./models/index.js');
const port = 5000;

// database connection test
sequelize.authenticate() 
    .then(() => {
        console.log('Database connection has been established successfully.');
        // refreshing the database schema
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database schema synced successfully!');

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
            console.log(`App URL: http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Error during database connection or sync:', err.message);
        process.exit(1);
    });




