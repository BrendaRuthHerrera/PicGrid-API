import mysql2 from 'mysql2';

const connection = mysql2.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '2001',
    database : 'portal_de_aplicaciones',
});

export default connection;