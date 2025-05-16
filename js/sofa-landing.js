/**
 * 沙发广告落地页交互脚本
 * 实现视觉呈现优化、动态交互设计、内容展示策略和性能优化
 */

// 设备性能相关参数
const PERFORMANCE = {
    // 根据设备性能动态调整的参数
    scrollThrottle: 100, // 默认节流时间（毫秒）
    touchThrottle: 50,   // 默认触摸事件节流时间（毫秒）
    loadThreshold: 200,  // 加载阈值，默认为屏幕高度的200%
    isHighPerformance: false, // 是否为高性能设备
};

// 页面元素
const DOM = {
    container: document.getElementById('landing-container'),
    heroCarousel: document.getElementById('hero-carousel'),
    carouselItems: document.querySelectorAll('.carousel-item'),
    indicators: document.querySelectorAll('.indicator'),
    ctaButton: document.getElementById('cta-button'),
    actionButton: document.getElementById('action-button'),
    productsSection: document.getElementById('products-section'),
    productsGrid: document.getElementById('products-grid'),
    filterButtons: document.querySelectorAll('.filter-button'),
    loadingIndicator: document.getElementById('loading-indicator'),
    countdown: document.getElementById('countdown'),
    materialsShowcase: document.getElementById('materials-showcase'),
};

