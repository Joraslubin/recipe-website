
const searchBtn = document.querySelector("#search-btn")
const userInput = document.querySelector("#user-input")
const resultsContainer = document.querySelector("#search-results")
const slider = document.getElementById("featured-article-slider")
let index = 0;
let interval;
let paused = false;




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
        
        const cardElement = `<div class="card-main">
            <div class='card-main-image-container'>
            <img src='${this.image}/preview' alt='${this.name}'>
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
window.addEventListener("keydown",({key})=>{
    
    key === "Enter" ? searchRecipe() : ''
})



/*slide between card in the sidebar manually*/

document.querySelectorAll("#featured-article-container > svg").forEach(icon=>{
    
    icon.addEventListener("click",e=>{
        
        const targetElement = e.target
        

        if (targetElement.id === "arrow-right"){

            paused = true

            index = index < 4 ? index + 1 : 4 ;

         slider.style.transform = `translateX(${index * (-20)}%)` 

         setTimeout(()=>{ paused=false },5000)
        }

        else{

            paused = true

            index = index > 0 ? index - 1 : 0 ;

            slider.style.transform = `translateX(${index * (-20)}%)`
            setTimeout(()=>{paused=false},5000)
        }
    })
})

/* slide between card in the sidebar automatically*/

const slide = () => {

    slider.style.transform = `translateX(-20%)`
    console.log(index)
}

function reArrange() {
    
    slider.append(slider.firstElementChild);
    index = Number(slider.firstElementChild.dataset.index)
    slider.style.transition = 'none'
    slider.style.transform = "translateX(0)";
    setTimeout(()=>{
      slider.style.transition = 'transform 1s'
    },0)
    
  }
  
  slider.addEventListener("transitionend", reArrange)
  
  if(paused===false){

        interval = setInterval(slide,5000)
  }
  else {
   
    clearInterval(interval)
  
}