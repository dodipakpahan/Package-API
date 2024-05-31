const db = require("../models");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const Op = db.Sequelize.Op;

const winston = require('winston');
const logConfiguration = {
    'transports': [
        //Debug
        new winston.transports.Console(),
        new winston.transports.File({
            filename: "./log/system.log"
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'MMM-DD-YYYY HH:mm:ss'
        }),
        winston.format.printf(info => `${info.level}: ${info.label}: ${[info.timestamp]}: ${info.message}`),
    )
};

const logger = winston.createLogger(logConfiguration);

exports.createResponseWrapper = (respData, statusCode, errorCode = 0, errorMessage = 0) => {
    let response = {
        success: statusCode === 0 ? true : false,
        error_code: errorCode,
        error_message: errorMessage,
        data: respData
    };
    return (response);
};

exports.createLoginHistory = async (userAccountId, loginIpAddress) => {
    const LoginHistory = db.LoginHistory;
    const hist = LoginHistory.build({
        user_account_id: userAccountId,
        ip_address: loginIpAddress
    });
    await hist.save();
};

exports.authenticateJWT = async (token) => {
    let returnObj = {
        authenticated: false,
        token_data: {}
    }

    try {
        const JWTToken = db.JWTToken;
        const res = await JWTToken.findAll({
            where: {
                jwt_token: token,
                expires_on: {
                    [Op.gt]: moment(new Date())
                },
                is_active: true
            }
        });
        if (res.length > 0) {
            const decodedToken = jwt.decode(res[0].jwt_token);
            returnObj.authenticated = true;
            returnObj.token_data.user_account_id = decodedToken.user_account_id;
            returnObj.token_data.email = decodedToken.email;
            returnObj.token_data.issued_at = new Date(decodedToken.iat * 1000).toUTCString();
            returnObj.token_data.expires_on = new Date(decodedToken.exp * 1000).toUTCString();
            return (returnObj);
        }
        return (returnObj);
    }
    catch (exception) {
        logger.error(exception);
        return (returnObj);
    }
};

exports.createUpdateJWT = async (userAccountId, email, singleLogin = false) => {
    try {
        const JWTToken = db.JWTToken;

        if (singleLogin) {
            const existingToken = JWTToken.findAll({
                where: {
                    user_account_id: userAccountId
                }
            });
            console.log(existingToken);
            await JWTToken.destroy({
                where: {
                    user_account_id: userAccountId
                }
            });
        }

        const token = jwt.sign(
            { user_account_id: userAccountId, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5y",
            }
        );
        const decodedToken = jwt.decode(token);
        const newToken = JWTToken.build({
            user_account_id: userAccountId,
            jwt_token: token,
            expires_on: new Date(decodedToken.exp * 1000).toUTCString(),
            is_active: true
        });
        await newToken.save();
        return (token);
    }
    catch (exception) {
        logger.error(exception);
        return (null);
    }

};

exports.dec2bin = (dec) => {
    return (dec >>> 0).toString(2).padStart(16, '0');
};

