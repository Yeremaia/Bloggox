import express from 'express';
import mysql from "mysql";
import cors from "cors";
import multer from 'multer';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Multer configuration for saving files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder where the images are saved
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

app.use('/uploads', express.static('uploads'));
const upload = multer({ storage });

// Upload Image
app.post("/upload", upload.single('image'), (req, res) => {
  
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No image uploaded' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    res.json({ success: true, path: imagePath });
});

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bloggoxbd"

});


app.put("/updateUserImage", (req, res) => {
  const { userId, imageType, imagePath } = req.body;

  console.log("Data received in /updateUserImage:", { userId, imageType, imagePath });

  if (!userId || !imageType || !imagePath) {
    console.log("Missing data:", { userId, imageType, imagePath });
    return res.status(400).json({ success: false, message: "Incomplete data" });
  }

  const column = imageType === "profile" ? "imageUser" : "backgroundImage";
  const query = `UPDATE user SET ${column} = ? WHERE idUser = ?`;

  console.log("Executing query:", query, [imagePath, userId]);

  db.query(query, [imagePath, userId], (err) => {
    if (err) {
      console.error("MySQL error:", err);
      return res.status(500).json({ success: false, message: "DB error" });
    }

    console.log("Image updated in the DB");
    res.json({ success: true, message: "User image updated" });
  });
});


// Add the following data to the database:

app.post("/create", (req, res) => {
  const name = req.body.name;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const phone = req.body.phone;
  const day = req.body.day;
  const month = req.body.month;
  const year = req.body.year;
  const username = req.body.username;
  const password = req.body.password;

  // Assign default images if not submitted
  const imageUser = req.body.imageUser?.trim() || '/uploads/defaultPhoto.png';
  const backgroundImage = req.body.backgroundImage?.trim() || '/uploads/defaultBackgroundPhoto.jpeg';

  const descriptionUser = req.body.descriptionUser || '';
  const address = req.body.address || '';

  console.log(req.body);

  db.query(
    'SELECT * FROM user WHERE email = ? OR username = ?',
    [email, username],
    (err, result) => {
      if (err) {
        return res.json({ success: false, message: "Server Error" });
      }

      if (result.length > 0) {
        return res.json({ success: false, message: "Email or Username already exist." });
      }

      db.query(
        'INSERT INTO user (name, lastName, email, phone, day, month, year, imageUser, backgroundImage, username, password, descriptionUser, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, lastName, email, phone, day, month, year, imageUser, backgroundImage, username, password, descriptionUser, address],
        (err2) => {
          if (err2) {
            console.log(err2);
            return res.json({ success: false, message: "Database Error" });
          } else {
            res.json({ success: true, message: "Successfully registered user" });
          }
        }
      );
    }
  );
});

// Add Post

app.post("/create-post",(req, res)=> {
    console.log("POST received:", req.body);
    const title = req.body.title;
    const description = req.body.description;
    let imagePost = req.body.imagePost;
    const tags = req.body.tags;
    const viewAges = req.body.viewAges;
    const publicationDate = req.body.publicationDate;
    const idUser = req.body.idUser;

    // If there is no image, assign a default one
    if (!imagePost || imagePost.trim() === '') {
        imagePost = '/uploads/defaultPost.png'; 
    }

    db.query(
      'INSERT INTO post(title, description, imagePost, tags, viewsAges, publicationDate, idUser) VALUES (?, ?, ?, ?, ?, ?, ?)', 
      [title, description, imagePost, tags, viewAges, publicationDate, idUser], 
      (err, result) => {
        if (err) {
            console.error("Mysql Error", err);
            return res.json({ success: false, message: "Server Error"});
        }
        console.log("Add Post Success", result);
        res.json({ success: true, message: "Add Post Success"});
    });
});


// View ALL Post

app.get("/showPost", (req, res) => {
    db.query(`SELECT 
            p.idPost,
            p.title, 
            p.publicationDate, 
            p.description, 
            p.imagePost, 
            p.tags,
            p.viewsAges,  
            u.username 
        FROM post p 
        JOIN user u ON p.idUser = u.idUser ORDER BY p.idPost DESC`
        , (err, result)=> {
        if (err) {
                console.error("MySQL Error", err);
                return res.status(500).json({ success: false, message: "Server Error" });
            }
            res.json({ success: true, posts: result });

    })
})

// Show Author Post

