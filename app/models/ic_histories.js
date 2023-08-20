require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME_DEV
    , process.env.DB_USERNAME_DEV
    , process.env.DB_PASSWORD_DEV, {
    host: process.env.DB_SERVER_DEV,
    dialect: 'postgres'
});

const ic_histories = sequelize.define('ic_histories', {
    ihs_id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    ihs_monitor_id: { type: DataTypes.UUIDV4, allowNull: false },
    ihs_timestamp: { type: DataTypes.DATE, allowNull: false },
    ihs_power: { type: DataTypes.STRING(255), allowNull: false },
    ihs_energy: { type: DataTypes.STRING(255), allowNull: false },
    ihs_voltage: { type: DataTypes.STRING(255), allowNull: false },
    ihs_current: { type: DataTypes.STRING(255), allowNull: false },
    ihs_frequency: { type: DataTypes.STRING(255), allowNull: false }
}, {});

ic_histories.sync({ force: false }).then(() => {
    console.log('ic_histories table created or synchronized.');
}).catch(err => {
    console.error('Error syncing ic_histories table:', err);
});

module.exports = ic_histories;
