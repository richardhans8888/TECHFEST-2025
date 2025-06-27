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

// Select all question buttons
const faqQuestions = document.querySelectorAll('.faq-question');

// Loop through each question button
faqQuestions.forEach(question => {
    // Add a click event listener to each question
    question.addEventListener('click', () => {
        // Close any other open answers except the one clicked
        faqQuestions.forEach(item => {
            if (item !== question) {
                item.classList.remove('active'); // Remove 'active' class to reset arrow rotation
                item.nextElementSibling.style.maxHeight = null; // Collapse the answer
            }
        });

        // Toggle 'active' class on the clicked question to rotate the arrow
        question.classList.toggle('active');

        // Select the corresponding answer div
        const answer = question.nextElementSibling;

        // Check if the answer is already open
        if (answer.style.maxHeight) {
            // If open, close it by resetting max-height
            answer.style.maxHeight = null;
        } else {
            // If closed, set max-height to scrollHeight to expand it
            answer.style.maxHeight = answer.scrollHeight + 'px';
        }
    });
});

// Data analytics button for final submission
var countDownDateShow = new Date("Jul 14, 2025 00:00:00").getTime();
var x = setInterval(countDownShow, 1000)
function countDownShow() {
    var now = new Date().getTime()
    var duration = countDownDateShow - now;

    if (duration < 0) {
        var button = document.getElementsByClassName("final-btn");
        for (var i = 0; i < button.length; i++) {
            button[i].style.display = "inline-block";
        }
        clearInterval(x);
    }
}

var countDownDateHide = new Date("Jul 18, 2025 23:59:59").getTime();
var y = setInterval(countDownHide, 1000)
function countDownHide() {
    var now = new Date().getTime()
    var duration = countDownDateHide - now;

    if (duration < 0) {
        var button = document.getElementsByClassName("da-btn-f");
        for (var i = 0; i < button.length; i++) {
            button[i].remove();
        }
        clearInterval(y);
    }
}