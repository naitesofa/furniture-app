/**
 * 订单确认页面JS
 * 实现页面交互功能
 */

// 全局错误处理
window.onerror = function(message, source, lineno, colno, error) {
    console.error('全局错误:', message, 'at', source, ':', lineno, ':', colno);
    console.error('错误详情:', error);
    return false;
};

// 模态框相关函数
function showModal(modal) {
    // 禁止背景滚动
    document.body.classList.add('modal-open');
    
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    
    // 添加一个微小延迟，以确保过渡效果正常运行
    setTimeout(() => {
        modal.classList.add('modal-entering');
        
        // 自动聚焦模态框内的第一个输入框
        const firstInput = modal.querySelector('input:not([type="radio"]):not([type="checkbox"])');
        if (firstInput) {
            firstInput.focus();
        }
    }, 10);
    
    // 添加ESC键关闭功能
    document.addEventListener('keydown', handleEscKey);
}

function hideModal(modal) {
    modal.classList.remove('modal-entering');
    
    // 等待过渡效果完成后再隐藏元素
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        
        // 恢复背景滚动
        if (!document.querySelector('.modal-container:not(.hidden)')) {
            document.body.classList.remove('modal-open');
        }
    }, 300);
    
    // 移除ESC键事件监听
    document.removeEventListener('keydown', handleEscKey);
}

function handleEscKey(e) {
    if (e.key === 'Escape') {
        const visibleModal = document.querySelector('.modal-container:not(.hidden)');
        if (visibleModal) {
            hideModal(visibleModal);
        }
    }
}

// 生成预计送达时间
function generateDeliveryTime() {
    const now = new Date();
    const deliveryDate = new Date(now.setDate(now.getDate() + 3)); // 假设3天后送达
    
    const month = deliveryDate.getMonth() + 1;
    const date = deliveryDate.getDate();
    
    // 获取周几
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekday = weekdays[deliveryDate.getDay()];
    
    return `${month}月${date}日（周${weekday}）09:00-18:00`;
}

// 处理订单提交
function handleSubmitOrder() {
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (!submitOrderBtn) return;
    
    // 显示loading效果
    submitOrderBtn.classList.add('opacity-70');
    submitOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>处理中...';
    submitOrderBtn.disabled = true;
    
    // 生成唯一订单号：年月日时分秒+4位随机数
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000); // 4位随机数
    
    const orderId = `${year}${month}${day}${hour}${minute}${second}${random}`;
    
    // 模拟网络请求延迟
    setTimeout(function() {
        // 保存订单信息到本地存储供其他页面使用
        const totalPrice = document.getElementById('totalPrice');
        const estimatedDelivery = document.getElementById('estimatedDelivery');
        
        const orderData = {
            id: orderId,
            status: 'unpaid', // 未支付状态
            amount: totalPrice.textContent.replace('¥', ''),
            products: [
                {
                    name: '北欧设计师台灯',
                    variant: '黑色',
                    price: 599,
                    quantity: 2
                }
            ],
            address: {
                name: '李小明',
                phone: '13800138000',
                detail: '广东省深圳市南山区科技园南区A栋1001室'
            },
            estimatedDelivery: estimatedDelivery.textContent,
            createTime: `${year}-${month}-${day} ${hour}:${minute}:${second}`
        };
        
        // 存储订单数据
        localStorage.setItem(`order_${orderId}`, JSON.stringify(orderData));
        
        // 显示成功提示
        showToast('订单提交成功，正在跳转支付页面...');
        
        // 跳转到支付页面
        setTimeout(() => {
            window.location.href = `payment.html?id=${orderId}`;
        }, 1500);
    }, 800); // 添加800ms延迟模拟网络请求
}

// 显示toast提示
function showToast(message, duration = 3000) {
    // 移除可能存在的旧toast
    const oldToast = document.querySelector('.toast');
    if (oldToast) {
        oldToast.remove();
    }
    
    // 创建新toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 自动移除
    setTimeout(() => {
        toast.remove();
    }, duration);
}

