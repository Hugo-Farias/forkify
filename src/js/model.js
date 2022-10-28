import { API_KEY, API_URL, ITEMS_PER_PAGE } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: ITEMS_PER_PAGE
  },
  bookmarks: []
};

const storeBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));

};

const createRecipeObject = function(data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key })
  };
};

export const loadRecipe = async function(id) {
  try {

    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    state.recipe.bookmarked = state.bookmarks.some(i => i.id === id);

  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;

    const { data } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key })
      };
    });
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(i => {
    i.quantity = (i.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const getSearchResultPage = function(page = state.search.page) {
  state.search.page = page;

  const start = ITEMS_PER_PAGE * (page - 1);
  const end = ITEMS_PER_PAGE * page;

  return state.search.results.slice(start, end);
};

export const addBookmark = function(recipe) {
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  storeBookmarks();
};

export const removeBookmark = function(id) {
  const index = state.bookmarks.findIndex(i => i.id === id);

  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  storeBookmarks();
};

/*const clearBookmarks = function() {
  localStorage.clear();
};

clearBookmarks();*/

export const uploadRecipe = async function(newRecipe) {
  try {
    // console.log(Object.entries(newRecipe));
    const ingredients = Object.entries(newRecipe).filter(e => e[0].startsWith('ingredient') && e[1] !== '').map(ing => {

      const ingArr = ing[1].split(',').map(i => i.trim());

      if (ingArr.length !== 3) throw new Error('Wrong ingredient format. Please use the correct format.');


      const [quantity, unit, description] = ingArr;

      return { quantity: +quantity || null, unit, description };
    });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: newRecipe.servings,
      ingredients: ingredients
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }

};

const init = function() {
  const storage = localStorage.getItem('bookmarks');

  if (storage) state.bookmarks = JSON.parse(storage);
};

init();