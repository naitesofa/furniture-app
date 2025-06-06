/**
 * 家具分类页面JavaScript
 * 包含轮播图、懒加载、模态框及交互功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化各模块
    initBannerCarousel();
    initNewArrivalsCarousel(); // 调用新的轮播初始化函数
    initProductCardScroll(); // 初始化产品卡片横向滚动功能
    initLazyLoading();
    initProductShowcase();
    updateCartBadge();
    animateCustomerServiceBtn();
});

/**
 * 初始化轮播图 - 优化版
 */
function initBannerCarousel() {
    const carouselContainer = document.getElementById('banner-carousel');
    const carouselContent = carouselContainer.querySelector('div');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    
    // 清空轮播图指示器
    indicatorsContainer.innerHTML = '';
    
    // 轮播图数据
    const carouselData = [
        {
            title: '简约生活方式',
            desc: '探索现代简约家居，打造舒适生活空间',
            imgUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200',
            btnText: '立即查看',
            btnLink: '#'
        },
        {
            title: '舒适北欧风',
            desc: '轻松打造温馨北欧风格，享受自然舒适',
            imgUrl: 'https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1200',
            btnText: '浏览系列',
            btnLink: '#'
        },
        {
            title: '环保材质家具',
            desc: '选择环保材质，健康生活从现在开始',
            imgUrl: 'https://images.pexels.com/photos/1125135/pexels-photo-1125135.jpeg?auto=compress&cs=tinysrgb&w=1200',
            btnText: '了解更多',
            btnLink: '#'
        }
    ];
    
    // 检查容器中是否已存在轮播图
    let existingSlides = carouselContent.querySelectorAll('.carousel-slide');
    
    // 第一张幻灯片已经在HTML中
    if (existingSlides.length > 0) {
        // 只需要添加剩下的轮播项
        for (let i = 1; i < carouselData.length; i++) {
            const item = carouselData[i];
            const slide = document.createElement('div');
            slide.className = 'carousel-slide';
            
            // 创建轮播内容
            slide.innerHTML = `
                <div class="absolute z-[3] p-6 max-w-[50%]">
                    <h1 class="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-md">${item.title}</h1>
                    <p class="text-white text-sm mb-4 drop-shadow-sm">${item.desc}</p>
                    ${item.btnText ? `<a href="${item.btnLink}" class="bg-primary text-white py-2 px-4 rounded-md inline-flex items-center justify-center text-sm font-medium hover:bg-opacity-90 transition-all">${item.btnText}</a>` : ''}
                </div>
                <img src="${item.imgUrl}" alt="${item.title}" class="absolute top-0 left-0 w-full h-full object-cover filter brightness-[0.8] z-[1]">
            `;
            
            carouselContent.appendChild(slide);
        }
    } else {
        // 如果没有任何幻灯片，则生成所有的轮播项
        carouselData.forEach((item, index) => {
            // 创建轮播项
            const slide = document.createElement('div');
            slide.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
            
            // 创建轮播内容
            slide.innerHTML = `
                <div class="absolute z-[3] p-6 max-w-[50%]">
                    <h1 class="text-white text-xl md:text-2xl font-bold mb-2 drop-shadow-md">${item.title}</h1>
                    <p class="text-white text-sm mb-4 drop-shadow-sm">${item.desc}</p>
                    ${item.btnText ? `<a href="${item.btnLink}" class="bg-primary text-white py-2 px-4 rounded-md inline-flex items-center justify-center text-sm font-medium hover:bg-opacity-90 transition-all">${item.btnText}</a>` : ''}
                </div>
                <img src="${item.imgUrl}" alt="${item.title}" class="absolute top-0 left-0 w-full h-full object-cover filter brightness-[0.8] z-[1]">
            `;
            
            carouselContent.appendChild(slide);
        });
    }
    
    // 更新existingSlides变量以包含所有轮播项
    existingSlides = carouselContent.querySelectorAll('.carousel-slide');
    
    // 生成指示器
    carouselData.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = `w-2 h-2 rounded-full bg-white/50 cursor-pointer transition-all ${index === 0 ? 'bg-white scale-125' : ''}`;
        indicator.setAttribute('data-slide', index);
        
        indicator.addEventListener('click', () => {
            goToSlide(index);
        });
        
        indicatorsContainer.appendChild(indicator);
    });
    
    // 自动轮播
    let currentSlide = 0;
    const totalSlides = carouselData.length;
    
    // 轮播切换函数
    function goToSlide(index) {
        const slides = carouselContent.querySelectorAll('.carousel-slide');
        const indicators = indicatorsContainer.querySelectorAll('div');
        
        // 移除当前激活状态
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('bg-white', 'scale-125');
        indicators[currentSlide].classList.add('bg-white/50');
        
        // 更新当前索引
        currentSlide = index;
        
        // 添加新的激活状态
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('bg-white', 'scale-125');
        indicators[currentSlide].classList.remove('bg-white/50');
    }
    
    // 启动自动轮播
    setInterval(() => {
        goToSlide((currentSlide + 1) % totalSlides);
    }, 5000);
}

