var dropdownVisible = false;

function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdownVisible = !dropdownVisible; // Toggle the dropdown state
  dropdown.classList.toggle("show", dropdownVisible);
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches(".user")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        dropdownVisible = false;
      }
    }
  }
};

function toggleMenu() {
  var navList = document.getElementById("navList");
  navList.style.display =
    navList.style.display === "none" || navList.style.display === ""
      ? "flex"
      : "none";
}

/* for the bar */
document.addEventListener("DOMContentLoaded", function () {
  const header = document.querySelector(".header");
  const line = document.createElement("div");
  line.classList.add("hover-line");

  header.appendChild(line);

  header.addEventListener("mousemove", function (event) {
    const mouseX = event.clientX - header.getBoundingClientRect().left;
    line.style.width = mouseX + "px";
    line.style.left = mouseX + "px";
  });

  header.addEventListener("mouseleave", function () {
    line.style.width = "0";
  });
});

/* for the user */
document.addEventListener("click", function (event) {
  const userSection = document.getElementById("userSection");
  const userDropdown = document.getElementById("userDropdown");

  // Check if the click is inside the user section or its dropdown
  const isClickInsideUser =
    userSection.contains(event.target) || userDropdown.contains(event.target);

  // If not, close the user dropdown
  if (!isClickInsideUser) {
    userDropdown.style.display = "none";
  }
});

function toggleUserMenu() {
  const userDropdown = document.getElementById("userDropdown");
  userDropdown.style.display =
    userDropdown.style.display === "block" ? "none" : "block";
}
