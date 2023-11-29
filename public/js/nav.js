var dropdownVisible = false;

function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdownVisible = !dropdownVisible; // Toggle the dropdown state
  dropdown.classList.toggle("show", dropdownVisible);
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.user')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
        dropdownVisible = false; // Update the dropdown state when closed
      }
    }
  }
}

function toggleMenu() {
    var navList = document.getElementById("navList");
    navList.style.display = (navList.style.display === "none" || navList.style.display === "") ? "flex" : "none";
  }

  function submitWishlist() {
    const author = document.getElementById("author").value;
    const title = document.getElementById("title").value;
    const date = document.getElementById("date").value;
    const image = document.getElementById("image").value;
  
    const wishlistData = {
      author,
      title,
      date,
      image,
    };
  
    // Send wishlist data to the server (Node.js) using an AJAX request or fetch API
    // Example using fetch:
    fetch('/submit-wishlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wishlistData),
    })
    .then(response => response.json())
    .then(data => {
      // Handle response from the server (e.g., show a success message)
      console.log(data);
    })
    .catch(error => {
      // Handle errors
      console.error('Error:', error);
    });
  }