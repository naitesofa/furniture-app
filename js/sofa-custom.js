// 沙发型号数据
const sofaData = {
    XK: {
        name: "功能沙发",
        models: Array.from({length: 41}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [];
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '可拆洗', icon: 'fas fa-tint-slash' },
                { name: '带收纳', icon: 'fas fa-box' },
                { name: '可调节', icon: 'fas fa-sync-alt' },
                { name: '沙发床', icon: 'fas fa-bed' },
                { name: '智能控制', icon: 'fas fa-robot' },
                { name: '电动调节', icon: 'fas fa-cogs' },
                { name: '高度可调', icon: 'fas fa-arrows-alt-v' },
                { name: '环保材质', icon: 'fas fa-leaf' },
                { name: '带按摩', icon: 'fas fa-spa' },
                { name: '带扶手', icon: 'fas fa-hand-paper' },
                { name: '带充电', icon: 'fas fa-plug' }
            ];
            
            // 随机选择2-3个功能标签
            const numFeatures = 2 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `XK-${940 + i}`,
                name: `XK-${940 + i}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,functional,${940 + i}`,
                stock: Math.random() > 0.7 ? "库存紧张" : "库存充足",
                stockClass: Math.random() > 0.7 ? "text-orange-500" : "text-green-500",
                price: `${2 + Math.floor(Math.random() * 5)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    L: {
        name: "拉床沙发",
        models: Array.from({length: 10}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '沙发床', icon: 'fas fa-bed' }]; // 拉床沙发必定有沙发床功能
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '可拆洗', icon: 'fas fa-tint-slash' },
                { name: '带收纳', icon: 'fas fa-box' },
                { name: '可调节', icon: 'fas fa-sync-alt' },
                { name: '环保材质', icon: 'fas fa-leaf' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 1 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `L-${301 + i}`,
                name: `L-${301 + i}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,bed,${301 + i}`,
                stock: Math.random() > 0.8 ? "预定" : "库存充足",
                stockClass: Math.random() > 0.8 ? "text-red-500" : "text-green-500",
                price: `${3 + Math.floor(Math.random() * 3)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    HM: {
        name: "压缩沙发",
        models: Array.from({length: 10}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '压缩设计', icon: 'fas fa-compress-alt' }]; // 压缩沙发必定有压缩功能
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '可拆洗', icon: 'fas fa-tint-slash' },
                { name: '小巧轻便', icon: 'fas fa-feather' },
                { name: '组合设计', icon: 'fas fa-th-large' },
                { name: '便携性强', icon: 'fas fa-dolly' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 1 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `HM-${i < 9 ? '0' : ''}${i + 1}`,
                name: `HM-${i < 9 ? '0' : ''}${i + 1}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,compact,${i + 1}`,
                stock: "库存充足",
                stockClass: "text-green-500",
                price: `${2 + Math.floor(Math.random() * 2)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    JY: {
        name: "简约沙发",
        models: Array.from({length: 11}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '简约设计', icon: 'fas fa-minus' }]; // 简约沙发必定有简约设计
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '可拆洗', icon: 'fas fa-tint-slash' },
                { name: '环保材质', icon: 'fas fa-leaf' },
                { name: '轻巧结构', icon: 'fas fa-feather' },
                { name: '北欧风格', icon: 'fas fa-mountain' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 1 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `JY-${i + 10}`,
                name: `JY-${i + 10}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,minimal,${i + 10}`,
                stock: Math.random() > 0.6 ? "库存紧张" : "库存充足",
                stockClass: Math.random() > 0.6 ? "text-orange-500" : "text-green-500",
                price: `${3 + Math.floor(Math.random() * 2)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    KF: {
        name: "咖啡沙发",
        models: Array.from({length: 8}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '杯架', icon: 'fas fa-coffee' }]; // 咖啡沙发必定有杯架
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '防污面料', icon: 'fas fa-shield-alt' },
                { name: '休闲设计', icon: 'fas fa-couch' },
                { name: '带小桌板', icon: 'fas fa-tablet-alt' },
                { name: '可拆洗', icon: 'fas fa-tint-slash' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 1 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `KF-${i + 1}`,
                name: `KF-${i + 1}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,coffee,${i + 1}`,
                stock: Math.random() > 0.5 ? "库存紧张" : "库存充足",
                stockClass: Math.random() > 0.5 ? "text-orange-500" : "text-green-500",
                price: `${4 + Math.floor(Math.random() * 3)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    CS: {
        name: "超舒适沙发",
        models: Array.from({length: 6}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '超舒适', icon: 'fas fa-cloud' }]; // 超舒适沙发必定有超舒适标签
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '加厚坐垫', icon: 'fas fa-plus' },
                { name: '靠背可调', icon: 'fas fa-angle-double-up' },
                { name: '带按摩', icon: 'fas fa-spa' },
                { name: '高回弹', icon: 'fas fa-redo' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 2 + Math.floor(Math.random() * 2); // 超舒适沙发有更多特点
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `CS-${i + 101}`,
                name: `CS-${i + 101}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,comfort,${i + 101}`,
                stock: "库存充足",
                stockClass: "text-green-500",
                price: `${3 + Math.floor(Math.random() * 4)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    },
    YZ: {
        name: "颜值沙发",
        models: Array.from({length: 9}, (_, i) => {
            // 为每个沙发添加随机功能标签
            const features = [{ name: '高颜值', icon: 'fas fa-crown' }]; // 颜值沙发必定有高颜值标签
            
            // 可能的功能标签列表
            const possibleFeatures = [
                { name: '科技面料', icon: 'fas fa-atom' },
                { name: '轻奢设计', icon: 'fas fa-gem' },
                { name: '艺术靠包', icon: 'fas fa-palette' },
                { name: '独特造型', icon: 'fas fa-star' }
            ];
            
            // 随机选择1-2个额外功能标签
            const numFeatures = 1 + Math.floor(Math.random() * 2);
            const shuffled = [...possibleFeatures].sort(() => 0.5 - Math.random());
            features.push(...shuffled.slice(0, numFeatures));
            
            return {
                id: `YZ-${i + 201}`,
                name: `YZ-${i + 201}`,
                image: `https://source.unsplash.com/featured/500x400/?sofa,luxury,${i + 201}`,
                stock: Math.random() > 0.7 ? "预定" : "库存充足",
                stockClass: Math.random() > 0.7 ? "text-red-500" : "text-green-500",
                price: `${5 + Math.floor(Math.random() * 5)},${Math.floor(Math.random() * 10)}99`,
                features: features
            };
        })
    }
};

// 切换标准/智能定制
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        // 执行翻转动画
        const flipper = document.querySelector('.flipper');
        if (this.dataset.tab === 'ai') {
            flipper.classList.add('flipped');
        } else {
            flipper.classList.remove('flipped');
        }
    });
});

// 处理沙发分类横向滚动指示器
const sofaCategoriesRows = document.querySelectorAll('.sofa-categories-row');
const row1Indicators = document.querySelectorAll('.row1-indicator .indicator-dot');
const row2Indicators = document.querySelectorAll('.row2-indicator .indicator-dot');

function setupScrollIndicator(rowElement, indicatorDots) {
    if (!rowElement || indicatorDots.length === 0) return;

    // 计算每个滚动区域的宽度
    const updateScrollIndicator = () => {
        const scrollWidth = rowElement.scrollWidth;
        const clientWidth = rowElement.clientWidth;
        
        if (scrollWidth <= clientWidth) {
            // 如果内容不需要滚动，隐藏指示器
            indicatorDots[0].parentElement.style.display = 'none';
            return;
        } else {
            indicatorDots[0].parentElement.style.display = 'flex';
        }
        
        const scrollPosition = rowElement.scrollLeft;
        const maxScroll = scrollWidth - clientWidth;
        
        // 计算当前滚动位置对应的指示器
        const sections = indicatorDots.length;
        const sectionSize = maxScroll / sections;
        const activeSection = Math.min(Math.floor(scrollPosition / sectionSize), sections - 1);
        
        // 更新指示器状态
        indicatorDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeSection);
        });
    };
    
    // 监听滚动事件
    rowElement.addEventListener('scroll', updateScrollIndicator);
    
    // 初始化指示器
    window.addEventListener('resize', updateScrollIndicator);
    updateScrollIndicator();
    
    // 点击指示器跳转到对应位置
    indicatorDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const scrollWidth = rowElement.scrollWidth;
            const clientWidth = rowElement.clientWidth;
            const maxScroll = scrollWidth - clientWidth;
            const sections = indicatorDots.length;
            const sectionSize = maxScroll / sections;
            
            rowElement.scrollTo({
                left: index * sectionSize,
                behavior: 'smooth'
            });
        });
    });
}

// 为两行分别设置滚动指示器
if (sofaCategoriesRows.length >= 1) {
    setupScrollIndicator(sofaCategoriesRows[0], row1Indicators);
}
if (sofaCategoriesRows.length >= 2) {
    setupScrollIndicator(sofaCategoriesRows[1], row2Indicators);
}

// 型号选择
document.querySelectorAll('.model-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.model-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 模态框功能
const sofaModal = document.getElementById('sofaModal');
const modalOverlay = document.getElementById('modalOverlay');
const closeModalBtn = document.querySelector('.close-modal');
const sofaList = document.getElementById('sofaList');
const modalTitle = document.querySelector('.modal-title');

// 初始化沙发型号数据
const sofaModels = [
    {
        id: 'CS-101',
        name: '现代简约沙发',
        category: 'JY',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,modern,101',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '2,999',
        features: [
            { name: '可拆洗', icon: 'fas fa-tint-slash' },
            { name: '带收纳', icon: 'fas fa-box' }
        ]
    },
    {
        id: 'CS-102',
        name: '北欧风格沙发',
        category: 'JY',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,nordic,102',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '3,599',
        features: [
            { name: '可拆洗', icon: 'fas fa-tint-slash' },
            { name: '环保材质', icon: 'fas fa-leaf' }
        ]
    },
    // XK-962 到 XK-987 功能沙发型号
    {
        id: 'XK-962',
        name: '多功能转角沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,corner,962',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,899',
        features: [
            { name: '可调节', icon: 'fas fa-sync-alt' },
            { name: '带收纳', icon: 'fas fa-box' }
        ]
    },
    {
        id: 'XK-963',
        name: '智能功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,smart,963',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '5,999',
        features: [
            { name: '智能控制', icon: 'fas fa-robot' },
            { name: '电动调节', icon: 'fas fa-cogs' }
        ]
    },
    {
        id: 'XK-964',
        name: '升降功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,adjustable,964',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '4,499',
        features: [
            { name: '高度可调', icon: 'fas fa-arrows-alt-v' },
            { name: '带按摩', icon: 'fas fa-spa' }
        ]
    },
    {
        id: 'XK-965',
        name: '变形功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,transform,965',
        stock: '预定',
        stockClass: 'text-red-500',
        price: '6,199',
        features: [
            { name: '多形态', icon: 'fas fa-sync-alt' },
            { name: '可拆分', icon: 'fas fa-puzzle-piece' }
        ]
    },
    {
        id: 'XK-966',
        name: '休闲功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,casual,966',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,799',
        features: [
            { name: '可拆洗', icon: 'fas fa-tint-slash' },
            { name: '带扶手', icon: 'fas fa-hand-paper' }
        ]
    },
    {
        id: 'XK-967',
        name: '商务功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,business,967',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '5,299',
        features: [
            { name: '带充电', icon: 'fas fa-plug' },
            { name: '办公适用', icon: 'fas fa-briefcase' }
        ]
    },
    {
        id: 'XK-968',
        name: '高端皮质功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,leather,968',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '7,999',
        features: [
            { name: '真皮材质', icon: 'fas fa-award' },
            { name: '智能调节', icon: 'fas fa-cogs' }
        ]
    },
    {
        id: 'XK-969',
        name: '极简功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,minimal,969',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,299',
        features: [
            { name: '简约设计', icon: 'fas fa-minus' },
            { name: '双功能', icon: 'fas fa-th-large' }
        ]
    },
    {
        id: 'XK-970',
        name: '北欧功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,scandinavian,970',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '4,199',
        features: [
            { name: '环保材质', icon: 'fas fa-leaf' },
            { name: '可拆卸', icon: 'fas fa-tools' }
        ]
    },
    {
        id: 'XK-971',
        name: '日式功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,japanese,971',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,599',
        features: [
            { name: '榻榻米风', icon: 'fas fa-border-none' },
            { name: '低矮设计', icon: 'fas fa-compress-alt' }
        ]
    },
    {
        id: 'XK-972',
        name: '豪华功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,luxury,972',
        stock: '预定',
        stockClass: 'text-red-500',
        price: '8,999',
        features: [
            { name: '按摩功能', icon: 'fas fa-spa' },
            { name: '加热系统', icon: 'fas fa-fire' }
        ]
    },
    {
        id: 'XK-973',
        name: '家庭影院功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,cinema,973',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '6,499',
        features: [
            { name: '杯架', icon: 'fas fa-glass-martini-alt' },
            { name: '音响系统', icon: 'fas fa-volume-up' }
        ]
    },
    {
        id: 'XK-974',
        name: '可拆分功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,modular,974',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '5,499',
        features: [
            { name: '组合设计', icon: 'fas fa-th-large' },
            { name: '多种搭配', icon: 'fas fa-random' }
        ]
    },
    {
        id: 'XK-975',
        name: '双人功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,loveseat,975',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,499',
        features: [
            { name: '双人设计', icon: 'fas fa-user-friends' },
            { name: '贵妃榻', icon: 'fas fa-couch' }
        ]
    },
    {
        id: 'XK-976',
        name: '儿童功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,kids,976',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '2,599',
        features: [
            { name: '儿童安全', icon: 'fas fa-baby' },
            { name: '防污面料', icon: 'fas fa-shield-alt' }
        ]
    },
    {
        id: 'XK-977',
        name: '现代功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,contemporary,977',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '4,299',
        features: [
            { name: '现代风格', icon: 'fas fa-star' },
            { name: '金属支架', icon: 'fas fa-wrench' }
        ]
    },
    {
        id: 'XK-978',
        name: '休闲布艺功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,fabric,978',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '3,899',
        features: [
            { name: '柔软布艺', icon: 'fas fa-mitten' },
            { name: '可折叠', icon: 'fas fa-compress-alt' }
        ]
    },
    {
        id: 'XK-979',
        name: '经典功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,classic,979',
        stock: '预定',
        stockClass: 'text-red-500',
        price: '5,799',
        features: [
            { name: '复古设计', icon: 'fas fa-history' },
            { name: '多功能', icon: 'fas fa-tools' }
        ]
    },
    {
        id: 'XK-980',
        name: '超大功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,large,980',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '6,999',
        features: [
            { name: '超大尺寸', icon: 'fas fa-expand-arrows-alt' },
            { name: '可容纳8人', icon: 'fas fa-users' }
        ]
    },
    {
        id: 'XK-981',
        name: '皮质功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,leather,981',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '5,199',
        features: [
            { name: '真皮面料', icon: 'fas fa-award' },
            { name: '可躺卧', icon: 'fas fa-bed' }
        ]
    },
    {
        id: 'XK-982',
        name: '迷你功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,compact,982',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '2,799',
        features: [
            { name: '小巧设计', icon: 'fas fa-compress' },
            { name: '可移动', icon: 'fas fa-dolly' }
        ]
    },
    {
        id: 'XK-983',
        name: '组合功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,sectional,983',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '4,599',
        features: [
            { name: '组合式', icon: 'fas fa-th-large' },
            { name: '灵活布置', icon: 'fas fa-random' }
        ]
    },
    {
        id: 'XK-984',
        name: '电动功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,electric,984',
        stock: '库存紧张',
        stockClass: 'text-orange-500',
        price: '6,899',
        features: [
            { name: '电动调节', icon: 'fas fa-bolt' },
            { name: '遥控控制', icon: 'fas fa-gamepad' }
        ]
    },
    {
        id: 'XK-985',
        name: '户外功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,outdoor,985',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '4,199',
        features: [
            { name: '户外适用', icon: 'fas fa-umbrella-beach' },
            { name: '防水面料', icon: 'fas fa-tint-slash' }
        ]
    },
    {
        id: 'XK-986',
        name: '办公功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,office,986',
        stock: '预定',
        stockClass: 'text-red-500',
        price: '5,299',
        features: [
            { name: '办公适用', icon: 'fas fa-briefcase' },
            { name: '带工作台', icon: 'fas fa-laptop' }
        ]
    },
    {
        id: 'XK-987',
        name: '豪华多功能沙发',
        category: 'XK',
        image: 'https://source.unsplash.com/featured/500x400/?sofa,premium,987',
        stock: '库存充足',
        stockClass: 'text-green-500',
        price: '9,999',
        features: [
            { name: '全功能', icon: 'fas fa-tools' },
            { name: '智能系统', icon: 'fas fa-microchip' },
            { name: '豪华配置', icon: 'fas fa-gem' }
        ]
    }
];

// 添加沙发分类按钮的点击事件处理
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const category = this.dataset.category;
        
        // 更新按钮活跃状态
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        // 打开模态框
        openSofaModal(category);
    });
});

