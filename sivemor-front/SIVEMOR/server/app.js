import express from "express";
import cors from "cors";
import pool from "./db.js";

const aplicacion = express();
const PUERTO = 4000;

// Middlewares
aplicacion.use(cors());
aplicacion.use(express.json());

// Ruta raíz
aplicacion.get("/", (req, res) => {
  res.json({ mensaje: "API SIVEMOR funcionando" });
});

// Ruta para probar conexión a MySQL
aplicacion.get("/test-db", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT 1 AS test");
    connection.release();

    res.json({
      ok: true,
      mensaje: "Conexión exitosa a MySQL",
      resultado: rows,
    });
  } catch (error) {
    console.error("Error de conexión:", error);
    res.status(500).json({
      ok: false,
      mensaje: "Error conectando a MySQL",
      error: error.message,
    });
  }
});

// Iniciar servidor
aplicacion.listen(PUERTO, "0.0.0.0", () => {
  console.log(`Servidor SIVEMOR conectado en http://localhost:${PUERTO}`);
});