document.addEventListener('DOMContentLoaded', function () {
  var swiper = new Swiper('#room-carousel', {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: '.carousel-control-next',
      prevEl: '.carousel-control-prev',
    },
    speed: 800,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true, // Permite hacer clic en la paginación para cambiar de diapositiva
    },
  });
});