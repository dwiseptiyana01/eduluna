/* =========================================
   EDULUNA SCRIPT
========================================= */

console.log('EduLuna Loaded 🚀')

/* =========================================
   GLOBAL
========================================= */

let websites = []
let filteredWebsites = []

let currentPage = 1

const cardsPerPage = 12

let showingFavorites = false

/* =========================================
   ELEMENTS
========================================= */

const body =
document.body

const sidebar =
document.querySelector(
  '.sidebar'
)

const cardsContainer =
document.getElementById(
  'cardsContainer'
)

const pagination =
document.getElementById(
  'pagination'
)

const searchInput =
document.getElementById(
  'searchInput'
)

const menuItems =
document.querySelectorAll(
  '.menu-item'
)

const featuredGrid =
document.getElementById(
  'featuredGrid'
)

const themeBtn =
document.querySelector(
  '.theme-btn'
)

/* =========================================
   SIDEBAR TOGGLE
========================================= */

const toggleBtn =
document.createElement('button')

toggleBtn.className =
'sidebar-toggle'

toggleBtn.innerHTML = '☰'

sidebar.prepend(toggleBtn)

toggleBtn.addEventListener(
  'click',
  () => {

    sidebar.classList.toggle(
      'collapsed'
    )

  }
)

/* =========================================
   FAVORITE BUTTON
========================================= */

const favoriteBtn =
document.createElement('button')

favoriteBtn.className =
'favorite-page-btn'

favoriteBtn.innerHTML =
'🤍 Favorit'

document.querySelector(
  '.topbar'
).appendChild(
  favoriteBtn
)

/* =========================================
   LOAD JSON
========================================= */

showLoading()

fetch('websites.json')

.then(response => {

  if(!response.ok){

    throw new Error(
      'websites.json tidak ditemukan'
    )

  }

  return response.json()

})

.then(data => {

  websites = data.map(site => ({

    ...site,

    slug:
    site.name
    .toLowerCase()
    .replace(/\s+/g,'-'),

    featured:
    Math.random() > 0.85

  }))

  filteredWebsites = websites

  renderFeatured()

  renderCards()

  renderPagination()

})

.catch(error => {

  console.error(error)

  cardsContainer.innerHTML = `

    <div class="empty-state">

      <h2>

        Gagal Memuat Data

      </h2>

      <p>

        Periksa websites.json

      </p>

    </div>

  `

})

/* =========================================
   LOADING
========================================= */

function showLoading(){

  cardsContainer.innerHTML = ''

  for(let i = 0; i < 8; i++){

    cardsContainer.innerHTML += `

      <div class="card skeleton-card"></div>

    `

  }

}

/* =========================================
   FEATURED
========================================= */

function renderFeatured(){

  if(!featuredGrid) return

  featuredGrid.innerHTML = ''

  const featured =
  websites.filter(site =>

    site.featured

  ).slice(0,4)

  featured.forEach(site => {

    featuredGrid.innerHTML += `

      <div class="featured-card">

        <div class="featured-tag">

          FEATURED

        </div>

        <img
          src="https://www.google.com/s2/favicons?sz=128&domain=${site.url}"
          alt="${site.name}"
        >

        <h3>

          ${site.name}

        </h3>

        <p>

          ${site.description}

        </p>

        <button
          onclick="visitWebsite('${site.url}')"
        >

          Explore Website

        </button>

      </div>

    `

  })

}

/* =========================================
   RENDER CARDS
========================================= */

function renderCards(){

  cardsContainer.innerHTML = ''

  if(filteredWebsites.length === 0){

    cardsContainer.innerHTML = `

      <div class="empty-state">

        <h2>

          Website tidak ditemukan

        </h2>

      </div>

    `

    return

  }

  const start =
  (currentPage - 1) * cardsPerPage

  const end =
  start + cardsPerPage

  const paginatedItems =
  filteredWebsites.slice(
    start,
    end
  )

  const favorites =
  getFavorites()

  paginatedItems.forEach(site => {

    const liked =
    favorites.includes(site.name)

    cardsContainer.innerHTML += `

      <div class="card">

        <div class="card-top">

          <img
            loading="lazy"
            src="https://www.google.com/s2/favicons?sz=128&domain=${site.url}"
            alt="${site.name}"
          >

          <button
            class="heart ${liked ? 'liked' : ''}"
            onclick="toggleFavorite('${site.name}')"
          >

            ${liked ? '♥' : '♡'}

          </button>

        </div>

        <h3>

          ${site.name}

        </h3>

        <span class="category">

          ${site.category}

        </span>

        <p>

          ${site.description}

        </p>

        <button
          class="visit-btn"
          onclick="visitWebsite('${site.url}')"
        >

          Kunjungi Website

        </button>

      </div>

    `

  })

}