// 示例产品数据 - 实际应用中应从API获取
const PRODUCTS = [
    { id: 1, title: '北欧风格三人沙发', price: 3999, image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'nordic' },
    { id: 2, title: '简约现代布艺沙发', price: 2799, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'minimalist' },
    { id: 3, title: '意式轻奢真皮沙发', price: 5999, image: 'https://images.unsplash.com/photo-1550254478-ead40cc54513?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'modern' },
    { id: 4, title: '小户型多功能沙发', price: 2299, image: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'minimalist' },
    { id: 5, title: '环保可拆洗沙发', price: 3499, image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'nordic' },
    { id: 6, title: '高端进口头层牛皮沙发', price: 8999, image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'modern' },
    { id: 7, title: '轻奢布艺转角沙发', price: 4999, image: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'modern' },
    { id: 8, title: '日式简约实木沙发', price: 5699, image: 'https://images.unsplash.com/photo-1571898223382-0aa3499f0f2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', category: 'minimalist' },
];

// 当前状态
const STATE = {
    isExpanded: false,
    currentCarouselIndex: 0,
    carouselInterval: null,
    productsLoaded: 0,
    currentFilter: 'all',
    isLoading: false,
    lastScrollPosition: 0,
    touchStartY: 0,
    deviceOrientation: { beta: 0, gamma: 0 },
};

/**
 * 初始化页面
 */
function init() {
    // 检测设备性能并优化参数
    detectDevicePerformance();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化3D轮播
    initCarousel();
    
    // 初始加载产品
    loadInitialProducts();
    
    // 启动倒计时
    startCountdown();
    
    // 如果设备支持，初始化设备方向监听
    if (window.DeviceOrientationEvent) {
        initDeviceOrientation();
    }
    
    // 启用渐进式图片加载
    initProgressiveImageLoading();
}

/**
 * 检测设备性能并优化参数
 */
function detectDevicePerformance() {
    // 检查设备硬件并动态调整性能参数
    const deviceMemory = navigator.deviceMemory || 4; // 默认4GB
    const hardwareConcurrency = navigator.hardwareConcurrency || 4; // 默认4核
    
    // 根据设备性能调整参数
    PERFORMANCE.isHighPerformance = deviceMemory >= 4 && hardwareConcurrency >= 4;
    
    if (PERFORMANCE.isHighPerformance) {
        // 高性能设备可以使用更低的节流时间
        PERFORMANCE.scrollThrottle = 50;
        PERFORMANCE.touchThrottle = 25;
    } else {
        // 低性能设备增加节流时间以减轻负担
        PERFORMANCE.scrollThrottle = 150;
        PERFORMANCE.touchThrottle = 80;
        
        // 禁用一些高级视觉效果
        document.body.classList.add('reduced-motion');
    }
    
    // 根据屏幕高度设置加载阈值
    PERFORMANCE.loadThreshold = window.innerHeight * 2;
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 触摸滑动展开/收起
    DOM.container.addEventListener('touchstart', handleTouchStart, { passive: true });
    DOM.container.addEventListener('touchmove', throttle(handleTouchMove, PERFORMANCE.touchThrottle), { passive: true });
    DOM.container.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    // 按钮点击动画
    DOM.ctaButton.addEventListener('click', (e) => {
        animateButtonClick(e.currentTarget);
        expandContainer();
    });
    
    DOM.actionButton.addEventListener('click', (e) => {
        animateButtonClick(e.currentTarget);
        // 这里可以添加购买行为，如跳转到详情页或弹出购买窗口
    });
    
    // 轮播指示器点击
    DOM.indicators.forEach(indicator => {
        indicator.addEventListener('click', () => {
            const index = parseInt(indicator.getAttribute('data-index'));
            goToSlide(index);
        });
    });
    
    // 滚动监听 - 用于懒加载产品
    window.addEventListener('scroll', throttle(handleScroll, PERFORMANCE.scrollThrottle), { passive: true });
    
    // 过滤按钮点击
    DOM.filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.currentTarget.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    
    // 窗口尺寸变化 - 重新计算加载阈值
    window.addEventListener('resize', debounce(() => {
        PERFORMANCE.loadThreshold = window.innerHeight * 2;
    }, 300), { passive: true });
}

/**
 * 处理触摸开始事件
 */
function handleTouchStart(e) {
    if (e.touches.length === 1) {
        STATE.touchStartY = e.touches[0].clientY;
    }
}

/**
 * 处理触摸移动事件
 */
function handleTouchMove(e) {
    if (!e.touches.length) return;
    
    const currentY = e.touches[0].clientY;
    const diffY = STATE.touchStartY - currentY;
    
    // 向上滑动超过50px并且容器尚未展开，则展开容器
    if (diffY > 50 && !STATE.isExpanded) {
        expandContainer();
    }
    
    // 向下滑动超过50px并且容器已经展开，且滚动位置在顶部，则收起容器
    if (diffY < -50 && STATE.isExpanded && window.scrollY < 10) {
        collapseContainer();
    }
}

/**
 * 处理触摸结束事件
 */
function handleTouchEnd() {
    STATE.touchStartY = 0;
}

/**
 * 展开容器
 */
function expandContainer() {
    if (STATE.isExpanded) return;
    
    DOM.container.classList.add('expanded');
    STATE.isExpanded = true;
    
    // 隐藏上滑提示
    document.querySelector('.swipe-up-hint').style.opacity = '0';
    
    // 加载更多产品
    loadMoreProducts();
}

/**
 * 收起容器
 */
function collapseContainer() {
    if (!STATE.isExpanded) return;
    
    DOM.container.classList.remove('expanded');
    STATE.isExpanded = false;
    
    // 显示上滑提示
    document.querySelector('.swipe-up-hint').style.opacity = '1';
}

/**
 * 加载初始产品
 */
function loadInitialProducts() {
    // 只加载前4个产品
    const initialProducts = PRODUCTS.slice(0, 4);
    renderProducts(initialProducts);
    STATE.productsLoaded = initialProducts.length;
}

/**
 * 加载更多产品
 */
function loadMoreProducts() {
    if (STATE.isLoading || STATE.productsLoaded >= PRODUCTS.length) return;
    
    // 显示加载指示器
    DOM.loadingIndicator.classList.add('visible');
    STATE.isLoading = true;
    
    // 模拟网络延迟 - 实际应用中应使用实际API请求
    setTimeout(() => {
        const moreProducts = PRODUCTS.slice(
            STATE.productsLoaded, 
            STATE.productsLoaded + 4
        );
        
        if (moreProducts.length) {
            renderProducts(moreProducts);
            STATE.productsLoaded += moreProducts.length;
        }
        
        // 隐藏加载指示器
        DOM.loadingIndicator.classList.remove('visible');
        STATE.isLoading = false;
        
        // 如果仍有滚动空间，检查是否需要加载更多
        if (shouldLoadMore()) {
            loadMoreProducts();
        }
    }, 800); // 模拟网络延迟
}

/**
 * 判断是否应该加载更多产品
 */
function shouldLoadMore() {
    if (STATE.productsLoaded >= PRODUCTS.length) return false;
    
    const scrollPosition = window.scrollY + window.innerHeight;
    const productsSectionBottom = DOM.productsSection.offsetTop + DOM.productsSection.offsetHeight;
    
    return scrollPosition > productsSectionBottom - PERFORMANCE.loadThreshold;
}

/**
 * 渲染产品到网格中
 */
function renderProducts(products) {
    // 过滤产品
    const filteredProducts = STATE.currentFilter === 'all' 
        ? products 
        : products.filter(p => p.category === STATE.currentFilter);
    
    // 创建产品卡片元素
    const productElements = filteredProducts.map(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        
        // 生成低质量占位图URL
        const placeholderSrc = product.image.replace('w=1000&q=80', 'w=500&q=10');
        
        card.innerHTML = `
            <div class="carousel-image-container">
                <img class="product-image placeholder" src="${placeholderSrc}" alt="${product.title}">
                <img class="product-image high-res" data-src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">¥${product.price}</div>
                <div class="ar-preview">
                    <span class="ar-icon"></span>
                    <span>AR预览</span>
                </div>
            </div>
        `;
        
        return card;
    });
    
    // 追加到网格
    productElements.forEach(el => DOM.productsGrid.appendChild(el));
    
    // 延迟显示价格，营造动态渐变效果
    setTimeout(() => {
        const newPrices = DOM.productsGrid.querySelectorAll('.product-price:not(.visible)');
        newPrices.forEach((price, i) => {
            setTimeout(() => {
                price.classList.add('visible');
            }, i * 100);
        });
    }, 300);
    
    // 初始化这些产品的渐进式图片加载
    initProgressiveImageLoading();
}

