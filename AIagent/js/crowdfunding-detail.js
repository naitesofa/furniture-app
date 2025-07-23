// 变量定义
let currentSlide = 0;
let isTabbing = false;
let scrollTimeout = null;
let lastTouchY = 0; // 记录触摸开始位置，用于判断滚动方向
let projectStatus = "ongoing"; // 设置默认状态为众筹中

// 用于存储用户之前的模态框ID
let previousModalId = null;

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM已加载，开始初始化...");
    
    // 首先检查并设置项目状态 - 确保在其他初始化前执行
    checkProjectStatus();
    console.log("项目状态检查完成，当前状态:", projectStatus);
    
    // 接着初始化点赞功能 - 确保在DOM加载后执行
    initLikeFeature();
    console.log("点赞功能初始化完成");
    
    // 然后初始化其他功能
    initSwiper();
    initDetailTabs();
    initFAQItems();
    initTierCards();
    initParticleEffect();
    initLazyLoad();
    initCollapsibleModules(); // 初始化可折叠模块
    initAddModuleButton(); // 初始化添加模块按钮
    initVideoPlayer(); // 初始化视频播放器
    checkOrderStatus(); // 检查用户订单状态
    addTestModeToggleButton(); // 添加测试模式切换按钮
    
    // 根据项目状态更新支持按钮功能
    updateSupportButtonsByStatus();
    
    // 监听标签栏粘性定位变化，优化移动端表现
    observeTabSticky();
    
    // 滚动优化，使用passive标志提高性能
    window.addEventListener('scroll', throttleScroll(handleScroll, 100), { passive: true });
    
    // 为图片添加预览功能
    document.querySelectorAll('.product-info-section img').forEach(img => {
        if (!img.closest('.video-placeholder')) {
            img.addEventListener('click', function() {
                showImagePreview(this.src);
            });
        }
    });
    
    // 添加触摸事件监听器，改善移动端滑动体验
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', throttleScroll(handleTouchMove, 50), { passive: true });
    
    // 初始化浮动导航
    initFloatNav();
    
    // 在DOM加载完成后初始化
    init();
});

// 处理触摸开始事件
function handleTouchStart(e) {
    lastTouchY = e.touches[0].clientY;
}

// 处理触摸移动事件，优化标签栏滚动体验
function handleTouchMove(e) {
    const currentY = e.touches[0].clientY;
    const tabContainer = document.querySelector('.detail-tab-container');
    
    if (!tabContainer) return;
    
    // 检测是否在向下滚动且接近标签栏
    if (currentY < lastTouchY) { // 向上滑动
        const tabContainerRect = tabContainer.getBoundingClientRect();
        if (tabContainerRect.top < 50 && tabContainerRect.top > -50) {
            // 此时用户正在滑过标签栏区域，确保标签栏固定显示
            tabContainer.classList.add('force-sticky');
        }
    } else { // 向下滑动
        tabContainer.classList.remove('force-sticky');
    }
    
    lastTouchY = currentY;
}

// 返回上一页
function goBack() {
    window.history.back();
}

// 初始化轮播图
function initSwiper() {
    const swiper = document.getElementById('productSwiper');
    if (!swiper) return;
    
    const wrapper = swiper.querySelector('.swiper-wrapper');
    const slides = swiper.querySelectorAll('.swiper-slide');
    const bullets = swiper.querySelectorAll('.swiper-pagination-bullet');
    
    if (!wrapper || !slides.length || !bullets.length) return;
    
    let currentSlide = 0;
    let startX = 0;
    let isSwiping = false;
    
    // 自动轮播（减少频率以节省电池）
    const autoplayInterval = setInterval(function() {
        if (document.visibilityState === 'visible' && !isSwiping) {
            nextSlide();
        }
    }, 5000); // 延长间隔以提高电池寿命
    
    // 轮播到下一张
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlide();
    }
    
    // 更新轮播图位置和指示器
    function updateSlide() {
        wrapper.style.transition = 'transform 0.3s ease';
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        bullets.forEach((bullet, index) => {
            if (index === currentSlide) {
                bullet.classList.add('swiper-pagination-bullet-active');
            } else {
                bullet.classList.remove('swiper-pagination-bullet-active');
            }
        });
    }
    
    // 点击指示器切换
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            clearInterval(autoplayInterval);
            currentSlide = index;
            updateSlide();
        });
    });
    
    // 触摸滑动（优化移动端体验）
    swiper.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isSwiping = true;
        clearInterval(autoplayInterval);
        wrapper.style.transition = 'none';
    }, { passive: true });
    
    swiper.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const translateX = -currentSlide * 100 + (diffX / swiper.offsetWidth) * 100;
        
        // 限制滑动范围，提高性能
        if (Math.abs(diffX) < swiper.offsetWidth) {
            wrapper.style.transform = `translateX(${translateX}%)`;
        }
    }, { passive: true });
    
    swiper.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        
        isSwiping = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;
        
        wrapper.style.transition = 'transform 0.3s ease';
        
        // 降低滑动敏感度，减少误触
        if (Math.abs(diffX) > swiper.offsetWidth / 5) { // 将阈值从1/4调整为1/5，减少误触
            if (diffX > 0 && currentSlide > 0) {
                currentSlide--;
            } else if (diffX < 0 && currentSlide < slides.length - 1) {
                currentSlide++;
            }
        }
        
        updateSlide();
        
        // 重新启动自动轮播
        setTimeout(() => {
            clearInterval(autoplayInterval);
            setInterval(function() {
                if (document.visibilityState === 'visible' && !isSwiping) {
                    nextSlide();
                }
            }, 5000);
        }, 3000);
    }, { passive: true });
    
    // 初始更新一次
    updateSlide();
    
    // 处理可见性变化，优化电池使用
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'hidden') {
            clearInterval(autoplayInterval);
        }
    });
}

// 初始化详情标签页
function initDetailTabs() {
    const detailTabNav = document.getElementById('detailTabNav');
    if (!detailTabNav) return;
    
    const tabItems = detailTabNav.querySelectorAll('.detail-tab-item');
    
    if (!tabItems.length) return;
    
    // 等待DOM完全加载后初始化滑块位置
    window.addEventListener('load', function() {
        // 获取初始激活的标签索引
        let activeIndex = 0;
        tabItems.forEach((item, index) => {
            if (item.classList.contains('active')) {
                activeIndex = index;
            }
        });
        
        // 更新滑块位置
        setTimeout(() => {
            updateTabSlider(activeIndex);
        }, 200);
    });
    
    // 点击标签
    tabItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            // 防止频繁点击
            if (isTabbing) return;
            isTabbing = true;
            
            // 更新标签状态
            tabItems.forEach(tab => tab.classList.remove('active'));
            item.classList.add('active');
            
            // 更新滑块位置
            updateTabSlider(index);
            
            // 显示对应内容
            const targetId = this.getAttribute('data-target');
            const contentSections = document.querySelectorAll('#projectDetails, #supportTiers, #projectUpdates, #comments');
            
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.style.display = 'block';
                
                // 滚动到标签栏位置，优化移动端体验
                const tabContainer = document.querySelector('.detail-tab-container');
                const headerHeight = document.querySelector('.header').offsetHeight;
                const tabTop = tabContainer.offsetTop;
                window.scrollTo({ 
                    top: tabTop - headerHeight - 5, 
                    behavior: 'smooth' 
                });
            }
            
            // 触觉反馈
            provideTactileFeedback(5);
            
            // 重置标签状态
            setTimeout(() => {
                isTabbing = false;
            }, 300);
        });
    });
}

// 更新标签状态
function updateActiveTabByIndex(index) {
    const tabItems = document.querySelectorAll('.detail-tab-item');
    if (!tabItems.length) return;
    
    // 设置标签切换状态
    isTabbing = true;
    
    // 清除之前的计时器
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // 更新标签
    tabItems.forEach((item, i) => {
        if (i === index) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // 更新滑块位置
    updateTabSlider(index);
    
    // 重置标签切换状态
    scrollTimeout = setTimeout(() => {
        isTabbing = false;
    }, 100);
}

// 更新标签滑块位置
function updateTabSlider(index) {
    const tabItems = document.querySelectorAll('.detail-tab-item');
    const tabSlider = document.getElementById('detailTabSlider');
    const tabContainer = document.querySelector('.detail-tab-container');
    
    if (!tabItems.length || !tabSlider || !tabContainer) return;
    
    const activeTab = tabItems[index];
    if (!activeTab) return;
    
    // 计算滑块宽度为标签项的宽度
    const tabWidth = activeTab.offsetWidth;
    // 计算偏移量 - 相对于容器
    const offsetLeft = activeTab.offsetLeft;
    
    // 设置滑块的宽度和位置
    tabSlider.style.width = `${tabWidth}px`;
    tabSlider.style.transform = `translateX(${offsetLeft}px)`;
        tabSlider.style.opacity = '1';
}

// 初始化折叠问答
function initFAQItems() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                // 触觉反馈
                provideTactileFeedback(5);
                
                // 切换显示/隐藏
                item.classList.toggle('active');
            });
        }
    });
}

// 初始化支持档位卡片
function initTierCards() {
    const tierCards = document.querySelectorAll('.tier-card');
    const supportPriceEl = document.querySelector('.support-bar .text-lg');
    const supportTierEl = document.querySelector('.support-bar .text-xs');
    
    tierCards.forEach(card => {
        card.addEventListener('click', function() {
            // 获取档位信息
            const tierTitle = card.querySelector('.tier-title')?.textContent || '';
            const tierPrice = card.querySelector('.tier-price-tag .text-xl')?.textContent || '';
            
            // 更新底部支持栏
            if (supportPriceEl) supportPriceEl.textContent = tierPrice;
            if (supportTierEl) supportTierEl.textContent = `${tierTitle}（已选）`;
            
            // 添加选中效果
            tierCards.forEach(c => c.classList.remove('tier-highlighted'));
            card.classList.add('tier-highlighted');
            
            // 触觉反馈
            provideTactileFeedback(10);
            
            // 显示选择成功提示
            showToast(`已选择 ${tierTitle}`);
        });
    });
}

// 创建粒子特效（移动端优化版，减少粒子数量）
function initParticleEffect() {
    const particleContainer = document.querySelector('.particle-container');
    if (!particleContainer) return;
    
    // 检测是否为移动设备，移动设备减少粒子数量
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 20; // 减少粒子数量以提高性能
    
    // 清空现有粒子
    particleContainer.innerHTML = '';
    
    // 创建随机粒子
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * (isMobile ? 2 : 5) + 1; // 减小粒子尺寸
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 15; // 延长动画周期，减少性能消耗
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particleContainer.appendChild(particle);
    }
    
    // 添加窗口尺寸变化监听，动态调整粒子数量
    window.addEventListener('resize', throttleScroll(function() {
        const newIsMobile = window.innerWidth < 768;
        if (newIsMobile !== isMobile) {
            // 只有在移动状态发生变化时才重新初始化
            initParticleEffect();
        }
    }, 250), { passive: true });
}

