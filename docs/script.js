// Select form elements
const form = document.getElementById("contactForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const formMessage = document.getElementById("formMessage");

// Form submit event
form.addEventListener("submit", function(event) {
    event.preventDefault();

    // Basic validation
    if (nameInput.value === "" || emailInput.value === "" || messageInput.value === "") {
        formMessage.style.color = "red";
        formMessage.textContent = "Please fill in all fields.";
        return;
    }

    if (!emailInput.value.includes("@")) {
        formMessage.style.color = "red";
        formMessage.textContent = "Please enter a valid email address.";
        return;
    }

    // Success message
    formMessage.style.color = "green";
    formMessage.textContent = "Message sent successfully!";

    // Clear form
    form.reset();
});

// Small interaction: Highlight active nav link on click
const links = document.querySelectorAll(".nav-links a");

links.forEach(link => {
    link.addEventListener("click", function() {
        links.forEach(l => l.classList.remove("active"));
        this.classList.add("active");
    });
});