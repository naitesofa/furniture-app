/**
 * 沙发定制页面交互逻辑
 */

// 初始价格和配置
const defaultConfig = {
    basePrice: 0,
    modelPrice: 0,
    fabricPrice: 0,
    sizePrice: 0,
    priorityPrice: 0,
    tablePrice: 0
};

// 价格配置
const priceConfig = {
    // 沙发系列基础价格
    models: {
        'XK': {base: 5999, increment: 200}, // 功能沙发
        'L': {base: 4599, increment: 150},  // 拉床沙发
        'HM': {base: 3999, increment: 100}  // 压缩沙发
    },
    // 面料价格增量
    fabrics: {
        'leather': 1200,  // 天然皮革
        'velvet': 800,    // 丝绒
        'linen': 500,     // 亚麻
        'microfiber': 300 // 超细纤维
    },
    // 茶几价格
    tables: {
        'none': 0,       // 无茶几
        'wood': 1200,    // 水曲柳
        'marble': 1800   // 白理石
    },
    // 生产优先级
    priority: {
        'normal': 0,     // 一般
        'urgent': 200    // 加急
    },
    // 自定义尺寸每增加10cm价格
    customSize: {
        base: 0,         // 10cm以内免费
        increment: 100   // 每增加10cm加价100元
    }
};

// 尺寸范围
const sizeRangeConfig = {
    min: 1,
    max: 500
};

// 标准尺寸配置
const standardSizes = {
    'XK-901': {length: 280, width: 100, height: 80},
    'L-308': {length: 290, width: 98, height: 75},
    'HM-01': {length: 250, width: 90, height: 70},
    // 可以根据需要添加更多型号尺寸
};

// 当前配置
let currentConfig = {
    model: '',
    fabric: '',
    color: '',
    sizeType: 'standard',
    customSize: {
        length: 0,
        width: 0,
        height: 0
    },
    priority: 'normal',
    customText: '',
    table: 'none',
    quantity: 1,
    remarks: '',
    totalPrice: 0
};

// 当前步骤
let currentStep = 1;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化型号选择器
    initModelSelects();
    
    // 绑定事件监听
    bindEventListeners();
    
    // 更新总价
    updateTotalPrice();

    // 初始化步骤导航
    initStepNavigation();
});

/**
 * 初始化步骤导航和滑动功能
 */
function initStepNavigation() {
    // 显示第一个步骤
    showStep(1);

    // 绑定步骤导航点击事件
    document.querySelectorAll('.step').forEach(stepElement => {
        stepElement.addEventListener('click', function() {
            const stepNumber = parseInt(this.dataset.step);
            if (canNavigateToStep(stepNumber)) {
                navigateToStep(stepNumber);
            }
        });
    });

    // 绑定下一步按钮事件
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.dataset.toStep);
            navigateToStep(nextStep);
        });
    });

    // 绑定上一步按钮事件
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.dataset.toStep);
            navigateToStep(prevStep);
        });
    });

    // 监听型号选择变化，控制第一步的"下一步"按钮状态
    document.querySelectorAll('.model-select').forEach(select => {
        select.addEventListener('change', function() {
            const nextButton = document.querySelector('.next-step[data-to-step="2"]');
            if (currentConfig.model) {
                nextButton.disabled = false;
            } else {
                nextButton.disabled = true;
            }
        });
    });

    // 监听面料选择变化，控制第二步的"下一步"按钮状态
    document.querySelectorAll('.fabric-option').forEach(option => {
        option.addEventListener('click', function() {
            const nextButton = document.querySelector('.next-step[data-to-step="3"]');
            if (currentConfig.fabric) {
                nextButton.disabled = false;
            } else {
                nextButton.disabled = true;
            }
        });
    });

    // 绑定提交订单按钮
    document.getElementById('submit-order').addEventListener('click', function(e) {
        e.preventDefault();
        if (validateForm()) {
            alert('订单已提交成功！总价: ¥' + currentConfig.totalPrice);
        }
    });

    // 预览切换功能
    document.getElementById('toggle-preview').addEventListener('click', function() {
        document.getElementById('preview-detailed').classList.remove('hidden');
    });

    document.getElementById('close-preview').addEventListener('click', function() {
        document.getElementById('preview-detailed').classList.add('hidden');
    });

    // 滑动手势支持
    initSwipeGesture();
}

