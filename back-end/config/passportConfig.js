import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import Author from "../models/Authors.js";

// Configuriamo la strategia di autenticazione con Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log(profile);
        let author = await Author.findOne({ googleId: profile.id });
        if (!author) {
          console.log(profile);
          author = new Author({
            googleId: profile.id,
            name: profile.name.givenName,
            surname: profile.name.familyName,
            email: profile.emails[0].value,
          });
          await author.save();
        }
        done(null, author);
      } catch (err) {
        console.error(err);
        done(err, null);
      }
    },
  ),
);

passport.use(
  new GithubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let author = await Author.findOne({ githubId: profile.id });

        // Estrai nome e cognome dal profilo GitHub
        let nome, cognome;
        if (profile.displayName) {
          const nameParts = profile.displayName.split(" ");
          nome = nameParts[0];
          cognome = nameParts.slice(1).join(" ");
        } else if (profile.username) {
          nome = profile.username;
          cognome = "";
        } else {
          nome = "GitHub";
          cognome = "User";
        }

        // Gestione dell'email
        let email =
          profile.emails && profile.emails.length > 0
            ? profile.emails.find((e) => e.primary || e.verified)?.value ||
              profile.emails[0].value
            : `${profile.id}@github.example.com`;

        if (author) {
          // Aggiorna l'autore esistente
          author.name = nome;
          author.surname = cognome;
          author.email = email;
          author.refreshToken = refreshToken;
        } else {
          // Crea un nuovo autore
          author = new Author({
            githubId: profile.id,
            name: nome,
            surname: cognome,
            email: email,
            refreshToken: refreshToken,
          });
        }

        await author.save();
        console.log(
          `Autore ${author.name} ${author.surname} salvato con successo`,
        );
        done(null, author);
      } catch (err) {
        console.error("Errore durante l'autenticazione GitHub: ", err);
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
