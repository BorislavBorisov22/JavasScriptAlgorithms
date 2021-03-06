const AvlTree = require('../../../src/data-structures/trees/avl-tree');

const { expect } = require('chai');

describe('AvlTree', () => {
    let tree = new AvlTree();

    beforeEach(() => {
        tree = new AvlTree((a, b) => a - b);
    });

    describe('insert', () => {
        it('expect to insert values correctly and remain a valid AVL tree', () => {
            tree.insertMany(4, 1, 17, 22);

            tree.insert(18); // left right case
            tree.insert(44); // left left case
            tree.insertMany(0, -1); // right right case
            tree.insertMany(20, 40, 42); // right left case

            const root = tree.root;

            expect(root.value).to.equal(18, 'root value');
            expect(root.height).to.equal(4, 'root height');

            expect(root.right.value).to.equal(22, 'right child value');
            expect(root.right.height).to.equal(3, 'right child height');

            expect(root.right.left.value).to.equal(20, 'right left child value');
            expect(root.right.left.height).to.equal(1, 'right left child height');

            expect(root.right.right.value).to.equal(42, 'right right child value');
            expect(root.right.right.height).to.equal(2, 'right right child height');

            expect(root.right.right.left.value).to.equal(40, 'right right left child value');
            expect(root.right.right.left.height).to.equal(1, 'right right left child height');

            expect(root.right.right.right.value).to.equal(44, 'right right right child value');
            expect(root.right.right.right.height).to.equal(1, 'right right right child height');

            expect(root.left.value).to.equal(4, 'left child value');
            expect(root.left.height).to.equal(3, 'left child height');

            expect(root.left.right.value).to.equal(17, 'left right child value');
            expect(root.left.right.height).to.equal(1, 'left right child height');

            expect(root.left.left.value).to.equal(0, 'left left child value');
            expect(root.left.left.height).to.equal(2, 'left left child height');

            expect(root.left.left.right.value).to.equal(1, 'left left right child value');
            expect(root.left.left.right.height).to.equal(1, 'left left right child height');

            expect(root.left.left.left.value).to.equal(-1, 'left left left child value');
            expect(root.left.left.left.height).to.equal(1, 'left left left child height');
        });

        it('expect to increase size correctly when new elements are added', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);
            expect(tree.size).to.equal(11);
        });

        it('expect not to change tree size when trying to insert an existing value', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);
            tree.insertMany(22, 4, 1, 17);
            expect(tree.size).to.equal(11);
        });
    });

    describe('inOrder', () => {
        it('expect to traverse the tree in sorted order based on the cmp function', () => {
            const values = [4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42];
            tree.insertMany(...values);

            let inOrder = [];
            tree.inOrder((node) => inOrder.push(node.value));

            expect(inOrder).to.deep.equal(values.slice().sort((a, b) => a - b));
        });
    });

    describe('remove', () => {

        it('expect to remove values correctly and remain a valid Avl tree structure', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);

            // expected different rotations to happen after removal
            tree.remove(17); // right right case
            tree.remove(-1); // right left case
            tree.remove(20); // left left case
            tree.remove(44); // left right case

            const root = tree.root;

            expect(root.value).to.equal(18, 'root value');
            expect(root.height).to.equal(3, 'root height');

            expect(root.right.value).to.equal(40, 'right child value');
            expect(root.right.height).to.equal(2, 'right child height');

            expect(root.right.right.value).to.equal(42, 'right right child value');
            expect(root.right.right.height).to.equal(1, 'right right child height');

            expect(root.right.left.value).to.equal(22, 'right left child value');
            expect(root.right.right.height).to.equal(1, 'right left child height');

            expect(root.left.value).to.equal(1, 'left child value');
            expect(root.left.height).to.equal(2, 'left child height')

            expect(root.left.right.value).to.equal(4, 'left right child value');
            expect(root.left.right.height).to.equal(1, 'left right child height');

            expect(root.left.left.value).to.equal(0, 'left left child value');
            expect(root.left.right.height).to.equal(1, 'left left child height');
        });

        it('expect to correctly decrease tree size when element removed successfully', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);

            expect(tree.size).to.equal(11);

            const removeValues = [44, 20, 22, 18, 1, 4, 0, -1, 17, 40, 42];
            removeValues.forEach((v, index) => {
                tree.remove(v);
                expect(tree.size).to.equal(removeValues.length - 1 - index);
            });

            expect(tree.root).to.be.null;
        });

        it('expect not to change the tree size when trying to remove non-existing element', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);

            tree.remove(1024);

            expect(tree.size).to.equal(11);
        });
    });

    describe('find', () => {
        it('expect to return the correct node when searching for existing value in the tree', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);

            let targetNode = tree.find(0);
            expect(targetNode).to.deep.equal(tree.root.left.left);

            targetNode = tree.find(40);
            expect(targetNode).to.deep.equal(tree.root.right.right.left);

            targetNode = tree.find(17);
            expect(targetNode).to.deep.equal(tree.root.left.right);

            targetNode = tree.find(42);
            expect(targetNode).to.deep.equal(tree.root.right.right);
        });

        it('expect to return null when searching for no-existing value in tree', () => {
            tree.insertMany(4, 1, 17, 22, 18, 44, 0, -1, 20, 40, 42);

            const targetNode = tree.find(33);

            expect(targetNode).to.be.null;
        });
    });
});
