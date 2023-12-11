document.addEventListener("DOMContentLoaded", function () {
    const booksPerPage = 10;
    const books = document.querySelectorAll('.book');
    const bookContainer = document.querySelector('.book-container');
    const pageButtons = document.querySelectorAll('.page-btn');

    function displayBooks(page) {
        bookContainer.innerHTML = '';

        const startIndex = (page - 1) * booksPerPage;
        const endIndex = startIndex + booksPerPage;

        books.forEach((book, index) => {
            if (index >= startIndex && index < endIndex) {
                bookContainer.appendChild(book);
            }
        });

        
        pageButtons.forEach(button => {
            button.classList.remove('active');
        });
        pageButtons[page - 1].classList.add('active');
    }

    pageButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            displayBooks(index + 1); 
        });
    });

    displayBooks(1); 
    pageButtons[0].classList.add('active'); 
});