// 新的"优品上新"轮播组件的JavaScript逻辑
function initNewArrivalsCarousel() {
    console.log('Initializing New Arrivals Carousel...'); // 调试日志
    
    const carousel = document.getElementById('new-arrivals-carousel');
    if (!carousel) {
        console.warn('New Arrivals Carousel not found, skipping initialization.');
        return;
    }

    const slidesContainer = carousel.querySelector('.carousel-slides-new');
    const slides = carousel.querySelectorAll('.carousel-slide-new');
    const prevButton = document.getElementById('prev-new-arrivals');
    const nextButton = document.getElementById('next-new-arrivals');
    const indicatorsContainer = document.getElementById('indicators-new-arrivals');

    if (!slidesContainer || slides.length === 0 || !prevButton || !nextButton || !indicatorsContainer) {
        console.warn('New Arrivals Carousel elements not found or incomplete. Initialization skipped.');
        return;
    }

    console.log(`Found ${slides.length} slides in the carousel`); // 调试日志

    let currentIndex = 0;
    const totalSlides = slides.length;
    let autoPlayInterval = null;
    const autoPlayDelay = 4000; // 4 seconds for auto-play

    // Create indicators
    indicatorsContainer.innerHTML = ''; // Clear any existing indicators
    for (let i = 0; i < totalSlides; i++) {
        const button = document.createElement('button');
        button.classList.add('w-2.5', 'h-2.5', 'rounded-full', 'transition-all', 'duration-300', 'cursor-pointer');
        if (i === 0) {
            button.classList.add('bg-white', 'scale-125');
        } else {
            button.classList.add('bg-white/50', 'hover:bg-white/70');
        }
        button.dataset.slideTo = i;
        button.setAttribute('aria-label', `Go to slide ${i + 1}`);
        button.addEventListener('click', () => {
            goToSlide(i);
            resetAutoPlay(); // Reset timer when user interacts
        });
        indicatorsContainer.appendChild(button);
    }
    const indicatorButtons = indicatorsContainer.querySelectorAll('button');

    function updateIndicators() {
        indicatorButtons.forEach((button, index) => {
            button.classList.toggle('bg-white', index === currentIndex);
            button.classList.toggle('scale-125', index === currentIndex);
            button.classList.toggle('bg-white/50', index !== currentIndex);
            button.classList.toggle('hover:bg-white/70', index !== currentIndex);
        });
    }

    function goToSlide(index) {
        // Ensure index is within bounds and wraps around
        currentIndex = (index + totalSlides) % totalSlides;
        // 直接设置 transform 属性
        slidesContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        updateIndicators();
    }

    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        if (autoPlayInterval) {
            stopAutoPlay(); // Clear existing interval before starting a new one
        }
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, autoPlayDelay);
        console.log('Auto play started'); // 调试日志
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Auto play stopped'); // 调试日志
        }
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    // Event Listeners for prev/next buttons
    prevButton.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
    });

    nextButton.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
    });

    // Pause on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);

    // Initial setup
    goToSlide(0); // Ensure first slide is correctly positioned and indicators set
    
    // 延迟一下再启动自动播放，确保页面已经加载完成
    setTimeout(() => {
        startAutoPlay();
    }, 1000);
}

/**
 * 初始化产品卡片横向滚动功能
 */
