const jwt = require("jsonwebtoken");
const db = require("../models");
const Package = db.Package;
const Notificatiion = db.Notification;
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
                    selection_methode: requests.selection_methode
                },
                    {
                        fields: ["package_name", "start_date", "created_date", "created_by", "package_status",
                            "end_date", "selection_methode"
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
                res.send(helper.createResponseWrapper(data, 0));
            } else {
                await Package.update({
                    package_name: requests.package_name,
                    start_date: requests.start_date,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    package_status: requests.package_status,
                    end_date: requests.end_date,
                    selection_methode: requests.selection_methode

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
        const sortDescending = req.query.descending;
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
        let whereCondition = `Where `;

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
                package.*,
                    packageStatus.status_name
                    from package.ref_package package
                INNER JOIN package.ref_package_status packageStatus on package.package_status = packageStatus.id
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
            let queryString = `SELECT * from package.ref_package where id='${packageId}'`;
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
        const packageName = req.query.package_name;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `Where `;

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
            await PackageDocument.update({
                document_status: "73d44b28-62f1-4391-b2fb-b4a61f462cff",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,

            }, {
                where: {
                    id: requests.id
                }
            });

            await Package.update({
                package_status: "4345861e-3dd1-49fe-9259-de30fbd142cf",
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
                package_step: 0

            }, {
                where: {
                    id: requests.package_id
                }
            });


            await Notificatiion.create({
                user_id: "d95495df-44ee-4c0a-9e3d-762c33717c8a",
                package_id: requests.package_id,
                created_date: currentDateTime,
                created_by: authResult.token_data.user_account_id,
                note: requests.note,
                document_id: requests.id
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
