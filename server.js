const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

// create the Express app
const app = express();

// Express JSON parser
app.use(express.json());

// set the directory where we want to upload the files
const uploadDirectory = "uploads";
if (!fs.existsSync(uploadDirectory)) fs.mkdirSync(uploadDirectory);

// multers disk storage settings
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, uploadDirectory);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname); // will rewrite the file if it already exists
  },
});

// multer settings
const upload = multer({
  storage: storage,
  fileFilter: (req, file, callback) => {
    const fileExt = path.extname(file.originalname);
    if (fileExt !== ".xlsx" && fileExt !== ".xls")
      return callback(new Error("Sorry. Upload a valid .xlsx or .xls file"));
    else return callback(null, true);
  },
}).single("file");

// Serve static files in the "public" directory
app.use("/", express.static(path.join(__dirname, "public")));

// POST /upload route
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log("Complete error description:", err);
      // Error uploading the file
      res.json({
        error_code: 1,
        err_desc: "Not a valid .xlsx or .xls file",
      });
      return;
    } else {
      console.log("File correctly uploaded");
      // Everything went fine
      res.json({ error_code: 0, err_desc: null });
    }
  });
});

// configure the port
const PORT = process.env.PORT || 5000;

// start the server and log that the server is up and running
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
