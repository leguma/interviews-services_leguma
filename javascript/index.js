const express = require('express');
const { v4: uuidv4 } = require('uuid');


const app = express();
const port = 3001;

// The full tree representation.
// If using a NoSQL DB, this could easily be the representation of the actual DB.
let tree = []

// A flattened tree representation, for fast access to individual nodes.
// The elements in the flatTree are deep references to the tree representation; 
//   e.g. modifying them will update the tree object above.
// If using an RDB, this could be easily be the representation of the actual DB (or close to it).
let flatTree = {}

// ASSUMPTION 1: Only 1 instance of this service is running and no other means of updating the tree exist.
//             If parallel support is required, the app would need to resync the tree each time.
//             Refetching could be a always grabbing the latest from the DB or perhaps checking if any updates occurred.
const addElement = ({id, parent, label}) => {
    // For the sake of testing and tree rebuilding, we'll allow user-provided ids.
    id = id || uuidv4()
    let node = {
        label,
        children: []
    }

    if (parent == null) {
        // Attempt to add a root node
        if (tree.length != 0) {
            // ASSUMPTION 2: The tree represented can only have 1 element at the root level.
            //   There's not really any technical reason for this; the requirements did not call for 
            //   it specifically, but "sort of" hinted at this in the example tree structure. 
            //   To allow >1 root-level element, we would just allow this insert.
            return { error: "Root node already exists!" }
        }

        tree.push({ [id]: node })
    } else if (flatTree[parent]) {
        flatTree[parent].children.push({ [id]: node })
    } else {
        return { error: "Parent not found!" }
    }

    flatTree[id] = node

    return { id }
}

// TODO: Tree initialization from whatever storage. See examples below.

// ====================NoSQL====================
// For a NoSQL DB, we would flatten the DB here.
/*
tree = getTreeFromDB()

function flattenTree(children) {
    children.forEach(node => {
        Object.assign(flatTree, node)
        flattenTree(node.children)
    })
}

flattenTree(tree)
*/

// ====================RDB====================
// For an RDB, we would construct the deep tree here.
// Each DB record would likely be something like: {id, parent, label}
// ASSUMPTION 2.1: The DB's data is valid (has <=1 root, no orphan nodes).
//   Having >1 root or orphan nodes would not cause errors here, but it doesn't validate the data currently.
//   Allowing >1 root is as easy as changing "find" to "filter" and calling root.forEach(e => rebuildTree(e)) instead.
/*

let records = getAllRecordsFromDB()

// Find the root.
let root = records.find(node => node.parent == null)

function rebuildTree(node) {
    addElement(node)

    records.filter(record => record.parent == node.id).forEach(child => rebuildTree(child))
}

(root != null) && rebuildTree(root)
*/

// TODO: Use REST statuses for errors
// TODO: JSON Body validation
app.use(express.json());
app.get('/', (req, res) => res.send("Couldn't see the forest for the trees!"));
app.get('/api/tree', (req, res) => res.send(tree))
app.post('/api/tree', (req, res) => res.send(addElement(req.body)))

app.listen(port, () => console.log(`Tree API listening on port ${port}!`));
