/**
 * 商品详情页 JavaScript
 * 优化交互逻辑，特别是购物车功能
 */

// 页面加载完成后执行初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeProductPage();
});

// 全局变量
let cartCount = 0;
let isAnimating = false;
let currentImageIndex = 1;
let touchStartX = 0;
let touchEndX = 0;
let totalImages = 8; // 360度图片总数
const viewMode = {
    current: 'normal',
    previous: 'normal'
};

/**
 * 初始化商品详情页
 */
function initializeProductPage() {
    // 初始化事件监听
    initEventListeners();
    
    // 初始化轮播图
    initGallery();
    
    // 初始化弹幕
    initDanmu();
    
    // 初始化页面滚动监听
    initScrollListeners();
    
    // 初始化购物车数量
    updateCartCount(0);
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
    // 用事件委托替代直接绑定
    document.addEventListener('click', function(e) {
        // 使用closest方法找到最近的匹配元素
        const addCartBtn = e.target.closest('.add-cart');
        const buyNowBtn = e.target.closest('.buy-now');
        const galleryControl = e.target.closest('.gallery-control');
        const specSelectBtn = e.target.closest('.spec-select-btn');
        const specCompareBtn = e.target.closest('.spec-compare-btn');
        const backToTopBtn = e.target.closest('.back-to-top');
        const tabNavItem = e.target.closest('.tab-nav-item');
        
        // 根据找到的元素执行相应操作
        if (addCartBtn) {
            addToCart(e);
        } else if (buyNowBtn) {
            buyNow();
        } else if (galleryControl) {
            const mode = galleryControl.getAttribute('data-mode');
            if (mode) toggleViewMode(mode);
        } else if (specSelectBtn) {
            openSpecSelectModal('select');
        } else if (specCompareBtn) {
            toggleSpecCompare();
        } else if (backToTopBtn) {
            scrollToTop();
        } else if (tabNavItem) {
            const section = tabNavItem.getAttribute('data-section');
            if (section) scrollToTabSection(section);
        }
    });
    
    // 商品图片轮播触摸/拖动事件
    const gallery = document.getElementById('gallery');
    if (gallery) {
        gallery.addEventListener('touchstart', handleTouchStart, {passive: true});
        gallery.addEventListener('touchmove', handleTouchMove, {passive: true});
        gallery.addEventListener('touchend', handleTouchEnd, {passive: true});
        
        // 鼠标拖动
        gallery.addEventListener('mousedown', handleMouseDown);
        
        // 添加轮播自动播放定时器
        setInterval(autoSlideGallery, 5000);
    }
    
    // 窗口滚动事件
    window.addEventListener('scroll', handleScroll, {passive: true});
    
    // 监听网页可见性变化，页面不可见时暂停动画
    document.addEventListener('visibilitychange', handleVisibilityChange);
}

/**
 * 初始化商品图片轮播
 */
function initGallery() {
    // 设置图片预加载
    preloadImages();
    
    // 显示旋转提示
    setTimeout(() => {
        const hint = document.querySelector('.rotate-hint');
        if (hint) hint.style.display = 'flex';
        
        // 3秒后隐藏提示
        setTimeout(() => {
            if (hint) hint.style.display = 'none';
        }, 3000);
    }, 1000);
}

/**
 * 预加载图片
 */
