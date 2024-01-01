document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id'); // Get book ID from URL
  
    fetch(`/api/get-book/${bookId}`)
      .then(response => response.blob())
      .then(blob => {
        const pdfUrl = URL.createObjectURL(blob);
  
        // Render PDF using PDF.js
        const pdfViewer = document.getElementById('pdf-viewer');
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        
        loadingTask.promise.then(function(pdfDoc) {
          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            pdfDoc.getPage(pageNum).then(function(page) {
              const viewport = page.getViewport({ scale: 1.5 });
              const canvas = document.createElement('canvas');
              const context = canvas.getContext('2d');
              canvas.height = viewport.height;
              canvas.width = viewport.width;
              pdfViewer.appendChild(canvas);
              
              const renderContext = {
                canvasContext: context,
                viewport: viewport
              };
              page.render(renderContext);
            });
          }
        }).catch(error => {
          console.error('Error loading PDF:', error);
        });
      })
      .catch(error => {
        console.error('Error fetching book:', error);
      });
  });
  
    
  // Navigation button event listeners
      document.getElementById('prev-page').addEventListener('click', function() {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
        }
      });
    
      document.getElementById('next-page').addEventListener('click', function() {
        if (currentPage < pdfDoc.numPages) {
          currentPage++;
          renderPage(currentPage);
        }
      });
    