import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the recieved object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Hugo Farias
   * @todo Finish imoplementation
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError();

    this._data = data;

    if (!render) return this._markupMainContent();

    this._parentEl.innerHTML = this._markupMainContent();
  }

  update(data) {

    this._data = data;
    const newMarkup = this._markupMainContent();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll(`*`));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (!curEl) return;

      if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(attr => curEl.setAttribute(attr.name, attr.value));
      }

    });
  }

  renderSpinner() {
    const markup = `
    <div class='spinner'>
      <svg>
        <use href='${icons}#icon-loader'></use>
      </svg>
    </div>
`;
    this._parentEl.innerHTML = markup;
  };

  /**
   *
   * @param {string} err if no arg input, renders default error message
   * @return {string} Markup string.
   */
  renderError(err = this._errMsg) {
    const markup = `
    <div class='error'>
      <div>
        <svg>
          <use href='${icons}#icon-alert-triangle'></use>
        </svg>
      </div>
      <p>${err}</p>
    </div>
    `;

    this._parentEl.innerHTML = markup;
  }

  renderMsg(msg = this._msg) {
    const markup = `
    <div class='message'>
      <div>
        <svg>
          <use href='${icons}#icon-smile'></use>
        </svg>
      </div>
      <p>${msg}</p>
    </div>
    `;

    this._parentEl.innerHTML = markup;
  }
}