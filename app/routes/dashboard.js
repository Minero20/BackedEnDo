// var baseService = require('../service/baseService');
// var authRouter = require('../routes/auth');
// var _service = new baseService();
// var _QueryCompany = require('../query/queryCompany.json');
const express = require('express');
const router = express.Router();
const dashboardService = require('../service/dashboardService');
const _dashboardService = new dashboardService();

router.post('/', async function (req, res, next) {
    try {
        const monitorData = await _dashboardService.getAllMonitor();
        return res.json(monitorData); 
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred.' });
    }
});

// router.post('/:id', async function (req, res, next) {
//     try {
//         const id = req.params.id;
//         const monitorData = await _dashboardService.getMonito+rById(id);
//         return res.json(monitorData); 
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// });

router.post('/add', async (req, res) => {
    try {
        const monitorData = req.body;
        const result = await _dashboardService.addMonitor(monitorData);
        return res.json(result);
    } catch (error) {
        console.error('Error adding monitor:', error);
        return res.status(500).json({ error: 'An error occurred while adding the monitor.' });
    }
});

router.get("/getDataById", async function (req, res, next) {                         
    await _dashboardService.getData(req.query).then((_res) => { 
    return res.status(200).json(_res)
    }).catch(e => {
    return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
});

router.get("/getDayEnergy", async function (req, res, next) {
    // console.log(req.query.selectedFormatDate);
    await _dashboardService.getDayTotal(req.query).then((_res) => { 
    return res.status(200).json(_res)
    }).catch(e => {
    return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
});

router.get("/getMonthEnergy", async function (req, res, next) {
    // console.log(req.query.selectedFormatDate);
    await _dashboardService.getMonthTotal(req.query).then((_res) => { 
    return res.status(200).json(_res)
    }).catch(e => {
    return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
});

router.get("/getYearEnergy", async function (req, res, next) {
    // console.log(req.query.selectedFormatDate);
    await _dashboardService.getYearTotal(req.query).then((_res) => { 
    return res.status(200).json(_res)
    }).catch(e => {
    return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
});

router.get("/getEntireEnergy", async function (req, res, next) {
    // console.log(req.query.selectedFormatDate);
    await _dashboardService.getEntireEnergy().then((_res) => { 
    return res.status(200).json(_res)
    }).catch(e => {
    return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
});

router.post('/db', async function (req, res, next) {
    try {
        const monitorData = await _dashboardService.fetchMonitorDataFromDB();
        return res.json(monitorData); // Send retrieved data as JSON response
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred.' });
    }
});

router.post('/api', async function (req, res, next) {
try {
    const monitorData = await _dashboardService.fetchApiData();
    return res.json(monitorData); // Send retrieved data as JSON response
} catch (error) {
    return res.status(500).json({ error: 'An error occurred.' });
}
});

module.exports = router;
