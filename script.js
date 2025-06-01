document.addEventListener("DOMContentLoaded", function () {
    const toggles = document.querySelectorAll(".faq-toggle");
    const questions = document.querySelectorAll(".faq-question");

    // Adding event listeners to both the button and the question
    [...toggles, ...questions].forEach(element => {
        element.addEventListener("click", function (e) {
            const faqItem = this.closest(".faq-item");
            const answer = faqItem.querySelector(".faq-answer");
            const toggleButton = faqItem.querySelector(".faq-toggle");
            const isOpen = answer.style.display === "block";

            // If the clicked element is the button and it's not open, toggle it
            if (e.target.classList.contains("faq-toggle") || e.target.closest(".faq-question")) {
                // Close all answers and reset button text
                document.querySelectorAll(".faq-answer").forEach(a => a.style.display = "none");
                document.querySelectorAll(".faq-toggle").forEach(btn => btn.textContent = "+");

                // Toggle current answer if not open
                if (!isOpen) {
                    answer.style.display = "block";
                    toggleButton.textContent = "−";
                }
            }
        });
    });
});


// Change navbar background color on scroll
window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Highlight active link on scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar ul li a");

window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - section.clientHeight / 3) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href").includes(currentSection)) {
            link.classList.add("active");
        }
    });
});
