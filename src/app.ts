import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/mongodb";
import routes from "./routes";


dotenv.config(); // Cargar las variables de entorno
const app = express().use(express.json()); // Crear una instancia de Express
connectDB(); // Conectar a la base de datos
const port = process.env.PORT;
app.use("/api", routes); // Usar las rutas

export default app;
