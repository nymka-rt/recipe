require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import {
  renderRecipe,
  clearRecipe,
  highlightSelectedRecipe,
} from "./view/recipeView";
/**
 * Web app
 */

const state = {};
/**
 * search controller
 */
const controlSearch = async () => {
  //1) import key of search from web
  const query = searchView.getInput();
  if (query) {
    //2) Create new object
    state.search = new Search(query);
    //3) Working Ui
    searchView.clearSearchQuery();
    searchView.clearSearchResult();
    renderLoader(elements.searchResultDiv);
    //4) Finish search method
    await state.search.doSearch();
    //5) Display　result
    clearLoader();
    state.search.result === undefined
      ? alert("search is UNDEFINED...")
      : searchView.renderRecipes(state.search.result);
  }
};
elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  controlSearch();
});
elements.pageButtons.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    const gotoPageNumber = parseInt(btn.dataset.goto, 10);
    searchView.clearSearchResult();
    searchView.renderRecipes(state.search.result, gotoPageNumber);
  }
});

/**
 * recipe controller
 */
const controlRecipe = async () => {
  //1) Get ID from URL
  const id = window.location.hash.replace("#", "");
  //2) Create model of recipe
  state.recipe = new Recipe(id);
  //3) Create UI
  clearRecipe();
  renderLoader(elements.recipeDiv);
  highlightSelectedRecipe(id);
  //4) Download recipe
  await state.recipe.getRecipe();
  //5) Calculate time
  clearLoader();
  state.recipe.calcTime();
  state.recipe.calcPeople();
  //6) Display recipe
  renderRecipe(state.recipe);
};
window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);
