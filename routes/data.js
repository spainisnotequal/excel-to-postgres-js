const express = require("express");
const { Pool } = require("pg");

// in development, load environment variables (PGHOST, PGDATABASE, PGUSER, PGPASSWORD, etc.)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// create the router
const router = express.Router();

// @route        GET /api/
// @description  Get all data from the database
// @acces        Public
router.get("/", (request, response) => {
  const pool = new Pool();
  pool
    .query("SELECT * FROM money_in")
    .then((res) => response.json(res.rows))
    .catch((err) => response.json(err));
});

// export the router
module.exports = router;