function preloadImages() {
    const images = document.querySelectorAll('.product-image');
    
    // 设置图片懒加载
    if ('loading' in HTMLImageElement.prototype) {
        // 支持原生懒加载
        images.forEach(img => {
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
        });
    } else {
        // 回退方案：使用Intersection Observer实现懒加载
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * 初始化弹幕
 */
function initDanmu() {
    const danmuContainer = document.getElementById('danmuContainer');
    if (!danmuContainer) return;
    
    // 模拟评论数据
    const comments = [
        { content: '质量真的很不错！', sentiment: 'positive' },
        { content: '和图片一样漂亮', sentiment: 'positive' },
        { content: '送货速度快，服务好', sentiment: 'positive' },
        { content: '坐着很舒服，推荐购买', sentiment: 'positive' },
        { content: '性价比高，正好赶上活动', sentiment: 'positive' },
        { content: '包装很好，没有损坏', sentiment: 'positive' },
        { content: '还在考虑要不要买', sentiment: 'neutral' },
        { content: '这个颜色好看吗？', sentiment: 'neutral' },
        { content: '有点贵，但是值得', sentiment: 'neutral' },
        { content: '尺寸刚好适合我家', sentiment: 'positive' }
    ];
    
    // 随机显示弹幕
    let index = 0;
    const showDanmu = () => {
        if (index >= comments.length) index = 0;
        
        const comment = comments[index++];
        createDanmu(comment.content, comment.sentiment);
        
        // 随机时间后显示下一条
        setTimeout(showDanmu, 2000 + Math.random() * 3000);
    };
    
    // 开始显示弹幕
    setTimeout(showDanmu, 2000);
}

/**
 * 创建弹幕
 */
function createDanmu(text, sentiment) {
    const danmuContainer = document.getElementById('danmuContainer');
    if (!danmuContainer) return;
    
    // 创建弹幕元素
    const danmu = document.createElement('div');
    danmu.className = `danmu ${sentiment || ''}`;
    danmu.textContent = text;
    
    // 随机位置
    const top = 10 + Math.random() * 70 + '%';
    danmu.style.top = top;
    
    // 随机动画时长
    const duration = 8 + Math.random() * 7;
    danmu.style.animation = `danmuMove ${duration}s linear`;
    
    // 添加到容器
    danmuContainer.appendChild(danmu);
    
    // 播放结束后移除
    danmu.addEventListener('animationend', () => {
        danmuContainer.removeChild(danmu);
    });
    
    // 点击暂停/继续动画
    danmu.addEventListener('click', () => {
        danmu.classList.toggle('fixed');
    });
}

/**
 * 初始化页面滚动监听
 */
function initScrollListeners() {
    // 创建IntersectionObserver监听元素可见性
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 当元素可见时更新标签导航
            if (entry.isIntersecting) {
                updateTabNavigation(entry.target.id);
            }
        });
    }, { threshold: 0.3 }); // 当30%可见时触发
    
    // 监听所有带section-anchor类的元素
    document.querySelectorAll('.section-anchor').forEach(section => {
        observer.observe(section);
    });
    
    // 还要监听主要内容区域
    const contentSections = document.querySelectorAll('.content-section');
    contentSections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * 处理页面滚动
 */
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 显示/隐藏回到顶部按钮
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (scrollTop > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    
    // 显示/隐藏标签导航
    const tabNavigation = document.getElementById('tabNavigation');
    if (tabNavigation) {
        if (scrollTop > 250) {
            tabNavigation.classList.add('visible');
        } else {
            tabNavigation.classList.remove('visible');
        }
    }
    
    // 显示/隐藏悬浮信息
    const floatingInfo = document.querySelector('.floating-info');
    if (floatingInfo) {
        if (scrollTop > 400) {
            floatingInfo.classList.add('visible');
        } else {
            floatingInfo.classList.remove('visible');
        }
    }
}

/**
 * 更新标签导航活动状态
 */
