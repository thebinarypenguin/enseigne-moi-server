class Node {
  constructor(val, next) {
    this.val = val || null;
    this.next = next || null;
  }
}

class List {
  constructor() {
    this.head = null;
  }
  // Find Node with value val and move it down (away from head) one position
  moveDown(list, id) {
    let previousNode = null;
    let currentNode = list.head;

    while (currentNode !== null) {
      if (currentNode.val.id === id) {
        let nextNodeCopy = currentNode.next;

        // currentNode is the first item
        if (previousNode === null) {
          currentNode.next = currentNode.next.next;
          nextNodeCopy.next = currentNode;
          list.head = nextNodeCopy;

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
}
function insertFirst(list, item) {
  if (!list.head) {
    list.head = item;
  } else {
    let oldHead = this.head;
    item = this.head;
    this.head.next = oldHead;
  }
}

function insertLast(list, item) {
  if (!list.head) {
    insertFirst(list, item);
  } else {
    let currentNode = list.head;
    while (currentNode.next !== null) {
      currentNode = currentNode.next;
    }
    currentNode.next = item;
  }
}

function display(list) {
  let currentNode = list.head;

  while (currentNode !== null) {
    if (currentNode.next === null) {
      console.log(`val: ${currentNode.val}, next: (null)`);
    } else {
      console.log(`val: ${currentNode.val}, next: ${currentNode.next.val}`);
    }

    currentNode = currentNode.next;
  }
}

let listA = new List();

let five = new Node(5, null);
let four = new Node(4, five);
let three = new Node(3, four);
let two = new Node(2, three);
let one = new Node(1, two);

listA.head = one;

moveDown(listA, 3);

display(listA);

module.exports = { List, insertFirst, insertLast };
