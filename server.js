const express = require("express");
const path = require("path");

// import routes
const uploadFile = require("./routes/uploadFile");

// create the Express app
const app = express();

// Express JSON parser
app.use(express.json());

// Serve static files in the "public" directory
app.use("/", express.static(path.join(__dirname, "public")));

// use Routes
app.use("/api/upload", uploadFile);

// configure the port
const PORT = process.env.PORT || 5000;

// start the server and log that the server is up and running
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);
