const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const PackageStep4Command = sequelize.define("trx_package_step_4_command", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        command_penyedia: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        package_step_id: {
            type: DataTypes.UUID,
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
        created_by: {
            type: DataTypes.UUID,
            allowNull: true
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
       

    });
    return PackageStep4Command;
};