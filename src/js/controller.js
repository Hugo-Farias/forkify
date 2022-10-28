import * as model from './model.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView';
import addRecipeView from './views/addRecipeView';
import { MODAL_CLOSE_TIME } from './config';

// Parcel hot reload //
/*if (module.hot) {
  module.hot.accept();
}*/

const controlRecipes = async function() {
  const id = window.location.hash.slice(1);

  if (!id) return;

  recipeView.renderSpinner();

  // 1) Loading recipe
  try {
    await model.loadRecipe(id);

    // 2) Rendering it
    recipeView.render(model.state.recipe);

    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmarks);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function() {
  const query = searchView.getQuery();

  if (!query) return;

  resultsView.renderSpinner();
  try {
    await model.loadSearchResults(query);
    searchView.clearInput();
  } catch (e) {
    resultsView.renderError(e);
  }

  resultsView.render(model.getSearchResultPage(1));
  paginationView.render(model.state.search);
};

const controlPagination = function(goToPage) {
  resultsView.render(model.getSearchResultPage(goToPage));
  paginationView.render(model.state.search);
};

const controlServings = function(btn) {
  if (btn === 0) return;

  model.updateServings(btn);

  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function() {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.removeBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);
    bookmarksView.render(model.state.bookmarks);

    // change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    addRecipeView.renderMsg();

    setTimeout(function() {
      addRecipeView.hideWindow();
    }, MODAL_CLOSE_TIME * 1000);
  } catch (e) {
    addRecipeView.renderError(e.message);
  } finally {
    setTimeout(() => addRecipeView.render(true), MODAL_CLOSE_TIME * 1500);
  }
};

const init = function() {
  recipeView.addHandlerRender(['hashchange', 'load'], controlRecipes);
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerCLick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();