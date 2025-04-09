// 热门沙发款式数据
const hotModelsData = [
    { 
        id: 'XK-861', 
        name: 'XK-861', 
        image: '../images/sofa/861.jpg', 
        alt: '功能沙发 XK-861', 
        stock: '库存充足', 
        stockClass: 'in-stock', 
        price: '¥3,599', 
        features: ['可拆洗', '带收纳', '高回弹']
    },
    { 
        id: 'XK-899', 
        name: 'XK-899', 
        image: '../images/sofa/899.jpg', 
        alt: '功能沙发 XK-899', 
        stock: '库存紧张', 
        stockClass: 'low-stock', 
        price: '¥4,999', 
        features: ['电动调节', '高回弹', '带按摩'] 
    },
    { 
        id: 'XK-898', 
        name: 'XK-898', 
        image: '../images/sofa/898.jpg', 
        alt: '功能沙发 XK-898', 
        stock: '库存充足', 
        stockClass: 'in-stock', 
        price: '¥4,799', 
        features: ['智能控制', '带收纳', '可拆洗'] 
    },
    { 
        id: 'XK-895', 
        name: 'XK-895', 
        image: '../images/sofa/895.jpg', 
        alt: '功能沙发 XK-895', 
        stock: '库存充足', 
        stockClass: 'in-stock', 
        price: '¥4,299', 
        features: ['高度可调', '环保材质', '可拆洗'] 
    },
    { 
        id: 'L-101', 
        name: 'L-101', 
        image: '../images/sofa/750x1000-1.jpg', 
        alt: '拉床沙发 L-101', 
        stock: '库存充足', 
        stockClass: 'in-stock', 
        price: '¥3,799', 
        features: ['沙发床', '带收纳', '可拆洗'] 
    },
    { 
        id: 'JY-201', 
        name: 'JY-201', 
        image: '../images/sofa/09.jpg', 
        alt: '简约沙发 JY-201', 
        stock: '库存充足', 
        stockClass: 'in-stock', 
        price: '¥2,999', 
        features: ['简约设计', '轻巧结构', '环保材质'] 
    }
];

// 分类沙发型号数据
const categoryModelsData = {
    XK: [
        { id: 'XK-861', name: 'XK-861', image: '../images/sofa/861.jpg', alt: '功能沙发 XK-861', stock: '库存充足', stockClass: 'in-stock', price: '¥3,599', features: ['可拆洗', '带收纳', '高回弹'] },
        { id: 'XK-865', name: 'XK-865', image: '../images/sofa/865.jpg', alt: '功能沙发 XK-865', stock: '库存紧张', stockClass: 'low-stock', price: '¥3,899', features: ['电动调节', '带扶手', '智能控制'] },
        { id: 'XK-895', name: 'XK-895', image: '../images/sofa/895.jpg', alt: '功能沙发 XK-895', stock: '库存充足', stockClass: 'in-stock', price: '¥4,299', features: ['高度可调', '环保材质', '可拆洗'] },
        { id: 'XK-897', name: 'XK-897', image: '../images/sofa/897.jpg', alt: '功能沙发 XK-897', stock: '库存充足', stockClass: 'in-stock', price: '¥4,599', features: ['带按摩', '带充电', '可调节'] },
        { id: 'XK-898', name: 'XK-898', image: '../images/sofa/898.jpg', alt: '功能沙发 XK-898', stock: '库存充足', stockClass: 'in-stock', price: '¥4,799', features: ['可拆洗', '带收纳', '智能控制'] },
        { id: 'XK-899', name: 'XK-899', image: '../images/sofa/899.jpg', alt: '功能沙发 XK-899', stock: '库存紧张', stockClass: 'low-stock', price: '¥4,999', features: ['带按摩', '电动调节', '高回弹'] }
    ],
    L: [
        { id: 'L-101', name: 'L-101', image: '../images/sofa/750x1000-1.jpg', alt: '拉床沙发 L-101', stock: '库存充足', stockClass: 'in-stock', price: '¥3,799', features: ['沙发床', '可拆洗', '带收纳'] },
        { id: 'L-102', name: 'L-102', image: '../images/sofa/14.jpg', alt: '拉床沙发 L-102', stock: '预定', stockClass: 'out-of-stock', price: '¥4,199', features: ['沙发床', '环保材质', '可调节'] },
        { id: 'L-103', name: 'L-103', image: '../images/sofa/15.jpg', alt: '拉床沙发 L-103', stock: '库存充足', stockClass: 'in-stock', price: '¥4,599', features: ['沙发床', '可拆洗', '带收纳'] }
    ],
    JY: [
        { id: 'JY-201', name: 'JY-201', image: '../images/sofa/09.jpg', alt: '简约沙发 JY-201', stock: '库存充足', stockClass: 'in-stock', price: '¥2,999', features: ['简约设计', '环保材质', '轻巧结构'] },
        { id: 'JY-202', name: 'JY-202', image: '../images/sofa/12.jpg', alt: '简约沙发 JY-202', stock: '库存紧张', stockClass: 'low-stock', price: '¥3,199', features: ['简约设计', '可拆洗', '北欧风格'] },
        { id: 'JY-203', name: 'JY-203', image: '../images/sofa/17.jpg', alt: '简约沙发 JY-203', stock: '库存充足', stockClass: 'in-stock', price: '¥3,399', features: ['简约设计', '轻巧结构', '环保材质'] }
    ],
    HM: [
        { id: 'HM-01', name: 'HM-01', image: '../images/sofa/09.jpg', alt: '智能沙发 HM-01', stock: '库存充足', stockClass: 'in-stock', price: '¥5,599', features: ['智能控制', '语音助手', '可拆洗'] },
        { id: 'HM-02', name: 'HM-02', image: '../images/sofa/12.jpg', alt: '智能沙发 HM-02', stock: '库存充足', stockClass: 'in-stock', price: '¥6,799', features: ['智能控制', '组合设计', '便携性强'] }
    ]
};

