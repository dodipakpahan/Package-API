const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    schema: dbConfig.SCHEMA,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    define: {
        timestamps: false,
        freezeTableName: true
    },
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

sequelize.authenticate()
    .then(() => {
        console.log("DB Connection OK!");
    })
    .catch((exception) => {
        console.log(exception);
    });

    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    
    db.UserAccount = require("./UserAccount.model")(sequelize, Sequelize);
    db.JWTToken = require("./JWTToken.model")(sequelize, Sequelize);
    db.LoginHistory = require("./LoginHistory.model")(sequelize, Sequelize);
    db.Package = require("./Package.model")(sequelize, Sequelize);
    db.Notification = require("./Notification.model")(sequelize,Sequelize);
    db.PackageDocument = require("./PackageDocument.model")(sequelize, Sequelize);
    db.PackageStep = require("./PackageStep.model")(sequelize,Sequelize);

    module.exports = db