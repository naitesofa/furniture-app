/**
 * 优惠券页面功能
 */

document.addEventListener('DOMContentLoaded', function() {
    initTabSwitching();
    initCouponSubmit();
    initCouponUseButtons();
    checkEmptyState();
    initTouchEvents();
    
    // 添加新功能: 初始化推荐优惠券相关功能
    initRecommendedCoupons();
});

/**
 * 初始化标签页切换功能
 */
function initTabSwitching() {
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            tabs.forEach(t => t.classList.remove('active'));
            
            // 给当前标签添加active类
            this.classList.add('active');
            
            // 获取当前标签的类型
            const tabType = this.getAttribute('data-tab');
            
            // 根据标签类型显示相应内容
            switchTabContent(tabType);
        });
    });
}

/**
 * 切换标签页内容
 * @param {string} tabType - 标签类型
 */
function switchTabContent(tabType) {
    const availableCoupons = document.getElementById('availableCoupons');
    const usedCoupons = document.getElementById('usedCoupons');
    const emptyState = document.getElementById('emptyState');
    
    if (tabType === 'available') {
        availableCoupons.style.display = 'block';
        usedCoupons.style.display = 'none';
        
        // 检查是否有可用优惠券，如果没有则显示空状态
        const hasAvailableCoupons = availableCoupons.querySelector('.coupon-card');
        emptyState.style.display = hasAvailableCoupons ? 'none' : 'flex';
    } else {
        availableCoupons.style.display = 'none';
        usedCoupons.style.display = 'block';
        emptyState.style.display = 'none';
    }
}

/**
 * 初始化优惠券提交功能
 */
function initCouponSubmit() {
    const couponSubmitBtn = document.querySelector('.coupon-submit');
    const couponInput = document.getElementById('couponCode');
    
    if (couponSubmitBtn && couponInput) {
        couponSubmitBtn.addEventListener('click', function() {
            submitCouponCode(couponInput.value.trim());
        });
        
        // 添加回车键提交功能
        couponInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitCouponCode(couponInput.value.trim());
            }
        });
    }
}

/**
 * 提交优惠券码
 * @param {string} code - 优惠券码
 */
function submitCouponCode(code) {
    const couponInput = document.getElementById('couponCode');
    
    if (!code) {
        showToast('请输入优惠券码');
        // 添加摇晃效果
        couponInput.classList.add('shake-animation');
        setTimeout(() => {
            couponInput.classList.remove('shake-animation');
        }, 600);
        return;
    }
    
    // 显示加载状态
    const submitBtn = document.querySelector('.coupon-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '处理中...';
    submitBtn.disabled = true;
    
    // 模拟API请求
    setTimeout(() => {
        // 恢复按钮状态
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // 示例：根据输入的不同代码返回不同结果
        if (code === 'NEW2023') {
            showToast('恭喜您，成功领取50元无门槛优惠券！');
            addNewCoupon({
                amount: '¥50',
                condition: '无使用门槛',
                validity: '有效期至：2023-12-31',
                rules: ['- 新用户专享', '- 限首单使用', '- 不可与其他优惠同时使用']
            });
            couponInput.value = '';
        } else if (code === 'VIP2023') {
            showToast('恭喜您，成功领取200元满2000减200优惠券！');
            addNewCoupon({
                amount: '¥200',
                condition: '满2000元使用',
                validity: '有效期至：2024-01-31',
                rules: ['- 全场通用', '- 不可与其他优惠同时使用', '- 每单限用一张']
            });
            couponInput.value = '';
        } else {
            showToast('优惠券码无效或已过期', 'error');
            // 添加摇晃效果
            couponInput.classList.add('shake-animation');
            setTimeout(() => {
                couponInput.classList.remove('shake-animation');
            }, 600);
        }
    }, 800);
}

/**
 * 初始化优惠券使用按钮事件
 */
function initCouponUseButtons() {
    const useButtons = document.querySelectorAll('.coupon-use-btn');
    
    useButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            handleCouponUse(this);
        });
    });
}

/**
 * 处理优惠券使用
 * @param {HTMLElement} button - 使用按钮元素
 */
function handleCouponUse(button) {
    // 获取优惠券信息
    const couponCard = button.closest('.coupon-card');
    const amount = couponCard.querySelector('.coupon-amount').textContent;
    const condition = couponCard.querySelector('.coupon-condition').textContent;
    
    // 保存选择的优惠券信息
    saveCouponSelection(amount, condition);
    
    // 判断是否从结算页面进入
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('from') === 'checkout') {
        // 返回结算页面并应用优惠券
        window.location.href = 'checkout.html?coupon=applied';
    } else {
        // 正常跳转到商品列表页面
        window.location.href = 'category.html?coupon=true';
    }
}