/* =========================================
   PAGINATION
========================================= */

function renderPagination(){

  pagination.innerHTML = ''

  const totalPages =
  Math.ceil(
    filteredWebsites.length /
    cardsPerPage
  )

  for(let i = 1; i <= totalPages; i++){

    const button =
    document.createElement(
      'button'
    )

    button.className =
    'page-btn'

    if(i === currentPage){

      button.classList.add(
        'active'
      )

    }

    button.innerText = i

    button.addEventListener(
      'click',
      () => {

        currentPage = i

        renderCards()

        renderPagination()

        window.scrollTo({

          top:0,
          behavior:'smooth'

        })

      }
    )

    pagination.appendChild(
      button
    )

  }

}

/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
  'keyup',
  () => {

    const keyword =
    searchInput.value
    .toLowerCase()

    filteredWebsites =
    websites.filter(site => {

      return(

        site.name
        .toLowerCase()
        .includes(keyword)

        ||

        site.category
        .toLowerCase()
        .includes(keyword)

        ||

        site.description
        .toLowerCase()
        .includes(keyword)

      )

    })

    currentPage = 1

    renderCards()

    renderPagination()

  }
)

/* =========================================
   CATEGORY FILTER
========================================= */

menuItems.forEach(item => {

  item.addEventListener(
    'click',
    () => {

      menuItems.forEach(btn => {

        btn.classList.remove(
          'active'
        )

      })

      item.classList.add(
        'active'
      )

      const category =
      item.dataset.category

      if(category === 'Semua'){

        filteredWebsites =
        websites

      }

      else{

        filteredWebsites =
        websites.filter(site =>

          site.category === category

        )

      }

      currentPage = 1

      renderCards()

      renderPagination()

    }
  )

})

/* =========================================
   FAVORITES
========================================= */

favoriteBtn.addEventListener(
  'click',
  () => {

    showingFavorites =
    !showingFavorites

    favoriteBtn.classList.toggle(
      'active'
    )

    if(showingFavorites){

      const favorites =
      getFavorites()

      filteredWebsites =
      websites.filter(site =>

        favorites.includes(
          site.name
        )

      )

      favoriteBtn.innerHTML =
      '❤️ Semua Website'

    }

    else{

      filteredWebsites =
      websites

      favoriteBtn.innerHTML =
      '🤍 Favorit'

    }

    currentPage = 1

    renderCards()

    renderPagination()

  }
)

/* =========================================
   FAVORITES STORAGE
========================================= */

function getFavorites(){

  return JSON.parse(

    localStorage.getItem(
      'favorites'
    )

  ) || []

}

function toggleFavorite(name){

  let favorites =
  getFavorites()

  if(favorites.includes(name)){

    favorites =
    favorites.filter(
      item => item !== name
    )

  }

  else{

    favorites.push(name)

  }

  localStorage.setItem(

    'favorites',

    JSON.stringify(favorites)

  )

  renderCards()

}

/* =========================================
   VISIT WEBSITE
========================================= */

function visitWebsite(url){

  window.open(
    url,
    '_blank'
  )

}

/* =========================================
   THEME MODE
========================================= */

const savedTheme =
localStorage.getItem(
  'theme'
)

/* LOAD */

if(savedTheme === 'light'){

  body.classList.add(
    'light-mode'
  )

  themeBtn.innerHTML = '☀️'

}

else{

  themeBtn.innerHTML = '🌙'

}

/* TOGGLE */

themeBtn.addEventListener(
  'click',
  () => {

    body.classList.toggle(
      'light-mode'
    )

    const isLight =
    body.classList.contains(
      'light-mode'
    )

    localStorage.setItem(

      'theme',

      isLight
      ? 'light'
      : 'dark'

    )

    themeBtn.innerHTML =

    isLight
    ? '☀️'
    : '🌙'

  }
)