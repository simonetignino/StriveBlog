import express from "express";
import Authors from "../models/Authors.js";
import BlogPosts from "../models/BlogPosts.js";
import cloudinaryUploader from "../config/cloudinaryConfigAuthor.js";

const router = express.Router();

// Rotta per avere l'elenco di tutti gli autori
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // variabile per selezionare la pagina (pagina 1 di default)
    const limit = parseInt(req.query.limit) || 10; // variabile per selezionare quanti utenti verranno visualizzati in una pagina (10 di dafault)
    const sort = req.query.sort || "name"; // decido in base a cosa ordinare gli elementi
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // decido se ordinare in modo crescente o decresente
    const skip = (page - 1) * limit; // creo una variabile che utilizzerò per cambiare pagina
    const authors = await Authors.find({})
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);
    const total = await Authors.countDocuments();
    res.json({
      authors,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per vedere un singolo autore
router.get("/:id", async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    res.json(author);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Rotta per ricevere tutti i blogPosts di un autore specifico

// Rotta per creare un nuovo autore
// router.post("/", async (req, res) => {
//   try {
//     const author = new Authors(req.body);
//     const newAuthor = await author.save();

//     // Tolgo la password dalla repsonse (per sicurezza)
//     const authorResponse = newAuthor.toObject();
//     delete authorResponse.password;
//     res.status(201).json(newAuthor);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
//   try {
//     const postData = req.body;
//     if (req.file) {
//       postData.avatar = req.file.path;
//     } else {
//       console.log(postData);
//       console.log("immagine non caricata");
//     }
//     const newAuthor = new Authors(postData);
//     await newAuthor.save();

//     // Tolgo la password dalla repsonse (per sicurezza)
//     const authorResponse = newAuthor.toObject();
//     delete authorResponse.password;
//     res.status(201).json(newAuthor);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.post("/", cloudinaryUploader.single("avatar"), async (req, res) => {
  try {
    // console.log("File ricevuto:", req.file);
    // console.log("Body ricevuto:", req.body);

    const userData = req.body;
    if (req.file) {
      userData.avatar = req.file.path || req.file.url;
    } else {
      console.log("Immagine non caricata");
    }

    const newAuthor = new Authors(userData);
    await newAuthor.save();

    // Tolgo la password dalla response (per sicurezza)
    const authorResponse = newAuthor.toObject();
    delete authorResponse.password;

    res.status(201).json(authorResponse);
  } catch (err) {
    console.error("Errore durante la creazione dell'autore:", err);
    res.status(400).json({ message: err.message });
  }
});

// Rotta per modificare un autore
router.patch("/:id", async (req, res) => {
  try {
    const updateAuthor = await Authors.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!updateAuthor) {
      return res.status(404).json({ message: "Autore non trovato" });
    } else {
      res.json(updateAuthor);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per eliminare un autore
router.delete("/:id", async (req, res) => {
  try {
    const deleteAuthors = await Authors.findByIdAndDelete(req.params.id);
    if (!deleteAuthors) {
      return res.status(404).json({ message: "Autore non trovato" });
    } else {
      res.json({ message: "autore cancellato con successo" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per i blogpost di un autore
router.get("/:id/blogPosts", async (req, res) => {
  try {
    const author = await Authors.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: "Autore non trovato" });
    }
    const blogPosts = await BlogPosts.find({
      author: author.email,
    });
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per caricare un'immagine profilo dell'autore
router.patch(
  "/:authorId/avatar",
  cloudinaryUploader.single("avatar"),
  async (req, res) => {
    try {
      //Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
      if (!req.file) {
        return res.status(400).json({ message: "nessun file caricato" });
      }

      //Cerca l'autore nel database, se non esiste risondo con un 404
      const author = await Authors.findById(req.params.authorId);
      if (!author) {
        return res.status(404).json({ message: "autore non trovato" });
      }

      //Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
      author.avatar = req.file.path;
      //Salva le modifice nel db
      await author.save();
      //Invia la risposta con l'autore aggiornato
      res.json(author);
    } catch (err) {
      res.status(500).json({ message: "errore interno del server" });
    }
  },
);
export default router;
