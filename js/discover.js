/**
 * 发现页面的JavaScript功能
 */

// 页面加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// 页面交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化购物车徽章
    updateCartBadge();
    
    // 为卡片添加点击波纹效果
    initRippleEffect();
    
    // 添加滚动动画
    initScrollAnimations();
    
    // 为关注按钮添加点击事件
    initFollowButtons();
    
    // 为点赞按钮添加点击事件
    initLikeButtons();
    
    // 功能入口交互效果
    document.querySelectorAll('.feature-entry').forEach(entry => {
        entry.addEventListener('mouseenter', () => {
            const arrow = entry.querySelector('.feature-arrow i');
            arrow.style.transform = 'translateX(5px)';
        });
        
        entry.addEventListener('mouseleave', () => {
            const arrow = entry.querySelector('.feature-arrow i');
            arrow.style.transform = '';
        });
        
        // 添加点击波纹效果
        entry.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 标签切换功能
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // 添加点击动画
            tab.style.transform = 'scale(0.95)';
            setTimeout(() => {
                tab.style.transform = '';
            }, 150);
        });
    });
    
    // 滚动视差效果
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const header = document.querySelector('.header-container');
        
        if (scrollY > 100) {
            header.style.transform = `translateY(${Math.min(scrollY * 0.1, 20)}px)`;
            header.style.opacity = Math.max(0.9, 1 - scrollY * 0.001);
        } else {
            header.style.transform = 'translateY(0)';
            header.style.opacity = '1';
        }
    });
    
    // 添加触摸反馈
    document.querySelectorAll('.card, .action-btn, .follow-btn, .feature-entry').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', () => {
            setTimeout(() => {
                element.style.transform = '';
            }, 100);
        });
    });
    
    // 图片源配置与错误处理
    const imageSources = {
        // 卡片图片备用源
        cardImages: [
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
            'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg',
            'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg'
        ],
        // 头像备用源
        avatarImages: [
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
            'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
            'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
            'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg'
        ],
        // 网格图片备用源
        gridImages: [
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
            'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg',
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
            'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg'
        ],
        // 知识图片备用源
        knowledgeImages: [
            'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
            'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg',
            'https://images.pexels.com/photos/2082087/pexels-photo-2082087.jpeg',
            'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
            'https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg'
        ]
    };
    
    // 替换所有图片为更可靠的源
    // 替换卡片主图
    document.querySelectorAll('.card-image').forEach((img, index) => {
        const fallbackIndex = index % imageSources.cardImages.length;
        img.setAttribute('data-fallback', imageSources.cardImages[fallbackIndex]);
        
        // 图片错误处理
        img.onerror = function() {
            console.log('Image failed to load:', this.src);
            const fallbackSrc = this.getAttribute('data-fallback');
            if (fallbackSrc && this.src !== fallbackSrc) {
                console.log('Using fallback image:', fallbackSrc);
                this.src = fallbackSrc;
            }
        };
    });
    
    // 替换头像
    document.querySelectorAll('.author-avatar, .expert-avatar, .user-avatar').forEach((img, index) => {
        const fallbackIndex = index % imageSources.avatarImages.length;
        img.setAttribute('data-fallback', imageSources.avatarImages[fallbackIndex]);
        
        // 图片错误处理
        img.onerror = function() {
            console.log('Avatar failed to load:', this.src);
            const fallbackSrc = this.getAttribute('data-fallback');
            if (fallbackSrc && this.src !== fallbackSrc) {
                console.log('Using fallback avatar:', fallbackSrc);
                this.src = fallbackSrc;
            }
        };
    });
    
    // 替换网格图片
    document.querySelectorAll('.grid-image').forEach((img, index) => {
        const fallbackIndex = index % imageSources.gridImages.length;
        img.setAttribute('data-fallback', imageSources.gridImages[fallbackIndex]);
        
        // 图片错误处理
        img.onerror = function() {
            console.log('Grid image failed to load:', this.src);
            const fallbackSrc = this.getAttribute('data-fallback');
            if (fallbackSrc && this.src !== fallbackSrc) {
                console.log('Using fallback grid image:', fallbackSrc);
                this.src = fallbackSrc;
            }
        };
    });
    
    // 替换知识图片
    document.querySelectorAll('.knowledge-image').forEach((img, index) => {
        const fallbackIndex = index % imageSources.knowledgeImages.length;
        img.setAttribute('data-fallback', imageSources.knowledgeImages[fallbackIndex]);
        
        // 图片错误处理
        img.onerror = function() {
            console.log('Knowledge image failed to load:', this.src);
            const fallbackSrc = this.getAttribute('data-fallback');
            if (fallbackSrc && this.src !== fallbackSrc) {
                console.log('Using fallback knowledge image:', fallbackSrc);
                this.src = fallbackSrc;
            }
        };
    });
    
    // 懒加载图片优化
    if ('IntersectionObserver' in window) {
        const lazyLoadImages = () => {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                        }
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        img.onload = () => {
                            img.style.opacity = '1';
                        };
                        observer.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        };
        
        lazyLoadImages();
    } else {
        // 降级处理，直接加载所有图片
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
});

