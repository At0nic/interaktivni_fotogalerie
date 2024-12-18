// URL NASA API
const apiUrl = 'https://api.nasa.gov/planetary/apod?api_key=8O03TIGCy7tWrn4okwnAMhPE7S9hsBkwRydTu6xd&count=10';

let images = [];
let currentIndex = 0;

//Načítání obrázků z API
function loadImages() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            images = data;
            displayImages();
        })
        .catch(error => console.error('Chyba při načítání obrázků:', error));
}

//Zobrazení obrázků v galerii
function displayImages() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Vyčistit galerii před přidáním nových obrázků

    images.forEach((image, index) => {
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = image.title;
        imgElement.title = image.title;
        imgElement.dataset.index = index;

        imgElement.addEventListener('mouseover', () => showImageInfo(image));
        imgElement.addEventListener('click', () => openModal(index));

        gallery.appendChild(imgElement);
    });
}

//Zobrazení informací o obrázku
function showImageInfo(image) {
    const description = document.getElementById('img-description');
    description.textContent = `${image.title} - ${image.explanation}`;
}

//Otevření modálního okna
function openModal(index) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const description = document.getElementById('img-description');

    modal.style.display = 'block';
    modalImg.src = images[index].url;
    description.textContent = images[index].title;

    currentIndex = index;
}

//Zavření modálního okna
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

//Klávesové události pro navigaci mezi obrázky
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        currentIndex = (currentIndex + 1) % images.length;
        openModal(currentIndex);
    } else if (e.key === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openModal(currentIndex);
    }
});

// Scroll event pro načítání dalších obrázků
let isScrolling

function detectScrollDown(event) {
    if (event.deltaY > 0) {
      if (!isScrolling) {
        loadImages();
        isScrolling = true;

        //Ochranna proti nekonečnému refreshu obrázků
        setTimeout(() => {
          isScrolling = false;
        }, 200);
      }
    }
  }

window.addEventListener('wheel', detectScrollDown);

// Zavření modálního okna při kliknutí na křížek
document.getElementById('close-modal').addEventListener('click', closeModal);

// Načíst obrázky při načtení stránky
loadImages();