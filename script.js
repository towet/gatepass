// API Configuration
const API_URL = '/.netlify/functions';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gatePassForm');
    const visitorType = document.getElementById('visitorType');
    const idNumberGroup = document.getElementById('idNumberGroup');
    const idNumber = document.getElementById('idNumber');
    const idError = document.getElementById('idError');
    const passesList = document.getElementById('passesList');
    const submitBtn = document.querySelector('.submit-btn');

    // Event Listener 1: Handle visitor type change with animation
    visitorType.addEventListener('change', (e) => {
        if (e.target.value === 'adult') {
            idNumberGroup.style.display = 'block';
            idNumberGroup.style.opacity = '0';
            setTimeout(() => {
                idNumberGroup.style.opacity = '1';
            }, 10);
            idNumber.required = true;
        } else {
            idNumberGroup.style.opacity = '0';
            setTimeout(() => {
                idNumberGroup.style.display = 'none';
            }, 300);
            idNumber.required = false;
            idNumber.value = '';
            idError.textContent = '';
        }
    });

    // Event Listener 2: Validate ID number as user types with enhanced feedback
    idNumber.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value.length !== 8) {
            idError.textContent = 'ID number must be exactly 8 digits';
            idNumber.style.borderColor = '#e53e3e';
        } else if (!/^\d+$/.test(value)) {
            idError.textContent = 'ID number must contain only digits';
            idNumber.style.borderColor = '#e53e3e';
        } else {
            idError.textContent = '';
            idNumber.style.borderColor = '#68d391';
        }
    });

    // Function to fetch passes from the server
    async function fetchPasses() {
        try {
            const response = await fetch(`${API_URL}/passes`);
            if (!response.ok) throw new Error('Failed to fetch passes');
            const passes = await response.json();
            displayPasses(passes);
        } catch (error) {
            console.error('Error fetching passes:', error);
            showError('Unable to load passes. Please try again later.');
        }
    }

    // Function to save pass to the server
    async function savePassToServer(gatePass) {
        try {
            const response = await fetch(`${API_URL}/passes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gatePass)
            });
            if (!response.ok) {
                throw new Error('Failed to save pass');
            }
            return await response.json();
        } catch (error) {
            console.error('Error saving pass:', error);
            throw error;
        }
    }

    // Function to show error message
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.insertBefore(errorDiv, form.firstChild);
        setTimeout(() => errorDiv.remove(), 5000);
    }

    // Event Listener 3: Form submission with loading animation
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (visitorType.value === 'adult' && idNumber.value.length !== 8) {
            idError.textContent = 'Invalid ID number. Unable to generate gate pass.';
            idNumber.focus();
            return;
        }

        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const gatePass = {
                visitorType: visitorType.value,
                fullName: document.getElementById('fullName').value,
                idNumber: visitorType.value === 'adult' ? idNumber.value : 'N/A',
                purpose: document.getElementById('purpose').value,
                timestamp: new Date().toLocaleString()
            };

            // Save to server
            const savedPass = await savePassToServer(gatePass);
            
            // Update display with animation
            const newPassElement = createPassElement(savedPass);
            passesList.insertBefore(newPassElement, passesList.firstChild);
            newPassElement.style.opacity = '0';
            setTimeout(() => {
                newPassElement.style.opacity = '1';
            }, 10);

            // Reset form
            form.reset();
            idNumberGroup.style.display = 'none';
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to generate gate pass. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Function to create pass element with icons
    function createPassElement(pass) {
        const div = document.createElement('div');
        div.className = 'pass-card';
        div.innerHTML = `
            <h3><i class="fas fa-ticket-alt"></i> ${pass.fullName}</h3>
            <p><strong><i class="fas fa-hashtag"></i> Pass ID:</strong> ${pass.id}</p>
            <p><strong><i class="fas fa-user-tag"></i> Type:</strong> ${pass.visitorType.charAt(0).toUpperCase() + pass.visitorType.slice(1)}</p>
            ${pass.visitorType === 'adult' ? `<p><strong><i class="fas fa-id-card"></i> ID:</strong> ${pass.idNumber}</p>` : ''}
            <p><strong><i class="fas fa-clipboard"></i> Purpose:</strong> ${pass.purpose}</p>
            <p><strong><i class="fas fa-clock"></i> Generated:</strong> ${pass.timestamp}</p>
        `;
        return div;
    }

    // Function to display passes
    function displayPasses(passes) {
        passesList.innerHTML = '';
        passes.forEach((pass, index) => {
            const passElement = createPassElement(pass);
            passElement.style.opacity = '0';
            passesList.appendChild(passElement);
            setTimeout(() => {
                passElement.style.opacity = '1';
            }, index * 100);
        });
    }

    // Initial load of passes
    fetchPasses();
});
