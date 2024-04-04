//Accedemos al DOM
let formHeader = document.getElementById("form-header");
let inputHeader = document.getElementById("search");
let submitHeader = document.getElementById("submit-header");
let filterHeader = document.getElementById("filter-header");
let filterForm = document.getElementById("filter-form");
let filterYear = document.getElementById("year");
let filterFormName = document.getElementById("name");
let submitFilter = document.getElementById("submit-filter");
let cardContainer = document.getElementById("card-container");
let page1 = document.getElementById("page1");
let page2 = document.getElementById("page2");
let textYear = document.getElementById("text-year");
let textSearch = document.getElementById("text-search");

//Mandamos a llamar a la función que obtiene los datos por AJAX a la API, inicializamos la página en 1
getResponse(1);

//Esta variable nos sirve para esconder el formulario cuando estamos en celulares
let formVisible = false;

//FUNCIONES GENERALES

//Obtenemos los datos de la API y los imprimimos usando la página actual como referencia
function getResponse(page) {
    fetch(`https://reqres.in/api/unknown?page=${page}`)
        .then(data => data.json())
        .then(data => {
            cardContainer.innerHTML = "";
            printResult(data.data);
        });
}

//FUNCIONES DE EVENTOS EN EL DOM

//Filtrar desde el header
submitHeader.addEventListener("click", (e) => {
    e.preventDefault();
    let valueInput = inputHeader.value.trim();
    filterSearch(valueInput);
})

//Filtrar desde la barra lateral
submitFilter.addEventListener("click", (e) => {
    e.preventDefault();
    let valueSelect = parseInt(filterYear.value);
    let valueInput = filterFormName.value.trim();
    filterSearch(valueInput, valueSelect);
})

//Ir a la página 1
page1.addEventListener("click", (e) => {
    e.preventDefault();
    getResponse(1);
});

//Ir a la página 2
page2.addEventListener("click", (e) => {
    e.preventDefault();
    getResponse(2);
});

//Mostrar o esconder el menú de filtros en dispositivos móviles
filterHeader.addEventListener("click", () => {
    let width = window.innerWidth;
    if (width <= 450) {
        if (formVisible) {
            filterForm.style.display = "none";
            formVisible = false;
        } else {
            filterForm.style.display = "block";
            formVisible = true;
        }
    }
});

//Filtrar los resultados buscando en la base de datos completa
async function filterSearch(name, year = NaN) {
    try {
        let filteredResponse = [];
        let fullData = [];
        let response1 = await fetch(`https://reqres.in/api/unknown?page=1`);
        let data1 = await response1.json();
        let response2 = await fetch(`https://reqres.in/api/unknown?page=2`);
        let data2 = await response2.json();
        fullData = [...data1.data, ...data2.data];

        fullData.forEach((value) => {

            //Cuando nos dan name y year
            if ((!isNaN(year)) && (name !== '')) {
                if (value.year === year || value.name.includes(name)) {
                    filteredResponse.push(value);
                    printFilter(name, year);
                }

                //Cuando nos dan solamente year
            } else if ((!isNaN(year)) && (name === '')) {
                if (value.year === year) {
                    filteredResponse.push(value);
                    printFilter(undefined, year);
                }

                //Cuando nos dan solamente name
            } else if ((isNaN(year)) && (name !== '')) {
                if (value.name.includes(name)) {
                    filteredResponse.push(value);
                    printFilter(name);
                }

                //Cuando no nos dan ninguno
            } else if ((isNaN(year)) && (name === '')) {
                getResponse();
            }
        })
        printResult(filteredResponse);

    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
    }
}

//Imprimimos los filtros
function printFilter(search, year = NaN) {
    textYear.style.display= 'inline';
    textSearch.style.display ='inline';

    console.log('search', search)
    //Cuando nos dan search y year
    if ((search != undefined) && (!isNaN(year))) {
        textYear.textContent = year
        textSearch.textContent = search;

        //Cuando nos dan solo search
    }else if ((search != undefined) && (isNaN(year))) {
        textYear.style.display= 'none';
        textSearch.textContent = search;

        //Cuando solo nos dan year
    } else if ((search == undefined) && (!isNaN(year))) {
        textYear.textContent = year
        textSearch.style.display ='none';

    }
}

//Impimimos la información
function printResult(data) {
    cardContainer.innerHTML = "";
    data.forEach((color => {
        let card = document.createElement("div");
        card.className = "card";
        let cardImage = document.createElement("div");
        cardImage.className = "card-image";
        cardImage.style.background = color.color;
        let cardTitle = document.createElement("h3");
        cardTitle.className = "card-title";
        cardTitle.textContent = `Nombre: ${color.name}`;
        let cardDate = document.createElement("p");
        cardDate.className = "card-date";
        cardDate.textContent = `Año: ${color.year}`;
        let cardTextColor = document.createElement("p");
        cardTextColor.className = "card-text-color";
        cardTextColor.textContent = `Hexadecimal: ${color.color}`;
        let phantom = document.createElement("p");
        phantom.className = "phantom";
        phantom.textContent = `Pantone: ${color.pantone_value}`

        card.append(cardImage);
        card.append(cardTitle);
        card.append(cardDate);
        card.append(cardTextColor);
        card.append(phantom);

        cardContainer.append(card);
    }
    ))
}