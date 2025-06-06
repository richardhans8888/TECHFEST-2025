document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
  
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
  });

// Function for project search filter
function searchProject() {
    var input, filter, projectList, projectItem, char, i, charValue;
    input = document.getElementById("search-input");
    filter = input.value.toUpperCase();
    projectList = document.getElementById("project-list");
    projectItem = projectList.getElementsByTagName("li");
    for (i = 0; i < projectItem.length; i++) {
        char = projectItem[i].getElementsByClassName("project-title")[0];
        charValue = char.textContent || char.innerText;
        if (charValue.toUpperCase().indexOf(filter) > -1) {
            projectItem[i].style.display = "";
        } else {
            projectItem[i].style.display = "none";
        }
    }
}