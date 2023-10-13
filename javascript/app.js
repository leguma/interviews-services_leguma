const express = require('express');
const { Tree, addNode } = require('./tree');

const app = express();

const tree = new Tree();

// TODO: We could add a JSON Body validator, if we wanted more strict rules.
app.use(express.json());

app.get('/', (req, res) => res.send("Couldn't see the forest for the trees!"));
app.get('/api/tree', (req, res) => res.send(tree.deepTree));
app.post('/api/tree', (req, res) => res.send(addNode(tree, req.body)));

// A custom middleware that will look for our error type for handling error responses.
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.body);
  } else {
    next(err);
  }
});

exports.app = app;
