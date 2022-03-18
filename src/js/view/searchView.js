import { create } from "lodash";
import { elements } from "./base";
const renderRecipe = (recipe) => {
  const markup = `
  <li>
  <a class="results__link " href="#${recipe.recipe_id}">
      <figure class="results__fig">
          <img src="${recipe.image_url}" alt="Test">
      </figure>
      <div class="results__data">
          <h4 class="results__name">${recipe.title}</h4>
          <p class="results__author">${recipe.publisher}</p>
      </div>
  </a>
</li>
  `;
  //linking html
  elements.searchResultList.insertAdjacentHTML("beforeend", markup);
};
export const clearSearchQuery = () => {
  elements.searchInput.value = "";
};
export const clearSearchResult = () => {
  elements.searchResultList.innerHTML = "";
  elements.pageButtons.innerHTML = "";
};
export const getInput = () => elements.searchInput.value;
export const renderRecipes = (recipe, currentPage = 1, resPerPage = 10) => {
  //display result of searching
  const start = (currentPage - 1) * resPerPage;
  const end = currentPage * resPerPage;
  recipe.slice(start, end).forEach(renderRecipe);
  const totalPages = Math.ceil(recipe.length / resPerPage);
  renderButtons(currentPage, totalPages);
};

const createButton = (page, type, direction) => `
<button class="btn-inline results__btn--${type}" data-goto=${page}>
<span>Хуудас ${page}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${direction}"></use>
</svg>
</button>
`;
const renderButtons = (currentPage, totalPages) => {
  let buttonHtml;
  if (currentPage === 1 && totalPages > 1) {
    //click page 2
    buttonHtml = createButton(2, "next", "right");
  } else if (currentPage < totalPages) {
    //go back
    buttonHtml = createButton(currentPage - 1, "prev", "left");
    buttonHtml += createButton(currentPage + 1, "next", "right");
  } else if (currentPage === totalPages) {
    buttonHtml = createButton(currentPage - 1, "prev", "left");
  }
  elements.pageButtons.insertAdjacentHTML("afterbegin", buttonHtml);
};