/**
 * 初始化滑动手势支持
 */
function initSwipeGesture() {
    const slider = document.getElementById('steps-slider');
    let startX, moveX, initialX;
    let threshold = 50; // 滑动阈值

    slider.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        initialX = parseInt(getComputedStyle(slider).transform.split(',')[4]) || 0;
    }, { passive: true });

    slider.addEventListener('touchmove', function(e) {
        moveX = e.touches[0].clientX;
        const diffX = moveX - startX;
        const newX = initialX + diffX;
        
        // 限制滑动范围
        if (newX > 0 || newX < -slider.clientWidth * 4) return;
        
        slider.style.transform = `translateX(${newX}px)`;
    }, { passive: true });

    slider.addEventListener('touchend', function(e) {
        const diffX = moveX - startX;
        
        if (Math.abs(diffX) >= threshold) {
            // 向左滑动
            if (diffX < 0 && currentStep < 5) {
                if (canNavigateToStep(currentStep + 1)) {
                    navigateToStep(currentStep + 1);
                } else {
                    // 恢复原位
                    showStep(currentStep);
                }
            }
            // 向右滑动
            else if (diffX > 0 && currentStep > 1) {
                navigateToStep(currentStep - 1);
            } else {
                // 恢复原位
                showStep(currentStep);
            }
        } else {
            // 恢复原位
            showStep(currentStep);
        }
    }, { passive: true });
}

/**
 * 检查是否可以导航到指定步骤
 */
function canNavigateToStep(stepNumber) {
    // 总是允许向后导航
    if (stepNumber < currentStep) return true;
    
    // 检查是否可以向前导航
    switch(stepNumber) {
        case 2: // 导航到步骤2（面料选择）需要先选择型号
            return !!currentConfig.model;
        case 3: // 导航到步骤3（尺寸规格）需要先选择面料
            return !!currentConfig.fabric;
        default:
            return true;
    }
}

/**
 * 导航到指定步骤
 */
function navigateToStep(stepNumber) {
    if (stepNumber >= 1 && stepNumber <= 5) {
        // 更新步骤状态
        updateStepStatuses(stepNumber);
        
        // 显示步骤
        showStep(stepNumber);
        
        // 更新当前步骤
        currentStep = stepNumber;
        
        // 如果是最后一步，更新订单摘要
        if (stepNumber === 5) {
            updateOrderSummary();
        }
    }
}

/**
 * 显示指定步骤
 */
function showStep(stepNumber) {
    // 计算滑动位置
    const slider = document.getElementById('steps-slider');
    const translateX = (stepNumber - 1) * -100;
    slider.style.transform = `translateX(${translateX}%)`;
}

/**
 * 更新步骤状态
 */
function updateStepStatuses(currentStepNumber) {
    document.querySelectorAll('.step').forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        
        // 清除所有状态
        step.classList.remove('active', 'completed');
        
        if (stepNumber === currentStepNumber) {
            // 当前步骤
            step.classList.add('active');
        } else if (stepNumber < currentStepNumber) {
            // 已完成步骤
            step.classList.add('completed');
        }
    });
}

/**
 * 更新订单摘要信息
 */
