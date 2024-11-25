// @ts-check

require("dotenv/config");

const express = require("express");
const { auth } = require("firebase-admin");

const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
} = require("firebase/firestore");

const {
  PORT,
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} = process.env;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const server = express();

server.use(express.json());

server.use(express.static("public"));

server.use("/update/*", express.static("public/update"));
server.use("/delete/*", express.static("public/delete"));

server.get("/api/users", async (req, res) => {
  try {
    const useresRef = collection(db, "users");

    const q = query(useresRef, orderBy("timestamp"));
    const querySnapshot = await getDocs(q);

    const users = [];

    for (let index = 0; index < querySnapshot.docs.length; index++) {
      const id = querySnapshot.docs[index].id;

      const user = querySnapshot.docs[index].data();

      user.id = id;

      users.push(user);
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

server.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(500).json({ error: "An Id is needed in the url parameter" });
    return;
  }

  try {
    const ref = doc(db, "users", id);
    const documentSnapshot = await getDoc(ref);

    if (documentSnapshot.exists()) {
      const user = documentSnapshot.data();
      user.id = documentSnapshot.id;

      res.status(200).json(user);
      return;
    }

    res.status(404).json({ error: "User not found" });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

server.post("/api/users", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    res.status(500).json({
      error: `Name ${name} or Email ${email} might be missing`,
    });
    return;
  }

  const newUser = {
    name,
    email,
    timestamp: serverTimestamp(),
  };

  try {
    const docRef = await addDoc(collection(db, "users"), newUser);

    res.status(200).json(docRef.id);
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

server.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  if (!id) {
    res.status(500).json({ error: "An Id is needed in the url parameter" });
    return;
  }

  if (!name || !email) {
    res.status(500).json({
      error: `Name ${name} or Email ${email} might be missing`,
    });
    return;
  }

  const newUser = { name, email };

  try {
    const oldUserRef = doc(db, "users", id);
    await updateDoc(oldUserRef, newUser);

    res.status(200).json(newUser);
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

server.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(500).json({ error: "An Id is needed in the url parameter" });
    return;
  }

  try {
    await deleteDoc(doc(db, "users", id));

    res.status(200).json({ message: "success" });
    return;
  } catch (error) {
    console.log(error);

    res.status(500).json({ error: error.message });
  }
});

server.listen(PORT, () => console.log("Server listening at: ", 3000));
