const { Sequelize, Model, DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const PackageDocument = sequelize.define("ref_package_document", {
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
      type: DataTypes.UUID,
      allowNull: false
    },
    document_status: {
      type: DataTypes.UUID,
      allowNull: false
    },
    package_id: {
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
   

  });
  return PackageDocument;
};