function updateOrderSummary() {
    document.getElementById('summary-model').textContent = currentConfig.model || '未选择';
    
    let fabricText = '';
    if (currentConfig.fabric) {
        const fabricNames = {
            'leather': '天然皮革',
            'velvet': '丝绒',
            'linen': '亚麻',
            'microfiber': '超细纤维'
        };
        fabricText = fabricNames[currentConfig.fabric];
        
        if (currentConfig.color) {
            const colorNames = {
                'beige': '米色',
                'brown': '棕色',
                'gray': '灰色',
                'blue': '蓝色',
                'green': '绿色',
                'black': '黑色'
            };
            fabricText += ' (' + colorNames[currentConfig.color] + ')';
        }
    } else {
        fabricText = '未选择';
    }
    document.getElementById('summary-fabric').textContent = fabricText;
    
    document.getElementById('summary-size').textContent = document.getElementById('selected-size').textContent;
    document.getElementById('summary-priority').textContent = currentConfig.priority === 'normal' ? '一般' : '加急';
    document.getElementById('summary-text').textContent = currentConfig.customText || '无';
    
    const tableNames = {
        'none': '无',
        'wood': '水曲柳茶几',
        'marble': '白理石茶几'
    };
    document.getElementById('summary-table').textContent = tableNames[currentConfig.table];
    
    document.getElementById('summary-quantity').textContent = currentConfig.quantity;
    document.getElementById('summary-price').textContent = '¥' + currentConfig.totalPrice.toLocaleString();
}

/**
 * 初始化型号选择下拉框
 */
function initModelSelects() {
    // XK系列 (功能沙发): XK-901 到 XK-978
    const xkSelect = document.querySelector('.model-select[data-prefix="XK"]');
    for (let i = 901; i <= 978; i++) {
        const option = document.createElement('option');
        option.value = `XK-${i}`;
        option.textContent = `XK-${i}`;
        xkSelect.appendChild(option);
    }
    
    // L系列 (拉床沙发): L-301 到 L-396
    const lSelect = document.querySelector('.model-select[data-prefix="L"]');
    for (let i = 301; i <= 396; i++) {
        const option = document.createElement('option');
        option.value = `L-${i}`;
        option.textContent = `L-${i}`;
        lSelect.appendChild(option);
    }
    
    // HM系列 (压缩沙发): HM-01 到 HM-98
    const hmSelect = document.querySelector('.model-select[data-prefix="HM"]');
    for (let i = 1; i <= 98; i++) {
        const option = document.createElement('option');
        const num = i.toString().padStart(2, '0');
        option.value = `HM-${num}`;
        option.textContent = `HM-${num}`;
        hmSelect.appendChild(option);
    }
}

/**
 * 绑定所有事件监听器
 */
function bindEventListeners() {
    // 型号选择事件
    document.querySelectorAll('.model-select').forEach(select => {
        select.addEventListener('change', handleModelChange);
    });
    
    // 点击型号类别事件
    document.querySelectorAll('.model-category').forEach(category => {
        category.addEventListener('click', function() {
            // 获取对应的下拉框
            const select = this.querySelector('.model-select');
            if (select) {
                select.focus();
            }
        });
    });
    
    // 面料选择事件
    document.querySelectorAll('.fabric-option').forEach(option => {
        option.addEventListener('click', handleFabricChange);
    });
    
    // 颜色选择事件
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', handleColorChange);
    });
    
    // 尺寸类型选择事件
    document.querySelectorAll('input[name="size-type"]').forEach(radio => {
        radio.addEventListener('change', handleSizeTypeChange);
    });
    
    // 自定义尺寸输入事件
    document.querySelectorAll('#length-input, #width-input, #height-input').forEach(input => {
        input.addEventListener('input', handleCustomSizeChange);
    });
    
    // 生产要求选择事件
    document.querySelectorAll('input[name="priority"]').forEach(radio => {
        radio.addEventListener('change', handlePriorityChange);
    });
    
    // 定制字样输入事件
    document.getElementById('custom-text').addEventListener('input', handleCustomTextChange);
    
    // 茶几选择事件
    document.querySelectorAll('.table-option').forEach(option => {
        option.addEventListener('click', handleTableChange);
    });
    
    // 数量调整事件
    document.getElementById('decrease-quantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity');
        if (parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            handleQuantityChange();
        }
    });
    
    document.getElementById('increase-quantity').addEventListener('click', function() {
        const quantityInput = document.getElementById('quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
        handleQuantityChange();
    });
    
    document.getElementById('quantity').addEventListener('change', handleQuantityChange);
    
    // 备注输入事件
    document.getElementById('remarks').addEventListener('input', handleRemarksChange);
    
    // 申请寄送皮样按钮
    document.getElementById('request-sample').addEventListener('click', function() {
        document.getElementById('sample-modal').classList.remove('hidden');
    });
    
    // 关闭样品弹窗
    document.getElementById('close-sample-modal').addEventListener('click', function() {
        document.getElementById('sample-modal').classList.add('hidden');
    });
    
    // 样品申请表单提交
    document.getElementById('sample-form').addEventListener('submit', function(e) {
        e.preventDefault();
        // 这里可以添加样品申请表单的处理逻辑
        alert('样品申请已提交，我们将尽快安排寄送！');
        document.getElementById('sample-modal').classList.add('hidden');
    });
}

