import mysql from "mysql2/promise";

const config = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "sivemor",
  port: 3306,
  connectionLimit: 4,
};

const pool = mysql.createPool(config);

export default pool;