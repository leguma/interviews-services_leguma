const express = require('express');
const {
  Tree, addNode, getNode, updateNode, deleteNode,
} = require('./tree');

const app = express();

let tree = new Tree();

// TODO: We could add a JSON Body validator, if we wanted more strict rules.
app.use(express.json());

app.get('/', (req, res) => res.send("Couldn't see the forest for the trees!"));
app.get('/api/tree', (req, res) => res.send(tree.deepTree));
app.post('/api/tree', (req, res) => res.send(addNode(tree, req.body)));
app.delete('/api/tree', (req, res) => {
  tree = new Tree();
  res.send(tree.deepTree);
});
app.get('/api/tree/node/:id', (req, res) => res.send(getNode(tree, req.params.id)));
app.put('/api/tree/node/:id', (req, res) => res.send(updateNode(tree, req.params.id, req.body)));
app.delete('/api/tree/node/:id', (req, res) => res.send(deleteNode(tree, req.params.id, req.query.keepChildren)));

// A custom middleware that will look for our error type for handling error responses.
app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err.body);
  } else {
    next(err);
  }
});

exports.app = app;
