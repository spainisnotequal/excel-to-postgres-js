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
  const query = "SELECT * FROM money_in";
  const pool = new Pool();
  pool
    .query(query)
    .then((res) => response.json(res.rows))
    .catch((err) => response.json(err));
});

// @route        POST /api/
// @description  Post a new record to the database
// @acces        Public
router.post("/", (request, response) => {
  const date = request.body.date;
  const concept = request.body.concept;
  const amount = request.body.amount;

  const query = `INSERT INTO money_in (date, concept, amount) VALUES ('${date}', '${concept}', ${amount})`;

  const pool = new Pool();
  pool
    .query(query)
    .then((res) => response.json(res.rows))
    .catch((err) => response.json(err));
});

// export the router
module.exports = router;
