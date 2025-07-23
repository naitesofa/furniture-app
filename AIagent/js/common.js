// 设置当前激活的导航项
function setActiveTab(tabName) {
    const tabs = document.querySelectorAll('.tab-item');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabName) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面名称
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // 设置对应的导航高亮
    let activeTab = 'home';
    
    if (currentPage === 'home') {
        activeTab = 'home';
    } else if (currentPage === 'category') {
        activeTab = 'category';
    } else if (currentPage === 'cart') {
        activeTab = 'cart';
    } else if (currentPage === 'profile') {
        activeTab = 'profile';
    } else if (currentPage.includes('product')) {
        activeTab = 'category';
    } else if (currentPage === 'search') {
        activeTab = 'home';
    } else if (currentPage === 'checkout') {
        activeTab = 'cart';
    }
    
    setActiveTab(activeTab);
    
    // 为导航项添加点击事件
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            const tab = this.getAttribute('data-tab');
            if (tab === 'home') {
                window.location.href = 'home.html';
            } else if (tab === 'category') {
                window.location.href = 'category.html';
            } else if (tab === 'cart') {
                window.location.href = 'cart.html';
            } else if (tab === 'profile') {
                window.location.href = 'profile.html';
            }
        });
    });
    
    // 搜索框功能
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.search-input');
            if (searchInput && searchInput.value.trim() !== '') {
                window.location.href = `search.html?keyword=${encodeURIComponent(searchInput.value.trim())}`;
            }
        });
    }

    // 搜索图标点击事件
    const searchIcon = document.querySelector('.search-icon');
    if (searchIcon) {
        searchIcon.addEventListener('click', function() {
            const searchForm = document.querySelector('.search-form');
            if (searchForm) {
                searchForm.submit();
            }
        });
    }
    
    // 数量控制器
    const minusBtns = document.querySelectorAll('.minus-btn');
    const plusBtns = document.querySelectorAll('.plus-btn');
    
    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.quantity-input');
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                // 触发数量变化事件
                const event = new Event('change');
                input.dispatchEvent(event);
            }
        });
    });
    
    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentNode.querySelector('.quantity-input');
            let value = parseInt(input.value);
            input.value = value + 1;
            // 触发数量变化事件
            const event = new Event('change');
            input.dispatchEvent(event);
        });
    });
    
    // 购物车数量变化时更新总价
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateCartTotal);
    });
    
    // 加入收藏
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    favoriteButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    });
});

// 更新购物车总价
function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    let total = 0;
    
    cartItems.forEach(item => {
        const price = parseFloat(item.querySelector('.item-price').getAttribute('data-price'));
        const quantity = parseInt(item.querySelector('.quantity-input').value);
        total += price * quantity;
    });
    
    const totalElement = document.querySelector('.cart-total-price');
    if (totalElement) {
        totalElement.textContent = '¥' + total.toFixed(2);
    }
}

// 加入购物车
function addToCart(productId, productName, productPrice, productImage, quantity = 1) {
    // 这里仅为演示，实际应用中应该使用本地存储或后端API
    alert(`已将 ${quantity} 件 ${productName} 添加到购物车`);
}

// 返回上一页
function goBack() {
    window.history.back();
} 