
class GoogleFormsSubmission {
    constructor() {
        this.forms = {
            uiux: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSdXU3D-P92hjvtQvyFBFhF4BC0pftLCxyDVtp7fns1BpSyvAw/formResponse',
            data: 'https://docs.google.com/forms/u/0/d/e/1FAIpQLScmv1b1D6IIS72B0ZLJV3l06Jpbo4J4Mav4jUwdIvXuxPOMcA/formResponse'
        };
        
        this.formFields = {
            uiux: {
                groupName: 'entry.1022613680',
                link: 'entry.160722149'
            },
            data: {
                groupName: 'entry.1708125369',
                link: 'entry.1373684066'
            }
        };
        
        this.selectedData = {
            uiux: { groupName: '', link: '' },
            data: { groupName: '', link: '' }
        };
    }

    // Initialize Google Forms submission functionality
    initialize() {
        this.setupEventListeners();
        console.log('Google Forms submission system initialized');
    }

    // Setup event listeners for inputs
    setupEventListeners() {
        // UI/UX competition
        const groupNameInputUiux = document.getElementById('groupNameInput-uiux');
        if (groupNameInputUiux) {
            groupNameInputUiux.addEventListener('input', (e) => {
                this.selectedData.uiux.groupName = e.target.value;
                this.handleUiuxInputChange();
            });
        }
        const linkInputUiux = document.getElementById('linkInput-uiux');
        if (linkInputUiux) {
            linkInputUiux.addEventListener('input', (e) => {
                this.selectedData.uiux.link = e.target.value;
                this.handleUiuxInputChange();
            });
        }
        // Data Analytics competition
        const groupNameInputData = document.getElementById('groupNameInput-data');
        if (groupNameInputData) {
            groupNameInputData.addEventListener('input', (e) => {
                this.selectedData.data.groupName = e.target.value;
                this.handleDataInputChange();
            });
        }
        const linkInputData = document.getElementById('linkInput-data');
        if (linkInputData) {
            linkInputData.addEventListener('input', (e) => {
                this.selectedData.data.link = e.target.value;
                this.handleDataInputChange();
            });
        }
    }

    handleUiuxInputChange() {
        const { groupName, link } = this.selectedData.uiux;
        const submitBtn = document.querySelector(`#uploadModal-uiux .upload-submit-btn`);
        if (groupName && this.isValidUrl(link)) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Google Forms';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enter Group Name and Valid Link';
        }
    }

    // Handle Data Analytics input changes
    handleDataInputChange() {
        const { groupName, link } = this.selectedData.data;
        const submitBtn = document.querySelector(`#uploadModal-data .upload-submit-btn`);
        if (groupName && this.isValidUrl(link)) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Google Forms';
        } else {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enter Group Name and Valid Link';
        }
    }

    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    // Submit link to Google Forms
    async submitLink(competitionType) {
        if (competitionType === 'uiux') {
            const { groupName, link } = this.selectedData.uiux;
            if (!groupName || !link || !this.isValidUrl(link)) {
                showError('Please enter a group name and a valid link.');
                return;
            }
        } else if (competitionType === 'data') {
            const { groupName, link } = this.selectedData.data;
            if (!groupName || !link || !this.isValidUrl(link)) {
                showError('Please enter a group name and a valid link.');
                return;
            }
        }

        const submitBtn = document.querySelector(`#uploadModal-${competitionType} .upload-submit-btn`);
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            const result = await this.submitToGoogleForms(competitionType);
            if (result.success) {
                showSuccess(`Submission successful to ${competitionType.toUpperCase()} competition!`);
                setTimeout(() => {
                    closeUploadModal(competitionType);
                }, 2000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            showError(`Submission failed: ${error.message || 'Please try again.'}`);
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit to Google Forms';
        }
    }

    // Submit to Google Forms
    async submitToGoogleForms(competitionType) {
        const formUrl = this.forms[competitionType];
        const fields = this.formFields[competitionType];
        const formData = new FormData();
        if (competitionType === 'uiux') {
            const { groupName, link } = this.selectedData.uiux;
            formData.append(fields.groupName, groupName);
            formData.append(fields.link, link);
        } else if (competitionType === 'data') {
            const { groupName, link } = this.selectedData.data;
            formData.append(fields.groupName, groupName);
            formData.append(fields.link, link);
        }
        try {
            const response = await fetch(formUrl, {
                method: 'POST',
                body: formData,
                mode: 'no-cors'
            });

            return {
                success: true,
                message: 'Submitted successfully to Google Forms'
            };
        } catch (error) {
            console.error('Google Forms submission error:', error);
            throw new Error('Failed to submit to Google Forms. Please try again.');
        }
    }

    submitViaIframe(competitionType) {
        return new Promise((resolve, reject) => {
            const formUrl = this.forms[competitionType];
            const fields = this.formFields[competitionType];
            let params = new URLSearchParams();
            if (competitionType === 'uiux') {
                const { groupName, link } = this.selectedData.uiux;
                params.append(fields.groupName, groupName);
                params.append(fields.link, link);
            } else if (competitionType === 'data') {
                const { groupName, link } = this.selectedData.data;
                params.append(fields.groupName, groupName);
                params.append(fields.link, link);
            }
            // Create a hidden iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            iframe.src = `${formUrl}?${params.toString()}`;
            setTimeout(() => {
                document.body.removeChild(iframe);
                resolve({ success: true, message: 'Submitted successfully to Google Forms' });
            }, 2000);
            iframe.onerror = () => {
                document.body.removeChild(iframe);
                reject(new Error('Failed to submit to Google Forms'));
            };
        });
    }
}

