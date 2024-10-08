/* Se referencia la API del clima */
(function(d, s, id) {
    if (d.getElementById(id)) {
        if (window.__TOMORROW__) {
            window.__TOMORROW__.renderWidget();
        }
        return;
    }
    const fjs = d.getElementsByTagName(s)[0];
    const js = d.createElement(s);
    js.id = id;
    js.src = "https://www.tomorrow.io/v1/widget/sdk/sdk.bundle.min.js";

    fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'tomorrow-sdk');

// Array de imágenes ilustrativas para las noticias
const stockImages = [
    'Acantilado1.jpg',
    'Playa1.jpg',
    'Playa2.jpg',
    'Playa3.jpg',
    'Playa4.jpg',
    'Hotel1.jpg',
    'Hotel2.jpg',
    'Restaurante1.jpg',
    'Embarcacion1.jpg'
];

function getRandomStockImage() {
    return stockImages[Math.floor(Math.random() * stockImages.length)];
}

function extractImageFromDescription(description) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const img = doc.querySelector('img');
    return img ? img.src : null;
}

// Mantén las funciones existentes como getRandomStockImage()

// Reemplaza la función fetchRSSFeed con esta nueva función
function fetchNews() {
    const worldNewsContainer = document.getElementById('world-news-container');
    const localNewsContainer = document.getElementById('local-news-container');
    
    worldNewsContainer.innerHTML = '<div class="loading-spinner"></div>';
    localNewsContainer.innerHTML = '<div class="loading-spinner"></div>';

    // Clave API real de Gnews
    const apiKey = f71459922cd53bde9dc001e195fe54ec;
    const worldNewsUrl = `https://gnews.io/api/v4/search?q=turismo&lang=es&country=mx&max=1&apikey=${apiKey}`;
    const localNewsUrl = `https://gnews.io/api/v4/search?q=turismo%20Acapulco&lang=es&country=mx&max=1&apikey=${apiKey}`;

    Promise.all([
        fetch(worldNewsUrl).then(response => response.json()),
        fetch(localNewsUrl).then(response => response.json())
    ])
    .then(([worldData, localData]) => {
        worldNewsContainer.innerHTML = '';
        localNewsContainer.innerHTML = '';

        if (worldData.articles && worldData.articles.length > 0) {
            worldNewsContainer.appendChild(createNewsItem(worldData.articles[0]));
        }

        if (localData.articles && localData.articles.length > 0) {
            localNewsContainer.appendChild(createNewsItem(localData.articles[0]));
        }
    })
    .catch(error => {
        worldNewsContainer.innerHTML = 'Error al cargar las noticias del mundo.';
        localNewsContainer.innerHTML = 'Error al cargar las noticias locales.';
        console.error('Error:', error);
    });
}

function createNewsItem(article) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    let imageUrl = article.image || getRandomStockImage();
    
    const pubDate = new Date(article.publishedAt);
    const formattedDate = pubDate.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const description = article.description.length > 100 
        ? article.description.substring(0, 100) + '...' 
        : article.description;
    
    newsItem.innerHTML = `
        <div class="news-item-image-container">
            <img src="${imageUrl}" alt="${article.title}" class="news-item-image">
        </div>
        <div class="news-item-content">
            <div class="news-item-date">${formattedDate}</div>
            <h3>${article.title}</h3>
            <p>${description}</p>
            <a href="${article.url}" target="_blank">Leer más</a>
        </div>
    `;
    
    return newsItem;
}

// Cambia el nombre de la función en el event listener
window.addEventListener('load', fetchNews);

/* function fetchRSSFeed() {
    const worldNewsContainer = document.getElementById('world-news-container');
    const localNewsContainer = document.getElementById('local-news-container');
    
    worldNewsContainer.innerHTML = '<div class="loading-spinner"></div>';
    localNewsContainer.innerHTML = '<div class="loading-spinner"></div>';

    const rssUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dturismo%2BAcapulco%26hl%3Des-419%26gl%3DMX%26ceid%3DMX%3Aes-419';

    fetch(rssUrl)
        .then(response => response.json())
        .then(data => {
            worldNewsContainer.innerHTML = '';  // Limpiar el contenedor de noticias del mundo
            localNewsContainer.innerHTML = '';  // Limpiar el contenedor de noticias locales

            // Mostrar una noticia del mundo
            const worldItem = data.items[0];  // Primera noticia
            worldNewsContainer.appendChild(createNewsItem(worldItem));

            // Mostrar una noticia local
            const localItem = data.items[1];  // Segunda noticia
            localNewsContainer.appendChild(createNewsItem(localItem));
        })
        .catch(error => {
            worldNewsContainer.innerHTML = 'Error al cargar las noticias del mundo.';
            localNewsContainer.innerHTML = 'Error al cargar las noticias locales.';
            console.error('Error:', error);
        });
} */

function createNewsItem(item) {
    const newsItem = document.createElement('div');
    newsItem.className = 'news-item';

    let imageUrl = item.enclosure && item.enclosure.link 
        ? item.enclosure.link 
        : getRandomStockImage();
    
    const isStockImage = !item.enclosure || !item.enclosure.link;
    
    const pubDate = new Date(item.pubDate);
    const formattedDate = pubDate.toLocaleDateString('es-MX', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const description = item.description.length > 100 
        ? item.description.substring(0, 100) + '...' 
        : item.description;
    
    // Extraer la URL real de la noticia del campo 'guid'
    const realNewsUrl = item.guid;
    
    newsItem.innerHTML = `
        <div class="news-item-image-container">
            <img src="${imageUrl}" alt="${item.title}" class="news-item-image">
        </div>
        <div class="news-item-content">
            <div class="news-item-date">${formattedDate}</div>
            <h3>${item.title}</h3>
            <p>${description}</p>
            <a href="${realNewsUrl}" target="_blank">Leer más</a>
        </div>
    `;
    
    return newsItem;
}

// Llamar a la función cuando se cargue la página
window.addEventListener('load', fetchRSSFeed);

// Nuevo script para manejar la visualización de la barra de navegación secundaria
document.addEventListener('DOMContentLoaded', function() {
    const mapasLink = document.getElementById('mapas-link');
    const mapasNav = document.getElementById('mapas-nav');

    mapasLink.addEventListener('click', function(e) {
        e.preventDefault();
        mapasNav.style.display = mapasNav.style.display === 'block' ? 'none' : 'block';
    });

    // Ocultar la barra secundaria cuando se hace clic fuera de ella
    document.addEventListener('click', function(e) {
        if (!mapasNav.contains(e.target) && e.target !== mapasLink) {
            mapasNav.style.display = 'none';
        }
    });
});