// 打开沙发选择模态框
function openSofaModal(category) {
    const modal = document.getElementById('sofaModal');
    const overlay = document.getElementById('modalOverlay');
    const searchInput = document.getElementById('sofaSearch');
    
    // 重置搜索框
    if (searchInput) {
        searchInput.value = '';
        document.getElementById('clearSearch').style.display = 'none';
    }
    
    // 生成沙发列表
    generateSofaList(category);
    
    // 显示模态框
    modal.classList.add('active');
    overlay.classList.add('active');
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 设置搜索功能
    setupSearchFunction();
}

// 关闭沙发选择模态框
function closeSofaModal() {
    const modal = document.getElementById('sofaModal');
    const overlay = document.getElementById('modalOverlay');
    
    modal.classList.remove('active');
    overlay.classList.remove('active');
    
    // 恢复背景滚动
    document.body.style.overflow = '';
}

// 添加关闭按钮事件
document.querySelector('.close-modal').addEventListener('click', closeSofaModal);
document.getElementById('modalOverlay').addEventListener('click', closeSofaModal);

// 更新已选中的沙发型号显示
function updateSelectedModel(model) {
    if (!model) return;
    
    // 在型号选择区域突出显示选中的型号
    const modelGrid = document.querySelector('.model-grid');
    
    // 检查是否已经有特殊显示的型号
    const existingHighlighted = modelGrid.querySelector('.model-item.selected.highlighted');
    if (existingHighlighted) {
        modelGrid.removeChild(existingHighlighted);
    }
    
    // 创建选中型号的特殊显示元素
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('model-item', 'selected', 'highlighted');
    
    let stockClass = 'text-green-500';
    if (model.stock === '库存紧张') stockClass = 'text-orange-500';
    if (model.stock === '预定') stockClass = 'text-red-500';
    
    // 确保图片URL使用featured图片
    const imageUrl = model.image.includes('source.unsplash.com/random') ? 
        model.image.replace('source.unsplash.com/random', 'source.unsplash.com/featured') : 
        model.image;
    
    selectedItem.innerHTML = `
        <img src="${imageUrl}" alt="${model.name}">
        <div class="font-medium">${model.id}</div>
        <div class="text-sm ${stockClass}">${model.stock}</div>
    `;
    
    // 添加到模型网格的顶部
    modelGrid.insertBefore(selectedItem, modelGrid.firstChild);
    
    // 关闭模态框
    closeSofaModal();
}

// 尺寸滑块
const sizeSlider = document.querySelector('input[type="range"]');
const sizeValue = document.querySelector('.size-slider .flex span:nth-child(2)');
sizeSlider.addEventListener('input', function() {
    sizeValue.textContent = `当前: ${this.value}cm`;
});

// 图片拖拽上传
const uploadZone = document.querySelector('.upload-zone');

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--brand-primary)';
    uploadZone.style.background = 'var(--brand-primary-transparent)';
});

uploadZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--brand-primary-transparent)';
    uploadZone.style.background = 'var(--brand-light)';
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--brand-primary-transparent)';
    uploadZone.style.background = 'var(--brand-light)';
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        // 处理上传的图片
        console.log('Uploaded files:', files);
    }
});

// 支持粘贴上传
document.addEventListener('paste', (e) => {
    const items = e.clipboardData.items;
    for (let item of items) {
        if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            console.log('Pasted image:', file);
        }
    }
});

// 材质选择
document.querySelectorAll('.fabric-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.fabric-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
        // 更新预览图
        const previewImg = document.querySelector('.fabric-preview img');
        const fabricImg = this.querySelector('img');
        if (previewImg && fabricImg) {
            // 这里可以添加面料预览的逻辑
        }
    });
});

// 字体选择
document.querySelectorAll('.font-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.font-item').forEach(i => i.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 文字位置选择
document.querySelectorAll('.position-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.position-btn').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 配件选择
document.querySelectorAll('.accessory-item').forEach(item => {
    item.addEventListener('click', function() {
        this.classList.toggle('selected');
        updateTotalPrice();
    });
});

// 数量调整
const quantityBtns = document.querySelectorAll('.quantity-btn');
const quantityInput = document.querySelector('.quantity-value');

quantityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        let value = parseInt(quantityInput.value);
        if (this.textContent === '+') {
            value = Math.min(value + 1, 99);
        } else {
            value = Math.max(value - 1, 1);
        }
        quantityInput.value = value;
        updateTotalPrice();
    });
});

// 更新总价
function updateTotalPrice() {
    const basePrice = 4999;
    const quantity = parseInt(document.querySelector('.quantity-value').value);
    let accessoryPrice = 0;
    
    document.querySelectorAll('.accessory-item.selected').forEach(item => {
        const price = parseInt(item.querySelector('.accessory-price').textContent.replace('¥', ''));
        accessoryPrice += price;
    });

    const totalPrice = (basePrice + accessoryPrice) * quantity;
    document.querySelector('.total-price').textContent = `总价：¥${totalPrice}`;
}

// 语音输入
const voiceBtn = document.querySelector('.voice-btn');
let isRecording = false;

voiceBtn.addEventListener('click', function() {
    isRecording = !isRecording;
    this.innerHTML = isRecording ? 
        '<i class="fas fa-stop"></i>' : 
        '<i class="fas fa-microphone"></i>';
    // 这里可以添加语音识别的逻辑
});

