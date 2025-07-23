// 全局自动滚动控制函数
function pauseAutoScroll() {
    const productScroll = document.getElementById('product-scroll');
    if (productScroll) {
        productScroll.classList.add('pause-scroll');
        console.log("暂停自动滚动");
    }
}

function resumeAutoScroll() {
    const productScroll = document.getElementById('product-scroll');
    if (productScroll) {
        setTimeout(() => {
            productScroll.classList.remove('pause-scroll');
            console.log("恢复自动滚动");
        }, 1000); // 1秒后恢复滚动
    }
}

// 确保所有图片都能立即显示
function ensureImagesDisplayed() {
    console.log("强制显示所有产品图片");
    const productImgs = document.querySelectorAll('.product-img');
    
    productImgs.forEach((img, index) => {
        // 强制设置图片显示
        img.style.opacity = "1";
        img.style.transform = "scale(1)";
        img.style.display = "block";
        
        // 预加载图片
        const imgSrc = img.getAttribute('src');
        const preloadImg = new Image();
        preloadImg.src = imgSrc;
        
        console.log(`处理产品图片 ${index + 1}/${productImgs.length}: ${imgSrc}`);
        
        // 图片加载成功时
        img.onload = function() {
            console.log(`图片加载成功: ${imgSrc}`);
            img.style.opacity = "1";
        };
        
        // 图片加载失败时处理
        img.onerror = function() {
            console.warn('图片加载失败:', imgSrc);
            // 已经在HTML中设置了onerror属性来使用备用图片
            // 这里添加额外的错误处理逻辑
            const fallbackSrc = img.getAttribute('data-fallback') || '../images/sofa/09.jpg';
            console.log(`使用备用图片: ${fallbackSrc}`);
            img.src = fallbackSrc;
        };
    });
    
    // 使产品卡片对父容器可见
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.opacity = "1";
        card.style.visibility = "visible";
        console.log(`设置产品卡片 ${index + 1}/${productCards.length} 可见`);
    });
}

// 跳转到搜索页面的函数
function goToSearchPage() {
    console.log("跳转到搜索页面");
    window.location.href = 'search.html';
}

// 产品卡片交互效果增强
function setupProductCards() {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        // 悬停视差效果
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 计算鼠标在卡片内的位置百分比
            const xPercent = ((x / rect.width) - 0.5) * 2;
            const yPercent = ((y / rect.height) - 0.5) * 2;
            
            // 应用微小倾斜效果
            this.style.transform = `translateY(-3px) perspective(1000px) rotateY(${xPercent * 2}deg) rotateX(${yPercent * -2}deg)`;
            
            // 徽章动画效果
            const badge = this.querySelector('.product-card-badge');
            if (badge) {
                badge.style.transform = `translateX(-50%) scale(1.05)`;
            }
        });
        
        // 鼠标离开时重置效果
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            const badge = this.querySelector('.product-card-badge');
            if (badge) {
                badge.style.transform = 'translateX(-50%)';
            }
        });
    });
}

// 初始化产品滚动
function setupProductScroll() {
    const productScroll = document.getElementById('product-scroll');
    if (productScroll) {
        // 启用自动滚动
        console.log("产品滚动容器初始化 - 自动滚动模式");
        
        // 确保添加自动滚动类
        if (!productScroll.classList.contains('auto-scroll')) {
            productScroll.classList.add('auto-scroll');
        }
        
        // 复制前6个产品卡片并添加到末尾，用于无缝循环
        const productCards = productScroll.querySelectorAll('.product-card');
        const cardsToClone = Math.min(6, productCards.length);
        
        // 仅在初次加载时克隆卡片，避免重复
        if (productCards.length > 0 && !productScroll.hasAttribute('data-cloned')) {
            console.log(`复制前${cardsToClone}个产品卡片到末尾实现无限滚动效果`);
            for (let i = 0; i < cardsToClone; i++) {
                const cloneCard = productCards[i].cloneNode(true);
                // 为克隆卡片添加标记
                cloneCard.setAttribute('data-cloned', 'true');
                productScroll.appendChild(cloneCard);
            }
            // 标记已复制
            productScroll.setAttribute('data-cloned', 'true');
        }
        
        // 添加鼠标和触摸事件监听，控制滚动
        productScroll.addEventListener('mouseenter', pauseAutoScroll);
        productScroll.addEventListener('mouseleave', resumeAutoScroll);
        productScroll.addEventListener('touchstart', pauseAutoScroll);
        productScroll.addEventListener('touchend', resumeAutoScroll);
        
        // 滚动结束时重置
        productScroll.addEventListener('animationiteration', () => {
            console.log("滚动动画完成一次循环");
        });
    }
}

