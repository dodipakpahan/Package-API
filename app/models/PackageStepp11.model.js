const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const PackageStep11 = sequelize.define("trx_package_step_11", {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        url_base64: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        document_name: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        description: {
            type: DataTypes.UUID,
            allowNull: false
        },
        package_step_id: {
            type: DataTypes.UUID,
            allowNull: true,
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
        package_step_id:{
            type: DataTypes.UUID,
            allowNull:true
        },
        document_status: {
            type: DataTypes.UUID,
            allowNull:true
        }

    });
    return PackageStep11;
};