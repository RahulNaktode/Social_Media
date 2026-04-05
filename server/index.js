import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import checkJWT from "./middlewars/jwt.js";
import { getHome, getHealth } from "./controllers/health.js";
import { postRegister, postLogin } from "./controllers/auth.js";
import { getUser, getUserFriends, addRemoveFriends, updateUser } from "./controllers/users.js";
import { createPost, getFeedPosts, getUserPosts, likePost } from "./controllers/posts.js";
import ImageKit from "@imagekit/nodejs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

app.get("/", getHome);
app.get("/health", getHealth);

app.get("/", getHome);

app.get('/auth', function (req, res) {
  const { token, expire, signature } = client.helper.getAuthenticationParameters();
  res.send({ token, expire, signature, publicKey: process.env.IMAGEKIT_PUBLIC_KEY });
});

app.post("/register", postRegister);
app.post("/login", postLogin);

app.get("/user/:id", checkJWT, getUser);
app.get("/user/:id/friends", checkJWT, getUserFriends);
app.patch("/user/:id/:friendId", checkJWT, addRemoveFriends);
app.put("/user/:userId", checkJWT, updateUser);

app.post("/posts", checkJWT, createPost);
app.get("/posts", checkJWT, getFeedPosts);
app.get("/post/:userId/posts", checkJWT, getUserPosts);
app.patch("/posts/:id/like", checkJWT, likePost);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  connectDB();
});