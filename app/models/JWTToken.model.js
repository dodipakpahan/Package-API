const { Sequelize, Model, DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
    const JWTToken = sequelize.define("syst_jwt_token", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_account_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        jwt_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        created_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        updated_date: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.NOW,
            allowNull: false
        },
        expires_on: {
            type: DataTypes.DATE,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    });
    return JWTToken;
};