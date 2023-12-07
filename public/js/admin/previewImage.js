function previewImage(inputId, previewContainerId) {
    const input = document.getElementById(inputId);
    const files = input.files;
  
    // Get the image preview container
    const previewContainer = document.getElementById(previewContainerId);
    previewContainer.innerHTML = ''; // Clear previous previews
  
    // Iterate over the selected files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const previewElement = document.createElement('img');
  
      // Set the source of the preview element to the selected file
      previewElement.src = URL.createObjectURL(file);
  
      // Apply fixed dimensions and object-fit: cover
      previewElement.style.width = '100px';
      previewElement.style.height = '100px';
      previewElement.style.objectFit = 'cover';
      // Add the preview element to the preview container
      previewContainer.appendChild(previewElement);
    }
  }