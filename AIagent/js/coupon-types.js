/**
 * 优惠券类型模块
 * 管理不同类型的优惠券及其操作逻辑
 */

/**
 * 优惠券类型枚举
 */
const COUPON_TYPES = {
    CASH: 'cash',         // 现金券
    DISCOUNT: 'discount', // 折扣券
    SHIPPING: 'shipping'  // 运费券
};

/**
 * 优惠券状态枚举
 */
const COUPON_STATUS = {
    AVAILABLE: 'available',  // 可用
    USED: 'used',            // 已使用
    EXPIRED: 'expired'       // 已过期
};

/**
 * 识别优惠券类型
 * @param {string} amountText - 优惠券金额文本
 * @returns {string} 优惠券类型
 */
function getCouponType(amountText) {
    if (amountText.includes('¥') || amountText.includes('￥')) {
        return COUPON_TYPES.CASH;
    } else if (amountText.includes('折')) {
        return COUPON_TYPES.DISCOUNT;
    } else if (amountText.includes('运费') || amountText.includes('免邮')) {
        return COUPON_TYPES.SHIPPING;
    }
    return COUPON_TYPES.CASH; // 默认为现金券
}

/**
 * 计算优惠券折扣金额
 * @param {string} couponType - 优惠券类型
 * @param {string} amountText - 优惠券金额文本
 * @param {number} orderAmount - 订单金额
 * @param {number} shippingFee - 运费
 * @returns {number} 折扣金额
 */
function calculateDiscount(couponType, amountText, orderAmount, shippingFee = 0) {
    switch (couponType) {
        case COUPON_TYPES.CASH:
            const cashAmount = parseInt(amountText.replace(/[^\d]/g, ''));
            return cashAmount;
            
        case COUPON_TYPES.DISCOUNT:
            const discountRate = parseFloat(amountText.replace(/[^\d.]/g, '')) / 10;
            return orderAmount * (1 - discountRate);
            
        case COUPON_TYPES.SHIPPING:
            return shippingFee;
            
        default:
            return 0;
    }
}

/**
 * 检查优惠券是否满足使用条件
 * @param {string} conditionText - 使用条件文本
 * @param {number} orderAmount - 订单金额
 * @param {Array} products - 产品列表
 * @returns {Object} 结果对象 {isValid, message}
 */
function checkCouponCondition(conditionText, orderAmount, products = []) {
    // 检查订单金额条件
    if (conditionText.includes('满')) {
        const requiredAmount = parseInt(conditionText.match(/\d+/)[0]);
        if (orderAmount < requiredAmount) {
            return {
                isValid: false,
                message: `订单金额不足，还差${requiredAmount - orderAmount}元`
            };
        }
    }
    
    // 检查商品类型限制
    if (conditionText.includes('限') && products.length > 0) {
        // 这里需要根据具体业务逻辑实现商品类型的检查
        const categoryRestrictions = extractCategoryRestrictions(conditionText);
        const hasValidProduct = products.some(product => 
            categoryRestrictions.some(category => product.categories.includes(category))
        );
        
        if (!hasValidProduct) {
            return {
                isValid: false,
                message: '当前商品不适用此优惠券'
            };
        }
    }
    
    return {
        isValid: true,
        message: '可使用'
    };
}

/**
 * 从条件文本中提取类别限制
 * @param {string} conditionText - 条件文本
 * @returns {Array} 类别限制数组
 */
function extractCategoryRestrictions(conditionText) {
    const categories = [];
    
    // 实木家具
    if (conditionText.includes('实木家具')) {
        categories.push('实木家具');
    }
    
    // 软装饰品
    if (conditionText.includes('软装饰品') || conditionText.includes('软装')) {
        categories.push('软装饰品');
    }
    
    // 床品
    if (conditionText.includes('床品')) {
        categories.push('床品');
    }
    
    // 如果没有找到具体类别，但包含"限"字，可能是其他格式描述的类别
    if (categories.length === 0 && conditionText.includes('限')) {
        const match = conditionText.match(/限([\u4e00-\u9fa5]+)/);
        if (match && match[1]) {
            categories.push(match[1]);
        }
    }
    
    return categories;
}

/**
 * 解析优惠券有效期
 * @param {string} validityText - 有效期文本
 * @returns {Object} 有效期对象 {startDate, endDate, isExpired, daysLeft}
 */
function parseValidity(validityText) {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    let isExpired = false;
    let daysLeft = 0;
    
    // 检查是否已过期
    if (validityText.includes('已过期') || validityText.includes('过期时间')) {
        isExpired = true;
        const dateMatch = validityText.match(/\d{4}-\d{1,2}-\d{1,2}/);
        if (dateMatch) {
            endDate = new Date(dateMatch[0]);
        }
    }
    // 检查是否即将过期
    else if (validityText.includes('还剩')) {
        const daysMatch = validityText.match(/\d+/);
        if (daysMatch) {
            daysLeft = parseInt(daysMatch[0]);
            endDate = new Date();
            endDate.setDate(now.getDate() + daysLeft);
        }
    }
    // 普通有效期
    else if (validityText.includes('有效期至')) {
        const dateMatch = validityText.match(/\d{4}-\d{1,2}-\d{1,2}/);
        if (dateMatch) {
            endDate = new Date(dateMatch[0]);
            daysLeft = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
            isExpired = daysLeft < 0;
        }
    }
    
    return {
        startDate,
        endDate,
        isExpired,
        daysLeft
    };
}

/**
 * 导出模块
 */
window.CouponTypes = {
    COUPON_TYPES,
    COUPON_STATUS,
    getCouponType,
    calculateDiscount,
    checkCouponCondition,
    parseValidity
}; 