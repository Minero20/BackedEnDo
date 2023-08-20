const express = require('express');
const router = express.Router();
const dashboardService = require('../service/dashboardService');
const _dashboardService = new dashboardService();

router.get('/', async function (req, res, next) {
    await _dashboardService.getSixMostCurrentConsume().then((_res) => { 
        return res.status(200).json(_res)
    }).catch(e => {
        return res.status(404).send({
        message: e.message
    })
    }).finally(() => {
        console.log('เย้ๆๆๆๆ ได้ย้าหู้');
    })
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

router.post('/api', async function (req, res, next) {
try {
    const monitorData = await _dashboardService.fetchApiData();
    return res.json(monitorData); // Send retrieved data as JSON response
} catch (error) {
    return res.status(500).json({ error: 'An error occurred.' });
}
});

module.exports = router;
