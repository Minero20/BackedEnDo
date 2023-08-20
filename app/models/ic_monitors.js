require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME_DEV
    , process.env.DB_USERNAME_DEV
    , process.env.DB_PASSWORD_DEV, {
    host: process.env.DB_SERVER_DEV,
    dialect: 'postgres'
});

const ic_monitors = sequelize.define('ic_monitors', {
    ims_id: { type: Sequelize.UUID, primaryKey: true, defaultValue: Sequelize.UUIDV4 },
    ims_monitor_id: { type: DataTypes.INTEGER, allowNull: false },
    ims_name: { type: DataTypes.STRING(255), allowNull: false },
    ims_location: { type: DataTypes.STRING(1000), allowNull: false },
    ims_in_use: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ims_status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    ims_frequency_api: { type: DataTypes.INTEGER, allowNull: false },
    ims_remark: { type: DataTypes.STRING(1000) },
    ims_detail: { type: DataTypes.STRING(1000), allowNull: false },
    ims_create_by: { type: DataTypes.STRING(1000) },
    ims_create_at: { type: DataTypes.DATE },
    ims_edit_by: { type: DataTypes.STRING(1000) },
    ims_edit_at: { type: DataTypes.DATE },
    ims_delete_by: { type: DataTypes.STRING(1000) },
    ims_delete_at: { type: DataTypes.DATE }
}, { sequelize });

ic_monitors.sync({ force: false }).then(() => {
    console.log('ic_monitors table created or synchronized.');
}).catch(err => {
    console.error('Error syncing ic_monitors table:', err);
});

module.exports = ic_monitors;
