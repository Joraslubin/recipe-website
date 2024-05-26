

const searchRecipe = async () =>{

    const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=lasagna"

    const res = await fetch(url)
    const data = await res.json()

    console.log(data)
}