// 初始化视频控制
function setupVideoControls() {
    const video = document.getElementById('banner-video');
    if (!video) return;
    
    const playButton = document.getElementById('video-play-button');
    const muteButton = document.getElementById('video-mute-button');
    const progressBar = document.getElementById('video-progress-bar');
    const progressContainer = document.getElementById('video-progress');
    const timeDisplay = document.getElementById('video-time');
    
    if (playButton) {
    // 播放/暂停功能
    playButton.addEventListener('click', function() {
        if (video.paused) {
            video.play();
            playButton.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            video.pause();
            playButton.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    }
    
    if (muteButton) {
    // 静音功能
    muteButton.addEventListener('click', function() {
        video.muted = !video.muted;
        if (video.muted) {
            muteButton.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            muteButton.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    });
    }
    
    if (progressBar && timeDisplay) {
    // 更新进度条
    video.addEventListener('timeupdate', function() {
        // 更新进度条宽度
        const percentage = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percentage + '%';
        
        // 更新时间显示
        const currentMinutes = Math.floor(video.currentTime / 60);
        const currentSeconds = Math.floor(video.currentTime % 60);
        const durationMinutes = Math.floor(video.duration / 60) || 0;
        const durationSeconds = Math.floor(video.duration % 60) || 0;
        
        timeDisplay.textContent = `${currentMinutes.toString().padStart(2, '0')}:${currentSeconds.toString().padStart(2, '0')} / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
    });
    }
    
    if (progressContainer) {
    // 点击进度条跳转
    progressContainer.addEventListener('click', function(e) {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        video.currentTime = pos * video.duration;
    });
    }
    
    if (timeDisplay) {
    // 视频加载后初始化时间显示
    video.addEventListener('loadedmetadata', function() {
        const durationMinutes = Math.floor(video.duration / 60);
        const durationSeconds = Math.floor(video.duration % 60);
        timeDisplay.textContent = `00:00 / ${durationMinutes.toString().padStart(2, '0')}:${durationSeconds.toString().padStart(2, '0')}`;
    });
    }
}

// 初始化搜索功能
function setupSearch() {
    const searchInputEl = document.getElementById('search-input');
    if (searchInputEl) {
        searchInputEl.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSearchPage();
        });
    }
    
    const searchContainer = document.getElementById('search-container');
    if (searchContainer) {
        searchContainer.addEventListener('click', function() {
            goToSearchPage();
        });
    }
    
    const searchButton = document.getElementById('search-button');
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.stopPropagation();
            goToSearchPage();
        });
    }
    
    // 搜索框轮换提示文字
    if (searchInputEl) {
        const searchPlaceholders = [
            "搜索家具、空间...",
            "沙发",
            "茶几",
            "餐桌",
            "床",
            "衣柜",
            "书桌",
            "椅子"
        ];
        
        let placeholderIndex = 0;
        
        // 定时轮换搜索提示文本
        function rotatePlaceholders() {
            if (searchInputEl) {
                searchInputEl.placeholder = "";
                placeholderIndex = (placeholderIndex + 1) % searchPlaceholders.length;
                
                let currentPlaceholder = searchPlaceholders[placeholderIndex];
                let charIndex = 0;
                
                // 打字机效果显示新的提示文字
                const typeEffect = setInterval(() => {
                    if(charIndex < currentPlaceholder.length) {
                        searchInputEl.placeholder += currentPlaceholder.charAt(charIndex);
                        charIndex++;
                    } else {
                        clearInterval(typeEffect);
                    }
                }, 50);
            }
        }
        
        // 每4秒轮换一次提示文字
        setInterval(rotatePlaceholders, 4000);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM加载完成，初始化页面功能");
    
    // 确保所有图片立即显示
    ensureImagesDisplayed();
    
    // 给DOM一些时间来渲染图片
    setTimeout(() => {
        console.log("再次确保所有图片显示");
        ensureImagesDisplayed();
        
        // 设置产品卡片交互
        setupProductCards();
        
        // 设置产品滚动
        setupProductScroll();
    }, 500);
    
    // 设置视频控制
    setupVideoControls();
    
    // 设置搜索功能
    setupSearch();
    
    // 监听页面可见性变化
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            resumeAutoScroll();
        } else {
            pauseAutoScroll();
        }
    });
    
    // 分类切换
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有分类的活跃状态
            categoryItems.forEach(c => c.classList.remove('active'));
            
            // 添加当前分类的活跃状态
            this.classList.add('active');
        });
    });
    
    // 购物车相关逻辑初始化
    const cartBadge = document.getElementById('cart-badge');
    let cartCount = 0;
    
    // 恢复购物车数量
    const savedCartCount = localStorage.getItem('cartCount');
    if (savedCartCount) {
        cartCount = parseInt(savedCartCount);
        cartBadge.textContent = cartCount;
        if (cartCount > 0) {
            cartBadge.classList.add('show');
        }
    }
    
    // 配置加入购物车按钮
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            // 阻止事件冒泡，避免触发卡片点击事件
            event.stopPropagation();
            
            // 添加加入购物车的视觉反馈
            this.classList.add('clicked');
            this.innerHTML = '<i class="fas fa-check"></i>';
            
            // 创建飞入动画元素
            const flyItem = document.createElement('div');
            flyItem.className = 'cart-item-fly';
            flyItem.innerHTML = '<i class="fas fa-shopping-basket"></i>';
            document.body.appendChild(flyItem);
            
            // 获取按钮和购物车图标的位置
            const buttonRect = this.getBoundingClientRect();
            const cartIconRect = document.querySelector('.tab-bar .fa-shopping-cart').getBoundingClientRect();
            
            // 设置初始位置
            flyItem.style.top = (buttonRect.top + buttonRect.height/2 - 15) + 'px';
            flyItem.style.left = (buttonRect.left + buttonRect.width/2 - 15) + 'px';
            
            // 在动画开始前创建轨迹效果（小点）
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    const trail = document.createElement('div');
                    trail.className = 'cart-item-fly-trail';
                    document.body.appendChild(trail);
                    trail.style.left = flyItem.style.left;
                    trail.style.top = flyItem.style.top;
                    
                    // 淡出效果
                    setTimeout(() => {
                        trail.style.transition = 'opacity 0.5s ease-out';
                        trail.style.opacity = '0';
                        setTimeout(() => trail.remove(), 500);
                    }, 500);
                }, i * 150);
            }
            
            // 设置飞入动画
            setTimeout(() => {
                flyItem.style.transition = 'all 2s cubic-bezier(0.25, 0.1, 0.25, 1)';
                flyItem.style.top = (cartIconRect.top + 5) + 'px';
                flyItem.style.left = (cartIconRect.left + 5) + 'px';
                
                // 添加两个中间点以创建抛物线轨迹
                const midX = (buttonRect.left + cartIconRect.left) / 2 - 50;
                const midY = Math.min(buttonRect.top, cartIconRect.top) - 100;
                
                setTimeout(() => {
                    flyItem.style.left = midX + 'px';
                    flyItem.style.top = midY + 'px';
                    
                    setTimeout(() => {
                        flyItem.style.transition = 'all 1s cubic-bezier(0.5, 1, 0.8, 1)';
                        flyItem.style.left = (cartIconRect.left + 5) + 'px';
                        flyItem.style.top = (cartIconRect.top + 5) + 'px';
                        flyItem.style.opacity = '0.9';
                        
                        // 缩小并旋转
                        flyItem.style.transform = 'scale(0.3) rotate(720deg)';
                    }, 1000);
                }, 200);
            }, 100);
            
            // 动画结束后移除元素
            setTimeout(() => {
                flyItem.style.opacity = '0';
                setTimeout(() => {
                    flyItem.remove();
                }, 300);
            }, 2500);
            
            // 更新购物车数量
            cartCount++;
            cartBadge.textContent = cartCount;
            
            // 显示购物车徽章
            cartBadge.classList.add('show');
            
            // 添加脉冲动画效果
            cartBadge.classList.remove('pulse');
            void cartBadge.offsetWidth; // 触发重绘
            cartBadge.classList.add('pulse');
            
            // 本地存储购物车数量
            localStorage.setItem('cartCount', cartCount);
            
            setTimeout(() => {
                this.classList.remove('clicked');
                this.innerHTML = '加入购物车';
            }, 1500);
        });
    });
    
    // 底部导航交互
    const tabItems = document.querySelectorAll('.tab-item');
    tabItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有导航项的活跃状态
            tabItems.forEach(tab => {
                tab.querySelector('.tab-icon').classList.remove('tab-active');
                tab.querySelector('.tab-icon').classList.add('tab-inactive');
                tab.querySelector('.tab-label').classList.remove('tab-active');
                tab.querySelector('.tab-label').classList.add('tab-inactive');
            });
            
            // 添加当前导航项的活跃状态
            this.querySelector('.tab-icon').classList.remove('tab-inactive');
            this.querySelector('.tab-icon').classList.add('tab-active');
            this.querySelector('.tab-label').classList.remove('tab-inactive');
            this.querySelector('.tab-label').classList.add('tab-active');
        });
    });
    
    // 分类左右循环滑动
    const categoryScroll = document.getElementById('category-scroll');
    const prevBtn = document.querySelector('.category-prev');
    const nextBtn = document.querySelector('.category-next');
    
    if (prevBtn && nextBtn && categoryScroll) {
        prevBtn.addEventListener('click', function() {
            categoryScroll.scrollBy({
                left: -200,
                behavior: 'smooth'
            });
        });
        
        nextBtn.addEventListener('click', function() {
            categoryScroll.scrollBy({
                left: 200,
                behavior: 'smooth'
            });
        });
        
        // 实现循环效果
        categoryScroll.addEventListener('scroll', function() {
            if (this.scrollLeft === 0) {
                // 当滚动到最左边时，静默跳转到右边
                this.scrollLeft = this.scrollWidth - this.clientWidth;
            } else if (this.scrollLeft >= this.scrollWidth - this.clientWidth) {
                // 当滚动到最右边时，静默跳转到左边
                this.scrollLeft = 0;
            }
        });
    }
    
    // 添加微交互反馈
    const allButtons = document.querySelectorAll('button, .btn-press');
    allButtons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
    
    // 滑动阻尼效果
    const scrollContainers = document.querySelectorAll('.scroll-damping');
    scrollContainers.forEach(container => {
        let startX, startScrollLeft, isDown = false;
        
        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            startScrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });
        
        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
            
            // 滑动结束时的阻尼效果
            const currentScrollLeft = container.scrollLeft;
            const targetScrollLeft = Math.round(currentScrollLeft / 200) * 200;
            
            // 使用动画平滑滚动到目标位置
            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        });
        
        container.addEventListener('mousemove', (e) => {
            if(!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            // 添加阻尼系数0.8，使滑动感觉更自然
            const walk = (x - startX) * 0.8;
            container.scrollLeft = startScrollLeft - walk;
        });
        
        // 触摸设备支持
        container.addEventListener('touchstart', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.touches[0].pageX - container.offsetLeft;
            startScrollLeft = container.scrollLeft;
        });
        
        container.addEventListener('touchend', () => {
            isDown = false;
            container.classList.remove('active');
            
            // 滑动结束时的阻尼效果
            const currentScrollLeft = container.scrollLeft;
            const targetScrollLeft = Math.round(currentScrollLeft / 200) * 200;
            
            container.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
            });
        });
        
        container.addEventListener('touchmove', (e) => {
            if(!isDown) return;
            const x = e.touches[0].pageX - container.offsetLeft;
            const walk = (x - startX) * 0.8;
            container.scrollLeft = startScrollLeft - walk;
        });
    });
    
    // 客服按钮点击效果
    const customerServiceBtn = document.getElementById('customer-service-btn');
    if (customerServiceBtn) {
        customerServiceBtn.addEventListener('click', function(e) {
            // 保存用户来源信息，便于客服页面提供个性化服务
            localStorage.setItem('service_source', 'home');
            localStorage.setItem('service_time', new Date().toISOString());
            
            // 添加点击动画效果
            const btnIcon = this.querySelector('i');
            btnIcon.classList.add('animate-bounce');
            
            // 300ms后恢复，让动画有时间显示
            setTimeout(() => {
                btnIcon.classList.remove('animate-bounce');
            }, 300);
        });
    }
    
    // 图片搜索相关功能已禁用
    
    // 分享功能相关
    let currentShareProduct = { name: '', id: 0 };
    const sharePanel = document.getElementById('share-panel');
    const shareOverlay = document.getElementById('share-overlay');
    const sharePanelClose = document.getElementById('share-panel-close');
    
    // 打开分享面板
    window.openSharePanel = function(productName, productId) {
        currentShareProduct.name = productName;
        currentShareProduct.id = productId;
        
        // 暂停自动滚动
        pauseAutoScroll();
        
        // 显示分享面板和遮罩
        if (sharePanel && shareOverlay) {
            sharePanel.classList.add('active');
            shareOverlay.classList.add('active');
            
            // 防止页面滚动
            document.body.style.overflow = 'hidden';
        }
    }
    
    // 关闭分享面板
    function closeSharePanel() {
        if (sharePanel && shareOverlay) {
            sharePanel.classList.remove('active');
            shareOverlay.classList.remove('active');
            
            // 恢复页面滚动
            document.body.style.overflow = '';
            
            // 恢复自动滚动
            resumeAutoScroll();
        }
    }
    
    // 绑定关闭按钮事件
    if (sharePanelClose && shareOverlay) {
        sharePanelClose.addEventListener('click', closeSharePanel);
        shareOverlay.addEventListener('click', closeSharePanel);
    }
    
    // 分享到微信好友
    window.shareToWechat = function() {
        const shareUrl = `${window.location.origin}/product-detail.html?id=${currentShareProduct.id}`;
        const shareSummary = `家逸生活 - ${currentShareProduct.name}，品质家具定制专家`;
        
        // 这里应该调用微信分享API
        // 由于在浏览器中无法直接调用微信API，这里模拟显示一个提示
        showShareToast('微信好友', shareUrl);
    }
    
    // 分享到朋友圈
    window.shareToMoments = function() {
        const shareUrl = `${window.location.origin}/product-detail.html?id=${currentShareProduct.id}`;
        showShareToast('朋友圈', shareUrl);
    }
    
    // 分享到微博
    window.shareToWeibo = function() {
        const shareUrl = `${window.location.origin}/product-detail.html?id=${currentShareProduct.id}`;
        showShareToast('微博', shareUrl);
    }
    
    // 分享到QQ
    window.shareToQQ = function() {
        const shareUrl = `${window.location.origin}/product-detail.html?id=${currentShareProduct.id}`;
        showShareToast('QQ', shareUrl);
    }
    
    // 显示分享提示
    function showShareToast(platform, url) {
        closeSharePanel();
        
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.innerHTML = `
            <div style="font-weight: 500; margin-bottom: 5px;">即将分享到${platform}</div>
            <div style="font-size: 12px; word-break: break-all;">${url}</div>
        `;
        
        toast.style.position = 'fixed';
        toast.style.bottom = '80px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = 'rgba(38, 70, 83, 0.9)';
        toast.style.color = 'white';
        toast.style.padding = '12px 16px';
        toast.style.borderRadius = '12px';
        toast.style.zIndex = '9999';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.minWidth = '200px';
        toast.style.maxWidth = '80%';
        toast.style.textAlign = 'center';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }
}); 