// 图片上传预览
document.querySelector('.upload-btn').addEventListener('click', function() {
    // 触发文件选择
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

// 添加图片预览
function addImagePreview(src) {
    const preview = document.createElement('div');
    preview.className = 'upload-preview';
    preview.innerHTML = `
        <img src="${src}" alt="上传预览">
        <div class="remove-btn">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    preview.querySelector('.remove-btn').addEventListener('click', function() {
        preview.remove();
    });
    
    document.querySelector('.image-upload').insertBefore(
        preview,
        document.querySelector('.upload-btn').nextSibling
    );
}

// 规格卡片选择
document.querySelectorAll('.spec-card').forEach(card => {
    card.addEventListener('click', function() {
        // 只在同一组内切换选中状态
        const parent = this.parentElement;
        parent.querySelectorAll('.spec-card').forEach(c => c.classList.remove('selected'));
        this.classList.add('selected');
    });
});

// 步骤导航
const steps = document.querySelectorAll('.step');
const stepContents = document.querySelectorAll('.step-content');
const prevBtn = document.getElementById('prevStep');
const nextBtn = document.getElementById('nextStep');
let currentStep = 1;

// 更新步骤显示
function updateSteps(stepNumber) {
    // 更新步骤指示器
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.getAttribute('data-step'));
        step.classList.remove('active');
        step.classList.remove('completed');
        
        if (stepNum === stepNumber) {
            step.classList.add('active');
        } else if (stepNum < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    // 更新内容显示
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
        if (parseInt(content.getAttribute('data-step')) === stepNumber) {
            content.classList.add('active');
        }
    });
    
    // 更新底部导航按钮状态
    const prevBtn = document.getElementById('prevStep');
    const nextBtn = document.getElementById('nextStep');
    
    prevBtn.disabled = stepNumber === 1;
    nextBtn.disabled = stepNumber === 5;
    
    if (stepNumber === 1) {
        prevBtn.classList.add('disabled');
    } else {
        prevBtn.classList.remove('disabled');
    }
    
    if (stepNumber === 5) {
        nextBtn.textContent = '完成';
        nextBtn.classList.add('complete');
    } else {
        nextBtn.textContent = '下一步';
        nextBtn.classList.remove('complete');
    }

    // 当进入步骤3时，确保尺寸调整功能正常初始化
    if (stepNumber === 3) {
        // 延迟一小段时间确保DOM加载完毕
        setTimeout(() => {
            console.log("[DEBUG] 进入步骤3，初始化尺寸调整功能");
            initializeDimensionsSettings();
            // 确保沙发类型卡片选择功能初始化
            setupSofaTypeCardSelection();
        }, 100);
    }
    
    // 更新全局currentStep变量，确保所有地方使用相同的步骤状态
    currentStep = stepNumber;
    console.log("[DEBUG] 当前步骤更新为:", currentStep);
}

// 下一步
nextBtn.addEventListener('click', function() {
    if (currentStep < 5) {
        currentStep++;
        updateSteps(currentStep);
    } else {
        // 最后一步，确认订单
        alert('订单已提交！我们将尽快处理您的定制请求。');
    }
});

//          
prevBtn.addEventListener('click', function() {
    if (currentStep > 1) {
        currentStep--;
        updateSteps(currentStep);
    }
});

// 点击步骤指示器直接跳转
steps.forEach(step => {
    step.addEventListener('click', function() {
        const stepNum = parseInt(this.dataset.step);
        if (stepNum <= Math.max(currentStep, 2)) { // 只允许跳转到已完成的步骤或下一步
            currentStep = stepNum;
            updateSteps(currentStep);
        }
    });
});

// 3D预览控制
const previewBtns = document.querySelectorAll('.preview-btn');
let rotationDegree = 0;
let scale = 1;

previewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const previewImg = document.querySelector('.fabric-preview img');
        
        if (this.title === '旋转左侧') {
            rotationDegree -= 45;
            previewImg.style.transform = `rotate(${rotationDegree}deg) scale(${scale})`;
        } else if (this.title === '旋转右侧') {
            rotationDegree += 45;
            previewImg.style.transform = `rotate(${rotationDegree}deg) scale(${scale})`;
        } else if (this.title === '放大') {
            scale = scale === 1 ? 1.5 : 1;
            previewImg.style.transform = `rotate(${rotationDegree}deg) scale(${scale})`;
        } else if (this.title === 'AR预览') {
            alert('AR预览功能即将上线，敬请期待！');
        }
    });
});

// 社交分享
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        alert('分享功能即将上线，敬请期待！');
    });
});

// 热门组合选择
document.querySelectorAll('.combination-card').forEach(card => {
    card.addEventListener('click', function() {
        alert('已选择该热门组合，将为您自动填充相关配置！');
        // 这里可以添加自动填充配置的逻辑
    });
});

// 确保DOM元素已加载并绑定事件
function ensureDOMElementsLoaded() {
    // 重新查询DOM元素
    fabricCards = document.querySelectorAll('.fabric-card');
    
    // 如果面料卡片存在
    if (fabricCards && fabricCards.length > 0) {
        console.log(`找到${fabricCards.length}个面料卡片，重新绑定事件`);
        
        // 重新绑定点击事件
        fabricCards.forEach(card => {
            // 移除旧事件，防止重复绑定
            const clone = card.cloneNode(true);
            card.parentNode.replaceChild(clone, card);
            
            // 绑定新事件
            clone.addEventListener('click', function() {
                console.log('面料卡片被点击');
                
                // 获取面料型号
                const fabricModel = this.querySelector('.fabric-model').textContent;
                
                // 根据点击的卡片获取其对应的特性标签
                const features = Array.from(this.querySelectorAll('.feature-tag'))
                    .map(tag => tag.textContent)
                    .join('、');
                
                // 获取价格信息
                const price = this.querySelector('.fabric-price').textContent;
                
                // 获取预览图片（使用轮播中的第一张图片）
                const previewImage = this.querySelector('.fabric-img.active').src;
                
                // 构建面料数据对象
                const fabricData = {
                    model: fabricModel,
                    category: features.includes('头层牛皮') ? '头层牛皮' : 
                              features.includes('高级绒面') ? '高级绒面' : 
                              features.includes('亚麻面料') ? '亚麻面料' : '标准面料',
                    material: features.includes('头层牛皮') ? '黄牛皮' : 
                              features.includes('高级绒面') ? '绒面布' : 
                              features.includes('亚麻面料') ? '亚麻' : '混纺',
                    price: price,
                    features: features,
                    previewImg: previewImage,
                    selectedColor: 'gray', // 默认选中灰色
                    colorPreviewImgs: {
                        'gray': previewImage,
                        'beige': previewImage,
                        'blue': previewImage,
                        'green': previewImage,
                        'brown': previewImage,
                        'red': previewImage,
                        'black': previewImage
                    }
                };
                
                // 直接调用openFabricModal函数打开模态框
                if (typeof openFabricModal === 'function') {
                    openFabricModal(fabricData);
                } else {
                    console.error('openFabricModal函数未定义');
                }
            });
        });
    } else {
        console.warn('未找到面料卡片元素');
    }
}

// 在文档加载完成后初始化功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM已加载，开始初始化...');
    
    // 初始化折叠区域，确保它在页面加载时正确显示
    setupDimensionsFold();
    console.log('[DEBUG] 折叠区域初始化完成');
    
    // 安全地调用setupScrollIndicator，确保元素存在
    const sofaCategoriesRow = document.querySelector('.sofa-categories-row');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (sofaCategoriesRow && scrollIndicator) {
        setupScrollIndicator(sofaCategoriesRow, scrollIndicator);
    }
    
    setupFabricCarousels();
    setupFabricEvents();
    setupSizePresets();
    setupDimensionSliders();
    setupAdvancedOptions();
    setupViewToggle();
    
    // 以下是添加的调试代码，检查页面上是否有尺寸调整按钮
    setTimeout(function() {
        const foldBtn = document.getElementById('dimensions-fold-btn');
        if (foldBtn) {
            console.log('[DEBUG] 尺寸调整按钮存在:', foldBtn);
            console.log('[DEBUG] 按钮可见性:', window.getComputedStyle(foldBtn).display);
            
            // 移除添加视觉提示的代码，将在步骤3时显示
            // 相关功能已移至initializeDimensionsSettings函数中
        } else {
            console.error('[DEBUG] 错误：找不到尺寸调整按钮!');
        }
    }, 500);
    
    // 步骤切换
    document.getElementById('nextStep').addEventListener('click', function() {
        // 获取当前激活的步骤
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const currentStep = parseInt(activeStep.getAttribute('data-step'));
            if (currentStep < 5) {
                updateSteps(currentStep + 1);
            } else if (currentStep === 5) {
                // 最后一步，确认订单
                alert('订单已提交！我们将尽快处理您的定制请求。');
            }
        }
    });
    
    document.getElementById('prevStep').addEventListener('click', function() {
        // 获取当前激活的步骤
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const currentStep = parseInt(activeStep.getAttribute('data-step'));
            if (currentStep > 1) {
                updateSteps(currentStep - 1);
            }
        }
    });
    
    // 添加步骤指示器点击事件 - 允许用户点击步骤指示器直接跳转
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.getAttribute('data-step'));
            const activeStep = document.querySelector('.step.active');
            const currentStepNum = activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
            
            // 只允许跳转到已完成的步骤或下一步
            if (stepNum <= Math.max(currentStepNum, 2)) {
                updateSteps(stepNum);
            }
        });
    });
    
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // 移除所有标签的激活状态
            document.querySelectorAll('.tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            
            // 添加当前标签的激活状态
            this.classList.add('active');
            
            // 切换容器
            if (tabType === 'standard') {
                document.querySelector('.flipper').classList.remove('flipped');
            } else {
                document.querySelector('.flipper').classList.add('flipped');
            }
        });
    });
});

// 在模态框中动态生成沙发型号列表
function generateSofaList(category, searchTerm = '') {
    const sofaList = document.getElementById('sofaList');
    sofaList.innerHTML = '';
    
    // 根据分类和搜索词筛选沙发型号
    let filteredModels = [];
    
    // 使用数据源
    if (category && sofaData[category]) {
        filteredModels = [...sofaData[category].models];
        
        // 如果是XK分类，添加详细的功能沙发数据
        if (category === 'XK') {
            // 添加来自sofaModels的XK系列数据
            const xkModels = sofaModels.filter(model => model.category === 'XK');
            if (xkModels.length > 0) {
                // 合并两个数据源，并根据ID去重
                const modelIds = new Set(filteredModels.map(m => m.id));
                xkModels.forEach(model => {
                    if (!modelIds.has(model.id)) {
                        filteredModels.push(model);
                    }
                });
            }
        }
    }
    
    // 应用搜索过滤
    if (searchTerm) {
        searchTerm = searchTerm.toLowerCase();
        filteredModels = filteredModels.filter(model => 
            model.id.toLowerCase().includes(searchTerm) || 
            (model.name && model.name.toLowerCase().includes(searchTerm))
        );
    }
    
    // 如果没有匹配结果，显示提示信息
    if (filteredModels.length === 0) {
        sofaList.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search text-4xl text-gray-300 mb-2"></i>
                <div class="text-gray-500">没有找到匹配的沙发型号</div>
                <div class="text-sm text-gray-400 mt-1">请尝试其他搜索词或分类</div>
            </div>
        `;
        return;
    }
    
    // 生成沙发列表
    filteredModels.forEach(model => {
        const item = document.createElement('div');
        item.classList.add('sofa-item');
        if (model.selected) {
            item.classList.add('selected');
        }
        
        // 为普通数据源添加默认功能标签
        if (!model.features) {
            model.features = [
                { name: '可拆洗', icon: 'fas fa-tint-slash' },
                { name: '带收纳', icon: 'fas fa-box' }
            ];
            
            // 随机添加额外功能标签
            if (Math.random() > 0.5) {
                model.features.push({ name: '可调节', icon: 'fas fa-sync-alt' });
            }
            if (Math.random() > 0.7) {
                model.features.push({ name: '沙发床', icon: 'fas fa-bed' });
            }
        }
        
        // 限制最多显示4个特点标签，避免占用太多空间
        const limitedFeatures = model.features.slice(0, 4);
        
        // 生成功能标签HTML
        const featuresHTML = limitedFeatures.map(feature => 
            `<div class="feature-tag"><i class="${feature.icon}"></i>${feature.name}</div>`
        ).join('');
        
        item.innerHTML = `
            <div class="sofa-img-container">
                <img src="${model.image.replace('source.unsplash.com/random', 'source.unsplash.com/featured')}" alt="${model.name || model.id}" class="sofa-img">
            </div>
            <div class="sofa-details">
                <div class="sofa-info">
                    <div class="sofa-name">${model.id}</div>
                    <div class="sofa-price">¥${model.price || '3,999'} 起</div>
                </div>
                <div class="sofa-features">
                    ${featuresHTML}
                </div>
            </div>
        `;
        
        item.addEventListener('click', () => {
            // 选中当前沙发型号
            document.querySelectorAll('.sofa-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
            
            // 更新选中状态
            if (sofaData[category]) {
                sofaData[category].models.forEach(m => {
                    m.selected = m.id === model.id;
                });
            }
            
            // 更新型号显示
            updateSelectedModel(model);
        });
        
        sofaList.appendChild(item);
    });
}

// 处理搜索功能
function setupSearchFunction() {
    const searchInput = document.getElementById('sofaSearch');
    const clearButton = document.getElementById('clearSearch');
    
    if (!searchInput) return;
    
    // 搜索输入事件
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        // 显示或隐藏清除按钮
        if (searchTerm) {
            clearButton.style.display = 'flex';
        } else {
            clearButton.style.display = 'none';
        }
        
        // 获取当前选中的分类
        const activeCategory = document.querySelector('.category-btn.active');
        const category = activeCategory ? activeCategory.dataset.category : null;
        
        // 根据搜索词重新生成沙发列表
        generateSofaList(category, searchTerm);
    });
    
    // 清除搜索
    clearButton.addEventListener('click', function() {
        searchInput.value = '';
        this.style.display = 'none';
        
        // 获取当前选中的分类
        const activeCategory = document.querySelector('.category-btn.active');
        const category = activeCategory ? activeCategory.dataset.category : null;
        
        // 重新生成沙发列表
        generateSofaList(category, '');
    });
}

// 面料选择功能
let fabricCards = document.querySelectorAll('.fabric-card');
const colorSwatches = document.querySelectorAll('.color-swatch');
const fabricCodeDisplay = document.querySelector('.detail-value:first-child');
const previewImg = document.querySelector('.preview-img');
const fabricSearch = document.querySelector('.fabric-search input');
const categoryChips = document.querySelectorAll('.category-chip');

// 初始化选中的面料
let selectedFabric = 'TC-001';
let selectedColor = 'gray';

// 面料卡片轮播功能
function setupFabricCarousels() {
    const carousels = document.querySelectorAll('.fabric-carousel');
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll('.fabric-img');
        const dots = carousel.querySelectorAll('.carousel-dot');
        let currentIndex = 0;
        let autoplayInterval;
        
        // 切换到指定slide
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            currentIndex = index;
            if (currentIndex >= slides.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = slides.length - 1;
            
            slides[currentIndex].classList.add('active');
            dots[currentIndex].classList.add('active');
        }
        
        // 点击圆点切换
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // 防止触发面料卡片的点击事件
                showSlide(index);
                resetAutoplay();
            });
        });
        
        // 自动轮播
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                showSlide(currentIndex + 1);
            }, 3000);
        }
        
        // 重置自动轮播
        function resetAutoplay() {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
        
        // 鼠标悬停时暂停轮播
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });
        
        // 鼠标离开时恢复轮播
        carousel.addEventListener('mouseleave', () => {
            startAutoplay();
        });
        
        // 触摸滑动支持
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            clearInterval(autoplayInterval);
        }, {passive: true});
        
        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchEndX - touchStartX > 50) {
                // 右滑，显示上一张
                showSlide(currentIndex - 1);
            } else if (touchStartX - touchEndX > 50) {
                // 左滑，显示下一张
                showSlide(currentIndex + 1);
            }
            resetAutoplay();
        }, {passive: true});
        
        // 开始自动轮播
        startAutoplay();
    });
}

// 更新面料卡片点击事件，支持轮播后的选择
fabricCards.forEach(card => {
    card.addEventListener('click', function() {
        // 取消之前选中状态
        fabricCards.forEach(c => c.classList.remove('selected'));
        
        // 设置当前选中状态
        this.classList.add('selected');
        
        // 获取面料型号
        const fabricModel = this.querySelector('.fabric-model').textContent;
        selectedFabric = fabricModel;
        
        // 更新面料详情显示
        updateFabricDetails();
        
        // 更新色卡
        updateColorSwatches();
        
        // 更新预览图
        updatePreview();
    });
});

