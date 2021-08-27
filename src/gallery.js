import { galleryItems } from "./app.js";

const refGalleryContainer = document.querySelector('.js-gallery');
const refModal = document.querySelector('.js-lightbox');
const refModalImage = document.querySelector('.lightbox__image');
const refModalCloseBtn = document.querySelector('[data-action="close-lightbox"]');
const refModalOverlay = document.querySelector('.lightbox__overlay');

/**
 * Функция создания разметки галереи
 */
const createGalleryMarkup = function(galleryItems)
{
    return galleryItems.map(({ preview, original, description }) => 
    `
    <li class="gallery__item">
        <a
            class="gallery__link"
            href="${original}">
            <img
            class="gallery__image"
            src="${preview}"
            data-source="${original}"
            alt="${description}"
            />
        </a>
    </li>
    `).join('');
}

/**
 * Функция рендеринга галереи на основе макета разметки
 */
const renderingMarkup = function(markup)
{
    refGalleryContainer.insertAdjacentHTML('beforeend', markup);
}

/**
 * Функция закрытия модального окна 
 */

 const onCloseModal = function()
 {
    if(refModal.classList.contains('is-open'))
    {
        removeClassFromElement('is-open');
        refModalImage.src = '';
        refModalImage.alt = '';
        //Убераю пометку с предыдущей картинки
        removeClassFromElement('selected');
    }
 }

 /**
  * Функция убирает указанный класс с элемента 
  */
 const removeClassFromElement = function(className)
 {
    const element = document.querySelector(`.${className}`);
    if(element)
    {
        element.classList.remove(className);
    }
 }

 /**
  * Функция добавляет указанный класс на передаваемый элемент 
  */
 const addClassToElement = function(element, className)
 {
    element.classList.add(className);
 }

/**
 * Функция callback для обработки клика по картинке в галерее
 */
 const onImageClick = function(evt)
 {
     evt.preventDefault();
     if(evt.target.nodeName === 'IMG')
     {  
         //Убераю пометку с предыдущей картинки
         removeClassFromElement('selected');
         //Делаем пометку на выбранной картинке
         addClassToElement(evt.target, 'selected');
         //Открываем модалку
         addClassToElement(refModal, 'is-open');
        //Подмена значения атрибута src элемента img.lightbox__image
        refModalImage.src = evt.target.dataset.source;
        refModalImage.alt = evt.target.alt;
        //Сохраняю текущий индекс картинки который выбрали
     }
 }

 /**
  * Функция перелистывает изображения, 
  * при открытой модалке, клавишами "влево" и "вправо" 
  */
 const onFlippingGallery = function(evt)
 {
    if(refModal.classList.contains('is-open'))
    {
        //Текущий выбранный item
        const selectedImg = evt.currentTarget.querySelector('.selected');
        const selectedLi = selectedImg.parentNode.parentNode;
        if(evt.code === 'ArrowLeft')
        {
            if(selectedLi.previousElementSibling)
            {
                removeClassFromElement('selected');
                let prevImg = selectedLi.previousElementSibling.querySelector('img');
                addClassToElement(prevImg, 'selected');
                refModalImage.src = prevImg.dataset.source;
            }
        }
        else if(evt.code === 'ArrowRight')
        {
            if(selectedLi.nextElementSibling)
            {
                removeClassFromElement('selected');
                let nextImg = selectedLi.nextElementSibling.querySelector('img');
                addClassToElement(nextImg, 'selected');
                refModalImage.src = nextImg.dataset.source;
            }
        }
    }
 }

 //Создаем галерею
renderingMarkup(createGalleryMarkup(galleryItems));

//Слушатель клика на контейнере
refGalleryContainer.addEventListener('click', onImageClick);

//Слушатель Закрытие модалки по кнопке
refModalCloseBtn.addEventListener('click', onCloseModal);

//Слушатель Закрытие модалки по Overlay
refModalOverlay.addEventListener('click', onCloseModal);

//Слушатель Закрытие подалки по Esc
window.addEventListener('keydown', evt =>
{
    if(evt.code === "Escape") onCloseModal();
});

//Слушатель Перелистывание галереи при открытом модальном окне
refGalleryContainer.addEventListener('keydown', onFlippingGallery);