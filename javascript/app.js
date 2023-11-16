const express = require('express');
const {
  Tree, addNode, getNode, updateNode, deleteNode,
} = require('./tree');

const app = express();

let tree = new Tree();

// TODO: We could add a JSON Body validator, if we wanted more strict rules.
app.use(express.json());

app.get('/', (req, res) => res.send("Couldn't see the forest for the trees!"));

// Get the deep tree representation
app.get('/api/tree', (req, res) => res.send(tree.deepTree));

// Add a node to the tree. Parent id is optional.
// If not provided, adds the node to the root of the tree. 
app.post('/api/tree', (req, res) => res.send(addNode(tree, req.body)));

// Reset the whole tree
app.delete('/api/tree', (req, res) => {
  tree = new Tree();
  res.send(tree.deepTree);
});

// Get a tree branch at a given node.
app.get('/api/tree/node/:id', (req, res) => res.send(getNode(tree, req.params.id)));

// Update a node. If changing parent, an error will be thrown if it would create a cycle.
app.put('/api/tree/node/:id', (req, res) => res.send(updateNode(tree, req.params.id, req.body)));

// Delete a node.
// Query parm keepChildren can be used to optionally preserve children by moving them to the parent,
// otherwise, all children are deleted.
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
