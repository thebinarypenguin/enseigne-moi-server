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

    while (currentNode !== null) {
      if (currentNode.val.id === node.val.id) {
        let nextNodeCopy = currentNode.next;

        // currentNode is the first item
        if (previousNode === null) {
          currentNode.next = currentNode.next.next;
          nextNodeCopy.next = currentNode;
          this.head = nextNodeCopy;

          return;
        }

        // currentNode is the last item
        if (currentNode.next === null) {
          return;
        }

        // currentNode is somewhere in the middle
        currentNode.next = currentNode.next.next;
        nextNodeCopy.next = currentNode;
        previousNode.next = nextNodeCopy;

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