/**
 * 保存选择的优惠券信息
 * @param {string} amount - 优惠券金额
 * @param {string} condition - 使用条件
 */
function saveCouponSelection(amount, condition) {
    localStorage.setItem('selectedCoupon', JSON.stringify({
        amount: amount,
        condition: condition,
        selectedTime: new Date().getTime()
    }));
}

/**
 * 添加新优惠券到列表
 * @param {Object} couponData - 优惠券数据
 */
function addNewCoupon(couponData) {
    const couponList = document.querySelector('#availableCoupons .coupon-list');
    const emptyState = document.getElementById('emptyState');
    
    // 创建新优惠券元素
    const newCoupon = document.createElement('div');
    newCoupon.className = 'coupon-card success-animation';
    
    // 特殊处理新人券样式
    if (couponData.isFirstOrderReward) {
        newCoupon.style.border = '2px solid var(--brand-primary)';
        newCoupon.style.position = 'relative';
        newCoupon.style.overflow = 'hidden';
    }
    
    // 构建优惠券内容
    let rulesHtml = '';
    couponData.rules.forEach(rule => {
        rulesHtml += `<div class="coupon-detail-item">${rule}</div>`;
    });
    
    let amountStyle = '';
    let buttonStyle = '';
    let labelHtml = '';
    let validityExtra = '';
    
    if (couponData.isFirstOrderReward) {
        amountStyle = 'style="color: var(--brand-primary); font-weight: bold;"';
        buttonStyle = 'style="background-color: var(--brand-primary); border-color: var(--brand-primary);"';
        labelHtml = `<div style="position: absolute; top: 0; right: 0; background-color: var(--brand-primary); color: white; padding: 2px 10px; font-size: 12px; transform: rotate(45deg) translate(15px, -10px); width: 100px; text-align: center; font-weight: bold;">首单奖励</div>`;
        validityExtra = `<div class="coupon-validity" style="color: var(--brand-primary); font-weight: bold;">新用户专享特权</div>`;
    }
    
    newCoupon.innerHTML = `
        ${labelHtml}
        <div class="coupon-content">
            <div class="coupon-left">
                <div class="coupon-amount" ${amountStyle}>${couponData.amount}</div>
                <div class="coupon-condition">${couponData.condition}</div>
                <div class="coupon-validity">${couponData.validity}</div>
                ${validityExtra}
            </div>
            <div class="coupon-right">
                <button class="coupon-use-btn btn-click-effect" ${buttonStyle}>立即使用</button>
            </div>
        </div>
        <div class="coupon-footer">
            <div class="coupon-details" onclick="toggleDetails(this)">
                使用规则 <i class="fas fa-chevron-down rotate-transition"></i>
            </div>
            <div class="coupon-details-content transition-height">
                ${rulesHtml}
            </div>
        </div>
    `;
    
    // 添加到列表开头
    couponList.insertBefore(newCoupon, couponList.firstChild);
    
    // 隐藏空状态
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    
    // 绑定使用按钮事件
    const useBtn = newCoupon.querySelector('.coupon-use-btn');
    useBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        handleCouponUse(this);
    });
    
    // 一段时间后移除动画类
    setTimeout(() => {
        newCoupon.classList.remove('success-animation');
    }, 1000);
}

/**
 * 切换优惠券详情显示/隐藏
 * @param {HTMLElement} element - 点击的元素
 */
function toggleDetails(element) {
    element.classList.toggle('open');
    const icon = element.querySelector('i');
    if (icon) {
        icon.classList.toggle('rotate-180');
    }
    
    const content = element.nextElementSibling;
    content.classList.toggle('open');
}

/**
 * 检查空状态
 */
function checkEmptyState() {
    const availableCoupons = document.getElementById('availableCoupons');
    const emptyState = document.getElementById('emptyState');
    
    if (availableCoupons && emptyState) {
        const hasAvailableCoupons = availableCoupons.querySelector('.coupon-card');
        if (!hasAvailableCoupons && window.getComputedStyle(availableCoupons).display !== 'none') {
            emptyState.style.display = 'flex';
        }
    }
}

/**
 * 显示提示信息
 * @param {string} message - 提示消息
 * @param {string} type - 提示类型 (success/error)
 */
