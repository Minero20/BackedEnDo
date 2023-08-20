var baseService = require('./baseService');
var _baseService = new baseService();
const {
    Client,
    Pool
} = require('pg')
const connectionSetting = require('../dbconnect');
const connectionPool = connectionSetting.connectionPool;
const connectionConfig = connectionSetting.config;
const _queryDashboard = require('../query/queryDashboard.json');
var moment = require("moment");
var {
    v4: uuidv4
} = require('uuid');
var CryptoJS = require("crypto-js");
var appSetting = require("../appSetting.js");
const SECRET = appSetting.jwtSecret; 
const cryptoOption = require("../cryptoSetting");
const { config } = require('../dbconnect');
const { mode } = require('crypto-js');
const { query } = require('express');
const { DataTypes } = require('sequelize');

const queryDate = {
    day: _queryDashboard.getDayById,
    month: _queryDashboard.getMonthById,
    year: _queryDashboard.getYearById
}

class dashboardService {
    async transformData(data) {
        const transformedOutput = {};
        data.forEach(row => {
            const { ims_monitor_id, ihs_voltage, ihs_current, ihs_frequency, ihs_energy, ihs_power } = row;
            if (!transformedOutput[ims_monitor_id]) {
                transformedOutput[ims_monitor_id] = {
                    ihs_voltage: [],
                    ihs_current: [],
                    ihs_frequency: [],
                    ihs_energy: [],
                    ihs_power: []
                };
            }
            transformedOutput[ims_monitor_id].ihs_voltage.push(parseFloat(ihs_voltage));
            transformedOutput[ims_monitor_id].ihs_current.push(parseFloat(ihs_current));
            transformedOutput[ims_monitor_id].ihs_frequency.push(parseFloat(ihs_frequency));
            transformedOutput[ims_monitor_id].ihs_energy.push(parseFloat(ihs_energy));
            transformedOutput[ims_monitor_id].ihs_power.push(parseFloat(ihs_power));
        });
        return transformedOutput;
    }

    async getSixMostCurrentConsume() {
            return new Promise(async (resolve, reject) => {
                const client = new Client(connectionConfig);
                await client.connect();
                try {   
                    const res = await client.query(_queryDashboard.getSixMostCurrentConsume); 
                    const result = this.transformData(res.rows);
                    resolve(result);
                } catch (error) {
                    reject(new Error("Error: " + error.message));
                } finally {
                    await client.end();
                }
            });
        }

    async getData(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            // console.log(model.id, model.formattedDate, model.selectedFormatDate);
            try {
                const res = await client.query(queryDate[model.selectedFormatDate], [model.id, model.formattedDate]);
                const result = this.transformData(res.rows);
                resolve(result);
                // resolve(res.rows);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }
    
    async getDayTotal(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const res = await client.query(_queryDashboard.getDayTotal, [model.formattedDate]);
                resolve(res.rows);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }

    async getMonthTotal(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const res = await client.query(_queryDashboard.getMonthTotal, [model.formattedDate]);
                resolve(res.rows);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }

    async getYearTotal(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const res = await client.query(_queryDashboard.getYearTotal, [model.formattedDate]);
                resolve(res.rows);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }

    async getEntireEnergy() {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const res = await client.query(_queryDashboard.getEntireEnergy);
                resolve(res.rows);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }
    
    async fetchApiData() {
        try {
            var myHeaders = new Headers();
            myHeaders.append("common", "{\"boxId\":\"966\",\"groupId\":\"254032\",\"pageSize\":\"21\",\"pageIndex\":\"1\",\"sid\":\"79d0844e1f584b04b86cd90a5c3f96b6\",\"comid\":\"128\",\"compvtkey\":\"7e421dd30a394d74b7b9c079e67e272c\",\"ts\":\"1691592102\",\"sign\":\"998990accb79387f76ac4a8578cbfdf6\"}");

            var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
            };

            const response = await fetch("http://api.asean.v-box.net/box-data/api/we-data/realcfgs?boxId=966&groupId=254032&pageSize=21&pageIndex=1", requestOptions)

            const result = await response.text();
            return result;
        } catch (error) {
            console.error("Error fetching real configs:", error);
            throw error;
        }
    }   
}
module.exports = dashboardService
