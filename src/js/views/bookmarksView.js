import View from './View';
import previewView from './previewView';

class BookmarksView extends View {
  _parentEl = document.querySelector(`.bookmarks__list`);
  _errMsg = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  addHandlerRender(action) {
    window.addEventListener('load', action);
  }

  _markupMainContent() {
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new BookmarksView();