// 图片预览功能
function showImagePreview(imgSrc) {
    const previewContainer = document.getElementById('imagePreview');
    const previewImage = document.getElementById('previewImage');
    
    if (!previewContainer || !previewImage) return;
    
    // 设置预览图片源
    previewImage.src = imgSrc;
    
    // 显示预览
    previewContainer.classList.add('show');
    
    // 禁止滚动
    document.body.style.overflow = 'hidden';
    
    // 触觉反馈
    provideTactileFeedback(5);
    
    // 点击预览区域关闭
    previewContainer.onclick = function() {
        this.classList.remove('show');
        document.body.style.overflow = '';
    };
    
    // 添加双指缩放功能
    let initialDistance = 0;
    let scale = 1;
    
    previewContainer.addEventListener('touchstart', function(e) {
        if (e.touches.length === 2) {
            initialDistance = getDistance(e.touches[0], e.touches[1]);
            e.preventDefault(); // 防止其他操作
        }
    }, { passive: false });
    
    previewContainer.addEventListener('touchmove', function(e) {
        if (e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            scale = Math.max(1, Math.min(3, (currentDistance / initialDistance) * scale));
            previewImage.style.transform = `scale(${scale})`;
            e.preventDefault(); // 防止滚动
        }
    }, { passive: false });
    
    previewContainer.addEventListener('touchend', function() {
        if (scale < 1.1) {
            // 缩放很小时，还原
            scale = 1;
            previewImage.style.transform = '';
        }
    }, { passive: true });
    
    // 计算两点之间的距离
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// 分享页面
function sharePage() {
    // 触觉反馈
    provideTactileFeedback(3);
    
    // 检查是否支持Web Share API
    if (navigator.share) {
        navigator.share({
            title: '未来感智能沙发 - 内置按摩、语音控制',
            text: '前沿科技与人体工程学的完美结合，航天级记忆材料智能沙发，限时特惠中！',
            url: window.location.href
        })
        .then(() => {
            console.log('分享成功');
            showToast('分享成功！');
        })
        .catch((error) => {
            console.log('分享失败:', error);
            showShareOptions(); // 如果系统分享失败，显示自定义分享选项
        });
    } else {
        // 不支持Web Share API，显示自定义分享选项
        showShareOptions();
    }
}

// 显示自定义分享选项
function showShareOptions() {
    // 创建模态框
    const shareModal = document.createElement('div');
    shareModal.className = 'modal';
    shareModal.id = 'shareModal';
    
    // 创建模态框内容
    shareModal.innerHTML = `
        <div class="modal-content max-h-90vh support-tier-modal" style="max-width: 360px;">
            <div class="modal-header flex items-center justify-between">
                <h3 class="modal-title flex items-center">
                    <i class="fas fa-share-alt text-brand-primary mr-2"></i>分享众筹项目
                </h3>
                <button class="modal-close-btn" onclick="hideModal('shareModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <p class="text-sm text-gray-400 mb-4">选择分享方式：</p>
                
                <!-- 分享选项列表 -->
                <div class="cs-options">
                    <div class="cs-option-item" onclick="copyShareLink()">
                        <div class="cs-option-icon bg-gradient-green">
                            <i class="fas fa-copy"></i>
                        </div>
                        <div class="cs-option-info">
                            <div class="cs-option-title">复制链接</div>
                            <div class="cs-option-desc">复制项目链接分享给好友</div>
                        </div>
                        <div class="cs-option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    
                    <div class="cs-option-item" onclick="shareToWeChat()">
                        <div class="cs-option-icon" style="background: linear-gradient(135deg, #09BB07, #06AB04);">
                            <i class="fab fa-weixin"></i>
                        </div>
                        <div class="cs-option-info">
                            <div class="cs-option-title">微信</div>
                            <div class="cs-option-desc">分享到微信好友或朋友圈</div>
                        </div>
                        <div class="cs-option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    
                    <div class="cs-option-item" onclick="shareToWeibo()">
                        <div class="cs-option-icon" style="background: linear-gradient(135deg, #E6162D, #C60C22);">
                            <i class="fab fa-weibo"></i>
                        </div>
                        <div class="cs-option-info">
                            <div class="cs-option-title">微博</div>
                            <div class="cs-option-desc">分享到新浪微博</div>
                        </div>
                        <div class="cs-option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                    
                    <div class="cs-option-item" onclick="shareToQQ()">
                        <div class="cs-option-icon" style="background: linear-gradient(135deg, #12B7F5, #0E9DD0);">
                            <i class="fab fa-qq"></i>
                        </div>
                        <div class="cs-option-info">
                            <div class="cs-option-title">QQ</div>
                            <div class="cs-option-desc">分享到QQ好友或空间</div>
                        </div>
                        <div class="cs-option-arrow">
                            <i class="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 添加到文档中
    document.body.appendChild(shareModal);
    
    // 显示模态框
    showModal('shareModal');
}

// 复制分享链接
function copyShareLink() {
    copyToClipboard(window.location.href);
    hideModal('shareModal');
}

// 分享到微信
function shareToWeChat() {
    // 显示二维码或微信引导界面
    showQRCode();
    hideModal('shareModal');
}

// 分享到微博
function shareToWeibo() {
    const title = '未来感智能沙发 - 内置按摩、语音控制';
    const url = encodeURIComponent(window.location.href);
    const weiboUrl = `https://service.weibo.com/share/share.php?url=${url}&title=${encodeURIComponent(title)}`;
    window.open(weiboUrl, '_blank');
    hideModal('shareModal');
}

// 分享到QQ
function shareToQQ() {
    const title = '未来感智能沙发 - 内置按摩、语音控制';
    const summary = '前沿科技与人体工程学的完美结合，航天级记忆材料智能沙发，限时特惠中！';
    const url = encodeURIComponent(window.location.href);
    const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
    window.open(qqUrl, '_blank');
    hideModal('shareModal');
}

// 复制文本到剪贴板
function copyToClipboard(text) {
    const el = document.createElement('textarea');
    el.value = text;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    
    const selected = document.getSelection().rangeCount > 0 ? 
        document.getSelection().getRangeAt(0) : false;
    
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    if (selected) {
        document.getSelection().removeAllRanges();
        document.getSelection().addRange(selected);
    }
    
    showToast('链接已复制，快去分享吧！');
}

// 显示支持者模态框
function showSupportersModal() {
    showToast('支持者列表功能开发中');
}

// 显示退款政策模态框
function showRefundPolicyModal() {
    // 获取当前可能打开的模态框
    const visibleModal = document.querySelector('.modal.show');
    
    // 如果有其他模态框正在显示，保存它的ID并关闭它
    if (visibleModal) {
        previousModalId = visibleModal.id;
        hideModal(visibleModal.id);
    }
    
    // 显示退款政策模态框
    showModal('refundPolicyModal');
    
    // 获取确认按钮
    const confirmBtn = document.querySelector('#refundPolicyModal .confirm-btn');
    if (confirmBtn) {
        // 移除旧的事件监听器（如果有）
        confirmBtn.removeEventListener('click', handleRefundPolicyConfirm);
        
        // 添加新的事件监听器
        confirmBtn.addEventListener('click', handleRefundPolicyConfirm);
    }
}

// 处理退款政策确认
function handleRefundPolicyConfirm() {
    // 隐藏退款政策模态框
    hideModal('refundPolicyModal');
    
    // 如果有之前的模态框，重新显示它
    if (previousModalId) {
        showModal(previousModalId);
        previousModalId = null; // 重置
    }
}

// 显示取消订单模态框
function showCancelOrderModal() {
    // 获取模态框元素
    const modal = document.getElementById('cancelOrderModal');
    
    // 触觉反馈
    provideTactileFeedback(5);
    
    // 初始化取消原因选择
    initCancelReasonSelect();
    
    // 显示模态框
    showModal(modal);
}

// 初始化取消原因选择
function initCancelReasonSelect() {
    // 获取所有取消原因选项
    const reasonItems = document.querySelectorAll('#cancelOrderModal .cancel-reason-item');
    
    // 给每个选项添加点击事件
    reasonItems.forEach(item => {
        const radio = item.querySelector('.reason-radio');
        
        // 点击整个项目时选中对应的单选按钮
        item.addEventListener('click', function() {
            radio.checked = true;
            
            // 移除所有项目的选中样式
            reasonItems.forEach(i => i.classList.remove('selected'));
            
            // 添加当前项目的选中样式
            this.classList.add('selected');
            
            // 触觉反馈
            provideTactileFeedback(3);
            
            // 如果选择"其他原因"，聚焦文本框
            if (radio.value === '其他') {
                const textarea = document.querySelector('#cancelOrderModal .reason-textarea');
                textarea.focus();
            }
        });
        
        // 如果单选按钮被选中，也添加选中样式
        radio.addEventListener('change', function() {
            if (this.checked) {
                reasonItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            }
        });
    });
    
    // 文本框获取焦点时自动选中"其他原因"
    const textarea = document.querySelector('#cancelOrderModal .reason-textarea');
    const otherRadio = document.querySelector('#cancelOrderModal input[value="其他"]');
    
    textarea.addEventListener('focus', function() {
        if (otherRadio) {
            otherRadio.checked = true;
            
            // 移除所有项目的选中样式
            reasonItems.forEach(i => i.classList.remove('selected'));
            
            // 添加"其他原因"项目的选中样式
            otherRadio.closest('.cancel-reason-item').classList.add('selected');
        }
    });
}

// 处理取消订单
function processCancelOrder() {
    // 获取选中的取消原因
    const selectedReason = document.querySelector('#cancelOrderModal input[name="cancelReason"]:checked');
    const reasonText = document.querySelector('#cancelOrderModal .reason-textarea').value.trim();
    
    // 验证是否选择了取消原因
    if (!selectedReason) {
        showToast('请选择取消原因');
        return;
    }
    
    // 如果选择了"其他原因"但没有填写详细说明
    if (selectedReason.value === '其他' && reasonText === '') {
        showToast('请填写详细的取消原因');
        return;
    }
    
    // 显示提交中动画
    showToast('正在处理您的退款申请...');
    
    // 隐藏模态框
    hideModal('cancelOrderModal');
    
    // 模拟请求处理
    setTimeout(() => {
        // 移除底部支持栏中的取消订单按钮
        const cancelBtn = document.querySelector('.support-actions .cancel-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // 恢复支持按钮文本
        const supportBtn = document.querySelector('.support-actions .support-btn');
        if (supportBtn) {
            supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>立即支持';
        }
        
        // 重置支持信息
        const supportPrice = document.querySelector('.support-price');
        const supportTier = document.querySelector('.support-tier');
        
        if (supportPrice) {
            supportPrice.textContent = '选择档位';
            supportPrice.removeAttribute('data-selected');
        }
        
        if (supportTier) {
            supportTier.textContent = '点击下方按钮选择支持选项';
            supportTier.removeAttribute('data-selected');
        }
        
        // 显示成功信息
        showToast('您的退款申请已提交，退款将在3-7个工作日内处理');
    }, 1500);
}

// 显示支付模态框
function showPaymentModal() {
    // 显示档位选择模态框
    showModal('supportTierModal');
    
    // 初始化档位选择器
    initTierSelector();
    
    // 添加点击动画效果
    const targetElement = event.currentTarget;
    targetElement.classList.add('button-click-effect');
    setTimeout(() => {
        targetElement.classList.remove('button-click-effect');
    }, 300);
}

// 初始化档位选择器
function initTierSelector() {
    const items = document.querySelectorAll('.tier-selector-item');
    let selectedTier = null;
    
    // 清除之前的选择
    items.forEach(item => {
        item.classList.remove('selected');
        
        // 添加点击事件
        item.addEventListener('click', function() {
            // 移除其他项的选中状态
            items.forEach(i => i.classList.remove('selected'));
            
            // 标记当前项为选中
            this.classList.add('selected');
            selectedTier = this;
            
            // 更新确认按钮文本
            updateConfirmButtonText();
            
            // 触觉反馈
            provideTactileFeedback(5);
        });
    });
    
    // 默认选中推荐档位
    const recommendedTier = document.querySelector('.tier-recommended');
    if (recommendedTier) {
        recommendedTier.classList.add('selected');
        selectedTier = recommendedTier;
    }
    
    // 更新确认按钮文本
    updateConfirmButtonText();
}

// 更新确认按钮文本
function updateConfirmButtonText() {
    const selectedTier = document.querySelector('.tier-selector-item.selected');
    const confirmBtn = document.querySelector('.confirm-support-btn');
    
    if (selectedTier && confirmBtn) {
        const tierPrice = selectedTier.getAttribute('data-tier-price');
        const tierName = selectedTier.getAttribute('data-tier-name');
        
        confirmBtn.textContent = `确认支持 ${tierName} - ¥${tierPrice}`;
    }
}

// 确认支持档位
function confirmSupportTier() {
    const selectedTier = document.querySelector('.tier-selector-item.selected');
    
    if (!selectedTier) {
        showToast('请选择一个支持档位');
        return;
    }
    
    // 获取所选档位信息
    const tierId = selectedTier.getAttribute('data-tier-id');
    const tierName = selectedTier.getAttribute('data-tier-name');
    const tierPrice = selectedTier.getAttribute('data-tier-price');
    
    // 隐藏模态框
    hideModal('supportTierModal');
    
    // 显示加载中
    showToast('正在跳转到订单确认页...');
    
    // 将选择的档位信息保存到本地存储中，以便订单确认页面使用
    localStorage.setItem('selectedTierName', tierName);
    localStorage.setItem('selectedTierPrice', tierPrice);
    
    // 模拟页面加载时间
    setTimeout(() => {
        // 直接跳转到订单确认页面
        window.location.href = 'order-confirmation.html';
    }, 500);
}

// 更新底部支持栏信息
function updateSupportBarInfo(name, price) {
    console.log("更新支持栏信息:", { name, price });
    
    const priceEl = document.querySelector('.support-price');
    const tierEl = document.querySelector('.support-tier');
    
    if (priceEl) {
        priceEl.textContent = `¥${price}`;
        priceEl.setAttribute('data-selected', 'true');
        console.log("已更新价格显示:", price);
    } else {
        console.log("未找到价格元素");
    }
    
    if (tierEl) {
        tierEl.textContent = name;
        tierEl.setAttribute('data-selected', 'true');
        console.log("已更新档位名称显示:", name);
    } else {
        console.log("未找到档位名称元素");
    }
    
    // 显示取消订单按钮
    const supportActions = document.querySelector('.support-actions');
    if (supportActions) {
        console.log("找到支持操作容器");
        
        // 检查是否已有取消按钮
        const existingCancelBtn = supportActions.querySelector('.cancel-btn');
        if (!existingCancelBtn) {
            console.log("添加取消订单按钮");
            
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.textContent = '取消订单';
            cancelBtn.onclick = function() { showCancelOrderModal(); };
            
            // 将取消按钮添加到支持按钮前面
            supportActions.insertBefore(cancelBtn, supportActions.firstChild);
            
            // 更新支持按钮文本
            const supportBtn = supportActions.querySelector('.support-btn');
            if (supportBtn) {
                supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>更换档位';
                console.log("已更新支持按钮文本为'更换档位'");
            } else {
                console.log("未找到支持按钮");
            }
        } else {
            console.log("取消订单按钮已存在，无需重复添加");
        }
    } else {
        console.log("未找到支持操作容器");
    }
}

// 显示模态框的通用函数
function showModal(modalId) {
    if (!modalId) return;
    
    // 如果传入的是字符串ID，则获取对应的DOM元素
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    
    if (!modal) {
        console.error(`Modal not found: ${modalId}`);
        return;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 触觉反馈
    provideTactileFeedback(5);
}

// 隐藏模态框
function hideModal(modalId) {
    if (!modalId) return;
    
    // 如果传入的是字符串ID，则获取对应的DOM元素
    const modal = typeof modalId === 'string' ? document.getElementById(modalId) : modalId;
    
    if (!modal) {
        console.error(`Modal not found: ${modalId}`);
        return;
    }
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

// 切换收藏状态
function toggleFavorite(button) {
    // 触觉反馈
    provideTactileFeedback(3);
    
    // 切换active类
    button.classList.toggle('active');
    
    // 切换图标
    const icon = button.querySelector('i');
    if (button.classList.contains('active')) {
        icon.className = 'fas fa-star';
        showToast('已添加到收藏');
    } else {
        icon.className = 'far fa-star';
        showToast('已取消收藏');
    }
}

// 切换测试模式（开启/关闭）
function toggleTestMode() {
    // 获取当前测试模式状态
    const testModeEnabled = localStorage.getItem('testModeEnabled') === 'true';
    
    if (testModeEnabled) {
        // 如果测试模式已启用，则禁用
        localStorage.removeItem('selectedTierName');
        localStorage.removeItem('selectedTierPrice');
        localStorage.removeItem('orderStatus');
        localStorage.removeItem('testModeEnabled');
        
        // 触发状态检查，隐藏取消订单按钮
        checkOrderStatus();
        
        // 显示提示
        showToast('已退出测试模式');
    } else {
        // 如果测试模式未启用，则启用
        localStorage.setItem('selectedTierName', '智能双人沙发套装');
        localStorage.setItem('selectedTierPrice', '5,999');
        localStorage.setItem('orderStatus', 'paid');
        localStorage.setItem('testModeEnabled', 'true');
        
        // 触发状态检查，显示取消订单按钮
        checkOrderStatus();
        
        // 显示提示
        showToast('已启用测试模式，取消订单按钮已显示');
    }
    
    // 触觉反馈
    provideTactileFeedback(10);
}

// 测试取消订单功能（保留此函数用于向下兼容）
function testCancelOrder() {
    // 调用切换测试模式函数
    toggleTestMode();
}

// 触觉反馈函数（优化移动端体验）
function provideTactileFeedback(intensity = 5) {
    if ('vibrate' in navigator) {
        navigator.vibrate(intensity);
    }
}

// 显示提示信息（优化为单例模式，减少DOM操作）
let toastTimeout;
function showToast(message) {
    // 检查是否已经存在toast元素
    let toast = document.querySelector('.toast');
    
    if (toast) {
        // 如果存在，重置淡出计时器并更新内容
        clearTimeout(toastTimeout);
        toast.textContent = message;
    } else {
        // 创建新的toast元素
        toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '80px'; // 位于底部支持栏上方
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        toast.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        toast.style.color = 'white';
        toast.style.padding = '8px 16px';
        toast.style.borderRadius = '20px';
        toast.style.fontSize = '13px';
        toast.style.zIndex = '9999';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // 添加到body中
        document.body.appendChild(toast);
    }
    
    // 短暂延迟后显示
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);
    
    // 3秒后隐藏
    toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
        
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 2500); // 略微缩短显示时间以提高用户体验
}

// 监听标签栏粘性定位状态
function observeTabSticky() {
    const tabContainer = document.querySelector('.detail-tab-container');
    const header = document.querySelector('.header');
    if (!tabContainer || !header) return;
    
    // 创建IntersectionObserver监视标签栏是否粘滞
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    tabContainer.classList.remove('is-sticky');
                } else {
                    tabContainer.classList.add('is-sticky');
                }
            });
        },
        { 
            threshold: 0,
            rootMargin: `-${header.offsetHeight + 10}px 0px 0px 0px`
        }
    );
    
    // 观察标签栏上方的元素
    const productInfo = document.querySelector('.product-info-section');
    if (productInfo) {
        observer.observe(productInfo);
    }
}

