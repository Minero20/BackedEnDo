var express = require('express');
var router = express.Router();
const jwt = require("jwt-simple");
var moment = require("moment");
var JwtSetting = require('../jwtSetting');
const passport = require("passport");
passport.use(JwtSetting.jwtAuth);
const cryptoOption = require("../cryptoSetting");

const TokenEncode = (payload) => {
    return jwt.encode(payload, JwtSetting.SECRET);
};
const TokenDecode = (token) => {
    return jwt.decode(token, JwtSetting.SECRET);
}
const getUserIDByToken = (token) => {
    let payload = TokenDecode(token);
    if (payload.fup && payload.sys == "c") {
        return payload.fup;
    }
    return null;
}
const getAdminIDByToken = (token) => {
    let payload = TokenDecode(token);
    if (payload.fup && payload.sys == "s") {
        return payload.fup;
    }
    return null;
}
const getCompanyIdByToken = (token) => {
    let payload = TokenDecode(token);
    if (payload.com && payload.sys == "c") {
        return payload.com;
    }
    return null;
} 
const getPayload = (token) => {
    return TokenDecode(token);
}
const requireJWTAuth = passport.authenticate("jwt", {
    session: false
});



module.exports = {
    router: router,
    requireJWTAuth: requireJWTAuth,
    getUserIDByToken: getUserIDByToken,
    getAdminIDByToken: getAdminIDByToken,
    getPayload: getPayload,
    getCompanyIdByToken:getCompanyIdByToken
};