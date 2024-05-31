module.exports = app => {
    const Package = require("../controllers/Package.controller");
    let router = require("express").Router();

    router.post("/insertUpdate", Package.insertUpdate);
    router.post("/delete", Package.delete);
    router.get("/findById", Package.findById);
    router.get("/findAll", Package.findAll);
    router.get("/getCount", Package.getCount);
    router.get("/findAllPackageStatus", Package.findAllPackageStatus);
    router.get("/findAllPackageProcessStatus", Package.findAllPackageProcessStatus);
    router.post("/insertUpdatePackageDocument", Package.insertUpdatePackageDocument);
    router.post("/deletePackageDocument",Package.deletePackageDocument);
    router.get("/getPackageDocument", Package.getPackageDocument);
    router.get("/getPackageDocumentById", Package.getPackageDocumentById);
    router.get("/getCountPackageDocument", Package.getCountPackageDocument)
    router.get("/getNotification", Package.getNotification);
    router.post("/readNotification", Package.readNotification);
    router.post("/updatePackageDocumentStatus", Package.updatePackageDocumentStatus);
    router.get("/getPackageCommand", Package.getPackageCommand);
    router.get("/getPackageStep", Package.getPackageStep)

    app.use("/api/Package", router);
};