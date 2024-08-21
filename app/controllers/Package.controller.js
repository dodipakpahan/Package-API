const jwt = require("jsonwebtoken");
const db = require("../models");
const Package = db.Package;
const Notificatiion = db.Notification;
const PackageStep1 = db.PackageStep1;
const PackageStep2 = db.PackageStep2;
const PackageStep3 = db.PackageStep3;
const PackageStep4 = db.PackageStep4;
const PackageStep5 = db.PackageStep5;
const PackageStep6 = db.PackageStep6;
const PackageStep7 = db.PackageStep7;
const PackageStep8 = db.PackageStep8;
const PackageStep9 = db.PackageStep9;
const PackageStep10 = db.PackageStep10;
const PackageStep11 = db.PackageStep11;
const PackageStep12 = db.PackageStep12;
const PackageStep13 = db.PackageStep13;
const PackageStep14 = db.PackageStep14;
const PackageStep15 = db.PackageStep15;
const PackageStep16 = db.PackageStep16;
const PackageStep17 = db.PackageStep17;
const PackageStep18 = db.PackageStep18;
const PackageStep19 = db.PackageStep19;
const PackageStep20 = db.PackageStep20;
const PackageStep21 = db.PackageStep21;
const PackageStep22 = db.PackageStep22;
const PackageStep23 = db.PackageStep23;
const PackageStep24 = db.PackageStep24;
const PackageStep25 = db.PackageStep25;
const PackageStep26 = db.PackageStep26;
const PackageStep27 = db.PackageStep27;
const PackageStep28 = db.PackageStep28;
const PackageStep29 = db.PackageStep29;
const PackageStep30 = db.PackageStep30;
const PackageStep31 = db.PackageStep31;
const PackageStep32 = db.PackageStep32;
const PackageStep33 = db.PackageStep33;
const PackageStep34 = db.PackageStep34;

const PackageStep4Command = db.PackageStep4Command;
const PackageDocument = db.PackageDocument;
const PackageStep = db.PackageStep;
const fs = require("fs");
const Op = db.Sequelize.Op;
const helper = require("../helper/ApplicationHelper");

const winston = require('winston');
const logConfiguration = {
    'transports': [
        //Debug
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./log/system.log"
        })
    ]
};

const logger = winston.createLogger(logConfiguration);

