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

// require('dotenv').config();
// const { Sequelize, QueryTypes } = require('sequelize');
// const sequelize = new Sequelize(
//     process.env.DB_NAME_DEV
//     , process.env.DB_USERNAME_DEV
//     , process.env.DB_PASSWORD_DEV, {
//     host: process.env.DB_SERVER_DEV,
//     dialect: 'postgres'
// });

// const { ims, ihs, its } = require('../models');

class dashboardService {
    async getAllMonitor() {
        return new Promise(async (resolve, reject) => {

            var client = new Client(connectionConfig)
            await client.connect()

            try {
                
                if (monitorHistory != null) {
                    resolve(monitorHistory);
                } else {
                    reject(new Error("Monitor history not found"));
                }
            } catch (e) {
                console.error("Error in getAllMonitor:", e);
                reject(e);
            } finally {
                // await sequelize.close()
            }
        });
    }

    async getData(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const result = {
                    day: _queryDashboard.getDayById,
                    month: _queryDashboard.getMonthById,
                    year: _queryDashboard.getYearById
                }
                const res = await client.query(result[model.selectedFormatDate], [model.id, model.formattedDate]);
                
                // Transform the data
                const transformedData = transformData(res.rows);
    
                resolve(transformedData);
            } catch (error) {
                reject(new Error("Error: " + error.message));
            } finally {
                await client.end();
            }
        });
    }
    
    async transformData(data) {
        const transformedOutput = {};
        data.forEach(row => {
            const { ihs_monitor_id, ihs_voltage, ihs_current, ihs_frequency, ihs_energy, ihs_power } = row;
            if (!transformedOutput[ihs_monitor_id]) {
                transformedOutput[ihs_monitor_id] = {
                    ihs_monitor_id,
                    ihs_voltage: [],
                    ihs_current: [],
                    ihs_frequency: [],
                    ihs_energy: [],
                    ihs_power: []
                };
            }
            transformedOutput[ihs_monitor_id].ihs_voltage.push(parseFloat(ihs_voltage));
            transformedOutput[ihs_monitor_id].ihs_current.push(parseFloat(ihs_current));
            transformedOutput[ihs_monitor_id].ihs_frequency.push(parseFloat(ihs_frequency));
            transformedOutput[ihs_monitor_id].ihs_energy.push(parseFloat(ihs_energy));
            transformedOutput[ihs_monitor_id].ihs_power.push(parseFloat(ihs_power));
        });
    
        return Object.values(transformedOutput);
    }

    async getData(model) {
        return new Promise(async (resolve, reject) => {
            const client = new Client(connectionConfig);
            await client.connect();
            try {
                const result = {
                    day: _queryDashboard.getDayById,
                    month: _queryDashboard.getMonthById,
                    year: _queryDashboard.getYearById
                }
                const res = await client.query(result[model.selectedFormatDate], [model.id, model.formattedDate]);
                const rawData = res.rows;
                const transformedData = {
                    ihs_monitor_id: "",
                    voltage: [],
                    current: [],
                    frequency: [],
                    energy: [],
                    power: []
                };
                transformedData.ihs_monitor_id = rawData[0].ihs_monitor_id;
                rawData.forEach(row => {
                    const { ihs_monitor_id, ihs_voltage, ihs_current, ihs_frequency, ihs_energy, ihs_power } = row;
                    transformedData.voltage.push(ihs_voltage);
                    transformedData.current.push(ihs_current);
                    transformedData.frequency.push(ihs_frequency);
                    transformedData.energy.push(ihs_energy);
                    transformedData.power.push(ihs_power);
                });
                console.log(transformedData);
                resolve(transformedData);
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
                reject(new Error("Error in getDataById: " + error.message));
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
                reject(new Error("Error in getDataById: " + error.message));
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
                reject(new Error("Error in getDataById: " + error.message));
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
                const res = await client.query(_queryDashboard.getEntireEnergy, []);
                resolve(res.rows);
            } catch (error) {
                reject(new Error("Error in getDataById: " + error.message));
            } finally {
                await client.end();
            }
        });
    }

    async addMonitor(model) {
        return new Promise(async (resolve, reject) => {
            try {
                const replacements = [
                    model.id,
                    model.name,
                    model.location,
                    true,
                    true,
                    model.frequency_api,
                    model.remark,
                    model.detail,
                    model.cb,
                    new Date()
                ];
                
                await sequelize.query(_queryDashboard.add, { bind: replacements, type: QueryTypes.INSERT });
                
                resolve({ message: 'Monitor added successfully.' });
            } catch (e) {
                console.error("Error in addMonitor:", e);
                reject("An error occurred while adding the monitor.");
            }
        });
    }
    
    async fetchMonitorDataFromDB() {
        try {
            const client = new Client(connectionConfig);
            await client.connect();
            console.log('result.rows');
            try {
            const result = await client.query(_queryDashboard.getAllHistoryData);

            console.log("Retrieved Rows:");
            console.log(result.rows);
            
            return result.rows; 
            } catch (error) {
            console.error("Error executing query:", error);
            } finally {
            await client.end();
            }
        } catch (error) {
            console.error("Error connecting to the database:", error);
        }
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
