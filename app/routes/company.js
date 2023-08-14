var express = require('express');
var router = express.Router();
var baseService = require('../service/baseService');
var authRouter = require('../routes/auth');
var _service = new baseService();
var _QueryCompany = require('../query/queryCompany.json');
var companyService = require('../service/companyService');
var _companyService = new companyService();
var logService = require('../service/logservice');
var _getUserIDByToken = authRouter.getUserIDByToken;
var _getAdminIDByToken = authRouter.getAdminIDByToken;
var _getPayload = authRouter.getPayload;
var _getCompanyIdByToken = authRouter.getCompanyIdByToken;
var _auth = authRouter.requireJWTAuth;

router.get('/', function (req, res, next) {
    return res.send('respond with a resource company');
});

router.get('/all', function (req, res, next) {
    _service.baseQuery(_QueryCompany.getAll).then(_res => {
        if (_res.rows.length > 0) {
            let temp = _res.rows;
            var para = _res.rows.map(m => m.id)
            _service.baseQueryWithParameter(_QueryCompany.getAllOEM, [para]).then(__res => {
                if (__res.rows.length > 0) {
                    temp = temp.map(m => {
                        m.oem = __res.rows.filter(f => f.company_id == m.id);
                        return m;
                    })
                }
                return res.status(200).json(temp)
            }).catch(e => {
                return res.status(400).send({
                    message: e.message
                })
            })

        } else {
            return res.status(200).json({})
        }

    }).catch(e => {
        return res.status(400).send({
            message: e.message
        })
    })
});

router.get('/findOEMByCompanyId', _auth, async (req, res, next) => {
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
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _service.baseQueryWithParameter(_QueryCompany.getOEMbyCompanyId,[req.query.id]).then(_res => {
        _log.activity.response = _res;
        return res.status(200).json(_res.rows)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})

router.post('/add', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _companyService.addNewCompany(req.body, admin_id).then(_res => {
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
})

router.post('/update', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.body.id) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _companyService.UpdateNewCompany(req.body, admin_id).then(_res => {
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
})

router.post('/setup', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.body.id) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _companyService.SetupCompany(req.body, admin_id).then(_res => {
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
})
router.get('/findSetupById', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _companyService.findSetupById(req.query.id).then(_res => {
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
})

router.get('/findById', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    var myCompanyId = _getCompanyIdByToken(token)
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id && myCompanyId != req.query.id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _companyService.findByIdCompany(req.query.id).then(_res => {
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
})

router.get('/del', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _companyService.delCompanyById(req.query.id,admin_id).then(_res => {
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
})

router.get('/getMasterCompany', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _service.baseQuery(_QueryCompany.getMasterCompany).then(_res => {
        _log.activity.response = _res;
        return res.status(200).json(_res.rows)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})

router.post('/addUser', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _companyService.addUser(req.body, admin_id).then(_res => {
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
})
router.post('/updateUser', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.body.id) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _companyService.updateUser(req.body, admin_id).then(_res => {
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
})

router.get('/findUserById', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
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
    
    if (!admin_id &&req.query.id!=user_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _companyService.findUserById(req.query.id,admin_id).then(_res => {
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
})
router.get('/delUser', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.id) {
        return res.status(404).send({
            message: "need parameter"
        })
    }
    _companyService.delUser(req.query.id,admin_id).then(_res => {
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
})

router.get('/getAllUser', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;

    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _companyService.getAllUser().then(_res => {
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
})

router.post('/filterUser', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;

    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    _companyService.filterUser(req.body).then(_res => {
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
})

router.get('/checkNameCompany', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.name) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _service.baseQueryWithParameter(_QueryCompany.checkNameCompany, [req.query.name]).then(_res => {
        _log.activity.response = _res;
        return res.status(200).send({
            message: (_res.rows.length > 0) ? true : false
        })
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})

router.get('/checkUserName', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.name) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _service.baseQueryWithParameter(_QueryCompany.checkUsername, [req.query.name]).then(_res => {
        _log.activity.response = _res;
        return res.status(200).send((_res.rows.length > 0) ? true : false)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})
router.get('/checkEmail', _auth, async (req, res, next) => {
    var token = req.headers.authorization;
    var admin_id = _getAdminIDByToken(token);
    let _logService = new logService();
    let _log = _logService.model;
    _log.activity.parameter = {
        "body": req.body,
        "query": req.query,
        "header": req.headers,
        "payload": _getPayload(token)
    };
    _log.activity.path = req.baseUrl + req.path;
    if (!admin_id) {
        return res.status(400).send({
            message: "need correct level"
        })
    }
    if (!req.query.name) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _service.baseQueryWithParameter(_QueryCompany.checkEmail, [req.query.name]).then(_res => {
        _log.activity.response = _res;
        return res.status(200).send((_res.rows.length > 0) ? true : false)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})

router.get('/getCapacityFactory', _auth, async (req, res, next) => {
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
    if (!req.query.id) {
        return res.status(400).send({
            message: "need parameter"
        })
    }
    _service.baseQueryWithParameter(_QueryCompany.getCapacityFactory, [req.query.id]).then(_res => {
        _log.activity.response = _res;
        var factory_capacity= ((_res.rows.length > 0) ? _res.rows[0].factory_capacity : 0)||0;
        return res.send(""+factory_capacity)
    }).catch(_error => {
        _log.activity.error = _error.message
        _log.activity.status = false;
        return res.status(400).send({
            message: _error.message
        })
    }).finally(() => {
        _logService.log(_log).then(res => console.log("save log")).catch(e => console.log(e.message))
    })
})


router.get('/viewOemByUserId', _auth, async (req, res, next) => {
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
   
    _companyService.getviewOemByUserId(user_id).then(_res => {
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
})



router.get('/findOEMByCompanyIdAndUser', _auth, async (req, res, next) => {
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
  
        _companyService.findOEMByCompanyIdAndUser(req.query.user,user_id).then(_res => {
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
})

module.exports = router;