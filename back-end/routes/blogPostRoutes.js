import express from "express";
import BlogPost from "../models/BlogPosts.js";
import upload from "../middlewares/upload.js";
// import controlloMail from "../middlewares/controlloMail.js";
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { sendEmail } from "../services/emailService.js";

const router = express.Router();
// router.use(controlloMail);

// Rotta per avere l'elenco di tutti i blogPost
router.get("/", async (req, res) => {
  try {
    let query = {};
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: "i" };
    }
    const blogPosts = await BlogPost.find(query);
    res.json(blogPosts);
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
    const updateAuthor = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    res.json(updateAuthor);
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