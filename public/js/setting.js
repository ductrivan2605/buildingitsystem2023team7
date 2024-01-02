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

//image upload
function handleImageUpload() {
  const input = document.getElementById('uploadInput');
  const image = document.getElementById('profileImage');


  if (input.files && input.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {

      image.src = e.target.result;
    };


    reader.readAsDataURL(input.files[0]);
  }
}


function resetImage() {
  const image = document.getElementById('profileImage');

  image.src = '/public/images/userDefault.jpg';
}


document.getElementById('uploadInput').addEventListener('change', handleImageUpload);
