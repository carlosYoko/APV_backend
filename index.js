import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import vetRoutes from "./routes/vetRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";

const app = express();
app.use(express.json());

dotenv.config();

connectDB();

const allowedDomains = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedDomains.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/vet", vetRoutes);
app.use("/api/patients", patientRoutes);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Servidor en puerto ${port}`);
});