/**
 * 过滤产品
 */
function filterProducts(filter) {
    // 更新激活的过滤按钮
    DOM.filterButtons.forEach(btn => {
        if (btn.getAttribute('data-filter') === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 设置当前过滤器
    STATE.currentFilter = filter;
    
    // 清空产品网格
    DOM.productsGrid.innerHTML = '';
    STATE.productsLoaded = 0;
    
    // 重新加载初始产品
    loadInitialProducts();
    
    // 如果容器已展开，加载更多产品
    if (STATE.isExpanded) {
        loadMoreProducts();
    }
}

/**
 * 处理滚动事件
 */
function handleScroll() {
    const scrollDirection = window.scrollY > STATE.lastScrollPosition ? 'down' : 'up';
    STATE.lastScrollPosition = window.scrollY;
    
    // 如果向下滚动并且应该加载更多，则加载更多产品
    if (scrollDirection === 'down' && shouldLoadMore() && !STATE.isLoading) {
        loadMoreProducts();
    }
    
    // 检查产品卡片是否在视口中，如果是则加载高清图
    checkVisibleImages();
}

/**
 * 检查可见的图片并加载
 */
function checkVisibleImages() {
    const images = document.querySelectorAll('.high-res:not(.loaded)');
    
    images.forEach(img => {
        if (isElementInViewport(img.parentNode)) {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.onload = () => {
                    img.classList.add('loaded');
                    if (img.previousElementSibling && img.previousElementSibling.classList.contains('placeholder')) {
                        img.previousElementSibling.style.opacity = '0';
                    }
                };
            }
        }
    });
}

/**
 * 初始化渐进式图片加载
 */
function initProgressiveImageLoading() {
    // 延迟加载非关键图片
    const lazyImages = document.querySelectorAll('.high-res:not(.loaded)');
    
    if ('IntersectionObserver' in window) {
        // 使用Intersection Observer API实现懒加载
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.onload = () => {
                            img.classList.add('loaded');
                            if (img.previousElementSibling && img.previousElementSibling.classList.contains('placeholder')) {
                                img.previousElementSibling.style.opacity = '0';
                            }
                        };
                    }
                    
                    // 图片已处理，移除观察
                    observer.unobserve(img);
                }
            });
        }, { rootMargin: '100px' });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 降级处理 - 立即检查可见图片
        checkVisibleImages();
    }
}

/**
 * 初始化轮播图
 */
function initCarousel() {
    // 启动自动轮播
    STATE.carouselInterval = setInterval(() => {
        const nextIndex = (STATE.currentCarouselIndex + 1) % DOM.carouselItems.length;
        goToSlide(nextIndex);
    }, 4000);
    
    // 初始加载第一张高清图
    const firstImage = DOM.carouselItems[0].querySelector('.high-res');
    if (firstImage) {
        firstImage.src = firstImage.getAttribute('data-src');
        firstImage.onload = () => {
            firstImage.classList.add('loaded');
        };
    }
}