app.get("/getPost/:id", (req, res) => {
    const postId = req.params.id;

    db.query(`
        SELECT p.idPost, p.title, p.description, p.imagePost, p.tags, p.publicationDate, 
               u.idUser, u.username, u.name, u.imageUser, u.backgroundImage, u.lastName
        FROM post p
        JOIN user u ON p.idUser = u.idUser
        WHERE p.idPost = ?`, 
        [postId], 
        (err, result) => {
            if (err) {
                console.error("MySQL Error", err);
                return res.status(500).json({ success: false, message: "Server error" });
            }

            if (result.length > 0) {
                res.json({ success: true, post: result[0] });
            } else {
                res.status(404).json({ success: false, message: "Post not found" });
            }
        }
    );
});

// Update User info

app.put("/updateUser/:idUser", (req, res) => {
  const { idUser } = req.params;
  const { name, lastName, phone, address, username, password, descriptionUser, day, month, year } = req.body;

  // Check if the username already exists for another user
  const checkQuery = "SELECT idUser FROM user WHERE username = ? AND idUser != ?";
  db.query(checkQuery, [username, idUser], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (result.length > 0) {
      return res.json({ success: false, message: "Username already exists" });
    }

    // Update the data WITHOUT modifying the email
    const updateQuery = `
      UPDATE user 
      SET name = ?, lastName = ?, phone = ?, address = ?, username = ?, password = ?, descriptionUser = ?, day = ?, month = ?, year = ?
      WHERE idUser = ?
    `;

    db.query(
      updateQuery,
      [name, lastName, phone, address, username, password, descriptionUser, day, month, year, idUser],
      (err2) => {
        if (err2) {
          console.error("MySQL Error:", err2);
          return res.status(500).json({ success: false, message: "Error updating user" });
        }
        res.json({ success: true, message: "User updated successfully" });
      }
    );
  });
});


// Login

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, password], (err, result) => {
    if (err) {
      return res.status(500).send("Server error");
    }

    if (result.length > 0) {
      let user = result[0];

      // Always assign default if empty or null
      user.imageUser = user.imageUser && user.imageUser.trim() !== "" 
        ? user.imageUser 
        : "/uploads/defaultPhoto.png";

      user.backgroundImage = user.backgroundImage && user.backgroundImage.trim() !== "" 
        ? user.backgroundImage 
        : "/uploads/defaultBackgroundPhoto.jpeg";

      res.json({ success: true, user });
    } else {
      res.json({ success: false, message: "Error" });
    }
  });
});

// Show all users

app.get("/showUser",(req, res)=> {

    db.query('SELECT * FROM user',(err,result)=>{
        if(err){
            console.log(err);
        } else {
            res.send(result)
        }
    });
});

// Show My Creations

app.get("/myCreations/:idUser", (req, res) => {
    const idUser = req.params.idUser;

    db.query('SELECT p.idPost, p.title, p.description, p.imagePost, p.tags, p.publicationDate, u.username FROM post p JOIN user u ON p.idUser = u.idUser WHERE p.idUser = ? ORDER BY p.idPost DESC', [idUser], (err, result) => {
        if (err) {
                console.error("MySQL Error", err);
                return res.status(500).json({ success: false, message: "Server Error" });
            }
            res.json({ success: true, posts: result });
    })
})


// Get a post by ID
app.get("/getPostById/:idPost", (req, res) => {
  const idPost = req.params.idPost;
  db.query('SELECT * FROM post WHERE idPost = ?', [idPost], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false, message: "Server Error" });
    }
    if (result.length > 0) {
      res.json({ success: true, post: result[0] });
    } else {
      res.status(404).json({ success: false, message: "Post not found" });
    }
  });
});

