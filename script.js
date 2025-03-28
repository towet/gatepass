// Local Storage Configuration
const STORAGE_KEY = 'gatePasses';

// Function to generate random ID
function generateRandomId() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

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
            const passes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            displayPasses(passes);
        } catch (error) {
            console.error('Error fetching passes:', error);
            showError('Unable to load passes');
        }
    }

    // Function to save pass to localStorage
    function savePass(gatePass) {
        try {
            const passes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const newPass = {
                id: generateRandomId(),
                ...gatePass,
                timestamp: new Date().toLocaleString()
            };
            passes.push(newPass);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(passes));
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

    // Event Listener: Handle visitor type change with animation
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

    // Event Listener: ID number validation
    idNumber.addEventListener('input', (e) => {
        const value = e.target.value;
        if (visitorType.value === 'adult' && value.length > 0) {
            if (!/^\d{8}$/.test(value)) {
                idError.textContent = 'ID must be 8 digits';
                idError.style.display = 'block';
                e.target.setCustomValidity('ID must be 8 digits');
            } else {
                idError.style.display = 'none';
                e.target.setCustomValidity('');
            }
        }
    });

    // Event Listener: Form submission with loading animation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Generating Pass...';

        try {
            const formData = new FormData(form);
            const gatePass = Object.fromEntries(formData.entries());
            
            // Generate random ID for child visitors
            if (gatePass.visitorType === 'child') {
                gatePass.idNumber = generateRandomId();
            }

            const newPass = savePass(gatePass);
            
            // Clear form and show success message
            form.reset();
            idNumberGroup.style.display = 'none';
            showError('Pass generated successfully!');
            
            // Refresh passes list
            fetchPasses();
        } catch (error) {
            showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Generate Pass';
        }
    });

    // Function to create pass element with icons
    function createPassElement(pass) {
        return `
            <div class="pass">
                <div class="pass-header">
                    <i class="fas fa-id-badge"></i>
                    <span>${pass.fullName}</span>
                </div>
                <div class="pass-details">
                    <p><i class="fas fa-id-card"></i> Pass ID: ${pass.id}</p>
                    <p><i class="fas fa-fingerprint"></i> ID Number: ${pass.idNumber}</p>
                    <p><i class="fas fa-user-tag"></i> Type: ${pass.visitorType}</p>
                    <p><i class="fas fa-clipboard"></i> Purpose: ${pass.purpose}</p>
                    <p><i class="fas fa-clock"></i> Time: ${pass.timestamp}</p>
                </div>
            </div>
        `;
    }

    // Function to display passes
    function displayPasses(passes) {
        if (passes.length === 0) {
            passesList.innerHTML = '<p class="no-passes">No passes generated yet</p>';
            return;
        }

        const passesHTML = passes.reverse().map(createPassElement).join('');
        passesList.innerHTML = passesHTML;
    }

    // Initial load of passes
    fetchPasses();
});
