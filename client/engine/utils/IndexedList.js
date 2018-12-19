export default class IndexedList {
  _index = {}
  _array = []
  _mightNeedSort = false

  constructor(options = {}) {
    options.idField = options.idField || 'id'
    this.options = options
  }

  push(item) {
    const id = this._getItemId(item)
    if (this._index[id]) {
      return
    }

    this._array = [...this._array, item]
    this._index[id] = { value: item, arrayIndex: this._array.length - 1 }

    this._mightNeedSort = true
  }

  get(id) {
    if (!this._index[id]) {
      return null
    }

    return this._index[id].value
  }

  update(item) {
    const id = this._getItemId(item)
    if (!this._index[id]) {
      this.push(item)
      return
    }

    this._array[this._index[id].arrayIndex] = item
    this._array = [...this._array]
    this._index[id].value = item

    this._mightNeedSort = true
  }

  delete(id) {
    if (!this._index[id]) {
      return
    }

    const { arrayIndex } = this._index[id]
    this._array.splice(arrayIndex, 1)
    for (let i = arrayIndex; i < this._array.length; i++) {
      const itemId = this._getItemId(this._array[i])
      this._index[itemId].arrayIndex--
    }

    delete this._index[id]
  }

  reset() {
    this._index = {}
    this._array = []
  }

  getArray() {
    return this._array
  }

  sort() {
    if (!this.options.sort || !this._mightNeedSort) {
      return
    }

    this._array = this.options.sort(this._array)
    for (const [index, item] of Object.entries(this._array)) {
      const id = this._getItemId(item)
      this._index[id].arrayIndex = index
    }

    this._mightNeedSort = false
  }

  _getItemId(item) {
    return item[this.options.idField]
  }
}
