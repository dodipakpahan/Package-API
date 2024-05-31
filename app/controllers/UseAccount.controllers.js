const jwt = require("jsonwebtoken");
const db = require("../models");
const UserAccount = db.UserAccount;
const fs = require("fs");
const Op = db.Sequelize.Op;
const helper = require("../helper/ApplicationHelper");
const { Sequelize } = require("sequelize");


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
                },
                    {
                        fields: ["username", "password", "email",
                            "created_date",  "created_by", 
                            "is_active",  "user_role"]
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
                    user_role: requests.user_role,                },
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