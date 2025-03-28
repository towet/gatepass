// API Configuration
const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gatePassForm');
    const visitorType = document.getElementById('visitorType');
    const idNumberGroup = document.getElementById('idNumberGroup');
    const idNumber = document.getElementById('idNumber');
    const idError = document.getElementById('idError');
    const passesList = document.getElementById('passesList');
    const submitBtn = document.querySelector('.submit-btn');

    // Function to fetch passes from localStorage
    function fetchPasses() {
        try {
            const passes = JSON.parse(localStorage.getItem('passes')) || [];
            displayPasses(passes);
        } catch (error) {
            console.error('Error fetching passes:', error);
            showError('Unable to load passes');
        }
    }

    // Function to save pass to localStorage
    function savePass(gatePass) {
        try {
            const passes = JSON.parse(localStorage.getItem('passes')) || [];
            const newPass = {
                id: Math.random().toString(36).substr(2, 4),
                ...gatePass,
                timestamp: new Date().toLocaleString()
            };
            passes.push(newPass);
            localStorage.setItem('passes', JSON.stringify(passes));
            return newPass;
        } catch (error) {
            console.error('Error saving pass:', error);
            throw new Error('Failed to save pass');
        }
    }

    // Function to show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, submitBtn);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    // Event Listener: Handle visitor type change
    visitorType.addEventListener('change', (e) => {
        if (e.target.value === 'adult') {
            idNumberGroup.style.display = 'block';
            idNumberGroup.style.opacity = '0';
            setTimeout(() => {
                idNumberGroup.style.opacity = '1';
            }, 10);
            idNumber.required = true;
        } else {
            idNumberGroup.style.display = 'none';
            idNumber.required = false;
        }
    });

    // Event Listener: Validate ID number
    idNumber.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value && !/^\d{8}$/.test(value)) {
            idError.textContent = 'ID must be 8 digits';
            idError.style.display = 'block';
        } else {
            idError.style.display = 'none';
        }
    });

    // Event Listener: Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Creating Pass...';

        try {
            const formData = new FormData(form);
            const gatePass = Object.fromEntries(formData.entries());
            
            // Validate adult ID
            if (gatePass.visitorType === 'adult' && !/^\d{8}$/.test(gatePass.idNumber)) {
                throw new Error('Invalid ID number');
            }

            // Save the pass
            const newPass = savePass(gatePass);
            
            // Add new pass to display
            const passElement = createPassElement(newPass);
            passesList.insertBefore(passElement, passesList.firstChild);
            
            // Reset form
            form.reset();
            idNumberGroup.style.display = 'none';
            
            // Show success message
            showError('Pass created successfully!');
        } catch (error) {
            console.error(error);
            showError(error.message);
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = 'Create Pass';
        }
    });

    // Function to create pass element
    function createPassElement(pass) {
        const div = document.createElement('div');
        div.className = 'pass';
        div.innerHTML = `
            <div class="pass-header">
                <span class="visitor-type ${pass.visitorType}">${pass.visitorType}</span>
                <span class="timestamp">${pass.timestamp}</span>
            </div>
            <h3>${pass.fullName}</h3>
            <p><i class="fas fa-id-card"></i> ${pass.visitorType === 'adult' ? pass.idNumber : 'N/A'}</p>
            <p><i class="fas fa-info-circle"></i> ${pass.purpose}</p>
        `;
        return div;
    }

    // Function to display passes
    function displayPasses(passes) {
        passesList.innerHTML = '';
        if (passes.length === 0) {
            passesList.innerHTML = '<p class="no-passes">No passes created yet</p>';
            return;
        }
        passes.reverse().forEach(pass => {
            const passElement = createPassElement(pass);
            passesList.appendChild(passElement);
        });
    }

    // Initial load of passes
    fetchPasses();
});
