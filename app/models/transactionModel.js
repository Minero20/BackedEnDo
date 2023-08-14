require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
    process.env.DB_NAME_DEV
    , process.env.DB_USERNAME_DEV
    , process.env.DB_PASSWORD_DEV, {
    host: process.env.DB_SERVER_DEV,
    dialect: 'postgres'
});

const its = sequelize.define('ic_transactions', {
    its_monitor_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    its_monitor_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    its_monitor_location: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    its_in_use: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    its_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    its_monitor_frequency_api: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    its_remark: {
        type: DataTypes.STRING(1000)
    },
    its_detail: {
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    its_create_by: {
        type: DataTypes.STRING(1000)
    },
    its_create_at: {
        type: DataTypes.DATE
    },
    its_edit_by: {
        type: DataTypes.STRING(1000)
    },
    its_edit_at: {
        type: DataTypes.DATE
    },
    its_delete_by: {
        type: DataTypes.STRING(1000)
    },
    its_delete_at: {
        type: DataTypes.DATE
    }
}, {
    // Additional table options can be defined here
});

// Sync the model with the database (create the table if it doesn't exist)
its.sync({ force: false }).then(() => {
    console.log('ic_transactions table created or synchronized.');
}).catch(err => {
    console.error('Error syncing ic_transactions table:', err);
});

module.exports = its;
