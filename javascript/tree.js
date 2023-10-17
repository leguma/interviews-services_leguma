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
    tree.flatTree[parent].ref.children.push({ [id]: node });
  } else {
    throw new RestError({ status: 404, body: { error: 'Parent not found!' } });
  }

  // eslint-disable-next-line no-param-reassign
  tree.flatTree[id] = { parent, ref: node };

  return { id };
}

function getNode(tree, id) {
  if (!tree.flatTree[id]) {
    throw new RestError({ status: 404, body: { error: 'Node not found!' } });
  }

  return tree.flatTree[id].ref;
}

function isChild(tree, parentId, childId) {
  let id = childId;
  while (tree.flatTree[id].parent) {
    id = tree.flatTree[id].parent;

    if (id === parentId) {
      return true;
    }
  }

  return false;
}

function updateNode(tree, id, { parent, label }) {
  const node = tree.flatTree[id];

  if (!node) {
    throw new RestError({ status: 404, body: { error: 'Node not found!' } });
  }

  // eslint-disable-next-line eqeqeq
  if (parent !== undefined && parent != node.parent) {
    if (parent && !tree.flatTree[parent]) {
      throw new RestError({ status: 404, body: { error: 'Parent not found!' } });
    }

    if (parent && (parent === id || isChild(tree, id, parent))) {
      throw new RestError({ status: 400, body: { error: 'Cycle detected!' } });
    }

    // Remove the node from the old parent's children.
    const parentChildren = node.parent ? tree.flatTree[node.parent].ref.children : tree.deepTree;
    parentChildren.splice(parentChildren.findIndex((child) => child[id]), 1);

    // Add the node to the new parent's children.
    if (parent == null) {
      tree.deepTree.push({ [id]: node.ref });
    } else if (tree.flatTree[parent]) {
      tree.flatTree[parent].ref.children.push({ [id]: node.ref });
    }

    node.parent = parent;
  }

  if (label !== undefined) {
    if (!label) {
      throw new RestError({ status: 400, body: { error: 'Label is requried!' } });
    }

    node.ref.label = label;
  }

  return { id };
}

function deleteNodeChildren(tree, node) {
  const id = Object.keys(node)[0];

  node[id].children.forEach((child) => {
    deleteNodeChildren(tree, child);
  });

  // eslint-disable-next-line no-param-reassign
  delete tree.flatTree[id];
}

function deleteNode(tree, id, keepChildren = false) {
  const node = tree.flatTree[id];

  if (!node) {
    throw new RestError({ status: 404, body: { error: 'Node not found!' } });
  }

  // Remove the node from the parent's children.
  const parentChildren = node.parent ? tree.flatTree[node.parent].ref.children : tree.deepTree;

  parentChildren.splice(parentChildren.findIndex((child) => child[id]), 1);

  if (keepChildren) {
    node.ref.children.forEach((child) => {
      const childId = Object.keys(child)[0];
      // eslint-disable-next-line no-param-reassign
      tree.flatTree[childId].parent = node.parent;

      parentChildren.push(child);
    });
  } else {
    deleteNodeChildren(tree, { [id]: node.ref });
  }

  // Remove the node from the flatTree cache
  // eslint-disable-next-line no-param-reassign
  delete tree.flatTree[id];
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
exports.getNode = getNode;
exports.updateNode = updateNode;
exports.deleteNode = deleteNode;
