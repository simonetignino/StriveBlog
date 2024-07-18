import express from "express";
import endpoints from "express-list-endpoints";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authorRoutes from "./routes/authorRoutes.js";
import cors from "cors";
import blogPosts from "./routes/blogPostRoutes.js";
import path from "path";
import authRoutes from "./routes/authRoutes.js";
import session from "express-session";
import passport from "./config/passportConfig.js";

dotenv.config(); //riporto variabili definite dentro .env

const app = express(); // inizializzo app

app.use(cors());
app.use(express.json()); // Middleware per trasformare il corpo delle richieste JSON

// app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // locale con cartella uploads

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    // dice al gestore di sessione di non salvare la sessione se non ci sono modifiche
    resave: false,
    // dice di non creare una sessione fino a quando non memorizzo qualcosa
    saveUninitialized: false,
  }),
);

app.use(passport.initialize());
app.use(passport.session());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MONGOOSE CONNESSO"))
  .catch((err) => console.error("MONGODB ERROR_", err));

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes); // rotte per autenticazione
app.use("/api/authors", authorRoutes);
app.use("/api/blogPosts", blogPosts);

app.listen(PORT, () => {
  console.log(`Server acceso sulla porta ${PORT}`);
  console.log("Sono disponibili i seguenti endpoints");
  console.table(endpoints(app));
});
