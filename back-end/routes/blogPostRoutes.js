import express from "express";
import BlogPost from "../models/BlogPosts.js";
import upload from "../middlewares/upload.js";
// import controlloMail from "../middlewares/controlloMail.js";
import cloudinaryUploader from "../config/cloudinaryConfigPost.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();
// router.use(controlloMail);

// Rotta per avere l'elenco di tutti i blogPost
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // variabile per selezionare la pagina (pagina 1 di default)
    const limit = parseInt(req.query.limit) || 10; // variabile per selezionare quanti utenti verranno visualizzati in una pagina (10 di dafault)
    const sort = req.query.sort || "name"; // decido in base a cosa ordinare gli elementi
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // decido se ordinare in modo crescente o decresente
    const skip = (page - 1) * limit; // creo una variabile che utilizzerò per cambiare pagina
    let query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }
    const blogPosts = await BlogPost.find(query)
      .sort({ [sort]: sortDirection })
      .skip(skip)
      .limit(limit);
    const total = await BlogPost.countDocuments();
    res.json({
      blogPosts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBlogPost: total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per un singolo blogPost
router.get("/:id", async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);
    if (!blogPost) {
      return res.status(404).json({ message: "BlogPost non trovato" });
    }
    res.json(blogPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use(authMiddleware);

router.get("/?title=:title", async (req, res) => {
  try {
    // faremo una ricerca in base al titolo
    const { title } = req.query;

    // controllo se il parametro title è stato fornito, in caso darà errore 400
    if (!title) {
      return res
        .status(400)
        .json({ message: "Il parametro 'title' è richiesto" });
    }

    // Ricerco nel database il post con il titolo ricercato
    const blogPosts = await BlogPost.find({
      // Utilizzo regex per cercare post che contengono il titolo digitato
      // $regex: permette di usare espressioni regolari nella ricerca
      // $options: "i" rende la ricerca case-insensitive
      title: { $regex: title, $options: "i" },
    });

    // se la lunghezza di blogPost è 0, evidentemento non è stato trovato nulla
    if (blogPosts.length === 0) {
      return res
        .status(404)
        .json({ message: "Nessun post trovato con questo titolo" });
    }

    // restituisco i risultati
    res.json(blogPosts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per creare un nuovo blogPost
// router.post("/", async (req, res) => {
//   const blogPost = new BlogPost(req.body);
//   try {
//     const newAuthor = await blogPost.save();
//     res.status(201).json(newAuthor);
//   } catch (err) {
//     console.error("errore nella router.post", err);
//   }
// });

// Post con upload
router.post("/", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    const postData = req.body;
    if (req.file) {
      postData.cover = req.file.path; // Cloudinary
      console.log(postData.cover);
    } else {
      console.log("Immagine non caricata");
    }
    const newPost = new BlogPost(postData);
    await newPost.save();
    // Codice per invio mail con Mailgun
    const htmlContent = `
      <h1>Il tuo post è stato pubblicato!</h1>
      <p>Ciao ${newPost.author},</p>
      <p>Il tuo post '${newPost.title}' è stato pubblicato con successo.</p>
      <p>Categoria: ${newPost.category}</p>
      <p>Grazie per il tuo contributo al blog!</p>
    `;
    await sendEmail(newPost.author, "Post pubblicato", htmlContent);
    res.status(201).json(newPost);
  } catch (err) {
    console.error("Errore nella creazione", err);
    res.status(400).json({ message: err.message });
  }
});

// Rotta per modificare un blogPost
router.patch("/:id", async (req, res) => {
  try {
    const updateBlog = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updateBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per eliminare un blogPost
router.delete("/:id", async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: "BlogPost cancellato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per modificare l'immagine del blog post
router.patch(
  "/:blogPostId/cover",
  cloudinaryUploader.single("cover"),
  async (req, res) => {
    try {
      // Verifica se è stato caricato un file o meno
      if (!req.file) {
        return res.status(400).json({ message: "Ops, nessun file caricato" });
      }

      // Cerca il blog post nel db
      const blogPost = await BlogPost.findById(req.params.blogPostId);
      if (!blogPost) {
        return res.status(404).json({ message: "Blog post non trovato" });
      }

      // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
      blogPost.cover = req.file.path;

      // Salva le modifiche nel db
      await blogPost.save();

      // Invia la risposta con il blog post aggiornato
      res.json(blogPost);
    } catch (err) {
      console.error("Errore durante l'aggiornamento della copertina:", err);
      res.status(500).json({ message: "Errore interno del server" });
    }
  },
);

// ROTTE PER I COMMENTI

// Rotta per vedere tutti i commenti di un post
router.get("/:id/comments", async (req, res) => {
  try {
    // Cerca il post nel database usando l'ID
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per un commento specifico di un post specifico
router.get("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    // Cerca il commento specifico
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rotta per aggiungere un commento a un blogpost specifico
router.post("/:id/comments", async (req, res) => {
  try {
    // Cerca il post nel database usando l'ID
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    // Crea un nuovo oggetto commento con i dati forniti
    const newComment = {
      name: req.body.name,
      email: req.body.email,
      content: req.body.content,
    };
    // Aggiunge il nuovo commento all'array di commenti
    post.comments.push(newComment);
    // Salva le modifiche
    await post.save();
    // Invia il nuovo commento come risposta json con status 201 (created)
    res.status(201).json(newComment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cambiare un commento specifico
router.patch("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    // Aggiorna il contenuto del commento
    comment.content = req.body.content;
    await post.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rotta per cancellare un commento specifico di un blog specifico
router.delete("/:id/comments/:commentId", async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post non trovato" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commento non trovato" });
    }
    comment.remove();
    await post.save();
    res.json({ message: "Commento eliminato con successo" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