// 分类名称映射
const categoryNames = {
    XK: "功能沙发",
    L: "拉床沙发",
    HM: "智能沙发",
    JY: "压缩沙发"
};

// 在页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 生成热门沙发列表
    generateHotModels();
    
    // 为分类按钮添加点击事件
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            document.querySelectorAll('.category-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 生成对应分类的沙发型号
            const category = this.getAttribute('data-category');
            updateModelsTitle(categoryNames[category] || '沙发型号');
            generateModelGrid(category);
        });
    });

    // 生成热门推荐沙发网格
    function generateHotModels() {
        const modelGrid = document.querySelector('.model-grid');
        const template = document.getElementById('model-template');
        
        // 清空现有内容
        modelGrid.innerHTML = '';
        updateModelsTitle('热门推荐');
        
        // 移除所有分类按钮的激活状态
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        
        // 生成热门沙发卡片
        hotModelsData.forEach(model => {
            generateModelCard(model, template, modelGrid);
        });
    }
    
    // 生成分类沙发型号网格
    function generateModelGrid(category) {
        const modelGrid = document.querySelector('.model-grid');
        const template = document.getElementById('model-template');
        
        // 清空现有内容
        modelGrid.innerHTML = '';
        
        // 检查该分类是否有数据
        if (!categoryModelsData[category] || categoryModelsData[category].length === 0) {
            modelGrid.innerHTML = '<div class="no-models">该分类暂无沙发型号</div>';
            return;
        }
        
        // 生成沙发型号卡片
        categoryModelsData[category].forEach(model => {
            generateModelCard(model, template, modelGrid);
        });
    }
    
    // 生成单个沙发卡片
    function generateModelCard(model, template, container) {
        const clone = document.importNode(template.content, true);
        
        // 设置图片
        const img = clone.querySelector('.model-image');
        img.src = model.image;
        img.alt = model.alt;
        
        // 设置库存状态
        const stockBadge = clone.querySelector('.model-stock-badge');
        stockBadge.textContent = model.stock;
        stockBadge.classList.add(model.stockClass);
        
        // 设置型号名称和价格
        clone.querySelector('.model-name').textContent = model.name;
        clone.querySelector('.model-price').textContent = model.price;
        
        // 添加功能标签
        const featuresContainer = clone.querySelector('.model-features');
        model.features.forEach(feature => {
            const featureTag = document.createElement('span');
            featureTag.className = 'feature-tag';
            featureTag.textContent = feature;
            featuresContainer.appendChild(featureTag);
        });
        
        // 为查看详情按钮添加事件
        const viewDetailsBtn = clone.querySelector('.view-details-btn');
        viewDetailsBtn.addEventListener('click', function() {
            // 选中这个型号
            selectModel(model.id);
            // 跳转到下一步
            const nextBtn = document.getElementById('nextStep');
            if (nextBtn) nextBtn.click();
        });
        
        // 为整个卡片添加点击事件
        const modelItem = clone.querySelector('.model-item');
        modelItem.addEventListener('click', function(e) {
            // 防止点击查看详情按钮时触发
            if (e.target !== viewDetailsBtn && !viewDetailsBtn.contains(e.target)) {
                // 选中这个型号
                selectModel(model.id);
            }
        });
        
        // 添加到容器
        container.appendChild(clone);
    }
    
    // 选中沙发型号
    function selectModel(modelId) {
        // 先移除所有已选中的状态
        document.querySelectorAll('.model-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // 为选中的型号添加选中状态
        const selectedModelItems = document.querySelectorAll('.model-item');
        for (let i = 0; i < selectedModelItems.length; i++) {
            const nameElement = selectedModelItems[i].querySelector('.model-name');
            if (nameElement && nameElement.textContent === modelId) {
                selectedModelItems[i].classList.add('selected');
                break;
            }
        }
        
        // 更新订单中的型号信息
        const modelSummary = document.querySelector('.step-content[data-step="5"] .flex.justify-between:nth-child(1) span:nth-child(2)');
        if (modelSummary) {
            modelSummary.textContent = modelId;
        }
        
        console.log('已选择沙发型号:', modelId);
        
        // 可以在这里添加其他选中沙发型号后的操作
    }
    
    // 更新型号展示区的标题
    function updateModelsTitle(titleText) {
        const titleElement = document.getElementById('models-title');
        if (titleElement) {
            // 根据标题类型设置不同的图标和样式
            if (titleText === '热门推荐') {
                titleElement.innerHTML = '<i class="fas fa-fire"></i> 热门推荐';
                titleElement.querySelector('i').style.color = '#EF4444';
            } else {
                titleElement.innerHTML = `<i class="fas fa-couch"></i> ${titleText}`;
                titleElement.querySelector('i').style.color = '#4F46E5';
            }
        }
    }
}); 