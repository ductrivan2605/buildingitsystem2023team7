const contents = document.querySelectorAll('.content');
const links = document.querySelectorAll('.container1 nav a');

links.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // Remove 'active' class from all links
    links.forEach((link) => {
      link.classList.remove('active');
    });

    // Add 'active' class to the clicked link
    link.classList.add('active');

    showContent(index);
  });
});

function showContent(index) {
  contents.forEach((content, i) => {
    if (content && i === index) {
      content.classList.add('active');
    } else if (content) {
      content.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const resetButton = document.getElementById('resetButton');

  resetButton.addEventListener('click', function() {
    document.getElementById('comment-contents').value = '';

    const ratingInputs = document.querySelectorAll('input[type="radio"][name="rating"]');
    ratingInputs.forEach(input => {
      input.checked = false;
    });
  });
});