exports.insertUpdate = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await Package.create({
                    package_name: requests.package_name,
                    start_date: requests.start_date,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_status: requests.package_status,
                    end_date: requests.end_date,
                    selection_methode: requests.selection_methode,
                    pagu: requests.pagu,
                    hps: requests.hps,
                    kontrak: requests.kontrak,
                    ppk_name: requests.ppk_name,
                    provider_name: requests.provider_name,
                    planing_consultant: requests.planing_consultant,
                    supervising_consultant: requests.supervising_consultant,
                    contract_number: requests.contract_number,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    upload_document: requests.upload_document
                },
                    {
                        fields: ["package_name", "start_date", "created_date", "created_by", "package_status",
                            "end_date", "selection_methode", "pagu", "hps", "kontrak", "ppk_name", "provider_name",
                            "planing_consultant", "supervising_consultant", "contract_number", "document_status",
                            "upload_document"
                        ]
                    });

                let listStepMaster = await db.sequelize.query(
                    `Select * FROM package.ref_list_step_master order by order_number asc`,
                    { type: db.sequelize.QueryTypes.SELECT });

                for (let index = 0; index < listStepMaster.length; index++) {
                    const newList = listStepMaster[index];
                    await PackageStep.create({
                        step_id: newList.id,
                        step_status_id: "823d83cc-715f-44bc-887b-084037e7bd5d",
                        package_id: data.dataValues.id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,

                    },
                        {
                            fields: ["step_id", "step_status_id", "package_id",
                                "created_date", "created_by",
                            ]
                        });
                }

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });


                await Notificatiion.create({
                    user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                    package_id: data.dataValues.id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Dokumen Hasil Pemilihan Telah Diupload"
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by",
                        ]
                    });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await Package.update({
                    package_name: requests.package_name,
                    start_date: requests.start_date,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_status: requests.package_status,
                    end_date: requests.end_date,
                    selection_methode: requests.selection_methode,
                    pagu: requests.pagu,
                    hps: requests.hps,
                    kontrak: requests.kontrak,
                    ppk_name: requests.ppk_name,
                    provider_name: requests.provider_name,
                    planing_consultant: requests.planing_consultant,
                    supervising_consultant: requests.supervising_consultant,
                    contract_number: requests.contract_number,
                    upload_document: requests.upload_document === "" ? db.sequelize.literal(`upload_document`) : requests.upload_document,
                    command: requests.command

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.findAll = async (req, res) => {
    try {
        const offset = req.query.offset;
        const limit = req.query.limit;
        const orderBy = req.query.order_by;
        const userRole = req.query.user_role
        const sortDescending = req.query.descending;
        const accountType = req.query.account_type;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageName = req.query.package_name;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `Where   `;

        if (userRole === "4") {
            whereCondition += ` package.provider_name = '${authResult.token_data.user_account_id}' AND `
        } else {
            whereCondition += ` account.account_type = '${accountType}' AND `
        }
        if (detailedSearch) {
            if (packageName !== undefined)
                whereConditionArray.push(` LOWER(package.packge_name) LIKE LOWER('%${packageName}%')`);
            if (whereConditionArray.length === 0)
                whereCondition += ` package.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND package.is_active = true `
            }

        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` LOWER(package.package_name) LIKE LOWER('%${searchQuery}%')`);
            }

            if (whereConditionArray.length === 0)
                whereCondition += ` package.is_active = true `;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND package.is_active = true `
            }

        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `select 
                package.package_name,
                package.start_date,
                package.selection_methode,
                package.id,
                package.end_date,
                package.package_step,
                    packageStatus.status_name
                    from package.ref_package package
                INNER JOIN package.ref_package_status packageStatus on package.package_status = packageStatus.id
                INNER JOIN package.ref_user_account account on package.created_by = account.id
                ${whereCondition}
                ORDER BY package.${orderBy} ${sortDescending === 'true' ? "DESC" : "ASC"}
                LIMIT ${limit} OFFSET ${offset}`,
                { type: db.sequelize.QueryTypes.SELECT });
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.delete = async (req, res) => {
    try {
        let packageId = req.body.id;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await Package.update({
                is_active: false,
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            },
                {
                    where: {
                        id: packageId,
                    }
                });

            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.findById = async (req, res) => {
    try {
        const token = req.header("token");
        const packageId = req.query.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let queryString = `SELECT 
            package.*,
            documentStatus.document_status_name,
            userAccount.name as providerName,
            packageStatus.status_name
            from package.ref_package package
            LEFT JOIN package.ref_document_status documentStatus on package.document_status  = documentStatus.id
            LEFT JOIN package.ref_user_account userAccount on package.provider_name = userAccount.id
            LEFT JOIN package.ref_package_status packageStatus on package.package_status = packageStatus.id
            where package.id='${packageId}'`;
            const results = await db.sequelize.query(
                queryString,
                { type: db.sequelize.QueryTypes.SELECT });
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getCount = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const langId = req.query.language_id;
        const accountType = req.query.account_type;
        const packageName = req.query.package_name;
        const searchQuery = req.query.search_query;
        const userRole = req.query.user_role;
        let detailedSearch = req.query.detailed_search;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `Where `;
        if (userRole === "4") {
            whereCondition += ` package.provider_name = '${authResult.token_data.user_account_id}' AND `
        } else {
            whereCondition += ` account.account_type = '${accountType}' AND `
        }

        if (detailedSearch) {
            if (packageName !== undefined)
                whereConditionArray.push(` LOWER(package.packge_name) LIKE LOWER('%${packageName}%')`);
            if (whereConditionArray.length === 0)
                whereCondition += ` package.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND package.is_active = true `
            }

        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` LOWER(package.package_name) LIKE LOWER('%${searchQuery}%')`);
            }

            if (whereConditionArray.length === 0)
                whereCondition += ` package.is_active = true `;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND package.is_active = true `
            }

        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                count(package.id) AS "count" 
                from package.ref_package as package
                INNER JOIN package.ref_package_status packageStatus on package.package_status = packageStatus.id
                INNER JOIN package.ref_user_account account on package.created_by = account.id
                ${whereCondition}`
            );
            if (results) {
                res.send(helper.createResponseWrapper(results[0][0].count, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.findAllPackageStatus = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let queryString = `SELECT * from package.ref_package_status`;
            const results = await db.sequelize.query(
                queryString,
                { type: db.sequelize.QueryTypes.SELECT });
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.findAllPackageProcessStatus = async (req, res) => {
    try {
        const token = req.header("token");
        const packageId = req.query.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let queryString = `SELECT * from package.ref_package_process_status`;
            const results = await db.sequelize.query(
                queryString,
                { type: db.sequelize.QueryTypes.SELECT });
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdatePackageDocument = async (req, res) => {
    try {
        let requests = req.body;
        console.log(requests);
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageDocument.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_id: requests.package_id
                },
                    {
                        fields: ["url_base64", "document_name", "document_status", "created_date", "created_by", "package_id"
                        ]
                    });

                await Notificatiion.create({
                    user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                    package_id: requests.package_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Dokumen Hasil Pemilihan Telah Diupload"
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by",
                        ]
                    });
                res.send(helper.createResponseWrapper(data, 0));
            }
            else {
                let documentData = await db.sequelize.query(
                    `SELECT 
                    *
                    FROM package.ref_package_document 
                    where package_id = '${requests.package_id}'`,
                    { type: db.sequelize.QueryTypes.SELECT });

                console.log(documentData);
                await PackageDocument.update({
                    document_name: requests.document_name,
                    url_base64: requests.url_base64 === "" ? documentData[0].url_base64 : requests.url_base64,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageDocument = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageId = req.query.id;
        const offset = req.query.offset;
        const limit = req.query.limit;
        const orderBy = req.query.order_by;
        const sortDescending = req.query.descending;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        const documentName = req.query.document_name;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `where document.package_id = '${packageId}' AND  `;
        // const staffId = req.query.company_id;
        if (detailedSearch) {
            if (documentName !== undefined)
                whereConditionArray.push(`LOWER( document.document_name) LIKE LOWER('%${documentName}%')`);


            if (whereConditionArray.length === 0)
                whereCondition += ` document.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND document.is_active = true`
            }
        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` (LOWER( document.document_name) LIKE LOWER('%${searchQuery}%'))`);

            }
            if (whereConditionArray.length === 0)
                whereCondition += ` document.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND document.is_active = true`
            }
        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.created_date,
                documentStatus.document_status_name
                FROM package.ref_package_document document 
                INNER JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                ${whereCondition}
                ORDER BY ${orderBy} ${sortDescending === 'true' ? "DESC" : "ASC"}
                 LIMIT ${limit} OFFSET ${offset}`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getCountPackageDocument = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageId = req.query.id;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        const documentName = req.query.document_name;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `where document.package_id = '${packageId}' AND  `;
        // const staffId = req.query.company_id;
        if (detailedSearch) {
            if (documentName !== undefined)
                whereConditionArray.push(`LOWER( document.document_name) LIKE LOWER('%${documentName}%')`);


            if (whereConditionArray.length === 0)
                whereCondition += ` document.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND document.is_active = true`
            }
        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` (LOWER( document.document_name) LIKE LOWER('%${searchQuery}%'))`);

            }
            if (whereConditionArray.length === 0)
                whereCondition += ` document.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND document.is_active = true`
            }
        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                Count(document.id) as "count"
                FROM package.ref_package_document document 
                INNER JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                ${whereCondition}`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results[0].count, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageDocumentById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.ref_package_document where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.deletePackageDocument = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const documentId = requests.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await PackageDocument.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                is_active: false,
            }, {
                where: {
                    id: documentId
                }
            });
            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}


exports.getNotification = async (req, res) => {
    try {
        const userId = req.query.user_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.ref_notification where user_id = '${userId}' order by created_date DESC`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.readNotification = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const notificationId = requests.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await Notificatiion.update({
                is_read: true,
                // updated_date: currentDateTime,
                // updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: notificationId
                }
            });
            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}

