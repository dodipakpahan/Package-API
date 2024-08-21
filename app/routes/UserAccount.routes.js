module.exports = app => {
    const UserAccount = require("../controllers/UseAccount.controllers");
    let router = require("express").Router();
    router.post("/insertUpdate", UserAccount.insertUpdate);
    router.post("/login", UserAccount.login);
    router.get("/checkToken", UserAccount.checkToken);
    router.post("/delete", UserAccount.delete);
    router.get("/findAll", UserAccount.findAll);
    router.get("/findById", UserAccount.findById);
    router.get("/getCount", UserAccount.getCount);
    router.post("/updatePassword", UserAccount.updatePassword);

    router.post("/deleteAccountType", UserAccount.deleteAccountType);
    router.get("/findAllAccountType", UserAccount.findAllAccountType);
    router.get("/findByIdAccountType", UserAccount.findByIdAccountType);
    router.get("/getCountAccountType", UserAccount.getCountAccountType);
    router.post("/insertUpdateAccountType", UserAccount.insertUpdateAccountType);
    app.use("/api/UserAccount", router);
};