import Rest from './Rest'
import IndexedList from './IndexedList'
import regeneratorRuntime from './regeneratorRuntime'

export default class InfiniteScrollList {
  _indexedItems = null;
  _meta = {
    totalCount: 0,
    totalPage: 0,
    perPage: 0,
  }
  _stats = [];

  constructor(options = { requestFunction: null, path: null, params: null }) {
    options.params.itemIndex = options.params.itemIndex || 1
    options.params.perPage = options.params.perPage || 20
    options.idField = options.idField || 'id'
    this._options = options
    this._indexedItems = new IndexedList()
  }

  loadMore = async () => {
    const ignoreLoading = true
    this._options.params.itemIndex = this.getArray().length + 1
    let result = null
    if (this._options.path) {
      const config = { params: this._options.params }
      config.ignoreLoading = ignoreLoading
      result = await Rest.get(this._options.path, config)
    } else if (this._options.requestFunction) {
      result = await this._options.requestFunction(this._options.params, ignoreLoading)
    }

    if (result) {
      result.items.forEach((item) => {
        this.push(item)
      })

      this._meta = result._meta
      this._stats = result.stats
    }
  }

  push = (item) => {
    this._indexedItems.push(item)
  }

  delete = (id) => {
    this._indexedItems.delete(id)
  }

  deleteItems = (ids) => {
    for (const id of ids) {
      this.delete(id)
    }
  }

  reset = () => {
    this._indexedItems.reset()
  }

  getArray = () => {
    return this._indexedItems.getArray()
  }

  getTotalCount = () => {
    return this._meta.totalCount
  }

  getPerPage = () => {
    return this._meta.perPage
  }

  getTotalPage = () => {
    return this._meta.totalPage
  }

  getCurrentCount = () => {
    return this.getArray().length
  }

  getStats = () => {
    return this._stats
  }

  hasMoreData = () => {
    return this.getCurrentCount() < this.getTotalCount()
  }
}
