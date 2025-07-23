// 全局变量
let currentPage = 1;
let isLoading = false;
let hasMoreProducts = true;
let currentView = 'list';
let isFilterTransitioning = false; // 添加状态标志避免过度点击
let isFirstFilterOpen = true; // 标记是否是第一次打开筛选抽屉

document.addEventListener('DOMContentLoaded', function() {
    // 确保骨架屏准确显示和隐藏
    console.log('DOM完全加载，正在初始化...');
    
    try {
        // 确保显示骨架屏
        const skeletonList = document.getElementById('skeletonList');
        const skeletonGrid = document.getElementById('skeletonGrid');
        const productList = document.getElementById('productList');
        
        if (skeletonList) skeletonList.style.display = 'block';
        if (skeletonGrid) skeletonGrid.style.display = 'none';
        
        // 立即初始化视图设置
        const currentViewBtn = document.querySelector('.toggle-btn.active');
        if (currentViewBtn) {
            currentView = currentViewBtn.getAttribute('data-view') || 'list';
        }
        
        // 减少骨架屏显示时间到200ms，足够模拟一个短暂的加载状态
        setTimeout(() => {
            // 模拟内容加载完成
            if (skeletonList) skeletonList.style.display = 'none';
            if (skeletonGrid) skeletonGrid.style.display = 'none';
            if (productList) productList.style.display = currentView === 'list' ? 'block' : 'none';
            
            const gridView = document.querySelector('.product-grid-view');
            if (gridView) {
                gridView.style.display = currentView === 'grid' ? 'grid' : 'none';
            }
            
            console.log('骨架屏已隐藏，内容已显示');
            
            // 初始化图片懒加载
            initLazyLoading();
            
            // 初始化无限滚动
            initInfiniteScroll();
            
            // 初始化商品图片轮播
            initProductGallery();
            
            // 转换所有图片为懒加载
            convertImagesToLazyLoad();
        }, 200); // 减少网络延迟模拟时间
    } catch (error) {
        console.error('初始化过程中发生错误:', error);
        // 确保不论发生什么错误，骨架屏都会被隐藏，内容会被显示
        try {
            document.getElementById('skeletonList').style.display = 'none';
            document.getElementById('skeletonGrid').style.display = 'none';
            document.getElementById('productList').style.display = 'block';
        } catch (e) {
            console.error('尝试强制显示内容时出错:', e);
        }
    }
    
    // 视图切换事件处理
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    const listView = document.querySelector('.list-view');
    const gridView = document.querySelector('.product-grid-view');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            if (currentView === 'list') {
                document.getElementById('skeletonGrid').style.display = 'none';
                document.getElementById('skeletonList').style.display = 'none';
                listView.style.display = 'block';
                gridView.style.display = 'none';
            } else {
                document.getElementById('skeletonList').style.display = 'none';
                document.getElementById('skeletonGrid').style.display = 'none';
                listView.style.display = 'none';
                gridView.style.display = 'grid';
            }
            
            // 重新检查是否需要加载更多内容
            checkIfMoreProductsNeeded();
        });
    });

    // 同层级分类导航点击事件
    const categoryItems = document.querySelectorAll('.category-item');
    const categoryNav = document.querySelector('.category-nav');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            categoryItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 获取当前选中的分类名称
            const categoryName = this.getAttribute('data-category');
            
            // 更新页面标题
            document.querySelector('.header-title').textContent = categoryName;
            
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 这里可以添加切换不同分类的逻辑，例如发起API请求获取对应分类的商品
            console.log('切换到分类:', categoryName);
            
            // 更新商品数量显示
            document.querySelector('.products-count').textContent = `共${Math.floor(Math.random() * 50) + 20}件商品`;
            
            // 更新URL参数但不刷新页面
            const url = new URL(window.location);
            url.searchParams.set('category', categoryName);
            window.history.pushState({}, '', url);
        });
    });
    
    // 为商品项添加点击事件，跳转到详情页
    const productItems = document.querySelectorAll('.product-item, .grid-item');
    productItems.forEach(item => {
        item.addEventListener('click', function() {
            window.location.href = 'product-detail.html';
        });
    });

    // 初始化筛选相关功能
    initHotFilterCombinations();
    initUnlimitedOptions();
    
    // 为筛选按钮添加点击事件（仅当没有内联onclick属性时）
    const filterBtn = document.getElementById('filterBtn');
    if (filterBtn && !filterBtn.hasAttribute('onclick')) {
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            toggleFilter();
        });
    }
    
    // 为筛选抽屉背景添加点击事件（仅当没有内联onclick属性时）
    const filterDrawer = document.getElementById('filterDrawer');
    if (filterDrawer) {
        filterDrawer.addEventListener('click', function(e) {
            // 只有当点击的是抽屉背景(即当前元素本身)而不是其子元素时才关闭
            if (e.target === this) {
                toggleFilter();
                console.log('点击了筛选抽屉背景，关闭抽屉');
            }
        });
    }
    
    // 为筛选面板添加点击事件（仅当没有内联onclick属性时）
    const filterPanel = document.getElementById('filterPanel');
    if (filterPanel && !filterPanel.hasAttribute('onclick')) {
        filterPanel.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
        });
    }
    
    // 为筛选抽屉关闭按钮添加点击事件
    const closeFilterBtn = document.getElementById('closeFilterBtn');
    if (closeFilterBtn) {
        closeFilterBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            toggleFilter(); // 调用关闭抽屉的函数
        });
    }
    
    // 为重置筛选按钮添加点击事件
    const resetFilterBtn = document.getElementById('resetFilterBtn');
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            resetFilters(); // 调用重置筛选的函数
        });
    }
    
    // 为应用筛选按钮添加点击事件
    const applyFilterBtn = document.getElementById('applyFilterBtn');
    if (applyFilterBtn) {
        applyFilterBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            applyFilters(); // 调用应用筛选的函数
        });
    }
    
    // 初始选中所有"不限"选项
    document.querySelectorAll('.unlimited-option').forEach(input => {
        input.checked = true;
    });
    
    // 重置筛选打开状态，确保每次页面加载时第一次打开筛选抽屉会初始化为默认值
    isFirstFilterOpen = true;
    console.log('页面加载完成，重置筛选状态');
});

