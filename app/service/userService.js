var baseService = require("./baseService");
var _baseService = new baseService();
var _QueryLogin = require("../query/queryLogin.json");
var _QueryUser = require("../query/queryUser.json");
const _config = require("../appSetting.js");
const { Client, Pool } = require("pg");
const connectionSetting = require("../dbconnect");
const connectionPool = connectionSetting.connectionPool;
const connectionConfig = connectionSetting.config;
var moment = require("moment");
var { v4: uuidv4 } = require("uuid");
const cryptoOption = require("../cryptoSetting");
var companyService = require("../service/companyService");
var _companyService = new companyService();

class userService {
  async checkAuth(user) {
    return _baseService.baseQueryWithParameter(_QueryLogin.getByUser, [user]);
  }
  async updateAdminToken(token, token_create, token_exp, user) {
    return _baseService.baseQueryWithParameter(_QueryLogin.updateAdminToken, [
      token,
      token_create,
      token_exp,
      user,
    ]);
  }
  async updateUserToken(token, token_create, token_exp, user) {
    return _baseService.baseQueryWithParameter(_QueryLogin.updateUserToken, [
      token,
      token_create,
      token_exp,
      user,
    ]);
  }
  async checkAdminAuth(id) {
    return _baseService.baseQueryWithParameter(_QueryLogin.getByAdmin, [id]);
  }

