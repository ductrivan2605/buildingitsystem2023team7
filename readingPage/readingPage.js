const pageContent = document.getElementById('page-content');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const options = document.getElementById('options');

let currentPage = 1;
const totalPages = 10;
const bookContents = [
    "Hello",
    "my",
    "name",
    "is",
    "Kim",
    "minsung",
    "nice",
    "to",
    "meet",
    "you"
]


function displayPage(pageNum) {
    pageContent.textContent = bookContents[pageNum - 1];
}


displayPage(currentPage);


prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
    }
});


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

            increaseFontSize();
            break;
        case 'decreaseFontSize':

            decreaseFontSize();
            break;

        default:
            break;
    }
});



function increaseFontSize() {
    const currentFontSize = window.getComputedStyle(pageContent).fontSize;
    const currentFontSizeValue = parseFloat(currentFontSize);
    pageContent.style.fontSize = `${currentFontSizeValue + 4}px`;
}


function decreaseFontSize() {
    const currentFontSize = window.getComputedStyle(pageContent).fontSize;
    const currentFontSizeValue = parseFloat(currentFontSize);
    if (currentFontSizeValue > 2) {
        pageContent.style.fontSize = `${currentFontSizeValue - 4}px`;
    }
}