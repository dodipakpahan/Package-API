module.exports = {
    HOST: "127.0.0.1",
    USER: "postgres",
    PASSWORD: "root",
    DB: "package_db",
    SCHEMA: "package",
    PORT: 5432,
    dialect: "postgres",
    pool: {
      max: 20,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };