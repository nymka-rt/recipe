require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
import Recipe from "./model/Recipe";
import List from "./model/List";
import * as listView from "./view/listView";
import * as likesView from "./view/likesView";
import Like from "./model/Like";

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
  if (!state.likes) state.likes = new Like();
  if (id) {
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
    renderRecipe(state.recipe, state.likes.isLiked(id));
  }
};
// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
["hashchange", "load"].forEach((e) =>
  window.addEventListener(e, controlRecipe)
);
window.addEventListener("load", (e) => {
  if (!state.likes) state.likes = new Like();

  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
  state.likes.likes.forEach((like) => likesView.renderLike(like));
});
/**
 * list controller
 */

const controlList = () => {
  state.list = new List();
  listView.clearItems();
  state.recipe.ingredients.forEach((n) => {
    const item = state.list.addItem(n);
    listView.renderItem(item);
  });
};
/**
 * like Controller;
 */
const controlLike = () => {
  //1) create likemodel
  if (!state.likes) state.likes = new Like();
  const currentRecipeId = state.recipe.id;
  if (state.likes.isLiked(currentRecipeId)) {
    state.likes.deleteLike(currentRecipeId);
    likesView.deleteLike(currentRecipeId);
    likesView.toggleLikeBtn(false);
  } else {
    const newLike = state.likes.addLike(
      currentRecipeId,
      state.recipe.title,
      state.recipe.publisher,
      state.recipe.image_url
    );
    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
  }
  likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};

elements.recipeDiv.addEventListener("click", (e) => {
  if (e.target.matches(".recipe__btn, .recipe__btn *")) {
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe *")) {
    controlLike();
  }
});

elements.shoppingList.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;
  //delete item function
  state.list.deleteItem(id);
  listView.deleteItem(id);
});
