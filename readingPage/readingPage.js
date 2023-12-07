// JavaScript로 페이지 이동 기능 구현
const pageContent = document.getElementById('page-content');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const options = document.getElementById('options');

let currentPage = 1;
const totalPages = 10; // 전체 페이지 수
const bookContents = [
    "안녕하세요",
    "저의",
    "이름은",
    "김민성",
    "입니다",
    "반갑습니다",
    "다음에",
    "다시",
    "만나요",
    "안녕히"
]

// 페이지 표시 함수
 function displayPage(pageNum) {
    pageContent.textContent = bookContents[pageNum - 1];
  }

// 초기 페이지 표시
displayPage(currentPage);

// 이전 페이지 버튼 클릭 시
prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});

// 다음 페이지 버튼 클릭 시
nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
    }
});

// JavaScript code (existing code remains unchanged)

// Add options to the page selection dropdown
const pageSelection = document.getElementById('page-selection');

for (let i = 1; i <= totalPages; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.text = `Page ${i}`;
  pageSelection.appendChild(option);
}

// 페이지 선택 드롭다운 변경 시
pageSelection.addEventListener('change', (e) => {
  const selectedPage = parseInt(e.target.value);
  if (!isNaN(selectedPage)) {
    currentPage = selectedPage;
    displayPage(currentPage);
  }
});



options.addEventListener('change', (e) => {
    const selectedOption = e.target.value;
    switch (selectedOption) {
      case 'increaseFontSize':
        // 글꼴 크기 증가
        increaseFontSize();
        break;
      case 'decreaseFontSize':
        // 글꼴 크기 감소
        decreaseFontSize();
        break;

       default:
        break;
    }
  });
  

  // 글꼴 크기 증가 함수
function increaseFontSize() {
    const currentFontSize = window.getComputedStyle(pageContent).fontSize;
    const currentFontSizeValue = parseFloat(currentFontSize);
    pageContent.style.fontSize = `${currentFontSizeValue + 4}px`;
  }
  
  // 글꼴 크기 감소 함수
  function decreaseFontSize() {
    const currentFontSize = window.getComputedStyle(pageContent).fontSize;
    const currentFontSizeValue = parseFloat(currentFontSize);
    if (currentFontSizeValue > 2) {
      pageContent.style.fontSize = `${currentFontSizeValue - 4}px`;
    }
  }