// 初始化函数
function init() {
    console.log("页面初始化开始");
    
    try {
        // 设置送达时间
        const estimatedDelivery = document.getElementById('estimatedDelivery');
        if (estimatedDelivery) {
            estimatedDelivery.textContent = generateDeliveryTime();
        }
        
        // 先初始化页面数据
        initPageData();
        
        // 再给元素添加点击事件
        setupEventListeners();
        
        // 显示一个高亮提示，告知用户可以更改地址
        const addressSection = document.getElementById('addressSection');
        if (addressSection) {
            // 延迟1秒后显示地址可点击的高亮提示
            setTimeout(() => {
                // 创建并添加高亮效果
                const highlight = document.createElement('div');
                highlight.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    border-radius: 16px;
                    border: 2px solid var(--brand-primary);
                    pointer-events: none;
                    animation: pulse 1.5s infinite;
                    z-index: 0;
                `;
                
                // 创建脉动动画样式
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes pulse {
                        0% { box-shadow: 0 0 0 0 rgba(42, 157, 143, 0.4); }
                        70% { box-shadow: 0 0 0 10px rgba(42, 157, 143, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(42, 157, 143, 0); }
                    }
                `;
                document.head.appendChild(style);
                
                // 确保addressSection是相对定位的
                if (window.getComputedStyle(addressSection).position === 'static') {
                    addressSection.style.position = 'relative';
                }
                
                addressSection.appendChild(highlight);
                
                // 3秒后移除高亮
                setTimeout(() => {
                    highlight.style.transition = 'opacity 0.5s ease';
                    highlight.style.opacity = '0';
                    setTimeout(() => {
                        highlight.remove();
                    }, 500);
                }, 3000);
            }, 1000);
        }
        
        console.log("页面初始化完成");
    } catch (e) {
        console.error("初始化脚本时出错:", e);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 地址区域点击
    const addressSection = document.getElementById('addressSection');
    if (addressSection) {
        // 直接添加cursor样式
        addressSection.style.cursor = 'pointer';
        
        // 添加点击处理
        addressSection.onclick = function(e) {
            // 阻止事件冒泡
            e.preventDefault();
            e.stopPropagation();
            
            // 直接跳转，不使用setTimeout
            window.location.href = 'address.html?from=checkout';
            return false;
        }
        
        // 添加悬停效果
        addressSection.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = 'var(--shadow-md)';
        }
        
        addressSection.onmouseout = function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        }
    }
    
    // 配送方式点击
    const deliveryOption = document.getElementById('deliveryOption');
    if (deliveryOption) {
        deliveryOption.addEventListener('click', function() {
            showToast('点击了配送方式');
            // TODO: 添加配送方式选择逻辑
        });
    }
    
    // 预计送达时间点击
    const deliveryTimeOption = document.getElementById('deliveryTimeOption');
    if (deliveryTimeOption) {
        deliveryTimeOption.addEventListener('click', function() {
            showToast('点击了预计送达时间');
            // TODO: 添加送达时间选择逻辑
        });
    }
    
    // 订单备注点击
    const orderRemarkOption = document.getElementById('orderRemarkOption');
    const remarkModal = document.getElementById('remarkModal');
    if (orderRemarkOption && remarkModal) {
        orderRemarkOption.addEventListener('click', function() {
            showModal(remarkModal);
        });
    }
    
    // 优惠券区域点击
    const couponSection = document.getElementById('couponSection');
    if (couponSection) {
        couponSection.addEventListener('click', function() {
            showToast('点击了优惠券选择');
            // TODO: 添加优惠券选择跳转
        });
    }
    
    // 支付方式点击
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // 先取消所有选中状态
            paymentMethods.forEach(m => {
                m.querySelector('input[type="radio"]').checked = false;
            });
            
            // 设置当前选中
            this.querySelector('input[type="radio"]').checked = true;
            
            // 显示选择的支付方式
            const paymentType = this.getAttribute('data-payment');
            showToast(`已选择${paymentType === 'wechat' ? '微信支付' : '支付宝'}`);
        });
    });
    
    // 发票信息点击
    const invoiceSection = document.getElementById('invoiceSection');
    const invoiceModal = document.getElementById('invoiceModal');
    if (invoiceSection && invoiceModal) {
        invoiceSection.addEventListener('click', function() {
            showModal(invoiceModal);
        });
    }
    
    // 关闭发票模态框
    const closeInvoiceModal = document.getElementById('closeInvoiceModal');
    if (closeInvoiceModal && invoiceModal) {
        closeInvoiceModal.addEventListener('click', function() {
            hideModal(invoiceModal);
        });
    }
    
    // 确认发票信息
    const confirmInvoice = document.getElementById('confirmInvoice');
    const invoiceText = document.getElementById('invoiceText');
    if (confirmInvoice && invoiceModal && invoiceText) {
        confirmInvoice.addEventListener('click', function() {
            // 获取发票类型
            const invoiceType = document.querySelector('input[name="invoiceType"]:checked').value;
            const invoiceTitle = document.querySelector('input[name="invoiceTitle"]:checked').value;
            
            // 更新发票文本
            if (invoiceTitle === 'personal') {
                invoiceText.textContent = invoiceType === 'electronic' ? '电子发票 - 个人' : '纸质发票 - 个人';
            } else {
                invoiceText.textContent = invoiceType === 'electronic' ? '电子发票 - 单位' : '纸质发票 - 单位';
            }
            
            hideModal(invoiceModal);
            showToast('发票信息已保存');
        });
    }
    
    // 切换发票抬头
    const personalTitle = document.getElementById('personalTitle');
    const companyTitle = document.getElementById('companyTitle');
    const companyInfo = document.getElementById('companyInfo');
    if (personalTitle && companyTitle && companyInfo) {
        personalTitle.addEventListener('change', function() {
            if (this.checked) {
                companyInfo.classList.add('hidden');
            }
        });
        
        companyTitle.addEventListener('change', function() {
            if (this.checked) {
                companyInfo.classList.remove('hidden');
            }
        });
    }
    
    // 保存常用订单按钮点击
    const saveOrderBtn = document.getElementById('saveOrderBtn');
    const saveOrderModal = document.getElementById('saveOrderModal');
    if (saveOrderBtn && saveOrderModal) {
        saveOrderBtn.addEventListener('click', function() {
            showModal(saveOrderModal);
        });
    }
    
    // 关闭保存常用订单模态框
    const closeSaveOrderModal = document.getElementById('closeSaveOrderModal');
    if (closeSaveOrderModal && saveOrderModal) {
        closeSaveOrderModal.addEventListener('click', function() {
            hideModal(saveOrderModal);
        });
    }
    
    // 确认保存常用订单
    const confirmSaveOrder = document.getElementById('confirmSaveOrder');
    if (confirmSaveOrder && saveOrderModal) {
        confirmSaveOrder.addEventListener('click', function() {
            const orderName = document.getElementById('orderName').value.trim();
            if (!orderName) {
                showToast('请输入常用订单名称');
                return;
            }
            
            // 构建常用订单数据
            const totalPrice = document.getElementById('totalPrice');
            const orderData = {
                name: orderName,
                products: [
                    {
                        name: '北欧设计师台灯',
                        variant: '黑色',
                        price: 599,
                        quantity: 2
                    }
                ],
                address: {
                    name: '李小明',
                    phone: '13800138000',
                    detail: '广东省深圳市南山区科技园南区A栋1001室'
                },
                totalPrice: totalPrice.textContent.replace('¥', ''),
                createdAt: new Date().toISOString()
            };
            
            // 保存到本地存储
            let savedOrders = JSON.parse(localStorage.getItem('savedOrders') || '[]');
            savedOrders.push(orderData);
            localStorage.setItem('savedOrders', JSON.stringify(savedOrders));
            
            // 关闭模态框并提示
            hideModal(saveOrderModal);
            showToast('已成功保存为常用订单');
        });
    }
    
    // 关闭备注模态框
    const closeRemarkModal = document.getElementById('closeRemarkModal');
    if (closeRemarkModal && remarkModal) {
        closeRemarkModal.addEventListener('click', function() {
            hideModal(remarkModal);
        });
    }
    
    // 确认备注信息
    const confirmRemark = document.getElementById('confirmRemark');
    if (confirmRemark && remarkModal) {
        confirmRemark.addEventListener('click', function() {
            const orderRemark = document.getElementById('orderRemark').value.trim();
            const remarkText = document.querySelector('#orderRemarkOption .text-gray-400');
            
            if (orderRemark) {
                remarkText.textContent = orderRemark.length > 10 ? orderRemark.substring(0, 10) + '...' : orderRemark;
                remarkText.classList.remove('text-gray-400');
                remarkText.classList.add('text-gray-600');
            } else {
                remarkText.textContent = '选填，建议备注相关特殊需求';
                remarkText.classList.remove('text-gray-600');
                remarkText.classList.add('text-gray-400');
            }
            
            hideModal(remarkModal);
        });
    }
    
    // 提交订单按钮点击
    const submitOrderBtn = document.getElementById('submitOrderBtn');
    if (submitOrderBtn) {
        submitOrderBtn.addEventListener('click', handleSubmitOrder);
    }
    
    // 所有模态框背景点击关闭
    const allModals = document.querySelectorAll('.modal-container');
    allModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal(modal);
            }
        });
    });
}

