var $ = require('jquery');
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

$('#main-top-newsletter').submit(function(event) {
    event.preventDefault();
    const email = $("#main-top-newsletter-input").val();
    $.ajax({
        url: "https://barde.skatekrak.com/emails",
        type: "POST",
        data: { email },
        dataType: "json",
        success: function(data) {
            // TODO
            console.log(data);
        },
        error: function(e) {
            // TODO
            console.error(e);
        }
    });
});