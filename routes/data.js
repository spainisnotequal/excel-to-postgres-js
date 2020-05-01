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
router.get("/", (_request, response) => {
  const pool = new Pool();
  pool
    .query("SELECT * FROM money_in ORDER BY id ASC")
    .then((res) => response.json(res.rows))
    .catch((err) => response.json(err));
});

// @route        GET /api/:id
// @description  Get a single record from the database by its id
// @acces        Public
router.get("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const pool = new Pool();
  pool
    .query("SELECT * FROM money_in WHERE id = $1", [id])
    .then((res) => response.json(res.rows))
    .catch((err) => response.json(err));
});

// @route        POST /api/
// @description  Post a new record to the database
// @acces        Public
router.post("/", (request, response) => {
  const { date, concept, amount } = request.body;

  const pool = new Pool();
  pool
    .query("INSERT INTO money_in (date, concept, amount) VALUES ($1, $2, $3)", [
      date,
      concept,
      amount,
    ])
    .then((res) =>
      response.json({
        success: true,
        message: "Record added to the database",
      })
    )
    .catch((err) => response.json({ success: false, message: err }));
});

// @route        PUT /api/:id
// @description  Update a record from the database
// @acces        Public
router.put("/:id", (request, response) => {
  const id = parseInt(request.params.id);
  const { date, concept, amount } = request.body;

  const pool = new Pool();
  pool
    .query(
      "UPDATE money_in SET date = $1, concept = $2, amount = $3 WHERE id = $4",
      [date, concept, amount, id]
    )
    .then((res) => {
      // "rowCount" returns the number or rows affected by the query
      if (res.rowCount) {
        response.json({
          success: true,
          message: "Record updated",
        });
      } else {
        response.json({
          success: false,
          message: "The record doesn't exist",
        });
      }
    })
    .catch((err) => response.json({ success: false, message: err }));
});

// @route        DELETE /api/:id
// @description  Delete a record from the database
// @acces        Public
router.delete("/:id", (request, response) => {
  const id = parseInt(request.params.id);

  const pool = new Pool();
  pool
    .query("DELETE FROM money_in WHERE id = $1", [id])
    .then((res) => {
      // "rowCount" returns the number or rows affected by the query
      if (res.rowCount) {
        response.json({
          success: true,
          message: "Record deleted from the database",
        });
      } else {
        response.json({
          success: false,
          message: "The record doesn't exist",
        });
      }
    })
    .catch((err) => response.json({ success: false, message: err }));
});

// export the router
module.exports = router;