// 面料搜索功能
fabricSearch.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    
    // 筛选面料卡片
    fabricCards.forEach(card => {
        const fabricCode = card.querySelector('.fabric-code').textContent.toLowerCase();
        const fabricName = card.querySelector('.fabric-name').textContent.toLowerCase();
        
        if (fabricCode.includes(searchTerm) || fabricName.includes(searchTerm)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
});

// 面料分类选择
categoryChips.forEach(chip => {
    chip.addEventListener('click', function() {
        // 取消之前选中状态
        categoryChips.forEach(c => c.classList.remove('active'));
        
        // 设置当前选中状态
        this.classList.add('active');
        
        const category = this.textContent.toLowerCase();
        
        // 筛选面料卡片（模拟）
        if (category === '全部') {
            fabricCards.forEach(card => card.style.display = '');
        } else {
            fabricCards.forEach(card => {
                const features = Array.from(card.querySelectorAll('.feature-tag')).map(tag => tag.textContent.toLowerCase());
                if (features.includes(category) || card.querySelector('.fabric-name').textContent.toLowerCase().includes(category)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    });
});

// 更新面料详情显示
function updateFabricDetails() {
    if (fabricCodeDisplay) {
        fabricCodeDisplay.textContent = `${selectedFabric}-${selectedColor.toUpperCase()}`;
    }
}

// 更新色卡显示
function updateColorSwatches() {
    // 在实际应用中，这里应该根据所选面料动态加载对应的色卡
    colorSwatches.forEach(swatch => {
        const color = swatch.dataset.color;
        swatch.setAttribute('title', `${selectedFabric}-${color.toUpperCase()}`);
    });
    
    // 重置选中的颜色
    colorSwatches[0].classList.add('active');
    selectedColor = colorSwatches[0].dataset.color;
}

// 更新预览图
function updatePreview() {
    // 在实际应用中，这里应该根据所选面料和颜色加载对应的预览图
    // 这里模拟通过添加查询参数来"切换"图片
    const timestamp = new Date().getTime();
    previewImg.src = `https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?fabric=${selectedFabric}&color=${selectedColor}&t=${timestamp}`;
}

// 设置面料相关的事件处理
function setupFabricEvents() {
    // 更新面料卡片点击事件，支持轮播后的选择
    fabricCards.forEach(card => {
        card.addEventListener('click', function() {
            // 取消之前选中状态
            fabricCards.forEach(c => c.classList.remove('selected'));
            
            // 设置当前选中状态
            this.classList.add('selected');
            
            // 获取面料型号
            const fabricModel = this.querySelector('.fabric-model').textContent;
            
            // 根据点击的卡片获取其对应的特性标签
            const features = Array.from(this.querySelectorAll('.feature-tag'))
                .map(tag => tag.textContent)
                .join('、');
            
            // 获取价格信息
            const price = this.querySelector('.fabric-price').textContent;
            
            // 获取预览图片（使用轮播中的第一张图片）
            const previewImage = this.querySelector('.fabric-img.active').src;
            
            // 构建面料数据对象
            const fabricData = {
                model: fabricModel,
                category: features.includes('头层牛皮') ? '头层牛皮' : 
                          features.includes('高级绒面') ? '高级绒面' : 
                          features.includes('亚麻面料') ? '亚麻面料' : '标准面料',
                material: features.includes('头层牛皮') ? '黄牛皮' : 
                          features.includes('高级绒面') ? '绒面布' : 
                          features.includes('亚麻面料') ? '亚麻' : '混纺',
                price: price,
                features: features,
                previewImg: previewImage,
                selectedColor: 'gray', // 默认选中灰色
                colorPreviewImgs: {
                    'gray': previewImage,
                    'beige': previewImage,
                    'blue': previewImage,
                    'green': previewImage,
                    'brown': previewImage,
                    'red': previewImage,
                    'black': previewImage
                }
            };
            
            // 直接调用openFabricModal函数打开模态框
            openFabricModal(fabricData);
        });
    });
}

// 面料预览模态框功能
function setupFabricModal() {
    const fabricModalOverlay = document.getElementById('fabricModalOverlay');
    const fabricModal = document.getElementById('fabricModal');
    const modalCloseBtn = fabricModal ? fabricModal.querySelector('.close-modal') : null;
    const modalColorSwatches = fabricModal ? fabricModal.querySelectorAll('.color-swatch') : [];
    const sendSampleBtn = fabricModal ? fabricModal.querySelector('.send-sample-btn') : null;
    const modalPreviewImg = document.getElementById('modalPreviewImg');
    const fabricModel = document.getElementById('fabricModel');
    const fabricCategory = document.getElementById('fabricCategory');
    const fabricPrice = document.getElementById('fabricPrice');
    const fabricMaterial = document.getElementById('fabricMaterial');
    const fabricColor = document.getElementById('fabricColor');
    const fabricFeatures = document.getElementById('fabricFeatures');
    const addToCustomBtn = fabricModal ? fabricModal.querySelector('.add-to-custom-btn') : null;
    
    const sampleFormModal = document.getElementById('sampleFormModal');
    const closeSampleForm = document.getElementById('closeSampleForm');
    const submitSampleBtn = sampleFormModal ? sampleFormModal.querySelector('.submit-sample-btn') : null;
    const sampleToast = document.getElementById('sampleToast');
    
    // 当前选择的面料数据
    let currentFabricData = {
        model: '立特8967',
        category: '头层牛皮',
        price: '15元/尺',
        material: '黄牛皮',
        selectedColor: 'gray',
        features: '头层牛皮、耐磨、防水',
        previewImg: 'https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
        colorPreviewImgs: {
            'gray': 'https://images.unsplash.com/photo-1615529162924-f8605388461d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'beige': 'https://images.unsplash.com/photo-1620222053918-6edb898f0e51?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'blue': 'https://images.unsplash.com/photo-1620222052419-d131a14fc06e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'green': 'https://images.unsplash.com/photo-1631280340909-a7b5bc3c3d7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'brown': 'https://images.unsplash.com/photo-1558304970-ee333f83041c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'red': 'https://images.unsplash.com/photo-1605883705077-8d3d483e8c4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            'black': 'https://images.unsplash.com/photo-1636910159268-ca0a460812f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
        }
    };
    
    // 寄送皮样按钮点击事件
    if (sendSampleBtn && sampleFormModal) {
        sendSampleBtn.addEventListener('click', function() {
            // 获取当前面料信息
            const colorMap = {
                'gray': '灰色',
                'beige': '米色',
                'blue': '蓝色',
                'green': '绿色',
                'brown': '棕色',
                'red': '红色',
                'black': '黑色'
            };
            const colorName = colorMap[currentFabricData.selectedColor] || '灰色';
            const fabricInfo = `${currentFabricData.model} (${colorName})`;
            
            // 更新皮样表单中的样品信息
            const sampleDetail = document.getElementById('sampleDetail');
            if (sampleDetail) {
                sampleDetail.textContent = fabricInfo;
            }
            
            // 更新皮样图片
            const sampleImage = document.getElementById('sampleImage');
            if (sampleImage) {
                sampleImage.src = currentFabricData.colorPreviewImgs[currentFabricData.selectedColor] || currentFabricData.previewImg;
                sampleImage.alt = `${fabricInfo} 面料样品`;
            }
            
            // 更新样品特性标签
            const sampleFeatures = document.querySelector('.sample-features');
            if (sampleFeatures) {
                // 清空现有标签
                sampleFeatures.innerHTML = '';
                
                // 添加新标签
                let features = currentFabricData.features.split('、');
                features.forEach(feature => {
                    if (feature && feature.trim()) {
                        const featureTag = document.createElement('span');
                        featureTag.className = 'sample-feature';
                        featureTag.textContent = feature.trim();
                        sampleFeatures.appendChild(featureTag);
                    }
                });
            }
            
            // 检查并加载地址信息
            checkAndLoadAddressInfo();
            
            // 显示寄送皮样表单和遮罩层
            openSampleFormModal();
            
            // 隐藏面料预览模态框
            closeFabricModal();
        });
    }
    
    // 打开样品申请模态窗口
    function openSampleFormModal() {
        const sampleFormModal = document.getElementById('sampleFormModal');
        const sampleFormOverlay = document.getElementById('sampleFormOverlay');
        const bottomNav = document.querySelector('.bottom-nav');
        
        if (sampleFormModal) {
            sampleFormModal.classList.add('active');
        }
        
        if (sampleFormOverlay) {
            sampleFormOverlay.classList.add('active');
        }
        
        // 隐藏主界面上的底部导航按钮
        if (bottomNav) {
            bottomNav.style.visibility = 'hidden';
        }
        
        // 禁止背景滚动
        document.body.style.overflow = 'hidden';
    }
    
    // 关闭样品申请模态窗口
    function closeSampleFormModal() {
        const sampleFormModal = document.getElementById('sampleFormModal');
        const sampleFormOverlay = document.getElementById('sampleFormOverlay');
        const bottomNav = document.querySelector('.bottom-nav');
        
        if (sampleFormModal) {
            sampleFormModal.classList.remove('active');
        }
        
        if (sampleFormOverlay) {
            sampleFormOverlay.classList.remove('active');
        }
        
        // 恢复主界面上的底部导航按钮
        if (bottomNav) {
            bottomNav.style.visibility = 'visible';
        }
        
        // 恢复背景滚动
        document.body.style.overflow = '';
    }
    
    // 关闭模态框
    function closeFabricModal() {
        fabricModal.classList.remove('active');
        fabricModalOverlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
    
    // 更新模态框内容
    function updateModalContent() {
        // 更新预览图
        if (modalPreviewImg) {
            modalPreviewImg.src = currentFabricData.previewImg;
        }
        
        // 更新面料详情
        if (fabricCategory) fabricCategory.textContent = currentFabricData.category;
        if (fabricMaterial) fabricMaterial.textContent = currentFabricData.material;
        if (fabricModel) fabricModel.textContent = currentFabricData.model;
        if (fabricPrice) fabricPrice.textContent = currentFabricData.price;
        
        // 更新颜色信息
        updateColorText();
        
        // 从特性中移除"头层牛皮"特性后显示
        if (fabricFeatures) {
            let features = currentFabricData.features;
            features = features.replace('头层牛皮、', '').replace('、头层牛皮', '').replace('头层牛皮', '');
            fabricFeatures.textContent = features || '标准面料';
        }
        
        // 更新选中的颜色
        if (modalColorSwatches && modalColorSwatches.length > 0) {
            modalColorSwatches.forEach(swatch => {
                const color = swatch.dataset.color;
                if (color === currentFabricData.selectedColor) {
                    swatch.classList.add('active');
                } else {
                    swatch.classList.remove('active');
                }
            });
        }
    }
    
    // 辅助函数：更新颜色文本
    function updateColorText() {
        if (fabricColor) {
            const colorMap = {
                'gray': '灰色',
                'beige': '米色',
                'blue': '蓝色',
                'green': '绿色',
                'brown': '棕色',
                'red': '红色',
                'black': '黑色'
            };
            fabricColor.textContent = colorMap[currentFabricData.selectedColor] || '灰色';
        }
    }
    
    // 关闭按钮点击事件
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeFabricModal);
    }
    
    // 背景遮罩点击事件
    if (fabricModalOverlay) {
        fabricModalOverlay.addEventListener('click', closeFabricModal);
    }
    
    // 添加到定制按钮点击事件
    if (addToCustomBtn) {
        addToCustomBtn.addEventListener('click', function() {
            // 在这里处理面料选择逻辑
            alert(`已选择面料：${currentFabricData.model}，颜色：${currentFabricData.selectedColor}`);
            
            // 更新页面上的选中状态和预览
            updateSelectedFabric(currentFabricData);
            
            // 关闭模态框
            closeFabricModal();
            
            // 自动前进到下一步
            if (currentStep === 2) { // 如果当前在面料选择步骤
                nextBtn.click();
            }
        });
    }
    
    // 样品表单关闭按钮事件
    if (closeSampleForm && sampleFormModal) {
        closeSampleForm.addEventListener('click', function() {
            closeSampleFormModal();
        });
    }
    
    // 样品表单遮罩层点击事件
    const sampleFormOverlay = document.getElementById('sampleFormOverlay');
    if (sampleFormOverlay) {
        sampleFormOverlay.addEventListener('click', function() {
            closeSampleFormModal();
        });
    }
    
    // 样品申请提交按钮事件
    if (submitSampleBtn && sampleFormModal) {
        submitSampleBtn.addEventListener('click', function() {
            // 隐藏表单
            closeSampleFormModal();
            
            // 显示成功提示
            const sampleToast = document.getElementById('sampleToast');
            if (sampleToast) {
                sampleToast.classList.add('active');
                
                // 3秒后隐藏提示
                setTimeout(() => {
                    sampleToast.classList.remove('active');
                }, 3000);
            }
        });
    }
    
    // 更新选中的面料信息到页面上
    function updateSelectedFabric(fabricData) {
        // 这里可以更新主页面上的面料预览和信息
        // 但由于我们已经隐藏了原有的预览区域，这里可以简单地更新一些状态
        selectedFabric = fabricData.model;
        selectedColor = fabricData.selectedColor;
        
        // 也可以在页面上添加一个已选面料的提示
        const fabricSection = document.querySelector('.custom-section');
        
        if (fabricSection) {
            // 检查是否已经有选择提示
            let selectedInfo = fabricSection.querySelector('.selected-fabric-info');
            
            if (!selectedInfo) {
                // 创建选择提示
                selectedInfo = document.createElement('div');
                selectedInfo.className = 'selected-fabric-info mt-4 p-3 bg-blue-50 rounded-lg';
                fabricSection.appendChild(selectedInfo);
            }
            
            // 更新选择提示内容
            selectedInfo.innerHTML = `
                <div class="flex items-center">
                    <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <div class="text-blue-800">已选择: <strong>${fabricData.model}</strong> (${fabricData.category}, ${fabricData.selectedColor}色)</div>
                </div>
            `;
        }
    }
    
    // 打开模态框并加载面料数据
    function openFabricModal(fabricData) {
        // 更新当前面料数据
        if (fabricData) {
            currentFabricData = fabricData;
        }
        
        // 更新模态框内容
        updateModalContent();
        
        // 显示模态框
        if (fabricModal && fabricModalOverlay) {
            fabricModal.classList.add('active');
            fabricModalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        }
    }
    
    // 返回模态框的方法，包括openFabricModal函数
    return {
        openFabricModal: openFabricModal,
        closeFabricModal: closeFabricModal
    };
}

// 初始化面料模态框并导出方法
const fabricModalController = setupFabricModal();

// 现在我们可以从模态框控制器中获取open和close方法
window.openFabricModal = fabricModalController.openFabricModal;
window.closeFabricModal = fabricModalController.closeFabricModal;

// 处理可展开文本元素
document.addEventListener('DOMContentLoaded', function() {
    // 初始化可展开文本
    initExpandableText();
    
    // 打开面料模态框时确保重新初始化可展开文本
    document.querySelectorAll('.fabric-card').forEach(card => {
        card.addEventListener('click', function() {
            setTimeout(initExpandableText, 300); // 给模态框动画一些时间
        });
    });
});

// 初始化可展开文本功能
function initExpandableText() {
    document.querySelectorAll('.expandable').forEach(element => {
        // 移除之前的事件监听器
        element.removeEventListener('click', toggleExpandableText);
        // 添加新的事件监听器
        element.addEventListener('click', toggleExpandableText);
        
        // 重置状态
        if(element.classList.contains('expanded')) {
            element.classList.remove('expanded');
            const indicator = element.querySelector('.expandable-indicator i');
            if(indicator) {
                indicator.className = 'fas fa-plus';
            }
        }
    });
}

// 切换可展开文本显示
function toggleExpandableText(event) {
    const expandable = this;
    expandable.classList.toggle('expanded');
    
    const indicator = expandable.querySelector('.expandable-indicator i');
    if(indicator) {
        if(expandable.classList.contains('expanded')) {
            indicator.className = 'fas fa-minus';
        } else {
            indicator.className = 'fas fa-plus';
        }
    }
    
    // 防止事件冒泡到其他元素
    event.stopPropagation();
}

// 处理申请皮样表单中的地址管理功能
document.addEventListener('DOMContentLoaded', function() {
    setupSampleFormAddressFeature();
    setupSampleFormSubmission();
});

// 设置样品申请提交功能
function setupSampleFormSubmission() {
    // 设置提交按钮点击事件
    const submitSampleBtn = document.getElementById('submitSampleApplication');

    if (submitSampleBtn) {
        submitSampleBtn.addEventListener('click', function() {
            // 获取并验证地址表单数据
            if (validateAddressForm()) {
                // 保存地址到本地
                const addressData = {
                    name: document.getElementById('recipientName').value,
                    phone: document.getElementById('recipientPhone').value,
                    address: document.getElementById('addressDetail').value,
                    isDefault: false // 暂不设为默认地址
                };
                
                // 保存地址
                saveAddress(addressData);
                
                // 获取备注信息
                const remarkText = document.getElementById('sampleRemark').value;
                
                // 处理提交申请
                processSubmitApplication(remarkText);
            }
        });
    }
}

// 处理样品申请提交的函数
function processSubmitApplication(remarkText = '') {
    // 提交申请的逻辑
    console.log('处理样品申请提交，备注:', remarkText);
    
    // 显示成功提示
    showToast('皮样申请已提交，我们会尽快为您寄送！');
    
    // 关闭表单模态窗
    const sampleFormModal = document.getElementById('sampleFormModal');
    const sampleFormOverlay = document.getElementById('sampleFormOverlay');
    
    if (sampleFormModal) {
        sampleFormModal.classList.remove('active');
    }
    if (sampleFormOverlay) {
        sampleFormOverlay.classList.remove('active');
    }
}

function setupSampleFormAddressFeature() {
    // 相关DOM元素
    const showAddressListBtn = document.getElementById('showAddressList');
    const showAddressFormBtn = document.getElementById('showAddressForm');
    const addressListDropdown = document.getElementById('addressListDropdown');
    const closeAddressListBtn = document.getElementById('closeAddressList');
    const addressForm = document.getElementById('addressForm');
    const cancelAddressFormBtn = document.getElementById('cancelAddressForm');
    const selectedAddressCard = document.getElementById('selectedAddressCard');
    const changeAddressBtn = document.getElementById('changeAddressBtn');
    const emptyFormBtn = document.getElementById('emptyFormBtn');
    const addressItems = document.querySelectorAll('.address-item');
    const noAddressMessage = document.getElementById('noAddressMessage');
    const selectedAddressActions = document.getElementById('selectedAddressActions');
    const submitSelectedAddressBtn = document.getElementById('submitSelectedAddress');
    
    // 初始化时隐藏选择地址后的操作区域
    if (selectedAddressActions) {
        selectedAddressActions.classList.add('hidden');
    }

    // 确保元素存在再添加事件
    if (!selectedAddressCard || !addressForm) return;
    
    // 选择地址按钮点击事件
    if (showAddressListBtn && addressListDropdown) {
        showAddressListBtn.addEventListener('click', function(event) {
            // 检查是否有保存的地址
            const hasAddresses = checkSavedAddresses();
            
            // 根据是否有地址显示不同内容
            if (hasAddresses) {
                // 显示地址列表
                if (noAddressMessage) noAddressMessage.classList.add('hidden');
                Array.from(addressListDropdown.querySelectorAll('.address-item')).forEach(item => {
                    item.classList.remove('hidden');
                });
            } else {
                // 显示无地址提示
                if (noAddressMessage) noAddressMessage.classList.remove('hidden');
                Array.from(addressListDropdown.querySelectorAll('.address-item')).forEach(item => {
                    item.classList.add('hidden');
                });
            }
            
            addressListDropdown.classList.remove('hidden');
            
            // 点击其他区域关闭地址列表
            setTimeout(() => {
                document.addEventListener('click', closeAddressListOnClickOutside);
            }, 100);
            
            // 阻止事件冒泡，避免立即关闭
            event.stopPropagation();
        });
    }
    
    // 手动填写按钮点击事件
    if (showAddressFormBtn && addressForm) {
        showAddressFormBtn.addEventListener('click', function() {
            showAddressForm();
            // 隐藏已选择地址相关内容
            if (selectedAddressCard) selectedAddressCard.classList.add('hidden');
            if (selectedAddressActions) selectedAddressActions.classList.add('hidden');
        });
    }
    
    // 无地址时"手动填写"按钮点击事件
    if (emptyFormBtn && addressForm) {
        emptyFormBtn.addEventListener('click', function() {
            // 关闭地址列表
            if (addressListDropdown) {
                addressListDropdown.classList.add('hidden');
                document.removeEventListener('click', closeAddressListOnClickOutside);
            }
            
            // 显示表单
            showAddressForm();
            // 隐藏已选择地址相关内容
            if (selectedAddressCard) selectedAddressCard.classList.add('hidden');
            if (selectedAddressActions) selectedAddressActions.classList.add('hidden');
        });
    }
    
    // 取消表单按钮点击事件
    if (cancelAddressFormBtn) {
        cancelAddressFormBtn.addEventListener('click', function() {
            // 检查是否有选中的地址，如果有则显示，否则保持表单显示
            if (selectedAddressCard && !selectedAddressCard.classList.contains('hidden')) {
                // 隐藏表单，显示已选地址
                addressForm.classList.add('hidden');
                if (selectedAddressActions) selectedAddressActions.classList.remove('hidden');
            } else {
                // 检查是否有保存的地址
                const hasAddresses = checkSavedAddresses();
                if (hasAddresses) {
                    // 选择第一个地址
                    const firstAddress = getSavedAddresses()[0];
                    if (firstAddress) {
                        selectAddress(firstAddress);
                        if (selectedAddressActions) selectedAddressActions.classList.remove('hidden');
                    }
                } else {
                    // 如果没有地址，显示地址列表
                    if (showAddressListBtn) {
                        showAddressListBtn.click();
                    }
                }
            }
        });
    }
    
    // 关闭地址列表按钮点击事件
    if (closeAddressListBtn && addressListDropdown) {
        closeAddressListBtn.addEventListener('click', function() {
            addressListDropdown.classList.add('hidden');
            document.removeEventListener('click', closeAddressListOnClickOutside);
        });
    }
    
    // 点击外部区域关闭地址列表
    function closeAddressListOnClickOutside(event) {
        if (addressListDropdown && !addressListDropdown.contains(event.target) && 
            showAddressListBtn && !showAddressListBtn.contains(event.target)) {
            addressListDropdown.classList.add('hidden');
            document.removeEventListener('click', closeAddressListOnClickOutside);
        }
    }
    
    // 更换地址按钮点击事件
    if (changeAddressBtn && showAddressListBtn) {
        changeAddressBtn.addEventListener('click', function(event) {
            // 触发显示地址列表
            if (showAddressListBtn && typeof showAddressListBtn.click === 'function') {
                showAddressListBtn.click();
            } else {
                // 备选方案：直接显示地址列表
                const hasAddresses = checkSavedAddresses();
                
                // 根据是否有地址显示不同内容
                if (hasAddresses) {
                    // 显示地址列表
                    if (noAddressMessage) noAddressMessage.classList.add('hidden');
                    Array.from(addressListDropdown.querySelectorAll('.address-item')).forEach(item => {
                        item.classList.remove('hidden');
                    });
                } else {
                    // 显示无地址提示
                    if (noAddressMessage) noAddressMessage.classList.remove('hidden');
                    Array.from(addressListDropdown.querySelectorAll('.address-item')).forEach(item => {
                        item.classList.add('hidden');
                    });
                }
                
                addressListDropdown.classList.remove('hidden');
                setTimeout(() => {
                    document.addEventListener('click', closeAddressListOnClickOutside);
                }, 100);
            }
            
            // 阻止事件冒泡
            event.stopPropagation();
        });
    }

    // 当点击地址选择按钮时
    addressItems.forEach(item => {
        item.addEventListener('click', function() {
            const addressId = this.getAttribute('data-id');
            // 模拟从服务器获取地址详情
            const addressInfo = {
                id: addressId,
                name: this.querySelector('.name').textContent,
                phone: this.querySelector('.phone').textContent,
                address: this.querySelector('.address-text').textContent,
                isDefault: this.querySelector('.default-tag') !== null
            };
            
            // 填充已选择的地址卡片
            selectAddress(addressInfo);
            
            // 关闭地址列表下拉框
            addressListDropdown.classList.add('hidden');
            // 移除点击外部关闭的事件监听
            document.removeEventListener('click', closeAddressListOnClickOutside);
            
            // 显示已选择地址的操作区域
            if (selectedAddressActions) {
                selectedAddressActions.classList.remove('hidden');
            }
            
            // 隐藏地址表单
            if (addressForm) {
                addressForm.classList.add('hidden');
            }
        });
    });

    // 已选择地址的提交按钮点击事件
    if (submitSelectedAddressBtn) {
        submitSelectedAddressBtn.addEventListener('click', function() {
            // 获取备注信息
            const remarkText = document.getElementById('selectedAddressRemark').value;
            
            // 处理提交申请
            processSubmitApplication(remarkText);
        });
    }
}

// 检查并加载地址信息
function checkAndLoadAddressInfo() {
    // 检查是否有保存的地址
    const hasAddresses = checkSavedAddresses();
    
    if (hasAddresses) {
        // 加载默认地址
        loadDefaultAddress();
    } else {
        // 如果没有地址，显示地址表单
        showAddressForm();
    }
}

// 显示地址表单
function showAddressForm() {
    const selectedAddressCard = document.getElementById('selectedAddressCard');
    const addressForm = document.getElementById('addressForm');
    
    if (selectedAddressCard && addressForm) {
        // 清空表单字段
        const nameInput = document.getElementById('recipientName');
        const phoneInput = document.getElementById('recipientPhone');
        const addressInput = document.getElementById('addressDetail');
        
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (addressInput) addressInput.value = '';
        
        // 隐藏地址卡片，显示表单
        selectedAddressCard.classList.add('hidden');
        addressForm.classList.remove('hidden');
    }
}

// 验证地址表单
function validateAddressForm() {
    const nameInput = document.getElementById('recipientName');
    const phoneInput = document.getElementById('recipientPhone');
    const addressInput = document.getElementById('addressDetail');
    
    if (!nameInput || !phoneInput || !addressInput) return false;
    
    // 简单验证：检查字段不为空
    if (nameInput.value.trim() === '') {
        showToast('请输入收件人姓名');
        nameInput.focus();
        return false;
    }
    
    if (phoneInput.value.trim() === '') {
        showToast('请输入联系电话');
        phoneInput.focus();
        return false;
    }
    
    // 简单的手机号验证
    const phonePattern = /^1[3-9]\d{9}$/;
    if (!phonePattern.test(phoneInput.value.trim())) {
        showToast('请输入有效的手机号');
        phoneInput.focus();
        return false;
    }
    
    if (addressInput.value.trim() === '') {
        showToast('请输入详细地址');
        addressInput.focus();
        return false;
    }
    
    return true;
}

// 显示Toast提示
function showToast(message) {
    // 检查是否已有toast
    let toast = document.querySelector('.toast-notification');
    
    // 如果没有，创建一个
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `
            <span class="toast-icon"><i class="fas fa-check-circle"></i></span>
            <span class="toast-message">${message}</span>
        `;
        document.body.appendChild(toast);
    } else {
        toast.querySelector('.toast-message').textContent = message;
    }
    
    // 显示toast
    setTimeout(() => {
        toast.classList.add('active');
    }, 10);
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('active');
    }, 3000);
}

// 检查是否有保存的地址
function checkSavedAddresses() {
    // 实际应用中，这里会从localStorage或API获取保存的地址
    // 这里简单模拟
    const addresses = getSavedAddresses();
    return addresses.length > 0;
}

// 获取保存的地址
function getSavedAddresses() {
    // 实际应用中，这里会从localStorage或API获取保存的地址
    // 这里简单模拟
    const mockAddresses = [
        {
            id: 1,
            name: '张三',
            phone: '138****1234',
            address: '北京市朝阳区某某路123号某某小区A座3单元501室',
            isDefault: true
        },
        {
            id: 2,
            name: '张三',
            phone: '139****5678',
            address: '上海市浦东新区陆家嘴世纪大道1号环球金融中心88层',
            isDefault: false
        },
        {
            id: 3,
            name: '李四',
            phone: '137****9876',
            address: '广州市天河区天河路385号太古汇商场4楼',
            isDefault: false
        }
    ];
    
    // 模拟没有地址的情况，可以根据需要注释掉这行代码
    // return [];
    
    return mockAddresses;
}

// 保存地址
function saveAddress(addressData) {
    // 实际应用中，这里会将地址保存到localStorage或通过API发送到服务器
    console.log('保存地址:', addressData);
    
    // 这里简单模拟，实际应用需要实现持久化
    alert('地址保存成功！');
}

// 自动加载默认地址
function loadDefaultAddress() {
    // 获取保存的地址
    const addresses = getSavedAddresses();
    
    // 查找默认地址
    let defaultAddress = addresses.find(addr => addr.isDefault);
    
    // 如果没有默认地址，使用第一个地址
    if (!defaultAddress && addresses.length > 0) {
        defaultAddress = addresses[0];
    }
    
    // 如果有地址，则选择该地址
    if (defaultAddress) {
        selectAddress(defaultAddress);
    } else {
        // 如果没有地址，显示表单
        showAddressForm();
    }
}

// 选择地址的通用函数
function selectAddress(addressData) {
    const selectedName = document.getElementById('selectedName');
    const selectedPhone = document.getElementById('selectedPhone');
    const selectedAddress = document.getElementById('selectedAddress');
    const defaultTag = document.getElementById('defaultTag');
    const selectedAddressCard = document.getElementById('selectedAddressCard');
    const selectedAddressActions = document.getElementById('selectedAddressActions');
    
    if (selectedName) selectedName.textContent = addressData.name;
    if (selectedPhone) selectedPhone.textContent = addressData.phone;
    if (selectedAddress) selectedAddress.textContent = addressData.address;
    
    // 处理默认标签
    if (defaultTag) {
        if (addressData.isDefault) {
            defaultTag.classList.remove('hidden');
        } else {
            defaultTag.classList.add('hidden');
        }
    }
    
    // 显示已选择的地址卡片
    if (selectedAddressCard) {
        selectedAddressCard.classList.remove('hidden');
    }
    
    // 显示已选择地址的操作区域
    if (selectedAddressActions) {
        selectedAddressActions.classList.remove('hidden');
    }
    
    // 填充表单（隐藏起来，但保持表单数据为最新）
    fillAddressForm(addressData);
    
    // 保存当前选择的地址
    localStorage.setItem('currentSelectedAddress', JSON.stringify(addressData));
}

// 填充地址表单
function fillAddressForm(addressData) {
    if (!addressData) return;
    
    const recipientNameInput = document.getElementById('recipientName');
    const recipientPhoneInput = document.getElementById('recipientPhone');
    const addressDetailInput = document.getElementById('addressDetail');
    
    if (recipientNameInput) recipientNameInput.value = addressData.name || '';
    if (recipientPhoneInput) recipientPhoneInput.value = addressData.phone || '';
    if (addressDetailInput) addressDetailInput.value = addressData.address || '';
}

// 场景选择相关配置
const sceneConfig = {
    "small-living": {
        title: "小户型客厅",
        size: 210,
        recommendation: "您选择的小户型方案适合10-15㎡的客厅，推荐2.1米沙发，简约风格，带收纳功能，节省空间。"
    },
    "family": {
        title: "家庭影院",
        size: 270,
        recommendation: "您选择的家庭影院方案适合20-25㎡的客厅，推荐2.7米沙发，舒适靠背，方便全家人一起观影休闲。"
    },
    "office": {
        title: "办公接待",
        size: 240,
        recommendation: "您选择的办公接待方案适合15-20㎡的空间，推荐2.4米沙发，简洁大方，易于清洁，突显专业形象。"
    },
    "living": {
        title: "家庭客厅",
        size: 270,
        recommendation: "您选择的家庭客厅方案适合18-25㎡的客厅，推荐2.7米沙发，提供更多休闲空间，适合家人一起看电视。"
    }
};

// 场景选择处理
document.addEventListener('DOMContentLoaded', () => {
    // 初始化场景卡片点击事件
    
    // 初始化尺寸选择
    setupSizeSelection();
    
    // 监听尺寸滑块变化
    setupSizeSlider();
});

// 场景选择功能
function setupSceneSelection() {
    const sceneCards = document.querySelectorAll('.scene-card');
    
    sceneCards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除其他卡片的选中状态
            sceneCards.forEach(c => c.classList.remove('active'));
            
            // 添加当前卡片的选中状态
            card.classList.add('active');
            
            // 获取场景类型
            const sceneType = card.dataset.scene;
            
            // 应用场景配置
            applySceneConfig(sceneType);
        });
    });
}

