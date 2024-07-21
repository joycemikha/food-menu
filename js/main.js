$(document).ready(function () {
  $('#offcanvasNavbar').on('show.bs.offcanvas', function () {
      $('.nav-item').addClass('animate__animated animate__backInUp ');
  });

  $('#offcanvasNavbar').on('hidden.bs.offcanvas', function () {
      $('.nav-item').removeClass('animate__animated animate__backInUp ');
  });
});

$(".openIcon").click(function(){
  $(".open").css("left", "0")
});

//search 

var search_name;

$(document).ready(function(){
$('.search-name').keyup(function(){
 search_name = $(".search-name").val();
console.log();
searchMeal(search_name);
});
});
var search_letter
$(document).ready(function(){
  $('.search-letter').keyup(function(){
  search_letter = $(".search-letter").val();
  console.log(search_letter);
  searchMealLetter(search_letter);
  });
  });

  async function searchMealLetter(search_letter) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${search_letter}`);
    const data = await response.json();
    displayResults(data.meals.slice(0, 20));
}
  async function searchMeal(search_name) {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search_name}`);
    const data = await response.json();
    displayResults(data.meals.slice(0, 20));
}

function displayResults(meals) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (meals) {
        meals.forEach(meal => {
            const mealCard = document.createElement('div');
            mealCard.className = 'col-3 ';
            mealCard.innerHTML = `
                <div class=" card mb-1 meal-pic">
                    <img src="${meal.strMealThumb}" class="card-img-top " alt="${meal.strMeal}" >
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2" data-meal-id="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
            `;
            resultsContainer.appendChild(mealCard);
        });
                document.querySelectorAll('.meal-layer').forEach(div => {
                div.addEventListener('click', function() {
                const mealId = this.getAttribute('data-meal-id');
                 getMealDetails(mealId);
            });
        });
    } else {
        resultsContainer.innerHTML = '<p class="text-center">No results found.</p>';
    }
}
async function getMealDetails(mealId) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  const data = await response.json();
  displayMealDetails(data.meals[0]);
}

function displayMealDetails(meal) {
  const resultsContainer = document.getElementById('results');
  const mealDetailsContainer = document.getElementById('meal-details');
  
  resultsContainer.classList.add('d-none');
  mealDetailsContainer.classList.remove('d-none');
  mealDetailsContainer.innerHTML = `
<div class="min-vh-100 position-relative">
        <div class="inner-loading-screen top-0 start-0 end-0 bottom-0 justify-content-center align-items-center" style="display: none;">
            <i class="fa fa-spinner fa-spin fa-5x"></i>
        </div>
        
        <div class="container text-white">
            <div class="row" >
    <div class="col-3">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p> ${meal.strInstructions} </p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                ${getIngredientsList(meal)}
                </ul>

                <h3>Tags :</h3>
             <ul class="list-unstyled d-flex g-3 flex-wrap">
                 
              <li class="alert alert-danger m-2 p-1">${meal.strTags}</li>
            
             </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success mb-5">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger mb-5">Youtube</a>
            </div></div>
        </div>

    </div>
  `;
}


