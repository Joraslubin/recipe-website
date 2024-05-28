
const searchBtn = document.querySelector("#search-btn")
const userInput = document.querySelector("#user-input")
const resultsContainer = document.querySelector("#search-results")

class Card {

    constructor({ strMeal, strMealThumb, strCategory, strArea }) {
        this.name = strMeal
        this.category = strCategory
        this.image = strMealThumb;
        this.origin = strArea;
    }

    display() {

        /* function to limit the length of the meal title */
        const formatName = (name) => name.indexOf(",") === -1 ? name : name.slice(0,name.indexOf(",")) 
        
        const cardElement = `<div class="card">
            <div class='card-image-container'>
            <img src='${this.image}' alt='${this.name}'>
            </div>
            <div class='recipe-details'>
            <p class='dish-origin'>${this.origin}</p>
            <h2 class='dish-name'>${formatName(this.name)}</h2>
            <p class='dish-category'>${this.category}</p> 
            </div>
            </div>`

            
            resultsContainer.innerHTML += cardElement
            

    }
}

const showRecipe = (data) => {

    resultsContainer.innerHTML = ''

    for (const meal of data) {

        const card = new Card(meal)

        card.display()

    }
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
    }

    catch (error) {
        console.log(error)
    }

}

searchBtn.addEventListener("click", searchRecipe)