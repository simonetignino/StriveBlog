import mongoose from "mongoose";
import bcrypt from "bcrypt";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    surname: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
    },
    birthday: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
  },
  { collection: "authors" },
);

// funzione che confronta la password
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//Middleware per l'hashing della password prima del salvataggio
authorSchema.pre("save", async function (next) {
  // Eseguo l'hasing solo se la password è stata modificata
  // oppure è un anuova password
  if (!this.isModified("password")) return next();
  try {
    // genero un valore casuale con 10 round di hasing
    const salt = await bcrypt.genSalt(10);
    // e poi salvo
    this.password = await bcrypt.hash(this.password, salt); // l'errore mente, serve l'await perche' sennò non funziona
    next();
  } catch (err) {
    // Se accade errore, passo errore
    next(err);
  }
});

const Author = mongoose.model("Author", authorSchema);
export default Author;

// {
//     "name": "Simone",
//     "surname": "Tignino",
//     "email": "simo7820@gmail.com",
//     "birthday": "14/06/2024",
//     "avatar": "",
//     "validated": false
// }
