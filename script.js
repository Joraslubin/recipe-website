
const searchBtn = document.querySelector("#search-btn")
const userInput = document.querySelector("#user-input")
const resultsContainer = document.querySelector("#search-results")
const slider = document.getElementById("featured-article-slider")
const featuredRecipeTemplate = document.querySelector("#featured-recipe-template")
const featuredRecipeContainer = document.querySelector("#featured-recipes-container")
const contentHeader = document.querySelector("#content-header > span")
let index = 0;
let interval;
let paused = false;


/*function that identifies the recipe card clicked on the homepage and display the correct recipe instructions page */

const redirectUser = (e)=>{
    localStorage.setItem("id",e.target.dataset.id)
}
/* Dinamically adding featured recipes on the homepage */
fetch("./featured-recipes.json")
    .then(res => res.json())
    .then(data => {

        const recipes = data.meals

        recipes.forEach(recipe => {

            const clone = featuredRecipeTemplate.content.cloneNode(true)

            clone.querySelector(".meal-image").src = recipe.img
            clone.querySelector(".meal-title").innerHTML = `<a href="./pages/recipe.html" class="recipe-link" data-id="${recipe.id}" target="_blank">${recipe.name}</a>`
            clone.querySelector(".meal-origin").innerText = recipe.origin

            featuredRecipeContainer.appendChild(clone)

        })

    })


/* Create search results cards */
class Card {

    constructor({ idMeal,strMeal, strMealThumb, strCategory, strArea }) {
        this.id = idMeal
        this.name = strMeal
        this.category = strCategory
        this.image = strMealThumb;
        this.origin = strArea;
    }

    display() {

        /* function to limit the length of the meal title */
        const formatName = (name) => name.indexOf(",") === -1 ? name : name.slice(0, name.indexOf(","))

        const cardElement = `<div class="card-main">
            <div class='card-main-image-container'>
            <img src='${this.image}' alt='${this.name}'>
            </div>
            <div class='card-recipe-details'>
            <p class='dish-origin'>${this.origin}</p>
            <div>
            <h2 class='dish-name'><a href="./pages/recipe.html" class="recipe-link" id="${this.id}" target="_blank" }>${formatName(this.name)}</a></h2>
            <p class='dish-category'>${this.category}</p> 
            </div>
            </div>
            </div>`

        resultsContainer.innerHTML += cardElement
    }
}




const showRecipe = (data) => {

    resultsContainer.innerHTML = ''

    for (const meal of data) {

        if (meal.strMealThumb) {

            const card = new Card(meal)

            card.display()

        }

    }

    contentHeader.innerText = "Search Results"
    featuredRecipeContainer.style.display = "none"
}


const searchRecipe = async () => {

    try {
        if (userInput.value === '') {
            alert('enter the name of the recipe your looking for')
            return;
        }

        const regx = /\W/g
        const searchStr = (userInput.value).replace(regx, '').toLowerCase()
        const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=" + searchStr

        const res = await fetch(url)
        const data = await res.json()

        data?.meals ? showRecipe(data.meals) : alert("recipe not found")

        userInput.value = ""
    }

    catch (error) {
        console.log(error)
    }

}



searchBtn.addEventListener("click", searchRecipe)
window.addEventListener("keydown", ({ key }) => {

    key === "Enter" ? searchRecipe() : ''
})


document.querySelectorAll(".homepage-card-container").forEach(container=>{

    container.addEventListener("click",(e)=>{
        console.log(e.target)
        })
})


/*slide between card in the sidebar manually*/

document.querySelectorAll("#featured-article-container > svg").forEach(icon => {

    icon.addEventListener("click", e => {

        const targetElement = e.target


        if (targetElement.id === "arrow-right") {

            paused = true

            index = index < 4 ? index + 1 : 4;

            slider.style.transform = `translateX(${index * (-20)}%)`

            setTimeout(() => { paused = false }, 1000)
        }

        else {

            paused = true

            index = index > 0 ? index - 1 : 0;

            slider.style.transform = `translateX(${index * (-20)}%)`
            setTimeout(() => { paused = false }, 1000)
        }
    })
})

/* slide between card in the sidebar automatically*/

const slide = () => {

    slider.style.transform = `translateX(-20%)`

}

function reArrange() {

    slider.append(slider.firstElementChild);
    slider.style.transition = 'none'
    slider.style.transform = "translateX(0)";
    setTimeout(() => {
        slider.style.transition = 'transform 1s'
    }, 0)

}

slider.addEventListener("transitionend", reArrange)

if (paused === false) {

    interval = setInterval(slide, 5000)
}
else {

    clearInterval(interval)

}