function showToast(message, type = 'success') {
    // 检查是否已存在toast元素
    let toast = document.querySelector('.toast-message');
    
    if (!toast) {
        // 创建toast元素
        toast = document.createElement('div');
        toast.className = 'toast-message fade-in';
        document.body.appendChild(toast);
    }
    
    // 设置提示类型样式
    if (type === 'success') {
        toast.style.backgroundColor = 'var(--brand-success)';
    } else if (type === 'error') {
        toast.style.backgroundColor = 'var(--brand-error)';
    }
    
    // 设置消息内容并显示
    toast.textContent = message;
    toast.style.display = 'block';
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            toast.style.display = 'none';
            toast.style.opacity = '1';
        }, 300);
    }, 3000);
}

/**
 * 初始化触摸手势事件
 */
function initTouchEvents() {
    // 获取标签页容器
    const tabsContainer = document.querySelector('.tabs-container');
    if (!tabsContainer) return;
    
    const tabs = Array.from(tabsContainer.querySelectorAll('.tab'));
    
    // 初始变量
    let startX, startTime;
    const threshold = 100; // 最小滑动距离
    const maxTime = 300; // 最大滑动时间（毫秒）
    
    // 获取主内容区域
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;
    
    // 触摸开始
    mainContent.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startTime = new Date().getTime();
    }, false);
    
    // 触摸结束
    mainContent.addEventListener('touchend', function(e) {
        if (!startX) return;
        
        const endX = e.changedTouches[0].clientX;
        const endTime = new Date().getTime();
        const diffX = endX - startX;
        const diffTime = endTime - startTime;
        
        // 检查是否是有效的滑动
        if (Math.abs(diffX) >= threshold && diffTime <= maxTime) {
            // 获取当前激活的标签索引
            const activeIndex = tabs.findIndex(tab => tab.classList.contains('active'));
            
            if (diffX > 0 && activeIndex > 0) {
                // 向右滑动 - 切换到前一个标签
                tabs[activeIndex - 1].click();
            } else if (diffX < 0 && activeIndex < tabs.length - 1) {
                // 向左滑动 - 切换到后一个标签
                tabs[activeIndex + 1].click();
            }
        }
        
        // 重置起始位置
        startX = null;
    }, false);
}

// 添加CSS样式
function addToastStyle() {
    // 检查是否已存在样式
    if (document.getElementById('toast-style')) return;
    
    // 创建样式元素
    const style = document.createElement('style');
    style.id = 'toast-style';
    style.textContent = `
        .toast-message {
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--brand-success);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            box-shadow: var(--shadow-md);
            font-size: 14px;
            transition: opacity 0.3s ease;
            text-align: center;
            min-width: 200px;
            max-width: 80%;
        }
    `;
    
    // 添加到head
    document.head.appendChild(style);
}

// 页面加载时添加Toast样式
document.addEventListener('DOMContentLoaded', addToastStyle);

/**
 * 初始化推荐优惠券相关功能
 */
function initRecommendedCoupons() {
    // 初始化去领券按钮功能 - 移除此功能
    // initGoCouponButton();
    
    // 初始化领取推荐优惠券功能
    initGetRecommendedCoupons();
}

/**
 * 初始化去领券按钮功能 - 此函数保留但不再调用
 */
function initGoCouponButton() {
    const goCouponBtn = document.querySelector('.go-coupon-btn');
    
    if (goCouponBtn) {
        goCouponBtn.addEventListener('click', function() {
            // 模拟跳转到领券中心
            simulateNavigation('coupon-center.html');
        });
    }
}

/**
 * 初始化领取推荐优惠券功能
 */
function initGetRecommendedCoupons() {
    const getCouponBtns = document.querySelectorAll('.get-coupon-btn');
    
    getCouponBtns.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const couponItem = this.closest('.recommended-item');
            const amountElement = couponItem.querySelector('.rec-amount');
            const conditionElement = couponItem.querySelector('.rec-condition');
            
            if (amountElement && conditionElement) {
                const amount = amountElement.textContent;
                const condition = conditionElement.textContent;
                
                // 处理领取推荐优惠券
                handleGetRecommendedCoupon(amount, condition, index);
                
                // 禁用按钮，避免重复点击
                this.disabled = true;
                this.textContent = '已领取';
                this.style.backgroundColor = 'var(--brand-light-dark)';
                this.style.borderColor = 'var(--brand-light-dark)';
                this.style.color = 'var(--brand-light)';
                
                // 添加成功动画
                couponItem.classList.add('success-animation');
                setTimeout(() => {
                    couponItem.classList.remove('success-animation');
                }, 1000);
            }
        });
    });
}

