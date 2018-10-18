/* ---- ELEMENTS ---- */

/* header top */
var header = document.getElementById('header');
var burgerMenu = document.getElementById('header-top-burger');
var menuContainer = document.getElementById('header-nav-container');

/* ---- EVENT LISTENERS ---- */
burgerMenu.addEventListener('click', function(event) {
    menuContainer.classList.toggle('show-header');
    burgerMenu.classList.toggle('burger-open');
    header.classList.toggle('header-open');
});