// 初始化页面数据
function initPageData() {
    // 加载商品图片
    fetch('https://source.unsplash.com/random/200x200/?furniture')
        .then(response => {
            const productImage = document.querySelector('.product-image img');
            if (productImage) {
                productImage.src = response.url;
            }
        })
        .catch(error => {
            console.error('获取图片失败:', error);
        });
    
    // 检查是否有已选择的地址信息
    const selectedAddress = localStorage.getItem('selectedAddress');
    if (selectedAddress) {
        try {
            const addressData = JSON.parse(selectedAddress);
            
            // 更新地址信息
            const addressSection = document.getElementById('addressSection');
            if (addressSection) {
                const nameElement = addressSection.querySelector('.font-medium');
                const phoneElement = addressSection.querySelector('.text-sm.text-gray-500');
                const addressElement = addressSection.querySelector('.text-sm.text-gray-600');
                
                if (nameElement && phoneElement && addressElement) {
                    nameElement.textContent = addressData.name;
                    phoneElement.textContent = addressData.phone;
                    addressElement.textContent = addressData.address;
                    
                    // 显示一个短暂的提示
                    showToast('已更新收货地址');
                }
            }
        } catch (error) {
            console.error('解析地址数据出错:', error);
        }
    }
    
    // 初始化计算总价
    calculateTotal();
}

