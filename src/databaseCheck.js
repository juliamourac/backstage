const { pool, userPool } = require('./db');
const LOG = require('./utils/Log');
const config = require('./config');

//check if database exists
async function checkDatabase(database_name) {
    let query = {
        text: "SELECT * FROM pg_catalog.pg_database WHERE datname=$1;",
        values: [database_name]
    };

    try {
        let result = await pool.query(query);
        if (!result.rowCount) {
            LOG.info('Database does not exist.');
            query = {
                text: `CREATE DATABASE ${database_name}`
            };
            await pool.query(query);
            LOG.info('Successfully created database, proceeding to check table existence.')
            checkTable('user_config');
        }
        else {
            LOG.info(`Database ${database_name} already exists, proceeding to check table existence.`);
            checkTable('user_config');
        }
    } catch (err) {
        LOG.error(err);
    }
}

//check if table exists
async function checkTable(table_name) {

    let query = {
        text: "SELECT * FROM information_schema.tables WHERE table_name=$1;",
        values: [table_name]
    };
    try {
        const client = await userPool.connect();
        let result = await client.query(query);
        if (!result.rowCount) {
            LOG.info(`Table ${table_name} not found.`);
            query = {
                text: "CREATE TABLE user_config ( \
                    tenant varchar(255) NOT NULL, \
                    username varchar(255) NOT NULL, \
                    configuration json NOT NULL, \
                    last_update timestamp WITH time zone DEFAULT CURRENT_TIMESTAMP, \
                    CONSTRAINT unique_user PRIMARY KEY (tenant, username) \
                 );"
            };
            await client.query(query);
        }
        else {
            LOG.info(`Table ${table_name}  already exists.`);
        }
        LOG.info(`Table ${table_name} is available to use.`);
    } catch (err) {
        LOG.error(`Erro: ${err}`);
    } finally {
        pool.end();
        userPool.end();
        process.exit();
    }
}
checkDatabase(config.postgres_backstage_database);
