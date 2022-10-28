// import icons from 'url:../../img/icons.svg';
import View from './View';
import previewView from './previewView';

class ResultsView extends View {
  _parentEl = document.querySelector(`.results`);
  _errMsg = 'No recipes found for your query!';

  _markupMainContent() {
    return this._data.map(res => previewView.render(res, false)).join('');
  }
}

export default new ResultsView();