// 初始化图片懒加载
function initLazyLoading() {
    // 使用 Intersection Observer API 实现懒加载
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const lazyImage = entry.target;
                    const src = lazyImage.getAttribute('data-src');
                    
                    if (src) {
                        lazyImage.src = src;
                        lazyImage.classList.add('loaded');
                        lazyImage.removeAttribute('data-src');
                        imageObserver.unobserve(lazyImage);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px开始加载
            threshold: 0.01 // 只要有1%进入视口就开始加载
        });
        
        // 观察所有懒加载图片
        document.querySelectorAll('img.lazy-image').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 回退方案：使用滚动事件
        loadLazyImagesOnScroll();
    }
}

// 滚动事件懒加载回退方案
function loadLazyImagesOnScroll() {
    const lazyImages = document.querySelectorAll('img.lazy-image');
    const loadImages = () => {
        lazyImages.forEach(img => {
            if (isInViewport(img)) {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                }
            }
        });
    };
    
    // 首次检查
    loadImages();
    
    // 监听滚动事件
    window.addEventListener('scroll', loadImages);
}

// 判断元素是否在视口内
function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
        rect.bottom >= 0
    );
}

// 将普通图片转换为懒加载图片
function convertImagesToLazyLoad() {
    document.querySelectorAll('.product-gallery-inner img').forEach(img => {
        if (!img.classList.contains('lazy-image')) {
            const src = img.src;
            img.classList.add('lazy-image');
            
            // 只对还未显示的图片使用懒加载
            const galleryInner = img.closest('.product-gallery-inner');
            const currentIndex = parseInt(galleryInner.getAttribute('data-index') || 0);
            const imgIndex = Array.from(galleryInner.children).indexOf(img);
            
            if (imgIndex !== currentIndex) {
                img.setAttribute('data-src', src);
                img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E'; // 微小占位符
            } else {
                // 当前显示的图片保持加载状态
                img.classList.add('loaded');
            }
        }
    });
    
    // 初始化懒加载观察器
    initLazyLoading();
}

// 初始化无限滚动
function initInfiniteScroll() {
    window.addEventListener('scroll', throttle(checkIfMoreProductsNeeded, 200));
    
    // 初始检查
    checkIfMoreProductsNeeded();
}

// 检查是否需要加载更多产品
function checkIfMoreProductsNeeded() {
    if (isLoading || !hasMoreProducts) return;
    
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // 当滚动到距离底部500px时，开始加载更多
    if (scrollHeight - scrollTop - clientHeight < 500) {
        loadMoreProducts();
    }
}

// 加载更多产品
function loadMoreProducts() {
    if (isLoading || !hasMoreProducts) return;
    
    isLoading = true;
    
    // 显示加载指示器
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.style.display = 'block';
    
    // 模拟网络请求延迟
    setTimeout(() => {
        // 生成新的产品数据
        const newProducts = generateMoreProducts(6);
        
        // 添加到当前视图
        appendNewProducts(newProducts);
        
        // 隐藏加载指示器
        loadingIndicator.style.display = 'none';
        
        // 更新状态
        currentPage++;
        isLoading = false;
        
        // 模拟数据加载完毕的情况
        if (currentPage >= 5) {
            hasMoreProducts = false;
            loadingIndicator.innerHTML = '已加载全部商品';
            loadingIndicator.style.display = 'block';
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
            }, 2000);
        }
        
        // 为新添加的图片初始化懒加载
        convertImagesToLazyLoad();
        
        // 初始化新加载的产品的轮播功能
        initProductGallery();
    }, 1000); // 模拟网络延迟
}

// 添加新产品到界面
function appendNewProducts(products) {
    // 根据当前视图，添加到不同的容器
    const listContainer = document.querySelector('.product-list.list-view');
    const gridContainer = document.querySelector('.product-grid-view');
    
    products.forEach(product => {
        // 添加到列表视图
        const listItem = createProductListItem(product);
        listContainer.appendChild(listItem);
        
        // 添加到网格视图
        const gridItem = createProductGridItem(product);
        gridContainer.appendChild(gridItem);
    });
}

