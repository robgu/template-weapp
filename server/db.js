import fs from 'fs-extra';
import Knex from 'knex';
import mysql from 'mysql';

import config from './config';

const main = async () => {
  const connection = mysql.createConnection(config.mysql);
  connection.query(`drop database if exists ${config.mysql.database}_upgrade`);
  connection.query(`create database ${config.mysql.database}_upgrade`);
  const upgrade = Knex({
    client: 'mysql',
    connection: config.mysql,
  });
  upgrade.raw(fs.readFileSync('scripts/schema.sq'));

  const upgradeDb = `${config.mysql.database}_upgrade`;
  const currentDb = Knex({
    client: 'mysql',
    connection: {
      ...config.mysql,
      multipleStatements: true,
    },
  });

  const sql = `drop database if exists ${upgradeDb}`;
  console.warn('sql', sql);
  await currentDb.schema.raw(sql);
};

main();
