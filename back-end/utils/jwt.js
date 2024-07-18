import jwt from "jsonwebtoken";

//FUNZIONE PER GENEREARE UN TOKEN JWT
export const generateJWT = (payload) => {
  // Restituisco una promise che mi gestirà l'operazione
  return new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) reject(err);
        else resolve(token);
      },
    ),
  );
};

// FUNZOINE CHE VERIFICA IL TOKEN JWT
export const verifyJWT = (token) => {
  return new Promise((resolve, reject) =>
    //uso il meetodo verify per decodificare/verificare il token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      //se c'è errore vado in reject
      if (err) reject(err);
      //altrimenti passo il token decodificato
      else resolve(decoded);
    }),
  );
};
