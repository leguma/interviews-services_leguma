const { Tree, addNode } = require('./tree');

test('New Trees are empty', () => {
  const tree = new Tree();
  expect(tree.deepTree.length).toBe(0);
  expect(Object.keys(tree.flatTree).length).toBe(0);
});

test('addNode adds a root node when no parent is specified', () => {
  const tree = new Tree();
  const rootId = 'id';
  const rootLabel = 'root';
  const { id } = addNode(tree, { id: rootId, label: rootLabel });
  expect(id).toBe(rootId);
  expect(tree.deepTree.length).toBe(1);
  expect(tree.deepTree[0][rootId].label).toBe(rootLabel);
  expect(Object.keys(tree.flatTree).length).toBe(1);
  expect(tree.flatTree[rootId].ref.label).toBe(rootLabel);
});

test('Multiple root nodes can be added', () => {
  const tree = new Tree();
  const [rootId1, rootLabel1, rootId2, rootLabel2] = ['id1', 'root1', 'id2', 'root2'];
  const { id: id1 } = addNode(tree, { id: rootId1, label: rootLabel1 });
  const { id: id2 } = addNode(tree, { id: rootId2, label: rootLabel2 });
  expect(id1).toBe(rootId1);
  expect(id2).toBe(rootId2);
  expect(tree.deepTree.length).toBe(2);
  expect(tree.deepTree[0][rootId1].label).toBe(rootLabel1);
  expect(tree.deepTree[1][rootId2].label).toBe(rootLabel2);
  expect(Object.keys(tree.flatTree).length).toBe(2);
  expect(tree.flatTree[rootId1].ref.label).toBe(rootLabel1);
  expect(tree.flatTree[rootId2].ref.label).toBe(rootLabel2);
});

test('Unique IDs are generated for new nodes, if one is not provided', () => {
  const tree = new Tree();
  const [rootLabel1, rootLabel2] = ['root1', 'root2'];
  const { id: id1 } = addNode(tree, { label: rootLabel1 });
  const { id: id2 } = addNode(tree, { label: rootLabel2 });
  expect(id1).not.toBeNull();
  expect(id2).not.toBeNull();
  expect(id1).not.toBe(id2);
});

test('Child nodes can be added', () => {
  const tree = new Tree();
  const [rootLabel, childLabel1, childLabel2] = ['root', 'child1', 'child2'];
  const { id: rootId } = addNode(tree, { label: rootLabel });
  const { id: childId1 } = addNode(tree, { parent: rootId, label: childLabel1 });
  const { id: childId2 } = addNode(tree, { parent: rootId, label: childLabel2 });
  expect(tree.deepTree.length).toBe(1);
  expect(tree.deepTree[0][rootId].label).toBe(rootLabel);
  expect(tree.deepTree[0][rootId].children.length).toBe(2);
  expect(tree.deepTree[0][rootId].children[0][childId1].label).toBe(childLabel1);
  expect(tree.deepTree[0][rootId].children[1][childId2].label).toBe(childLabel2);
  expect(Object.keys(tree.flatTree).length).toBe(3);
  expect(tree.flatTree[rootId].ref.label).toBe(rootLabel);
  expect(tree.flatTree[childId1].ref.label).toBe(childLabel1);
  expect(tree.flatTree[childId2].ref.label).toBe(childLabel2);
});

test('Children can be infinitely nested', () => {
  const tree = new Tree();
  const [rootLabel, childLabel, grandChildLabel] = ['root', 'child', 'grandChild'];
  const { id: rootId } = addNode(tree, { label: rootLabel });
  const { id: childId } = addNode(tree, { parent: rootId, label: childLabel });
  const { id: grandChildId } = addNode(tree, { parent: childId, label: grandChildLabel });
  expect(tree.deepTree.length).toBe(1);
  expect(tree.deepTree[0][rootId].label).toBe(rootLabel);
  expect(tree.deepTree[0][rootId].children.length).toBe(1);
  expect(tree.deepTree[0][rootId].children[0][childId].label).toBe(childLabel);
  expect(tree.deepTree[0][rootId].children[0][childId].children.length).toBe(1);
  expect(tree.deepTree[0][rootId].children[0][childId]
    .children[0][grandChildId].label).toBe(grandChildLabel);
  expect(Object.keys(tree.flatTree).length).toBe(3);
  expect(tree.flatTree[rootId].ref.label).toBe(rootLabel);
  expect(tree.flatTree[childId].ref.label).toBe(childLabel);
  expect(tree.flatTree[grandChildId].ref.label).toBe(grandChildLabel);
});

test('Adding a child whose parent does not exist throws an error', () => {
  const tree = new Tree();
  expect(() => addNode(tree, { parent: 'bad', label: 'child' })).toThrow();
});

test('Adding a node without a label throws an error', () => {
  const tree = new Tree();
  expect(() => addNode(tree, { })).toThrow();
});

test('Adding a node with an id that already exists throws an error', () => {
  const tree = new Tree();
  const id = 'id';
  addNode(tree, { id, label: 'A' });
  expect(() => addNode(tree, { id, label: 'B' })).toThrow();
});
