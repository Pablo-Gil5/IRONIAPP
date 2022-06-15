const mysql = require('mysql');

const{promisify} = require('util');

const {database} = require('./keys');



const pool = mysql.createPool(database);

pool.getConnection((err,connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('conexión con la base de datos perdida');
        }
        console.error('Ha fallado la base de datos');
        console.error(err);
    }


    if(connection) connection.release();

    console.log('DB is Connected');

    return;

});

pool.query =  promisify(pool.query);

module.exports = pool;