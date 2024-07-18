import express from "express";
import Author from "../models/Authors.js";
import { generateJWT } from "../utils/jwt.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import passport from "../config/passportConfig.js";

const router = express.Router();

// POST /login -> restituirà un token di accesso!
router.post("/login", async (req, res) => {
  try {
    //Step 1 -> prendo email e password dalla request
    const { email, password } = req.body;

    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }
    const isMatch = await author.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenziali non valide" });
    }

    // se tutto corrisponde, genero il token di sessione associato al singolo "autore"
    const token = await generateJWT({ id: author._id });

    res.json({ token, message: "login effettuato con successo, Bentornat*" });
  } catch (err) {
    console.error("errore nel login", err);
    res.status(500).json({ message: "Errore nel server" });
  }
});

// GET /me -> restituisce l'utente collegato al token
router.get("/me", authMiddleware, (req, res) => {
  // convero il doc mongoose in oggetto js
  const authorData = req.author.toObject();
  // cancello per sicurezza la password
  delete authorData.password;
  res.json(authorData);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  // Passport prova autenticare l'utente con le sue credienziali di google
  passport.authenticate("google", { failureRedirect: "/login" }),
),
  // Utente entra
  async (req, res) => {
    try {
      // Devo genereare un token JWT per l'utente loggato
      // Sfrutterò l'id dell'utente come payload del token
      const token = await generateJWT({ id: req.user._id });

      // reinderizzo l' utente al frontend, passando magari il token come parametro URL
      // così il front end può salvare questo token e usarlo per le richieste autenticate
      res.redirect(`http://localhost:5173/login?token${token}`);
    } catch (err) {
      console.error("Errore nella genereazione del token", err);
      res.redirect("/login/error=auth_failed");
    }
  };
export default router;
