document.addEventListener("DOMContentLoaded", function () {
    const searchBar = document.getElementById("genre-search-dropdown");
    const searchIcon = document.getElementById("search-icon");
    const searchContent = document.getElementById("search-content");
  
    let timeoutId;
  
    const hideSearchBar = () => {
        searchContent.classList.add("active");
    };
  
    searchIcon.addEventListener("click", function () {
        searchContent.classList.toggle("active");
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideSearchBar, 15000);
    });
  
    searchBar.addEventListener("click", function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(hideSearchBar, 15000); // Set the timeout value (5 seconds in this example)
    });
    timeoutId = setTimeout(hideSearchBar, 15000);
});
  