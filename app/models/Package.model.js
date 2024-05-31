const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Package = sequelize.define("ref_package", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
       allowNull: false
    },
    package_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    upload_document: {
      type: DataTypes.TEXT,
      allowNull: true
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
    package_status:{
        type:DataTypes.UUID,
        allowNull: true
    },
    package_step:{
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue:0
    },
    selection_methode:{
      type: DataTypes.TEXT,
      allowNull:true
    }
   

  });
  return Package;
};