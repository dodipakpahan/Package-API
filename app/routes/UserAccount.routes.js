module.exports = app => {
    const UserAccount = require("../controllers/UseAccount.controllers");
    let router = require("express").Router();
        router.post("/insertUpdate", UserAccount.insertUpdate);
        router.post("/login", UserAccount.login);
        router.get("/checkToken", UserAccount.checkToken)
    app.use("/api/UserAccount", router);
};