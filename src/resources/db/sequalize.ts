import * as Sequelize from 'sequelize';

const db = 'demo_tsnode_01';
const username = 'root';
const password = '';

export const sequelize = new Sequelize(db, username, password, {
    dialect: "mysql",
    host: 'localhost',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Database Connection successful.');
    })
    .catch(err => {
        console.error('Database Connection failed: ', err);
    });
