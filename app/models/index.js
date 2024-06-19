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
    db.PackageStep1 = require("./PackagesStep1.model")(sequelize, Sequelize);
    db.PackageStep2 = require("./PackageStep2.model")(sequelize, Sequelize);
    db.PackageStep3 = require("./PackageStep3.model")(sequelize, Sequelize);
    db.PackageStep4 = require("./PackageStep4.model")(sequelize, Sequelize);
    db.PackageStep4Command = require("./PackageStep4Comannd.model")(sequelize, Sequelize);
    db.PackageStep5 = require("./PackageStep5.mode")(sequelize, Sequelize);
    db.PackageStep6 = require("./PackageStep6.model")(sequelize, Sequelize);
    db.PackageStep7 = require("./PackageStep7.model")(sequelize, Sequelize);
    db.PackageStep8 = require("./PackageStep8.model")(sequelize, Sequelize);
    db.PackageStep9 = require("./PackageStep9.model")(sequelize, Sequelize);
    db.PackageStep10 = require("./PackageStep10.model")(sequelize, Sequelize);
    db.PackageStep11 = require("./PackageStepp11.model")(sequelize, Sequelize);
    db.PackageStep12 = require("./PackageStep12.model")(sequelize, Sequelize);
    db.PackageStep13 = require("./PackageStep13.model")(sequelize, Sequelize);
    db.PackageStep14 = require("./PackageStep14.model")(sequelize, Sequelize);
    db.PackageStep15 = require("./PackageStep15.model")(sequelize,Sequelize);
    db.PackageStep16 = require("./PackageStep16.model")(sequelize,Sequelize);
    db.PackageStep17 = require("./PackageStep17.model")(sequelize,Sequelize);
    db.PackageStep18 = require("./PackageStep18.model")(sequelize, Sequelize);
    db.PackageStep19 = require("./PackageStep19.model")(sequelize, Sequelize);
    db.PackageStep20 = require("./PackageStep20.model")(sequelize, Sequelize);
    db.PackageStep21 = require("./PackageStep21.model")(sequelize, Sequelize);
    db.PackageStep22 = require("./PackageStep22.model")(sequelize, Sequelize);
    db.PackageStep23 = require("./PackageStep23.model")(sequelize, Sequelize);
    db.PackageStep24 = require("./PackageStep24.model")(sequelize, Sequelize);
    db.PackageStep25 = require("./PackageStep25.model")(sequelize, Sequelize);
    db.PackageStep26 = require("./PackageStep26.mode")(sequelize, Sequelize);
    db.PackageStep27 = require("./PackageStep27.model")(sequelize, Sequelize);
    db.PackageStep28 = require("./PackageStep28.model")(sequelize, Sequelize);
    db.PackageStep29 = require("./PackageStep29.model")(sequelize, Sequelize);
    db.PackageStep30 = require("./PackageStep30.model")(sequelize, Sequelize);
    db.PackageStep31 = require("./PackageStep31.model")(sequelize, Sequelize);
    db.PackageStep32 = require("./PackageStep32.model")(sequelize, Sequelize);
    db.PackageStep33 = require("./PackageStep33.model")(sequelize, Sequelize);
    db.PackageStep34 = require("./PackageStep34.model")(sequelize, Sequelize);

    module.exports = db