function initProductCardScroll() {
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    const cardContainer = document.querySelector('.product-card-container');
    const cardParent = cardContainer ? cardContainer.parentElement : null;
    
    if (!scrollLeftBtn || !scrollRightBtn || !cardContainer || !cardParent) {
        console.warn('Product card scroll elements not found. Initialization skipped.');
        return;
    }
    
    // 设置滚动步长 (一次滚动一个卡片的宽度)
    const cardWidth = cardParent.clientWidth / 2; // 一个卡片占据一半宽度
    
    // 滚动到左边
    scrollLeftBtn.addEventListener('click', () => {
        cardParent.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });
    
    // 滚动到右边
    scrollRightBtn.addEventListener('click', () => {
        cardParent.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });
    
    // 检查是否需要显示或隐藏滚动按钮
    function checkScrollButtons() {
        // 检查是否已经滚动到最左边
        if (cardParent.scrollLeft <= 10) {
            scrollLeftBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            scrollLeftBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // 检查是否已经滚动到最右边
        if (cardParent.scrollLeft + cardParent.clientWidth >= cardParent.scrollWidth - 10) {
            scrollRightBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            scrollRightBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
    
    // 初始检查按钮状态
    checkScrollButtons();
    
    // 滚动时检查按钮状态
    cardParent.addEventListener('scroll', checkScrollButtons);
    
    // 窗口大小改变时重新检查
    window.addEventListener('resize', checkScrollButtons);
    
    // 为产品卡片添加鼠标悬停效果
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('transform', 'scale-[1.02]', 'shadow-md');
            stopAutoScroll(); // 鼠标悬停时暂停自动滚动
        });
        
        card.addEventListener('mouseleave', () => {
            card.classList.remove('transform', 'scale-[1.02]', 'shadow-md');
            startAutoScroll(); // 鼠标移开时恢复自动滚动
        });
    });
    
    // 自动滚动功能
    let autoScrollInterval;
    const autoScrollDelay = 3000; // 3秒滚动一次
    
    function autoScroll() {
        // 如果滚动到最右边，则返回到最左边
        if (cardParent.scrollLeft + cardParent.clientWidth >= cardParent.scrollWidth - 10) {
            cardParent.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // 否则滚动一个卡片的宽度
            cardParent.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    }
    
    function startAutoScroll() {
        stopAutoScroll(); // 清除现有定时器
        autoScrollInterval = setInterval(autoScroll, autoScrollDelay);
    }
    
    function stopAutoScroll() {
        clearInterval(autoScrollInterval);
    }
    
    // 启动自动滚动
    startAutoScroll();
    
    // 页面不可见时暂停自动滚动
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoScroll();
        } else {
            startAutoScroll();
        }
    });
}

/**
 * 懒加载图片 - 优化版
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    // 为所有图片设置占位图
    lazyImages.forEach(img => {
        // 为每个图片容器添加闪光效果
        const parent = img.parentElement;
        if (parent) {
            parent.classList.add('img-shimmer');
        }
        
        // 设置初始src属性为占位图
        if (!img.src) {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
        }
    });

    // 创建IntersectionObserver监听图片是否进入视口
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        // 创建一个新的图片对象用于预加载
                        const tempImg = new Image();
                        tempImg.src = src;
                        
                        // 图片加载成功
                        tempImg.onload = () => {
                            img.src = src;
                            img.classList.add('loaded');
                            // 移除闪光效果
                            const parent = img.parentElement;
                            if (parent) {
                                parent.classList.remove('img-shimmer');
                            }
                        };
                        
                        // 图片加载失败
                        tempImg.onerror = () => {
                            console.warn('图片加载失败:', src);
                            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                            img.classList.add('loaded');
                            const parent = img.parentElement;
                            if (parent) {
                                parent.classList.remove('img-shimmer');
                            }
                        };
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // 提前50px加载
            threshold: 0.1
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // 不支持IntersectionObserver的浏览器降级处理 - 立即加载所有图片
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                // 创建一个新的图片对象用于预加载
                const tempImg = new Image();
                tempImg.src = src;
                
                // 图片加载成功
                tempImg.onload = () => {
                    img.src = src;
                    img.classList.add('loaded');
                    // 移除闪光效果
                    const parent = img.parentElement;
                    if (parent) {
                        parent.classList.remove('img-shimmer');
                    }
                };
                
                // 图片加载失败
                tempImg.onerror = () => {
                    console.warn('图片加载失败:', src);
                    img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"%3E%3Crect width="200" height="200" fill="%23f0f0f0"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="20" fill="%23999"%3E图片加载失败%3C/text%3E%3C/svg%3E';
                    img.classList.add('loaded');
                    const parent = img.parentElement;
                    if (parent) {
                        parent.classList.remove('img-shimmer');
                    }
                };
            }
        });
    }
    
    // 确保所有图片都能加载 - 3秒后强制加载未显示的图片
    setTimeout(() => {
        lazyImages.forEach(img => {
            if (!img.classList.contains('loaded')) {
                const src = img.getAttribute('data-src');
                if (src) {
                    console.log('强制加载图片:', src);
                    img.src = src;
                    img.classList.add('loaded');
                    
                    // 移除闪光效果
                    const parent = img.parentElement;
                    if (parent) {
                        parent.classList.remove('img-shimmer');
                    }
                }
            }
        });
    }, 3000);
}

/**
 * 初始化产品展示交互
 */