/**
 * 表单验证
 */
function validateForm() {
    let isValid = true;
    
    // 验证型号是否已选
    if (!currentConfig.model) {
        alert('请选择沙发型号');
        navigateToStep(1);
        isValid = false;
    }
    
    // 验证面料是否已选
    else if (!currentConfig.fabric) {
        alert('请选择面料材质');
        navigateToStep(2);
        isValid = false;
    }
    
    // 验证自定义尺寸
    else if (currentConfig.sizeType === 'custom') {
        const length = document.getElementById('length-input').value;
        const width = document.getElementById('width-input').value;
        const height = document.getElementById('height-input').value;
        
        if (!length || !width || !height) {
            alert('请完整填写自定义尺寸');
            navigateToStep(3);
            isValid = false;
        }
    }
    
    return isValid;
}

/**
 * 处理型号选择变化
 */
function handleModelChange(e) {
    const selectedModel = e.target.value;
    if (!selectedModel) return;
    
    // 更新当前配置
    currentConfig.model = selectedModel;
    
    // 更新预览区域显示
    document.getElementById('selected-model').textContent = selectedModel;
    document.getElementById('selected-model-mini').textContent = selectedModel;
    
    // 提取系列前缀
    const seriesPrefix = selectedModel.split('-')[0];
    
    // 更新价格
    const seriesConfig = priceConfig.models[seriesPrefix];
    if (seriesConfig) {
        // 计算型号价格 (基础价 + 增量 * 型号数字部分)
        const modelNum = parseInt(selectedModel.split('-')[1]);
        defaultConfig.modelPrice = seriesConfig.base;
        
        // 更新标准尺寸信息
        updateStandardSizeInfo(selectedModel);
    }
    
    // 更新总价
    updateTotalPrice();
    
    // 更新型号类别的选中状态
    document.querySelectorAll('.model-category').forEach(category => {
        if (category.dataset.category === seriesPrefix) {
            category.classList.add('active');
        } else {
            category.classList.remove('active');
        }
    });
    
    // 更新预览图片（这里可以根据不同型号显示不同图片）
    updatePreviewImage(selectedModel);

    // 启用下一步按钮
    const nextButton = document.querySelector('.next-step[data-to-step="2"]');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

/**
 * 更新标准尺寸信息
 */
function updateStandardSizeInfo(model) {
    const defaultSizeElement = document.getElementById('default-size');
    
    // 如果有预设的标准尺寸
    if (standardSizes[model]) {
        const size = standardSizes[model];
        defaultSizeElement.textContent = `${size.length}cm × ${size.width}cm × ${size.height}cm`;
        
        // 如果当前是自定义尺寸模式，预填充标准尺寸作为起点
        if (currentConfig.sizeType === 'custom') {
            document.getElementById('length-input').value = size.length;
            document.getElementById('width-input').value = size.width;
            document.getElementById('height-input').value = size.height;
            
            // 更新自定义尺寸配置
            currentConfig.customSize = {
                length: size.length,
                width: size.width,
                height: size.height
            };
        }
    } else {
        // 通用的默认尺寸展示
        const seriesPrefix = model.split('-')[0];
        switch(seriesPrefix) {
            case 'XK':
                defaultSizeElement.textContent = "约 280cm × 100cm × 80cm (功能沙发标准尺寸)";
                break;
            case 'L':
                defaultSizeElement.textContent = "约 290cm × 98cm × 75cm (拉床沙发标准尺寸)";
                break;
            case 'HM':
                defaultSizeElement.textContent = "约 250cm × 90cm × 70cm (压缩沙发标准尺寸)";
                break;
            default:
                defaultSizeElement.textContent = "请先选择沙发型号";
        }
    }
}

/**
 * 处理面料选择变化
 */
function handleFabricChange(e) {
    const selectedFabric = this.dataset.fabric;
    
    // 更新当前配置
    currentConfig.fabric = selectedFabric;
    
    // 更新预览区域显示
    const fabricNames = {
        'leather': '天然皮革',
        'velvet': '丝绒',
        'linen': '亚麻',
        'microfiber': '超细纤维'
    };
    document.getElementById('selected-fabric').textContent = fabricNames[selectedFabric];
    document.getElementById('selected-fabric-mini').textContent = fabricNames[selectedFabric];
    
    // 更新价格
    defaultConfig.fabricPrice = priceConfig.fabrics[selectedFabric] || 0;
    
    // 更新总价
    updateTotalPrice();
    
    // 更新面料选项的选中状态
    document.querySelectorAll('.fabric-option').forEach(option => {
        if (option.dataset.fabric === selectedFabric) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 显示颜色选择区域
    document.getElementById('color-selection').classList.remove('hidden');
    
    // 更新预览图片
    // updatePreviewImage();

    // 启用下一步按钮
    const nextButton = document.querySelector('.next-step[data-to-step="3"]');
    if (nextButton) {
        nextButton.disabled = false;
    }
}

/**
 * 处理颜色选择变化
 */
function handleColorChange() {
    const selectedColor = this.dataset.color;
    
    // 更新当前配置
    currentConfig.color = selectedColor;
    
    // 更新颜色选项的选中状态
    document.querySelectorAll('.color-option').forEach(option => {
        if (option.dataset.color === selectedColor) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 更新面料显示 (添加颜色信息)
    const colorNames = {
        'beige': '米色',
        'brown': '棕色',
        'gray': '灰色',
        'blue': '蓝色',
        'green': '绿色',
        'black': '黑色'
    };
    
    const fabricElement = document.getElementById('selected-fabric');
    const fabricMiniElement = document.getElementById('selected-fabric-mini');
    
    if (fabricElement.textContent.indexOf('(') > -1) {
        fabricElement.textContent = fabricElement.textContent.split('(')[0] + '(' + colorNames[selectedColor] + ')';
        fabricMiniElement.textContent = fabricMiniElement.textContent.split('(')[0] + '(' + colorNames[selectedColor] + ')';
    } else {
        fabricElement.textContent += ' (' + colorNames[selectedColor] + ')';
        fabricMiniElement.textContent += ' (' + colorNames[selectedColor] + ')';
    }
    
    // 更新预览图片
    // updatePreviewImage();
}

/**
 * 处理尺寸类型变化
 */
function handleSizeTypeChange() {
    const sizeType = this.value;
    
    // 更新当前配置
    currentConfig.sizeType = sizeType;
    
    // 显示/隐藏相关区域
    if (sizeType === 'standard') {
        document.getElementById('standard-size-info').classList.remove('hidden');
        document.getElementById('custom-size-inputs').classList.add('hidden');
        
        // 重置自定义尺寸价格
        defaultConfig.sizePrice = 0;
        
        // 更新预览区域显示
        document.getElementById('selected-size').textContent = '标准尺寸';
    } else {
        document.getElementById('standard-size-info').classList.add('hidden');
        document.getElementById('custom-size-inputs').classList.remove('hidden');
        
        // 如果已经选择了型号，预填充标准尺寸
        if (currentConfig.model) {
            const seriesPrefix = currentConfig.model.split('-')[0];
            let defaultSize = {length: 0, width: 0, height: 0};
            
            // 获取标准尺寸作为起点
            if (standardSizes[currentConfig.model]) {
                defaultSize = standardSizes[currentConfig.model];
            } else {
                // 通用默认尺寸
                switch(seriesPrefix) {
                    case 'XK':
                        defaultSize = {length: 280, width: 100, height: 80};
                        break;
                    case 'L':
                        defaultSize = {length: 290, width: 98, height: 75};
                        break;
                    case 'HM':
                        defaultSize = {length: 250, width: 90, height: 70};
                        break;
                }
            }
            
            // 填充输入框
            document.getElementById('length-input').value = defaultSize.length;
            document.getElementById('width-input').value = defaultSize.width;
            document.getElementById('height-input').value = defaultSize.height;
            
            // 更新自定义尺寸配置
            currentConfig.customSize = defaultSize;
            
            // 更新预览区域显示
            document.getElementById('selected-size').textContent = 
                `自定义: ${defaultSize.length}cm × ${defaultSize.width}cm × ${defaultSize.height}cm`;
        }
    }
    
    // 更新总价
    updateTotalPrice();
}

/**
 * 处理自定义尺寸变化
 */
function handleCustomSizeChange() {
    // 仅在自定义尺寸模式下处理
    if (currentConfig.sizeType !== 'custom') return;
    
    // 获取输入值
    const length = parseInt(document.getElementById('length-input').value) || 0;
    const width = parseInt(document.getElementById('width-input').value) || 0;
    const height = parseInt(document.getElementById('height-input').value) || 0;
    
    // 限制输入范围
    const validateInput = (input, id) => {
        const element = document.getElementById(id);
        if (input < sizeRangeConfig.min) {
            element.value = sizeRangeConfig.min;
            return sizeRangeConfig.min;
        }
        if (input > sizeRangeConfig.max) {
            element.value = sizeRangeConfig.max;
            return sizeRangeConfig.max;
        }
        return input;
    };
    
    const validLength = validateInput(length, 'length-input');
    const validWidth = validateInput(width, 'width-input');
    const validHeight = validateInput(height, 'height-input');
    
    // 更新自定义尺寸配置
    currentConfig.customSize = {
        length: validLength,
        width: validWidth,
        height: validHeight
    };
    
    // 更新预览区域显示
    if (validLength && validWidth && validHeight) {
        document.getElementById('selected-size').textContent = 
            `自定义: ${validLength}cm × ${validWidth}cm × ${validHeight}cm`;
    }
    
    // 计算自定义尺寸价格增量
    calculateCustomSizePrice();
    
    // 更新总价
    updateTotalPrice();
}

/**
 * 计算自定义尺寸价格增量
 */
function calculateCustomSizePrice() {
    // 仅在自定义尺寸模式下计算
    if (currentConfig.sizeType !== 'custom') {
        defaultConfig.sizePrice = 0;
        return;
    }
    
    // 获取标准尺寸作为基准
    let standardSize = {length: 0, width: 0, height: 0};
    
    if (currentConfig.model) {
        const seriesPrefix = currentConfig.model.split('-')[0];
        
        if (standardSizes[currentConfig.model]) {
            standardSize = standardSizes[currentConfig.model];
        } else {
            // 通用默认尺寸
            switch(seriesPrefix) {
                case 'XK':
                    standardSize = {length: 280, width: 100, height: 80};
                    break;
                case 'L':
                    standardSize = {length: 290, width: 98, height: 75};
                    break;
                case 'HM':
                    standardSize = {length: 250, width: 90, height: 70};
                    break;
            }
        }
    }
    
    // 计算尺寸差异
    const lengthDiff = Math.abs(currentConfig.customSize.length - standardSize.length);
    const widthDiff = Math.abs(currentConfig.customSize.width - standardSize.width);
    const heightDiff = Math.abs(currentConfig.customSize.height - standardSize.height);
    
    // 总尺寸差异
    const totalDiff = lengthDiff + widthDiff + heightDiff;
    
    // 计算价格增量: 10cm以内免费，每增加10cm加价100元
    if (totalDiff <= 10) {
        defaultConfig.sizePrice = 0;
    } else {
        const extraSize = totalDiff - 10;
        const extraSizeFactor = Math.ceil(extraSize / 10);
        defaultConfig.sizePrice = extraSizeFactor * priceConfig.customSize.increment;
    }
}

/**
 * 处理生产要求变化
 */
function handlePriorityChange() {
    const priority = this.value;
    
    // 更新当前配置
    currentConfig.priority = priority;
    
    // 更新预览区域显示
    document.getElementById('selected-priority').textContent = priority === 'normal' ? '一般' : '加急';
    
    // 更新价格
    defaultConfig.priorityPrice = priceConfig.priority[priority] || 0;
    
    // 更新总价
    updateTotalPrice();
}

/**
 * 处理定制字样变化
 */
function handleCustomTextChange() {
    // 更新当前配置
    currentConfig.customText = this.value;
}

/**
 * 处理茶几选择变化
 */
function handleTableChange() {
    const selectedTable = this.dataset.table;
    
    // 更新当前配置
    currentConfig.table = selectedTable;
    
    // 更新预览区域显示
    const tableNames = {
        'none': '无',
        'wood': '水曲柳茶几',
        'marble': '白理石茶几'
    };
    document.getElementById('selected-table').textContent = tableNames[selectedTable];
    
    // 更新价格
    defaultConfig.tablePrice = priceConfig.tables[selectedTable] || 0;
    
    // 更新总价
    updateTotalPrice();
    
    // 更新茶几选项的选中状态
    document.querySelectorAll('.table-option').forEach(option => {
        if (option.dataset.table === selectedTable) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // 更新预览图片
    // updatePreviewImage();
}

/**
 * 处理数量变化
 */
function handleQuantityChange() {
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    // 确保数量至少为1
    if (quantity < 1) {
        document.getElementById('quantity').value = 1;
        currentConfig.quantity = 1;
    } else {
        currentConfig.quantity = quantity;
    }
    
    // 更新预览区域显示
    document.getElementById('selected-quantity').textContent = currentConfig.quantity;
    
    // 更新总价
    updateTotalPrice();
}

/**
 * 处理备注变化
 */
function handleRemarksChange() {
    // 更新当前配置
    currentConfig.remarks = this.value;
}

/**
 * 更新总价
 */
function updateTotalPrice() {
    // 基础价 = 型号价格
    const basePrice = defaultConfig.modelPrice;
    
    // 计算单件总价
    const singlePrice = basePrice + 
                        defaultConfig.fabricPrice + 
                        defaultConfig.sizePrice + 
                        defaultConfig.priorityPrice + 
                        defaultConfig.tablePrice;
    
    // 总价 = 单件价格 * 数量
    currentConfig.totalPrice = singlePrice * currentConfig.quantity;
    
    // 更新显示
    const totalPriceElements = document.querySelectorAll('#total-price, #total-price-mini, #summary-price');
    totalPriceElements.forEach(element => {
        // 添加动画效果
        element.classList.add('price-change');
        element.textContent = '¥' + currentConfig.totalPrice.toLocaleString();
        
        // 移除动画效果（用于下次触发）
        setTimeout(() => {
            element.classList.remove('price-change');
        }, 500);
    });
}

/**
 * 更新预览图片
 * 注意：实际应用中应该根据所选配置加载相应的图片
 */
function updatePreviewImage(model) {
    const previewImage = document.getElementById('sofa-preview');
    const previewLargeImage = document.getElementById('sofa-preview-large');
    
    // 可以根据型号、面料和颜色组合来显示不同的预览图
    // 这里简单示例根据沙发系列切换图片
    if (model) {
        const series = model.split('-')[0];
        let imageUrl = '';
        
        switch(series) {
            case 'XK':
                imageUrl = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80";
                break;
            case 'L':
                imageUrl = "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80";
                break;
            case 'HM':
                imageUrl = "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300&q=80";
                break;
        }
        
        if (imageUrl) {
            previewImage.src = imageUrl;
            
            if (previewLargeImage) {
                previewLargeImage.src = imageUrl;
            }
        }
    }
} 