// 应用场景配置
function applySceneConfig(sceneType) {
    const config = sceneConfig[sceneType];
    if (!config) return;
    
    // 设置尺寸
    setActiveSize(config.size);
    
    // 更新滑块值
    updateSizeSlider(config.size);
    
    // 更新设计师建议
    updateRecommendation(config.recommendation);
}

// 设置活跃的尺寸
function setActiveSize(size) {
    const sizeChips = document.querySelectorAll('.size-chip');
    let foundMatch = false;
    
    sizeChips.forEach(chip => {
        if (parseInt(chip.dataset.size, 10) === size) {
            chip.classList.add('active');
            foundMatch = true;
        } else {
            chip.classList.remove('active');
        }
    });
    
    // 如果没有匹配的尺寸选项，则不选中任何一个
    if (!foundMatch) {
        // 可以在这里添加自定义尺寸的逻辑
    }
    
    // 更新沙发尺寸可视化
    updateSofaVisualization(size);
}

// 沙发类型选择
function setupSofaTypeSelection() {
    const typeButtons = document.querySelectorAll('.type-btn');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他按钮的选中状态
            typeButtons.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的选中状态
            btn.classList.add('active');
            
            // 根据沙发类型更新推荐尺寸
            updateRecommendationByType(btn.dataset.type);
        });
    });
}

