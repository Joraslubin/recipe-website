
const mealCategory = document.querySelector("#meal-category")
const mealName = document.querySelector("#meal-name")
const mealThumbnail = document.querySelector("#meal-thumbnail > img")
const ingredientsContainer = document.querySelector("#ingredient-container > ul")
const instructionsStepsContainer = document.querySelector("#instructions-steps-container")
const id = "53038";//localStorage.getItem("recipeId")



const formatData = (data) => {

    const { strMeal, strCategory, strMealThumb, strInstructions } = data

    /*group each ingredient with its measure respectively */

    const rgx = /strIngredient\d+/

    const ingredientsData = (Object.keys(data)).filter(item => rgx.test(item) && data[item]).map(item => {
        const index = (item.match(/\d+/))[0]

        return {
            "ingredient": data[item],
            "measure": data[`strMeasure${index}`]
        }
    })

    /* create an array from the instructions steps string */

    const instructionsArray = (strInstructions.split(/(step)\s\d+/i)).filter(item => item !== '' && item !== "STEP")


    return {
        name: strMeal,
        category: strCategory,
        img: strMealThumb,
        instructions: instructionsArray,
        ingredients: ingredientsData
    }
}



const display = (data) => {


    const ingredientStr = (data.ingredients).map(item => `<li>${item.measure} ${item.ingredient}</li>`).join("")
    const stepsStr = (data.instructions).map((item, index) => `<div class="step-container"><h3>Step ${index + 1}</h3><p>${item}</p></div>`).join("")


    const str = `
    <p id="meal-category">${data.category}</p>
        <h2 id="meal-name">${data.name}</h2>
        <div id="meal-thumbnail">
            <img src="${data.img}" alt="${data.name}">
        </div>
        <div id="ingredients-container">
            <h2 class="title">Ingredients</h2>
            <ul>${ingredientStr}</ul>
        </div>
        <div id="instructions-container">
            <h2 class="title">Instructions</h2>
            <div id="instructions-steps-container">${stepsStr}</div>
        </div>
    `

    document.querySelector("#container").innerHTML = str;
}

const getRecipe = async () => {

    try {

        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
        const res = await fetch(url)
        const data = await res.json()

        const formatedData = formatData((data.meals)[0])

        display(formatedData)
    }

    catch (error) {
        console.log(error)
    }
}

getRecipe()