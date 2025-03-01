document.getElementById("avatar").addEventListener("change", function (event) {
    const file = event.target.files[0]; // Lấy file đã chọn
    if (file) {
        const reader = new FileReader(); // Đọc file
        reader.onload = function (e) {
            document.getElementById("avatar-preview").src = e.target.result; // Hiển thị ảnh
        };
        reader.readAsDataURL(file);
    }
});

// Thực hiện thao tác các chức năng
document.addEventListener("DOMContentLoaded", function () {
    // Cấu hình danh sách và dòng lệnh thêm tương ứng
    const profileCode = {
        "profile-list": {
            template: `
                <span class="icon">💬</span>
                <span class="editable" contenteditable="true" aria-placeholder="Fill more info"></span>
            `
        },

        "profile-list-1": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Fill your Skills"></span>
            `
        },

        "profile-list-2": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Fill Time"></span>
                <span class="editable" contenteditable="true" aria-placeholder="Fill Achieve"></span>
            `
        },

        "profile-list-3": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Fill Interests"></span>
            `
        },

        "profile-list-4": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Fill Time"></span>
                <span class="editable" contenteditable="true" aria-placeholder="Fill Achieve"></span>
            `
        },

        "profile-list-5": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Fill More Info"></span>
            `
        },

        "profile-list-6": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Carreer Objective"></span>
            `
        },
        
        "profile-list-7": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Job position"></span>
                <span class="editable" contenteditable="true" aria-placeholder="Company name"></span>
                <div class="start-end">
                    <span class="editable" contenteditable="true" aria-placeholder="Start"></span>
                    <span class="editable" aria-placeholder="Start">-</span>
                    <span class="editable" contenteditable="true" aria-placeholder="End"></span>
                </div>
                <span class="editable" contenteditable="true" aria-placeholder="Descript your Experience"></span>
            `
        },
        
        "profile-list-8": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Your position"></span>
                <span class="editable" contenteditable="true" aria-placeholder="Organization name"></span>
                <div class="start-end">
                    <span class="editable" contenteditable="true" aria-placeholder="Start"></span>
                    <span class="editable" aria-placeholder="Start">-</span>
                    <span class="editable" contenteditable="true" aria-placeholder="End"></span>
                </div>
                <span class="editable" contenteditable="true" aria-placeholder="Descript your Activities"></span>
            `
        },

        "profile-list-9": {
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Major / Object"></span>
                        <span class="editable" contenteditable="true" aria-placeholder="School name"></span>
                        <div class="start-end">
                            <span class="editable" contenteditable="true" aria-placeholder="Start"></span>
                            <span class="editable" aria-placeholder="Start">-</span>
                            <span class="editable" contenteditable="true" aria-placeholder="End"></span>
                        </div>
                        <span class="editable" contenteditable="true" aria-placeholder="Descript your Learning Process or your Achieve"></span>
            `
        },
        "default": {
            emoji: "",
            template: `
                <span class="editable" contenteditable="true" aria-placeholder="Default Item"></span>
            `,
        },
    };

    function setupProfileList(listId) {
        const profileList = document.getElementById(listId);

        function addEventListenersToItem(item) {
            item.querySelector(".delete").addEventListener("click", function () {
                item.remove();
            });

            item.querySelector(".move-up").addEventListener("click", function () {
                if (item.previousElementSibling) {
                    item.parentNode.insertBefore(item, item.previousElementSibling);
                }
            });

            item.querySelector(".move-down").addEventListener("click", function () {
                if (item.nextElementSibling) {
                    item.parentNode.insertBefore(item.nextElementSibling, item);
                }
            });

            item.querySelector(".add").addEventListener("click", function () {
                addNewProfileItem();
            });

            item.setAttribute("draggable", true);
        }

        function addNewProfileItem() {
            let newItem = document.createElement("li");
            newItem.classList.add("profile-item");
            newItem.setAttribute("draggable", true);

            // Lấy cấu hình từ profileConfig
            let config = profileCode[listId];

            // Xác định nội dung dựa trên danh sách
            newItem.innerHTML = `
                ${config.template}
                <div class="actions">
                    <button class="move-up">▲</button>
                    <button class="move-down">▼</button>
                    <button class="delete">❌</button>
                    <button class="add">➕</button>
                </div>
            `;

            addEventListenersToItem(newItem);
            profileList.appendChild(newItem);
        }

        // Sử dụng event delegation cho các nút trong danh sách
        profileList.addEventListener("click", function (event) {
            const button = event.target;
            const item = button.closest(".profile-item");

            if (button.classList.contains("delete")) {
                item.remove();
            } else if (button.classList.contains("move-up") && item.previousElementSibling) {
                item.parentNode.insertBefore(item, item.previousElementSibling);
            } else if (button.classList.contains("move-down") && item.nextElementSibling) {
                item.parentNode.insertBefore(item.nextElementSibling, item);
            } else if (button.classList.contains("add")) {
                addNewProfileItem();
            }
        });

        // Kéo thả để sắp xếp trong danh sách cụ thể
        let draggedItem = null;

        profileList.addEventListener("dragstart", function (event) {
            draggedItem = event.target;
            setTimeout(() => event.target.style.opacity = "0.5", 0);
        });

        profileList.addEventListener("dragend", function (event) {
            setTimeout(() => event.target.style.opacity = "1", 0);
            draggedItem = null;
        });

        profileList.addEventListener("dragover", function (event) {
            event.preventDefault();
        });

        profileList.addEventListener("drop", function (event) {
            event.preventDefault();
            if (event.target.classList.contains("profile-item") && draggedItem) {
                profileList.insertBefore(draggedItem, event.target.nextSibling);
            }
        });

        // Đặt thuộc tính draggable cho các mục hiện có
        document.querySelectorAll(`#${listId} .profile-item`).forEach(item => {
            item.setAttribute("draggable", true);
        });
    }

    // Khởi tạo danh sách tự động từ profileConfig
    Object.keys(profileCode).forEach(setupProfileList);
});