// 尺寸选择
function setupSizeSelection() {
    const sizeChips = document.querySelectorAll('.size-chip');
    
    sizeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // 移除其他尺寸的选中状态
            sizeChips.forEach(c => c.classList.remove('active'));
            
            // 添加当前尺寸的选中状态
            chip.classList.add('active');
            
            // 获取选中的尺寸值
            const sizeValue = parseInt(chip.dataset.size, 10);
            
            // 更新滑块值
            updateSizeSlider(sizeValue);
            
            // 更新沙发尺寸可视化
            updateSofaVisualization(sizeValue);
            
            // 更新设计师建议
            updateRecommendationBySize(sizeValue);
        });
    });
}

// 尺寸滑块
function setupSizeSlider() {
    const sizeSlider = document.querySelector('.size-range');
    const currentSizeElement = document.querySelector('.current-size');
    
    if (sizeSlider && currentSizeElement) {
        sizeSlider.addEventListener('input', () => {
            const sizeValue = parseInt(sizeSlider.value, 10);
            
            // 更新当前尺寸显示
            currentSizeElement.textContent = `${sizeValue}cm`;
            
            // 更新沙发尺寸可视化
            updateSofaVisualization(sizeValue);
            
            // 检查是否匹配预设尺寸
            updateSizeChipBySlider(sizeValue);
            
            // 更新设计师建议
            updateRecommendationBySize(sizeValue);
        });
    }
}

// 更新尺寸滑块值
function updateSizeSlider(size) {
    const sizeSlider = document.querySelector('.size-range');
    const currentSizeElement = document.querySelector('.current-size');
    
    if (sizeSlider && currentSizeElement) {
        sizeSlider.value = size;
        currentSizeElement.textContent = `${size}cm`;
    }
}

// 根据滑块值更新尺寸选择芯片
function updateSizeChipBySlider(size) {
    const sizeChips = document.querySelectorAll('.size-chip');
    let foundMatch = false;
    
    sizeChips.forEach(chip => {
        if (parseInt(chip.dataset.size, 10) === size) {
            chip.classList.add('active');
            foundMatch = true;
        } else {
            chip.classList.remove('active');
        }
    });
    
    // 如果没有匹配的尺寸，则取消所有选中状态
    if (!foundMatch) {
        sizeChips.forEach(chip => chip.classList.remove('active'));
    }
}

// 更新沙发尺寸可视化
function updateSofaVisualization(size) {
    const sofaOutline = document.querySelector('.sofa-outline');
    const sizeLabel = document.querySelector('.size-label');
    
    if (sofaOutline && sizeLabel) {
        // 计算沙发在房间中的比例 (180cm-360cm 映射到 30%-80%)
        const minSize = 180;
        const maxSize = 360;
        const minWidth = 30;
        const maxWidth = 80;
        
        const percentage = minWidth + ((size - minSize) / (maxSize - minSize)) * (maxWidth - minWidth);
        
        // 更新沙发宽度和标签
        sofaOutline.style.width = `${percentage}%`;
        sizeLabel.textContent = `${size}cm`;
    }
}

// 更新沙发类型可视化
function updateSofaTypeVisualization(type) {
    // 隐藏所有沙发轮廓
    document.querySelectorAll('.sofa-outline').forEach(outline => {
        outline.style.display = 'none';
    });
    
    // 显示对应类型的沙发轮廓
    const targetOutline = document.querySelector(`.sofa-outline[data-type="${type}"]`);
    if (targetOutline) {
        targetOutline.style.display = 'block';
    }
    
    // 如果是L型沙发，应用当前选择的妃位方向
    if (type === 'l-shape') {
        updateLShapeDirection();
    }
}

// 根据沙发类型更新建议
function updateRecommendationByType(type) {
    const recommendationText = document.querySelector('.recommendation-text');
    
    if (recommendationText) {
        let recommendation = '';
        
        switch (type) {
            case 'straight':
                recommendation = '直排沙发是最经典的款式，适合放在墙边，适合大多数家庭客厅，推荐选择2.4米以上尺寸。';
                break;
            case 'l-shape':
                recommendation = 'L型沙发适合放在客厅拐角，能充分利用空间，提供更多座位，适合家人一起观影休闲。';
                break;
            default:
                recommendation = '请选择沙发类型获取设计师建议。';
        }
        
        recommendationText.textContent = recommendation;
    }
}

// 根据尺寸更新建议
function updateRecommendationBySize(size) {
    const recommendationText = document.querySelector('.recommendation-text');
    
    if (recommendationText) {
        let recommendation = '';
        
        if (size <= 180) {
            recommendation = '您选择的单人位沙发适合8-12㎡的小客厅或书房，为单人提供舒适的坐姿，建议房间宽度不小于2.5米。';
        } else if (size <= 210) {
            recommendation = '您选择的二人位沙发适合12-15㎡的客厅，提供2人舒适的乘坐空间，建议房间宽度不小于2.8米。';
        } else if (size <= 240) {
            recommendation = '您选择的三人位沙发适合15-20㎡的客厅，是最常见的家庭沙发尺寸，建议房间宽度不小于3米。';
        } else if (size <= 270) {
            recommendation = '您选择的四人位沙发适合20-25㎡的客厅，提供宽敞的乘坐空间，建议房间宽度不小于3.5米。';
        } else if (size <= 300) {
            recommendation = '您选择的3+左妃沙发适合25㎡以上的大客厅，左侧带有贵妃榻，建议房间宽度不小于4米。';
        } else {
            recommendation = '您选择的3+右妃沙发适合25㎡以上的开阔空间，右侧带有贵妃榻，适合有较大客厅空间的家庭。';
        }
        
        recommendationText.textContent = recommendation;
    }
}

// 直接更新建议文本
function updateRecommendation(text) {
    const recommendationText = document.querySelector('.recommendation-text');
    
    if (recommendationText && text) {
        recommendationText.textContent = text;
    }
}

// 沙发配置和尺寸选择相关功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化尺寸预设选择
    setupSizePresets();
    
    // 初始化尺寸滑块
    setupDimensionSliders();
    
    // 初始化高级选项切换
    setupAdvancedOptions();
    
    // 初始化视图切换
    setupViewToggle();
});

// 检查沙发类型限制
function checkTypeRestrictions() {
    // 获取第一步选择的沙发型号
    const selectedModel = getCurrentModel();
    
    // 如果没有选择型号，禁用受限的沙发类型
    if (!selectedModel) return;
    
    // 检查每个类型按钮
    document.querySelectorAll('.type-btn[data-requires]').forEach(btn => {
        const requiredSeries = btn.dataset.requires.split(',');
        
        // 检查当前选择的型号是否在允许的系列中
        if (selectedModel && !isModelInSeries(selectedModel, requiredSeries)) {
            btn.classList.add('disabled');
            btn.setAttribute('title', '当前所选沙发型号不支持此配置');
        } else {
            btn.classList.remove('disabled');
            btn.removeAttribute('title');
        }
    });
}

// 获取当前选择的沙发型号
function getCurrentModel() {
    // 此处应该返回用户在第一步选择的沙发型号
    // 这里简单模拟一个值，实际应用中应从应用状态获取
    return 'XK-101'; // 示例：功能沙发型号
}

// 检查型号是否属于指定系列
function isModelInSeries(model, seriesList) {
    if (!model) return false;
    
    // 从型号提取系列代码（如XK-101中的XK）
    const seriesCode = model.split('-')[0];
    
    // 检查是否在允许的系列列表中
    return seriesList.includes(seriesCode);
}

// 设置沙发类型选择功能
function setupSofaTypeSelection() {
    const typeButtons = document.querySelectorAll('.type-btn');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 如果按钮被禁用，不执行操作
            if (btn.classList.contains('disabled')) return;
            
            // 移除其他按钮的选中状态
            typeButtons.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的选中状态
            btn.classList.add('active');
            
            // 获取所选类型
            const selectedType = btn.dataset.type;
            
            // 更新沙发可视化显示
            updateSofaVisualization(selectedType);
            
            // 更新条件选项显示
            toggleConditionalOptions(selectedType);
            
            // 更新推荐信息
            updateRecommendationByType(selectedType);
        });
    });
}

// 更新沙发可视化
function updateSofaVisualization(type) {
    // 隐藏所有沙发轮廓
    document.querySelectorAll('.sofa-outline').forEach(outline => {
        outline.style.display = 'none';
    });
    
    // 只支持直排沙发和L型沙发
    if (type !== 'straight' && type !== 'l-shape') {
        // 如果类型不是支持的类型，默认显示直排沙发
        type = 'straight';
    }
    
    // 显示对应类型的沙发轮廓
    const targetOutline = document.querySelector(`.sofa-outline[data-type="${type}"]`);
    if (targetOutline) {
        targetOutline.style.display = 'block';
    }
    
    // 如果是L型沙发，应用当前选择的妃位方向
    if (type === 'l-shape') {
        updateLShapeDirection();
    }
}

// 切换条件性选项显示
function toggleConditionalOptions(type) {
    // 隐藏所有条件选项
    document.querySelectorAll('.conditional-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // 显示适用于当前类型的选项
    document.querySelectorAll(`.conditional-option[data-show-when="${type}"]`).forEach(option => {
        option.classList.add('active');
    });
}

// 设置妃位方向选择
function setupDirectionSelection() {
    const directionButtons = document.querySelectorAll('.direction-btn');
    
    directionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // 移除其他按钮的选中状态
            directionButtons.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的选中状态
            btn.classList.add('active');
            
            // 更新L型沙发的方向
            updateLShapeDirection();
        });
    });
}

// 更新L型沙发的方向
function updateLShapeDirection() {
    const activeDirection = document.querySelector('.direction-btn.active');
    if (!activeDirection) return;
    
    const direction = activeDirection.dataset.direction;
    
    // 获取L型沙发的可视化元素
    const lShapeVisual = document.querySelector('.sofa-visual.l-shape-left, .sofa-visual.l-shape-right');
    
    if (lShapeVisual) {
        // 移除现有方向类
        lShapeVisual.classList.remove('l-shape-left', 'l-shape-right');
        
        // 添加新方向类
        lShapeVisual.classList.add(`l-shape-${direction}`);
    }
}

// 设置模块数量选择
function setupModuleSelection() {
    // 由于组合沙发选项已移除，此函数可能不再需要
    // 但为了保持兼容性，保留函数但检查元素是否存在
    
    const minusButtons = document.querySelectorAll('.qty-btn.minus');
    const plusButtons = document.querySelectorAll('.qty-btn.plus');
    
    if (minusButtons.length === 0 || plusButtons.length === 0) {
        // 如果按钮不存在，直接返回
        return;
    }
    
    // 减少数量按钮
    minusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const module = btn.dataset.module;
            const valueElement = document.getElementById(`${module}-module-qty`);
            
            if (valueElement) {
                let value = parseInt(valueElement.textContent, 10);
                
                // 确保不低于0
                if (value > 0) {
                    value--;
                    valueElement.textContent = value;
                    
                    // 更新价格
                    updatePriceImpact();
                }
            }
        });
    });
    
    // 增加数量按钮
    plusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const module = btn.dataset.module;
            const valueElement = document.getElementById(`${module}-module-qty`);
            
            if (valueElement) {
                let value = parseInt(valueElement.textContent, 10);
                
                // 增加数量，但限制最大值为5
                if (value < 5) {
                    value++;
                    valueElement.textContent = value;
                    
                    // 更新价格
                    updatePriceImpact();
                }
            }
        });
    });
}

// 设置尺寸预设选择
function setupSizePresets() {
    const sizeChips = document.querySelectorAll('.size-chip');
    const lengthSlider = document.getElementById('length-slider');
    
    sizeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            // 移除所有按钮的选中状态
            sizeChips.forEach(c => c.classList.remove('active'));
            
            // 设置当前按钮为选中状态
            chip.classList.add('active');
            
            // 获取尺寸值
            const size = chip.getAttribute('data-size');
            
            // 更新滑块和显示值
            if (lengthSlider) {
                lengthSlider.value = size;
                updateSliderValue('length', size);
            }
            
            // 更新当前选择显示
            const currentSizeDisplay = document.querySelector('.current-size-display span.font-medium');
            if (currentSizeDisplay) {
                currentSizeDisplay.textContent = chip.textContent;
            }
            
            // 添加点击反馈效果
            chip.style.transform = 'scale(0.95)';
            setTimeout(() => {
                chip.style.transform = '';
            }, 150);
        });
    });
}

// 设置尺寸滑块
function setupDimensionSliders() {
    // 长度滑块
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    
    if (lengthSlider && lengthValue) {
        lengthSlider.addEventListener('input', () => {
            updateSliderValue('length', lengthSlider.value);
        });
    }
    
    // 深度滑块
    const depthSlider = document.getElementById('depth-slider');
    const depthValue = document.getElementById('depth-value');
    
    if (depthSlider && depthValue) {
        depthSlider.addEventListener('input', () => {
            updateSliderValue('depth', depthSlider.value);
        });
    }
    
    // 高度滑块
    const heightSlider = document.getElementById('height-slider');
    const heightValue = document.getElementById('height-value');
    
    if (heightSlider && heightValue) {
        heightSlider.addEventListener('input', () => {
            updateSliderValue('height', heightSlider.value);
        });
    }
    
    // 高级选项滑块
    const backrestSlider = document.getElementById('backrest-slider');
    const backrestValue = document.getElementById('backrest-value');
    
    if (backrestSlider && backrestValue) {
        backrestSlider.addEventListener('input', () => {
            updateSliderValue('backrest', backrestSlider.value);
        });
    }
    
    const armrestSlider = document.getElementById('armrest-slider');
    const armrestValue = document.getElementById('armrest-value');
    
    if (armrestSlider && armrestValue) {
        armrestSlider.addEventListener('input', () => {
            updateSliderValue('armrest', armrestSlider.value);
        });
    }
}

