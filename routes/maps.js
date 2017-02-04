"use strict";


const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("maps")
      .then((results) => {
        res.json(results);
    });
  });


  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("markers")
      .then((results) => {
        res.json(results);
    });
  });


  router.post("/", (req, res) => {
  console.log(req.body);
    knex('maps')
      .insert (
      {title: req.body.mapTitle, creator_id: 2})
      .then((results) => {
      res.json({ success: true, message: 'ok' });
    })
  });

  router.post("/maps/:id" (req, res) => {
    let markerArr = [];
    for (let i in req.body.markers) {
      req.body.markers[i].user_id = req.session.user_id;
      req.body.markers[i].map_id = req.params.id;
      markerArr.push(req.body.markers[i]);
    }

    let chunkSize = markerArr.length;

    knex.batchInsert('markers', markerArr, chunkSize)
      .returning('id')
      .then(function() {
        console.log('Insert is working!')
      })
      .catch(function(error) {
        console.log(error)
      });

    knex.transaction(function(tr) {
      return knex.batchInsert('markers', markerArr, chunkSize)
        .transacting(tr)
      })
      .then (function() {
        console.log('Insert is working!')
      })
      .catch(function(error) {
        console.log(error)
      })
  })


  return router;
}
