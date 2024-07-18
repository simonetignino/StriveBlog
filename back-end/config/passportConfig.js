import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/BlogPosts.js";

// Configuriamo la strategia di autenticazione con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    // Funzione chiamata quando l'autenticazione è avvenuto con successo
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        // Cerco se nel mio db esiste già un autore co nun certo Google ID
        let author = await Author.findOne({ googleId: profile.id });

        // Se non esiste, lo creo
        if (!author) {
          author = new Author({
            googleId: profile.id,
            name: profile.name.giveName,
            surname: profile.name.familyName,
            email: profile.emails[0].value,
          });
          // Salvo l'autore nel DB
          await author.save();
        }
        // Passo l'autore al middleware di Passport
        // null -> significa che non ci sono stati errori
        // authro -> autore che ho appena creato
        done(null, author);
      } catch (err) {
        console.error(err);
        // se accade un errore lo passo a passport
        done(err, null);
      }
    },
  ),
);

// Decido quali dati dell'utente salvare nella sessione
passport.serializeUser((user, done) => {
  // Salvo solo l'id
  done(null, user.id);
});

// recuper l'intero oggetto utente, basandomi sull'id memorizzato nella sessione
passport.deserializeUser(async (id, done) => {
  try {
    // cerco nel db l'utente che ha quell'id
    const user = await Author.findById(id);
    // passo l'utente
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
