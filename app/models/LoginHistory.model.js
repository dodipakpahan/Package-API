const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const LoginHistory = sequelize.define("sys_login_history", {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            autoIncrement: true,
            allowNull: false
        },
        user_account_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        login_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        ip_address: {
            type: DataTypes.TEXT,
            allowNull: false
        }

    });
    return LoginHistory;
};