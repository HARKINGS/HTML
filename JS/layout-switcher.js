document.addEventListener('DOMContentLoaded', function() {
    // Lấy tất cả các nút layout
    const layoutButtons = document.querySelectorAll('.layout-btn');
    
    // Hàm để áp dụng layout
    function applyLayout(layoutName) {
        // Tắt tất cả các stylesheet trước
        document.getElementById('style-minimal').disabled = true;
        document.getElementById('style-creative').disabled = true;
        document.getElementById('style-modern').disabled = true;
        document.getElementById('style-professional').disabled = true;
        
        // Bật stylesheet tương ứng với layout được chọn
        if (layoutName !== 'main') { // 'main' là layout mặc định, không cần bật stylesheet riêng
            document.getElementById(`style-${layoutName}`).disabled = false;
        }
        
        // Cập nhật trạng thái active cho các nút
        layoutButtons.forEach(button => {
            if (button.dataset.layout === layoutName) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }
    
    // Thêm sự kiện click cho các nút layout
    layoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            const layoutName = this.dataset.layout;
            applyLayout(layoutName);
        });
    });
    
    // Áp dụng layout mặc định khi trang web tải xong
    applyLayout('main');
});