// 初始化图片懒加载
function initLazyLoad() {
    // 使用浏览器原生懒加载
    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            // 图片加载前添加骨架屏效果
            if (!img.classList.contains('skeleton')) {
                img.classList.add('skeleton');
            }
            
            // 图片加载完成后移除骨架屏
            img.onload = function() {
                img.classList.remove('skeleton');
            };
        });
    } else {
        // 回退方案：使用IntersectionObserver实现懒加载
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.hasAttribute('loading')) {
                            // 确保图片有骨架屏效果
                            if (!img.classList.contains('skeleton')) {
                                img.classList.add('skeleton');
                            }
                            
                            // 替换src属性加载图片
                            const dataSrc = img.getAttribute('data-src') || img.src;
                            img.src = dataSrc;
                            
                            // 图片加载完成后移除骨架屏
                            img.onload = function() {
                                img.classList.remove('skeleton');
                            };
                            
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
}

// 节流函数，提高滚动性能
function throttleScroll(callback, delay) {
    let lastCall = 0;
    return function() {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
            return;
        }
        lastCall = now;
        return callback.apply(this, arguments);
    };
}

// 处理滚动
function handleScroll() {
    const scrollPosition = window.scrollY || window.pageYOffset;
    const tabContainer = document.querySelector('.detail-tab-container');
    
    if (!tabContainer) return;
    
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    
    // 隐藏/显示回到顶部按钮
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        if (scrollPosition > window.innerHeight) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    }
    
    // 处理标签吸顶效果
    const tabContainerRect = tabContainer.getBoundingClientRect();
    if (tabContainerRect.top <= headerHeight) {
        tabContainer.classList.add('sticky');
    } else {
        tabContainer.classList.remove('sticky');
    }
    
    // 如果正在标签切换中，不处理滚动同步
    if (isTabbing) return;
    
    // 根据滚动位置同步标签状态
    const sections = ['projectDetails', 'supportTiers', 'projectUpdates', 'comments'];
    
    for (let i = 0; i < sections.length; i++) {
        const sectionId = sections[i];
        const section = document.getElementById(sectionId);
        
        if (!section) continue;
        
        const sectionTop = section.offsetTop;
        
        // 检查当前滚动位置是否在这个区域内
        if (scrollPosition >= sectionTop - headerHeight - tabContainer.offsetHeight - 20) {
            // 获取对应的标签索引
            const tabItems = document.querySelectorAll('.detail-tab-item');
            for (let j = 0; j < tabItems.length; j++) {
                if (tabItems[j].getAttribute('data-target') === sectionId) {
                    updateActiveTabByIndex(j);
                    break;
                }
            }
            break;
        }
    }
}

// 初始化可折叠模块
function initCollapsibleModules() {
    const collapsibleModules = document.querySelectorAll('.product-module.collapsible');
    
    collapsibleModules.forEach(module => {
        const header = module.querySelector('.module-header');
        if (!header) return;
        
        header.addEventListener('click', () => {
            // 切换折叠状态
            module.classList.toggle('collapsed');
            
            // 触觉反馈
            provideTactileFeedback(5);
        });
    });
}

// 初始化添加模块按钮
function initAddModuleButton() {
    const addModuleBtn = document.getElementById('addModuleBtn');
    if (!addModuleBtn) return;
    
    addModuleBtn.addEventListener('click', function() {
        showAddModuleModal();
    });
}

// 显示添加模块的模态框
function showAddModuleModal() {
    // 创建模块类型列表
    const moduleTypes = [
        { id: 'text', icon: 'fa-align-left', name: '文本模块' },
        { id: 'image', icon: 'fa-image', name: '图片模块' },
        { id: 'specs', icon: 'fa-list', name: '规格参数' },
        { id: 'features', icon: 'fa-star', name: '产品特点' },
        { id: 'video', icon: 'fa-video', name: '视频模块' },
        { id: 'faq', icon: 'fa-question-circle', name: '常见问题' }
    ];
    
    // 创建模态框HTML
    let modalHtml = `
    <div class="modal" id="addModuleModal">
        <div class="modal-content">
            <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 class="font-semibold">添加内容模块</h3>
                <button class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100" onclick="hideModal('addModuleModal')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="p-4">
                <p class="text-sm text-gray-400 mb-4">选择要添加的模块类型：</p>
                <div class="grid grid-cols-2 gap-3">
    `;
    
    // 添加模块类型选项
    moduleTypes.forEach(type => {
        modalHtml += `
        <div class="module-type-item" data-type="${type.id}" onclick="addNewModule('${type.id}')">
            <i class="fas ${type.icon} text-brand-primary"></i>
            <span>${type.name}</span>
        </div>
        `;
    });
    
    modalHtml += `
                </div>
            </div>
        </div>
    </div>
    `;
    
    // 添加模态框到DOM
    if (!document.getElementById('addModuleModal')) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer.firstElementChild);
        
        // 添加模块类型项样式
        const style = document.createElement('style');
        style.textContent = `
            .module-type-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 1rem;
                background: rgba(25, 29, 43, 0.6);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                gap: 8px;
            }
            .module-type-item:hover {
                background: rgba(25, 29, 43, 0.8);
                transform: translateY(-2px);
            }
            .module-type-item i {
                font-size: 24px;
                margin-bottom: 5px;
            }
            .module-type-item span {
                font-size: 12px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }
    
    // 显示模态框
    showModal(document.getElementById('addModuleModal'));
}

// 添加新模块
function addNewModule(moduleType) {
    // 隐藏模态框
    hideModal('addModuleModal');
    
    // 生成唯一ID
    const moduleId = 'module_' + Date.now();
    
    // 创建新模块HTML
    let newModuleHtml = '';
    
    switch (moduleType) {
        case 'text':
            newModuleHtml = createTextModule(moduleId);
            break;
        case 'image':
            newModuleHtml = createImageModule(moduleId);
            break;
        case 'specs':
            newModuleHtml = createSpecsModule(moduleId);
            break;
        case 'features':
            newModuleHtml = createFeaturesModule(moduleId);
            break;
        case 'video':
            newModuleHtml = createVideoModule(moduleId);
            break;
        case 'faq':
            newModuleHtml = createFaqModule(moduleId);
            break;
        default:
            newModuleHtml = createTextModule(moduleId);
    }
    
    // 添加到商品详情容器
    const addButtonContainer = document.querySelector('.add-module-btn-container');
    if (addButtonContainer) {
        // 创建临时容器
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = newModuleHtml;
        
        // 插入到"添加模块"按钮前
        addButtonContainer.parentNode.insertBefore(tempContainer.firstElementChild, addButtonContainer);
        
        // 应用可折叠功能
        initCollapsibleModules();
        
        // 显示成功提示
        showToast(`已添加${getModuleTypeName(moduleType)}`);
    }
}

// 获取模块类型名称
function getModuleTypeName(moduleType) {
    const typeNames = {
        'text': '文本模块',
        'image': '图片模块',
        'specs': '规格参数',
        'features': '产品特点',
        'video': '视频模块',
        'faq': '常见问题'
    };
    
    return typeNames[moduleType] || '新模块';
}

// 创建文本模块
function createTextModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-align-left text-brand-primary mr-2"></i>
                文本模块
            </h3>
        </div>
        <div class="module-content">
            <p class="text-sm text-gray-300 leading-relaxed mb-3">
                点击此处编辑文本内容...
            </p>
        </div>
    </div>
    `;
}

