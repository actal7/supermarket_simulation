class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export default class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  remove(node) {
    if (!this.head) return;

    if (this.head === node) {
      this.head = this.head.next;
      if (this.head === null) {
        this.tail = null;
      }
      this.length--;
      return;
    }

    let current = this.head;
    while (current.next && current.next !== node) {
      current = current.next;
    }

    if (current.next === node) {
      current.next = node.next;
      if (node === this.tail) {
        this.tail = current;
      }
      this.length--;
    }
  }
}
