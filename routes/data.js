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
  const id = request.params.id;
  const date = request.body.date;
  const concept = request.body.concept;
  const amount = request.body.amount;

  // Not empty body
  if (date || concept || amount) {
    const dateQuery = date ? `date = '${date}'` : "";
    const conceptQuery = concept ? `concept = '${concept}'` : "";
    const amountQuery = amount ? `amount = ${amount}` : "";
    const firstComma = (concept || amount) && date ? "," : "";
    const secondComma = amount && (date || concept) ? "," : "";
    const setQuery = `SET ${dateQuery} ${firstComma} ${conceptQuery} ${secondComma} ${amountQuery}`;

    const query = `UPDATE money_in ${setQuery} WHERE id = ${id}`;

    const pool = new Pool();
    pool
      .query(query)
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
  }
  // Empty body
  else {
    response.json({
      success: false,
      message: "Nothing to update",
    });
  }
});

// @route        DELETE /api/:id
// @description  Delete a record from the database
// @acces        Public
router.delete("/:id", (request, response) => {
  const id = request.params.id;

  const query = `DELETE FROM money_in WHERE id = ${id}`;

  const pool = new Pool();
  pool
    .query(query)
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
