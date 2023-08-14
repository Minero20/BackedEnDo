var CryptoJS = require("crypto-js");
var appSetting = require("./appSetting.js");
const SECRET = appSetting.jwtSecret;

const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

const encrypt = (wording) => {
    return CryptoJS.AES.encrypt(wording, SECRET,{iv:iv}).toString()
}
const decrypt=(wording)=>{
    return  CryptoJS.AES.decrypt(wording, SECRET,{iv:iv}).toString(CryptoJS.enc.Utf8);
}



module.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}