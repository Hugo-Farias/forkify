import View from './View';
import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';


class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');
  _errorMsg = 'We could not find that recipe. Please try another one!';
  _successMsg = 'Success';

  addHandlerRender([...on], action) {
    on.forEach((ev) => window.addEventListener(ev, action));
  }

  addHandlerUpdateServings(action) {
    this._parentEl.addEventListener('click', function(e) {
      const tgt = e.target.closest('.btn--tiny');

      if (!tgt) return;

      action(+tgt.dataset.updateTo);
    });
  }

  addHandlerAddBookmark(action) {
    this._parentEl.addEventListener('click', (e) => {
      const tgt = e.target.closest('.btn--bookmark');

      if (!tgt) return;

      action();
    });
  }

  _markupMainContent() {
    const data = this._data;
    return `
    <figure class='recipe__fig'>
      <img src='${data.image}' alt='${data.title}' class='recipe__img' />
        <h1 class='recipe__title'>
          <span>${data.title}</span>
        </h1>
    </figure>

    <div class='recipe__details'>
      <div class='recipe__info'>
        <svg class='recipe__info-icon'>
          <use href='${icons}#icon-clock'></use>
        </svg>
        <span class='recipe__info-data recipe__info-data--minutes'>${data.cookingTime}</span>
        <span class='recipe__info-text'>minutes</span>
      </div>
      <div class='recipe__info'>
        <svg class='recipe__info-icon'>
          <use href='${icons}#icon-users'></use>
        </svg>
        <span class='recipe__info-data recipe__info-data--people'>${data.servings}</span>
        <span class='recipe__info-text'>servings</span>

        <div class='recipe__info-buttons'>
          <button data-update-to='${data.servings - 1}' class='btn--tiny btn--update-servings'>
            <svg>
              <use href='${icons}#icon-minus-circle'></use>
            </svg>
          </button>
          <button data-update-to='${data.servings + 1}' class='btn--tiny btn--update-servings'>
            <svg>
              <use href='${icons}#icon-plus-circle'></use>
            </svg>
          </button>
        </div>
      </div>
      <div class='recipe__user-generated ${data.key ? '': 'hidden'}'>
        <svg>
          <use href='${icons}#icon-user'></use>
        </svg>
      </div>
      <button class='btn--round btn--bookmark'>
        <svg class=''>
          <use href='${icons}#icon-bookmark${data.bookmarked ? '-fill' : ''}'></use>
        </svg>
      </button>
    </div>

    <div class='recipe__ingredients'>
      <h2 class='heading--2'>Recipe ingredients</h2>
      <ul class='recipe__ingredient-list'>
      ${data.ingredients.map(i => this._markupIngredients(i)).join('')}
      </ul>
    </div>

    <div class='recipe__directions'>
      <h2 class='heading--2'>How to cook it</h2>
      <p class='recipe__directions-text'>
        This recipe was carefully designed and tested by
        <span class='recipe__publisher'>${data.publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class='btn--small recipe__btn'
        href='${data.sourceUrl}'
        target='_blank'
      >
        <span>Directions</span>
        <svg class='search__icon'>
          <use href='${icons}#icon-arrow-right'></use>
        </svg>
      </a>
    </div>
    `;
  }

  _markupIngredients(ing) {
    return `
      <li class='recipe__ingredient'>
        <svg class='recipe__icon'>
          <use href='${icons}#icon-check'></use>
        </svg>
        <div class='recipe__quantity'>${ing.quantity ? new Fraction(ing.quantity).toString() : ''}</div>
        <div class='recipe__description'>
          <span class='recipe__unit'>${ing.unit}</span>
          ${ing.description}
        </div>
      </li>
`;
  }
}

export default new RecipeView();