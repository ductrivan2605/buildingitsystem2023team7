const contents = document.querySelectorAll('.content');
const links = document.querySelectorAll('nav a');

links.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showContent(index);
  });
});

function showContent(index) {
  contents.forEach((content, i) => {
    if (i === index) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
}

