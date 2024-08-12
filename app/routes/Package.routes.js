module.exports = app => {
    const Package = require("../controllers/Package.controller");
    let router = require("express").Router();

    router.post("/insertUpdate", Package.insertUpdate);
    router.post("/delete", Package.delete);
    router.get("/findById", Package.findById);
    router.get("/findDetailPackage", Package.findDetailPackage);
    router.get("/findAll", Package.findAll);
    router.get("/getCount", Package.getCount);
    router.get("/findAllPackageStatus", Package.findAllPackageStatus);
    router.get("/findAllPackageProcessStatus", Package.findAllPackageProcessStatus);
    router.post("/insertUpdatePackageDocument", Package.insertUpdatePackageDocument);
    router.post("/deletePackageDocument", Package.deletePackageDocument);
    router.get("/getPackageDocument", Package.getPackageDocument);
    router.get("/getPackageDocumentById", Package.getPackageDocumentById);
    router.get("/getCountPackageDocument", Package.getCountPackageDocument)
    router.get("/getNotification", Package.getNotification);
    router.post("/readNotification", Package.readNotification);
    router.post("/updatePackageDocumentStatus", Package.updatePackageDocumentStatus);
    router.get("/getPackageCommand", Package.getPackageCommand);
    router.get("/getPackageStep", Package.getPackageStep);
    router.get("/getPackageStepById", Package.getPackageStepById);

    router.post("/insertUpdateDocumentStep1", Package.insertUpdateDocumentStep1);
    router.get("/getPackageStep1ById", Package.getPackageStep1ById);
    router.get("/getPackageStep1", Package.getPackageStep1);
    router.post("/updateStep1DocumentStatus", Package.updateStep1DocumentStatus);


    router.post("/insertUpdateDocumentStep2", Package.insertUpdateDocumentStep2);
    router.get("/getPackageStep2ById", Package.getPackageStep2ById);
    router.get("/getPackageStep2", Package.getPackageStep2);
    router.post("/updateStep2DocumentStatus", Package.updateStep2DocumentStatus)

    router.post("/insertUpdateDocumentStep3", Package.insertUpdateDocumentStep3);
    router.get("/getPackageStep3ById", Package.getPackageStep3ById);
    router.get("/getPackageStep3", Package.getPackageStep3);
    router.post("/updateStep3DocumentStatus", Package.updateStep3DocumentStatus)


    router.post("/insertUpdateDocumentStep4", Package.insertUpdateDocumentStep4);
    router.get("/getPackageStep4ById", Package.getPackageStep4ById);
    router.get("/getPackageStep4", Package.getPackageStep4);
    router.post("/insertUpdatePackageStep4Command", Package.insertUpdatePackageStep4Command);
    router.get("/getPackageStep4Command", Package.getPackageStep4Command);
    router.post("/updateDocumentStep4", Package.updateDocumentStep4);

    router.post("/insertUpdateDocumentStep5", Package.insertUpdateDocumentStep5);
    router.get("/getPackageStep5ById", Package.getPackageStep5ById);
    router.get("/getPackageStep5", Package.getPackageStep5);
    router.post("/updateDocumentStep5", Package.updateDocumentStep5);

    router.post("/insertUpdateDocumentStep6", Package.insertUpdateDocumentStep6);
    router.get("/getPackageStep6ById", Package.getPackageStep6ById);
    router.get("/getPackageStep6", Package.getPackageStep6);
    router.post("/updateDocumentStep6", Package.updateDocumentStep6)

    
    router.post("/insertUpdateDocumentStep7", Package.insertUpdateDocumentStep7);
    router.get("/getPackageStep7ById", Package.getPackageStep7ById);
    router.get("/getPackageStep7", Package.getPackageStep7);

    router.post("/insertUpdateDocumentStep8", Package.insertUpdateDocumentStep8);
    router.get("/getPackageStep8ById", Package.getPackageStep8ById);
    router.get("/getPackageStep8", Package.getPackageStep8);
    router.post("/updateDocumentStep8", Package.updateDocumentStep8);

    
    router.post("/insertUpdateDocumentStep9", Package.insertUpdateDocumentStep9);
    router.get("/getPackageStep9ById", Package.getPackageStep9ById);
    router.get("/getPackageStep9", Package.getPackageStep9);
    router.post("/updateDocumentStep9", Package.updateDocumentStep9)

    
    router.post("/insertUpdateDocumentStep10", Package.insertUpdateDocumentStep10);
    router.get("/getPackageStep10ById", Package.getPackageStep10ById);
    router.get("/getPackageStep10", Package.getPackageStep10);
    router.post("/updateDocumentStep10", Package.updateDocumentStep10);

    
    router.post("/insertUpdateDocumentStep11", Package.insertUpdateDocumentStep11);
    router.get("/getPackageStep11ById", Package.getPackageStep11ById);
    router.get("/getPackageStep11", Package.getPackageStep11);
    router.post("/updateDocumentStep11", Package.updateDocumentStep11)

    router.post("/insertUpdateDocumentStep12", Package.insertUpdateDocumentStep12);
    router.get("/getPackageStep12ById", Package.getPackageStep12ById);
    router.get("/getPackageStep12", Package.getPackageStep12);
    router.post("/updateDOcumentStep12", Package.updateDOcumentStep12);
    router.post("/deleteDocumentStep12", Package.deleteDocumentStep12);

    
    router.post("/insertUpdateDocumentStep13", Package.insertUpdateDocumentStep13);
    router.get("/getPackageStep13ById", Package.getPackageStep13ById);
    router.get("/getPackageStep13", Package.getPackageStep13);
    router.post("/updateDocumentStep13", Package.updateDocumentStep13);

    
    router.post("/insertUpdateDocumentStep14", Package.insertUpdateDocumentStep14);
    router.get("/getPackageStep14ById", Package.getPackageStep14ById);
    router.get("/getPackageStep14", Package.getPackageStep14);

    router.post("/insertUpdateDocumentStep15", Package.insertUpdateDocumentStep15);
    router.get("/getPackageStep15ById", Package.getPackageStep15ById);
    router.get("/getPackageStep15", Package.getPackageStep15);
    router.post("/updateDocumentStep15", Package.updateDocumentStep15);

    
    router.post("/insertUpdateDocumentStep16", Package.insertUpdateDocumentStep16);
    router.get("/getPackageStep16ById", Package.getPackageStep16ById);
    router.get("/getPackageStep16", Package.getPackageStep16);


    router.post("/insertUpdateDocumentStep17", Package.insertUpdateDocumentStep17);
    router.get("/getPackageStep17ById", Package.getPackageStep17ById);
    router.get("/getPackageStep17", Package.getPackageStep17);

    
    router.post("/insertUpdateDocumentStep18", Package.insertUpdateDocumentStep18);
    router.get("/getPackageStep18ById", Package.getPackageStep18ById);
    router.get("/getPackageStep18", Package.getPackageStep18);
    

    router.post("/insertUpdateDocumentStep19", Package.insertUpdateDocumentStep19);
    router.get("/getPackageStep19ById", Package.getPackageStep19ById);
    router.get("/getPackageStep19", Package.getPackageStep19);
    router.post("/updateDocumentStep19", Package.updateDocumentStep19);

    router.post("/insertUpdateDocumentStep20", Package.insertUpdateDocumentStep20);
    router.get("/getPackageStep20ById", Package.getPackageStep20ById);
    router.get("/getPackageStep20", Package.getPackageStep20);

    
    router.post("/insertUpdateDocumentStep21", Package.insertUpdateDocumentStep21);
    router.get("/getPackageStep21ById", Package.getPackageStep21ById);
    router.get("/getPackageStep21", Package.getPackageStep21);
    router.post("/updateDocumentStep21", Package.updateDocumentStep21)
    
    

    router.post("/insertUpdateDocumentStep22", Package.insertUpdateDocumentStep22);
    router.get("/getPackageStep22ById", Package.getPackageStep22ById);
    router.get("/getPackageStep22", Package.getPackageStep22);
    router.post("/updateDocumentStep22", Package.updateDocumentStep22);

    router.post("/insertUpdateDocumentStep23", Package.insertUpdateDocumentStep23);
    router.get("/getPackageStep23ById", Package.getPackageStep23ById);
    router.get("/getPackageStep23", Package.getPackageStep23);
    router.post("/updateDocumentStep23", Package.updateDocumentStep23)

    router.post("/insertUpdateDocumentStep24", Package.insertUpdateDocumentStep24);
    router.get("/getPackageStep24ById", Package.getPackageStep24ById);
    router.get("/getPackageStep24", Package.getPackageStep24);
    router.post("/updateStep24DocumentStatus", Package.updateStep24DocumentStatus)

    router.post("/insertUpdateDocumentStep25", Package.insertUpdateDocumentStep25);
    router.get("/getPackageStep25ById", Package.getPackageStep25ById);
    router.get("/getPackageStep25", Package.getPackageStep25);
    router.post("/updateDocumentStep25", Package.updateDocumentStep25);

    router.post("/insertUpdateDocumentStep26", Package.insertUpdateDocumentStep26);
    router.get("/getPackageStep26ById", Package.getPackageStep26ById);
    router.get("/getPackageStep26", Package.getPackageStep26);

    router.post("/insertUpdateDocumentStep27", Package.insertUpdateDocumentStep27);
    router.get("/getPackageStep27ById", Package.getPackageStep27ById);
    router.get("/getPackageStep27", Package.getPackageStep27);

    router.post("/insertUpdateDocumentStep28", Package.insertUpdateDocumentStep28);
    router.get("/getPackageStep28ById", Package.getPackageStep28ById);
    router.get("/getPackageStep28", Package.getPackageStep28);

    
    
    router.post("/insertUpdateDocumentStep29", Package.insertUpdateDocumentStep29);
    router.get("/getPackageStep29ById", Package.getPackageStep29ById);
    router.get("/getPackageStep29", Package.getPackageStep29);
    router.post("/updateDocumentStep29", Package.updateDocumentStep29);

    router.post("/insertUpdateDocumentStep30", Package.insertUpdateDocumentStep30);
    router.get("/getPackageStep30ById", Package.getPackageStep30ById);
    router.get("/getPackageStep30", Package.getPackageStep30);

    router.post("/insertUpdateDocumentStep31", Package.insertUpdateDocumentStep31);
    router.get("/getPackageStep31ById", Package.getPackageStep31ById);
    router.get("/getPackageStep31", Package.getPackageStep31);

    router.post("/insertUpdateDocumentStep32", Package.insertUpdateDocumentStep32);
    router.get("/getPackageStep32ById", Package.getPackageStep32ById);
    router.get("/getPackageStep32", Package.getPackageStep32);

    router.post("/insertUpdateDocumentStep33", Package.insertUpdateDocumentStep33);
    router.get("/getPackageStep33ById", Package.getPackageStep33ById);
    router.get("/getPackageStep33", Package.getPackageStep33);

    router.post("/insertUpdateDocumentStep34", Package.insertUpdateDocumentStep34);
    router.get("/getPackageStep34ById", Package.getPackageStep34ById);
    router.get("/getPackageStep34", Package.getPackageStep34);


    router.get("/getCountTotalPackage", Package.getCountTotalPackage);
    router.get("/getCountTotalPackageComplete", Package.getCountTotalPackageComplete);
    router.get("/getCountTotalPackageInProgress", Package.getCountTotalPackageInProgress);


    router.post("/deleteDocumentStep", Package.deleteDocumentStep);


    app.use("/api/Package", router);
};