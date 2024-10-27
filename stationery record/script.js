// Get modal elements
const modal = document.getElementById('confirmationModal');
const confirmButton = document.getElementById('confirmButton');
const cancelButton = document.getElementById('cancelButton');
const confirmationMessage = document.getElementById('confirmationMessage');

let pendingChange = null; // To store pending change info

// Function to update icons in boxes
function updateBoxes(iconHTML) {
    const boxes = document.querySelectorAll('.box-1');
    boxes.forEach(box => {
        box.innerHTML = iconHTML; // Update the box with the selected icon
    });
}

// Event listener for dropdown icon buttons
document.querySelectorAll('.dropdown-content button').forEach(button => {
    button.addEventListener('click', function() {
        const iconClass = this.querySelector('i').className; // Get the icon class
        const text = this.querySelector('h4').innerText; // Get the text
        const iconHTML = `<i class="${iconClass}"></i>`; // Prepare the icon HTML

        // Prepare the confirmation message
        confirmationMessage.innerText = `Are you sure you want to change your icon to "${text}"?`;
        pendingChange = () => {
            // Update the dropdown button
            const dropbtnIcon = document.querySelector('.dropbtn i');
            const dropbtnText = document.querySelector('.dropbtn .ICONS');

            dropbtnIcon.className = iconClass; // Change the icon class
            dropbtnText.innerText = text; // Change the button text
            dropbtnIcon.style.color = 'white'; // Set the icon color to white
            
            // Update the boxes with the new icon
            updateBoxes(iconHTML);
        };

        // Show the modal
        modal.style.display = 'block';
    });
});

// Event listener for confirm button
confirmButton.addEventListener('click', function() {
    if (pendingChange) {
        pendingChange();
        modal.style.display = 'none'; // Close the modal
        pendingChange = null; // Clear pending change
    }
});

// Event listener for cancel button
cancelButton.addEventListener('click', function() {
    modal.style.display = 'none'; // Close the modal
    pendingChange = null; // Clear pending change
});

// Close the modal when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none'; // Close the modal
    pendingChange = null; // Clear pending change
});

// Event listener for file input to add new icon
document.querySelector('.upload-button input[type="file"]').addEventListener('change', function(event) {
    const file = event.target.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Create a new button for the uploaded image
            const newButton = document.createElement('button');
            newButton.innerHTML = `<div class="box"><img src="${e.target.result}" style="width: 24px; height: 24px;" alt="uploaded icon" /><h4>${file.name}</h4></div>`;
            
            // Add click event to the new button
            newButton.addEventListener('click', function() {
                // Prepare the confirmation message for uploaded icon
                confirmationMessage.innerText = `Are you sure you want to change your icon to "${file.name}"?`;
                pendingChange = () => {
                    const dropbtnIcon = document.querySelector('.dropbtn i');
                    const dropbtnText = document.querySelector('.dropbtn .ICONS');
                    dropbtnIcon.innerHTML = `<img src="${e.target.result}" style="width: 24px; height: 24px;" alt="uploaded icon" />`; // Set uploaded icon
                    dropbtnText.innerText = file.name; // Set uploaded file name
                    dropbtnIcon.style.color = 'white'; // Set icon color to white
                    
                    // Update the boxes with the uploaded icon
                    updateBoxes(`<img src="${e.target.result}" style="width: 24px; height: 24px;" alt="uploaded icon" />`);
                };

                // Show the modal
                modal.style.display = 'block';
            });

            // Append the new button to the dropdown content
            document.querySelector('.dropdown-content').appendChild(newButton);
        };
        reader.readAsDataURL(file); // Read the uploaded file
    }
});

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
        pendingChange = null; // Clear pending change
    }
};

// Function for search functionality
function performSearch() {
    const input = document.getElementById('searchInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = ''; // Clear previous error

    // Validate the input
    const number = parseFloat(input);
    if (isNaN(number) || number < 1.0 || number > 99.9) {
        errorMessage.textContent = 'Please enter a number between 1.0 and 99.9.';
        return;
    }

    const boxes = document.querySelectorAll('.box-2 p');
    let found = false;

    boxes.forEach(box => {
        if (box.textContent === input) {
            found = true;
            const parentBox = box.parentElement;

            // Scroll to the box and center it
            const boxRect = parentBox.getBoundingClientRect();
            const boxOffset = boxRect.top + window.scrollY - (window.innerHeight / 2) + (boxRect.height / 2);
            window.scrollTo({
                top: boxOffset,
                behavior: 'smooth'
            });

            parentBox.classList.add('blink'); // Add the blink class
            // Remove the class after animation completes
            setTimeout(() => {
                parentBox.classList.remove('blink');
            }, 1500); // Total duration of 3 blinks (0.5s * 3)
        }
    });

    if (!found) {
        errorMessage.textContent = 'Number not found.';
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        performSearch();
    }
}
