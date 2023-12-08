var splide1 = new Splide('#splide1', {
    type: 'loop',
    drag: 'free',
    snap: true,
    perPage: 4, // 첫 번째 구역에서 보여질 아이템 수 (데스크탑)
    breakpoints: {
        767: {
            perPage: 1, // 첫 번째 구역에서 모바일에서 보여질 아이템 수
            start: 0 // 첫 번째 구역에서 모바일에서 시작 위치를 정중앙으로 조정
        }
    }
}).mount();

var splide2 = new Splide('#splide2', {
    type: 'loop',
    drag: 'free',
    snap: true,
    perPage: 4, // 두 번째 구역에서 보여질 아이템 수 (데스크탑)
    breakpoints: {
        767: {
            perPage: 1, // 두 번째 구역에서 모바일에서 보여질 아이템 수
            start: 0 // 두 번째 구역에서 모바일에서 시작 위치를 정중앙으로 조정
        }
    }
}).mount();

var splide3 = new Splide('#splide3', {
    type: 'loop',
    drag: 'free',
    snap: true,
    perPage: 4, // 세 번째 구역에서 보여질 아이템 수 (데스크탑)
    breakpoints: {
        767: {
            perPage: 1, // 세 번째 구역에서 모바일에서 보여질 아이템 수
            start: 0 // 세 번째 구역에서 모바일에서 시작 위치를 정중앙으로 조정
        }
    }
}).mount();


// 창 크기에 따라 아이템 수 변경
function setSplidePerPage() {
    if (window.matchMedia('(max-width: 767px)').matches) {
        splide1.options.perPage = 1; // 첫 번째 구역에서 모바일에서 보여질 아이템 수
        splide2.options.perPage = 1; // 두 번째 구역에서 모바일에서 보여질 아이템 수
        splide3.options.perPage = 1; // 세 번째 구역에서 모바일에서 보여질 아이템 수
    } else {
        splide1.options.perPage = 4; // 첫 번째 구역에서 데스크탑에서 보여질 아이템 수
        splide2.options.perPage = 4; // 두 번째 구역에서 데스크탑에서 보여질 아이템 수
        splide3.options.perPage = 4; // 세 번째 구역에서 데스크탑에서 보여질 아이템 수
    }

    splide1.refresh();
    splide2.refresh();
    splide3.refresh();
}

// 페이지 로드 및 창 크기 변경 시 호출하여 아이템 수 변경
window.addEventListener('load', setSplidePerPage);
window.addEventListener('resize', setSplidePerPage);

