  function submitForm() {
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const author = document.getElementById('author').value;
    const publisher = document.getElementById('publisher').value;
    const description = document.getElementById('description').value;
  }
  
  function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('imagePreview');
  
    if (input.files && input.files[0]) {
      const reader = new FileReader();
  
      reader.onload = function (e) {
        preview.src = e.target.result;
        preview.style.display = 'block';
      };
  
      reader.readAsDataURL(input.files[0]);
    } else {
      preview.src = '#';
      preview.style.display = 'none';
    }
  }
  
  function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('author').value = '';
    document.getElementById('publisher').value = '';
    document.getElementById('description').value = '';
  
    // 이미지 미리보기 초기화
    const preview = document.getElementById('imagePreview');
    preview.src = '#';
    preview.style.display = 'none';
  
    // 파일 업로드 input 초기화
    const fileInput = document.getElementById('imageUpload');
    fileInput.value = '';
  }
  