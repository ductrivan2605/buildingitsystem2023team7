function toggleSearch() {
    var searchOverlay = document.getElementById("search-overlay");
    if (searchOverlay.style.display === "flex") {
        searchOverlay.style.display = "none";
    } else {
        searchOverlay.style.display = "flex";
    }
}

function closeSearch() {
    document.getElementById("search-overlay").style.display = "none";
}




const header = document.querySelector('header')
        

document.getElementById('bd-theme').addEventListener('click',()=>{
    if (document.documentElement.getAttribute('data-bs-theme') == 'dark') {
        document.documentElement.setAttribute('data-bs-theme','light')
        var elements = document.querySelectorAll('.bg-dark'); 
        elements.forEach(function(element) {
            element.classList.remove('bg-dark');
            element.classList.add('bg-white');
            header.style.background = documentElement.value;
        });
    }
    else {
        document.documentElement.setAttribute('data-bs-theme','dark');
        var elements = document.querySelectorAll('.bg-white'); 
        elements.forEach(function(element) {
            element.classList.remove('bg-white');
            element.classList.add('bg-dark');
            header.style.background = documentElement.value;
        });
        

    }
})