// Show all Comment of that post
app.get('/comments/:idPost', (req, res) => {
  const { idPost } = req.params;

  const query = `
    SELECT c.*, u.username, u.name, u.imageUser
    FROM comments c
    JOIN user u ON c.idUser = u.idUser
    WHERE c.idPost = ?
    ORDER BY c.dateComment AND c.replay = u.username DESC
  `;

  db.query(query, [idPost], (err, results) => {
    if (err) {
      console.error("MySQL Error", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }

    res.json({ success: true, comments: results });
  });
});


// Show favorites

app.get("/favorites/:idUser", (req, res) => {
  const idUser = req.params.idUser;

  const query = `
    SELECT p.idPost, p.title, p.description, p.imagePost, p.tags, p.publicationDate, u.username
    FROM favorites f
    JOIN post p ON f.idPost = p.idPost
    JOIN user u ON p.idUser = u.idUser
    WHERE f.idUser = ?
    ORDER BY f.idFavorites DESC
  `;

  db.query(query, [idUser], (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
    res.json({ success: true, favorites: result });
  });
});

// Add favorites

app.post("/addFavorite", (req, res) => {
  const { idUser, idPost } = req.body;

  // Avoid duplicates
  db.query("SELECT * FROM favorites WHERE idUser = ? AND idPost = ?", [idUser, idPost], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: "Server Error" });

    if (result.length > 0) {
      return res.json({ success: false, message: "Already in favorites" });
    }

    // Insert if not exists
    db.query("INSERT INTO favorites (idPost, idUser) VALUES (?, ?)", [idPost, idUser], (err2) => {
      if (err2) return res.status(500).json({ success: false, message: "Insert Error" });
      res.json({ success: true, message: "Favorite added!" });
    });
  });
});


// Remove favorite
app.delete("/removeFavorite/:idUser/:idPost", (req, res) => {
  const { idUser, idPost } = req.params;

  db.query("DELETE FROM favorites WHERE idUser = ? AND idPost = ?", [idUser, idPost], (err) => {
    if (err) return res.status(500).json({ success: false, message: "Error deleting favorite" });
    res.json({ success: true, message: "Favorite removed" });
  });
});


// Add comments

app.post("/addComment", (req, res) => {
  const { idPost, idUser, descriptionComment, replay } = req.body;
  const dateComment = new Date();
  db.query(
    'INSERT INTO comments (idPost, idUser, descriptionComment, dateComment, replay) VALUES (?, ?, ?, ?, ?)',
    [idPost, idUser, descriptionComment, dateComment, replay],
    (err) => {
      if (err) {
        console.error("Error adding comment:", err);
        return res.status(500).json({ success: false });
      }
      res.json({ success: true, message: "Comment added" });
    }
  );
});


// Update Post
app.put("/updatePost/:idPost", (req, res) => {
  const idPost = req.params.idPost;
  const { title, description, tags, viewAges, imagePost } = req.body;

  db.query(
    `UPDATE post 
     SET title = ?, description = ?, tags = ?, viewsAges = ?, imagePost = ? 
     WHERE idPost = ?`,
    [title, description, tags, viewAges, imagePost, idPost],
    (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Server Error" });
      }
      res.json({ success: true, message: "Post updated successfully" });
    }
  );
});

// Delete Post
app.delete("/deletePost/:idPost", (req, res) => {
    const idPost = req.params.idPost;

    db.query("DELETE FROM post WHERE idPost = ?", [idPost], (err) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Server Error" });
        }
        res.json({ success: true, message: "Post deleted successfully" });
    })
})


// Search
app.get("/searchPosts", (req, res) => {
  const query = req.query.query;
  if (!query) return res.json({ success: false, message: "No query provided" });

  const sql = `
    SELECT 
      p.idPost,
      p.title,
      p.publicationDate,
      p.description,
      p.imagePost,
      p.tags,
      u.username
    FROM post p
    JOIN user u ON p.idUser = u.idUser
    WHERE p.title LIKE ? 
       OR p.description LIKE ?
       OR p.tags LIKE ?
    ORDER BY p.idPost DESC
  `;
  
  const search = `%${query}%`;

  db.query(sql, [search, search, search], (err, results) => {
    if (err) return res.status(500).json({ success: false, error: err });
    res.json({ success: true, posts: results });
  });
});


// Get User by username
app.get("/getUser/:username", (req, res) => {
  const username = req.params.username;

  db.query('SELECT * FROM user WHERE username = ?', [username], (err, result) => {
    if (err) return res.status(500).send("Server Error");

    if (result.length > 0) {
      let user = result[0];
      user.imageUser = user.imageUser && user.imageUser.trim() !== "" 
        ? user.imageUser 
        : "/uploads/defaultPhoto.png";
      user.backgroundImage = user.backgroundImage && user.backgroundImage.trim() !== "" 
        ? user.backgroundImage 
        : "/uploads/defaultBackgroundPhoto.jpeg";
      
      res.json({ success: true, user });
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.listen(3001,()=>{
    console.log('Heading towards port 3001.')
});