/**
 * 处理领取推荐优惠券
 * @param {string} amount - 优惠券金额
 * @param {string} condition - 使用条件
 * @param {number} index - 优惠券索引
 */
function handleGetRecommendedCoupon(amount, condition, index) {
    // 不同的推荐优惠券对应不同的规则和有效期
    const couponRules = [
        ['- 仅限家具类商品使用', '- 不可与其他优惠同时使用', '- 每单限用一张'],
        ['- 新用户专享', '- 仅限首单使用', '- 不可与其他优惠同时使用', '- 首单奖励特权'],
        ['- 全场通用', '- 订单金额满1000元可用', '- 可与其他优惠券同时使用']
    ];
    
    // 获取当前日期，并计算30天后的日期作为有效期
    const today = new Date();
    const expiryDate = new Date();
    expiryDate.setDate(today.getDate() + 30);
    
    // 格式化有效期
    const formattedExpiryDate = formatDate(expiryDate);
    
    // 构造优惠券数据
    const couponData = {
        amount: amount,
        condition: condition,
        validity: `有效期至：${formattedExpiryDate}`,
        rules: couponRules[index % couponRules.length]
    };
    
    // 特殊处理新人券
    if (index === 1 || condition.includes('新人') || amount === '¥500') {
        couponData.isFirstOrderReward = true;
    }
    
    // 添加新优惠券
    addNewCoupon(couponData);
    
    // 显示成功提示
    if (couponData.isFirstOrderReward) {
        showToast(`恭喜获得首单奖励！${amount}无门槛优惠券已到账`);
    } else {
        showToast(`成功领取${amount}优惠券！`);
    }
    
    // 切换到可用优惠券标签
    document.querySelector('.tab[data-tab="available"]').click();
}

/**
 * 格式化日期为 YYYY-MM-DD 格式
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

/**
 * 模拟页面导航
 * @param {string} url - 目标URL
 */
function simulateNavigation(url) {
    // 如果实际项目中有领券中心页面，可以直接跳转
    // window.location.href = url;
    
    // 模拟导航：显示提示消息
    showToast('即将前往领券中心');
    
    // 这里可以根据实际需求进行处理
    // 例如，如果没有独立的领券中心页面，可以展示一个模态框或直接显示推荐券
    setTimeout(() => {
        // 这里可以添加其他逻辑
        console.log('Navigate to:', url);
        
        // 模拟异步加载更多优惠券
        loadMoreRecommendedCoupons();
    }, 500);
}

/**
 * 加载更多推荐优惠券
 */
function loadMoreRecommendedCoupons() {
    // 模拟从服务器获取更多推荐优惠券
    const additionalCoupons = [
        { amount: '¥300', condition: '满4500元使用' },
        { amount: '¥500', condition: '无使用门槛' },
        { amount: '¥200', condition: '免运费' }
    ];
    
    const recommendedList = document.getElementById('recommendedList');
    
    if (recommendedList) {
        // 延迟添加，以显示加载效果
        setTimeout(() => {
            additionalCoupons.forEach(coupon => {
                const couponItem = document.createElement('div');
                couponItem.className = 'recommended-item fade-in';
                
                couponItem.innerHTML = `
                    <div class="rec-coupon-left">
                        <div class="rec-amount">${coupon.amount}</div>
                        <div class="rec-condition">${coupon.condition}</div>
                    </div>
                    <div class="rec-coupon-right">
                        <button class="get-coupon-btn btn-click-effect">立即领取</button>
                    </div>
                `;
                
                recommendedList.appendChild(couponItem);
                
                // 绑定领取按钮事件
                const getButton = couponItem.querySelector('.get-coupon-btn');
                getButton.addEventListener('click', function() {
                    const amountElement = couponItem.querySelector('.rec-amount');
                    const conditionElement = couponItem.querySelector('.rec-condition');
                    
                    if (amountElement && conditionElement) {
                        handleGetRecommendedCoupon(
                            amountElement.textContent,
                            conditionElement.textContent,
                            Math.floor(Math.random() * 3)
                        );
                        
                        // 禁用按钮，避免重复点击
                        this.disabled = true;
                        this.textContent = '已领取';
                        this.style.backgroundColor = 'var(--brand-light-dark)';
                        this.style.borderColor = 'var(--brand-light-dark)';
                        this.style.color = 'var(--brand-light)';
                        
                        // 添加成功动画
                        couponItem.classList.add('success-animation');
                        setTimeout(() => {
                            couponItem.classList.remove('success-animation');
                        }, 1000);
                    }
                });
            });
        }, 800);
    }
} 