exports.updatePackageDocumentStatus = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            // await PackageDocument.update({
            //     document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
            //     updated_date: currentDateTime,
            //     updated_by: authResult.token_data.user_account_id,

            // }, {
            //     where: {
            //         id: requests.id
            //     }
            // });

            await Package.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                package_status: "4345861e-3dd1-49fe-9259-de30fbd142cf",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: 0,
                command: requests.note

            }, {
                where: {
                    id: requests.package_id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });



            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: requests.note,
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "document_id"
                    ]
                });


            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}


exports.getPackageCommand = async (req, res) => {
    try {
        const documentId = req.query.id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.ref_notification where document_id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.getPackageStep = async (req, res) => {
    try {
        const pacakageId = req.query.id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                packageStep.*,
                package.package_name,
                listStep.step_name,
                listStep.order_number,
                listStep.path,
                status.status_name,
                package.package_step
                FROM package.trx_package_step packageStep
                INNER JOIN package.ref_package package on packageStep.package_id = package.id
                INNER JOIN package.ref_list_step_master listStep on packageStep.step_id = listStep.id
                INNER JOIN package.ref_step_status status on packageStep.step_status_id = status.id
                where packageStep.package_id = '${pacakageId}'
                ORDER BY listStep.order_number ASC`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.getPackageStepById = async (req, res) => {
    try {
        const stepId = req.query.id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                packageStep.*,
                package.package_name,
                listStep.step_name,
                listStep.order_number,
                status.status_name,
                package.package_step
                FROM package.trx_package_step packageStep
                INNER JOIN package.ref_package package on packageStep.package_id = package.id
                INNER JOIN package.ref_list_step_master listStep on packageStep.step_id = listStep.id
                INNER JOIN package.ref_step_status status on packageStep.step_status_id = status.id
                where packageStep.id = '${stepId}'
                ORDER BY listStep.order_number ASC`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep1 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {

                const dataStep1 = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_1 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });



                const data = await PackageStep1.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: dataStep1.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "document_status", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                if (dataStep1.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Rapart Reviu Laporan Hasil Pemilihan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep1.length > 0) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })


                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 1 THEN package_step ELSE 1 END')
                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep1.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep1 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_1 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep1ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_1 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateStep1DocumentStatus = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await PackageStep1.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });



            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, // "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Reviu Laporan Hasil Pemilihan"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });

            //penyedia
            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Reviu Laporan Hasil Pemilihan"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });


            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}


