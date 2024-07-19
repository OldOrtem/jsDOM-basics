
function sort(by, reversed=false){
    //первоначальная настройка функции(позволяет расширять для сортировки по другим колонкам)
    let cell = 0;
    let intVal = false;
    let columns = {"Country": {"cell": 0, "intVal": false}, "Area": {"cell": 4, "intVal": true}};

    // функция сравнения строк по колонке
    let compare = (A, B) => {
        let a = A.cells[columns[by]['cell']].innerHTML;
        let b = B.cells[columns[by]['cell']].innerHTML;
        if(columns[by]['intVal']){
            a = parseInt(a);
            b = parseInt(b);
        }
        return reversed ? (a < b ? 1 : -1) : ((a > b ? 1 : -1));
    }

    const table = document.getElementById("countryTable");
    let sortedRows = Array.from(table.rows).slice(1).sort(compare);
    table.tBodies[0].append(...sortedRows);

    document.querySelectorAll(".arrow").forEach((item) => {
        if (item.classList.contains("shineArrow")){
            item.classList.remove("shineArrow");
        }
    });

    reversed ? this.lastChild.firstChild.classList.toggle("shineArrow") : this.lastChild.lastChild.classList.toggle("shineArrow");

    //переназначение обработчика событий (тогглл направления)
    var new_element = this.cloneNode(true);
    this.parentNode.replaceChild(new_element, this);
    new_element.addEventListener("click", sort.bind(new_element, by, !reversed));
}

function filterBy(shown){
    const selects = document.querySelectorAll('.aside .select');
    //да, на пару действий больше, но это упростит нам жизнь когда будем добавлять новый фильтр))
    for(let select of selects){
        if(!select.classList.contains('hide')){
            select.classList.add('hide');
        } 
    }

    const shownSelect = document.getElementById(shown);
    shownSelect.classList.remove('hide');
    shownSelect.selectedIndex = 0;

    updateTable(externalService.getAllCountries());
}

function changeFilter(){
    const option = this.options[this.selectedIndex].text;
    if(option === "All"){
        updateTable(externalService.getAllCountries());
    }
    else{
        if(this.id==='selectByRegion'){
            updateTable(externalService.getCountryListByRegion(option));
        }
        else if(this.id==='selectByLanguage'){
            updateTable(externalService.getCountryListByLanguage(option));
        }
    }
}

function updateTable(countriesList){
    const main = document.querySelector('.main');
    main.removeChild(main.firstChild);
    main.appendChild(makeTable(countriesList));
}

//Вёрстка---------
function createHeader(){
    const header = document.createElement('header');
    const heading = document.createElement('h1');

    heading.textContent = 'Homework JS DOM basic';
    
    header.classList.add('header');
    heading.classList.add('heading');

    header.appendChild(heading);
    
    return header;
}

function createRadioLabel(filter){
    const label = document.createElement('label');
    label.classList.add('searchLabel');
    const input = document.createElement('input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', 'searchMode');
    input.setAttribute('value', filter);
    label.appendChild(input);
    label.appendChild(document.createTextNode(filter));
    label.addEventListener('click', filterBy.bind(label, "selectBy" + filter));
    return label;
}

function createSelect(filter){
    const select = document.createElement('select');
    select.setAttribute('id', 'selectBy' + filter );
    select.classList.add('select');
    select.classList.add('hide');
    
    let list;
    if(filter==='Region'){
        list = externalService.getRegionsList();
    }
    else if(filter==="Language"){
        list = externalService.getLanguagesList();
    }

    list.unshift("All");
    for (const option of list){
        const li = document.createElement('option');
        li.setAttribute('value', option);
        li.classList.add('option');
        li.textContent = option;
        select.appendChild(li);
    }
    
    select.addEventListener("change", changeFilter.bind(select));

    return select;
}

function createAside() {
    const aside = document.createElement('aside');
    aside.classList.add('aside');

    const heading = document.createElement('h4');
    heading.textContent = 'Search by:';
    heading.classList.add('searchHeading');
    aside.appendChild(heading);

    aside.appendChild(createRadioLabel('Region'));
    aside.appendChild(createRadioLabel('Language'));

    aside.appendChild(createSelect('Region'));
    aside.appendChild(createSelect('Language'));

    return aside;
}

function createMain(){
    const main = document.createElement('main');
    main.classList.add('main');
   
    const table = makeTable(externalService.getAllCountries());
    main.appendChild(table);

    return main;
}

function makeTable(countriesList){
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const trh = document.createElement('tr');

    const headers = {'Country': true, 'Capital': false, 
                     'Region': false, 'Languages': false, 
                     'Area': true, 'Flag': false };

    for (const [headerText, sortable] of Object.entries(headers)){
        const th = document.createElement('th');
        th.textContent = headerText;
        th.classList.add(headerText);
        
        if(sortable){
            const arrows = document.createElement('div');
            arrows.classList.add('arrows');

            const iUp = document.createElement('img');
            iUp.src = "dropArrow.png";
            iUp.classList.add('iUp');
            iUp.classList.add('arrow');
            const iDown = document.createElement('img');
            iDown.src = "dropArrow.png";
            iDown.classList.add('iDown');
            iDown.classList.add('arrow');
            arrows.appendChild(iUp);
            arrows.appendChild(iDown);

            th.addEventListener("click", sort.bind(th, by=headerText, reversed=false));
            th.appendChild(arrows);
            th.classList.add('pointer');
        }
        
        trh.appendChild(th);
    };
    thead.appendChild(trh);
    table.appendChild(thead);

    for (const country of countriesList){
        const tr = document.createElement('tr');

        const name = document.createElement('td');
        name.classList.add('name');
        name.textContent = country.name;
        tr.appendChild(name);

        const capital = document.createElement('td');
        capital.classList.add('capital');
        capital.textContent = country.capital;
        tr.appendChild(capital);

        const region = document.createElement('td');
        region.classList.add('region');
        region.textContent = country.region;
        tr.appendChild(region);

        const languages = document.createElement('td');
        languages.classList.add('languages');
        const languagesList = document.createElement('ul');
        for (const [key, language] of Object.entries(country.languages)){
            const languageLi = document.createElement('li');
            languageLi.classList.add('language');
            languageLi.textContent = language;
            languagesList.appendChild(languageLi);
        }
        languages.appendChild(languagesList);
        tr.appendChild(languages);

        const area = document.createElement('td');
        area.classList.add('area');
        area.textContent = country.area;
        tr.appendChild(area);

        const flag = document.createElement('td');
        flag.classList.add('flag');
        const flagImg = document.createElement('img');
        flagImg.src = country.flagURL;
        flag.appendChild(flagImg);
        tr.appendChild(flag);

        tbody.appendChild(tr);
    }
    table.appendChild(tbody);

    table.id = 'countryTable';
    return table;
}

function main(){
    const appRoot = document.getElementById('app-root'); 
    appRoot.appendChild(createHeader());
    appRoot.appendChild(createAside());
    appRoot.appendChild(createMain());
}

main()