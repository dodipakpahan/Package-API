const jwt = require("jsonwebtoken");
const db = require("../models");
const UserAccount = db.UserAccount;
const fs = require("fs");
const Op = db.Sequelize.Op;
const helper = require("../helper/ApplicationHelper");
const { Sequelize } = require("sequelize");
const moment = require("moment");


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
                const user = await UserAccount.create({
                    username: requests.username,
                    password: Sequelize.fn('PGP_SYM_ENCRYPT', requests.password, process.env.PG_AES_KEY),
                    email: requests.email,
                    created_date: currentDateTime,
                    updated_date: currentDateTime,
                    created_by: authResult.token_data.user_account_id,
                    updated_by: authResult.token_data.user_account_id,
                    is_active: true,
                    user_role: requests.user_role,
                    name: requests.name
                },
                    {
                        fields: ["username", "password", "email",
                            "created_date", "created_by",
                            "is_active", "user_role", "name"]
                    });

                // console.log(user);
                res.send(helper.createResponseWrapper(user, 0));
            } else {
                await UserAccount.update({
                    username: requests.username,
                    email: requests.email,
                    updated_date: currentDateTime,
                    updated_by: authResult.token_data.user_account_id,
                    is_active: requests.is_active,
                    user_role: requests.user_role,
                    name: requests.name
                },
                    {
                        where: {
                            id: requests.id
                            // language_id: requests.language_id,
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
        const userName = req.query.user_name;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `Where `;

        if (detailedSearch) {
            if (userName !== undefined)
                whereConditionArray.push(` LOWER(username) LIKE LOWER('%${userName}%')`);
            if (whereConditionArray.length === 0)
                whereCondition += ` is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND is_active = true `
            }

        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` (LOWER(username) LIKE LOWER('%${searchQuery}%')`);
                whereConditionArray.push(` LOWER(name) LIKE LOWER('%${searchQuery}%'))`);
            }

            if (whereConditionArray.length === 0)
                whereCondition += ` is_active = true `;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND is_active = true `
            }

        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `select *
                FROM package.ref_user_account
                ${whereCondition}
                ORDER BY ${orderBy} ${sortDescending === 'true' ? "DESC" : "ASC"}
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
        let userId = req.body.id;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            await UserAccount.update({
                is_active: false,
                updated_date: currentDateTime,
                updated_by: authResult.token_data.user_account_id,
            },
                {
                    where: {
                        id: userId,
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
        const userId = req.query.id;
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let queryString = `SELECT * from package.ref_user_account where id='${userId}'`;
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
        const userName = req.query.user_name;
        const searchQuery = req.query.search_query;
        let detailedSearch = req.query.detailed_search;
        if (!detailedSearch && detailedSearch !== "true")
            detailedSearch = false;
        else if (detailedSearch === "false")
            detailedSearch = false;
        let whereConditionArray = [];
        let whereCondition = `Where `;

        if (detailedSearch) {
            if (userName !== undefined)
                whereConditionArray.push(` LOWER(userAccount.username) LIKE LOWER('%${userName}%')`);
            if (whereConditionArray.length === 0)
                whereCondition += ` userAccount.is_active = true`;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " AND ";
                }
                whereCondition += ` AND userAccount.is_active = true `
            }

        } else {
            if (searchQuery !== undefined) {
                whereConditionArray.push(` (LOWER(userAccount.username) LIKE LOWER('%${searchQuery}%')`);
                whereConditionArray.push(` LOWER(userAccount.name) LIKE LOWER('%${searchQuery}%'))`);
            }

            if (whereConditionArray.length === 0)
                whereCondition += ` userAccount.is_active = true `;

            else {
                for (let i = 0; i < whereConditionArray.length; i++) {
                    whereCondition += whereConditionArray[i];
                    if (i !== whereConditionArray.length - 1)
                        whereCondition += " OR ";
                }
                whereCondition += ` AND userAccount.is_active = true `
            }

        }
        if (authResult.authenticated) {
            const results = await db.sequelize.query(
                `Select 
                count(userAccount.id) AS "count" 
                from package.ref_user_account as userAccount
                
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


exports.login = async (req, res) => {
    const requests = req.body;
    const username = requests.username;
    const password = requests.password;

    let user = {
        agent: req.header('user-agent'),
        referrer: req.header('referrer'),
        ip: req.header('x-forwarded-for') || req.connection.remoteAddress,
        screen: {
            width: req.param('width'),
            height: req.param('height')
        }
    };
    try {
        const results = await db.sequelize.query(
            `SELECT 
                account.id AS user_account_id, 
                account.username, 
                account.user_role, 
                account.created_date, 
                account.updated_date, 
                account.created_by, 
                account.updated_by,
                account.is_active, 
                account.email
                
            FROM package.ref_user_account AS account
            WHERE account.username = '${username}' 
            AND PGP_SYM_DECRYPT(account.password::bytea, '${process.env.PG_AES_KEY}') = '${password}' AND account.is_active = TRUE`,
            { type: db.sequelize.QueryTypes.SELECT }
        )
        if (results) {
            if (results.length > 0) {
                await helper.createLoginHistory(results[0].user_account_id, user.ip);
                const token = await helper.createUpdateJWT(results[0].user_account_id, results[0].email);
                let newResults = results[0];
                newResults.token = token;
                res.send(helper.createResponseWrapper(newResults, 0));
            }
            else {
                res.send(helper.createResponseWrapper([], 0, 1, "Wrong Username and/or Password"));
            }
        } else {
            res.send(helper.createResponseWrapper([], 0, 2, "Invalid input parameters"));
        }
    }
    catch (exception) {
        console.log(exception);
        // logger.error(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
};

exports.checkToken = async (req, res) => {
    const token = req.header("token");
    try {
        const authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            res.send(helper.createResponseWrapper({ token_data: authResult.token_data }, 0));
        } else {
            res.send(helper.createResponseWrapper({ token_data: null }, 1, 1, "Not Authenticate"));
        }
    }
    catch (exception) {
        logger.error(exception);
        res.send(helper.createResponseWrapper([], 1, 99, "An error has occurred, please contact system administrator."));
    }
}

exports.updatePassword = async (req, res) => {
    try {
        let requests = req.body;
        let token = req.header("token");
        let authResult = await helper.authenticateJWT(token);
        if (authResult.authenticated) {
            let currentDateTime = new Date();
            const results = await db.sequelize.query(
                `UPDATE package.ref_user_account SET password = PGP_SYM_ENCRYPT('${requests.password}'::text, '${process.env.PG_AES_KEY}'::text),
                updated_date = '${moment(currentDateTime).toISOString(false)}',
                updated_by = '${authResult.token_data.user_account_id}' 
                WHERE id = '${requests.id}' `,
                { type: db.sequelize.QueryTypes.UPDATE });

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