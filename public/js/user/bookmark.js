// Select all bookmark buttons
const bookmarkButtons = document.querySelectorAll('.bookmark-btn');

// Add an event to each bookmark button
bookmarkButtons.forEach((button, index) => {
  let isBookmarked = false; // Variable to track bookmark status for each button

  button.addEventListener('click', () => {
    isBookmarked = !isBookmarked; // Toggle bookmark status

    if (isBookmarked) {
      // Actions when bookmarked
      button.querySelector('.btnIcon').style.color = 'gold'; // Change icon color to indicate bookmarked
      // Here, perform actions like sending bookmark information to the server
      console.log('Bookmarked added - Book index:', index);
    } else {
      // Actions when unbookmarked
      button.querySelector('.btnIcon').style.color = ''; // Reset icon color to indicate unbookmarked
      // Additional actions like sending unbookmark information to the server may be added here
      console.log('Bookmark removed - Book index:', index);
    }
  });
});