// 生成更多产品（模拟数据）
function generateMoreProducts(count) {
    const products = [];
    const types = ['三人沙发', '双人沙发', '贵妃椅', '懒人沙发', '折叠沙发', '单人椅'];
    const materials = ['布艺', '皮质', '实木', '复合材料', '藤编'];
    const colors = ['深灰色', '米白色', '浅蓝色', '深棕色', '薄荷绿'];
    const tags = ['新品', '热卖', '限时特价', '可定制'];
    const prices = [1299, 1599, 1899, 2499, 2899, 3499, 4299];
    
    const imageUrls = [
        'https://images.unsplash.com/photo-1540574163026-643ea20ade25',
        'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c',
        'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7',
        'https://images.unsplash.com/photo-1484101403633-562f891dc89a',
        'https://images.unsplash.com/photo-1631679706909-1844bbd07221'
    ];
    
    const reviews = [
        '质感非常好，面料柔软舒适，框架结实耐用，值得推荐！',
        '外观时尚美观，小户型的完美选择，不占空间还很实用。',
        '坐感很舒适，靠背高度刚好，适合长时间坐着工作或看电视。',
        '性价比超高，做工精细，细节处理得很到位，比实体店便宜不少。',
        '拆装非常方便，配送速度快，客服也很贴心，整体体验满分！'
    ];
    
    for (let i = 0; i < count; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const tag = tags[Math.floor(Math.random() * tags.length)];
        const price = prices[Math.floor(Math.random() * prices.length)];
        const imageUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        const review = reviews[Math.floor(Math.random() * reviews.length)];
        
        // 生成随机评分和评价数
        const rating = (4 + Math.random()).toFixed(1);
        const reviewCount = Math.floor(Math.random() * 200) + 20;
        
        products.push({
            name: `${color}${material}${type} 北欧风格`,
            params: `${type.includes('三') ? '三' : type.includes('双') ? '双' : '单'}人位 | ${material} | ${color}`,
            description: `"${review}"`,
            price: price,
            tag: tag,
            rating: rating,
            reviewCount: reviewCount,
            delivery: `预计${Math.floor(Math.random() * 5) + 2}天送达`,
            images: [
                `${imageUrl}?w=400&h=400&auto=format&fit=crop&crop=edges`,
                `${imageUrls[Math.floor(Math.random() * imageUrls.length)]}?w=400&h=400&auto=format&fit=crop&crop=edges`,
                `${imageUrls[Math.floor(Math.random() * imageUrls.length)]}?w=400&h=400&auto=format&fit=crop&crop=edges`
            ]
        });
    }
    
    return products;
}

// 创建列表视图中的产品项
function createProductListItem(product) {
    const productItem = document.createElement('div');
    productItem.className = 'product-item skeleton-product';
    
    productItem.innerHTML = `
        <div class="product-gallery">
            <div class="product-gallery-inner" data-index="0">
                <img class="lazy-image" data-src="${product.images[0]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-1">
                <img class="lazy-image" data-src="${product.images[1]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-2">
                <img class="lazy-image" data-src="${product.images[2]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-3">
            </div>
            <div class="gallery-dots">
                <div class="gallery-dot active"></div>
                <div class="gallery-dot"></div>
                <div class="gallery-dot"></div>
            </div>
            <div class="product-actions">
                <div class="action-btn favorite" onclick="toggleFavorite(this, event)">
                    <i class="far fa-heart"></i>
                </div>
                <div class="action-btn quick-view" onclick="showPreview(this, event)">
                    <i class="fas fa-eye"></i>
                </div>
            </div>
        </div>
        <div class="product-info">
            <div class="product-tags">
                <span class="product-tag tag-${product.tag.includes('新品') ? 'new' : product.tag.includes('热卖') ? 'hot' : product.tag.includes('特价') ? 'promo' : 'custom'}">${product.tag}</span>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-params">${product.params}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-meta">
                <div class="product-price">¥${product.price}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating} (${product.reviewCount}评价)</span>
                </div>
            </div>
            <div class="delivery-info">
                <i class="fas fa-truck"></i>${product.delivery}
            </div>
        </div>
    `;
    
    // 添加点击事件，跳转到详情页
    productItem.addEventListener('click', () => {
        window.location.href = 'product-detail.html';
    });
    
    return productItem;
}

// 创建网格视图中的产品项
function createProductGridItem(product) {
    const gridItem = document.createElement('div');
    gridItem.className = 'grid-item skeleton-product';
    
    gridItem.innerHTML = `
        <div class="product-gallery">
            <div class="product-gallery-inner" data-index="0">
                <img class="lazy-image" data-src="${product.images[0]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-1">
                <img class="lazy-image" data-src="${product.images[1]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-2">
                <img class="lazy-image" data-src="${product.images[2]}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E" alt="${product.name}-3">
            </div>
            <div class="gallery-dots">
                <div class="gallery-dot active"></div>
                <div class="gallery-dot"></div>
                <div class="gallery-dot"></div>
            </div>
            <div class="product-actions">
                <div class="action-btn favorite" onclick="toggleFavorite(this, event)">
                    <i class="far fa-heart"></i>
                </div>
                <div class="action-btn quick-view" onclick="showPreview(this, event)">
                    <i class="fas fa-eye"></i>
                </div>
            </div>
        </div>
        <div class="product-info">
            <div class="product-tags">
                <span class="product-tag tag-${product.tag.includes('新品') ? 'new' : product.tag.includes('热卖') ? 'hot' : product.tag.includes('特价') ? 'promo' : 'custom'}">${product.tag}</span>
            </div>
            <div class="product-name">${product.name}</div>
            <div class="product-params">${product.params}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-meta">
                <div class="product-price">¥${product.price}</div>
                <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>${product.rating}</span>
                </div>
            </div>
            <div class="delivery-info">
                <i class="fas fa-truck"></i>${product.delivery}
            </div>
        </div>
    `;
    
    // 添加点击事件，跳转到详情页
    gridItem.addEventListener('click', () => {
        window.location.href = 'product-detail.html';
    });
    
    return gridItem;
}

// 节流函数，限制函数调用频率
function throttle(func, delay) {
    let lastCall = 0;
    return function(...args) {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return func(...args);
    };
}

