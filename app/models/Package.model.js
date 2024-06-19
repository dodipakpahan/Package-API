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
      allowNull: true
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true
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
      allowNull: true
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
    },
    pagu:{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    hps:{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    kontrak:{
      type: DataTypes.BIGINT,
      allowNull: true
    },
    ppk_name:{
      type: DataTypes.TEXT,
      allowNull: true
    },
    provider_name:{
      type: DataTypes.UUID,
      allowNull: true
    },
    planing_consultant:{
      type: DataTypes.TEXT,
      allowNull:true
    },
    supervising_consultant:{
      type: DataTypes.TEXT,
      allowNull:true
    },
    contract_number:{
      type: DataTypes.TEXT,
      allowNull:true
    },
    document_status:{
      type: DataTypes.TEXT,
      allowNull:true
    },
    command:{
      type: DataTypes.TEXT,
      allowNull:true
    }
   

  });
  return Package;
};