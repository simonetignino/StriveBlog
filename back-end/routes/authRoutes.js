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

// Rotte per Google
// Gestisce l'inizio dell'autenticazione google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

// Gestisce il dopo
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      const token = await generateJWT({ id: req.user._id });
      res.redirect(`http://localhost:5173/login?token=${token}`);
    } catch (err) {
      console.error("Errore nella generazione del token", err);
      res.redirect("/login?error=auth_failed");
    }
  },
);

// Rotta per iniziare il processo di autenticazione di git hub
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  handleAuthCallback,
);

async function handleAuthCallback(req, res) {
  try {
    const token = await generateJWT({ id: req.user._id });
    res.redirect(`http://localhost:5173/login?token=${token}`);
  } catch (error) {
    console.error("Errore token");
    res.redirect("/login?error=auth_failed");
  }
}
export default router;