// 计算总价
function calculateTotal() {
    const productTotal = document.getElementById('productTotal');
    const shippingFee = document.getElementById('shippingFee');
    const couponDiscount = document.getElementById('couponDiscount');
    const couponDiscountValue = document.getElementById('couponDiscountValue');
    const totalPrice = document.getElementById('totalPrice');
    
    // 获取商品价格（假设这个值已经在HTML中设置）
    let subtotal = parseFloat(productTotal.textContent.replace('¥', '').replace(',', ''));
    let shipping = parseFloat(shippingFee.textContent.replace('¥', '').replace(',', ''));
    let discount = 0;
    
    // 优惠券折扣（如果有）
    if (couponDiscount.style.display !== 'none') {
        discount = parseFloat(couponDiscountValue.textContent.replace('-¥', '').replace(',', ''));
    }
    
    // 计算总价
    const total = subtotal + shipping - discount;
    
    // 更新总价显示
    totalPrice.textContent = `¥${formatNumber(total)}`;
}

// 格式化数字为千分位表示
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);

// 额外的加载检查
window.onload = function() {
    console.log("window.onload 事件触发");
    
    // 检查按钮是否存在并可点击
    const submitBtn = document.getElementById('submitOrderBtn');
    const saveBtn = document.getElementById('saveOrderBtn');
    
    if (submitBtn) {
        submitBtn.style.pointerEvents = 'auto';
    }
    
    if (saveBtn) {
        saveBtn.style.pointerEvents = 'auto';
    }
}; 