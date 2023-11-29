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