  async getUserById(user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            var data = await client.query(_QueryUser.getUserById, [user_id]);
            if (data.rows.length > 0) {
              data.rows[0].statusLine = false;
              var lineByUser = await client.query(_QueryUser.getLineByUserId, [
                data.rows[0].id,
              ]);
              if (lineByUser.rows.length > 0) {
                data.rows[0].lineByUser = lineByUser.rows[0];
                data.rows[0].statusLine = true;
              }
            }

            console.log(data.rows[0]);
            resolve(data.rows[0]);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async update(model, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            console.log(model);

            await client.query(_QueryUser.update, [
              user_id,
              model.name,
              model.sirname,
              model.email,
              model.mobile1,
              model.mobile2,
              model.detail,
              model.user_profile,
              model.user_profile_name,
              model.user_profile_path,
            ]);

            resolve(true);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async changePS(model, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            // console.log(cryptoOption.encrypt(model.old_pass));
            var check = await client.query(_QueryUser.checkPS, [user_id]);
            /*    console.log(cryptoOption.decrypt(check.rows[0].password))   
               console.log(model.old_pass)   
   
               console.log(check.rows[0].password)
               console.log(cryptoOption.encrypt(model.old_pass))   */

            if (
              cryptoOption.decrypt(check.rows[0].password) === model.old_pass
            ) {
              /*    console.log("รหัสเดิม ถูกต้อง") */
              await client.query(_QueryUser.changePS, [
                user_id,
                cryptoOption.encrypt(model.new_pass),
              ]);
              resolve(true);
            } else {
              throw Error("รหัสผ่านเดิมไม่ถูกต้อง !!!");
            }
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async checkGenerateAccount(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            let list_item = [];

            for (let item of model.emp_list) {
              let item_list = {};

              var check = await client.query(_QueryUser.checkGenAccount, [
                item,
              ]);

              if (check.rows.length > 0) {
                item_list.id = item;
                item_list.isGenAccount = true;
                item_list.username = check.rows[0].username;
                // console.log("hava");
              } else {
                item_list.id = item;
                item_list.isGenAccount = false;
                item_list.username = "";
              }

              list_item.push(item_list);
            }

            resolve(list_item);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async Generate_Account(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          let client = new Client(connectionConfig);
          await client.connect();
          try {
            // console.log("is_gen", model);
            for (let item of model.emp_list) {
              if (
                item.emp_name_eng !== "" &&
                item.emp_name_eng !== null &&
                item.emp_name_eng !== undefined
              ) {
                let first_name = item.emp_name_eng.split(" ")[0] || null;
                let last_name = item.emp_name_eng.split(" ")[1] || null;

                let user_name = `${
                  last_name ? last_name[0].toLowerCase() : ""
                }.${first_name ? first_name.toLowerCase() : ""}`;
                let passDefault = "123456";

                let checkEmpuser = await client.query(_QueryUser.checkEmpUser, [
                  user_name,
                ]);

                if (checkEmpuser.rowCount > 0) {
                  user_name = `${
                    last_name
                      ? last_name.substring(0, checkEmpuser.rowCount + 1).toLowerCase()
                      : ""
                  }.${first_name ? first_name.toLowerCase() : ""}`;
                  // console.log(last_name.substring(0, checkEmpuser.rowCount + 1).toLowerCase(), user_name);
                }

                // let checkEmpuser = await client.query(_QueryUser.checkEmpUser, ["emp_user"]);
                // let number = 1;
                // console.log(checkEmpuser.rows)
                // let user_name = "emp_user" + number;

                // if (checkEmpuser.rows.length > 0) {
                //   console.log(checkEmpuser.rows[checkEmpuser.rows.length - 1]);
                //   let count = checkEmpuser.rows[checkEmpuser.rows.length - 1].username.split('emp_user')[1];
                //   // console.log(count);
                //   user_name = "emp_user" + parseInt(parseInt(count) + 1);
                // }
                // console.log(user_name);
                /* throw new Error("break"); */

                let configMenuDefault = await client.query(
                  _QueryUser.getConfigMenuDefault,
                  [model.company_id, model.oem_id]
                );

                let configFeatureDefault = await client.query(
                  _QueryUser.getConfigFeatureDefault,
                  [model.company_id, model.oem_id]
                );

                await client.query(_QueryUser.AddIdenUser, [
                  item.emp_id,
                  model.company_id,
                  "c0fd1c11-da3e-439d-b3c3-54b4a187628d", // admin_id,
                  first_name || null, // firstname
                  last_name || null, // lastname
                  user_name || null, // username
                  item.emp_email_company || null, // mail,
                  cryptoOption.encrypt(passDefault), // password
                  item.emp_mobile || null, // เบอร์โทรศัพท์มือถือ
                  null, // เบอร์โทรศัพท์...
                  null, // รายละเอียด
                  true, // is_active
                  null, // user_profile
                  null, // token
                  null, // token_create
                  null, // token_expired
                  new Date(), // create_date
                  true, // is_use
                  null, // user_profile_name
                  null, // user_profile_path
                  null, // is_passchange
                ]);

                await client.query(_QueryUser.setPermissionOem, [
                  item.emp_id,
                  model.oem_id,
                  true,
                ]);

                for (let item1 of configMenuDefault.rows) {
                  await client.query(_QueryUser.setPermissionMenu, [
                    item1.menu_id || null,
                    true,
                    item.emp_id,
                  ]);
                }

                for (let item2 of configFeatureDefault.rows) {
                  await client.query(_QueryUser.setPermissionMenu, [
                    item.emp_id,
                    true,
                    item2.feature_id || null,
                  ]);
                }
              }
            }

            resolve(true);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async checkInfoEmpLineByIdLine(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            let status = "";
            console.log("checkInfoEmpLineByIdLine-------", model.userId);
            const temp = await client.query(
              _QueryUser.checkInfoEmpLineByIdLine,
              [model.userId]
            );
            console.log("temp---", temp.rows.length);
            if (temp.rows.length === 0) {
              resolve(false);
            }
            const temp1 = await client.query(
              _QueryUser.checkIdentityEmpLineById,
              [temp.rows[0].user_id]
            );
            if (temp1.rows.length === 0) {
              resolve(false);
            }
            status = "login success";
            const username = temp1.rows[0].username;
            const password = cryptoOption.decrypt(temp1.rows[0].password);
            const data = {
              username,
              password,
              status,
            };

            const data1 = await this.loginEmpPassLineOA(data);
            console.log("data1", data1);

            resolve(data1);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async loginEmpPassLineOA(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            let successStatus = [];
            let errorStatus = [];
            if (model.username && model.password) {
              await _baseService
                .baseQueryWithParameter(_QueryLogin.checkUserPassword, [
                  model.username,
                ])
                .then(async (_res) => {
                  if (_res.rows.length > 0) {
                    if (
                      model.password ==
                      cryptoOption.decrypt(_res.rows[0].password)
                    ) {
                      await _companyService
                        .findByIdCompany(_res.rows[0].company_id)
                        .then(async (_res2) => {
                          console.log(
                            cryptoOption.decrypt(_res.rows[0].password)
                          );

                          var iat = moment(_res2.now);
                          var exp = moment(new Date()).add(7, "days"); // exp:moment(new Date()).add(7,'days').unix()//days,hours,minutes
                          var expire_date = _res2.expire_date;
                          var exp2 = moment(
                            moment(expire_date).unix() - iat.unix()
                          );

                          var total_day = Math.round(
                            (expire_date - iat) / (1000 * 60 * 60 * 24)
                          );
                          var total_hours = Math.round(
                            (expire_date - iat) / (1000 * 60 * 60)
                          );
                          var total_minute = Math.round(
                            (expire_date - iat) / (1000 * 60)
                          );
                          var balance_day = exp2 / 3600 / 24;

                          let unix_timestamp =
                            moment(expire_date).unix() - iat.unix();

                          var date = new Date(unix_timestamp * 1000);

                          var hours = date.getHours();

                          var minutes = "0" + date.getMinutes();

                          var seconds = "0" + date.getSeconds();

                          var formattedTime =
                            total_day +
                            " วัน " +
                            hours +
                            " ชั่วโมง " +
                            minutes.substr(-2) +
                            " นาที"; /* + seconds.substr(-2) */

                          console.log(
                            "คงเหลือ : " +
                              formattedTime +
                              " " +
                              seconds.substr(-2) +
                              " วินาที"
                          );

                          if (exp2 > 0) {
                            //อายุการใช้งานต่ำกว่า 30 วัน
                            if (balance_day <= 30 && balance_day > 29) {
                              console.log(
                                "อายุการใช้งานใกล้จะหมด 30  =>",
                                balance_day
                              );
                            }
                            //อายุการใช้งานต่ำกว่า 7 วัน
                            if (balance_day <= 7) {
                              console.log(
                                "อายุการใช้งานใกล้จะหมด < 7  =>",
                                balance_day
                              );
                            }
                            /*   if(balance_day <= 24){
                              console.log("อายุการใช้งานคงเหลือน่อยกว่า 1 วัน", balance_day)
                          } */
                          } else {
                            console.log("หมดอายุการใช้งาน", exp2);
                          }
                          const payload = {
                            sub: model.username,
                            fup: _res.rows[0].id,
                            com: _res.rows[0].company_id,
                            sys: "c",
                            iat: iat.unix(),
                            exp: exp.unix(),
                            exp_date: moment(expire_date).format(
                              "วันที่ DD-MM-yyyy เวลา HH:mm:ss"
                            ),
                            balance_time: balance_day,
                            balance_day: formattedTime,
                            inform: _res2.config.inform,
                            status_inform: _res2.config.status_inform,
                          };

                          // var token = jwt.encode(payload, JwtSetting.SECRET);
                          // const token = this.TokenEncode(payload);
                          console.log(
                            "_res before updateUserToken",
                            _res,
                            model
                          );
                          await this.updateUserToken(
                            _res.rows[0].token,
                            iat,
                            exp,
                            model.username
                          )
                            .then((__res) => {
                              successStatus.push({
                                message: "login success",
                                iat: iat,
                                exp: exp,
                                token: _res.rows[0].token,
                                username: model.username,
                                status: model.status,
                              });
                            })
                            .catch((e) => {
                              console.log("e", e);
                              errorStatus.push({
                                message: "login fail : Try again",
                              });
                            });
                        });
                    } else {
                      successStatus.push({
                        message: "login fail : Wrong username or password",
                      });
                    }
                  } else {
                    successStatus.push({
                      message: "login fail : Wrong username or password",
                    });
                  }
                })
                .catch((_error) => {
                  errorStatus.push({
                    message: _error.message,
                  });
                });
            } else {
              successStatus.push({
                message: "login fail : Wrong username or password",
              });
            }
            console.log("errorStatus.length", errorStatus);
            if (errorStatus.length > 0) {
              throw Error(errorStatus);
            }

            resolve(successStatus);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async saveLineApi(model) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            console.log("model in save line api", model);
            let status = "";
            const User = await client.query(_QueryUser.getEmployee, [
              model.user,
            ]);
            console.log(User.rows);

            const Line = await client.query(_QueryUser.getLineByUserId, [
              model.user,
            ]);
            if (Line.rows.length === 0) {
              await client.query(_QueryUser.saveLineApi, [
                uuidv4(),
                User.rows[0].id || null,
                User.rows[0].username || null,
                User.rows[0].password || null,
                User.rows[0].id || null,
                new Date(),
                model.userId || null,
                model.pictureUrl || null,
                model.displayName || null,
                model.idToken || null,
              ]);
              status = "เชื่อมข้อมูล Line สำเร็จ";
            } else {
              await client.query(_QueryUser.updateLineApi, [
                Line.rows[0].id,
                User.rows[0].id || null,
                User.rows[0].username || null,
                User.rows[0].password || null,
                User.rows[0].id || null,
                new Date(),
                model.userId || null,
                model.pictureUrl || null,
                model.displayName || null,
                model.idToken || null,
              ]);
              status = "อัพเดทข้อมูล Line สำเร็จ";
            }

            const username = User.rows[0].username;
            const password = cryptoOption.decrypt(User.rows[0].password);
            const data = {
              username,
              password,
              status,
            };

            const data1 = await this.loginEmpPassLineOA(data);
            console.log("data1", data1);

            resolve(data1);
          } catch (e) {
            reject(e);
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async checkGenerateAccountHR(id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            let item = {};
            var check = await client.query(_QueryUser.checkGenAccount, [id]);
            // console.log("check", check.rows);
            if (check.rows.length > 0) {
              item.isGenAccount = true;
              item.username = check.rows[0].username;
            } else {
              item.isGenAccount = false;
              item.username = "";
            }
            // console.log("item", item);

            resolve(item);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async resetPassword(id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            await client.query(_QueryUser.changePS, [
              id,
              cryptoOption.encrypt("123456"),
            ]);
            resolve(true);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  async updateStatusUsingOfUser(model, user_id) {
    return new Promise(async (resolve, reject) => {
      try {
        (async () => {
          var client = new Client(connectionConfig);
          await client.connect();
          try {
            console.log("model------>", model, user_id);
            // _QueryUser.update
            await client.query(_QueryUser.updateStatusUser, [
              model.id,
              model.is_use ? true : false,
              model.is_use ? true : false,
            ]);

            resolve(true);
          } catch (e) {
            reject(e);
          } finally {
            await client.end();
          }
        })().catch((e) => {
          console.log(e);
          throw Error(e);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
module.exports = userService;
