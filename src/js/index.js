require("@babel/polyfill");
import Search from "./model/Search";
import { elements, renderLoader, clearLoader } from "./view/base";
import * as searchView from "./view/searchView";
/**
 * Web app
 */

const state = {};
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