// 创建图片模块
function createImageModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-image text-brand-primary mr-2"></i>
                图片模块
            </h3>
        </div>
        <div class="module-content">
            <div class="image-placeholder flex items-center justify-center bg-gray-800 rounded-lg" style="height: 200px;">
                <i class="fas fa-image text-gray-500 text-4xl"></i>
                <span class="ml-2 text-gray-500">点击此处添加图片</span>
            </div>
        </div>
    </div>
    `;
}

// 创建规格参数模块
function createSpecsModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-list text-brand-primary mr-2"></i>
                规格参数
            </h3>
        </div>
        <div class="module-content">
            <div class="tech-spec-grid">
                <div class="tech-spec-item">
                    <div class="tech-spec-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="tech-spec-content">
                        <h4>规格名称</h4>
                        <p>规格详细内容描述</p>
                    </div>
                </div>
                <div class="tech-spec-item">
                    <div class="tech-spec-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <div class="tech-spec-content">
                        <h4>规格名称</h4>
                        <p>规格详细内容描述</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// 创建产品特点模块
function createFeaturesModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-star text-brand-primary mr-2"></i>
                产品特点
            </h3>
        </div>
        <div class="module-content">
            <div class="tech-highlights">
                <div class="tech-highlight-card">
                    <div class="tech-highlight-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h4>特点标题</h4>
                    <p>特点详细内容描述</p>
                </div>
                <div class="tech-highlight-card">
                    <div class="tech-highlight-icon">
                        <i class="fas fa-plus"></i>
                    </div>
                    <h4>特点标题</h4>
                    <p>特点详细内容描述</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

// 创建视频模块
function createVideoModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-video text-brand-primary mr-2"></i>
                视频模块
            </h3>
        </div>
        <div class="module-content">
            <div class="video-placeholder flex flex-col items-center justify-center bg-gray-800 rounded-lg" style="height: 240px;">
                <i class="fas fa-video text-gray-500 text-4xl mb-2"></i>
                <span class="text-gray-500">点击此处添加视频</span>
                <span class="text-xs text-gray-600 mt-1">支持优酷、腾讯视频、哔哩哔哩等平台视频嵌入</span>
            </div>
        </div>
    </div>
    `;
}

// 创建FAQ模块
function createFaqModule(id) {
    return `
    <div id="${id}" class="product-module mb-6 collapsible">
        <div class="module-header mb-3">
            <h3 class="text-md font-semibold flex items-center">
                <i class="fas fa-question-circle text-brand-primary mr-2"></i>
                常见问题
            </h3>
        </div>
        <div class="module-content">
            <div class="faq-container">
                <div class="faq-item">
                    <div class="faq-question">
                        <span>问题标题</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        问题回答内容
                    </div>
                </div>
                <div class="faq-item">
                    <div class="faq-question">
                        <span>问题标题</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="faq-answer">
                        问题回答内容
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
}

// 添加浮动导航按钮功能
function initFloatNav() {
    const floatNavBtn = document.getElementById('floatNavBtn');
    const floatNavIcon = floatNavBtn.querySelector('.float-nav-icon');
    const floatNavMenu = document.getElementById('floatNavMenu');
    const floatNavItems = floatNavMenu.querySelectorAll('.float-nav-item');
    const detailTabs = document.querySelectorAll('.detail-tab-item');
    
    // 标签滚动位置
    const tabContainer = document.querySelector('.detail-tab-container');
    let tabsTop = tabContainer ? tabContainer.offsetTop : 0;
    
    // 显示/隐藏菜单
    floatNavIcon.addEventListener('click', function() {
        floatNavMenu.classList.toggle('show');
    });
    
    // 点击其他地方关闭菜单
    document.addEventListener('click', function(e) {
        if (!floatNavBtn.contains(e.target)) {
            floatNavMenu.classList.remove('show');
        }
    });
    
    // 监听滚动，控制浮动按钮显示/隐藏
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 当滚动超过标签导航位置时显示浮动按钮
        if (scrollTop > tabsTop + 100) {
            floatNavBtn.classList.add('visible');
        } else {
            floatNavBtn.classList.remove('visible');
        }
        
        // 更新当前激活的标签
        updateActiveFloatNavItem();
        
        lastScrollTop = scrollTop;
    });
    
    // 点击浮动导航项切换标签
    floatNavItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            // 激活对应的主导航标签
            detailTabs.forEach(tab => {
                if (tab.getAttribute('data-target') === targetId) {
                    tab.click();
                }
            });
            
            // 平滑滚动到内容区域
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // 如果是在移动设备上，滚动到内容开始位置
                if (window.innerWidth < 768) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 60,
                        behavior: 'smooth'
                    });
                }
            }
            
            // 关闭菜单
            floatNavMenu.classList.remove('show');
        });
    });
    
    // 更新浮动导航中的激活项
    function updateActiveFloatNavItem() {
        // 获取当前激活的主导航标签
        const activeMainTab = document.querySelector('.detail-tab-item.active');
        if (activeMainTab) {
            const activeTarget = activeMainTab.getAttribute('data-target');
            
            // 更新浮动导航中的激活项
            floatNavItems.forEach(item => {
                if (item.getAttribute('data-target') === activeTarget) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
        }
    }
    
    // 初始化激活状态
    updateActiveFloatNavItem();
}

// CSS为浮动按钮添加了默认隐藏状态，添加对应样式
document.head.insertAdjacentHTML('beforeend', `
<style>
.float-nav-btn {
    opacity: 0;
    transform: scale(0.8);
    pointer-events: none;
    transition: all 0.3s ease;
}
.float-nav-btn.visible {
    opacity: 1;
    transform: scale(1);
    pointer-events: auto;
}
</style>
`);

// 显示客服功能
function showCustomerService() {
    // 触觉反馈
    provideTactileFeedback(3);
    
    // 创建客服模态框
    let csModal = document.getElementById('customerServiceModal');
    
    // 如果模态框不存在，则创建一个
    if (!csModal) {
        csModal = document.createElement('div');
        csModal.id = 'customerServiceModal';
        csModal.className = 'modal';
        
        csModal.innerHTML = `
            <div class="modal-content customer-service-modal">
                <div class="modal-header flex items-center justify-between">
                    <h3 class="modal-title flex items-center">
                        <i class="fas fa-headset text-brand-primary mr-2"></i>联系客服
                    </h3>
                    <button class="modal-close-btn" onclick="hideModal('customerServiceModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="cs-options">
                        <a href="tel:4001234567" class="cs-option-item">
                            <div class="cs-option-icon">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <div class="cs-option-info">
                                <div class="cs-option-title">电话咨询</div>
                                <div class="cs-option-desc">400-123-4567</div>
                            </div>
                            <div class="cs-option-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </a>
                        
                        <div class="cs-option-item" onclick="showOnlineChat()">
                            <div class="cs-option-icon bg-gradient-green">
                                <i class="fas fa-comment-dots"></i>
                            </div>
                            <div class="cs-option-info">
                                <div class="cs-option-title">在线客服</div>
                                <div class="cs-option-desc">工作时间: 9:00-22:00</div>
                            </div>
                            <div class="cs-option-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        
                        <div class="cs-option-item" onclick="showQRCode()">
                            <div class="cs-option-icon bg-gradient-yellow">
                                <i class="fab fa-weixin"></i>
                            </div>
                            <div class="cs-option-info">
                                <div class="cs-option-title">微信咨询</div>
                                <div class="cs-option-desc">扫码添加客服微信</div>
                            </div>
                            <div class="cs-option-arrow">
                                <i class="fas fa-chevron-right"></i>
                            </div>
                        </div>
                        
                
                    </div>
                    
                    <div class="cs-faq mt-4">
                        <div class="cs-faq-title">常见问题</div>
                        <div class="cs-faq-list">
                            <div class="cs-faq-item" onclick="toggleFAQ(this)">
                                <div class="cs-faq-question">
                                    <span>如何跟踪我的众筹订单？</span>
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="cs-faq-answer">
                                    您可以在"个人中心-我的订单"页面中查看您的众筹订单状态和发货信息。我们也会在项目取得重要进展时，通过短信或邮件通知您。
                                </div>
                            </div>
                            <div class="cs-faq-item" onclick="toggleFAQ(this)">
                                <div class="cs-faq-question">
                                    <span>众筹产品有保修吗？</span>
                                    <i class="fas fa-chevron-down"></i>
                                </div>
                                <div class="cs-faq-answer">
                                    是的，我们的智能沙发产品提供2年的免费保修服务，覆盖所有非人为损坏的功能问题。电子部件和智能模块享有1年的额外保修。
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(csModal);
    }
    
    // 显示模态框
    showModal(csModal);
}

// 显示在线聊天
function showOnlineChat() {
    hideModal('customerServiceModal');
    showToast('正在连接在线客服...', 2000);
    
    // 这里可以接入实际的在线客服系统
    setTimeout(() => {
        showToast('客服小欧为您服务，请问有什么可以帮助您的？');
    }, 2000);
}

// 显示微信二维码
function showQRCode() {
    // 创建二维码模态框
    let qrModal = document.getElementById('qrCodeModal');
    
    // 如果模态框不存在，则创建一个
    if (!qrModal) {
        qrModal = document.createElement('div');
        qrModal.id = 'qrCodeModal';
        qrModal.className = 'modal';
        
        qrModal.innerHTML = `
            <div class="modal-content max-h-90vh" style="max-width: 320px;">
                <div class="modal-header flex items-center justify-between">
                    <h3 class="modal-title flex items-center">
                        <i class="fab fa-weixin text-brand-primary mr-2"></i>微信扫码分享
                    </h3>
                    <button class="modal-close-btn" onclick="hideModal('qrCodeModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body text-center">
                    <p class="text-sm text-gray-400 mb-4">打开微信扫一扫，扫描下方二维码</p>
                    
                    <!-- 二维码图片占位符 -->
                    <div class="qr-code-container mx-auto" style="width: 200px; height: 200px; background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; border: 1px solid rgba(0, 229, 255, 0.2); border-radius: 8px;">
                        <!-- 实际项目中替换为真实二维码图片 -->
                        <i class="fas fa-qrcode text-5xl text-gray-500"></i>
                    </div>
                    
                    <p class="text-sm text-gray-400">或截图保存，在微信中打开扫一扫<br>从相册中选择二维码图片</p>
                    
                    <div class="modal-footer mt-4">
                        <button class="confirm-btn" onclick="hideModal('qrCodeModal')">
                            我知道了
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(qrModal);
    }
    
    // 显示模态框
    showModal('qrCodeModal');
}

// 切换FAQ问答显示
function toggleFAQ(element) {
    const answer = element.querySelector('.cs-faq-answer');
    const icon = element.querySelector('.cs-faq-question i');
    
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
    
    // 触觉反馈
    provideTactileFeedback(2);
}

// 显示讨论模态框
function showDiscussionModal() {
    // 获取模态框元素
    const modal = document.getElementById('discussionModal');
    if (!modal) return;
    
    // 初始化讨论内容计数器
    initDiscussionCounter();
    
    // 显示模态框
    showModal(modal);
    
    // 触觉反馈
    provideTactileFeedback(5);
}

// 初始化讨论内容计数器
function initDiscussionCounter() {
    const discussionContent = document.getElementById('discussionContent');
    const discussionLength = document.getElementById('discussionLength');
    
    if (!discussionContent || !discussionLength) return;
    
    // 重置计数器和内容
    discussionContent.value = '';
    discussionLength.textContent = '0';
    
    // 添加内容变化监听
    discussionContent.addEventListener('input', function() {
        const length = this.value.length;
        discussionLength.textContent = length;
        
        // 超出500字符限制
        if (length > 500) {
            this.value = this.value.substring(0, 500);
            discussionLength.textContent = '500';
            
            // 提示用户
            showToast('讨论内容最多500字');
        }
    });
}

// 图片预览功能
function previewImage(input) {
    if (!input.files || !input.files[0]) return;
    
    // 检查已上传图片数量
    const imagePreviewBoxes = document.querySelectorAll('.image-preview-box');
    if (imagePreviewBoxes.length >= 3) {
        showToast('最多只能上传3张图片');
        return;
    }
    
    // 检查文件大小
    const file = input.files[0];
    if (file.size > 5 * 1024 * 1024) { // 5MB限制
        showToast('图片大小不能超过5MB');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        // 创建图片预览元素
        const previewBox = document.createElement('div');
        previewBox.className = 'image-preview-box';
        
        previewBox.innerHTML = `
            <img src="${e.target.result}" alt="图片预览">
            <div class="remove-image" onclick="removeImage(this)">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // 插入到上传按钮前面
        const uploadBox = document.querySelector('.upload-image-box');
        uploadBox.parentNode.insertBefore(previewBox, uploadBox);
        
        // 如果已有3张图片，隐藏上传按钮
        if (document.querySelectorAll('.image-preview-box').length >= 3) {
            uploadBox.style.display = 'none';
        }
    };
    
    reader.readAsDataURL(file);
}

