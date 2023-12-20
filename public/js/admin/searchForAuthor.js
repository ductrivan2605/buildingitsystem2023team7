var selectedAuthors = [];
var selectedCategories = [];

function toggleDropDown(dropDownId) {
    var dropDownContainer = document.getElementById(dropDownId);
    if (dropDownContainer) {
        dropDownContainer.style.display = (dropDownContainer.style.display === "none") ? "block" : "none";
    }
}

function updateSelectedItems(checkbox, selectedItems, inputId, dropDownId) {
    var itemName = checkbox.value;
    var index = selectedItems.indexOf(itemName);
    var dropDownContainer = document.getElementById(dropDownId);

    if (index === -1) {
        // Item not found, add to the selectedItems array
        selectedItems.push(itemName);
    } else {
        // Item found, remove from the selectedItems array
        selectedItems.splice(index, 1);
    }

    // Update the input field with selected items separated by commas
    var inputField = document.getElementById(inputId);
    inputField.value = selectedItems.join(', ');

    // Hide the dropdown
    dropDownContainer.style.display = 'none';
}


function searchItems(inputId, selectedItemsId, dropDownId) {
    var dropDownContainer = document.getElementById(dropDownId);
    var input = document.getElementById(inputId);
    var filter = input.value.toUpperCase();
    var items = dropDownContainer.querySelectorAll(`#${selectedItemsId} label`);
    var inputs = dropDownContainer.querySelectorAll(`#${selectedItemsId} input`);

    for (var i = 0; i < items.length; i++) {
        if (items[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = '';
            inputs[i].style.display = '';
        } else {
            items[i].style.display = 'none';
            inputs[i].style.display = 'none';
        }
    }
}