exports.insertUpdateDocumentStep2 = async (req, res) => {
    try {
        let requests = req.body;
        console.log(requests);
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_2 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });

                const data = await PackageStep2.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    // document_type: requests.document_type === "" ? null : requests.document_type,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6"
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                // if (requests.document_type === "0") {
                //     await PackageStep.update({
                //         step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //         updated_date: currentDateTime,
                //         updated_by: authResult.token_data.user_account_id,
                //     }, {
                //         where: {
                //             id: requests.package_step_id
                //         }
                //     })

                //     await Package.update({
                //         updated_date: currentDateTime,
                //         updated_by: authResult.token_data.user_account_id,
                //         package_step: 2

                //     }, {
                //         where: {
                //             id: requests.package_id
                //         }
                //     });

                // }

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "SPPBJ Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }

                if (dataStep.length > 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Jaminan Pelaksanaan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }

                if (dataStep.length > 1) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "BA Konfirmasi dan Klarifikasi Jaminan Pelaksanaan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }



                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep2.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep2 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_2 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where document.package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep2ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_2 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateStep2DocumentStatus = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            const dataStep = await db.sequelize.query(
                `SELECT * FROM  package.trx_package_step_2 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT });

            await PackageStep2.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });





            if (dataStep.length === 1) {
                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    path: requests.path,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "SPPBJ Telah Disetujui"
                },
                    {
                        fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                        ]
                    });

                //penyedia
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    path: requests.path,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Segera siapkan dan terbitkan jaminan pelaksanaan"
                },
                    {
                        fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                        ]
                    });
            }
            else if (dataStep.length === 2) {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    path: requests.path,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Jaminan Pelaksanaan Telah Disetujui"
                },
                    {
                        fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                        ]
                    });

                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    path: requests.path,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Konfirmasi dan Klarifikasi Jaminan Pelaksanaan"
                },
                    {
                        fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                        ]
                    });
            }
            else if (dataStep.length === 3) {
                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    path: requests.path,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Laksanakan Rapat Persiapan Penandatanganan Kontrak"
                },
                    {
                        fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                        ]
                    });

                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: db.sequelize.literal('CASE WHEN package_step > 2 THEN package_step ELSE 2 END')

                }, {
                    where: {
                        id: requests.package_id
                    }
                });
            }



            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}

exports.insertUpdateDocumentStep3 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                // const data = await PackageStep3.create({
                //     url_base64: requests.url_base64,
                //     document_name: requests.document_name,
                //     description: requests.description,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     package_step_id: requests.package_step_id
                // },
                //     {
                //         fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                //         ]
                //     });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 3

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // //penyedia

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_3 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });

                const data = await PackageStep3.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "document_status", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Rapart Persiapan Penandatanganan Kontrak Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length > 0) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 3 THEN package_step ELSE 3 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep3.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep3 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                documentStatus.document_status_name,
                document.created_by
                FROM package.trx_package_step_3 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep3ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_3 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateStep3DocumentStatus = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await PackageStep3.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });




            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Penandatanganan Kontrak"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });

            //penyedia
            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Penandatanganan Kontrak"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });




            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}



exports.insertUpdateDocumentStep4 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep4.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description", "document_status"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                await Notificatiion.create({
                    user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Kontrak Telah Diupload ",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep4.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep4 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();

            await PackageStep4.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: db.sequelize.literal('CASE WHEN package_step > 4 THEN package_step ELSE 4 END')

            }, {
                where: {
                    id: requests.package_id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });





            //penyedia

            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Kontrak Telah Disetujui",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Kontrak Telah Disetujui",
                path: "/PackageStep/Step5"
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep4 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_4 document 
                INNER JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep4ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_4 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep4Command = async (req, res) => {
    try {
        const packageStepId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_4_command where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdatePackageStep4Command = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep4Command.create({
                    package_step_id: requests.package_step_id,
                    command_penyedia: requests.command_penyedia,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                },
                    {
                        fields: ["package_step_id", "command_penyedia", "created_date", "created_by"
                        ]
                    });


                res.send(helper.createResponseWrapper(data, 0));
            }

            //penyedia
            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: requests.command_penyedia,
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            // else {
            //     await Package.update({
            //         package_step_id: requests.package_step_id,
            //         command_penyedia: requests.command_penyedia,
            //         command_pptk: requests.command_pptk,
            //         updated_date: currentDateTime,
            //         updated_by: authResult.token_data.user_account_id,

            //     },
            //         {
            //             where: {
            //                 id: requests.id,
            //             }
            //         });
            //     res.send(helper.createResponseWrapper([], 0));
            // }


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep5 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {

            let currentDateTime = new Date();
            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_5 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });


                const data = await PackageStep5.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "document_status", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });





                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Penyerahan Lokasi Kerja Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length > 0) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 5 THEN package_step ELSE 5 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }


                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep5.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep5 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep5.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            //penyedia

            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Penyerahan Lokasi Kerja dan Personel",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Penyerahan Lokasi Kerja dan Personel",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep5 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_by,
                document.created_date,
                documentStatus.document_status_name
                FROM package.trx_package_step_5 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep5ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_5 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep6 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                // const data = await PackageStep6.create({
                //     url_base64: requests.url_base64,
                //     document_name: requests.document_name,
                //     description: requests.description,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     package_step_id: requests.package_step_id
                // },
                //     {
                //         fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                //         ]
                //     });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 6

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });


                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_6 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });


                const data = await PackageStep6.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "document_status", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                if (dataStep.length === 0) {
                    let ppkAccount = await db.sequelize.query(
                        `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                        { type: db.sequelize.QueryTypes.SELECT });



                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Penyerahan Surat Perintah Mulai Kerja Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length > 1) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 7 THEN package_step ELSE 7 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep6.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep6 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_6 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true `,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep6ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_6 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep6 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep6.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });


            //penyedia

            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Penyerahan Surat Perintah Mulai Kerja",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Penyerahan Surat Perintah Mulai Kerja",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep7 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep7.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 7

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep7.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep7 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_7 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep7ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_7 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep8 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep8.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_type: requests.document_type
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description", "document_status",
                            "document_type"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });
                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (requests.document_type === "0") {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Dokumen Rencana Mutu Pekerjaan Konstruksi Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }
                if (requests.document_type === "1") {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Dokumen Rencana Keselamatan Kerja Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }



                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep8.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep8 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();

            const dataStep = await db.sequelize.query(
                `SELECT * FROM  package.trx_package_step_8 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT });


            await PackageStep8.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            if (dataStep.length > 1) {
                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: db.sequelize.literal('CASE WHEN package_step > 8 THEN package_step ELSE 8 END')

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                let pptkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                    { type: db.sequelize.QueryTypes.SELECT });





                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Persiapkan Rapat Persiapan Pelaksanaan Kontrak",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

            }

            if (requests.document_type === "0") {
                //penyedia

                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Rencana Mutu Pekerjaan Konstruksi Telah Disetujui",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

            }
            if (requests.document_type === "1") {
                //penyedia

                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Rencana Keselamatan Kerja Telah Disetujui",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            }

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep8 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_8 document 
                INNER JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep8ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_8 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep9 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_9 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });
                const data = await PackageStep9.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,

                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });


                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Rapat Persiapan Pelaksanaan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length > 0) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 9 THEN package_step ELSE 9 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }





                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep9.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep9 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_9 document 
                left join package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where document.package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep9ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_9 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep9 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();

            await PackageStep9.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });





            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Pelaksanaan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Pelaksanaan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });


            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep10 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep10.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description", "document_status"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });
                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: db.sequelize.literal('CASE WHEN package_step > 10 THEN package_step ELSE 10 END')

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep10.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep10 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep10.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: db.sequelize.literal('CASE WHEN package_step > 10 THEN package_step ELSE 10 END')

            }, {
                where: {
                    id: requests.package_id
                }
            });

            // //penyedia
            // await Notificatiion.create({
            //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
            //     package_id: requests.package_id,
            //     package_step_id: requests.package_step_id,
            //     created_date: currentDateTime,
            //     created_by: authResult.token_data.user_account_id,
            //     note: "Undangan Penyerahan Surat Perintah Mulai Kerja",
            //     path: requests.path
            // },
            //     {
            //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
            //         ]
            //     });

            // await Notificatiion.create({
            //     user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
            //     package_id: requests.package_id,
            //     package_step_id: requests.package_step_id,
            //     created_date: currentDateTime,
            //     created_by: authResult.token_data.user_account_id,
            //     note: "Undangan Penyerahan Surat Perintah Mulai Kerja",
            //     path: requests.path
            // },
            //     {
            //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
            //         ]
            //     });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep10 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_10 document 
                  where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep10ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_10 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep11 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();


            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_11 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });
                const data = await PackageStep11.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });





                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Pengukuran Lapangan dan Pemeriksaan Bersama Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }
                if (dataStep.length > 1) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 22 THEN package_step ELSE 22 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }



                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep11.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep11 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                documentStatus.document_status_name
                FROM package.trx_package_step_11 document 
                LEFT join package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep11ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_11 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep11 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();

            await PackageStep11.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });





            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Pengukuran Lapangan dan Pemeriksaan Bersama",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Pengukuran Lapangan dan Pemeriksaan Bersama",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });


            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep12 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep12.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_type: requests.document_type,
                    start_date: requests.start_date,
                    end_date: requests.end_date,
                    document_number: requests.document_number,
                    document_status: requests.document_type === "7" ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_type", "start_date", "end_date", "document_number", "document_status"
                        ]
                    });

                if (requests.document_type === "6") {
                    // await Notificatiion.create({
                    //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                    //     package_id: requests.package_id,
                    //     package_step_id: requests.package_step_id,
                    //     created_date: currentDateTime,
                    //     created_by: authResult.token_data.user_account_id,
                    //     note: "Undangan Rapat SCM Telah Diupload ",
                    //     path: requests.path
                    // },
                    //     {
                    //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    //         ]
                    //     });

                    let ppkAccount = await db.sequelize.query(
                        `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                        { type: db.sequelize.QueryTypes.SELECT });




                    await Notificatiion.create({
                        user_id: requests.provider_name,
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Undangan Rapat Pembuktian (SCM)",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });

                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Undangan Rapat Pembuktian(SCM)",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }
                else if (requests.document_type === "7") {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Berita Acara Rapat SCM Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     // package_step: 12

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep12.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    start_date: requests.start_date,
                    end_date: requests.end_date,
                    document_number: requests.document_number,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });

                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.deleteDocumentStep12 = async (req, res) => {
    try {
        let documentId = req.body.id;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await PackageStep12.update({
                is_active: false,
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            },
                {
                    where: {
                        id: documentId,
                    }
                });


            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.updateDOcumentStep12 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            let statusApproval = "";
            if (requests.approvals) {
                statusApproval = "73d44b28-62f1-4391-b2fb-b4a61f462cff"
            } else {
                statusApproval = "1622ca1c-9bf1-41f5-bd9a-e183f4456090"
            }
            await PackageStep12.update({
                document_status: requests.document_type === "7" ? statusApproval : "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });


            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });




            if (requests.document_type === "6") {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Rapat Pembuktian (SCM)",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Rapat Pembuktian(SCM)",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            }
            if (requests.document_type === "7" && requests.approvals) {
                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

            }



            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep12 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.document_type,
                document.start_date,
                document.end_date,
                document.document_number,
                document.created_by,
                 documentStatus.document_status_name
                FROM package.trx_package_step_12 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' AND is_active = true
                ORDER BY created_date DESC`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep12ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_12 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep13 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep13.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    // package_step: 13

                }, {
                    where: {
                        id: requests.package_id
                    }
                });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "Draf Undangan Rapat Persiapan Pelaksanaan Kontrak",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep13.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep13 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep13.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: 13

            }, {
                where: {
                    id: requests.package_id
                }
            });

            //penyedia

            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Pelaksanaan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Persiapan Pelaksanaan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep13 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_13 document 
                 where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep13ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_13 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep14 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep14.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 14

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep14.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep14 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_14 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep14ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_14 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep15 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep15.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    // document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "Draf Undangan Rapat Pemeriksaan Bersama (MC-0) Telah Diupload ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep15.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep15 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep15.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                // package_step: 15

            }, {
                where: {
                    id: requests.package_id
                }
            });

            //penyedia
            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Pemeriksaan Bersama (MC-0)",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Pemeriksaan Bersama (MC-0)",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep15 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_15 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep15ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_15 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep16 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep16.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 16

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep16.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep16 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_16 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep16ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_16 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.insertUpdateDocumentStep17 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep17.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 17

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep17.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep17 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_17 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep17ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_17 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep18 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep18.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 18

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });


                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep18.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep18 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_18 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep18ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_18 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep19 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep19.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 19

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep19.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep19 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep19.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                // package_step: 19

            }, {
                where: {
                    id: requests.package_id
                }
            });

            //penyedia
            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Perubahan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Perubahan Kontrak",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep19 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_19 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep19ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_19 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep20 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep20.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 20

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep20.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep20 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_20 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep20ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_20 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep21 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_21 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });

                const data = await PackageStep21.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_status: dataStep.length < 2 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,

                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Surat Permohonan Pemberian Kesempatan Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length === 1) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Rapat Pemberian Kesempatan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length === 4) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        // package_step: 23

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }



                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep21.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateDocumentStep21 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();


            const dataStep = await db.sequelize.query(
                `SELECT * FROM  package.trx_package_step_21 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT });


            await PackageStep21.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });





            if (dataStep.length === 1) {
                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Persiapkan Rapat Pemberian Kesempatan",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            } else if (dataStep.length > 1) {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Rapat Pemberian Kesempatan",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Rapat Pemberian Kesempatan",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            }




            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.getPackageStep21 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by,
                statusDocument.document_status_name
                FROM package.trx_package_step_21 document
                LEFT JOIN package.ref_document_status statusDocument on document.document_status = statusDocument.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep21ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_21 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep22 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep22.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });

                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    // package_step: 22

                }, {
                    where: {
                        id: requests.package_id
                    }
                });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "Draf Undangan Rapat SCM Telah Diupload ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep22.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep22 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep22.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                // package_step: 22

            }, {
                where: {
                    id: requests.package_id
                }
            });

            //penyedia

            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat SCM",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat SCM",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep22 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                document.created_by
                FROM package.trx_package_step_22 document 
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep22ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_22 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep23 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                // const data = await PackageStep23.create({
                //     url_base64: requests.url_base64,
                //     document_name: requests.document_name,
                //     description: requests.description,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     package_step_id: requests.package_step_id
                // },
                //     {
                //         fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                //         ]
                //     });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 23

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_23 where package_step_id = '${requests.package_step_id}'`,
                    { type: db.sequelize.QueryTypes.SELECT });

                const data = await PackageStep23.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_status: dataStep.length < 2 || requests.document_type === "1" ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                    document_type: requests.document_type === "" ? null : requests.document_type

                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status", "document_type"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Surat Permohonan Pemeriksaan Dalam Rangka Serah Terima Pertama Telah Diupload ",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length === 1) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Pegukuran Lapangan Dan Pemeriksaan Bersama Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }


                if (requests.document_type === "1") {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Berita Acara Serah Terima Pertama Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }

                res.send(helper.createResponseWrapper(data, 0));
            }
            else {
                await PackageStep23.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep23 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                statusDocument.document_status_name,
                document.created_by
                FROM package.trx_package_step_23 document 
                LEFT JOIN package.ref_document_status statusDocument on document.document_status = statusDocument.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep23ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_23 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateDocumentStep23 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();


            const dataStep = await db.sequelize.query(
                `SELECT * FROM  package.trx_package_step_23 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT });


            await PackageStep23.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });




            if (dataStep.length === 1) {
                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Lakukan Pengukuran Lapangan dan Pemeriksaan Bersama",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            } else if (dataStep.length === 2) {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Pengukuran Lapangan dan Pemeriksaan Bersama",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                await Notificatiion.create({
                    user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Pengukuran Lapangan dan Pemeriksaan Bersama",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            }

            if (requests.document_type === "1") {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Persiapkan dan Upload Jaminan Pemeliharaan",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: db.sequelize.literal('CASE WHEN package_step > 23 THEN package_step ELSE 23 END')

                }, {
                    where: {
                        id: requests.package_id
                    }
                });
            }




            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep24 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {

                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_24 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });


                const data = await PackageStep24.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_status: dataStep.length === 0 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,

                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Jaminan Pemeliharaan Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                } else if (dataStep.length > 0) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 24 THEN package_step ELSE 24 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }







                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep24.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep24 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                documentStatus.document_status_name,
                document.created_by
                FROM package.trx_package_step_24 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep24ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_24 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.updateStep24DocumentStatus = async (req, res) => {
    try {
        const requests = req.body;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await PackageStep24.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });







            await Notificatiion.create({
                user_id: pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Konfirmasi dan Klarifikasi Jaminan Pemeliharaan"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });

            //penyedia
            await Notificatiion.create({
                user_id: requests.provider_name,
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                path: requests.path,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Jaminan Pemeliharaan Telah Disetujui"
            },
                {
                    fields: ["user_id", "package_id", "package_step_id", "note", "path", "created_date", "created_by",
                    ]
                });


            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    } catch (exception) {
        console.log(exception);
    }
}


exports.insertUpdateDocumentStep25 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const dataStep = await db.sequelize.query(
                    `SELECT * FROM  package.trx_package_step_25 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                    { type: db.sequelize.QueryTypes.SELECT });

                const data = await PackageStep25.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id,
                    document_status: dataStep.length < 2 ? "e0ae1282-b816-4b8b-9a68-7c77c44db7a6" : null,
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description",
                            "document_status"
                        ]
                    });

                let ppkAccount = await db.sequelize.query(
                    `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 1`,
                    { type: db.sequelize.QueryTypes.SELECT });




                if (dataStep.length === 0) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Surat Permohonan Pemeriksaan Dalam Rangka Serah Terima Akhir Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });

                }
                if (dataStep.length === 1) {
                    await Notificatiion.create({
                        user_id: ppkAccount.length > 0 ? ppkAccount[0].id : null, //"c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                        package_id: requests.package_id,
                        package_step_id: requests.package_step_id,
                        created_date: currentDateTime,
                        created_by: authResult.token_data.user_account_id,
                        note: "Draft Undangan Pemeriksaan Dalam Rangka Serah Terima Akhir Telah Diupload",
                        path: requests.path
                    },
                        {
                            fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                            ]
                        });
                }

                if (dataStep.length > 3) {
                    await PackageStep.update({
                        step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                    }, {
                        where: {
                            id: requests.package_step_id
                        }
                    })

                    await Package.update({
                        package_status: "0c6ac989-dcab-4154-972c-8d5a7306eae1",
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,
                        package_step: db.sequelize.literal('CASE WHEN package_step > 25 THEN package_step ELSE 25 END')

                    }, {
                        where: {
                            id: requests.package_id
                        }
                    });
                }



                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await PackageStep25.update({
                    url_base64: requests.url_base64 ? requests.url_base64 : db.sequelize.literal(`url_base64`),
                    document_name: requests.document_name,
                    description: requests.description,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,

                },
                    {
                        where: {
                            id: requests.id,
                        }
                    });
                res.send(helper.createResponseWrapper([], 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep25 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                documentStatus.document_status_name,
                document.created_by
                FROM package.trx_package_step_25 document 
                LEFT JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}' and document.is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}


exports.updateDocumentStep25 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();


            const dataStep = await db.sequelize.query(
                `SELECT * FROM  package.trx_package_step_25 where package_step_id = '${requests.package_step_id}' and is_active = true`,
                { type: db.sequelize.QueryTypes.SELECT });


            await PackageStep25.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            });

            let pptkAccount = await db.sequelize.query(
                `Select id FROM package.ref_user_account where account_type = '${requests.account_type}' and user_role = 2`,
                { type: db.sequelize.QueryTypes.SELECT });


           


            if (dataStep.length === 1) {
                await Notificatiion.create({
                    user_id:  pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Lakukan Pemeriksaan Bersama Dalam Rangka Serah Terima Akhir",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            } else if (dataStep.length === 2) {
                await Notificatiion.create({
                    user_id: requests.provider_name,
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Pemeriksaan Bersama Dalam Rangka Serah Terima Akhir",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                await Notificatiion.create({
                    user_id:  pptkAccount.length > 0 ? pptkAccount[0].id : null, //"d95495df-44ee-4c0a-9e3d-762c33717c8a",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Undangan Pemeriksaan Bersama Dalam Rangka Serah Terima Akhir",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });
            }


            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep25ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_25 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep26 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep26.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 26

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep26 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_26 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep26ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_26 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep27 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep27.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 27

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep27 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_27 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep27ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_27 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.insertUpdateDocumentStep28 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep28.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 28

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep28 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_28 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep28ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_28 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep29 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep29.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    document_status: "e0ae1282-b816-4b8b-9a68-7c77c44db7a6",
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description", "document_status"
                        ]
                    });


                // await PackageStep.update({
                //     step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                // }, {
                //     where: {
                //         id: requests.package_step_id
                //     }
                // })

                // await Package.update({
                //     updated_date: currentDateTime,
                //     updated_by: authResult.token_data.user_account_id,
                //     package_step: 4

                // }, {
                //     where: {
                //         id: requests.package_id
                //     }
                // });

                await Notificatiion.create({
                    user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                    package_id: requests.package_id,
                    package_step_id: requests.package_step_id,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    note: "Draf Undangan Pemeriksaan Bersama Telah Diupload ",
                    path: requests.path
                },
                    {
                        fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                        ]
                    });

                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.updateDocumentStep29 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();



            await PackageStep29.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.id
                }
            })

            await PackageStep.update({
                step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            }, {
                where: {
                    id: requests.package_step_id
                }
            })

            await Package.update({
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: 29

            }, {
                where: {
                    id: requests.package_id
                }
            });

            //penyedia
            await Notificatiion.create({
                user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Pemeriksaan Bersama",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                package_step_id: requests.package_step_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: "Undangan Rapat Pemeriksaan Bersama",
                path: requests.path
            },
                {
                    fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                    ]
                });

            res.send(helper.createResponseWrapper([], 0));


        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};



