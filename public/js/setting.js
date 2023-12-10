showContent('general');

function showContent(category) {
    const contentElements = document.querySelectorAll('.content');
  
    contentElements.forEach((element) => {
      element.style.display = 'none';
    });
  
    const selectedContent = document.getElementById(category);
    if (selectedContent) {
      selectedContent.style.display = 'block';
    }
  }
  
