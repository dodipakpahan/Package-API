const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Notification = sequelize.define("ref_notification", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
       allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    package_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    package_step_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.NOW,
      allowNull: false
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    document_id:{
      type: DataTypes.UUID,
      allowNull:true
    },
    path:{
      type:DataTypes.TEXT
    }
    

  });
  return Notification;
};