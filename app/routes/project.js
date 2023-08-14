const express = require('express');
const router = express.Router();
const baseService = require('../service/baseService');
const _baseService = new baseService();
const authRouter = require('../routes/auth');
const logService = require('../service/logservice');
const XLSX = require('xlsx');
const projectService = require('../service/projectService');
const _projectService = new projectService();
const _QueryProject = require('../query/queryProject.json');

var _getUserIDByToken = authRouter.getUserIDByToken;
var _getPayload = authRouter.getPayload;
var _auth = authRouter.requireJWTAuth;

var mime = require('mime');
var multiparty = require('multiparty');

router.get('/', function (req, res, next) {
    return res.send('respond with a resource project');
});


router.post('/filter', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var user_id = _getUserIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!user_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _projectService.filterProject(req.body).then(_res => {
        _log.activity.response = _res;
        return res.status(200).json(_res)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
});

module.exports = router;