// 更新尺寸滑块值并高亮显示变化
function updateSliderValue(dimension, value) {
    const valueElement = document.getElementById(`${dimension}-value`);
    if (!valueElement) return;
    
    // 更新数值
    valueElement.textContent = value;
    
    // 添加高亮效果
    valueElement.parentElement.classList.add('highlight-change');
    
    // 移除高亮效果（动画完成后）
    setTimeout(() => {
        valueElement.parentElement.classList.remove('highlight-change');
    }, 800);
    
    // 更新尺寸按钮的选中状态
    if (dimension === 'length') {
        updateSizeChipBySlider(value);
    }
    
    // 更新可视化效果
    updateDimensionLabels();
    
    // 更新推荐文本
    if (dimension === 'length') {
        updateRecommendationBySize(value);
    }
    
    // 价格影响计算
    updatePriceImpact();
}

// 根据滑块值更新尺寸按钮选中状态
function updateSizeChipBySlider(value) {
    const sizeChips = document.querySelectorAll('.size-chip');
    const numValue = parseInt(value, 10);
    
    // 移除所有按钮的选中状态
    sizeChips.forEach(chip => {
        chip.classList.remove('active');
    });
    
    // 匹配找到的按钮设为选中
    let foundMatch = false;
    sizeChips.forEach(chip => {
        const chipSize = parseInt(chip.getAttribute('data-size'), 10);
        if (chipSize === numValue) {
            chip.classList.add('active');
            foundMatch = true;
        }
    });
    
    // 更新当前选择显示
    const currentSizeDisplay = document.querySelector('.current-size-display span.font-medium');
    if (currentSizeDisplay) {
        if (foundMatch) {
            // 找到匹配的预设尺寸，显示其名称
            const activeChip = document.querySelector('.size-chip.active');
            if (activeChip) {
                currentSizeDisplay.textContent = activeChip.textContent;
            }
        } else {
            // 没找到匹配，显示为自定义尺寸
            currentSizeDisplay.textContent = `自定义 (${value}厘米)`;
        }
    }
}

// 更新尺寸标签
function updateDimensionLabels() {
    const lengthValue = document.getElementById('length-value').textContent;
    const depthValue = document.getElementById('depth-value').textContent;
    
    // 更新尺寸标签显示
    document.querySelector('.length-label').textContent = `${lengthValue} 厘米`;
    document.querySelector('.depth-label').textContent = `${depthValue} 厘米`;
    
    // 更新当前尺寸选择显示
    const lengthNum = parseInt(lengthValue, 10);
    let sizeText;
    let isCustom = true;
    
    // 检查是否匹配预设尺寸
    document.querySelectorAll('.size-chip').forEach(chip => {
        const chipSize = parseInt(chip.getAttribute('data-size'), 10);
        if (chipSize === lengthNum) {
            sizeText = chip.textContent;
            isCustom = false;
        }
    });
    
    // 如果是自定义尺寸
    if (isCustom) {
        sizeText = `自定义 (${lengthValue}厘米)`;
    }
    
    // 更新当前选择显示
    const currentSizeDisplay = document.querySelector('.current-size-display span.font-medium');
    if (currentSizeDisplay) {
        currentSizeDisplay.textContent = sizeText;
    }
    
    // 更新建议文本
    updateRecommendationBySize(lengthNum);
}

// 设置高级选项切换
function setupAdvancedOptions() {
    console.log("[DEBUG] 开始设置高级选项");
    const toggleMoreOptionsBtn = document.getElementById('toggle-more-options');
    const advancedOptions = document.getElementById('advanced-options');
    
    if (toggleMoreOptionsBtn && advancedOptions) {
        console.log("[DEBUG] 找到高级选项按钮和内容区域");
        
        // 先移除可能已经存在的事件，防止重复绑定
        toggleMoreOptionsBtn.removeEventListener('click', toggleAdvancedOptions);
        
        // 添加事件处理函数
        toggleMoreOptionsBtn.addEventListener('click', toggleAdvancedOptions);
        
        // 定义事件处理函数
        function toggleAdvancedOptions(e) {
            e.preventDefault();
            console.log("[DEBUG] 点击高级选项按钮");
            
            // 切换高级选项的显示/隐藏
            advancedOptions.classList.toggle('hidden');
            console.log("[DEBUG] 高级选项状态:", advancedOptions.classList.contains('hidden') ? "隐藏" : "显示");
            
            // 切换按钮文本和图标
            if (advancedOptions.classList.contains('hidden')) {
                toggleMoreOptionsBtn.innerHTML = '<i class="fas fa-plus-circle"></i> 显示高级尺寸选项';
                toggleMoreOptionsBtn.classList.remove('active');
            } else {
                toggleMoreOptionsBtn.innerHTML = '<i class="fas fa-minus-circle"></i> 隐藏高级尺寸选项';
                toggleMoreOptionsBtn.classList.add('active');
            }
        }
        
        console.log("[DEBUG] 高级选项设置完成");
    } else {
        console.error("[DEBUG] 错误：找不到高级选项按钮或内容区域!");
    }
}

// 设置视图切换
function setupViewToggle() {
    const viewToggles = document.querySelectorAll('.view-toggle');
    
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            viewToggles.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // 这里可以添加切换视图的逻辑
        });
    });
}

// 计算价格影响
function calculatePriceImpact() {
    // 获取标准尺寸的值
    const standardLength = 240;
    const standardDepth = 90;
    const standardHeight = 45;
    
    // 获取当前值
    const currentLength = parseInt(document.getElementById('length-value').textContent, 10);
    const currentDepth = parseInt(document.getElementById('depth-value').textContent, 10);
    const currentHeight = parseInt(document.getElementById('height-value').textContent, 10);
    
    // 计算每单位差异的价格影响
    const pricePerLengthUnit = 40; // 每厘米长度¥40
    const pricePerDepthUnit = 30;  // 每厘米深度¥30
    const pricePerHeightUnit = 20; // 每厘米高度¥20
    
    // 计算差值
    const lengthDiff = Math.abs(currentLength - standardLength);
    const depthDiff = Math.abs(currentDepth - standardDepth);
    const heightDiff = Math.abs(currentHeight - standardHeight);
    
    // 计算总价影响
    const totalImpact = (lengthDiff * pricePerLengthUnit) + 
                        (depthDiff * pricePerDepthUnit) + 
                        (heightDiff * pricePerHeightUnit);
    
    return totalImpact;
}

// 更新价格影响显示
function updatePriceImpact() {
    const impactValue = calculatePriceImpact();
    const impactElement = document.getElementById('size-price-impact');
    
    if (impactElement) {
        impactElement.textContent = impactValue;
        
        // 添加高亮动画
        impactElement.parentElement.classList.add('highlight-change');
        setTimeout(() => {
            impactElement.parentElement.classList.remove('highlight-change');
        }, 1000);
    }
}

// 设置尺寸折叠区域的交互
function setupDimensionsFold() {
    console.log("[DEBUG] 开始设置尺寸折叠区域");
    const foldBtn = document.getElementById('dimensions-fold-btn');
    const foldContent = document.getElementById('dimensions-content');
    
    if (foldBtn && foldContent) {
        console.log("[DEBUG] 找到尺寸折叠按钮和内容区域");
        
        // 确保初始状态下折叠内容是隐藏的
        foldContent.classList.remove('active');
        
        // 移除所有内联样式，依赖CSS类来控制样式
        foldBtn.removeAttribute('style');
        foldContent.removeAttribute('style');
        
        foldBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("[DEBUG] 尺寸折叠按钮被点击");
            
            // 切换链接的激活状态
            foldBtn.classList.toggle('active');
            
            // 切换内容区域的显示/隐藏
            foldContent.classList.toggle('active');
            
            // 更新图标和内容显示
            if (foldContent.classList.contains('active')) {
                console.log("[DEBUG] 展开内容区域");
                // 显示内容区域并确保其可见
                foldContent.style.display = 'block';
                foldContent.style.maxHeight = foldContent.scrollHeight + 'px';
                
                // 滚动到视图
                setTimeout(() => {
                    foldContent.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            } else {
                console.log("[DEBUG] 折叠内容区域");
                // 如果是折叠状态，先设置max-height为0，然后用延时来隐藏元素
                foldContent.style.maxHeight = '0';
                setTimeout(() => {
                    if (!foldContent.classList.contains('active')) {
                        foldContent.style.display = 'none';
                    }
                }, 300); // 与CSS过渡时间匹配
            }
        });
        
        console.log("[DEBUG] 尺寸折叠区域设置完成");
    } else {
        console.error("[DEBUG] 错误：找不到尺寸调整按钮或内容区域!");
    }
}

// 文档就绪后的初始化函数
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] DOM已加载，开始初始化...');
    
    // 首先初始化折叠区域，确保它在页面加载时正确显示
    setupDimensionsFold();
    console.log('[DEBUG] 折叠区域初始化完成');
    
    // 安全地调用setupScrollIndicator，确保元素存在
    const sofaCategoriesRow = document.querySelector('.sofa-categories-row');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (sofaCategoriesRow && scrollIndicator) {
        setupScrollIndicator(sofaCategoriesRow, scrollIndicator);
    }
    
    setupFabricCarousels();
    setupFabricEvents();
    setupSizePresets();
    setupDimensionSliders();
    setupAdvancedOptions(); // 只在这里调用一次高级选项设置
    setupViewToggle();
    
    // 以下是添加的调试代码，检查页面上是否有尺寸调整按钮
    setTimeout(function() {
        const foldBtn = document.getElementById('dimensions-fold-btn');
        if (foldBtn) {
            console.log('[DEBUG] 尺寸调整按钮存在:', foldBtn);
            console.log('[DEBUG] 按钮可见性:', window.getComputedStyle(foldBtn).display);
            
            // 移除添加视觉提示的代码 - 这部分功能已移至进入步骤3时执行
            // setTimeout(function() {
            //    // 显示提示消息
            //    showToast('您可以点击"调整具体尺寸"来自定义沙发尺寸');
            //    
            //    // 添加临时高亮效果
            //    foldBtn.classList.add('highlight-change');
            //    setTimeout(function() {
            //        foldBtn.classList.remove('highlight-change');
            //    }, 2000);
            // }, 1500);
        } else {
            console.error('[DEBUG] 错误：找不到尺寸调整按钮!');
        }
    }, 500);
    
    // 步骤切换
    // 移除重复调用，避免重复添加事件
    // setupDimensionsFold();
    
    // 步骤切换
    document.getElementById('nextStep').addEventListener('click', function() {
        // 获取当前激活的步骤
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const currentStep = parseInt(activeStep.getAttribute('data-step'));
            if (currentStep < 5) {
                updateSteps(currentStep + 1);
            }
        }
    });
    
    document.getElementById('prevStep').addEventListener('click', function() {
        // 获取当前激活的步骤
        const activeStep = document.querySelector('.step.active');
        if (activeStep) {
            const currentStep = parseInt(activeStep.getAttribute('data-step'));
            if (currentStep > 1) {
                updateSteps(currentStep - 1);
            }
        }
    });
    
    // 添加步骤指示器点击事件 - 允许用户点击步骤指示器直接跳转
    document.querySelectorAll('.step').forEach(step => {
        step.addEventListener('click', function() {
            const stepNum = parseInt(this.getAttribute('data-step'));
            const activeStep = document.querySelector('.step.active');
            const currentStepNum = activeStep ? parseInt(activeStep.getAttribute('data-step')) : 1;
            
            // 只允许跳转到已完成的步骤或下一步
            if (stepNum <= Math.max(currentStepNum, 2)) {
                updateSteps(stepNum);
            }
        });
    });
    
    // 标签页切换
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            const tabType = this.getAttribute('data-tab');
            
            // 移除所有标签的激活状态
            document.querySelectorAll('.tab-btn').forEach(t => {
                t.classList.remove('active');
            });
            
            // 添加当前标签的激活状态
            this.classList.add('active');
            
            // 切换容器
            if (tabType === 'standard') {
                document.querySelector('.flipper').classList.remove('flipped');
            } else {
                document.querySelector('.flipper').classList.add('flipped');
            }
        });
    });
});

// 初始化尺寸调整相关设置
function initializeDimensionsSettings() {
    console.log("[DEBUG] 初始化尺寸调整相关设置");
    
    // 重新初始化尺寸折叠功能
    setupDimensionsFold();
    
    // 确保高级选项也被正确初始化
    setupAdvancedOptions();
    
    // 确保尺寸滑块功能正常
    setupDimensionSliders();
    
    // 确保尺寸预设功能正常
    setupSizePresets();
    
    // 找到折叠按钮，给它添加一个突出显示的动画
    const foldBtn = document.getElementById('dimensions-fold-btn');
    if (foldBtn) {
        // 只在首次进入步骤3时显示提示（使用sessionStorage跟踪）
        if (!sessionStorage.getItem('step3_tip_shown')) {
            // 显示提示消息
            setTimeout(() => {
                showToast('您可以点击"调整具体尺寸"来自定义沙发尺寸');
                sessionStorage.setItem('step3_tip_shown', 'true');
            }, 1000);
        }
        
        // 添加突出动画
        setTimeout(() => {
            foldBtn.classList.add('highlight-change');
            setTimeout(() => {
                foldBtn.classList.remove('highlight-change');
            }, 1500);
        }, 500);
    }
}

