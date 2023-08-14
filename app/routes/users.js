var express = require('express');
var router = express.Router();
var baseService = require('../service/baseService');
var _baseService = new baseService();
const _QueryLogin = require('../query/queryLogin.json');

const authRouter = require('../routes/auth');
const logService = require('../service/logservice');
const XLSX = require('xlsx');
const userService = require('../service/userService');
const _userService = new userService();
var _getUserIDByToken = authRouter.getUserIDByToken;
var _getPayload = authRouter.getPayload;
var _auth = authRouter.requireJWTAuth;


router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/q', function (req, res, next) {
    res.send({ "aa": "a", "b": "bbbbbbcc" });
});

router.get('/getuser', function (req, res, next) {
    _baseService.selectAll('login').then(_res => {
        res.status(200).json(_res.rows)
    }).catch(_error => {
        res.status(400).send({ message: _error.message })
    })

});
router.get('/getuser2', function (req, res, next) {
    _baseService.baseQueryWithParameter(_QueryLogin.getById, [1]).then(_res => {
        res.status(200).json(_res)
    }).catch(_error => {
        res.status(400).send({ message: _error.message })
    })

});


router.get('/getUserById', _auth, async (req, res, next) => {

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
    _userService.getUserById(user_id).then(_res => {
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


router.post('/update', _auth, async (req, res, next) => {

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
    _userService.update(req.body, user_id).then(_res => {
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


router.post('/changePS', _auth, async (req, res, next) => {

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
    _userService.changePS(req.body, user_id).then(_res => {
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


router.post('/checkGenerateAccount', _auth, async (req, res, next) => {

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
    _userService.checkGenerateAccount(req.body).then(_res => {
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


router.post('/Generate_Account', _auth, async (req, res, next) => {

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
    _userService.Generate_Account(req.body).then(_res => {
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

router.post('/checkInfoEmpLineApi', async (req, res, next) => {

    // var token = req.headers.authorization;
    // var user_id = _getUserIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;

    console.log('req.body', req.body);

    // _log.activity.parameter = {
    //     "body": req.body,
    //     "query": req.query,
    //     "header": req.headers,
    //     "payload": _getPayload(token)
    // };
    // _log.activity.path = req.baseUrl + req.path;
    // if (!user_id) {
    //     return res.status(400).send({
    //         message: "need correct level"
    //     })
    // }

    _userService.checkInfoEmpLineByIdLine(req.body).then(_res => {
        _log.activity.response = _res;
        return res.status(200).json(_res);
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

router.post('/saveLineApi', async (req, res, next) => {
    let _logService = new logService();
    let _log = _logService.model;

    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": ""
    };
    _log.activity.path = req.baseUrl + req.path;

    _userService.saveLineApi(req.body).then(_res => {
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

router.get('/checkGenerateAccountHR', _auth, async (req, res, next) => {

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
    _userService.checkGenerateAccountHR(req.query.id).then(_res => {
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

router.get('/resetPassword', _auth, async (req, res, next) => {
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
    _userService.resetPassword(req.query.id).then(_res => {
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

router.post('/updateStatusUsingOfUser', _auth, async (req, res, next) => {

    var token = req.headers.authorization;
    var user_id = _getUserIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    console.log('check kkkkkkkkkkkk');
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
    } // updateStatusUsingOfUser
    _userService.updateStatusUsingOfUser(req.body, user_id).then(_res => {
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
