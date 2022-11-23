/* Imports */
import { getBeanies, getAstroSigns, getAnimalType, getThemeType } from './fetch-utils.js';
import {
    renderAstrosignOption,
    renderBeanie,
    renderAnimalOption,
    renderThemeOption,
} from './render-utils.js';

/* Get DOM Elements */
const searchForm = document.getElementById('search-form');
const notificationDisplay = document.getElementById('notification-display');
const astrosignSelect = document.getElementById('astro-sign-select');
const beanieList = document.getElementById('beanie-list');
const animalSelect = document.getElementById('animal-select');
const themeSelect = document.getElementById('theme-select');
// const newPage = document.getElementById('new-page');

/* State */
let error = null;
let beanies = [];
let astroSigns = [];
let count = 0;
let animals = [];
let themes = [];

let filter = {
    title: '',
    astroSign: '',
    animal: '',
    theme: '',
};

let paging = {
    page: 1,
    pageSize: 25,
};

/* Events */

window.addEventListener('load', async () => {
    findBeanies();
    const astroSignOption = await getAstroSigns();
    astroSigns = astroSignOption.data;
    const animalOption = await getAnimalType();
    animals = animalOption.data;
    const themeOption = await getThemeType();
    themes = themeOption.data;

    if (!error) {
        displayAstrosignOptions();
    }
    if (!error) {
        displayAnimalOption();
    }
    if (!error) {
        displayThemeOption();
    }
});

async function getMoreBeanies() {
    paging.page++;
    const response = await getBeanies(filter, paging);

    error = response.error;
    const moreBeanies = response.data;
    count = response.count;
    beanies = beanies.concat(moreBeanies);

    displayNotifications();
    displayMoreBeanies(moreBeanies);
}

// async function findBeanies(title, astroSign, animalType, theme) {
async function findBeanies() {
    // const response = await getBeanies(filter, paging);
    // const response = await getBeanies(
    //     filter.title,
    //     filter.astroSign,
    //     filter.animalType,
    //     filter.theme
    // );

    const response = await getBeanies(filter, paging);
    error = response.error;
    beanies = response.data;
    count = response.count;

    displayNotifications();
    if (!error) {
        displayBeanies();
    }
    if (!error) {
        displayAnimalOption();
    }
    if (!error) {
        displayThemeOption();
    }
}

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(searchForm);

    filter.title = formData.get('name');
    filter.astroSign = formData.get('astroSign');
    filter.animalType = formData.get('animal');
    filter.theme = formData.get('theme');

    // new search criteria, reset page to 1
    paging.page = 1;

    findBeanies();

    // const title = formData.get('name');
    // const astroSign = formData.get('astroSign');
    // const animalType = formData.get('animal');
    // const theme = formData.get('theme');

    // findBeanies(title, astroSign, animalType, theme);
});

// newPage.addEventListener('click', () => {
//     getMoreBeanies();
//     // console.log('firing');
// });

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            observer.unobserve(entry.target);
            //do magic
            getMoreBeanies();
        }
    }
});

/* Display Functions */

function displayBeanies() {
    beanieList.innerHTML = '';
    displayMoreBeanies(beanies);
}

function displayMoreBeanies(moreBeanies) {
    let lastEl = null;
    for (const beanie of moreBeanies) {
        const beanieEl = renderBeanie(beanie);
        beanieEl.addEventListener('click', () => {
            window.open(beanie.link);
        });
        beanieList.append(beanieEl);
        lastEl = beanieEl;
    }

    if (beanies.length < count) {
        observer.observe(lastEl);
    }
}

// function displayBeanies() {
//     beanieList.innerHTML = '';
//     for (const beanie of beanies) {
//         const beanieEl = renderBeanie(beanie);
//         beanieEl.addEventListener('click', () => {
//             window.open(beanie.link);
//         });
//         beanieList.append(beanieEl);
//     }
// }

function displayAstrosignOptions() {
    for (const astroSign of astroSigns) {
        const option = renderAstrosignOption(astroSign);
        astrosignSelect.append(option);
    }
}

function displayAnimalOption() {
    for (const animal of animals) {
        const option = renderAnimalOption(animal.name);
        animalSelect.append(option);
    }
}

function displayThemeOption() {
    for (const theme of themes) {
        const option = renderThemeOption(theme.name);
        themeSelect.append(option);
    }
}

function displayNotifications() {
    if (error) {
        notificationDisplay.classList.add('error');
        notificationDisplay.textContent = error.message;
    } else {
        notificationDisplay.classList.remove('error');
        notificationDisplay.textContent = `Showing ${beanies.length} of ${count} beanies.`;
    }
}

// (don't forget to call any display functions you want to run on page load!)