function initProductShowcase() {
    // 获取模态框元素
    const productModal = document.getElementById('product-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalContent = document.getElementById('modal-content');
    const modalTitle = document.getElementById('modal-title');
    const modalProducts = document.getElementById('modal-products');
    const closeModalBtn = document.getElementById('close-modal');
    
    // 高定沙发展示区
    const premiumSofaToggle = document.getElementById('toggle-premium-sofa');
    if (premiumSofaToggle) {
        premiumSofaToggle.addEventListener('click', () => {
            openProductModal('高定沙发', [
                {
                    imgUrl: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠沙发'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠真皮沙发'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠功能沙发'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠转角沙发'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/276534/pexels-photo-276534.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠布艺沙发'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/37347/office-sitting-room-executive-sitting.jpg?auto=compress&cs=tinysrgb&w=600',
                    alt: '特惠懒人沙发'
                }
            ]);
        });
    }
    
    // 小户型必选展示区
    const smallApartmentToggle = document.getElementById('toggle-small-apartment');
    if (smallApartmentToggle) {
        smallApartmentToggle.addEventListener('click', () => {
            openProductModal('小户型必选', [
                {
                    imgUrl: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款餐桌'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/2440471/pexels-photo-2440471.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款书柜'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/2343467/pexels-photo-2343467.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款大床'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/2082090/pexels-photo-2082090.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款茶几'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款办公桌'
                },
                {
                    imgUrl: 'https://images.pexels.com/photos/3773571/pexels-photo-3773571.png?auto=compress&cs=tinysrgb&w=600',
                    alt: '新款装饰柜'
                }
            ]);
        });
    }
    
    // 关闭模态框按钮
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeProductModal);
    }
    
    // 点击背景遮罩关闭模态框
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeProductModal);
    }
    
    // 打开产品展示模态框
    function openProductModal(title, products) {
        // 设置模态框标题
        modalTitle.textContent = title;
        
        // 清空之前的内容
        modalProducts.innerHTML = '';
        
        // 添加产品
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'relative overflow-hidden rounded shadow-sm h-48';
            
            productItem.innerHTML = `
                <img src="${product.imgUrl}" alt="${product.alt}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
            `;
            
            modalProducts.appendChild(productItem);
        });
        
        // 显示模态框
        productModal.classList.remove('hidden');
        
        // 添加动画
        setTimeout(() => {
            productModal.classList.add('show');
        }, 10);
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭产品展示模态框
    function closeProductModal() {
        // 移除显示类
        productModal.classList.remove('show');
        
        // 延迟隐藏元素，等待动画完成
        setTimeout(() => {
            productModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 400);
    }
}

/**
 * 更新购物车徽章
 */
function updateCartBadge() {
    const cartBadge = document.getElementById('cart-badge');
    
    // 模拟从本地存储获取购物车数量
    const cartCount = localStorage.getItem('cartCount') || 0;
    
    if (cartBadge && cartCount > 0) {
        cartBadge.textContent = cartCount;
        cartBadge.classList.add('show');
    }
}

/**
 * 显示消息提示
 */
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast-message');
    if (toast) {
        // 设置消息内容
        toast.textContent = message;
        
        // 显示Toast
        toast.classList.add('show');
        
        // 定时隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, duration);
    }
}

/**
 * 更新购物车计数
 */
function updateCartCount(increment) {
    const cartBadge = document.getElementById('cart-badge');
    
    if (cartBadge) {
        let count = parseInt(cartBadge.textContent) || 0;
        count += increment;
        
        // 更新DOM和本地存储
        cartBadge.textContent = count;
        localStorage.setItem('cartCount', count);
        
        // 显示徽章
        cartBadge.classList.add('show');
        cartBadge.classList.add('pulse');
        
        // 移除脉冲动画
        setTimeout(() => {
            cartBadge.classList.remove('pulse');
        }, 600);
        
        // 显示Toast消息
        showToast('已添加到购物车');
    }
}

/**
 * 客服按钮动画效果
 */
function animateCustomerServiceBtn() {
    const csBtn = document.getElementById('customer-service-btn');
    
    if (csBtn) {
        // 3秒后添加动画
        setTimeout(() => {
            csBtn.classList.add('animate-bounce');
            
            // 动画结束后移除类
            setTimeout(() => {
                csBtn.classList.remove('animate-bounce');
            }, 1000);
        }, 3000);
    }
}

// 添加产品到购物车（供HTML onclick事件调用）
function addToCart() {
    updateCartCount(1);
    return false; // 阻止链接跳转
} 