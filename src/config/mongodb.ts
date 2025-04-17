import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


async function connectDB(): Promise<Mongoose> {
  try {
    const { MONGO_USER, MONGO_PASS, MONGO_ENDPOINT,MONGO_DB } = process.env;
    const uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_ENDPOINT}/${MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`;
    
    return await mongoose.connect(uri, { serverApi: { version: '1', strict: true, deprecationErrors: true } });

  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Salir del proceso si hay un error
  }
};

export default connectDB;