/**
 * 切换到指定的轮播图
 */
function goToSlide(index) {
    // 清除当前激活状态
    DOM.carouselItems.forEach(item => item.classList.remove('active'));
    DOM.indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // 设置新的激活状态
    DOM.carouselItems[index].classList.add('active');
    DOM.indicators[index].classList.add('active');
    
    // 更新当前索引
    STATE.currentCarouselIndex = index;
    
    // 加载当前幻灯片的高清图像
    const currentImage = DOM.carouselItems[index].querySelector('.high-res');
    if (currentImage && !currentImage.classList.contains('loaded')) {
        const src = currentImage.getAttribute('data-src');
        if (src) {
            currentImage.src = src;
            currentImage.onload = () => {
                currentImage.classList.add('loaded');
            };
        }
    }
    
    // 预加载下一张幻灯片图像
    const nextIndex = (index + 1) % DOM.carouselItems.length;
    const nextImage = DOM.carouselItems[nextIndex].querySelector('.high-res');
    if (nextImage && !nextImage.classList.contains('loaded')) {
        const nextSrc = nextImage.getAttribute('data-src');
        if (nextSrc) {
            const preloadImg = new Image();
            preloadImg.src = nextSrc;
            preloadImg.onload = () => {
                nextImage.src = nextSrc;
                nextImage.classList.add('loaded');
            };
        }
    }
}

/**
 * 按钮点击动画
 */
function animateButtonClick(button) {
    button.classList.add('clicked');
    
    setTimeout(() => {
        button.classList.remove('clicked');
    }, 300);
}

/**
 * 初始化设备方向监听 - 用于材质微交互
 */
function initDeviceOrientation() {
    window.addEventListener('deviceorientation', throttle((e) => {
        if (e.beta === null || e.gamma === null) return;
        
        // 保存设备方向数据
        STATE.deviceOrientation = {
            beta: e.beta, // 前后倾斜
            gamma: e.gamma // 左右倾斜
        };
        
        // 应用微交互动画效果
        applyOrientationEffect();
    }, PERFORMANCE.touchThrottle), { passive: true });
}

/**
 * 应用设备方向效果
 */
function applyOrientationEffect() {
    // 限制倾斜角度范围
    const tiltX = Math.max(-15, Math.min(15, STATE.deviceOrientation.gamma / 2));
    const tiltY = Math.max(-15, Math.min(15, STATE.deviceOrientation.beta / 2));
    
    // 应用到材质图片
    const materialImages = DOM.materialsShowcase.querySelectorAll('.material-image img');
    materialImages.forEach(img => {
        img.style.transform = `translate(${tiltX / 2}px, ${tiltY / 2}px) scale(1.05)`;
    });
    
    // 应用到轮播图
    if (DOM.carouselItems[STATE.currentCarouselIndex]) {
        const activeImage = DOM.carouselItems[STATE.currentCarouselIndex].querySelector('.carousel-image');
        if (activeImage) {
            activeImage.style.transform = `scale(1.05) translate(${tiltX / 3}px, ${tiltY / 3}px)`;
        }
    }
}

/**
 * 启动倒计时
 */
function startCountdown() {
    // 设置倒计时时间（2小时）
    let totalSeconds = 2 * 60 * 60;
    
    // 更新倒计时
    function updateCountdown() {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        // 格式化显示
        DOM.countdown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
        // 减少时间
        totalSeconds--;
        
        // 如果倒计时结束，可以触发一些操作（如隐藏优惠区域）
        if (totalSeconds < 0) {
            clearInterval(countdownInterval);
            DOM.countdown.parentElement.innerHTML = '<p class="countdown-ended">优惠已结束</p>';
        }
    }
    
    // 立即更新一次
    updateCountdown();
    
    // 设置定时器每秒更新
    const countdownInterval = setInterval(updateCountdown, 1000);
}

/**
 * 判断元素是否在视口中
 */
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

/**
 * 节流函数 - 限制函数调用频率
 */
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    
    return function() {
        const context = this;
        const args = arguments;
        
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

/**
 * 防抖函数 - 延迟执行函数
 */
function debounce(func, wait) {
    let timeout;
    
    return function() {
        const context = this;
        const args = arguments;
        
        clearTimeout(timeout);
        
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 当DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', init); 