// 商品图片轮播功能
function initProductGallery() {
    const galleries = document.querySelectorAll('.product-gallery');
    
    galleries.forEach(gallery => {
        if (gallery.getAttribute('data-initialized')) return; // 防止重复初始化
        
        gallery.setAttribute('data-initialized', 'true');
        
        let startX, moved = false;
        const galleryInner = gallery.querySelector('.product-gallery-inner');
        const dots = gallery.querySelectorAll('.gallery-dot');
        const imgWidth = 150; // 图片宽度
        let currentIndex = 0;
        
        // 如果是新加载的产品，预加载下一张图片
        if (galleryInner) {
            const images = galleryInner.querySelectorAll('img');
            if (images.length > 1) {
                const nextImageSrc = images[1].getAttribute('data-src');
                if (nextImageSrc) {
                    const preloadImg = new Image();
                    preloadImg.src = nextImageSrc;
                }
            }
        }
        
        // 触摸事件
        gallery.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            moved = false;
        });
        
        gallery.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            
            if (Math.abs(diff) > 10) {
                moved = true;
                
                // 防止事件传播，避免整个页面滚动
                e.preventDefault();
                
                // 跟随手指移动
                const maxIndex = galleryInner.children.length - 1;
                let translateX = -(currentIndex * imgWidth) - diff;
                
                // 边界限制
                if (translateX > 0) translateX = 0;
                if (translateX < -(maxIndex * imgWidth)) translateX = -(maxIndex * imgWidth);
                
                galleryInner.style.transform = `translateX(${translateX}px)`;
            }
        });
        
        gallery.addEventListener('touchend', (e) => {
            if (!moved) return;
            
            const currentX = e.changedTouches[0].clientX;
            const diff = startX - currentX;
            
            const maxIndex = galleryInner.children.length - 1;
            
            if (diff > 50 && currentIndex < maxIndex) {
                // 向左滑，显示下一张
                currentIndex++;
                
                // 预加载下一张图片（如果有）
                if (currentIndex < maxIndex) {
                    const nextImage = galleryInner.children[currentIndex + 1];
                    if (nextImage && nextImage.getAttribute('data-src')) {
                        nextImage.src = nextImage.getAttribute('data-src');
                        nextImage.removeAttribute('data-src');
                        nextImage.classList.add('loaded');
                    }
                }
            } else if (diff < -50 && currentIndex > 0) {
                // 向右滑，显示上一张
                currentIndex--;
            }
            
            // 更新位置
            galleryInner.style.transform = `translateX(${-currentIndex * imgWidth}px)`;
            galleryInner.setAttribute('data-index', currentIndex);
            
            // 更新圆点状态
            updateDots(dots, currentIndex);
            
            startX = null;
            moved = false;
        });
        
        // 鼠标事件（PC端）
        gallery.addEventListener('mousedown', (e) => {
            e.preventDefault();
            startX = e.clientX;
            moved = false;
            
            function mouseMove(e) {
                if (!startX) return;
                
                const currentX = e.clientX;
                const diff = startX - currentX;
                
                if (Math.abs(diff) > 10) {
                    moved = true;
                    
                    // 跟随鼠标移动
                    const maxIndex = galleryInner.children.length - 1;
                    let translateX = -(currentIndex * imgWidth) - diff;
                    
                    // 边界限制
                    if (translateX > 0) translateX = 0;
                    if (translateX < -(maxIndex * imgWidth)) translateX = -(maxIndex * imgWidth);
                    
                    galleryInner.style.transform = `translateX(${translateX}px)`;
                }
            }
            
            function mouseUp(e) {
                if (!moved) return;
                
                const currentX = e.clientX;
                const diff = startX - currentX;
                
                const maxIndex = galleryInner.children.length - 1;
                
                if (diff > 50 && currentIndex < maxIndex) {
                    // 向左滑，显示下一张
                    currentIndex++;
                    
                    // 预加载下一张图片（如果有）
                    if (currentIndex < maxIndex) {
                        const nextImage = galleryInner.children[currentIndex + 1];
                        if (nextImage && nextImage.getAttribute('data-src')) {
                            nextImage.src = nextImage.getAttribute('data-src');
                            nextImage.removeAttribute('data-src');
                            nextImage.classList.add('loaded');
                        }
                    }
                } else if (diff < -50 && currentIndex > 0) {
                    // 向右滑，显示上一张
                    currentIndex--;
                }
                
                // 更新位置
                galleryInner.style.transform = `translateX(${-currentIndex * imgWidth}px)`;
                galleryInner.setAttribute('data-index', currentIndex);
                
                // 更新圆点状态
                updateDots(dots, currentIndex);
                
                startX = null;
                moved = false;
                
                // 移除事件监听
                document.removeEventListener('mousemove', mouseMove);
                document.removeEventListener('mouseup', mouseUp);
            }
            
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        });
    });
}

