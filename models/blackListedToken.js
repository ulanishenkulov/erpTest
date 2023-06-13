const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const BlacklistedToken = sequelize.define('BlacklistedToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = BlacklistedToken;