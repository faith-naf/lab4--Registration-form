document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const regForm = document.getElementById('regForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const programmeInput = document.getElementById('programme');
    const yearInputs = document.querySelectorAll('input[name="year"]');
    const interestInputs = document.querySelectorAll('input[name="interests"]');
    const photoInput = document.getElementById('photo');
    const liveRegion = document.getElementById('live');
    
    // Output containers
    const cardsContainer = document.getElementById('cards');
    const summaryTbody = document.getElementById('summaryTbody');
    
    // Store profiles data
    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    
    // Initialize the page with existing profiles
    if (profiles.length > 0) {
        profiles.forEach(profile => {
            createProfileCard(profile);
            addTableRow(profile);
        });
    }
    
    // Form validation functions
    function validateRequired(value, fieldName) {
        if (!value.trim()) {
            return `${fieldName} is required`;
        }
        return '';
    }
    
    function validateEmail(value) {
        if (!value.trim()) {
            return 'Email is required';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
        }
        
        return '';
    }
    
    function validateProgramme(value) {
        if (!value) {
            return 'Please select a programme';
        }
        return '';
    }
    
    function validateYear() {
        const selected = Array.from(yearInputs).some(input => input.checked);
        if (!selected) {
            return 'Please select your year of study';
        }
        return '';
    }
    
    // Validate input on blur
    firstNameInput.addEventListener('blur', () => {
        const error = validateRequired(firstNameInput.value, 'First name');
        document.getElementById('err-firstName').textContent = error;
    });
    
    lastNameInput.addEventListener('blur', () => {
        const error = validateRequired(lastNameInput.value, 'Last name');
        document.getElementById('err-lastName').textContent = error;
    });
    
    emailInput.addEventListener('blur', () => {
        const error = validateEmail(emailInput.value);
        document.getElementById('err-email').textContent = error;
    });
    
    programmeInput.addEventListener('change', () => {
        const error = validateProgramme(programmeInput.value);
        document.getElementById('err-programme').textContent = error;
    });
    
    yearInputs.forEach(input => {
        input.addEventListener('change', () => {
            document.getElementById('err-year').textContent = validateYear();
        });
    });
    
    // Form submission handler
    regForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate all fields
        const firstNameError = validateRequired(firstNameInput.value, 'First name');
        const lastNameError = validateRequired(lastNameInput.value, 'Last name');
        const emailError = validateEmail(emailInput.value);
        const programmeError = validateProgramme(programmeInput.value);
        const yearError = validateYear();
        
        // Display errors
        document.getElementById('err-firstName').textContent = firstNameError;
        document.getElementById('err-lastName').textContent = lastNameError;
        document.getElementById('err-email').textContent = emailError;
        document.getElementById('err-programme').textContent = programmeError;
        document.getElementById('err-year').textContent = yearError;
        
        // Check if there are any errors
        const hasErrors = firstNameError || lastNameError || emailError || programmeError || yearError;
        
        if (hasErrors) {
            liveRegion.textContent = 'Please fix the errors before submitting the form.';
            return;
        }
        
        // Get selected interests
        const selectedInterests = Array.from(interestInputs)
            .filter(input => input.checked)
            .map(input => input.value);
        
        // Get selected year
        const selectedYear = Array.from(yearInputs).find(input => input.checked).value;
        
        // Create profile object
        const profile = {
            id: Date.now(), // Unique ID for each profile
            firstName: firstNameInput.value.trim(),
            lastName: lastNameInput.value.trim(),
            email: emailInput.value.trim(),
            programme: programmeInput.value,
            year: selectedYear,
            interests: selectedInterests,
            photo: photoInput.value.trim() || 'https://placehold.co/400x400?text=No+Image'
        };
        
        // Add to profiles array
        profiles.push(profile);
        
        // Save to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));
        
        // Create UI elements
        createProfileCard(profile);
        addTableRow(profile);
        
        // Reset form
        regForm.reset();
        
        // Announce success
        liveRegion.textContent = `Profile for ${profile.firstName} ${profile.lastName} has been successfully created.`;
    });
    
    // Create profile card
    function createProfileCard(profile) {
        const card = document.createElement('div');
        card.className = 'card-person';
        card.dataset.id = profile.id;
        
        const interestsHtml = profile.interests.length > 0 
            ? `<div class="interests">${profile.interests.map(interest => `<span class="badge">${interest}</span>`).join('')}</div>`
            : '';
        
        card.innerHTML = `
            <img src="${profile.photo}" alt="Profile photo of ${profile.firstName} ${profile.lastName}">
            <div class="card-content">
                <h3>${profile.firstName} ${profile.lastName}</h3>
                <p>${profile.email}</p>
                <p>
                    <span class="badge">${profile.programme}</span>
                    <span class="badge">Year ${profile.year}</span>
                </p>
                ${interestsHtml}
                <div class="actions">
                    <button class="btn-remove" onclick="removeProfile(${profile.id})">Remove</button>
                </div>
            </div>
        `;
        
        cardsContainer.prepend(card);
    }
    
    // Add table row
    function addTableRow(profile) {
        const tr = document.createElement('tr');
        tr.dataset.id = profile.id;
        
        const interestsText = profile.interests.join(', ') || 'None specified';
        
        tr.innerHTML = `
            <td>${profile.firstName} ${profile.lastName}</td>
            <td>${profile.programme}</td>
            <td>Year ${profile.year}</td>
            <td>${interestsText}</td>
            <td class="table-actions">
                <button class="btn-remove" onclick="removeProfile(${profile.id})">Remove</button>
            </td>
        `;
        
        summaryTbody.prepend(tr);
    }
});

// Remove profile function (needs to be global for onclick attribute)
function removeProfile(id) {
    // Get profiles from localStorage
    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    
    // Remove from array
    profiles = profiles.filter(profile => profile.id !== id);
    
    // Save to localStorage
    localStorage.setItem('profiles', JSON.stringify(profiles));
    
    // Remove from UI
    document.querySelector(`.card-person[data-id="${id}"]`)?.remove();
    document.querySelector(`#summaryTbody tr[data-id="${id}"]`)?.remove();
    
    // Update global variable
    if (typeof window.profiles !== 'undefined') {
        window.profiles = profiles;
    }
    
    // Announce removal
    document.getElementById('live').textContent = 'Profile has been removed.';
}