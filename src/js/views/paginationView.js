import View from './View';
import icons from 'url:../../img/icons.svg';
import * as model from '../model';
import resultsView from './resultsView';

class PaginationView extends View {
  _parentEl = document.querySelector(`.pagination`);


  addHandlerCLick(action) {
    this._parentEl.addEventListener('click', function(e) {
      const tgt = e.target.closest('.btn--inline');

      if (!tgt) return;

      const goto = +tgt.dataset.goto;

      action(goto);
    });
  }

  _markupMainContent() {
    let output = '';
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const currPage = this._data.page;

    if (numPages <= 1) return '';

    if (currPage !== 1)
      output += this._markupPageBack();

    if (numPages !== currPage)
      output += this._markupPageForward();

    return output;
  }

  _markupPageForward() {
    const nextPag = this._data.page + 1;
    return `
      <button data-goto='${nextPag}' class='btn--inline pagination__btn--next'>
        <span>Page ${nextPag}</span>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-right'></use>
        </svg>
      </button>
        `;
  }

  _markupPageBack() {
    const prevPag = this._data.page - 1;
    return `
      <button data-goto='${prevPag}' class='btn--inline pagination__btn--prev'>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-left'></use>
        </svg>
        <span>Page ${prevPag}</span>
      </button>`;

  }
}

export default new PaginationView();