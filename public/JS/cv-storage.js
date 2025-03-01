// Sao lưu dữ liệu thay đổi khi reload lại
document.addEventListener('DOMContentLoaded', function() {
    // Load saved data when page loads
    loadSavedData();
    
    // Set up save functionality for all editable elements
    setupAutoSave(); 
});

function setupAutoSave() {
    // Listen for changes on all contenteditable elements
    document.addEventListener('input', function(event) {
        if (event.target.hasAttribute('contenteditable')) {
            // Save data after a short delay (to avoid saving on every keystroke)
            debounce(saveAllData, 500)();
        }
    });
    
    // Also save when elements are added or removed
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add') || 
            event.target.classList.contains('delete')) {
            // Save data after DOM changes (with slight delay)
            setTimeout(saveAllData, 100);
        }
    });
    
    // Save when avatar changes
    document.getElementById('avatar').addEventListener('change', function() {
        const avatarPreview = document.getElementById('avatar-preview');
        if (avatarPreview.src) {
            localStorage.setItem('cv-avatar', avatarPreview.src);
        }
    });
}

function saveAllData() {
    // Save all profile section data
    const sections = {};
    
    // Save all profile lists
    for (let i = 0; i <= 9; i++) {
        const listId = i === 0 ? 'profile-list' : `profile-list-${i}`;
        const list = document.getElementById(listId);
        if (list) {
            sections[listId] = saveListData(list);
        }
    }
    
    // Save name and job title
    const nameElement = document.querySelector('.profile-container-1 h1.editable');
    const jobTitleElement = document.querySelector('.profile-container-1 h2.editable');
    
    if (nameElement) sections['fullName'] = nameElement.textContent;
    if (jobTitleElement) sections['jobTitle'] = jobTitleElement.textContent;
    
    // Save section headings
    document.querySelectorAll('h3[contenteditable="true"]').forEach(heading => {
        sections[`heading-${heading.parentElement.className}`] = heading.textContent;
    });
    
    // Save all data to localStorage
    localStorage.setItem('cv-data', JSON.stringify(sections));
    console.log('CV data saved');
}

function saveListData(list) {
    const items = [];
    list.querySelectorAll('.profile-item').forEach(item => {
        const itemData = {};
        item.querySelectorAll('span.editable').forEach((span, index) => {
            itemData[`field-${index}`] = span.textContent;
        });
        items.push(itemData);
    });
    return items;
}

function loadSavedData() {
    // Check if we have saved data
    const savedData = localStorage.getItem('cv-data');
    if (!savedData) return;
    
    const data = JSON.parse(savedData);
    
    // Restore name and job title
    if (data.fullName) {
        const nameElement = document.querySelector('.profile-container-1 h1.editable');
        if (nameElement) nameElement.textContent = data.fullName;
    }
    
    if (data.jobTitle) {
        const jobTitleElement = document.querySelector('.profile-container-1 h2.editable');
        if (jobTitleElement) jobTitleElement.textContent = data.jobTitle;
    }
    
    // Restore section headings
    Object.keys(data).forEach(key => {
        if (key.startsWith('heading-')) {
            const className = key.replace('heading-', '');
            const heading = document.querySelector(`.${className} h3[contenteditable="true"]`);
            if (heading) heading.textContent = data[key];
        }
    });
    
    // Restore list data
    for (let i = 0; i <= 9; i++) {
        const listId = i === 0 ? 'profile-list' : `profile-list-${i}`;
        if (data[listId]) {
            restoreListData(listId, data[listId]);
        }
    }
    
    // Restore avatar if saved
    const savedAvatar = localStorage.getItem('cv-avatar');
    if (savedAvatar) {
        document.getElementById('avatar-preview').src = savedAvatar;
    }
    
    console.log('CV data loaded');
}

function restoreListData(listId, itemsData) {
    const list = document.getElementById(listId);
    if (!list) return;
    
    // Clear existing items (keep the first one as template)
    const template = list.querySelector('.profile-item').cloneNode(true);
    list.innerHTML = '';
    
    // Add restored items
    itemsData.forEach(itemData => {
        const newItem = template.cloneNode(true);
        const editableSpans = newItem.querySelectorAll('span.editable');
        
        Object.keys(itemData).forEach(fieldKey => {
            const index = parseInt(fieldKey.replace('field-', ''));
            if (editableSpans[index]) {
                editableSpans[index].textContent = itemData[fieldKey];
            }
        });
        
        list.appendChild(newItem);
    });
    
    // If no items were restored, add back the template
    if (list.children.length === 0) {
        list.appendChild(template);
    }
}

// Utility function to prevent saving too frequently
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}








// Thêm các hàm này vào file cv-storage.js

function exportCV() {
    const data = localStorage.getItem('cv-data');
    const avatar = localStorage.getItem('cv-avatar');
    
    const exportData = {
        data: data ? JSON.parse(data) : {},
        avatar: avatar || ''
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'my-cv-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function importCV(jsonFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            if (importData.data) {
                localStorage.setItem('cv-data', JSON.stringify(importData.data));
            }
            
            if (importData.avatar) {
                localStorage.setItem('cv-avatar', importData.avatar);
            }
            
            // Reload the page to apply imported data
            window.location.reload();
        } catch (error) {
            alert('Error importing CV data: ' + error.message);
        }
    };
    reader.readAsText(jsonFile);
}

// Thêm nút Export và Import vào UI (có thể đặt ở đâu đó trong HTML của bạn)
function addExportImportButtons() {
    const container = document.querySelector('.layout-switcher');
    if (!container) return;
    
    // Thêm nút Export
    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export CV';
    exportBtn.className = 'export-btn';
    exportBtn.addEventListener('click', exportCV);
    container.appendChild(exportBtn);
    
    // Thêm nút Import
    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import CV';
    importBtn.className = 'import-btn';
    importBtn.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                importCV(e.target.files[0]);
            }
        });
        input.click();
    });
    container.appendChild(importBtn);
}

// Gọi hàm này trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... code khác ...
    addExportImportButtons();
});