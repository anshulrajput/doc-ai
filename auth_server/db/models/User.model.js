const sequelize = require('../connection');
const Sequelize = require('sequelize');

var User = sequelize.define('server_user',
    {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            allowNull: false,
            unique: true,
            primaryKey: true
        },
        email: { type: Sequelize.STRING, allowNull: false },
        name: { type: Sequelize.STRING, allowNull: false },
        firebaseUID: { type: Sequelize.STRING, allowNull: true }
    },
    {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: false,
        timestamps: false
    }
);

module.exports = User