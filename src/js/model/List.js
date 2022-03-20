import uniqid from "uniqid";
export default class list {
  constructor() {
    this.items = [];
  }
  deleteItem(id) {
    //find index of elements for massiv
    const index = this.items.findIndex((el) => el.id === id);
    this.items.splice(index, 1);
  }
  addItem(item) {
    let newItem = {
      id: uniqid(),
      item,
    };
    this.items.push(newItem);
    return newItem;
  }
}
