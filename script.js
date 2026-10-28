
// <script>
// const form = document.getElementById("regForm");
// const errorMsg = document.getElementById("errorMsg");

// form.addEventListener("submit", function(event) {
//     event.preventDefault();

//     const name = form.elements["name"].value.trim();
//     const email = form.elements["email"].value.trim();
//     const phone = form.elements["phone"].value.trim();
//     const password = form.elements["password"].value;

//     errorMsg.style.color = "#ffb3b3";

//     if (name === "") {
//         errorMsg.textContent = "Please enter your full name.";
//         form.elements["name"].focus();
//         return;
//     }

//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         errorMsg.textContent = "Please enter a valid email address.";
//         form.elements["email"].focus();
//         return;
//     }

//     if (!/^[0-9]{10}$/.test(phone)) {
//         errorMsg.textContent = "Enter a valid 10-digit phone number.";
//         form.elements["phone"].focus();
//         return;
//     }

//     if (password.length < 6) {
//         errorMsg.textContent = "Password must be at least 6 characters.";
//         form.elements["password"].focus();
//         return;
//     }

//     errorMsg.style.color = "#2fe09b";
//     errorMsg.textContent =
//         "All fields are valid! Registration is not connected to a backend yet.";
// });
// </script>
