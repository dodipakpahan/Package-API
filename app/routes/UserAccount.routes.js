module.exports = app => {
    const UserAccount = require("../controllers/UseAccount.controllers");
    let router = require("express").Router();
        router.post("/insertUpdate", UserAccount.insertUpdate);
        router.post("/login", UserAccount.login);
        router.get("/checkToken", UserAccount.checkToken);
        router.post("/delete", UserAccount.delete);
        router.get("/findAll", UserAccount.findAll);
        router.get("/findById",UserAccount.findById);
        router.get("/getCount",UserAccount.getCount);
        router.post("/updatePassword", UserAccount.updatePassword);
    app.use("/api/UserAccount", router);
};