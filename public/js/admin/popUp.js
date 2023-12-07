function openPopup(popupId) {
    var popupContainer = document.getElementById(popupId);
    if (popupContainer) {
        // Toggle the display property
        popupContainer.style.display = "flex";
    }
}

function closePopup(popupId) {
    var popupContainer = document.getElementById(popupId);
    if (popupContainer) {
        // Toggle the display property
        popupContainer.style.display = "none";
    }
}
