import axios from "axios";

const API_URL = "http://localhost:5001/api"; // constante della base della nostra api
const api = axios.create({ baseURL: API_URL }); // creo l'istanza di axios

// Aggiungi un interceptor per includere il token in tutte le richieste
api.interceptors.request.use(
  (config) => {
    // Recupera il token dalla memoria locale
    const token = localStorage.getItem("token");
    if (token) {
      // Se il token esiste, aggiungilo all'header di autorizzazione
      config.headers["Authorization"] = `Bearer ${token}`;
      // console.log("Token inviato:", token); // Log del token inviato per debugging
    }
    return config; // Restituisce la configurazione aggiornata
  },
  (error) => {
    // Gestisce eventuali errori durante l'invio della richiesta
    return Promise.reject(error);
  },
);

// costanti CRUD di blogPost
export const getPosts = () => api.get("/blogPosts");
export const getPost = (id) => api.get(`/blogPosts/${id}`);
export const createPost = (postData) =>
  api.post("/blogPosts", postData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
export const updatePost = (id, postData) =>
  api.patch(`/blogPosts${id}`, postData);
export const deletePost = (id) => api.delete(`/blogPosts${id}`);
export const getComments = (postId) =>
  api.get(`/blogPosts/${postId}/comments`).then((response) => response.data);
export const addComment = (postId, commentData) =>
  api
    .post(`/blogPosts/${postId}/comments`, commentData)
    .then((response) => response.data);
export const getComment = (postId, commentId) =>
  api
    .get(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => response.data);
export const updateComment = (postId, commentId, commentData) =>
  api
    .patch(`/blogPosts/${postId}/comments/${commentId}`, commentData)
    .then((response) => response.data);
export const deleteComment = (postId, commentId) =>
  api
    .delete(`/blogPosts/${postId}/comments/${commentId}`)
    .then((response) => ({ ...response.data, ok: response.status === 200 }));

// ROTTE PER AUTENTICAZIONE
// NEW! Funzione per registrare un nuovo utente
export const registerUser = (userData) =>
  api.post("/authors", userData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// NEW: Funzione per effettuare il login di un utente
export const loginUser = async (credentials) => {
  // console.log(credentials);
  try {
    const response = await api.post("/auth/login", credentials); // Effettua la richiesta di login
    // console.log("Risposta API login:", response.data); // Log della risposta per debugging
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nella chiamata API di login:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

// NEW: Funzione per ottenere i dati dell'utente attualmente autenticato
export const getMe = () =>
  api.get("/auth/me").then((response) => response.data);

// Funzione per ottenere i dati dell'utente attualmente autenticato con gestione degli errori
export const getUserData = async () => {
  try {
    const response = await api.get("/auth/me"); // Effettua la richiesta per ottenere i dati dell'utente
    return response.data; // Restituisce i dati della risposta
  } catch (error) {
    console.error("Errore nel recupero dei dati utente:", error); // Log dell'errore per debugging
    throw error; // Lancia l'errore per essere gestito dal chiamante
  }
};

//TODO costanti CRUD di author

export default api;
