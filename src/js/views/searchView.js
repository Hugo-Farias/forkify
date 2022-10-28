class SearchView {
  _parentEl = document.querySelector(`.search`);
  _listEl = document.querySelector(`.results`);
  _searchQuery = document.querySelector(`.search__field`);

  getQuery() {
    const urlSearch = window.location.search.slice(1);
    let query = this._searchQuery.value;
    if (!query && urlSearch) return urlSearch;
    window.history.replaceState(null, '', `?${query}${window.location.hash}`);
    return query;
  }

  addHandlerSearch(action) {
    this._parentEl.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!this._searchQuery.value) return;
      action();
    });

    window.addEventListener('load', action);
  }

  clearInput() {
    this._searchQuery.value = '';
    this._searchQuery.blur();

  }
}

export default new SearchView();