exports.getPackageStep29 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date,
                documentStatus.document_status_name
                FROM package.trx_package_step_29 document 
                INNER JOIN package.ref_document_status documentStatus on document.document_status = documentStatus.id
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep29ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_29 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep30 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep30.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 30

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep30 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_30 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep30ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_30 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep31 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep31.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 31

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep31 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_31 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep31ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_31 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep32 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep32.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 32

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep32 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_32 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep32ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_32 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep33 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep33.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 33

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep33 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_33 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep33ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_33 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.insertUpdateDocumentStep34 = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            if (requests.id === 0) {
                const data = await PackageStep34.create({
                    url_base64: requests.url_base64,
                    document_name: requests.document_name,
                    description: requests.description,
                    created_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    package_step_id: requests.package_step_id
                },
                    {
                        fields: ["url_base64", "document_name", "created_date", "created_by", "package_step_id", "description"
                        ]
                    });


                await PackageStep.update({
                    step_status_id: "a456a3e0-dc3c-4cdb-8f49-d28b224d035c",
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                }, {
                    where: {
                        id: requests.package_step_id
                    }
                })

                await Package.update({
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_step: 34,
                    package_status: "0c6ac989-dcab-4154-972c-8d5a7306eae1"

                }, {
                    where: {
                        id: requests.package_id
                    }
                });

                // await Notificatiion.create({
                //     user_id: "c80a3f2d-b1a6-48ae-8e8b-e53d69b456cf",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });

                // await Notificatiion.create({
                //     user_id: "5ed45002-eb97-4e3c-81fc-049914ae110f",
                //     package_id: requests.package_id,
                //     package_step_id: requests.package_step_id,
                //     created_date: currentDateTime,
                //     created_by: authResult.token_data.user_account_id,
                //     note: "SPBJ Telah Ditetapkan ",
                //     path: requests.path
                // },
                //     {
                //         fields: ["user_id", "package_id", "note", "created_date", "created_by", "path", "package_step_id"
                //         ]
                //     });
                res.send(helper.createResponseWrapper(data, 0));
            }

        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.getPackageStep34 = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const packageStepId = req.query.id
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `SELECT 
                document.id,
                document.document_name,
                document.description,
                document.created_date
                FROM package.trx_package_step_34 document 
                where package_step_id = '${packageStepId}'`,
                { type: db.sequelize.QueryTypes.SELECT }
            );
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getPackageStep34ById = async (req, res) => {
    try {
        const documentId = req.query.id;
        const langId = req.query.language_id;
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select * FROM package.trx_package_step_34 where id = '${documentId}'`,
                { type: db.sequelize.QueryTypes.SELECT });

            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};


exports.getCountTotalPackage = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const userRole = req.query.user_role;
        const accountType = req.query.account_type
        let whereCondition = `Where package.is_active = true  `;

        if (userRole === "4") {
            whereCondition += ` AND package.provider_name = '${authResult.token_data.user_account_id}'  `
        }
        else {
            whereCondition += ` AND account.account_type = '${accountType}'  `
        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                count(package.id) AS "count" 
                from package.ref_package as package
                INNER JOIN package.ref_user_account account on package.created_by = account.id
                ${whereCondition}
                `
            );
            if (results) {
                res.send(helper.createResponseWrapper(results[0][0].count, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}
exports.getCountTotalPackageInProgress = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const userRole = req.query.user_role;
        const accountType = req.query.account_type
        let whereCondition = `Where package_status = '4345861e-3dd1-49fe-9259-de30fbd142cf' and  package.is_active = true  `;

        if (userRole === "4") {
            whereCondition += ` AND package.provider_name = '${authResult.token_data.user_account_id}'  `
        } else {
            whereCondition += ` AND account.account_type = '${accountType}'  `
        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                count(package.id) AS "count" 
                from package.ref_package as package
                INNER JOIN package.ref_user_account account on package.created_by = account.id
                ${whereCondition}
                `
            );
            if (results) {
                res.send(helper.createResponseWrapper(results[0][0].count, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.getCountTotalPackageComplete = async (req, res) => {
    try {
        const token = req.header("token");
        const authResult = await helper.authenticateJWT(token);
        const userRole = req.query.user_role;
        const accountType = req.query.account_type
        let whereCondition = `Where package_status = '0c6ac989-dcab-4154-972c-8d5a7306eae1' and  package.is_active = true   `;

        if (userRole === "4") {
            whereCondition += ` AND package.provider_name = '${authResult.token_data.user_account_id}'  `
        } else {
            whereCondition += ` AND account.account_type = '${accountType}' AND `
        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                count(package.id) AS "count" 
                from package.ref_package as package
                INNER JOIN package.ref_user_account account on package.created_by = account.id
               ${whereCondition}
                `
            );
            if (results) {
                res.send(helper.createResponseWrapper(results[0][0].count, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    } catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.deleteDocumentStep = async (req, res) => {
    try {
        let documentId = req.body.id;
        let packageStep = req.body.package_step;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();

            switch (packageStep) {
                case 1:
                    await PackageStep1.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 2:
                    await PackageStep2.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 3:
                    await PackageStep3.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 4:
                    // Handle step 4
                    await PackageStep4.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 5:
                    // Handle step 5
                    await PackageStep5.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });

                    break;
                case 6:
                    await PackageStep6.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    // Handle step 6
                    break;
                case 7:
                    await PackageStep7.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    // Handle step 7
                    break;
                case 8:
                    // Handle step 8
                    await PackageStep8.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 9:
                    // Handle step 9
                    await PackageStep9.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 10:
                    // Handle step 10
                    await PackageStep10.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 11:
                    // Handle step 11
                    await PackageStep11.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 12:
                    // Handle step 12
                    await PackageStep12.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 13:
                    // Handle step 13
                    await PackageStep13.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 14:
                    // Handle step 14
                    await PackageStep14.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 15:
                    // Handle step 15
                    await PackageStep15.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 16:
                    // Handle step 16
                    await PackageStep16.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 17:
                    // Handle step 17
                    await PackageStep17.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 18:
                    // Handle step 18
                    await PackageStep18.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 19:
                    // Handle step 19
                    await PackageStep19.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 20:
                    // Handle step 20
                    await PackageStep20.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 21:
                    // Handle step 21
                    await PackageStep21.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 22:
                    // Handle step 22
                    await PackageStep22.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 23:
                    // Handle step 23
                    await PackageStep23.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 24:
                    // Handle step 24
                    await PackageStep24.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                case 25:
                    // Handle step 25
                    await PackageStep25.update({
                        is_active: false,
                        updated_date: currentDateTime,
                        updated_by: authResult.token_data.user_account_id,

                    },
                        {
                            where: {
                                id: documentId,
                            }
                        });
                    break;
                // default:
                //     // Handle the default case if step doesn't match any of the above
                //     break;
            }




            res.send(helper.createResponseWrapper([], 0));
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }

    }
    catch (exception) {
        console.log(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.findDetailPackage = async (req, res) => {
    try {
        const token = req.header("token");
        const packageId = req.query.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let queryString = `SELECT 
            package.package_name,
            package.start_date,
            package.end_date,
            package.created_date,
            package.id,
            package.package_step,
            package.selection_methode,
            package.pagu,
            package.hps,
            package.kontrak,
            package.provider_name,
            package.planing_consultant,
            package.supervising_consultant,
            package.contract_number,
            package.document_status,
            package.package_status,
            package.ppk_name,
            documentStatus.document_status_name,
            userAccount.name as providerName,
            packageStatus.status_name,
            pptkAccount.account_type
            from package.ref_package package
            LEFT JOIN package.ref_document_status documentStatus on package.document_status  = documentStatus.id
            LEFT JOIN package.ref_user_account userAccount on package.provider_name = userAccount.id
            LEFT JOIN package.ref_package_status packageStatus on package.package_status = packageStatus.id
            INNER JOIN package.ref_user_account pptkAccount on package.created_by = pptkAccount.id
            where package.id='${packageId}'`;
            const results = await db.sequelize.query(
                queryString,
                { type: db.sequelize.QueryTypes.SELECT });
            if (results) {
                res.send(helper.createResponseWrapper(results, 0));
            } else {
                res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 1, 98, "Authentication failed."));
        }
    }
    catch (exception) {
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};