// 移除图片预览
function removeImage(element) {
    const previewBox = element.closest('.image-preview-box');
    if (previewBox) {
        previewBox.remove();
        
        // 重新显示上传按钮
        const uploadBox = document.querySelector('.upload-image-box');
        if (uploadBox) {
            uploadBox.style.display = 'flex';
        }
    }
    
    // 触觉反馈
    provideTactileFeedback(3);
}

// 提交讨论
function submitDiscussion() {
    // 获取讨论内容
    const discussionContent = document.getElementById('discussionContent').value.trim();
    
    // 获取是否匿名
    const isAnonymous = document.getElementById('anonymousComment').checked;
    
    // 验证内容
    if (discussionContent.length === 0) {
        showToast('请输入讨论内容');
        return;
    }
    
    // 收集图片数据
    const images = [];
    document.querySelectorAll('.image-preview-box img').forEach(img => {
        images.push(img.src);
    });
    
    // 显示提交中提示
    showToast('讨论提交中...');
    
    // 隐藏模态框
    hideModal('discussionModal');
    
    // 模拟提交过程
    setTimeout(() => {
        // 创建新的讨论元素
        const discussionList = document.querySelector('#comments .space-y-4');
        
        if (discussionList) {
            // 获取用户信息
            const userAvatar = 'https://randomuser.me/api/portraits/men/92.jpg'; // 示例头像
            const userName = isAnonymous ? '匿名用户' : '当前用户';
            
            // 创建讨论HTML
            const discussionHTML = `
                <div class="comment-item animate__animated animate__fadeIn">
                    <div class="flex mb-2">
                        <img src="${userAvatar}" class="comment-avatar" alt="讨论用户">
                        <div class="flex-1">
                            <div class="flex justify-between">
                                <div class="font-medium">${userName}</div>
                                <div class="text-xs text-gray-500">刚刚</div>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-300 mb-2">
                        ${discussionContent}
                    </div>
                    ${images.length > 0 ? `
                    <div class="flex gap-2 mb-2">
                        ${images.map(img => `<img src="${img}" class="w-16 h-16 object-cover rounded" alt="讨论图片">`).join('')}
                    </div>
                    ` : ''}
                    <div class="flex justify-between items-center comment-actions">
                        <div class="flex items-center">
                            <button class="text-xs text-gray-500 flex items-center">
                                <i class="far fa-thumbs-up mr-1"></i>
                                <span>0</span>
                            </button>
                            <button class="text-xs text-gray-500 flex items-center ml-4">
                                <i class="far fa-comment mr-1"></i>
                                <span>回复</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // 将新讨论添加到讨论列表顶部
            discussionList.insertAdjacentHTML('afterbegin', discussionHTML);
            
            // 更新讨论数量
            updateDiscussionCount();
        }
        
        // 显示成功提示
        showToast('讨论发表成功');
    }, 1500);
}

// 更新讨论数量
function updateDiscussionCount() {
    // 获取当前讨论数量
    const discussions = document.querySelectorAll('#comments .comment-item');
    const discussionCount = discussions.length;
    
    // 更新讨论标题
    const discussionTitle = document.querySelector('#comments .gradient-title');
    if (discussionTitle) {
        discussionTitle.textContent = `讨论(${discussionCount})`;
    }
    
    // 更新导航栏中的讨论数量
    const navDiscussionCount = document.querySelector('.detail-tab-item[data-target="comments"] .discussion-count');
    if (navDiscussionCount) {
        navDiscussionCount.textContent = discussionCount;
    }
    
    // 更新浮动导航中的讨论数量
    const floatDiscussionCount = document.querySelector('.float-nav-item[data-target="comments"] .float-discussion-count');
    if (floatDiscussionCount) {
        floatDiscussionCount.textContent = discussionCount;
    }
}

// 初始化视频播放器
function initVideoPlayer() {
    const video = document.getElementById('productVideo');
    if (!video) return;
    
    const playPauseBtn = document.querySelector('.play-pause-btn i');
    const muteBtn = document.querySelector('.mute-btn i');
    const progressBar = document.querySelector('.video-progress-bar');
    const videoSlide = document.querySelector('.video-slide');
    const videoOverlay = document.querySelector('.video-overlay');
    const swiperContainer = document.querySelector('.swiper-container');
    
    // 初始化轮播指示器事件
    const indicators = document.querySelectorAll('.swiper-pagination-bullet');
    
    // 第一个指示器（视频轮播项）的点击事件
    if (indicators.length > 0) {
        indicators[0].addEventListener('click', function() {
            // 添加video-mode类
            if (swiperContainer) {
                swiperContainer.classList.add('video-mode');
            }
            
            // 如果视频已经加载，自动播放
            if (video.readyState >= 3) {
                videoSlide.classList.add('playing');
                video.play();
                if (playPauseBtn) {
                    playPauseBtn.className = 'fas fa-pause';
                }
                if (videoOverlay) {
                    videoOverlay.style.display = 'none';
                }
            }
        });
        
        // 其他指示器的点击事件（非视频轮播项）
        for (let i = 1; i < indicators.length; i++) {
            indicators[i].addEventListener('click', function() {
                // 移除video-mode类
                if (swiperContainer) {
                    swiperContainer.classList.remove('video-mode');
                }
                
                // 暂停视频
                if (video && !video.paused) {
                    video.pause();
                    if (playPauseBtn) {
                        playPauseBtn.className = 'fas fa-play';
                    }
                    if (videoOverlay) {
                        videoOverlay.style.display = 'flex';
                    }
                    videoSlide.classList.remove('playing');
                }
            });
        }
    }
    
    // 视频加载完成后的事件
    video.addEventListener('loadedmetadata', function() {
        // 初始化视频默认状态
        video.volume = 1;
        video.muted = false;
        
        // 如果第一个轮播项是active的，添加video-mode类
        if (indicators.length > 0 && indicators[0].classList.contains('swiper-pagination-bullet-active')) {
            if (swiperContainer) {
                swiperContainer.classList.add('video-mode');
            }
        }
    });
    
    // 视频播放时更新进度条
    video.addEventListener('timeupdate', function() {
        if (progressBar) {
            const percentage = (video.currentTime / video.duration) * 100;
            progressBar.style.width = percentage + '%';
        }
    });
    
    // 视频结束时重置
    video.addEventListener('ended', function() {
        video.currentTime = 0;
        if (playPauseBtn) {
            playPauseBtn.className = 'fas fa-play';
        }
        if (videoOverlay) {
            videoOverlay.style.display = 'flex';
        }
        videoSlide.classList.remove('playing');
    });
    
    // 轮播图滑动事件，暂停视频
    try {
        // 检查Swiper是否已定义
        if (typeof Swiper !== 'undefined') {
            const swiper = new Swiper('.swiper-container', {
                on: {
                    slideChange: function() {
                        if (video && !video.paused) {
                            video.pause();
                            if (playPauseBtn) {
                                playPauseBtn.className = 'fas fa-play';
                            }
                            if (videoOverlay) {
                                videoOverlay.style.display = 'flex';
                            }
                            videoSlide.classList.remove('playing');
                        }
                        
                        // 如果不是第一张轮播图，移除video-mode类
                        const activeIndex = this.activeIndex;
                        if (activeIndex !== 0 && swiperContainer) {
                            swiperContainer.classList.remove('video-mode');
                        } else if (activeIndex === 0 && swiperContainer) {
                            swiperContainer.classList.add('video-mode');
                        }
                    }
                }
            });
        } else {
            console.log("Swiper库未加载，跳过轮播图初始化");
            // 使用简单的滑动逻辑替代
            if (swiperContainer) {
                const wrapper = swiperContainer.querySelector('.swiper-wrapper');
                const slides = swiperContainer.querySelectorAll('.swiper-slide');
                const pagination = swiperContainer.querySelector('.swiper-pagination');
                
                if (wrapper && slides.length && pagination) {
                    let currentSlide = 0;
                    
                    // 更新轮播
                    function updateSlide() {
                        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
                        
                        // 更新指示器
                        const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
                        bullets.forEach((bullet, index) => {
                            if (index === currentSlide) {
                                bullet.classList.add('swiper-pagination-bullet-active');
                            } else {
                                bullet.classList.remove('swiper-pagination-bullet-active');
                            }
                        });
                    }
                    
                    // 添加点击事件到指示器
                    const bullets = pagination.querySelectorAll('.swiper-pagination-bullet');
                    bullets.forEach((bullet, index) => {
                        bullet.addEventListener('click', function() {
                            currentSlide = index;
                            updateSlide();
                        });
                    });
                }
            }
        }
    } catch (e) {
        console.error("初始化轮播图时出错:", e);
    }
}

// 切换视频播放/暂停
function toggleVideo() {
    const video = document.getElementById('productVideo');
    const videoSlide = document.querySelector('.video-slide');
    const playPauseBtn = document.querySelector('.play-pause-btn i');
    const videoOverlay = document.querySelector('.video-overlay');
    const swiperContainer = document.querySelector('.swiper-container');
    
    if (!video) return;
    
    if (video.paused) {
        video.play().then(() => {
            videoSlide.classList.add('playing');
            playPauseBtn.className = 'fas fa-pause';
            
            // 添加video-mode类
            if (swiperContainer) {
                swiperContainer.classList.add('video-mode');
            }
            
            // 隐藏视频覆盖层
            if (videoOverlay) {
                videoOverlay.style.display = 'none';
            }
        }).catch(error => {
            // 处理自动播放受限情况
            showToast('请点击播放按钮开始播放');
            console.error('视频播放失败:', error);
        });
    } else {
        video.pause();
        videoSlide.classList.remove('playing');
        playPauseBtn.className = 'fas fa-play';
        
        // 显示视频覆盖层
        if (videoOverlay) {
            videoOverlay.style.display = 'flex';
        }
    }
}

// 切换静音
function toggleMute() {
    const video = document.getElementById('productVideo');
    const muteBtn = document.querySelector('.mute-btn i');
    
    if (!video) return;
    
    video.muted = !video.muted;
    
    if (video.muted) {
        muteBtn.className = 'fas fa-volume-mute';
    } else {
        muteBtn.className = 'fas fa-volume-up';
    }
}

// 切换全屏
function toggleFullscreen() {
    const video = document.getElementById('productVideo');
    const swiper = document.querySelector('.swiper-container');
    
    if (!video) return;
    
    if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }
        
        // 进入全屏时，添加video-mode类
        if (swiper) {
            swiper.classList.add('video-mode');
            // 添加全屏状态类
            swiper.classList.add('fullscreen');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        
        // 退出全屏时，如果第一个轮播项不是active的，则移除video-mode类
        if (swiper) {
            // 检查第一个轮播项是否激活
            const isFirstSlideActive = document.querySelector('.swiper-pagination-bullet:first-child').classList.contains('swiper-pagination-bullet-active');
            if (!isFirstSlideActive) {
                swiper.classList.remove('video-mode');
            }
            // 移除全屏状态类
            swiper.classList.remove('fullscreen');
        }
    }
    
    // 监听全屏变化事件
    function handleFullscreenChange() {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
        const fullscreenBtn = document.querySelector('.fullscreen-btn i');
        
        if (fullscreenBtn) {
            if (isFullscreen) {
                fullscreenBtn.className = 'fas fa-compress';
            } else {
                fullscreenBtn.className = 'fas fa-expand';
                // 退出全屏时，如果不是第一个轮播项，移除video-mode类
                if (swiper) {
                    const isFirstSlideActive = document.querySelector('.swiper-pagination-bullet:first-child').classList.contains('swiper-pagination-bullet-active');
                    if (!isFirstSlideActive) {
                        swiper.classList.remove('video-mode');
                    }
                    swiper.classList.remove('fullscreen');
                }
            }
        }
        
        // 如果退出全屏且视频在播放，继续播放
        if (!isFullscreen && !video.paused) {
            video.play();
        }
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);
    
    // 当退出全屏时移除事件监听器
    if (!document.fullscreenElement) {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    }
}

// 检查用户订单状态
function checkOrderStatus() {
    // 从localStorage获取订单信息
    const tierName = localStorage.getItem('selectedTierName');
    const tierPrice = localStorage.getItem('selectedTierPrice');
    const orderStatus = localStorage.getItem('orderStatus');
    const testModeEnabled = localStorage.getItem('testModeEnabled');
    
    console.log("检查订单状态:", {
        tierName,
        tierPrice,
        orderStatus,
        testModeEnabled
    });
    
    // 清除已有的取消订单按钮
    const existingCancelBtn = document.querySelector('.support-actions .cancel-btn');
    if (existingCancelBtn) {
        existingCancelBtn.remove();
        console.log("移除已存在的取消订单按钮");
    }
    
    // 恢复支持按钮默认文本
    const supportBtn = document.querySelector('.support-actions .support-btn');
    if (supportBtn) {
        if (projectStatus === "upcoming") {
            supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>抢先支持';
        } else {
            supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>立即支持';
        }
        console.log("已恢复支持按钮文本");
    }
    
    // 只有在测试模式开启或用户已有订单的情况下，才显示取消订单按钮
    if ((tierName && tierPrice && orderStatus === 'paid') || testModeEnabled === 'true') {
        // 更新底部支持栏信息
        updateSupportBarInfo(tierName || '智能双人沙发套装', tierPrice || '5,999');
        
        console.log("用户已支付或处于测试模式，显示取消订单按钮");
    } else {
        console.log("用户未支付且未开启测试模式，不显示取消订单按钮");
    }
}

// 初始化收藏功能
function initLikeFeature() {
    console.log("初始化收藏功能...");
    // 使用正确的选择器
    const favoriteButton = document.querySelector('.star-btn');
    
    if (favoriteButton) {
        console.log("找到了收藏按钮：", favoriteButton);
        const icon = favoriteButton.querySelector('i');
        const textSpan = favoriteButton.querySelector('span');
        
        // 检查项目是否为预热项目
        if (projectStatus === "upcoming") {
            console.log("预热项目 - 更新收藏按钮文本");
            textSpan.textContent = "收藏";
            
            // 添加点击事件
            favoriteButton.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止默认行为
                e.stopPropagation(); // 阻止事件冒泡
                
                if (icon.classList.contains('far')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.classList.add('text-yellow-500');
                    showToast("已添加到我的收藏");
                    // 这里可以添加API调用记录用户收藏
                } else {
                    icon.classList.remove('fas');
                    icon.classList.remove('text-yellow-500');
                    icon.classList.add('far');
                    showToast("已从我的收藏中移除");
                    // 这里可以添加API调用记录用户取消收藏
                }
                
                return false;
            });
        }
    } else {
        console.error("找不到收藏按钮元素(.star-btn)");
    }
}

// 获取URL中的项目ID
function getProjectIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '1';
}

// 切换项目点赞状态
function toggleProjectLike(button) {
    const projectId = getProjectIdFromUrl();
    const isLiked = button.classList.contains('liked');
    
    // 更新按钮UI
    if (isLiked) {
        button.classList.remove('liked');
        button.querySelector('span').textContent = '点赞支持';
        showToast('已取消点赞');
    } else {
        button.classList.add('liked');
        button.querySelector('span').textContent = '已点赞';
        
        // 添加爱心动画效果
        const heart = button.querySelector('i');
        heart.classList.add('heart-pulse');
        setTimeout(() => {
            heart.classList.remove('heart-pulse');
        }, 800);
        
        showToast('感谢您的点赞支持！');
    }
    
    // 更新本地存储中的点赞状态
    localStorage.setItem(`project_${projectId}_liked`, !isLiked);
    
    // 获取当前点赞数
    const likeCountEl = document.getElementById('likeCount');
    if (likeCountEl) {
        let likeCount = parseInt(likeCountEl.textContent) || 0;
        
        // 更新点赞数量
        if (!isLiked) {
            likeCount += 1;
        } else if (likeCount > 0) {
            likeCount -= 1;
        }
        
        // 更新显示的点赞数
        likeCountEl.textContent = `${likeCount}人已点赞`;
    }
    
    // 在实际应用中，这里应该将点赞数据发送到服务器保存
    // API.saveProjectLike(projectId, !isLiked);
}

// 检查项目状态
function checkProjectStatus() {
    console.log("检查项目状态...");
    
    // 首先从URL参数中检查是否有强制预热模式或众筹中模式
    const urlParams = new URLSearchParams(window.location.search);
    const forcedPreheating = urlParams.get('preheating');
    const forcedOngoing = urlParams.get('ongoing');
    
    console.log("URL参数检查 - 强制预热模式:", forcedPreheating, "强制众筹中模式:", forcedOngoing);
    
    if (forcedPreheating === 'true') {
        console.log("检测到强制预热模式参数，设置状态为upcoming");
        projectStatus = "upcoming";
        console.log("项目状态已设置为:", projectStatus);
        updateProjectStatusUI();
        updateSupportBarForPreheating();
        addPreheatingCountdown();
        return;
    } else if (forcedOngoing === 'true') {
        console.log("检测到强制众筹中模式参数，设置状态为ongoing");
        projectStatus = "ongoing";
        console.log("项目状态已设置为:", projectStatus);
        updateProjectStatusUI();
        updateSupportBarForOngoing();
        return;
    }
    
    // 如果没有强制参数，则检查页面中的状态标签
    try {
        // 尝试多种可能的选择器
        let statusTag = document.querySelector('.status-tag');
        
        // 如果找不到，再尝试其他可能的选择器
        if (!statusTag) {
            statusTag = document.querySelector('.project-status');
        }
        
        if (!statusTag) {
            console.log("在DOM中找不到状态标签元素，进一步查找...");
            // 再尝试一些其他可能的元素
            const allDivs = document.querySelectorAll('div');
            for (const div of allDivs) {
                if (div.textContent.includes('预热') || 
                    div.textContent.includes('即将开始') || 
                    div.textContent.includes('众筹中') || 
                    div.textContent.includes('已结束')) {
                    statusTag = div;
                    console.log("找到可能的状态标签:", div.textContent);
                    break;
                }
            }
        }
        
        if (statusTag) {
            console.log("找到状态标签元素:", statusTag);
            
            const statusText = statusTag.textContent.trim();
            console.log("状态标签文本:", statusText);
            
            // 根据文本内容设置项目状态
            if (statusText.includes('预热') || statusText.includes('即将开始')) {
                projectStatus = "upcoming";
                console.log("检测到预热/即将开始文本，设置状态为upcoming");
            } else if (statusText.includes('众筹中')) {
                projectStatus = "ongoing";
                console.log("检测到众筹中文本，设置状态为ongoing");
            } else if (statusText.includes('已结束') || statusText.includes('已完成')) {
                projectStatus = "completed";
                console.log("检测到已结束/已完成文本，设置状态为completed");
            } else {
                console.log("无法从文本确定状态，使用默认状态:", projectStatus);
                // 在这里可以设置默认状态或进一步检查
            }
        } else {
            console.error("未找到状态标签元素，无法确定项目状态");
            console.log("使用默认状态:", projectStatus);
        }
    } catch (error) {
        console.error("检查项目状态时出错:", error);
    }
    
    console.log("项目状态最终设置为:", projectStatus);
    
    // 更新UI元素以反映当前状态
    updateProjectStatusUI();
    
    // 根据不同状态更新支持栏
    if (projectStatus === "upcoming") {
        console.log("项目为预热状态，更新支持栏和添加倒计时");
        updateSupportBarForPreheating();
        addPreheatingCountdown();
    } else if (projectStatus === "ongoing") {
        console.log("项目为众筹中状态，更新支持栏");
        updateSupportBarForOngoing();
    }
}

// 更新项目状态UI
function updateProjectStatusUI() {
    console.log("更新状态UI为当前状态:", projectStatus);
    
    // 更新页面显示的状态标签
    const statusTag = document.querySelector('.status-tag');
    if (statusTag) {
        if (projectStatus === "upcoming") {
            statusTag.textContent = '预热中';
            statusTag.className = 'status-tag status-preheating';
        } else if (projectStatus === "ongoing") {
            statusTag.textContent = '众筹中';
            statusTag.className = 'status-tag status-ongoing';
        } else if (projectStatus === "completed") {
            statusTag.textContent = '已结束';
            statusTag.className = 'status-tag status-completed';
        }
    } else {
        console.log("警告: 找不到状态标签元素 (.status-tag)");
        // 尝试延迟执行，以防DOM元素尚未加载
        setTimeout(() => {
            const retryStatusTag = document.querySelector('.status-tag');
            if (retryStatusTag) {
                console.log("延迟后找到状态标签，更新为当前状态:", projectStatus);
                if (projectStatus === "upcoming") {
                    retryStatusTag.textContent = '预热中';
                    retryStatusTag.className = 'status-tag status-preheating';
                } else if (projectStatus === "ongoing") {
                    retryStatusTag.textContent = '众筹中';
                    retryStatusTag.className = 'status-tag status-ongoing';
                } else if (projectStatus === "completed") {
                    retryStatusTag.textContent = '已结束';
                    retryStatusTag.className = 'status-tag status-completed';
                }
            } else {
                // 如果仍找不到状态标签，尝试创建一个
                const swiperContainer = document.querySelector('.swiper-container');
                if (swiperContainer) {
                    const statusDiv = document.createElement('div');
                    statusDiv.className = 'absolute top-4 left-4';
                    
                    if (projectStatus === "upcoming") {
                        statusDiv.innerHTML = '<div class="status-tag status-preheating">预热中</div>';
                    } else if (projectStatus === "ongoing") {
                        statusDiv.innerHTML = '<div class="status-tag status-ongoing">众筹中</div>';
                    } else if (projectStatus === "completed") {
                        statusDiv.innerHTML = '<div class="status-tag status-completed">已结束</div>';
                    }
                    
                    swiperContainer.appendChild(statusDiv);
                    console.log("创建了新的状态标签:", projectStatus);
                } else {
                    console.error("无法找到轮播容器，无法添加状态标签");
                }
            }
        }, 500);
    }
}

// 更新支持栏在众筹中项目时的显示
function updateSupportBarForOngoing() {
    console.log("更新众筹中项目的支持栏显示...");
    const supportBar = document.querySelector('.support-bar');
    const supportBtn = document.querySelector('.support-btn');
    
    if (!supportBar || !supportBtn) {
        console.error("找不到支持栏或支持按钮元素");
        return;
    }
    
    // 更新支持按钮文本
    supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>立即支持';
    
    // 恢复众筹进度信息（如果之前被隐藏）
    const progressInfo = document.querySelector('.basic-info-card > div:nth-child(4)');
    if (progressInfo) {
        progressInfo.style.display = '';
    }
    
    // 移除预热信息卡片（如果存在）
    const preheatingInfoCard = document.querySelector('.preheating-info-card');
    if (preheatingInfoCard) {
        preheatingInfoCard.remove();
    }
    
    // 移除预热标识（如果存在）
    const preheatingTag = document.querySelector('.preheating-tag');
    if (preheatingTag) {
        preheatingTag.remove();
    }
    
    // 移除预热倒计时（如果存在）
    const preheatingCountdown = document.querySelector('.preheating-countdown');
    if (preheatingCountdown) {
        preheatingCountdown.remove();
    }
}

// 在页面加载时添加预热模式按钮
function addPreheatingModeButton() {
    console.log("添加切换模式按钮 - 开始");
    
    // 如果已存在，则删除旧按钮，确保能够新建一个按钮
    const existingButton = document.querySelector('.preheating-mode-btn');
    if (existingButton) {
        console.log("发现已存在的模式切换按钮，删除它");
        existingButton.remove();
    }
    
    // 创建按钮
    const toggleButton = document.createElement('button');
    toggleButton.className = 'preheating-mode-btn';
    toggleButton.id = 'preheatingModeBtn';
    
    // 根据当前状态设置按钮文本
    if (projectStatus === "upcoming") {
        toggleButton.innerHTML = '切换到众筹中模式';
    } else {
        toggleButton.innerHTML = '切换到预热模式';
    }
    
    toggleButton.style.display = 'block'; // 确保显示
    
    // 添加醒目样式
    const style = document.createElement('style');
    style.textContent = `
        .preheating-mode-btn {
            position: fixed !important;
            bottom: 120px !important;
            right: 16px !important;
            background-color: #f39c12 !important;
            color: white !important;
            border: none !important;
            border-radius: 50px !important; /* 圆角按钮 */
            padding: 12px 16px !important;
            font-size: 14px !important;
            font-weight: bold !important;
            z-index: 10000 !important; /* 确保按钮在顶层 */
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
            animation: pulse-animation 2s infinite !important;
            display: block !important;
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
        }
        
        @keyframes pulse-animation {
            0% {
                box-shadow: 0 0 0 0 rgba(243, 156, 18, 0.7);
            }
            70% {
                box-shadow: 0 0 0 10px rgba(243, 156, 18, 0);
            }
            100% {
                box-shadow: 0 0 0 0 rgba(243, 156, 18, 0);
            }
        }
        
        /* 悬停效果 */
        .preheating-mode-btn:hover {
            transform: translateY(-2px) !important;
            background-color: #e67e22 !important;
        }
        
        /* 防止与其他元素叠加 */
        .preheating-mode-btn::before {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            border-radius: 50px;
            z-index: -1;
        }
        
        .status-ongoing {
            background-color: #2ecc71;
        }
        
        .status-completed {
            background-color: #95a5a6;
        }
    `;
    document.head.appendChild(style);
    console.log("模式切换按钮样式已添加");
    
    // 添加点击事件
    toggleButton.addEventListener('click', function() {
        console.log("点击切换模式按钮");
        // 清除URL中所有状态参数
        let url = new URL(window.location.href);
        url.searchParams.delete('preheating');
        url.searchParams.delete('ongoing');
        
        // 根据当前状态切换
        if (projectStatus === "upcoming") {
            console.log("当前是预热状态，切换到众筹中状态");
            url.searchParams.set('ongoing', 'true');
        } else {
            console.log("当前不是预热状态，切换到预热状态");
            url.searchParams.set('preheating', 'true');
        }
        
        // 重载页面
        window.location.href = url.toString();
    });
    
    // 创建一个立即执行的函数，尝试多次添加按钮，确保添加成功
    (function tryAddButton() {
        console.log("尝试添加切换模式按钮到DOM");
        
        // 先尝试直接添加
        document.body.appendChild(toggleButton);
        console.log("已尝试添加切换模式按钮到body");
        
        // 检查是否已成功添加
        setTimeout(() => {
            const addedButton = document.getElementById('preheatingModeBtn');
            if (!addedButton) {
                console.log("未检测到添加的切换模式按钮，重新尝试");
                // 再次尝试添加
                const contentDiv = document.querySelector('.content');
                if (contentDiv) {
                    contentDiv.appendChild(toggleButton.cloneNode(true));
                    console.log("已尝试添加切换模式按钮到.content");
                }
                
                // 延迟最后一次尝试
                setTimeout(() => {
                    const finalCheck = document.getElementById('preheatingModeBtn');
                    if (!finalCheck) {
                        console.log("最后一次尝试添加切换模式按钮");
                        // 创建一个绝对定位的容器作为备用
                        const container = document.createElement('div');
                        container.style.cssText = 'position:fixed;bottom:120px;right:16px;z-index:10001;';
                        
                        const finalButton = toggleButton.cloneNode(true);
                        // 重新添加点击事件
                        finalButton.addEventListener('click', function() {
                            let url = new URL(window.location.href);
                            url.searchParams.delete('preheating');
                            url.searchParams.delete('ongoing');
                            
                            if (projectStatus === "upcoming") {
                                url.searchParams.set('ongoing', 'true');
                            } else {
                                url.searchParams.set('preheating', 'true');
                            }
                            
                            window.location.href = url.toString();
                        });
                        
                        container.appendChild(finalButton);
                        document.body.appendChild(container);
                        console.log("使用备用容器添加切换模式按钮");
                    } else {
                        console.log("切换模式按钮已成功添加");
                    }
                }, 1000);
            } else {
                console.log("切换模式按钮已成功添加");
                // 添加触摸反馈
                addedButton.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                });
                
                addedButton.addEventListener('touchend', function() {
                    this.style.transform = 'scale(1)';
                });
            }
        }, 500);
    })();
    
    console.log("切换模式按钮创建完成");
}

// 添加预热项目倒计时功能
function addPreheatingCountdown() {
    console.log("添加预热倒计时...");
    
    // 检查是否已经存在倒计时元素，避免重复添加
    if (document.querySelector('.preheating-countdown')) {
        console.log("已存在倒计时元素，不重复添加");
        return;
    }
    
    // 设置众筹开始日期（示例：9月20日）
    const targetDate = new Date();
    targetDate.setDate(20);
    targetDate.setMonth(8); // 8代表9月（0-11）
    targetDate.setHours(10, 0, 0, 0); // 上午10点开始
    
    // 如果目标日期已过，则设置为下个月
    if (targetDate < new Date()) {
        targetDate.setMonth(targetDate.getMonth() + 1);
    }
    
    console.log("众筹开始日期设置为：", targetDate);
    
    // 创建倒计时元素
    const countdownElement = document.createElement('div');
    countdownElement.className = 'preheating-countdown';
    countdownElement.innerHTML = `
        <div class="countdown-title">距离众筹开始还有</div>
        <div class="countdown-timer">
            <div class="countdown-unit">
                <div class="countdown-value" id="countdown-days">--</div>
                <div class="countdown-label">天</div>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-unit">
                <div class="countdown-value" id="countdown-hours">--</div>
                <div class="countdown-label">时</div>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-unit">
                <div class="countdown-value" id="countdown-minutes">--</div>
                <div class="countdown-label">分</div>
            </div>
            <div class="countdown-separator">:</div>
            <div class="countdown-unit">
                <div class="countdown-value" id="countdown-seconds">--</div>
                <div class="countdown-label">秒</div>
            </div>
        </div>
    `;
    
    // 添加到预热信息卡片中
    const preheatingInfoCard = document.querySelector('.preheating-info-card');
    if (preheatingInfoCard) {
        // 在文本信息上方插入倒计时
        preheatingInfoCard.insertBefore(countdownElement, preheatingInfoCard.firstChild);
        
        // 添加倒计时样式
        const style = document.createElement('style');
        style.textContent = `
            .preheating-countdown {
                padding: 12px 0;
                text-align: center;
                border-bottom: 1px solid rgba(243, 156, 18, 0.2);
                margin-bottom: 12px;
            }
            
            .countdown-title {
                font-size: 13px;
                color: #f39c12;
                margin-bottom: 8px;
            }
            
            .countdown-timer {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }
            
            .countdown-unit {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .countdown-value {
                background: rgba(243, 156, 18, 0.2);
                color: #f39c12;
                font-size: 16px;
                font-weight: bold;
                border-radius: 4px;
                padding: 4px 8px;
                min-width: 36px;
                text-align: center;
            }
            
            .countdown-label {
                font-size: 10px;
                color: #bbb;
                margin-top: 4px;
            }
            
            .countdown-separator {
                color: #f39c12;
                font-weight: bold;
                margin-top: -10px;
            }
        `;
        document.head.appendChild(style);
        
        // 开始倒计时
        startCountdown(targetDate);
    } else {
        console.error("找不到预热信息卡片元素，无法添加倒计时");
    }
}

// 开始倒计时
function startCountdown(targetDate) {
    const daysElement = document.getElementById('countdown-days');
    const hoursElement = document.getElementById('countdown-hours');
    const minutesElement = document.getElementById('countdown-minutes');
    const secondsElement = document.getElementById('countdown-seconds');
    
    if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
        console.error("找不到倒计时元素");
        return;
    }
    
    // 更新倒计时函数
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate.getTime() - now;
        
        // 计算天、时、分、秒
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // 更新显示
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // 如果倒计时结束
        if (distance < 0) {
            clearInterval(countdownInterval);
            daysElement.textContent = "00";
            hoursElement.textContent = "00";
            minutesElement.textContent = "00";
            secondsElement.textContent = "00";
            
            // 显示众筹已开始提示
            const countdownTitle = document.querySelector('.countdown-title');
            if (countdownTitle) {
                countdownTitle.textContent = "众筹已开始！";
                countdownTitle.style.color = "#4caf50";
            }
        }
    }
    
    // 立即执行一次
    updateCountdown();
    
    // 每秒更新一次
    const countdownInterval = setInterval(updateCountdown, 1000);
}

// 更新支持栏在预热项目时的显示
function updateSupportBarForPreheating() {
    console.log("更新预热项目的支持栏显示...");
    const supportBar = document.querySelector('.support-bar');
    const supportBtn = document.querySelector('.support-btn');
    
    if (!supportBar || !supportBtn) {
        console.error("找不到支持栏或支持按钮元素");
        return;
    }
    
    if (projectStatus === "upcoming") {
        console.log("项目是预热状态，更新支持按钮和隐藏众筹进度信息");
        
        // 更新支持按钮为点赞按钮
        const isLiked = localStorage.getItem(`project_liked`) === 'true';
        if (isLiked) {
            supportBtn.innerHTML = '<i class="fas fa-heart mr-1"></i>已点赞';
            supportBtn.classList.add('liked-btn');
        } else {
            supportBtn.innerHTML = '<i class="far fa-heart mr-1"></i>点赞支持';
            supportBtn.classList.remove('liked-btn');
        }
        supportBtn.classList.remove('pulse-animation');
        supportBtn.classList.add('like-btn');
        
        // 修改按钮点击事件，从支付改为点赞
        supportBtn.onclick = function() {
            toggleProjectLikeButton(this);
        };
        
        // 隐藏众筹进度信息（金额、进度条、支持者数）
        // 根据HTML结构，众筹进度信息是basic-info-card下第一个没有class的div
        const basicInfoCard = document.querySelector('.basic-info-card');
        const progressInfo = basicInfoCard?.querySelector('.basic-info-card > div:nth-child(4)');
        
        // 检查是否已经添加了预热信息卡片
        const existingPreheatingInfoCard = document.querySelector('.preheating-info-card');
        if (existingPreheatingInfoCard) {
            console.log("已存在预热信息卡片，不重复添加");
        } else {
            if (progressInfo) {
                console.log("找到众筹进度信息，隐藏它");
                progressInfo.style.display = 'none';
                
                // 创建预热中的提示信息替代进度条
                const preheatingInfo = document.createElement('div');
                preheatingInfo.className = 'preheating-info-card';
                preheatingInfo.innerHTML = `
                    <div class="flex items-center justify-center py-4">
                        <div class="preheating-badge mr-2">预热中</div>
                        <span class="text-gray-300">项目即将开始众筹</span>
                    </div>
                    <div class="text-center text-sm text-gray-400 mb-4">
                        <div class="launch-date mb-2">
                            <i class="far fa-calendar-alt mr-1"></i>
                            <span>预计众筹开始时间：9月20日</span>
                        </div>
                        <div>众筹开始前，先点赞表达您的支持</div>
                    </div>
                    <div class="like-stats">
                        <div class="like-count-progress">
                            <div class="like-count-label">点赞人数</div>
                            <div class="like-count-number" id="likeCountNumber">328</div>
                            <div class="like-progress-container">
                                <div class="like-progress-bar" style="width: 65%"></div>
                            </div>
                            <div class="like-count-goal">目标：500人</div>
                        </div>
                    </div>
                `;
                
                // 将预热信息插入到原来进度条的位置
                progressInfo.parentNode.insertBefore(preheatingInfo, progressInfo);
                
                // 添加倒计时
                setTimeout(() => {
                    addPreheatingCountdown();
                }, 100);
            } else {
                console.log("尝试使用另一种方式查找众筹进度信息");
                // 尝试另一种方式查找 - 直接查找包含进度条的元素
                const progressContainer = document.querySelector('.progress-container');
                if (progressContainer) {
                    console.log("找到进度条容器，查找其父级元素");
                    // 向上查找两级，获取完整的众筹进度区域
                    const progressParent = progressContainer.parentNode;
                    if (progressParent) {
                        console.log("找到众筹进度信息的父级元素，隐藏它");
                        progressParent.style.display = 'none';
                        
                        // 创建预热中的提示信息替代进度条
                        const preheatingInfo = document.createElement('div');
                        preheatingInfo.className = 'preheating-info-card';
                        preheatingInfo.innerHTML = `
                            <div class="flex items-center justify-center py-4">
                                <div class="preheating-badge mr-2">预热中</div>
                                <span class="text-gray-300">项目即将开始众筹</span>
                            </div>
                            <div class="text-center text-sm text-gray-400 mb-4">
                                <div class="launch-date mb-2">
                                    <i class="far fa-calendar-alt mr-1"></i>
                                    <span>预计众筹开始时间：9月20日</span>
                                </div>
                                <div>众筹开始前，先点赞表达您的支持</div>
                            </div>
                            <div class="like-stats">
                                <div class="like-count-progress">
                                    <div class="like-count-label">点赞人数</div>
                                    <div class="like-count-number" id="likeCountNumber2">328</div>
                                    <div class="like-progress-container">
                                        <div class="like-progress-bar" style="width: 65%"></div>
                                    </div>
                                    <div class="like-count-goal">目标：500人</div>
                                </div>
                            </div>
                        `;
                        
                        // 将预热信息插入到原来进度条的位置
                        progressParent.parentNode.insertBefore(preheatingInfo, progressParent);
                        
                        // 添加倒计时
                        setTimeout(() => {
                            addPreheatingCountdown();
                        }, 100);
                    } else {
                        console.error("找不到众筹进度信息的父级元素");
                    }
                } else {
                    console.error("找不到进度条容器");
                }
            }
        }
        
        // 检查是否已经添加了预热标识
        const existingPreheatingTag = document.querySelector('.preheating-tag');
        if (existingPreheatingTag) {
            console.log("已存在预热标识，更新内容");
            existingPreheatingTag.innerHTML = `
                <div class="preheating-info">
                    <span class="preheating-badge">预热中</span>
                    <span class="preheating-date">正式众筹：9月20日</span>
                    <span class="preheating-like-count" id="preheatingLikeCount">已有<span class="highlight">328</span>人点赞支持</span>
                </div>
            `;
        } else {
            // 添加预热标识到支持栏
            const preheatingTag = document.createElement('div');
            preheatingTag.className = 'preheating-tag';
            preheatingTag.innerHTML = `
                <div class="preheating-info">
                    <span class="preheating-badge">预热中</span>
                    <span class="preheating-date">正式众筹：9月20日</span>
                    <span class="preheating-like-count" id="preheatingLikeCount">已有<span class="highlight">328</span>人点赞支持</span>
                </div>
            `;
            
            // 插入到support-bar的前面
            supportBar.parentNode.insertBefore(preheatingTag, supportBar);
        }
        
        // 禁用档位页面上的"立即支持"按钮
        const tierButtons = document.querySelectorAll('.tier-button');
        tierButtons.forEach(button => {
            button.innerHTML = '<i class="fas fa-lock mr-1"></i>众筹未开始';
            button.classList.add('disabled-btn');
            button.onclick = function(e) {
                e.preventDefault();
                showToast('项目预热中，众筹尚未开始，请点赞支持');
            };
        });
        
        // 添加CSS样式
        if (!document.querySelector('style[data-id="preheating-styles"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-id', 'preheating-styles');
            style.textContent = `
                .preheating-tag {
                    display: flex;
                    justify-content: center;
                    background-color: rgba(255, 248, 230, 0.9);
                    padding: 8px 16px;
                    border-top: 1px solid #f0e0b2;
                    color: #8a6d3b;
                    font-size: 14px;
                    position: fixed;
                    bottom: 60px;
                    left: 0;
                    right: 0;
                    z-index: 99;
                }
                
                .preheating-info {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .preheating-badge {
                    background-color: #f39c12;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: bold;
                }
                
                .preheating-date {
                    font-weight: 500;
                }
                
                .preheating-info-card {
                    background: rgba(25, 29, 43, 0.3);
                    border-radius: 8px;
                    margin-top: 12px;
                    margin-bottom: 22px;
                    border: 1px solid rgba(243, 156, 18, 0.3);
                }
                
                .launch-date {
                    color: #f39c12;
                    font-weight: 500;
                }
                
                .support-bar {
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
                }
                
                .like-btn {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .liked-btn {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                }
                
                .liked-btn i {
                    animation: heart-beat 0.6s ease-out;
                }
                
                .like-stats {
                    padding: 0 16px 16px;
                }
                
                .like-count-progress {
                    text-align: center;
                }
                
                .like-count-label {
                    font-size: 12px;
                    color: #f39c12;
                    margin-bottom: 4px;
                }
                
                .like-count-number {
                    font-size: 24px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin-bottom: 6px;
                }
                
                .like-progress-container {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                    overflow: hidden;
                    margin-bottom: 4px;
                }
                
                .like-progress-bar {
                    height: 100%;
                    background: linear-gradient(90deg, #e74c3c, #c0392b);
                }
                
                .like-count-goal {
                    font-size: 12px;
                    color: #bbb;
                    text-align: right;
                }
                
                .preheating-like-count {
                    color: #8a6d3b;
                }
                
                .preheating-like-count .highlight {
                    color: #e74c3c;
                    font-weight: bold;
                }
                
                @keyframes heart-beat {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
                
                .disabled-btn {
                    background: #4a5568 !important;
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 添加测试模式切换按钮
function addTestModeToggleButton() {
    // 检查是否已存在按钮
    if (document.getElementById('testModeToggleBtn')) {
        return;
    }
    
    // 创建按钮
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'testModeToggleBtn';
    toggleBtn.className = 'test-mode-toggle-btn';
    
    // 根据当前测试模式状态设置按钮文本
    const testModeEnabled = localStorage.getItem('testModeEnabled') === 'true';
    toggleBtn.textContent = testModeEnabled ? '退出测试模式' : '进入测试模式';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .test-mode-toggle-btn {
            position: fixed;
            bottom: 160px;
            right: 16px;
            background-color: rgba(25, 29, 43, 0.9);
            color: white;
            border: 1px solid #3498db;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            z-index: 999;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        .test-mode-toggle-btn:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);
    
    // 添加点击事件
    toggleBtn.addEventListener('click', function() {
        toggleTestMode();
        // 更新按钮文本
        const isTestMode = localStorage.getItem('testModeEnabled') === 'true';
        this.textContent = isTestMode ? '退出测试模式' : '进入测试模式';
    });
    
    // 添加到页面
    document.body.appendChild(toggleBtn);
}

// 显示预约提醒模态框
function showPreorderModal() {
    // 由于需求变更，此功能已被移除，改用点赞功能
    // 为保持兼容性，调用点赞功能
    const supportBtn = document.querySelector('.support-btn');
    if (supportBtn) {
        toggleProjectLikeButton(supportBtn);
    } else {
        showToast('项目预热中，请点赞支持');
    }
}

// 根据项目状态更新支持按钮功能
function updateSupportButtonsByStatus() {
    console.log("根据项目状态更新支持按钮功能...");
    const supportBar = document.querySelector('.support-bar');
    const supportBtn = document.querySelector('.support-btn');
    const tierButtons = document.querySelectorAll('.tier-button');
    
    // 如果项目状态为预热中，修改所有支持按钮
    if (projectStatus === "upcoming") {
        console.log("项目处于预热状态，更新所有支持按钮为点赞功能");
        
        // 更新主支持按钮为点赞按钮
        if (supportBtn) {
            // 检查是否已点赞
            const isLiked = localStorage.getItem(`project_liked`) === 'true';
            
            // 设置按钮内容和样式
            if (isLiked) {
                supportBtn.innerHTML = '<i class="fas fa-heart mr-1"></i>已点赞';
                supportBtn.classList.add('liked-btn');
            } else {
                supportBtn.innerHTML = '<i class="far fa-heart mr-1"></i>点赞支持';
                supportBtn.classList.remove('liked-btn');
            }
            
            supportBtn.classList.remove('pulse-animation');
            supportBtn.classList.add('like-btn');
            
            // 修改点击事件为点赞功能
            supportBtn.onclick = function() {
                toggleProjectLikeButton(this);
            };
        }
        
        // 更新预热标识内容
        const existingPreheatingTag = document.querySelector('.preheating-tag');
        if (existingPreheatingTag) {
            existingPreheatingTag.innerHTML = `
                <div class="preheating-info">
                    <span class="preheating-badge">预热中</span>
                    <span class="preheating-date">正式众筹：9月20日</span>
                    <span class="preheating-like-count" id="preheatingLikeCount">已有<span class="highlight">328</span>人点赞支持</span>
                </div>
            `;
        }
        
        // 更新档位页面上的所有支持按钮为已关闭状态
        tierButtons.forEach(button => {
            button.innerHTML = '<i class="fas fa-lock mr-1"></i>众筹未开始';
            button.classList.add('disabled-btn');
            // 禁用点击事件
            button.onclick = function(e) {
                e.preventDefault();
                showToast('项目预热中，众筹尚未开始，请点赞支持');
            };
        });
        
        // 添加点赞按钮样式
        if (!document.querySelector('style[data-id="like-btn-styles"]')) {
            const style = document.createElement('style');
            style.setAttribute('data-id', 'like-btn-styles');
            style.textContent = `
                .like-btn {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                    transition: all 0.3s ease;
                }
                
                .liked-btn {
                    background: linear-gradient(45deg, #e74c3c, #c0392b);
                    color: white;
                }
                
                .liked-btn i {
                    animation: heart-beat 0.6s ease-out;
                }
                
                .disabled-btn {
                    background: #4a5568 !important;
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                
                .preheating-like-count {
                    margin-left: 10px;
                    font-size: 12px;
                }
                
                .preheating-like-count .highlight {
                    color: #e74c3c;
                    font-weight: bold;
                }
                
                @keyframes heart-beat {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.3); }
                    50% { transform: scale(1); }
                    75% { transform: scale(1.3); }
                    100% { transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
    } else if (projectStatus === "ongoing") {
        console.log("项目处于众筹中状态，使用正常的支持功能");
        
        // 更新主支持按钮
        if (supportBtn) {
            supportBtn.innerHTML = '<i class="fas fa-bolt mr-1"></i>立即支持';
            supportBtn.classList.add('pulse-animation');
            supportBtn.classList.remove('like-btn', 'liked-btn');
            supportBtn.onclick = function() {
                showPaymentModal();
            };
        }
    }
}

// 切换项目点赞状态（适用于主按钮）
function toggleProjectLikeButton(button) {
    // 获取当前点赞状态
    const isLiked = localStorage.getItem('project_liked') === 'true';
    
    // 更新本地存储中的点赞状态
    localStorage.setItem('project_liked', !isLiked);
    
    // 更新按钮UI
    if (isLiked) {
        // 取消点赞
        button.innerHTML = '<i class="far fa-heart mr-1"></i>点赞支持';
        button.classList.remove('liked-btn');
        
        // 显示取消提示
        showToast('已取消点赞');
    } else {
        // 点赞
        button.innerHTML = '<i class="fas fa-heart mr-1"></i>已点赞';
        button.classList.add('liked-btn');
        
        // 添加爱心动画效果
        const heart = button.querySelector('i');
        heart.classList.add('heart-pulse');
        setTimeout(() => {
            heart.classList.remove('heart-pulse');
        }, 800);
        
        // 显示点赞成功提示
        showToast('感谢您的点赞支持！');
    }
    
    // 更新点赞统计数据
    updateLikeCount(!isLiked);
    
    // 触觉反馈
    provideTactileFeedback(10);
}

// 更新点赞统计数
function updateLikeCount(isLiked) {
    // 获取当前点赞数
    const likeCountElement = document.getElementById('likeCountNumber');
    const likeCountElement2 = document.getElementById('likeCountNumber2');
    const preheatingLikeCount = document.getElementById('preheatingLikeCount');
    
    // 当前显示的点赞数
    let currentCount = 328;
    
    // 从显示的元素中获取当前数值（如果存在）
    if (likeCountElement) {
        currentCount = parseInt(likeCountElement.textContent) || currentCount;
    }
    
    // 根据操作增减点赞数
    const newCount = isLiked ? currentCount + 1 : Math.max(currentCount - 1, 0);
    
    // 更新所有显示点赞数的元素
    if (likeCountElement) {
        likeCountElement.textContent = newCount;
    }
    
    if (likeCountElement2) {
        likeCountElement2.textContent = newCount;
    }
    
    if (preheatingLikeCount) {
        preheatingLikeCount.innerHTML = `已有<span class="highlight">${newCount}</span>人点赞支持`;
    }
    
    // 同时更新进度条
    const progressBars = document.querySelectorAll('.like-progress-bar');
    const progressPercentage = Math.min(Math.round((newCount / 500) * 100), 100);
    
    progressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
    
    // 如果达到目标，显示特殊提示
    if (newCount >= 500 && isLiked) {
        showToast('恭喜！点赞人数已达到目标！');
    }
}
  