// 更新沙发尺寸选择功能
function setupSizeSelection() {
    console.log("[DEBUG] 设置沙发尺寸选择功能");
    
    // 获取所有沙发类型卡片
    const sofaTypeCards = document.querySelectorAll('.sofa-type-card');
    if (sofaTypeCards.length === 0) {
        console.log("[WARNING] 未找到沙发类型卡片");
        return;
    }
    
    // 获取尺寸标签
    const sofaTypeLabel = document.querySelector('.sofa-type-label');
    
    // 获取尺寸预览相关元素
    const sofaTypeImage = document.getElementById('sofaTypeImage');
    const vizLength = document.getElementById('vizLength');
    const vizDepth = document.getElementById('vizDepth');
    const vizHeight = document.getElementById('vizHeight');
    
    // 获取尺寸文本元素
    const lengthValue = document.getElementById('length-value');
    const depthValue = document.getElementById('depth-value');
    const heightValue = document.getElementById('height-value');
    
    // 保存尺寸默认值
    const defaultDimensions = {
        single: { length: 90, depth: 90, height: 45 },
        double: { length: 180, depth: 90, height: 45 },
        triple: { length: 210, depth: 90, height: 45 },
        quad: { length: 240, depth: 90, height: 45 },
        'triple-left': { length: 270, depth: 90, height: 45 },
        'triple-right': { length: 270, depth: 90, height: 45 }
    };
    
    // 当前选择的沙发类型和尺寸
    let currentType = 'double';
    let currentDimensions = { ...defaultDimensions[currentType] };
    
    // 尺寸调整步进值
    const dimensionSteps = {
        length: 10,
        depth: 5,
        height: 1
    };
    
    // 尺寸范围限制
    const dimensionLimits = {
        length: { min: 90, max: 360 },
        depth: { min: 70, max: 110 },
        height: { min: 38, max: 52 }
    };
    
    // 设置适用场景推荐
    const spaceRecommendation = document.getElementById('spaceRecommendation');
    const recommendations = {
        single: "单人位沙发适合小户型/书房，占用空间小，建议保留至少50cm的活动空间。",
        double: "二人位沙发适合15-20㎡的客厅空间，建议搭配一个茶几和一个小边几，保持通道宽度至少70cm。",
        triple: "三人位沙发适合20-25㎡的客厅，建议搭配茶几、边几和小型装饰柜，保持通道宽度至少80cm。",
        quad: "四人位沙发适合25㎡以上的大客厅，建议搭配大茶几和边柜，确保有足够活动空间。",
        'triple-left': "带左妃位的沙发适合L型空间，通常需要3x4米以上的区域，建议放置在靠墙一侧。",
        'triple-right': "带右妃位的沙发适合L型空间，通常需要3x4米以上的区域，建议放置在靠墙一侧。"
    };
    
    // 更新沙发类型图片
    function updateSofaTypeImage(type) {
        const sofaTypeImage = document.getElementById('sofaTypeImage');
        const sofaTypeImagePath = `../img/sofa-types/${type}.svg`;
        
        // 设置新图片路径
        sofaTypeImage.src = sofaTypeImagePath;
        
        // 添加加载错误处理
        sofaTypeImage.onerror = function() {
            // 如果指定的图片加载失败，使用默认图片
            this.src = '../img/sofa-types/2-seats.svg';
            console.log(`无法加载图片: ${sofaTypeImagePath}，使用默认图片代替`);
        };
        
        // 添加标记线高亮效果
        const markerLines = document.querySelectorAll('.marker-line');
        markerLines.forEach(line => {
            line.classList.remove('pulse');
            void line.offsetWidth; // 触发重排以重新应用动画
            line.classList.add('pulse');
        });
    }
    
    // 获取类型的显示名称
    function getSofaTypeName(type) {
        const activeCard = document.querySelector(`.sofa-type-card[data-type="${type}"]`);
        return activeCard ? activeCard.getAttribute('data-name') : '';
    }
    
    // 更新尺寸显示
    function updateDimensionDisplay() {
        // 更新可视化标签
        if (vizLength) vizLength.textContent = currentDimensions.length;
        if (vizDepth) vizDepth.textContent = currentDimensions.depth;
        if (vizHeight) vizHeight.textContent = currentDimensions.height;
        
        // 更新输入框值
        if (lengthValue) lengthValue.textContent = currentDimensions.length;
        if (depthValue) depthValue.textContent = currentDimensions.depth;
        if (heightValue) heightValue.textContent = currentDimensions.height;
    }
    
    // 更新空间推荐
    function updateSpaceRecommendation(type) {
        if (spaceRecommendation) {
            spaceRecommendation.textContent = recommendations[type] || recommendations['double'];
        }
    }
    
    // 处理沙发类型卡片点击
    sofaTypeCards.forEach(card => {
        card.addEventListener('click', () => {
            // 移除当前激活状态
            sofaTypeCards.forEach(c => c.classList.remove('active'));
            
            // 设置新的激活状态
            card.classList.add('active');
            
            // 获取类型数据
            const type = card.getAttribute('data-type');
            const name = card.getAttribute('data-name');
            
            // 更新当前类型和标签
            currentType = type;
            if (sofaTypeLabel) sofaTypeLabel.textContent = name;
            
            // 重置为默认尺寸
            currentDimensions = { ...defaultDimensions[type] };
            
            // 更新可视化
            updateSofaTypeImage(type);
            updateDimensionDisplay();
            updateSpaceRecommendation(type);
        });
    });
    
    // 设置尺寸调整按钮
    const dimensionButtons = document.querySelectorAll('.dimension-btn');
    dimensionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const dimension = button.getAttribute('data-dimension');
            const isPlus = button.classList.contains('plus');
            
            // 计算新值
            const step = dimensionSteps[dimension] || 1;
            let newValue = currentDimensions[dimension] + (isPlus ? step : -step);
            
            // 确保在限制范围内
            const limits = dimensionLimits[dimension] || { min: 0, max: 1000 };
            newValue = Math.max(limits.min, Math.min(limits.max, newValue));
            
            // 更新当前尺寸
            currentDimensions[dimension] = newValue;
            
            // 更新显示
            updateDimensionDisplay();
        });
    });
    
    // 设置恢复默认尺寸按钮
    const resetButton = document.querySelector('.reset-dimension-btn');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            // 重置为当前类型的默认尺寸
            currentDimensions = { ...defaultDimensions[currentType] };
            updateDimensionDisplay();
            
            // 显示提示
            showToast('已恢复默认尺寸');
        });
    }
    
    // 初始化显示
    updateSofaTypeImage(currentType);
    updateDimensionDisplay();
    updateSpaceRecommendation(currentType);
    
    console.log("[DEBUG] 沙发尺寸选择功能设置完成");
}

// 显示简单提示
function showSimpleToast(message) {
    // 检查是否已有toast元素
    let toast = document.getElementById('simpleToast');
    
    // 如果没有，创建一个
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'simpleToast';
        toast.className = 'simple-toast';
        document.body.appendChild(toast);
    }
    
    // 设置消息并显示
    toast.textContent = message;
    toast.classList.add('show');
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 替换原来的setupSizePresets函数
function setupSizePresets() {
    // 使用新的尺寸选择功能
    setupSizeSelection();
}

// 选择沙发类型时滚动到预览图区域
function setupSofaTypeCardSelection() {
    const typeCards = document.querySelectorAll('.sofa-type-card');
    const visualizationArea = document.querySelector('.sofa-type-visualization');
    
    typeCards.forEach(card => {
        // 移除可能已存在的事件监听器以避免重复
        card.removeEventListener('click', scrollToVisualization);
        
        // 添加新的事件监听器
        card.addEventListener('click', scrollToVisualization);
    });
    
    // 滚动到预览图区域的函数
    function scrollToVisualization() {
        if (visualizationArea) {
            // 计算需要滚动的位置，使预览图在视图中居中
            const offset = visualizationArea.offsetTop - 70; // 预留一些顶部空间
            window.scrollTo({
                top: offset,
                behavior: 'smooth' // 平滑滚动效果
            });
        }
    }
}

// 确保在DOM加载完成后初始化，并在步骤3（尺寸选择）激活时重新设置
document.addEventListener('DOMContentLoaded', () => {
    // 监听步骤变化
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', () => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber === 3) {
                // 当进入步骤3时，确保设置沙发类型卡片选择功能
                setTimeout(setupSofaTypeCardSelection, 100);
            }
        });
    });
    
    // 初始设置
    setupSofaTypeCardSelection();
});

// 更新当前沙发选择状态显示
function updateCurrentSelectionDisplay() {
    // 获取当前激活的沙发类型
    const activeCard = document.querySelector('.sofa-type-card.active');
    if (!activeCard) return;
    
    const sofaType = activeCard.dataset.type;
    const sofaName = activeCard.dataset.name;
    const sofaWidth = document.getElementById('length-value').textContent;
    const sofaDepth = document.getElementById('depth-value').textContent;
    const sofaHeight = document.getElementById('height-value').textContent;
    
    // 更新当前选择标题 - 紧凑格式
    const currentTitle = document.querySelector('.current-size-display');
    if (currentTitle) {
        currentTitle.innerHTML = `
            <i class="fas fa-couch"></i>
            <span class="font-medium">${sofaName}</span>
            <span>（${sofaWidth} × ${sofaDepth} × ${sofaHeight} cm）</span>
        `;
        
        // 添加高亮动画效果
        currentTitle.classList.remove('highlight-change');
        // 触发重绘
        void currentTitle.offsetWidth;
        currentTitle.classList.add('highlight-change');
    }
    
    // 更新预览图中的尺寸标记
    const vizLength = document.getElementById('vizLength');
    const vizDepth = document.getElementById('vizDepth');
    const vizHeight = document.getElementById('vizHeight');
    
    if (vizLength) vizLength.textContent = sofaWidth;
    if (vizDepth) vizDepth.textContent = sofaDepth;
    if (vizHeight) vizHeight.textContent = sofaHeight;
    
    // 更新沙发类型图片
    updateSofaTypeImage(sofaType);
    
    // 更新空间推荐信息
    updateSpaceRecommendation(sofaType);
    
    // 为标记添加脉冲效果
    const markerLines = document.querySelectorAll('.marker-line');
    markerLines.forEach(line => {
        line.classList.remove('pulse');
        void line.offsetWidth; // 触发重绘
        line.classList.add('pulse');
    });
}

// 完全替换沙发图片更新函数
function updateSofaTypeImage(type) {
    console.log("更新沙发类型:", type);
    const sofaSvg = document.getElementById('sofaTypeImage');
    if (!sofaSvg) {
        console.error("找不到沙发SVG元素");
        return;
    }
    
    // 由于我们现在使用内联SVG，可以直接修改SVG的样式或添加类
    
    // 为不同沙发类型设置不同的颜色
    let sofaColor = "#29a89c";
    switch(type) {
        case 'single':
            sofaColor = "#4ea8be";
            break;
        case 'double':
            sofaColor = "#29a89c";
            break;
        case 'triple':
            sofaColor = "#2a9d8f";
            break;
        case 'quad':
            sofaColor = "#1d7d74";
            break;
        default:
            sofaColor = "#29a89c";
    }
    
    // 修改SVG内部的path元素颜色
    const paths = sofaSvg.querySelectorAll('path');
    paths.forEach(path => {
        path.setAttribute('fill', sofaColor);
    });
    
    // 更新沙发形状 - 调整第一个path的形状以表示不同类型的沙发
    const mainPath = paths[0];
    if (mainPath) {
        let newPathData = "";
        switch(type) {
            case 'single':
                // 更窄的沙发
                newPathData = "M70,70 L130,70 C140,70 145,65 145,55 L145,50 C145,45 140,40 135,40 L65,40 C60,40 55,45 55,50 L55,55 C55,65 60,70 70,70 Z";
                break;
            case 'double':
                // 标准宽度
                newPathData = "M50,70 L150,70 C160,70 170,65 170,55 L170,50 C170,45 165,40 160,40 L40,40 C35,40 30,45 30,50 L30,55 C30,65 40,70 50,70 Z";
                break;
            case 'triple':
                // 更宽的沙发
                newPathData = "M40,70 L160,70 C170,70 180,65 180,55 L180,50 C180,45 175,40 170,40 L30,40 C25,40 20,45 20,50 L20,55 C20,65 30,70 40,70 Z";
                break;
            case 'quad':
                // 最宽的沙发
                newPathData = "M30,70 L170,70 C180,70 190,65 190,55 L190,50 C190,45 185,40 180,40 L20,40 C15,40 10,45 10,50 L10,55 C10,65 20,70 30,70 Z";
                break;
            default:
                newPathData = "M50,70 L150,70 C160,70 170,65 170,55 L170,50 C170,45 165,40 160,40 L40,40 C35,40 30,45 30,50 L30,55 C30,65 40,70 50,70 Z";
        }
        mainPath.setAttribute('d', newPathData);
    }
    
    // 添加简单的动画效果
    sofaSvg.style.transition = "all 0.3s ease";
    sofaSvg.style.transform = "scale(0.95)";
    setTimeout(() => {
        sofaSvg.style.transform = "scale(1)";
    }, 50);
}

function updateSpaceRecommendation(type) {
    const recommendationText = document.getElementById('spaceRecommendation');
    if (!recommendationText) return;
    
    // 根据类型设置不同的建议文本
    let text = '';
    switch(type) {
        case 'single':
            text = '适合5-10㎡小型空间，如书房或休息角';
            break;
        case 'double':
            text = '适合15-20㎡客厅，建议搭配茶几和边几';
            break;
        case 'triple':
            text = '适合20-30㎡中型客厅，可容纳多人';
            break;
        case 'quad':
            text = '适合30㎡以上大客厅，家庭聚会首选';
            break;
        case 'l-shape':
            text = '适合开放式客厅，提供转角布置选择';
            break;
        default:
            text = '选择合适沙发类型以匹配您的空间';
    }
    
    // 更新建议文本
    recommendationText.textContent = text;
    
    // 添加动画效果
    recommendationText.classList.remove('highlight-change');
    void recommendationText.offsetWidth; // 触发重绘
    recommendationText.classList.add('highlight-change');
}

// 在沙发类型卡片点击处理函数中添加调用
document.addEventListener('DOMContentLoaded', function() {
    // 获取所有沙发类型卡片
    const sofaTypeCards = document.querySelectorAll('.sofa-type-card');
    
    // 为每个卡片添加点击事件
    sofaTypeCards.forEach(card => {
        card.addEventListener('click', function() {
            // 移除其他卡片的active类
            sofaTypeCards.forEach(c => c.classList.remove('active'));
            
            // 为当前卡片添加active类
            this.classList.add('active');
            
            // 获取当前卡片的类型和尺寸
            const type = this.getAttribute('data-type');
            const size = this.getAttribute('data-size');
            
            // 更新长度值显示
            document.getElementById('length-value').textContent = size;
            
            // 更新当前选择状态显示
            updateCurrentSelectionDisplay();
            
            // 触发尺寸变化事件，更新其他相关显示
            updateDimensionVisualization();
            updateSpaceRecommendation();
        });
    });
    
    // 尺寸调整按钮事件
    const dimensionBtns = document.querySelectorAll('.dimension-btn');
    dimensionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const dimension = this.getAttribute('data-dimension');
            const valueElement = document.getElementById(`${dimension}-value`);
            let value = parseInt(valueElement.textContent);
            
            if (this.classList.contains('plus')) {
                value += 5;
            } else if (this.classList.contains('minus')) {
                value = Math.max(value - 5, 0);
            }
            
            valueElement.textContent = value;
            updateDimensionVisualization();
            updateCurrentSelectionDisplay();
        });
    });
    
    // 恢复默认尺寸按钮事件
    const resetBtn = document.querySelector('.reset-dimension-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            const activeCard = document.querySelector('.sofa-type-card.active');
            if (activeCard) {
                const defaultSize = activeCard.getAttribute('data-size');
                document.getElementById('length-value').textContent = defaultSize;
                document.getElementById('depth-value').textContent = '90';
                document.getElementById('height-value').textContent = '45';
                
                updateDimensionVisualization();
                updateCurrentSelectionDisplay();
                
                // 显示提示
                showToast('已恢复默认尺寸');
            }
        });
    }
    
    // 初始化当前选择状态显示
    updateCurrentSelectionDisplay();
});