function getIngredientsList(meal) {
  let ingredients = '';
  for (let i = 1; i <= 20; i++) {
      if (meal[`strIngredient${i}`]) {
          ingredients += `<li class=" alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
      } else {
          break;
      }
  }
  return ingredients;
}
function goBack() {
  document.getElementById('results').classList.remove('d-none');
  document.getElementById('meal-details').classList.add('d-none');
}

//categories
async function fetchCategories() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php');
  const data = await response.json();
  displayCategories(data.categories);
}

function displayCategories(categories) {
  const categoriesContainer = document.getElementById('categories');
  categories.forEach(category => {
      const categoryCard = document.createElement('div');
      categoryCard.className = 'col-3';
      categoryCard.innerHTML = `
                <div class="card mb-4 meal-pic ">
                    <img src="${category.strCategoryThumb}" class="card-img-top " alt="${category.strCategory}" >
                    <div class="overflow-hidden meal-layer position-absolute align-items-center text-black p-2" data-category="${category.strCategory}">
                        <h3 class="">${category.strCategory}</h3>
                    <p class="">${category.strCategoryDescription.substring(0, 150)}...</p>
                    </div>
                </div>
      `;
      categoriesContainer.appendChild(categoryCard);
  });
    // Add click event listener to category cards
    document.querySelectorAll('.meal-layer').forEach(div => {
      div.addEventListener('click', function() {
          const category = this.getAttribute('data-category');
          fetchCategoryMeals(category);
      });
  });
}

async function fetchCategoryMeals(category) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  const data = await response.json();
  displayResults(data.meals.slice(0, 20));
  $("#categories").hide();
}
// areas
async function fetchAreas() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
  const data = await response.json();
  displayAreas(data.meals.slice(0, 20));
}

function displayAreas(areas) {
  const areasContainer = document.getElementById('areas');
  areasContainer.innerHTML = ''; // Clear previous areas content

  areas.forEach(area => {
      const areaCard = document.createElement('div');
      areaCard.className = 'col-3';
      areaCard.innerHTML = `
          <div class="card  border-0 text-center cursor-pointer"  data-bs-theme="dark" data-area="${area.strArea}">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h5 class="card-title">${area.strArea}</h5>
          </div>
      `;
      areasContainer.appendChild(areaCard);
  });

  // Add click event listener to area cards
  document.querySelectorAll('.card[data-area]').forEach(div => {
      div.addEventListener('click', function() {
          const area = this.getAttribute('data-area');
          fetchAreaMeals(area);
      });
  });
}

async function fetchAreaMeals(area) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  const data = await response.json();
  displayResults(data.meals.slice(0, 20));
  $("#areas").hide();

}
//fetch Ingredients
async function fetchIngredients() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
  const data = await response.json();
  displayIngredients(data.meals.slice(0, 20)); 
}

function displayIngredients(ingredients) {
  const ingredientsContainer = document.getElementById('ingredients');
  ingredientsContainer.innerHTML = ''; // Clear previous ingredients

  ingredients.forEach(ingredient => {
      const ingredientCard = document.createElement('div');
      ingredientCard.className = 'col-3';
      ingredientCard.innerHTML = `
          <div  data-bs-theme="dark" class="border-0 card mb-4 rounded-2 text-center cursor-pointer" data-ingredient="${ingredient.strIngredient}">
              <div class="card-body">
                 <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                  <h5 class="card-title">${ingredient.strIngredient}</h5>
                  <p class="card-text">${ingredient.strDescription ? ingredient.strDescription.substring(0, 100) : 'No description available'}...</p>
              </div>
          </div>
      `;
      ingredientsContainer.appendChild(ingredientCard);
  });
  document.querySelectorAll('.card[data-ingredient]').forEach(card => {
    card.addEventListener('click', function() {
        const ingredient = this.getAttribute('data-ingredient');
        fetchIngredientMeals(ingredient);
    });
});
}

async function fetchIngredientMeals(ingredient) {
  const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
  const data = await response.json();
  displayResults(data.meals.slice(0, 20));
  $("#ingredients").hide();
}

fetchCategories();
fetchAreas();
fetchIngredients();
async function fetchInitialMeals() {
  const response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
  const data = await response.json();
  displayInitialMeals(data.meals.slice(0, 20)); 
}

function displayInitialMeals(meals) {
  const initialMealsContainer = document.getElementById('initial-meals');
  if (meals) {
      meals.forEach(meal => {
          const mealCard = document.createElement('div');
          mealCard.className = 'col-3';
          mealCard.innerHTML = `
                <div class=" card mb-1 meal-pic">
                    <img src="${meal.strMealThumb}" class="card-img-top " alt="${meal.strMeal}" >
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2" data-meal-id="${meal.idMeal}">
                        <h3>${meal.strMeal}</h3>
                    </div>
                </div>
          `;
          initialMealsContainer.appendChild(mealCard);
      });

      // Add click event listener to meal card images
      document.querySelectorAll('.meal-layer').forEach(div => {
        div.addEventListener('click', function() {
              const mealId = this.getAttribute('data-meal-id');
              getMealDetails(mealId);
          });
      });
  } else {
      initialMealsContainer.innerHTML = '<p class="text-center">No results found.</p>';
  }
}

fetchInitialMeals();

$(document).ready(function() {
  function inputsValidation() {
      const isValidName = validateName();
      const isValidEmail = validateEmail();
      const isValidPhone = validatePhone();
      const isValidAge = validateAge();
      const isValidPassword = validatePassword();
      const isValidRepassword = validateRepassword();

      if (isValidName && isValidEmail && isValidPhone && isValidAge && isValidPassword && isValidRepassword) {
          $('#submitBtn').prop('disabled', false);
      } else {
          $('#submitBtn').prop('disabled', true);
      }
  }

  function validateName() {
      const nameInput = $('#nameInput').val();
      const regex = /^[A-Za-z\s]+$/;
      if (!regex.test(nameInput)) {
          $('#nameAlert').show();
          return false;
      } else {
          $('#nameAlert').hide();
          return true;
      }
  }

  function validateEmail() {
      const emailInput = $('#emailInput').val();
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(emailInput)) {
          $('#emailAlert').show();
          return false;
      } else {
          $('#emailAlert').hide();
          return true;
      }
  }

  function validatePhone() {
      const phoneInput = $('#phoneInput').val();
      const regex = /^[0-9]{10,15}$/;
      if (!regex.test(phoneInput)) {
          $('#phoneAlert').show();
          return false;
      } else {
          $('#phoneAlert').hide();
          return true;
      }
  }

  function validateAge() {
      const ageInput = $('#ageInput').val();
      if (ageInput < 18 || ageInput > 100) {
          $('#ageAlert').show();
          return false;
      } else {
          $('#ageAlert').hide();
          return true;
      }
  }

  function validatePassword() {
      const passwordInput = $('#passwordInput').val();
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!regex.test(passwordInput)) {
          $('#passwordAlert').show();
          return false;
      } else {
          $('#passwordAlert').hide();
          return true;
      }
  }

  function validateRepassword() {
      const repasswordInput = $('#repasswordInput').val();
      const passwordInput = $('#passwordInput').val();
      if (repasswordInput !== passwordInput) {
          $('#repasswordAlert').show();
          return false;
      } else {
          $('#repasswordAlert').hide();
          return true;
      }
  }

  $('input').on('keyup', function() {
      inputsValidation();
  });
});