let googleFormsSubmission = null;

function openUploadModal(competitionType) {
    const modal = document.getElementById(`uploadModal-${competitionType}`);
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    if (!googleFormsSubmission) {
        googleFormsSubmission = new GoogleFormsSubmission();
        googleFormsSubmission.initialize();
    }
}

function closeUploadModal(competitionType) {
    const modal = document.getElementById(`uploadModal-${competitionType}`);
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
    resetModalState(competitionType);
}

function resetModalState(competitionType) {
    if (competitionType === 'uiux') {
        const groupNameInput = document.getElementById('groupNameInput-uiux');
        const linkInput = document.getElementById('linkInput-uiux');
        const submitBtn = document.querySelector(`#uploadModal-uiux .upload-submit-btn`);
        if (groupNameInput) groupNameInput.value = '';
        if (linkInput) linkInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submit to Google Forms';
        }
        if (googleFormsSubmission) {
            googleFormsSubmission.selectedData.uiux = { groupName: '', link: '' };
        }
    } else if (competitionType === 'data') {
        const groupNameInput = document.getElementById('groupNameInput-data');
        const linkInput = document.getElementById('linkInput-data');
        const submitBtn = document.querySelector(`#uploadModal-data .upload-submit-btn`);
        if (groupNameInput) groupNameInput.value = '';
        if (linkInput) linkInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submit to Google Forms';
        }
        if (googleFormsSubmission) {
            googleFormsSubmission.selectedData.data = { groupName: '', link: '' };
        }
    }
}

function submitLink(competitionType) {
    if (googleFormsSubmission) {
        googleFormsSubmission.submitLink(competitionType);
    } else {
        showError('Submission system not initialized. Please refresh the page.');
    }
}

function showError(message) {
    const notification = document.createElement('div');
    notification.className = 'upload-notification error';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">❌</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    showNotification(notification);
}

function showSuccess(message) {
    const notification = document.createElement('div');
    notification.className = 'upload-notification success';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✅</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    showNotification(notification);
}

function showNotification(notification) {
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${notification.classList.contains('error') ? '#ff6b6b' : '#51cf66'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
        font-family: 'Glyphic', sans-serif;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-icon {
        font-size: 18px;
    }
    
    .notification-text {
        font-weight: 500;
    }
`;
document.head.appendChild(style);

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('upload-modal')) {
        const competitionType = e.target.id.replace('uploadModal-', '');
        closeUploadModal(competitionType);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.upload-modal[style*="display: block"]');
        openModals.forEach(modal => {
            const competitionType = modal.id.replace('uploadModal-', '');
            closeUploadModal(competitionType);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('Google Forms submission functionality initialized');
    console.log('Please update the form URLs and field IDs in the constructor');
    console.log('Create Google Forms for UI/UX and Data Analytics competitions');
}); 