const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PackageStep = sequelize.define("trx_package_step", {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
       allowNull: false
    },
    step_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    step_status_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    package_id: {
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
  return PackageStep;
};