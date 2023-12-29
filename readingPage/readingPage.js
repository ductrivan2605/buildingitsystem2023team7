const pageContent = document.getElementById('page-content');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const options = document.getElementById('options');
const currentPageNumber = document.getElementById('current-page-number');
const totalPagesNumber = document.getElementById('total-pages-number');


let currentPage = 1;
const totalPages = 10;
const bookContents = [
    "The contents page (table of contents) is a crucial aspect in any book. It tells the reader what to expect – how many chapters there are, what the sections of the book look like, how long it is, and what pages they can find certain topics on. The table of contents is found in the frontmatter of the book, along with the dedication and the epigraph. It may seem like a small aspect of the book, but it’s a necessary one. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on. how many chapters there are, what the sections of the book look like, how long it is, and what pages they can find certain topics on. The table of contents is found in the frontmatter of the book, along with the dedication and the epigraph. It may seem like a small aspect of the book, but it’s a necessary one. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on. A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.A table of contents page lists out what the book includes. This can be section topics, chapter titles, and discussions. In fiction (novels), the table of contents lists the chapter titles and the pages they’re found on. In some instances, these chapters will have creative and unique titles. In others, they may simply read “Chapter One,” “Chapter Two,” and so on.",
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
    currentPageNumber.textContent = pageNum;
}


displayPage(currentPage);
totalPagesNumber.textContent = totalPages;


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

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowLeft') {
        if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
        }
    } else if (event.code === 'ArrowRight') {
        if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
        }
    }
});