// 更新轮播圆点状态
function updateDots(dots, currentIndex) {
    if (!dots || !dots.length) return;
    
    dots.forEach((dot, index) => {
        if (index === currentIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// 收藏按钮点击
function toggleFavorite(el, e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    el.classList.toggle('active');
    const icon = el.querySelector('i');
    
    if (el.classList.contains('active')) {
        icon.className = 'fas fa-heart';
        // 显示收藏成功提示
        showToast('成功加入收藏');
    } else {
        icon.className = 'far fa-heart';
        showToast('已取消收藏');
    }
}

// 显示快速预览
function showPreview(el, e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const productItem = el.closest('.product-item') || el.closest('.grid-item');
    const name = productItem.querySelector('.product-name').textContent;
    const desc = productItem.querySelector('.product-description')?.textContent || productItem.querySelector('.product-params').textContent;
    const price = productItem.querySelector('.product-price').textContent;
    
    // 获取当前显示的图片
    const gallery = productItem.querySelector('.product-gallery-inner');
    let imgSrc;
    
    if (gallery) {
        const currentIndex = parseInt(gallery.getAttribute('data-index') || 0);
        const img = gallery.children[currentIndex];
        // 如果是懒加载图片，获取 data-src
        imgSrc = img.getAttribute('data-src') || img.src;
    } else {
        imgSrc = productItem.querySelector('img').src;
    }
    
    // 填充预览模态框
    document.getElementById('previewImage').src = imgSrc;
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewDesc').textContent = desc;
    document.getElementById('previewPrice').textContent = price;
    
    // 显示模态框
    const modal = document.getElementById('previewModal');
    modal.classList.add('active');
    
    // 添加360°旋转交互
    initRotateView();
}

// 关闭快速预览
function closePreview() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
}

// 跳转到详情页
function goToDetail() {
    window.location.href = 'product-detail.html';
}

// 显示提示消息
function showToast(message) {
    // 创建message-toast元素
    const toast = document.createElement('div');
    toast.className = 'message-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 自动隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 初始化360°旋转交互
function initRotateView() {
    const container = document.querySelector('.preview-image-container');
    const img = document.getElementById('previewImage');
    let startX, startRotation = 0, rotating = false;
    
    container.addEventListener('mousedown', (e) => {
        e.preventDefault();
        startX = e.clientX;
        rotating = true;
        
        document.addEventListener('mousemove', rotateMove);
        document.addEventListener('mouseup', rotateEnd);
    });
    
    container.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        rotating = true;
    });
    
    container.addEventListener('touchmove', (e) => {
        if (!rotating) return;
        
        const currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        // 根据拖动距离计算旋转角度
        const rotation = startRotation + diff / 2;
        
        img.style.transform = `rotateY(${rotation}deg)`;
    });
    
    container.addEventListener('touchend', () => {
        if (!rotating) return;
        
        // 更新起始旋转角度
        const currentRotation = img.style.transform;
        startRotation = parseInt(currentRotation.replace('rotateY(', '').replace('deg)', '')) || 0;
        
        rotating = false;
    });
    
    function rotateMove(e) {
        if (!rotating) return;
        
        const currentX = e.clientX;
        const diff = currentX - startX;
        
        // 根据拖动距离计算旋转角度
        const rotation = startRotation + diff / 2;
        
        img.style.transform = `rotateY(${rotation}deg)`;
    }
    
    function rotateEnd() {
        if (!rotating) return;
        
        // 更新起始旋转角度
        const currentRotation = img.style.transform;
        startRotation = parseInt(currentRotation.replace('rotateY(', '').replace('deg)', '')) || 0;
        
        rotating = false;
        
        document.removeEventListener('mousemove', rotateMove);
        document.removeEventListener('mouseup', rotateEnd);
    }
}

// 页面返回功能
function goBack() {
    window.history.back();
}

// 筛选功能相关
function toggleFilter() {
    const drawer = document.getElementById('filterDrawer');
    const panel = document.getElementById('filterPanel');
    const body = document.body;
    
    if (!drawer || !panel || isFilterTransitioning) return; // 防止过度点击
    
    isFilterTransitioning = true;
    console.log('toggleFilter被调用, 当前状态:', drawer.classList.contains('active') ? '打开' : '关闭');
    
    // 检查抽屉是否已经打开
    if (drawer.classList.contains('active')) {
        // 先移动面板
        panel.style.transform = 'translateX(100%)';
        
        // 允许body滚动
        body.style.overflow = '';
        
        // 然后等待过渡动画完成后隐藏抽屉
        setTimeout(() => {
            drawer.classList.remove('active');
            panel.style.transform = '';
            isFilterTransitioning = false;
            console.log('筛选抽屉已关闭');
            
            // 显示浮动筛选按钮
            const floatingFilterBtn = document.getElementById('filterBtn');
            if (floatingFilterBtn) {
                floatingFilterBtn.style.display = 'flex';
            }
        }, 300);
    } else {
        // 隐藏浮动筛选按钮
        const floatingFilterBtn = document.getElementById('filterBtn');
        if (floatingFilterBtn) {
            floatingFilterBtn.style.display = 'none';
        }
        
        // 显示抽屉
        drawer.classList.add('active');
        
        // 禁止body滚动，防止背景滚动
        body.style.overflow = 'hidden';
        
        // 如果是第一次打开筛选抽屉，初始化所有选项为"不限"
        if (isFirstFilterOpen) {
            console.log('第一次打开筛选抽屉，设置所有选项为默认值');
            // 选中所有"不限"选项
            document.querySelectorAll('.unlimited-option').forEach(input => {
                input.checked = true;
            });
            
            // 取消选中其他选项
            document.querySelectorAll('.filter-option input:not(.unlimited-option)').forEach(input => {
                input.checked = false;
            });
            
            // 移除热门筛选组合的高亮
            document.querySelectorAll('.hot-filter-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 更新已选条件展示
            updateSelectedFilters();
            
            // 标记为非首次打开
            isFirstFilterOpen = false;
        }
        
        // 允许筛选面板过渡动画完成
        setTimeout(() => {
            isFilterTransitioning = false;
            console.log('筛选抽屉已打开');
        }, 300);
    }
}

// 更新已选条件展示区
function updateSelectedFilters() {
    const selectedFiltersContent = document.getElementById('selectedFiltersContent');
    if (!selectedFiltersContent) return;
    
    console.log('开始更新已选条件展示区...');
    
    // 清空已选条件区域
    selectedFiltersContent.innerHTML = '';
    
    // 获取所有选中的过滤条件
    const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
        .filter(input => input.value !== '不限');
    const selectedPrice = document.querySelector('input[name="price"]:checked');
    const selectedMaterials = Array.from(document.querySelectorAll('input[name="material"]:checked'))
        .filter(input => input.value !== '不限');
    const selectedSize = document.querySelector('input[name="size"]:checked');
    const selectedStyles = Array.from(document.querySelectorAll('input[name="style"]:checked'))
        .filter(input => input.value !== '不限');
    
    console.log('获取到的已选条件:', {
        types: selectedTypes.map(i => i.value),
        price: selectedPrice ? selectedPrice.value : '无',
        materials: selectedMaterials.map(i => i.value),
        size: selectedSize ? selectedSize.value : '无',
        styles: selectedStyles.map(i => i.value)
    });
    
    // 构建已选条件标签
    const tags = [];
    
    // 添加类型标签
    selectedTypes.forEach(input => {
        tags.push({
            name: input.value,
            group: 'type',
            element: input
        });
    });
    
    // 添加价格标签
    if (selectedPrice && selectedPrice.value !== '不限') {
        tags.push({
            name: selectedPrice.nextElementSibling.textContent.trim(),
            group: 'price',
            element: selectedPrice
        });
    }
    
    // 添加材质标签
    selectedMaterials.forEach(input => {
        tags.push({
            name: input.value,
            group: 'material',
            element: input
        });
    });
    
    // 添加尺寸标签
    if (selectedSize && selectedSize.value !== '不限') {
        tags.push({
            name: selectedSize.nextElementSibling.textContent.trim(),
            group: 'size',
            element: selectedSize
        });
    }
    
    // 添加款式标签
    selectedStyles.forEach(input => {
        tags.push({
            name: input.value,
            group: 'style',
            element: input
        });
    });
    
    console.log('生成的筛选标签:', tags.map(t => t.name));
    
    // 渲染标签
    if (tags.length > 0) {
        tags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'selected-filter-tag';
            tagEl.innerHTML = `
                ${tag.name}
                <i class="fas fa-times" data-group="${tag.group}"></i>
            `;
            
            // 添加删除标签的点击事件
            tagEl.querySelector('i').addEventListener('click', (e) => {
                e.stopPropagation(); // 阻止事件冒泡
                tag.element.checked = false;
                
                // 如果没有选项被选中，选择"不限"选项
                const groupInputs = document.querySelectorAll(`input[name="${tag.group}"]:checked`);
                if (groupInputs.length === 0) {
                    const unlimitedOption = document.querySelector(`input[name="${tag.group}"][value="不限"]`);
                    if (unlimitedOption) {
                        unlimitedOption.checked = true;
                    }
                }
                
                // 更新显示
                updateSelectedFilters();
                
                // 如果删除了筛选条件，移除对应热门组合的高亮
                document.querySelectorAll('.hot-filter-item.active').forEach(item => {
                    item.classList.remove('active');
                });
            });
            
            selectedFiltersContent.appendChild(tagEl);
        });
    } else {
        // 如果没有选择任何条件，显示提示
        const emptyEl = document.createElement('div');
        emptyEl.className = 'selected-filters-empty';
        emptyEl.textContent = '暂无已选条件';
        selectedFiltersContent.appendChild(emptyEl);
    }
    
    console.log('已选条件展示区更新完成');
}

// 热门筛选组合功能
function initHotFilterCombinations() {
    const hotFilterItems = document.querySelectorAll('.hot-filter-item');
    if (!hotFilterItems.length) return;
    
    // 确保初始状态所有热门组合都不是高亮状态
    document.querySelectorAll('.hot-filter-item').forEach(item => {
        item.classList.remove('active');
    });
    
    hotFilterItems.forEach(item => {
        item.addEventListener('click', function() {
            const combination = this.getAttribute('data-combination');
            
            // 先移除所有热门筛选组合的高亮
            document.querySelectorAll('.hot-filter-item').forEach(i => {
                i.classList.remove('active');
            });
            
            // 高亮当前选中的热门组合
            this.classList.add('active');
            
            // 先重置所有筛选
            resetFilters();
            
            // 根据不同组合设置筛选条件
            switch (combination) {
                case 'small': // 小户型首选
                    // 设置尺寸为2米
                    setFilterValue('size', '2');
                    // 设置类型为直排沙发
                    setFilterValue('type', '直排沙发');
                    // 设置价格区间为经济型
                    setFilterValue('price', '1000-3000');
                    break;
                    
                case 'value': // 高性价比
                    // 设置材质为布艺
                    setFilterValue('material', '布艺');
                    // 设置价格区间为中等
                    setFilterValue('price', '1000-3000');
                    break;
                    
                case 'modern': // 现代简约风
                    // 设置款式为现代简约
                    setFilterValue('style', '现代简约');
                    // 设置材质为科技布
                    setFilterValue('material', '科技布');
                    break;
                    
                case 'family': // 大家庭组合
                    // 设置尺寸为3米或以上
                    setFilterValue('size', '3');
                    // 设置类型为转角沙发
                    setFilterValue('type', '转角沙发');
                    break;
            }
            
            // 手动触发所有被选中选项的change事件，确保状态正确更新
            document.querySelectorAll('input[type="checkbox"]:checked, input[type="radio"]:checked').forEach(input => {
                // 创建并触发变更事件
                const event = new Event('change', { bubbles: true });
                input.dispatchEvent(event);
            });
            
            // 强制更新已选条件显示
            updateSelectedFilters();
            console.log('已应用热门筛选组合:', combination);
        });
    });
}

// 设置筛选值的辅助函数
function setFilterValue(name, value) {
    const input = document.querySelector(`input[name="${name}"][value="${value}"]`);
    if (input) {
        input.checked = true;
        
        // 如果是自定义尺寸，显示尺寸输入区域
        if (name === 'size' && value === 'custom') {
            const customSizeInputs = document.querySelector('.custom-size-inputs');
            if (customSizeInputs) {
                customSizeInputs.classList.remove('hidden');
            }
        }
        
        // 如果选中非"不限"选项，确保取消选中对应的"不限"选项
        if (value !== '不限') {
            const unlimitedOption = document.querySelector(`input[name="${name}"][value="不限"]`);
            if (unlimitedOption) {
                unlimitedOption.checked = false;
            }
        }
    }
}

// 处理"不限"选项的互斥关系
function initUnlimitedOptions() {
    const unlimitedOptions = document.querySelectorAll('.unlimited-option');
    if (!unlimitedOptions.length) return;
    
    unlimitedOptions.forEach(option => {
        option.addEventListener('change', function() {
            const name = this.name;
            
            if (this.checked) {
                // 如果选中"不限"，取消其他同组选项
                document.querySelectorAll(`input[name="${name}"]:not(.unlimited-option)`).forEach(input => {
                    input.checked = false;
                });
            }
            
            // 每次选项变更时更新已选条件显示
            updateSelectedFilters();
        });
        
        // 为同组的其他选项添加事件监听
        document.querySelectorAll(`input[name="${option.name}"]:not(.unlimited-option)`).forEach(input => {
            input.addEventListener('change', function() {
                if (this.checked) {
                    // 如果选中其他选项，取消"不限"选项
                    const unlimitedOption = document.querySelector(`input[name="${this.name}"].unlimited-option`);
                    if (unlimitedOption) {
                        unlimitedOption.checked = false;
                    }
                } else {
                    // 如果取消勾选并且没有其他选项被选中，则自动选中"不限"
                    const checkedInputs = document.querySelectorAll(`input[name="${this.name}"]:checked`);
                    if (checkedInputs.length === 0) {
                        const unlimitedOption = document.querySelector(`input[name="${this.name}"].unlimited-option`);
                        if (unlimitedOption) {
                            unlimitedOption.checked = true;
                        }
                    }
                }
                
                // 每次选项变更时更新已选条件显示
                updateSelectedFilters();
            });
        });
    });
    
    // 为所有筛选选项添加变更监听器，确保任何选项变化都能触发已选条件更新
    document.querySelectorAll('.filter-option input').forEach(input => {
        if (!input.hasAttribute('data-event-attached')) {
            input.setAttribute('data-event-attached', 'true');
            input.addEventListener('change', function() {
                console.log('筛选选项变更:', this.name, this.value, this.checked);
                updateSelectedFilters();
            });
        }
    });
}

// 重置筛选
function resetFilters() {
    console.log('重置所有筛选条件');
    
    // 选中所有"不限"选项
    document.querySelectorAll('.unlimited-option').forEach(input => {
        input.checked = true;
    });
    
    // 取消选中其他选项
    document.querySelectorAll('.filter-option input:not(.unlimited-option)').forEach(input => {
        input.checked = false;
    });
    
    // 移除热门筛选组合的高亮
    document.querySelectorAll('.hot-filter-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 更新已选条件显示
    updateSelectedFilters();
    
    // 注意：保持非第一次打开的状态，因为用户已经交互过筛选面板
    // isFirstFilterOpen = false 保持不变
    
    console.log('筛选条件已重置');
}

// 应用筛选
function applyFilters() {
    // 收集所有选中的筛选条件
    const filters = {
        type: [],
        price: '',
        material: [],
        size: '',
        style: []
    };
    
    // 获取类型
    document.querySelectorAll('input[name="type"]:checked').forEach(input => {
        if (input.value !== '不限') {
            filters.type.push(input.value);
        }
    });
    
    // 获取价格区间
    const selectedPrice = document.querySelector('input[name="price"]:checked');
    if (selectedPrice && selectedPrice.value !== '不限') {
        filters.price = selectedPrice.value;
    }
    
    // 获取材质
    document.querySelectorAll('input[name="material"]:checked').forEach(input => {
        if (input.value !== '不限') {
            filters.material.push(input.value);
        }
    });
    
    // 获取尺寸
    const selectedSize = document.querySelector('input[name="size"]:checked');
    if (selectedSize && selectedSize.value !== '不限') {
        filters.size = selectedSize.value;
    }
    
    // 获取款式
    document.querySelectorAll('input[name="style"]:checked').forEach(input => {
        if (input.value !== '不限') {
            filters.style.push(input.value);
        }
    });
    
    // 设置为非第一次打开状态，因为用户已经交互并应用了筛选条件
    isFirstFilterOpen = false;
    
    // 关闭筛选抽屉
    toggleFilter();
    
    // 显示筛选加载覆盖层
    const filterLoadingOverlay = document.getElementById('filterLoadingOverlay');
    if (filterLoadingOverlay) {
        filterLoadingOverlay.classList.add('active');
    }
    
    // 模拟网络请求延迟 - 实际应用中这里会是一个API调用
    setTimeout(() => {
        // 获取所有产品项(这里仅为演示，实际应该基于API响应更新)
        const allProducts = document.querySelectorAll('.product-item, .grid-item');
        let visibleCount = 0;
        
        // 简单模拟筛选逻辑 - 随机显示/隐藏一些产品
        allProducts.forEach(product => {
            // 在实际应用中，这里应该检查产品属性是否符合筛选条件
            // 这里我们使用一个简单的模拟：根据筛选条件的数量决定显示概率
            let filterCount = 0;
            filterCount += filters.type.length;
            filterCount += filters.price ? 1 : 0;
            filterCount += filters.material.length;
            filterCount += filters.size ? 1 : 0;
            filterCount += filters.style.length;
            
            // 筛选条件越多，能通过筛选的概率越低
            const passFilter = Math.random() > (filterCount * 0.15);
            
            if (passFilter) {
                product.style.display = currentView === 'list' ? 'block' : '';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        // 更新商品数量显示
        const productsCountEl = document.querySelector('.products-count');
        if (productsCountEl) {
            productsCountEl.textContent = `共${visibleCount}件商品`;
        }
        
        // 隐藏加载覆盖层
        if (filterLoadingOverlay) {
            filterLoadingOverlay.classList.remove('active');
        }
        
        // 显示筛选条件标签（可以在页面顶部显示已选条件）
        showAppliedFilters(filters);
        
        // 如果没有匹配的商品，显示空状态提示
        if (visibleCount === 0) {
            showEmptyState();
        } else {
            // 确保隐藏空状态
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
        }
        
        // 显示成功应用筛选的提示
        showToast('已应用筛选条件');
        
        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 800); // 模拟加载延迟
}

// 显示应用的筛选条件标签
function showAppliedFilters(filters) {
    // 查找或创建已应用筛选条件容器
    let appliedFiltersContainer = document.querySelector('.applied-filters');
    if (!appliedFiltersContainer) {
        appliedFiltersContainer = document.createElement('div');
        appliedFiltersContainer.className = 'applied-filters';
        
        // 插入到产品列表前面
        const productsContainer = document.querySelector('.products-container');
        if (productsContainer) {
            productsContainer.parentNode.insertBefore(appliedFiltersContainer, productsContainer);
        }
    }
    
    // 清空容器
    appliedFiltersContainer.innerHTML = '';
    
    // 创建筛选条件标签
    const tags = [];
    
    // 添加类型标签
    filters.type.forEach(type => {
        tags.push(`<span class="filter-tag">${type} <i class="fas fa-times" data-type="type" data-value="${type}"></i></span>`);
    });
    
    // 添加价格标签
    if (filters.price) {
        const priceLabel = document.querySelector(`input[name="price"][value="${filters.price}"]`).nextElementSibling.textContent;
        tags.push(`<span class="filter-tag">${priceLabel} <i class="fas fa-times" data-type="price"></i></span>`);
    }
    
    // 添加材质标签
    filters.material.forEach(material => {
        tags.push(`<span class="filter-tag">${material} <i class="fas fa-times" data-type="material" data-value="${material}"></i></span>`);
    });
    
    // 添加尺寸标签
    if (filters.size) {
        const sizeLabel = document.querySelector(`input[name="size"][value="${filters.size}"]`).nextElementSibling.textContent;
        tags.push(`<span class="filter-tag">${sizeLabel} <i class="fas fa-times" data-type="size"></i></span>`);
    }
    
    // 添加款式标签
    filters.style.forEach(style => {
        tags.push(`<span class="filter-tag">${style} <i class="fas fa-times" data-type="style" data-value="${style}"></i></span>`);
    });
    
    // 如果有应用的筛选条件，显示容器
    if (tags.length > 0) {
        appliedFiltersContainer.innerHTML = `
            <div class="applied-filters-title">已筛选：</div>
            <div class="applied-filters-tags">${tags.join('')}</div>
            <div class="applied-filters-clear" id="clearAllFilters">清除全部</div>
        `;
        appliedFiltersContainer.style.display = 'flex';
        
        // 添加标签点击事件
        document.querySelectorAll('.filter-tag i').forEach(icon => {
            icon.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                const value = this.getAttribute('data-value');
                
                // 重置对应的筛选条件
                resetSpecificFilter(type, value);
                
                // 重新应用筛选
                applyFilters();
            });
        });
        
        // 添加清除全部点击事件
        document.getElementById('clearAllFilters').addEventListener('click', function() {
            resetFilters();
            applyFilters();
        });
    } else {
        appliedFiltersContainer.style.display = 'none';
    }
}

// 重置特定筛选条件
function resetSpecificFilter(type, value) {
    switch (type) {
        case 'type':
        case 'material':
        case 'style':
            // 对于多选项，取消选中特定值
            if (value) {
                const input = document.querySelector(`input[name="${type}"][value="${value}"]`);
                if (input) input.checked = false;
            } else {
                // 如果没有指定value，重置该类型的所有选项
                document.querySelectorAll(`input[name="${type}"]:not(.unlimited-option)`).forEach(input => {
                    input.checked = false;
                });
            }
            
            // 检查是否需要重新选中"不限"
            const checkedInputs = document.querySelectorAll(`input[name="${type}"]:checked`);
            if (checkedInputs.length === 0) {
                const unlimitedOption = document.querySelector(`input[name="${type}"][value="不限"]`);
                if (unlimitedOption) unlimitedOption.checked = true;
            }
            break;
            
        case 'price':
        case 'size':
            // 对于单选项，选中"不限"
            const unlimitedOption = document.querySelector(`input[name="${type}"][value="不限"]`);
            if (unlimitedOption) unlimitedOption.checked = true;
            break;
    }
}

// 显示空状态
function showEmptyState() {
    // 查找或创建空状态容器
    let emptyState = document.querySelector('.empty-state');
    if (!emptyState) {
        emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        // 插入到产品列表内
        const productsContainer = document.querySelector('.products-container') || document.querySelector('.product-list');
        if (productsContainer) {
            productsContainer.appendChild(emptyState);
        }
    }
    
    // 设置空状态内容
    emptyState.innerHTML = `
        <div class="empty-state-icon"><i class="fas fa-search"></i></div>
        <div class="empty-state-text">没有找到符合条件的商品</div>
        <div class="empty-state-subtext">请尝试其他筛选条件或清除筛选条件</div>
        <button class="empty-state-btn" onclick="resetFilters(); applyFilters();">清除所有筛选</button>
    `;
    emptyState.style.display = 'flex';
} 