// 搜索页面跳转
function goToSearchPage() {
    window.location.href = 'search.html?from=discover';
}

// 定制功能页面跳转
function goToCustomPage() {
    window.location.href = 'custom-furniture.html';
}

// 众筹项目页面跳转
function goToCrowdfundingPage() {
    window.location.href = 'crowdfunding-detail.html';
}

// 更新购物车徽章
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        cartBadge.textContent = cartItems.length;
        cartBadge.style.display = cartItems.length > 0 ? 'flex' : 'none';
    }
}

// 初始化波纹效果
function initRippleEffect() {
    const cards = document.querySelectorAll('.card, .feature-entry-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 添加波纹样式
    const style = document.createElement('style');
    style.textContent = `
        .card, .feature-entry-card {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            margin-top: -50px;
            margin-left: -50px;
            animation: ripple-effect 0.6s linear;
            transform: scale(0);
            pointer-events: none;
        }
        
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 初始化滚动动画
function initScrollAnimations() {
    // 添加滚动监听器，实现元素进入视口时的动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.card, .feature-entry-card, .section-title');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // 添加滚动动画样式
    const style = document.createElement('style');
    style.textContent = `
        .card, .feature-entry-card, .section-title {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .card.visible, .feature-entry-card.visible, .section-title.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .feature-entry-card {
            transition-delay: 0.1s;
        }
        
        .feature-entry-card:nth-child(2) {
            transition-delay: 0.2s;
        }
        
        .card:nth-child(3n+1) {
            transition-delay: 0.1s;
        }
        
        .card:nth-child(3n+2) {
            transition-delay: 0.2s;
        }
        
        .card:nth-child(3n+3) {
            transition-delay: 0.3s;
        }
    `;
    document.head.appendChild(style);
    
    // 初始加载时执行一次
    animateOnScroll();
    
    // 添加滚动监听
    window.addEventListener('scroll', animateOnScroll);
}

// 初始化关注按钮
function initFollowButtons() {
    const followButtons = document.querySelectorAll('.follow-btn');
    
    followButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
            
            if (this.classList.contains('following')) {
                this.classList.remove('following');
                this.textContent = '+ 关注';
                this.style.backgroundColor = '';
            } else {
                this.classList.add('following');
                this.textContent = '已关注';
                this.style.backgroundColor = '#64748b';
                
                // 显示关注成功提示
                showToast('关注成功！');
            }
        });
    });
}

// 初始化点赞按钮
function initLikeButtons() {
    const likeButtons = document.querySelectorAll('.action-btn i.fa-heart');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
            
            const likeCount = this.nextElementSibling;
            
            if (this.classList.contains('liked')) {
                this.classList.remove('liked', 'fas');
                this.classList.add('far');
                this.style.color = '';
                likeCount.textContent = parseInt(likeCount.textContent) - 1;
            } else {
                this.classList.add('liked', 'fas');
                this.classList.remove('far');
                this.style.color = '#ef4444';
                likeCount.textContent = parseInt(likeCount.textContent) + 1;
                
                // 添加点赞动画
                const parent = this.parentElement;
                const heart = document.createElement('span');
                heart.innerHTML = '❤️';
                heart.className = 'floating-heart';
                heart.style.cssText = `
                    position: absolute;
                    font-size: 20px;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: float-up 1s ease-out forwards;
                `;
                parent.style.position = 'relative';
                parent.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 1000);
            }
        });
    });
    
    // 添加点赞动画样式
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float-up {
            0% {
                transform: translate(-50%, -50%) scale(0.5);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -150%) scale(1.5);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 显示提示信息
function showToast(message) {
    // 创建toast元素
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 12px 24px;
        border-radius: 24px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示toast
    setTimeout(() => {
        toast.style.opacity = '1';
    }, 10);
    
    // 3秒后隐藏并移除
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
} 