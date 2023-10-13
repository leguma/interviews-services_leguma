# Running the service

Before you get started, make sure you have node installed and configured correctly. 

To build, open your terminal and navigate to the `javascript` directory in this project and run `npm install`.

To start your server, run `node index.js`.  Open up your favorite browser and navigate to http://localhost:3001/ and you should see "Couldn't see the forest for the trees!".

To run tests for the project, run `npm test`.

To lint the project, run `npm run lint`.

To lint the project and fix automatically, run `npm run lint-fix`.

# Design Choices

## Flat and deep tree representations.

Returning the full tree with GET is obviously most easily supported by storing the tree representation in the same format. However, the main issue with the deep tree represntation is that performing mutations to it is fairly challenging. For example, to support CRUD operations on individual nodes, one would have to search the tree for the given node. While not particularly challenging to do, if the tree grows very large, this search operation could get expensive, especially since the tree is not ordered in any way.

An easy solution for jumping to nodes is with a hashmap representation. Each node has a unique ID, so a flattened map means instant access. While you could have 2 completely separate instances of flattened and expanded trees, any C-UD operations would still have to operate on both, thereby eliminating the usefulness of the flatmap. As such, the flatmap's entries should be deep references to the nodes themselves (or at the very least, their children).

This choice is why adding root nodes perform the operation:

`tree.push({ [id]: node });`

and leaf nodes use:

`flatTree[parent].children.push({ [id]: node });`

and both add to the flatmap:

`flatTree[id] = node;`

# Assumptions

Some places impacted in code by these assumptions have comments, such as `// ASSUMPTION 1`

ASSUMPTION 1: Only 1 instance of this service is running and no other way of updating the tree exists. If parallel support is required, the app would need to resync the tree each time. Refetching could be always grabbing the latest or perhaps checking if any updates occurred.

ASSUMPTION 2: The DB's data is valid (no orphan nodes). Having >1 orphan nodes would not cause errors, but it doesn't validate the data currently.