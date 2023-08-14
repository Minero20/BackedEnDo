var baseService = require("./baseService");
var _baseService = new baseService();
const _config = require("../appSetting.js");
const { Client, Pool } = require("pg");
const connectionSetting = require("../dbconnect");
const connectionPool = connectionSetting.connectionPool;
const connectionConfig = connectionSetting.config;
const _QueryProject = require("../query/queryProject.json");
var moment = require("moment");
var { v4: uuidv4 } = require("uuid");
const material_unit_id = _config.fixData.material_unit;

class projectService {


  async filterProject(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
           // console.log(model);
          /*   let project_name = model.project_name ? model.project_name : null,
                company_id = model.company_id ? model.company_id : null;
                
            var temp = await client.query(_QueryProject.filter, [
              project_name,
              model.oem_id,
              company_id
            ]); */
        /*     console.log(temp); */
            resolve("HEllo World");
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
         /*  console.log(e); */
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  
}


module.exports = projectService;
