const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('erp', 'root', 'qwert12345', {
    host: '127.0.0.1',
    dialect: 'mysql'
});

module.exports = sequelize;

