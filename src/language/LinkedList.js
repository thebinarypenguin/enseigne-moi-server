class Node {
  constructor(val, next) {
    this.val = val || null;
    this.next = next || null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }

  // Find Node with value val and move it down (away from head) one position
  moveDown(node) {

    let previousNode = null;
    let currentNode = this.head;

    // TODO need to be setting node.val.next too

    while (currentNode !== null) {

      if (currentNode.val.id === node.val.id) {

        let nextNodeCopy = currentNode.next;

        // currentNode is the first item
        if (previousNode === null) {

          currentNode.next     = currentNode.next.next;
          currentNode.val.next = currentNode.next.val.id;  // DB next

          nextNodeCopy.next     = currentNode;
          nextNodeCopy.val.next = nextNodeCopy.next.val.id; // DB next

          this.head          = nextNodeCopy;
          this.head.val.next = this.head.next.val.id;       // DB next

          return;
        }

        // currentNode is the last item
        if (currentNode.next === null) {
          return;
        }

        // currentNode is somewhere in the middle
        currentNode.next = currentNode.next.next;
        currentNode.val.next = currentNode.next.val.id;  // DB next

        nextNodeCopy.next = currentNode;
        nextNodeCopy.val.next = nextNodeCopy.next.val.id; // DB next

        previousNode.next = nextNodeCopy;
        previousNode.val.next =  previousNode.next.val.id; // DB next

        return;
      }

      previousNode = currentNode;
      currentNode = currentNode.next;
    }
  }

  insertFirst(item) {

    if (!this.head) {
      this.head = new Node(item, null);
    } else {
      this.head = new Node(item, this.head);
    }
  }
}

module.exports = LinkedList;




// const test = new LinkedList();

// test.insertFirst({
//   id: 5,
//   original: 'original 5',
//   translation: 'translation 5',
//   language_id: 1,
//   next: null,
// });

// test.insertFirst({
//   id: 4,
//   original: 'original 4',
//   translation: 'translation 4',
//   language_id: 1,
//   next: 5,
// });

// test.insertFirst({
//   id: 3,
//   original: 'original 3',
//   translation: 'translation 3',
//   language_id: 1,
//   next: 4,
// });

// test.insertFirst({
//   id: 2,
//   original: 'original 2',
//   translation: 'translation 2',
//   language_id: 1,
//   next: 3,
// });

// test.insertFirst({
//   id: 1,
//   original: 'original 1',
//   translation: 'translation 1',
//   language_id: 1,
//   next: 2,
// });

// function findNode(ll, id) {

//   let output;

//   let current = ll.head;

//   while (current !== null) {

//     if (current.val.id === id) {
//       output = current;
//     }
//     current = current.next;
//   }

//   return output;
// }

// console.log(JSON.stringify(test, null, 2))

// let n = findNode(test, 1);
// test.moveDown(n)
// test.moveDown(n)

// console.log(JSON.stringify(test, null, 2))
