const { v4: uuidv4 } = require('uuid');
const { RestError } = require('./errors');

class Tree {
  constructor() {
    this.deepTree = [];
    this.flatTree = {};
  }
}

function getUUID(tree) {
  let id = uuidv4();

  while (tree.flatTree[id]) {
    id = uuidv4();
  }

  return id;
}

// ASSUMPTION 1 (See README.md)
// This function is not idempotent; it mutates the provided tree.
function addNode(tree, { id: nodeId, parent, label }) {
  // For the sake of testing and tree rebuilding, we'll allow user-provided ids.
  // NOTE: We could technically let the DB handle id generation as well.
  //  In fact, if we have async mutations to the DB, that is preferred.
  const id = nodeId || getUUID(tree);
  const node = {
    label,
    children: [],
  };

  if (tree.flatTree[id]) {
    throw new RestError({ status: 400, body: { error: 'Node with that id already exists!' } });
  }

  if (!label) {
    throw new RestError({ status: 400, body: { error: 'Label is requried!' } });
  }

  if (parent == null) {
    tree.deepTree.push({ [id]: node });
  } else if (tree.flatTree[parent]) {
    tree.flatTree[parent].children.push({ [id]: node });
  } else {
    throw new RestError({ status: 404, body: { error: 'Parent not found!' } });
  }

  // eslint-disable-next-line no-param-reassign
  tree.flatTree[id] = node;

  return { id };
}

// TODO: Tree initialization from whatever storage. See examples below.

// ====================NoSQL====================
// For a NoSQL DB, we would flatten the DB here.
/*
deepTree = getTreeFromDB()

function flattenTree(children) {
    children.forEach(node => {
        Object.assign(flatTree, node)
        flattenTree(node.children)
    })
}

flattenTree(deepTree)
*/

// ====================RDB====================
// For an RDB, we would construct the deep tree here.
// Each DB record would likely be something like: {id, parent, label}
// ASSUMPTION 2 (See README.md)
/*

const records = getAllRecordsFromDB()

const roots = records.filter(node => node.parent == null)

function rebuildTree(node) {
    addNode(node)

    records.filter(record => record.parent == node.id).forEach(child => rebuildTree(child))
}

roots.forEach(root => rebuildTree(root));
*/

exports.Tree = Tree;
exports.addNode = addNode;
