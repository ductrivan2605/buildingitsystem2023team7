document.addEventListener('DOMContentLoaded', function () {
    var images = document.querySelectorAll('.splide__slide');

    if (images.length >= 4) {
        var splide1 = new Splide('#splide1', {
            //... (splide1 설정)
        }).mount();

        var splide2 = new Splide('#splide2', {
            //... (splide2 설정)
        }).mount();

        var splide3 = new Splide('#splide3', {
            //... (splide3 설정)
        }).mount();

        function setSplidePerPage() {
            var splides = [splide1, splide2, splide3];

            if (window.matchMedia('(max-width: 767px)').matches) {
                splides.forEach(function(splide) {
                    splide.options.perPage = 1;
                    splide.refresh();
                });
            } else {
                splides.forEach(function(splide) {
                    splide.options.perPage = 5;
                    splide.refresh();
                });
            }
        }

        window.addEventListener('load', setSplidePerPage);
        window.addEventListener('resize', setSplidePerPage);
    }
});