function updateTabNavigation(currentSectionId) {
    const tabItems = document.querySelectorAll('.tab-nav-item');
    if (!tabItems.length) return;
    
    // 根据当前滚动位置确定激活的标签
    let activeTab = 'top';
    
    if (currentSectionId === 'reviews' || currentSectionId.includes('review')) {
        activeTab = 'reviews';
    } else if (currentSectionId === 'detail' || currentSectionId === 'specs' || currentSectionId === 'guide') {
        activeTab = 'detail';
    }
    
    // 更新标签状态
    tabItems.forEach(item => {
        const itemSection = item.getAttribute('data-section') || item.getAttribute('onclick').match(/'([^']+)'/)[1];
        
        if (itemSection === activeTab) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * 滚动到指定的标签区域
 */
function scrollToTabSection(section) {
    let targetElement;
    
    switch(section) {
        case 'top':
            targetElement = document.getElementById('gallery');
            break;
        case 'reviews':
            targetElement = document.getElementById('reviews');
            break;
        case 'detail':
            targetElement = document.getElementById('detail');
            break;
        default:
            targetElement = document.getElementById(section);
    }
    
    if (targetElement) {
        // 平滑滚动到目标位置
        const offset = 60; // 考虑固定导航的高度
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // 更新标签导航
        document.querySelectorAll('.tab-nav-item').forEach(item => {
            if (item.getAttribute('data-section') === section || 
                item.getAttribute('onclick').includes(section)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }
}

/**
 * 添加到购物车
 * 优化购物车交互体验
 */
function addToCart(event) {
    if (isAnimating) return;
    isAnimating = true;
    
    // 获取添加到购物车按钮的位置
    const button = event.currentTarget;
    const buttonRect = button.getBoundingClientRect();
    const buttonX = buttonRect.left + buttonRect.width / 2;
    const buttonY = buttonRect.top + buttonRect.height / 2;
    
    // 获取购物车图标的位置
    const cartIcon = document.querySelector('.cart-button');
    if (!cartIcon) {
        isAnimating = false;
        return;
    }
    
    const cartRect = cartIcon.getBoundingClientRect();
    const cartX = cartRect.left + cartRect.width / 2;
    const cartY = cartRect.top + cartRect.height / 2;
    
    // 创建动画元素
    const animElement = document.createElement('div');
    animElement.className = 'cart-animation';
    
    // 使用当前展示的商品图片
    const activeImage = document.querySelector('.product-image.active');
    if (activeImage) {
        animElement.style.backgroundImage = `url(${activeImage.src})`;
    } else {
        animElement.style.backgroundImage = 'url(../images/sofa_360_1.jpg)';
    }
    
    // 设置初始位置
    animElement.style.left = `${buttonX - 20}px`;
    animElement.style.top = `${buttonY - 20}px`;
    document.body.appendChild(animElement);
    
    // 使用Web Animation API执行动画
    const keyframes = [
        { 
            top: `${buttonY - 20}px`, 
            left: `${buttonX - 20}px`,
            transform: 'scale(1)',
            offset: 0
        },
        { 
            top: `${buttonY - 50}px`, 
            left: `${buttonX + (cartX - buttonX) * 0.3}px`,
            transform: 'scale(1.2)',
            offset: 0.3
        },
        { 
            top: `${cartY - 20}px`, 
            left: `${cartX - 20}px`,
            transform: 'scale(0.5)',
            offset: 1
        }
    ];
    
    const timing = {
        duration: 800,
        easing: 'cubic-bezier(0.5, 0, 0.5, 1)'
    };
    
    const animation = animElement.animate(keyframes, timing);
    
    animation.onfinish = () => {
        // 动画结束后移除元素
        document.body.removeChild(animElement);
        
        // 更新购物车数量
        updateCartCount(++cartCount);
        
        // 显示添加成功提示
        showCartSuccessToast();
        
        // 添加抖动效果
        cartIcon.classList.add('bounce');
        setTimeout(() => {
            cartIcon.classList.remove('bounce');
            isAnimating = false;
        }, 500);
    };
}

/**
 * 更新购物车数量
 */
function updateCartCount(count) {
    const countElement = document.getElementById('cart-count');
    if (!countElement) return;
    
    cartCount = count;
    
    if (count > 0) {
        countElement.textContent = count > 99 ? '99+' : count;
        countElement.classList.add('visible');
    } else {
        countElement.classList.remove('visible');
    }
}

/**
 * 显示添加购物车成功提示
 */
function showCartSuccessToast() {
    // 检查是否已存在toast，如果有则先移除
    let toast = document.querySelector('.cart-success-toast');
    if (toast) {
        document.body.removeChild(toast);
    }
    
    // 创建新的toast
    toast = document.createElement('div');
    toast.className = 'cart-success-toast';
    toast.innerHTML = '<i class="fas fa-check-circle"></i><span>已添加到购物车</span>';
    
    document.body.appendChild(toast);
    
    // 延迟显示，添加过渡效果
    setTimeout(() => {
        toast.classList.add('show');
        
        // 2秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            
            // 过渡结束后移除
            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }, 10);
}

/**
 * 查看购物车
 */
function viewCart() {
    // 购物车页面的跳转逻辑
    if (cartCount > 0) {
        window.location.href = 'cart.html';
    } else {
        // 如果购物车为空，显示提示
        const toast = document.createElement('div');
        toast.className = 'cart-success-toast';
        toast.innerHTML = '<i class="fas fa-shopping-cart"></i><span>购物车还是空的</span>';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            
            // 2秒后隐藏
            setTimeout(() => {
                toast.classList.remove('show');
                
                // 过渡结束后移除
                setTimeout(() => {
                    if (toast.parentNode) {
                        document.body.removeChild(toast);
                    }
                }, 300);
            }, 2000);
        }, 10);
    }
}

/**
 * 切换商品图片查看模式
 */
function toggleViewMode(mode) {
    const gallery = document.getElementById('gallery');
    const controls = document.querySelectorAll('.gallery-control');
    
    if (!gallery || !controls.length) return;
    
    // 保存上一个模式
    viewMode.previous = viewMode.current;
    viewMode.current = mode;
    
    // 更新控制按钮状态
    controls.forEach(control => {
        const controlMode = control.getAttribute('data-mode');
        if (controlMode === mode) {
            control.classList.add('active');
        } else {
            control.classList.remove('active');
        }
    });
    
    // 应用不同模式的样式和行为
    switch(mode) {
        case '360':
            gallery.classList.add('mode-360');
            gallery.classList.remove('mode-normal', 'mode-video');
            break;
        case 'video':
            gallery.classList.add('mode-video');
            gallery.classList.remove('mode-normal', 'mode-360');
            break;
        default:
            gallery.classList.add('mode-normal');
            gallery.classList.remove('mode-360', 'mode-video');
    }
}

/**
 * 处理触摸开始事件
 */
function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
}

/**
 * 处理触摸移动事件
 */
function handleTouchMove(e) {
    if (viewMode.current !== '360') return;
    
    touchEndX = e.touches[0].clientX;
    const diffX = touchEndX - touchStartX;
    
    // 根据拖动距离切换图片
    if (Math.abs(diffX) > 5) {
        if (diffX > 0) {
            prevImage();
        } else {
            nextImage();
        }
        
        // 更新起始位置
        touchStartX = touchEndX;
    }
}

/**
 * 处理触摸结束事件
 */
function handleTouchEnd(e) {
    // 处理轻扫手势
    const diffX = touchEndX - touchStartX;
    
    if (viewMode.current !== '360' && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            // 右滑，显示上一张
            prevImage();
        } else {
            // 左滑，显示下一张
            nextImage();
        }
    }
}

/**
 * 处理鼠标按下事件
 */
function handleMouseDown(e) {
    e.preventDefault();
    
    const startX = e.clientX;
    let lastX = startX;
    
    // 鼠标移动
    const handleMouseMove = (e) => {
        const currentX = e.clientX;
        const diffX = currentX - lastX;
        
        if (viewMode.current === '360' && Math.abs(diffX) > 5) {
            if (diffX > 0) {
                prevImage();
            } else {
                nextImage();
            }
            
            lastX = currentX;
        }
    };
    
    // 鼠标松开
    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
}

/**
 * 显示下一张图片
 */
function nextImage() {
    const images = document.querySelectorAll('.product-image');
    if (!images.length) return;
    
    // 隐藏当前图片
    images[currentImageIndex - 1].classList.remove('active');
    
    // 递增索引
    currentImageIndex = (currentImageIndex % totalImages) + 1;
    
    // 显示下一张
    images[currentImageIndex - 1].classList.add('active');
    
    // 更新指示器
    updateGalleryIndicator();
}

/**
 * 显示上一张图片
 */
function prevImage() {
    const images = document.querySelectorAll('.product-image');
    if (!images.length) return;
    
    // 隐藏当前图片
    images[currentImageIndex - 1].classList.remove('active');
    
    // 递减索引
    currentImageIndex = (currentImageIndex + totalImages - 2) % totalImages + 1;
    
    // 显示上一张
    images[currentImageIndex - 1].classList.add('active');
    
    // 更新指示器
    updateGalleryIndicator();
}

/**
 * 更新图片轮播指示器
 */
function updateGalleryIndicator() {
    const dots = document.querySelectorAll('.gallery-dot');
    if (!dots.length) return;
    
    // 计算当前应该激活哪个点
    // 假设有4个点代表4个场景，每个场景对应2张360度图片
    const activeDotIndex = Math.floor((currentImageIndex - 1) / 2);
    
    // 更新点的状态
    dots.forEach((dot, index) => {
        if (index === activeDotIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

/**
 * 自动切换轮播图
 */
function autoSlideGallery() {
    // 只在普通模式下自动轮播
    if (viewMode.current === 'normal') {
        nextImage();
    }
}

/**
 * 处理页面可见性变化
 */
function handleVisibilityChange() {
    // 页面不可见时暂停动画和轮播
    if (document.hidden) {
        // 暂停动画和计时器
        document.querySelectorAll('.danmu').forEach(danmu => {
            danmu.style.animationPlayState = 'paused';
        });
    } else {
        // 恢复动画和计时器
        document.querySelectorAll('.danmu').forEach(danmu => {
            if (!danmu.classList.contains('fixed')) {
                danmu.style.animationPlayState = 'running';
            }
        });
    }
}

/**
 * 滚动到页面顶部
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * 打开规格选择弹窗
 */
function openSpecSelectModal(mode) {
    const modal = document.getElementById('specSelectModal');
    if (!modal) return;
    
    modal.classList.add('active');
    
    // 添加模式类
    if (mode === 'select') {
        modal.classList.add('select-mode');
        modal.classList.remove('compare-mode');
    } else if (mode === 'compare') {
        modal.classList.add('compare-mode');
        modal.classList.remove('select-mode');
    }
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 添加关闭事件
    const closeBtn = modal.querySelector('.spec-select-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSpecSelectModal);
    }
    
    // 点击遮罩关闭
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeSpecSelectModal();
        }
    });
}

/**
 * 关闭规格选择弹窗
 */
function closeSpecSelectModal() {
    const modal = document.getElementById('specSelectModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

/**
 * 切换规格对比弹窗
 */
function toggleSpecCompare() {
    const modal = document.getElementById('specCompareModal');
    if (!modal) return;
    
    modal.classList.toggle('active');
    
    // 切换背景滚动
    if (modal.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
        
        // 点击遮罩关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                toggleSpecCompare();
            }
        });
    } else {
        document.body.style.overflow = '';
    }
}

/**
 * 立即购买
 */
function buyNow() {
    // 跳转到结算页
    window.location.href = 'checkout.html';
}

// 导出可能被其他模块使用的函数
export {
    addToCart,
    updateCartCount,
    viewCart,
    toggleSpecCompare,
    scrollToTabSection
}; 