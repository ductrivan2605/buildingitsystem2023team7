function openDropDown(dropDownId) {
    var dropDownContainer = document.getElementById(dropDownId);
    if (dropDownContainer) {
        // Toggle the display property
        dropDownContainer.style.display = (dropDownContainer.style.display === "none") ? "block" : "none";
    }
}
