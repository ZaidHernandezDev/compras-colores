//Accedemos al DOM
let formHeader = document.getElementById("form-header");
let inputHeader = document.getElementById("search");
let submitHeader = document.getElementById("submit-header");
let filterHeader = document.getElementById("filter-header");
let filterForm = document.getElementById("filter-form");
let filterYear = document.getElementById("year");
let filterFormName = document.getElementById("name");
let submitFilter = document.getElementById("submit-filter");
let filters = document.getElementById("filters");
let textYear = document.getElementById("text-year");
let textSearch = document.getElementById("text-search");
let clearFilters = document.getElementById("clear-filters");
let imgFilter = document.getElementById("img-filter");
let cardContainer = document.getElementById("card-container");
let page1 = document.getElementById("page1");
let page2 = document.getElementById("page2");

//Mandamos a llamar a la función que obtiene los datos por AJAX a la API, inicializamos la página en 1
getResponse(1);

//Esta variable nos sirve para esconder el formulario cuando estamos en celulares
let formVisible = true;

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

//FUNCIONES DEL BOM
window.addEventListener('resize', ()=>{
    let width = window.innerWidth;
    if (width > 450) {
        filterForm.style.display = "block";
        formVisible = true;
    }
});

//FUNCIONES DE EVENTOS EN EL DOM

//Filtrar desde el header
submitHeader.addEventListener("click", (e) => {
    e.preventDefault();
    let valueInput = inputHeader.value.trim();
    filterSearch(valueInput);
    filters.style.display = 'block';
})

//Filtrar desde la barra lateral
submitFilter.addEventListener("click", (e) => {
    e.preventDefault();
    let valueSelect = parseInt(filterYear.value);
    let valueInput = filterFormName.value.trim();
    filterSearch(valueInput, valueSelect);
    filters.style.display = 'block';
})

//Eliminar filtros desde boton
clearFilters.addEventListener("click", (e) => {
    getResponse(1);
    printFilter(undefined, undefined);
    filters.style.display = 'none';
    inputHeader.value= '';
    filterYear.selectedIndex = 0;
    filterFormName.value = '';
});

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
            imgFilter.style.transform="rotate(0deg)";
        } else {
            filterForm.style.display = "block";
            formVisible = true;
            imgFilter.style.transform="rotate(180deg)";
        }
    }
});

//Filtrar los resultados buscando en la base de datos completa
async function filterSearch(name, year) {
    try {
        let error = 0;
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
                } else {
                    error = 1;
                }
                printFilter(name, year);

                //Cuando nos dan solamente year
            } else if ((!isNaN(year)) && (name === '')) {
                if (value.year === year) {
                    filteredResponse.push(value);
                } else {
                    error = 1;
                }
                printFilter(undefined, year);

                //Cuando nos dan solamente name
            } else if ((isNaN(year)) && (name !== '')) {
                if (value.name.includes(name)) {
                    console.log('nos dieron solamentename', )
                    filteredResponse.push(value);
                } else {
                    error = 1;
                }
                printFilter(name);

                //Cuando no nos dan ninguno
            } else if ((isNaN(year)) && (name === '')) {
                getResponse();
                filters.style.display = 'none';
}
        })
            printResult(filteredResponse);
            if (error === 1) {
                cardContainer.textContent = "No hay colores que coincidan con tu búsqueda"
            }
    } catch (error) {
        console.error("Ha ocurrido un error: ", error);
    }
}

//Imprimimos los filtros
function printFilter(search, year = NaN) {
    textYear.style.display= 'inline';
    textSearch.style.display ='inline';

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
        
        //Cuando no hay filtros
    } else if ((search == undefined) && (isNaN(year))) {
        textYear.style.display = 'none';
        textSearch.style.display = 'none';
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