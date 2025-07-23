document.addEventListener('DOMContentLoaded', function() {
    console.log('=== 页面加载 ===');
    
    // 强制清除所有可能的遮罩层
    document.querySelectorAll('.fixed.inset-0, .query-input-overlay, #cityPickerOverlay, #pickerOverlay').forEach(overlay => {
        console.log('清除遮罩层:', overlay.id || overlay.className);
        
        try {
            if(overlay.id === 'cityPickerOverlay') {
                overlay.classList.remove('active');
                overlay.classList.add('hidden');
                overlay.style.opacity = '0';
                overlay.style.zIndex = '-1';
                overlay.style.pointerEvents = 'none';
            } else if(overlay.id === 'pickerOverlay') {
                overlay.classList.add('hidden');
                overlay.style.opacity = '0';
            } else if(overlay.classList.contains('query-input-overlay')) {
                overlay.classList.remove('active');
            } else {
                overlay.classList.add('hidden');
            }
        } catch (error) {
            console.error('清除遮罩层出错:', error);
        }
    });
    
    // 检查关键元素是否存在
    console.log('检查关键元素...');
    [
        {id: 'mainContainer', element: document.getElementById('mainContainer')},
        {id: 'queryInputContainer', element: document.getElementById('queryInputContainer')},
        {id: 'dynamicInputArea', element: document.getElementById('dynamicInputArea')},
        {id: 'chatHistory', element: document.getElementById('chatHistory')},
        {id: 'presetQuestions', element: document.getElementById('presetQuestions')},
        {id: 'cityPickerOverlay', element: document.getElementById('cityPickerOverlay')},
        {id: 'cityPickerContainer', element: document.getElementById('cityPickerContainer')}
    ].forEach(item => {
        console.log(`${item.id}: ${item.element ? '存在' : '不存在'}`);
    });
    
    // --- Element Cache ---
      const backButton = document.getElementById('backButton');
      const menuButton = document.getElementById('menuButton');
      const closeMenuButton = document.getElementById('closeMenuButton');
      const functionMenu = document.getElementById('functionMenu');
      const menuOverlay = document.getElementById('menuOverlay');
    const mainContainer = document.getElementById('mainContainer');
    const queryInputContainer = document.getElementById('queryInputContainer');
    const dynamicInputArea = document.getElementById('dynamicInputArea');
    const chatHistory = document.getElementById('chatHistory');
    const compactInputBar = document.getElementById('compactInputBar');
    const chatModeFooter = document.getElementById('chatModeFooter');
    const compactInputClickable = document.getElementById('compactInputClickable');
    const compactSendBtn = document.getElementById('compactSendBtn');
    const compactSummaryText = document.getElementById('compactSummaryText');
    const presetQuestionsContainer = document.getElementById('presetQuestions');
    const pillsContainer = document.querySelector('.pills-container');
    
    console.log('Elements initialized:');
    console.log('pillsContainer:', pillsContainer);
    console.log('dynamicInputArea:', dynamicInputArea);
    console.log('presetQuestionsContainer:', presetQuestionsContainer);
    
    const pickerOverlay = document.getElementById('pickerOverlay');
    const pickerContainer = document.getElementById('pickerContainer');
    const pickerTitle = document.getElementById('pickerTitle');
    const pickerOptionsContainer = document.getElementById('pickerOptions');
    const pickerCancelBtn = document.getElementById('pickerCancel');
    const pickerConfirmBtn = document.getElementById('pickerConfirm');
    
    // 城市选择器元素
    const cityPickerOverlay = document.getElementById('cityPickerOverlay');
    const cityPickerContainer = document.getElementById('cityPickerContainer');
    const cityPickerCancel = document.getElementById('cityPickerCancel');
    const cityPickerConfirm = document.getElementById('cityPickerConfirm');
    const citySearchInput = document.getElementById('citySearchInput');
    const citySearchClear = document.getElementById('citySearchClear');
    const citySearchResults = document.getElementById('citySearchResults');
    const hotCitiesList = document.getElementById('hotCitiesList');
    const recentCitiesList = document.getElementById('recentCitiesList');
    const allCitiesList = document.getElementById('allCitiesList');
    const locationCity = document.getElementById('locationCity');

    // --- State ---
    let isChatActive = false; // Has the first query been sent?
    let hasInteracted = false; // 用户是否已经交互过一次
    let activeInput = null; // Track the currently active <input> element
    let currentDropdownButton = null;
    let selectedValue = '';
    // 城市选择器状态
    let selectedCity = '天津';
    let recentCities = ['北京', '上海']; // 最近使用的城市，实际应用中应存储在localStorage
    
    // --- Data ---
    // 热门城市列表
    const hotCities = ['北京', '上海', '广州', '深圳', '天津', '成都', '杭州', '南京', '苏州', '重庆'];
    
    // 城市数据 - 省市二级结构
    const cityData = {
        '北京': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'],
        '上海': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '浦东新区', '闵行区', '宝山区', '嘉定区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'],
        '天津': ['和平区', '河东区', '河西区', '南开区', '河北区', '红桥区', '东丽区', '西青区', '津南区', '北辰区', '武清区', '宝坻区', '滨海新区', '宁河区', '静海区', '蓟州区'],
        '重庆': ['渝中区', '万州区', '涪陵区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '綦江区', '大足区', '渝北区', '巴南区', '黔江区', '长寿区'],
        '广东': ['广州', '深圳', '珠海', '汕头', '佛山', '韶关', '湛江', '肇庆', '江门', '茂名', '惠州', '梅州', '汕尾', '河源', '阳江', '清远', '东莞', '中山', '潮州', '揭阳', '云浮'],
        '江苏': ['南京', '无锡', '徐州', '常州', '苏州', '南通', '连云港', '淮安', '盐城', '扬州', '镇江', '泰州', '宿迁'],
        '浙江': ['杭州', '宁波', '温州', '嘉兴', '湖州', '绍兴', '金华', '衢州', '舟山', '台州', '丽水'],
        '四川': ['成都', '自贡', '攀枝花', '泸州', '德阳', '绵阳', '广元', '遂宁', '内江', '乐山', '南充', '眉山', '宜宾', '广安', '达州', '雅安', '巴中', '资阳', '阿坝', '甘孜', '凉山']
    };
    
    const pickerData = {
        renovationType: ['精装房', '简装房', '毛坯房', '旧房翻新'],
        customItem: ['衣柜', '橱柜', '书柜', '榻榻米', '电视柜'],
        material: ['实木颗粒板', '多层实木板', '生态板', '原木'],
        style: ['现代简约', '北欧', '新中式', '轻奢', '美式'],
        furnitureItem: ['沙发', '床', '餐桌', '椅子', '茶几'],
        sofaStyle: ['三人位', '四人位', 'L型', 'U型', '贵妃榻'],
        sofaMaterial: ['科技布', '真皮', '棉麻', '绒布', '头层牛皮', '进口真皮', '高档羊毛'],
        applianceSpace: ['客厅', '厨房', '卧室', '卫生间'],
        brandPreference: ['无偏好', '国产', '进口', '指定品牌'],
        sofaShape: ['L型', '一字型', '组合型', 'U型', '贵妃榻'],
        sofaColor: ['浅灰色', '深灰色', '米白色', '棕色', '蓝色', '黑色', '驼色'],
        sofaLength: ['2.8', '3.0', '3.2', '3.5', '3.8', '4.0', '4.5'],
        // 不同材质的价格区间
        materialPriceRange: {
            '头层牛皮': ['10~20元/平方英尺', '20~30元/平方英尺', '30~50元/平方英尺', '50元以上/平方英尺'],
            '进口真皮': ['30~50元/平方英尺', '50~100元/平方英尺', '100元以上/平方英尺'],
            '科技布': ['10~20元/米', '20~30元/米', '30~50元/米'],
            '棉麻': ['15~25元/米', '25~40元/米', '40~60元/米'],
            '绒布': ['20~30元/米', '30~50元/米', '50~80元/米'],
            '高档羊毛': ['40~60元/米', '60~100元/米', '100元以上/米']
        },
        sofaPullOutBed: ['无', '单人', '双人', '三人']
    };
    
    // --- Init ---
    initLayout();
    initCityPicker();
    
    // 直接绑定关键事件监听器
    console.log('直接绑定事件监听器');
    
    // 标签切换
    document.querySelector('.feature-pills').addEventListener('click', function(e) {
        console.log('Pills direct click:', e.target);
        try {
            if (e.target.classList.contains('feature-pill')) {
                handlePillClick(e);
            }
        } catch (error) {
            console.error('标签直接点击事件出错:', error);
        }
    });
    
    // 预设问题
    document.querySelector('#presetQuestions .space-y-3').addEventListener('click', function(e) {
        console.log('Preset questions direct click:', e.target);
        try {
            if (e.target.classList.contains('preset-question-btn')) {
                handlePresetQuestionClick(e);
            }
        } catch (error) {
            console.error('预设问题直接点击事件出错:', error);
        }
    });
    
    // 发送按钮
    document.querySelectorAll('.send-btn-new').forEach(btn => {
        btn.addEventListener('click', function(e) {
            console.log('Send button direct click');
            try {
                const template = this.closest('.pricing-template');
                if (template) {
                    const querySummary = generateQuerySummary(template);
                    handleQuery(querySummary, template);
                } else {
                    console.log('No pricing template found for direct send button click');
                }
            } catch (error) {
                console.error('发送按钮直接点击事件出错:', error);
            }
        });
    });
    
    // --- Event Listeners ---
    if(backButton) backButton.addEventListener('click', () => window.history.back());
    if(menuButton) menuButton.addEventListener('click', openMenu);
    if(closeMenuButton) closeMenuButton.addEventListener('click', closeMenu);
    if(menuOverlay) menuOverlay.addEventListener('click', closeMenu);
    if(dynamicInputArea) dynamicInputArea.addEventListener('click', handleDynamicAreaClick);
    if(presetQuestionsContainer) presetQuestionsContainer.addEventListener('click', handlePresetQuestionClick);
    if(pickerCancelBtn) pickerCancelBtn.addEventListener('click', () => closePicker(false));
    if(pickerConfirmBtn) pickerConfirmBtn.addEventListener('click', () => closePicker(true));
    if(pickerOverlay) pickerOverlay.addEventListener('click', () => closePicker(false));
    if(compactInputClickable) compactInputClickable.addEventListener('click', expandInputFromCompact);
    if(compactSendBtn) compactSendBtn.addEventListener('click', resendLastQuery);
    if(mainContainer) mainContainer.addEventListener('click', collapseInputOnMainClick);
    if(pillsContainer) pillsContainer.addEventListener('click', handlePillClick);
    
    // 城市选择器事件监听
    if(cityPickerCancel) cityPickerCancel.addEventListener('click', () => closeCityPicker(false));
    if(cityPickerOverlay) cityPickerOverlay.addEventListener('click', () => closeCityPicker(false));
    if(citySearchInput) citySearchInput.addEventListener('input', handleCitySearch);
    if(citySearchClear) citySearchClear.addEventListener('click', clearCitySearch);
    if(locationCity) locationCity.addEventListener('click', selectLocationCity);
    
    // 添加底部弹出层关闭按钮的事件监听
    const sheetCloseBtn = document.getElementById('sheetCloseBtn');
    if(sheetCloseBtn) sheetCloseBtn.addEventListener('click', collapseBottomSheet);
    
    // 添加遮罩层的事件监听
    const queryInputOverlay = document.getElementById('queryInputOverlay');
    if(queryInputOverlay) queryInputOverlay.addEventListener('click', collapseBottomSheet);

    // --- Functions ---

    // 初始化布局
    function initLayout() {
        // 初始状态下，内容区域从顶部开始，而不是垂直居中
        mainContainer.style.justifyContent = 'flex-start';
        mainContainer.style.paddingTop = '0px';
        chatHistory.style.paddingTop = '0';
        
        // 确保标题栏隐藏
        const sheetHeader = queryInputContainer.querySelector('.sheet-header');
        if (sheetHeader) sheetHeader.classList.add('hidden');
        
        // 初始状态下，用户未交互过
        hasInteracted = false;
        
        // 初始化按钮文案和预设问题
        const activeButton = document.querySelector('.feature-pill.active');
        if (activeButton) {
            const targetId = activeButton.dataset.target + '-template';
            const template = document.getElementById(targetId);
            if (template) {
                // 设置初始按钮文案
                const buttonTextMap = {
                    renovation: '获取装修报价',
                    custom: '获取定制方案',
                    furniture: '查看家具推荐',
                    appliance: '查看家电套餐',
                    sofa: '获取沙发报价'
                };
                
                const buttonSpan = template.querySelector('.send-btn-new span');
                if (buttonSpan) {
                    buttonSpan.textContent = buttonTextMap[activeButton.dataset.target] || '获取AI报价';
                }
                
                // 设置初始预设问题
                updatePresetQuestions(activeButton.dataset.target);
                
                // 设置面积输入框事件监听
                setupAreaInputs();
            }
        }
    }
    
    // 初始化城市选择器
    function initCityPicker() {
        console.log('初始化城市选择器开始...');
        
        try {
            // 确保城市选择器和遮罩层在初始状态下是隐藏的
            if (cityPickerOverlay) {
                console.log('处理cityPickerOverlay...');
                cityPickerOverlay.classList.add('hidden');
                cityPickerOverlay.classList.remove('active');
            } else {
                console.log('城市选择器遮罩层元素不存在!');
            }
            
            if (cityPickerContainer) {
                console.log('处理cityPickerContainer...');
                cityPickerContainer.classList.add('translate-y-full');
                cityPickerContainer.classList.remove('active');
            } else {
                console.log('城市选择器容器元素不存在!');
            }
            
            // 渲染热门城市
            console.log('开始渲染热门城市...');
            renderHotCities();
            
            // 渲染最近使用的城市
            console.log('开始渲染最近使用城市...');
            renderRecentCities();
            
            // 渲染所有城市列表
            console.log('开始渲染所有城市...');
            renderAllCities();
            
            // 从localStorage加载最近城市
            console.log('加载localStorage中的最近城市...');
            loadRecentCities();
            
            console.log('城市选择器初始化完成');
        } catch (error) {
            console.error('城市选择器初始化出错:', error);
        }
    }
    
    // 渲染热门城市
    function renderHotCities() {
        if (!hotCitiesList) return;
        hotCitiesList.innerHTML = '';
        
        hotCities.forEach(city => {
            const cityBtn = document.createElement('button');
            cityBtn.className = 'city-btn';
            cityBtn.textContent = city;
            if (city === selectedCity) {
                cityBtn.classList.add('selected');
            }
            cityBtn.addEventListener('click', () => {
                selectCity(city);
            });
            hotCitiesList.appendChild(cityBtn);
        });
    }
    
    // 渲染最近使用的城市
    function renderRecentCities() {
        if (!recentCitiesList) return;
        recentCitiesList.innerHTML = '';
        
        // 如果没有最近使用的城市，隐藏该区域
        if (recentCities.length === 0) {
            document.getElementById('recentCities').style.display = 'none';
            return;
        }
        
        document.getElementById('recentCities').style.display = 'block';
        recentCities.forEach(city => {
            const cityBtn = document.createElement('button');
            cityBtn.className = 'city-btn';
            cityBtn.textContent = city;
            if (city === selectedCity) {
                cityBtn.classList.add('selected');
            }
            cityBtn.addEventListener('click', () => {
                selectCity(city);
            });
            recentCitiesList.appendChild(cityBtn);
        });
    }
    
    // 渲染所有城市列表
    function renderAllCities() {
        if (!allCitiesList) return;
        allCitiesList.innerHTML = '';
        
        // 按首字母分组排序
        const sortedProvinces = Object.keys(cityData).sort((a, b) => {
            return a.localeCompare(b, 'zh');
        });
        
        // 创建分组列表
        sortedProvinces.forEach(province => {
            // 创建省份项
            const provinceItem = document.createElement('div');
            provinceItem.className = 'city-list-item';
            provinceItem.textContent = province;
            provinceItem.addEventListener('click', () => {
                selectCity(province);
                addToRecentCities(province);
                closeCityPicker(true);
            });
            
            // 添加箭头图标，表示可以进入下级
            const arrowIcon = document.createElement('i');
            arrowIcon.className = 'fas fa-chevron-right text-gray-300';
            provinceItem.appendChild(arrowIcon);
            
            allCitiesList.appendChild(provinceItem);
        });
    }
    
    // 从localStorage加载最近城市
    function loadRecentCities() {
        const savedCities = localStorage.getItem('recentCities');
        if (savedCities) {
            recentCities = JSON.parse(savedCities);
            renderRecentCities();
        }
    }
    
    // 保存最近城市到localStorage
    function saveRecentCities() {
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
    }
    
    // 添加城市到最近使用列表
    function addToRecentCities(city) {
        // 如果已经在列表中，先移除
        const index = recentCities.indexOf(city);
        if (index !== -1) {
            recentCities.splice(index, 1);
        }
        
        // 添加到列表最前面
        recentCities.unshift(city);
        
        // 限制列表长度
        if (recentCities.length > 5) {
            recentCities.pop();
        }
        
        // 保存到localStorage
        saveRecentCities();
        
        // 重新渲染最近城市列表
        renderRecentCities();
    }
    
    // 选择城市
    function selectCity(city) {
        selectedCity = city;
        addToRecentCities(city);
        
        // 直接更新显示的城市并关闭选择器
        if (currentDropdownButton) {
            const valueSpan = currentDropdownButton.querySelector('.value-text');
            if (valueSpan) {
                valueSpan.textContent = city;
            }
        }
        
        // 关闭城市选择器
        closeCityPicker(false);
    }
    
    // 选择定位城市
    function selectLocationCity() {
        // 实际应用中，这里应该获取用户的地理位置，这里模拟一下
        const locationCityName = locationCity.querySelector('span').textContent;
        selectCity(locationCityName);
        closeCityPicker(true);
    }
    
    // 设置面积输入框事件监听
    function setupAreaInputs() {
        const areaInputs = document.querySelectorAll('.area-input');
        
        areaInputs.forEach(input => {
            // 限制输入范围
            input.addEventListener('input', function() {
                let val = parseInt(this.value, 10);
                if (isNaN(val)) {
                    this.value = this.getAttribute('data-last-valid') || 100;
                } else {
                    // 保存有效值
                    this.setAttribute('data-last-valid', val);
                    
                    // 限制最小值为1
                    if (val < 1) {
                        this.value = 1;
                    }
                    // 限制最大值为1000
                    else if (val > 1000) {
                        this.value = 1000;
                    }
                }
            });
            
            // 失去焦点时确保有有效值
            input.addEventListener('blur', function() {
                if (this.value === '' || isNaN(parseInt(this.value, 10))) {
                    this.value = this.getAttribute('data-last-valid') || 100;
                }
            });
        });
    }

    // Menu Logic
    function openMenu() {
          functionMenu.classList.remove('translate-x-full');
          menuOverlay.classList.remove('hidden');
        setTimeout(() => menuOverlay.classList.add('opacity-100'), 10);
          document.body.style.overflow = 'hidden';
      }
      
      function closeMenu() {
        menuOverlay.classList.remove('opacity-100');
        setTimeout(() => {
          functionMenu.classList.add('translate-x-full');
          menuOverlay.classList.add('hidden');
          document.body.style.overflow = '';
        }, 300);
      }
      
    // Input State Management
    function collapseToCompactBar(summaryText) {
        // 确保聊天模式底部容器存在
        if (!chatModeFooter) return;
        
        // 先清空chatModeFooter中可能存在的旧内容
        while (chatModeFooter.firstChild) {
            chatModeFooter.removeChild(chatModeFooter.firstChild);
        }
        
        // 将标签和紧凑输入框添加到底部容器
        chatModeFooter.appendChild(pillsContainer);
        chatModeFooter.appendChild(compactInputBar);
        
        // 调整标签容器样式以适应底部显示
        pillsContainer.classList.remove('mb-3');
        pillsContainer.classList.add('p-2');
        pillsContainer.style.paddingBottom = '0px';
        
        // 隐藏完整输入区，显示底部容器和紧凑输入框
        queryInputContainer.classList.add('hidden');
        chatModeFooter.classList.remove('hidden');
        compactInputBar.classList.remove('hidden');
        
        // 设置紧凑输入框的文本为"报价生成"
        compactSummaryText.textContent = "报价生成";
        compactSummaryText.style.color = 'var(--text-main)';
        
        // 调整主容器底部内边距，为底部容器腾出空间
        const footerHeight = chatModeFooter.offsetHeight;
        mainContainer.style.paddingBottom = `${footerHeight + 10}px`;
        
        // 滚动到聊天历史底部
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function expandInputFromCompact() {
        // 根据用户是否交互过决定显示方式
        if (hasInteracted) {
            // 已交互过，显示底部弹出层
            showBottomSheet();
        } else {
            // 首次交互，显示普通输入区
            showNormalInput();
        }
    }
    
    // 显示底部弹出层
    function showBottomSheet() {
        // 隐藏底部容器
        chatModeFooter.classList.add('hidden');
        
        // 准备输入区作为底部弹出层
        queryInputContainer.classList.remove('hidden');
        queryInputContainer.classList.add('bottom-sheet');
        
        // 显示遮罩层标题和关闭按钮
        const sheetHeader = queryInputContainer.querySelector('.sheet-header');
        if (sheetHeader) sheetHeader.classList.remove('hidden');
        
        // 将标签移回完整输入区，放在动态输入区前面
        if (pillsContainer.parentElement === chatModeFooter) {
            queryInputContainer.insertBefore(pillsContainer, dynamicInputArea);
        }
        
        // 恢复标签容器的原始样式
        pillsContainer.classList.add('mb-3');
        pillsContainer.classList.remove('p-2');
        pillsContainer.style.paddingBottom = '';

        // 显示遮罩层
        const queryInputOverlay = document.getElementById('queryInputOverlay');
        if (queryInputOverlay) {
            queryInputOverlay.classList.add('active');
        }
        
        // 延迟一点显示底部弹出层，确保过渡动画正常
        setTimeout(() => {
            queryInputContainer.classList.add('active');
        }, 10);
    }
    
    // 显示普通输入区
    function showNormalInput() {
        chatModeFooter.classList.add('hidden');
        queryInputContainer.classList.remove('hidden');
        queryInputContainer.classList.add('is-pinned-bottom');
        
        // 确保标题和关闭按钮隐藏
        const sheetHeader = queryInputContainer.querySelector('.sheet-header');
        if (sheetHeader) sheetHeader.classList.add('hidden');
        
        // 将标签移回完整输入区，放在动态输入区前面
        if (pillsContainer.parentElement === chatModeFooter) {
            queryInputContainer.insertBefore(pillsContainer, dynamicInputArea);
        }
        
        // 恢复标签容器的原始样式
        pillsContainer.classList.add('mb-3');
        pillsContainer.classList.remove('p-2');

        // 调整主容器底部内边距，为完整输入区腾出空间
        const queryInputHeight = queryInputContainer.offsetHeight;
        mainContainer.style.paddingBottom = `${queryInputHeight + 10}px`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
    
    // 收起底部弹出层
    function collapseBottomSheet() {
        const queryInputOverlay = document.getElementById('queryInputOverlay');
        
        // 隐藏遮罩层
        if (queryInputOverlay) {
            queryInputOverlay.classList.remove('active');
        }
        
        // 收起底部弹出层
        queryInputContainer.classList.remove('active');
        
        // 等待动画完成后恢复紧凑输入框
        setTimeout(() => {
            // 隐藏遮罩层标题和关闭按钮
            const sheetHeader = queryInputContainer.querySelector('.sheet-header');
            if (sheetHeader) sheetHeader.classList.add('hidden');
            
            // 移除底部弹出层样式
            queryInputContainer.classList.remove('bottom-sheet');
            queryInputContainer.classList.add('hidden');
            
            // 显示紧凑输入框，文本统一为"报价生成"
            collapseToCompactBar("报价生成");
        }, 300);
    }

    function collapseInputOnMainClick(e) {
        // 只有当聊天处于活动状态且输入区是固定在底部的情况下才折叠
        if (isChatActive && queryInputContainer.classList.contains('is-pinned-bottom')) {
            // 确保点击的是主容器本身或聊天历史，而不是输入区域
            if (e.target.closest('#queryInputContainer') || e.target.closest('#chatModeFooter')) return;
            
            // 显示紧凑输入框，文本统一为"报价生成"
            collapseToCompactBar("报价生成");
        }
        
        // 如果底部弹出层处于活动状态，点击外部区域应该关闭它
        if (queryInputContainer.classList.contains('bottom-sheet') && queryInputContainer.classList.contains('active')) {
            // 确保点击的不是底部弹出层本身
            if (!e.target.closest('#queryInputContainer')) {
                collapseBottomSheet();
            }
        }
    }

    // 处理标签点击事件
    function handlePillClick(e) {
      // 获取点击的标签和目标模板ID
      const pill = e.target.closest('.feature-pill');
      if (!pill) return;
      
      // 如果已经是活动状态的标签，不做处理
      if (pill.classList.contains('active')) return;

      console.log('标签点击:', pill.dataset.target);
      
      // 更新激活状态
      document.querySelectorAll('.feature-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      // 获取目标模板ID
      const targetId = pill.dataset.target + '-template';

      // 隐藏所有模板，显示目标模板
      document.querySelectorAll('.pricing-template').forEach(template => {
        template.classList.add('hidden');
      });

      const targetTemplate = document.getElementById(targetId);
      if (targetTemplate) {
        targetTemplate.classList.remove('hidden');
        
        // 设置按钮文案
        const buttonTextMap = {
          renovation: '获取装修报价',
          custom: '获取定制方案',
          furniture: '查看家具推荐',
          appliance: '查看家电套餐',
          sofa: '获取沙发报价'
        };
        
        const buttonSpan = targetTemplate.querySelector('.send-btn-new span');
        if (buttonSpan) {
          buttonSpan.textContent = buttonTextMap[pill.dataset.target] || '获取AI报价';
        }
        
        // 设置预设问题
        updatePresetQuestions(pill.dataset.target);
        
        // 如果是沙发模板，设置储物箱显示逻辑
        if (pill.dataset.target === 'sofa') {
          setupSofaLogic();
          
          // 初始化选项卡设计
          console.log('切换到沙发选项卡，调用initSofaTabDesign');
          // 延迟一点执行，确保DOM已经更新
          setTimeout(initSofaTabDesign, 100);
        }
      }
    }
    
    // 设置沙发相关的逻辑
    function setupSofaLogic() {
        const sofaTemplate = document.getElementById('sofa-template');
        if (!sofaTemplate) return;
        
        // 获取沙发形状元素和储物箱元素
        const sofaShapeElement = sofaTemplate.querySelector('[data-type="sofaShape"]');
        const storageBoxElement = document.getElementById('sofaStorageBox');
        
        if (sofaShapeElement && storageBoxElement) {
            // 获取当前沙发形状
            const shapeText = sofaShapeElement.querySelector('.value-text');
            const currentShape = shapeText ? shapeText.textContent : 'L型';
            
            // 根据形状显示或隐藏储物箱选项
            if (currentShape === 'L型' || currentShape === 'U型' || currentShape === '贵妃榻') {
                storageBoxElement.style.display = 'flex';
            } else {
                storageBoxElement.style.display = 'none';
            }
            
            // 监听沙发形状变化
            sofaShapeElement.addEventListener('click', function() {
                // 在选择器关闭后检查形状变化
                const checkShapeChange = setInterval(() => {
                    const valueSpan = sofaShapeElement.querySelector('.value-text');
                    if (!valueSpan) {
                        clearInterval(checkShapeChange);
                        return;
                    }
                    
                    const currentShape = valueSpan.textContent;
                    
                    if (currentShape === 'L型' || currentShape === 'U型' || currentShape === '贵妃榻') {
                        storageBoxElement.style.display = 'flex';
                    } else {
                        storageBoxElement.style.display = 'none';
                        // 如果不是L型沙发，取消储物箱选择
                        const storageCheckbox = storageBoxElement.querySelector('input[type="checkbox"]');
                        if (storageCheckbox) {
                            storageCheckbox.checked = false;
                        }
                    }
                    
                    clearInterval(checkShapeChange);
                }, 400); // 给选择器关闭的动画留出时间
            });
        }
        
        // 获取面料和价格区间元素
        const materialElement = sofaTemplate.querySelector('[data-type="sofaMaterial"]');
        const priceRangeElement = document.getElementById('materialPriceRange');
        
        if (materialElement && priceRangeElement) {
            // 初始化价格区间
            updateMaterialPriceRange(materialElement, priceRangeElement);
            
            // 监听面料变化
            materialElement.addEventListener('click', function() {
                // 在选择器关闭后更新价格区间
                const checkMaterialChange = setInterval(() => {
                    updateMaterialPriceRange(materialElement, priceRangeElement);
                    clearInterval(checkMaterialChange);
                }, 400); // 给选择器关闭的动画留出时间
            });
        }
        
        // 设置沙发长度输入框
        setupLengthInputs();
    }
    
    // 更新面料价格区间
    function updateMaterialPriceRange(materialElement, priceRangeElement) {
        const materialText = materialElement.querySelector('.value-text');
        if (!materialText) return;
        
        const currentMaterial = materialText.textContent;
        const priceRanges = pickerData.materialPriceRange[currentMaterial];
        
        if (priceRanges && priceRanges.length > 0) {
            // 显示价格区间选择项
            priceRangeElement.style.display = 'flex';
            
            // 更新默认价格区间
            const priceValueText = priceRangeElement.querySelector('.value-text');
            if (priceValueText) {
                priceValueText.textContent = priceRanges[0];
            }
        } else {
            // 如果没有对应的价格区间，隐藏选择项
            priceRangeElement.style.display = 'none';
        }
    }
    
    // 设置沙发长度输入框事件监听
    function setupLengthInputs() {
        const lengthInputs = document.querySelectorAll('.length-input');
        
        lengthInputs.forEach(input => {
            // 限制输入范围
            input.addEventListener('input', function() {
                let val = parseFloat(this.value);
                if (isNaN(val)) {
                    this.value = this.getAttribute('data-last-valid') || 3.2;
                } else {
                    // 保存有效值
                    this.setAttribute('data-last-valid', val.toFixed(1));
                    
                    // 限制最小值为1
                    if (val < 1) {
                        this.value = 1.0;
                    }
                    // 限制最大值为10
                    else if (val > 10) {
                        this.value = 10.0;
                    } else {
                        // 保留一位小数
                        this.value = val.toFixed(1);
                    }
                }
            });
            
            // 失去焦点时确保有有效值
            input.addEventListener('blur', function() {
                if (this.value === '' || isNaN(parseFloat(this.value))) {
                    this.value = this.getAttribute('data-last-valid') || 3.2;
                }
            });
        });
    }
    
    // 更新预设问题
    function updatePresetQuestions(targetType) {
        const presetQuestionsContainer = document.querySelector('#presetQuestions .space-y-3');
        if (!presetQuestionsContainer) return;
        
        // 定义每个标签对应的预设问题
        const presetQuestionsMap = {
            renovation: [
                '帮我制定在天津120平米的精装房的装修预算',
                '三室两厅的简装预算大概需要多少？',
                '毛坯房装修需要注意哪些问题？'
            ],
            custom: [
                '我想了解全屋定制衣柜的价格区间',
                '定制一套现代风格的全屋家具大概要花多少钱？',
                '全屋定制有什么材质可以选择？'
            ],
            furniture: [
                '为120平方米住宅的成品家具与软装部分制定详细的预算',
                '推荐一些性价比高的客厅沙发',
                '北欧风格的床和床头柜组合有哪些推荐？'
            ],
            appliance: [
                '新房装修需要配置哪些必备家电及预算？',
                '帮我推荐智能家电套装及品牌',
                '厨房电器怎么选择最实用？'
            ],
            sofa: [
                'L型沙发带电动功能位和储物箱价格是多少？',
                '真皮沙发和科技布沙发的优缺点和价格差异',
                '带隐藏茶几和拉床功能的多功能沙发推荐'
            ]
        };
        
        // 获取当前标签对应的预设问题
        const questions = presetQuestionsMap[targetType] || presetQuestionsMap.renovation;
        
        // 清空现有问题
        presetQuestionsContainer.innerHTML = '';
        
        // 添加新问题
        questions.forEach(question => {
            const button = document.createElement('button');
            button.className = 'preset-question-btn';
            button.textContent = question;
            presetQuestionsContainer.appendChild(button);
        });
    }

    // Resend the last query from the compact bar
    function resendLastQuery(e) {
        e.stopPropagation(); // Prevent the background from being clicked, which would expand the input
        const activeTemplate = document.querySelector('.pricing-template:not(.hidden)');
        if (!activeTemplate) return;
        const userQueryText = generateQuerySummary(activeTemplate);
        handleQuery(userQueryText, activeTemplate);
        
        // 重置紧凑输入框的文本为"报价生成"
        compactSummaryText.textContent = "报价生成";
    }

    // --- Event Handlers ---
    function handleDynamicAreaClick(e) {
        // 不要阻止冒泡，否则会导致标签切换等事件失效
        console.log('Dynamic area clicked:', e.target);
        
        try {
            // 检查是否点击了发送按钮
            if (e.target.closest('.send-btn-new')) {
                console.log('Send button clicked');
                const template = e.target.closest('.pricing-template');
                if (template) {
                    // 生成查询摘要
                    const querySummary = generateQuerySummary(template);
                    console.log('Query summary:', querySummary);
                    
                    // 处理查询
                    handleQuery(querySummary, template);
                } else {
                    console.log('No pricing template found for send button');
                }
                return;
            }
            
            // 处理步进器按钮
            if (e.target.classList.contains('stepper-btn')) {
                console.log('Stepper button clicked');
                const action = e.target.dataset.action;
                const target = e.target.dataset.target;
                const stepperItem = e.target.closest('.stepper');
                const valueSpan = stepperItem.querySelector(`.stepper-value[data-type="${target}"]`);
                
                if (valueSpan) {
                    updateStepper(valueSpan, action);
                } else {
                    console.log('No value span found for stepper');
                }
                return;
            }
            
            // 处理分段控件
            if (e.target.classList.contains('segmented-btn-new')) {
                console.log('Segmented button clicked');
                const segmentedControl = e.target.closest('.segmented-control-new');
                const activeBtn = segmentedControl.querySelector('.segmented-btn-new.active');
                
                if (activeBtn !== e.target) {
                    activeBtn.classList.remove('active');
                    e.target.classList.add('active');
                    console.log('Segmented button activated');
                } else {
                    console.log('Button already active');
                }
                return;
            }
            
            // 处理卡片项点击
            const cardItem = e.target.closest('.card-item');
            if (!cardItem) {
                console.log('No card item found');
                return;
            }
            
            // 根据数据类型决定打开哪种选择器
            const dataType = cardItem.dataset.type;
            console.log('Card item clicked, type:', dataType);
            
            // 如果是城市选择，调用城市选择器
            if (dataType === 'city') {
                console.log('Opening city picker');
                openCityPicker(cardItem);
                return;
            }
            
            // 其他选择器使用通用选择器
            if (dataType && pickerData[dataType]) {
                console.log('Opening picker for', dataType);
                openPicker(cardItem);
                return;
            }
            
            console.log('No action taken for card item');
        } catch (error) {
            console.error('动态区域点击处理出错:', error);
        }
    }
    
    function handlePresetQuestionClick(e) {
        console.log('Preset question area clicked:', e.target);
        
        try {
            const presetButton = e.target.closest('.preset-question-btn');
            if (!presetButton) {
                console.log('No preset button found');
                return;
            }
            
            console.log('Preset question clicked:', presetButton.textContent);
            const userQueryText = presetButton.textContent.trim();
            handleQuery(userQueryText);
        } catch (error) {
            console.error('预设问题点击处理出错:', error);
        }
    }

    // Inline editor for numeric values
    function createInputFromButton(button) {
        if (activeInput) return;
              const currentValue = button.textContent.trim();
              const input = document.createElement('input');
              input.type = 'number';
              input.className = 'inline-input';
              input.value = currentValue;
        input.style.width = `${button.offsetWidth + 4}px`;

        const finalize = () => {
            button.textContent = input.value.trim() || currentValue;
            if (input.parentNode) input.parentNode.replaceChild(button, input);
                  activeInput = null;
        };

        input.addEventListener('blur', finalize);
              input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') {
                input.value = currentValue;
                input.blur();
                  }
              });

              button.parentNode.replaceChild(input, button);
              input.focus();
              input.select();
              activeInput = input;
    }

    function updateStepper(valueSpan, action) {
        let currentValue = parseInt(valueSpan.textContent, 10);
        if (action === 'plus') {
            currentValue++;
        } else if (action === 'minus') {
            currentValue = Math.max(0, currentValue - 1); // 不允许小于0
        }
        valueSpan.textContent = currentValue;
    }

    // Picker Logic
    function openPicker(button) {
        currentDropdownButton = button;
        const dataType = button.dataset.type;
        
        if (dataType === 'city') {
            openCityPicker(button);
            return;
        }
        
        // 特殊处理材质价格区间
        if (dataType === 'materialPriceRange') {
            // 获取当前选择的材质
            const materialElement = document.querySelector('[data-type="sofaMaterial"]');
            const currentMaterial = materialElement.querySelector('.value-text').textContent;
            
            // 根据材质获取对应的价格区间
            const materialPriceOptions = pickerData.materialPriceRange[currentMaterial] || [];
            
            pickerTitle.textContent = `选择${button.dataset.title || '选项'}`;
            pickerOptionsContainer.innerHTML = '';
            
            const currentButtonSpan = button.querySelector('.value-text');
            const currentValue = currentButtonSpan ? currentButtonSpan.textContent.trim() : '';
            selectedValue = currentValue;

            materialPriceOptions.forEach(option => {
                const optionEl = document.createElement('div');
                optionEl.className = 'picker-option';
                optionEl.textContent = option;
                if (option === currentValue) {
                    optionEl.classList.add('selected');
                }
                optionEl.addEventListener('click', () => {
                    pickerOptionsContainer.querySelector('.selected')?.classList.remove('selected');
                    optionEl.classList.add('selected');
                    selectedValue = option;
                });
                pickerOptionsContainer.appendChild(optionEl);
            });

            pickerOverlay.classList.remove('hidden');
            pickerContainer.classList.remove('hidden');
            setTimeout(() => {
                pickerOverlay.style.opacity = '1';
                pickerContainer.style.transform = 'translateY(0)';
            }, 10);
            
            return;
        }
        
        // 常规选择器处理
        const options = pickerData[dataType] || [];
        pickerTitle.textContent = `选择${button.dataset.title || '选项'}`;
        pickerOptionsContainer.innerHTML = '';
        
        const currentButtonSpan = button.querySelector('span');
        const currentValue = currentButtonSpan ? currentButtonSpan.textContent.trim() : button.textContent.trim();
        selectedValue = currentValue;

        options.forEach(option => {
            const optionEl = document.createElement('div');
            optionEl.className = 'picker-option';
            optionEl.textContent = option;
            if (option === currentValue) {
                optionEl.classList.add('selected');
            }
            optionEl.addEventListener('click', () => {
                pickerOptionsContainer.querySelector('.selected')?.classList.remove('selected');
                optionEl.classList.add('selected');
                selectedValue = option;
            });
            pickerOptionsContainer.appendChild(optionEl);
        });

        pickerOverlay.classList.remove('hidden');
        pickerContainer.classList.remove('hidden');
        setTimeout(() => {
            pickerOverlay.style.opacity = '1';
            pickerContainer.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // 处理城市搜索
    function handleCitySearch(e) {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        // 显示或隐藏清除按钮
        if (searchTerm) {
            citySearchClear.classList.remove('hidden');
        } else {
            citySearchClear.classList.add('hidden');
        }
        
        // 如果搜索词为空，隐藏搜索结果
        if (!searchTerm) {
            citySearchResults.classList.add('hidden');
            return;
        }
        
        // 显示搜索结果容器
        citySearchResults.classList.remove('hidden');
        citySearchResults.innerHTML = '';
        
        // 搜索省份和城市
        let results = [];
        
        // 搜索省份
        Object.keys(cityData).forEach(province => {
            // 匹配汉字或拼音首字母
            const provincePinyin = getPinyin(province);
            const pinyinMatch = provincePinyin.toLowerCase().includes(searchTerm) || 
                               getPinyinInitials(province).toLowerCase().includes(searchTerm);
            
            if (province.toLowerCase().includes(searchTerm) || pinyinMatch) {
                results.push({
                    name: province,
                    type: 'province',
                    parent: null
                });
            }
            
            // 搜索该省的城市
            cityData[province].forEach(city => {
                const cityPinyin = getPinyin(city);
                const cityPinyinMatch = cityPinyin.toLowerCase().includes(searchTerm) || 
                                      getPinyinInitials(city).toLowerCase().includes(searchTerm);
                
                if (city.toLowerCase().includes(searchTerm) || cityPinyinMatch) {
                    results.push({
                        name: city,
                        type: 'city',
                        parent: province
                    });
                }
            });
        });
        
        // 限制结果数量
        results = results.slice(0, 10);
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'p-4 text-center text-gray-500';
            noResults.textContent = '未找到匹配的城市';
            citySearchResults.appendChild(noResults);
            return;
        }
        
        // 渲染搜索结果
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            
            if (result.type === 'city') {
                resultItem.textContent = `${result.name}，${result.parent}`;
            } else {
                resultItem.textContent = result.name;
            }
            
            resultItem.addEventListener('click', () => {
                selectCity(result.name);
                clearCitySearch();
                closeCityPicker(true);
            });
            
            citySearchResults.appendChild(resultItem);
        });
    }
    
    // 清除城市搜索
    function clearCitySearch() {
        if (citySearchInput) citySearchInput.value = '';
        if (citySearchClear) citySearchClear.classList.add('hidden');
        if (citySearchResults) citySearchResults.classList.add('hidden');
    }
    
    // 获取汉字拼音（简化版，实际应用中可使用完整拼音库）
    function getPinyin(text) {
        // 这里简化处理，实际应用中应使用专业拼音转换库
        // 返回原始文本，假设用户输入拼音搜索
        return text;
    }
    
    // 获取拼音首字母（简化版）
    function getPinyinInitials(text) {
        // 同上，简化处理
        return text;
    }
    
    // 打开城市选择器
    function openCityPicker(button) {
        currentDropdownButton = button;
        
        // 获取当前选中城市
        const valueSpan = button.querySelector('.value-text');
        if (valueSpan) {
            selectedCity = valueSpan.textContent;
        }
        
        // 更新热门城市和最近使用城市的选中状态
        renderHotCities();
        renderRecentCities();
        
        // 显示城市选择器
        cityPickerOverlay.classList.remove('hidden');
        cityPickerOverlay.style.opacity = '1';
        cityPickerOverlay.style.zIndex = '40';
        cityPickerOverlay.style.pointerEvents = 'auto';
        
        cityPickerContainer.classList.remove('translate-y-full');
        setTimeout(() => {
            cityPickerContainer.classList.add('active');
        }, 10);
    }
    
    // 关闭城市选择器
    function closeCityPicker(confirm = false) {
        // 隐藏城市选择器
        if (cityPickerOverlay) {
            cityPickerOverlay.style.opacity = '0';
            cityPickerOverlay.style.pointerEvents = 'none';
        }
        
        if (cityPickerContainer) {
            cityPickerContainer.classList.remove('active');
        }
        
        // 清空搜索
        clearCitySearch();
        
        setTimeout(() => {
            if (cityPickerOverlay) {
                cityPickerOverlay.classList.add('hidden');
                cityPickerOverlay.style.zIndex = '-1';
            }
            
            if (cityPickerContainer) {
                cityPickerContainer.classList.add('translate-y-full');
            }
        }, 300);
    }

    function closePicker(confirm = false) {
              if (confirm && currentDropdownButton && selectedValue) {
            // 查找value-text元素，确保只更新值而不是标签
            const valueTextSpan = currentDropdownButton.querySelector('.value-text');
            if (valueTextSpan) {
                valueTextSpan.textContent = selectedValue;
            } else {
                // 如果找不到专门的值文本元素，则更新整个按钮（兼容旧版本）
                const buttonSpan = currentDropdownButton.querySelector('span');
                if (buttonSpan) {
                    buttonSpan.textContent = selectedValue;
                } else {
                    currentDropdownButton.textContent = selectedValue;
                }
            }
              }
              pickerOverlay.style.opacity = '0';
              pickerContainer.style.transform = 'translateY(100%)';
              setTimeout(() => {
                  pickerOverlay.classList.add('hidden');
                  pickerContainer.classList.add('hidden');
              }, 300);
    }

    // Query Handling and Chat Bubble Generation
      function handleQuery(queryText, template = null) {
        if (!isChatActive) {
            // First query: hide intro text and preset questions
            document.querySelector('.introduction')?.remove();
            presetQuestionsContainer?.remove();
            
            // 设置布局为从顶部开始，而不是居中
            mainContainer.style.justifyContent = 'flex-start';
            chatHistory.style.paddingTop = '16px';
            
            isChatActive = true;
          }
          
          // 标记用户已交互过
          hasInteracted = true;
          
          appendUserMessage(queryText, chatHistory);
          appendTypingIndicator(chatHistory);
        
        // Hide full input and show compact bar
        collapseToCompactBar(queryText);

          setTimeout(() => {
            const typingIndicator = document.getElementById('typing-indicator');
            if(typingIndicator) typingIndicator.remove();
            
            const aiContent = template ? generateBudgetContent(template) : generateGenericBudgetContent(queryText);
            appendAiMessage(aiContent.title, aiContent.content, aiContent.price, chatHistory);
            
            chatHistory.scrollTop = chatHistory.scrollHeight;
        }, 1500 + Math.random() * 500);
      }

      function appendUserMessage(text, container) {
        const messageHtml = `
            <div class="message message-user">
                ${text}
            </div>`;
        container.insertAdjacentHTML('beforeend', messageHtml);
        
        // 确保聊天历史区域滚动到底部
        container.scrollTop = container.scrollHeight;
      }
    
      function appendAiMessage(title, content, price, container) {
        const contentHtml = content.map(item => `
            <div class="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0">
                <span class="text-gray-600">${item.name}</span>
                <span class="font-semibold text-gray-800">${item.value}</span>
            </div>`).join('');

        const messageHtml = `
            <div class="message ai-message">
                <div class="ai-message-content">
                    <h4 class="font-bold text-base mb-3 text-gray-800">${title}</h4>
                    <div class="space-y-1 mb-3">${contentHtml}</div>
                    <div class="text-right border-t border-gray-100 pt-3 mt-2">
                        <span class="text-sm text-gray-500">预计总价：</span>
                        <span class="text-xl font-bold text-red-500">¥${price}</span>
                    </div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', messageHtml);
    }

    function appendTypingIndicator(container) {
        const typingHtml = `
            <div id="typing-indicator" class="flex items-center mb-4">
              <div class="bg-gray-200 rounded-full w-2 h-2 animate-pulse mr-1" style="animation-delay: 0s;"></div>
              <div class="bg-gray-200 rounded-full w-2 h-2 animate-pulse mr-1" style="animation-delay: 0.2s;"></div>
              <div class="bg-gray-200 rounded-full w-2 h-2 animate-pulse" style="animation-delay: 0.4s;"></div>
            </div>`;
        container.insertAdjacentHTML('beforeend', typingHtml);
          container.scrollTop = container.scrollHeight;
      }

    // Query and Content Generation
      function generateQuerySummary(template) {
        if (!template) return '';
        
        const templateId = template.id.replace('-template', '');
        let summary = '';
        
        // 通用获取元素值的辅助函数
        const getV2Val = (selector, context = template) => context.querySelector(selector)?.textContent.trim() || '';
        const getV2ActiveVal = (selector, context = template) => context.querySelector(`${selector}.active`)?.dataset.value || '';
        const getInputVal = (selector, context = template) => context.querySelector(selector)?.value || '';
        const getChecked = (selector, context = template) => context.querySelector(selector)?.checked || false;
        
        switch (templateId) {
            case 'renovation':
            case 'custom':
            case 'furniture':
            case 'appliance':
              const city = getV2Val('[data-type="city"] .value-text');
              const area = getInputVal('.area-input') || getV2Val('[data-type="area"] .value-text');
              const room = getV2Val('[data-type="room"]');
              const hall = getV2Val('[data-type="hall"]');
              const bathroom = getV2Val('[data-type="bathroom"]');
              const kitchen = getV2Val('[data-type="kitchen"]');
              const renovationType = getV2ActiveVal('.segmented-btn-new');
              summary = `在${city}，为我一套${area}平米的${room}房${hall}厅${kitchen}厨${bathroom}卫的${renovationType}户型进行装修，请提供一份详细的预算报价。`;
              break;

            case 'sofa':
              // 基本属性
              const sofaShape = getV2Val('[data-type="sofaShape"] .value-text') || 'L型';
              const sofaLength = getInputVal('.length-input') || '3.2';
              const sofaFabric = getV2Val('[data-type="sofaMaterial"] .value-text') || '头层牛皮';
              
              // 获取价格区间
              const priceRangeElement = document.getElementById('materialPriceRange');
              let materialPriceRange = '';
              if (priceRangeElement && priceRangeElement.style.display !== 'none') {
                materialPriceRange = priceRangeElement.querySelector('.value-text')?.textContent || '';
              }
              
              // 构建面料描述
              const fabricDesc = materialPriceRange ? 
                `面料为${sofaFabric}（${materialPriceRange}）` : 
                `面料为${sofaFabric}`;
              
                // 功能位和附加功能
  const electricSeats = getV2Val('[data-type="sofaElectricFunction"]');
  const hiddenTable = getV2Val('[data-type="sofaHiddenTable"]') || '0'; // 获取隐藏茶几数量
  const pullOutBed = getV2Val('[data-type="sofaPullOutBed"] .value-text') || '无'; // 获取隐藏拉床类型
  
  // 获取妃位储物状态 - 使用值文本
  const hasStorage = document.querySelector('[data-type="sofaHasStorage"] .value-text')?.textContent === '是';
              
              // 构建附加功能描述
              let additionalFeatures = [];
              if (parseInt(hiddenTable) > 0) additionalFeatures.push(`${hiddenTable}个后背茶几`);
              if (pullOutBed !== '无') additionalFeatures.push(`${pullOutBed}隐藏拉床`);
              if ((sofaShape === 'L型' || sofaShape === 'U型' || sofaShape === '贵妃榻') && hasStorage) {
                additionalFeatures.push('妃位储物功能');
              }
              
              const featuresText = additionalFeatures.length > 0 
                ? `，附加功能：${additionalFeatures.join('、')}` 
                : '';
              
              summary = `我想买一个${sofaShape}的沙发，长度约${sofaLength}米，${fabricDesc}。配备${electricSeats}个电动功能位${featuresText}。请推荐并报价。`;
              break;

            // --- DEPRECATED - Old structure, keep for safety or remove later ---
            default: 
              const getVal = (selector) => template.querySelector(selector)?.textContent.trim() || '';
              const getMultiVal = (type) => Array.from(template.querySelectorAll(`button[data-type="${type}"]`)).map(el => el.textContent.trim()).join('');
              summary = template.querySelector('.prompt-text-summary')?.textContent.trim() || '请根据我的需求生成报价。';
              break;
        }
        
        return summary;
    }

    function generateGenericBudgetContent(queryText) {
        // This is a placeholder. In a real application, you would send the query to a server/API.
        // For demo purposes, we'll generate a generic response.
        return {
            title: '通用预算分析',
            content: `根据您的需求"${queryText}"，我们生成了以下预算（仅为示例）。`,
            price: '5,000 - 15,000'
        };
    }

    function generateBudgetContent(template) {
        const getVal = (selector, isNum = true) => {
            const el = template.querySelector(selector);
            if (!el) return isNum ? 0 : '';
            const val = parseFloat(el.textContent.trim());
            return isNaN(val) ? (isNum ? 0 : el.textContent.trim()) : val;
        };
        
        // 获取输入框的值
        const getInputVal = (selector, isNum = true) => {
            const input = template.querySelector(selector);
            if (!input) return isNum ? 0 : '';
            const val = parseFloat(input.value);
            return isNaN(val) ? (isNum ? 0 : input.value) : val;
        };
        
        let title, content, price;

        // 获取面积，优先从输入框获取
        const area = getInputVal('.area-input') || getVal('[data-type="area"]');
        title = `装修总预算`;
        content = [
            { name: '设计费', value: `¥${(area * 50).toLocaleString()}` },
            { name: '基础施工', value: `¥${(area * 300).toLocaleString()}` },
            { name: '主材费', value: `¥${(area * 600).toLocaleString()}` },
            { name: '管理费', value: `¥${(area * 50).toLocaleString()}` },
        ];
        price = (area * 1000).toLocaleString();
        
        return { title, content, price };
    }
    
    // 城市选择器功能
    function initCityPicker() {
        console.log('初始化城市选择器');
        
        // 初始化城市数据
        const cityData = {
            hot: ['北京', '上海', '广州', '深圳', '杭州', '南京', '成都', '重庆', '武汉', '西安'],
            all: [
                { letter: 'A', cities: ['安徽', '鞍山', '安庆', '安阳'] },
                { letter: 'B', cities: ['北京', '保定', '宝鸡', '包头', '巴中', '北海', '蚌埠'] },
                { letter: 'C', cities: ['重庆', '成都', '长沙', '长春', '常州', '沧州', '常德', '赤峰'] },
                { letter: 'D', cities: ['大连', '东莞', '大庆', '东营', '德州', '德阳', '大同', '丹东'] },
                { letter: 'F', cities: ['福州', '佛山', '抚顺', '阜阳', '抚州'] },
                { letter: 'G', cities: ['广州', '贵阳', '桂林', '赣州', '广元'] },
                { letter: 'H', cities: ['杭州', '合肥', '哈尔滨', '海口', '惠州', '邯郸', '衡阳', '湖州'] },
                { letter: 'J', cities: ['济南', '嘉兴', '金华', '江门', '吉林', '揭阳', '晋中', '九江'] },
                { letter: 'K', cities: ['昆明', '开封', '喀什', '克拉玛依'] },
                { letter: 'L', cities: ['兰州', '廊坊', '临沂', '洛阳', '连云港', '柳州', '泸州'] },
                { letter: 'M', cities: ['绵阳', '茂名', '马鞍山', '梅州'] },
                { letter: 'N', cities: ['南京', '宁波', '南昌', '南宁', '南通', '南阳'] },
                { letter: 'Q', cities: ['青岛', '泉州', '秦皇岛', '齐齐哈尔', '曲靖'] },
                { letter: 'S', cities: ['上海', '深圳', '沈阳', '石家庄', '苏州', '三亚', '汕头', '绍兴'] },
                { letter: 'T', cities: ['天津', '太原', '唐山', '台州', '泰州', '泰安'] },
                { letter: 'W', cities: ['武汉', '无锡', '温州', '威海', '芜湖', '潍坊', '乌鲁木齐'] },
                { letter: 'X', cities: ['西安', '厦门', '徐州', '西宁', '襄阳', '新乡', '湘潭'] },
                { letter: 'Y', cities: ['烟台', '银川', '宜昌', '岳阳', '延安', '扬州', '盐城'] },
                { letter: 'Z', cities: ['郑州', '中山', '珠海', '湛江', '镇江', '张家口', '肇庆'] }
            ]
        };
        
        // 获取DOM元素
        const cityPickerOverlay = document.getElementById('cityPickerOverlay');
        const cityPickerContainer = document.getElementById('cityPickerContainer');
        const cityPickerCancel = document.getElementById('cityPickerCancel');
        const cityPickerConfirm = document.getElementById('cityPickerConfirm');
        const citySearchInput = document.getElementById('citySearchInput');
        const citySearchClear = document.getElementById('citySearchClear');
        const citySearchResults = document.getElementById('citySearchResults');
        const hotCitiesList = document.getElementById('hotCitiesList');
        const allCitiesList = document.getElementById('allCitiesList');
        const alphabetIndex = document.getElementById('alphabetIndex');
        const recentCitiesList = document.getElementById('recentCitiesList');
        const locationCity = document.getElementById('locationCity');
        
        // 初始化右侧字母索引
        initAlphabetIndex();
        // 初始化热门城市
        initHotCities();
        // 初始化城市列表
        initAllCities();
        // 初始化最近使用的城市
        renderRecentCities();
        
        // 初始化右侧字母索引
        function initAlphabetIndex() {
            alphabetIndex.innerHTML = '';
            cityData.all.forEach(group => {
                const letterBtn = document.createElement('button');
                letterBtn.className = 'alphabet-item';
                letterBtn.textContent = group.letter;
                letterBtn.dataset.letter = group.letter;
                letterBtn.addEventListener('click', () => scrollToLetter(group.letter));
                alphabetIndex.appendChild(letterBtn);
            });
        }
        
        // 初始化热门城市
        function initHotCities() {
            hotCitiesList.innerHTML = '';
            cityData.hot.forEach(city => {
                const cityBtn = document.createElement('button');
                cityBtn.className = `city-btn mr-2 mb-2 ${city === selectedCity ? 'selected' : ''}`;
                cityBtn.textContent = city;
                cityBtn.dataset.city = city;
                cityBtn.addEventListener('click', () => selectCity(city));
                hotCitiesList.appendChild(cityBtn);
            });
        }
        
        // 初始化城市列表（按字母分组）
        function initAllCities() {
            allCitiesList.innerHTML = '';
            cityData.all.forEach(group => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'city-letter-group';
                groupDiv.id = `letter-${group.letter}`;
                
                const titleDiv = document.createElement('div');
                titleDiv.className = 'city-letter-title';
                titleDiv.textContent = group.letter;
                groupDiv.appendChild(titleDiv);
                
                const citiesDiv = document.createElement('div');
                citiesDiv.className = 'city-letter-cities';
                
                group.cities.forEach(city => {
                    const cityBtn = document.createElement('button');
                    cityBtn.className = `city-btn mr-2 mb-2 ${city === selectedCity ? 'selected' : ''}`;
                    cityBtn.textContent = city;
                    cityBtn.dataset.city = city;
                    cityBtn.addEventListener('click', () => selectCity(city));
                    citiesDiv.appendChild(cityBtn);
                });
                
                groupDiv.appendChild(citiesDiv);
                allCitiesList.appendChild(groupDiv);
            });
        }
        
        // 滚动到指定字母分组
        function scrollToLetter(letter) {
            const targetElement = document.getElementById(`letter-${letter}`);
            if (targetElement) {
                // 高亮当前字母
                document.querySelectorAll('.alphabet-item').forEach(item => {
                    item.classList.remove('active');
                    if (item.dataset.letter === letter) {
                        item.classList.add('active');
                    }
                });
                
                // 滚动到目标位置
                const container = document.querySelector('.city-main-content');
                container.scrollTo({
                    top: targetElement.offsetTop - container.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        
        // 处理字母索引滚动效果
        const cityMainContent = document.querySelector('.city-main-content');
        if (cityMainContent) {
            cityMainContent.addEventListener('scroll', function() {
                // 根据滚动位置更新字母索引的激活状态
                const letterGroups = document.querySelectorAll('.city-letter-group');
                const alphabetItems = document.querySelectorAll('.alphabet-item');
                const containerTop = cityMainContent.getBoundingClientRect().top;
                
                let activeIndex = -1;
                
                letterGroups.forEach((group, index) => {
                    const rect = group.getBoundingClientRect();
                    if (rect.top <= containerTop + 50 && rect.bottom > containerTop) {
                        activeIndex = index;
                    }
                });
                
                if (activeIndex >= 0) {
                    alphabetItems.forEach(item => item.classList.remove('active'));
                    if (alphabetItems[activeIndex]) {
                        alphabetItems[activeIndex].classList.add('active');
                    }
                }
            });
        }
        
        // 搜索城市功能
        function handleCitySearch(e) {
            const keyword = e.target.value.trim();
            if (keyword) {
                citySearchClear.classList.remove('hidden');
                searchCity(keyword);
            } else {
                citySearchClear.classList.add('hidden');
                citySearchResults.classList.add('hidden');
            }
        }
        
        // 搜索城市
        function searchCity(keyword) {
            if (!keyword) {
                citySearchResults.classList.add('hidden');
                return;
            }
            
            const searchResults = [];
            const lowerKeyword = keyword.toLowerCase();
            
            // 搜索所有城市
            cityData.all.forEach(group => {
                group.cities.forEach(city => {
                    // 匹配城市名称或拼音首字母（这里简化处理，实际应用中可能需要更复杂的拼音匹配）
                    if (city.toLowerCase().includes(lowerKeyword)) {
                        searchResults.push(city);
                    }
                });
            });
            
            // 展示搜索结果
            citySearchResults.innerHTML = '';
            
            if (searchResults.length === 0) {
                const noResult = document.createElement('div');
                noResult.className = 'p-4 text-center text-gray-500';
                noResult.textContent = '未找到匹配的城市';
                citySearchResults.appendChild(noResult);
            } else {
                searchResults.forEach(city => {
                    const resultItem = document.createElement('div');
                    resultItem.className = `search-result-item ${city === selectedCity ? 'selected' : ''}`;
                    resultItem.textContent = city;
                    resultItem.dataset.city = city;
                    resultItem.addEventListener('click', () => {
                        selectCity(city);
                        addToRecentCities(city);
                        citySearchInput.value = '';
                        citySearchResults.classList.add('hidden');
                        citySearchClear.classList.add('hidden');
                    });
                    citySearchResults.appendChild(resultItem);
                });
            }
            
            citySearchResults.classList.remove('hidden');
        }
    }

    // --- 选项卡式设计交互逻辑 ---
    function initTabNavigation() {
      const tabButtons = document.querySelectorAll('.tab-btn');
      if (tabButtons.length > 0) {
        console.log('初始化选项卡导航，找到', tabButtons.length, '个选项卡按钮');
        
        tabButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            // 获取目标选项卡ID
            const targetTabId = this.dataset.tab;
            console.log('点击选项卡按钮:', targetTabId);
            
            // 移除所有活动状态
            tabButtons.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // 设置当前选项卡为活动状态
            this.classList.add('active');
            const targetPane = document.getElementById(targetTabId);
            if (targetPane) {
              targetPane.classList.add('active');
            }
          });
        });
      }
    }

    // 初始化材质类型选择器
    function initMaterialTypeSelector() {
      const materialTypeButtons = document.querySelectorAll('.material-type-selector .segmented-btn-new');
      if (materialTypeButtons.length > 0) {
        console.log('初始化材质类型选择器，找到', materialTypeButtons.length, '个按钮');
        
        materialTypeButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            // 移除所有活动状态
            materialTypeButtons.forEach(b => b.classList.remove('active'));
            
            // 设置当前按钮为活动状态
            this.classList.add('active');
            
            // 获取材质类型
            const materialType = this.dataset.materialType;
            console.log('选择材质类型:', materialType);
            
            // 隐藏所有材质组
            document.querySelectorAll('.material-group').forEach(group => {
              group.classList.add('hidden');
            });
            
            // 显示选中的材质组
            const targetGroup = document.querySelector(`.${materialType}-group`);
            if (targetGroup) {
              targetGroup.classList.remove('hidden');
              
              // 更新价格单位显示
              const priceUnit = document.querySelector('.price-unit');
              if (priceUnit) {
                if (materialType === 'leather') {
                  priceUnit.textContent = '单价：元/平方英尺';
                } else {
                  priceUnit.textContent = '单价：元/米';
                }
              }
              
              // 默认选中第一个材质选项
              const firstOption = targetGroup.querySelector('.material-option');
              if (firstOption && !targetGroup.querySelector('.material-option.active')) {
                handleMaterialOptionClick({target: firstOption});
              }
            }
          });
        });
      }
    }

    // 处理材质选项点击
    function handleMaterialOptionClick(event) {
      let optionElement = event.target;
      
      // 如果点击的是子元素，找到父级 .material-option
      if (!optionElement.classList.contains('material-option')) {
        optionElement = optionElement.closest('.material-option');
        if (!optionElement) return;
      }
      
      // 移除同组中所有选项的活动状态
      const group = optionElement.closest('.material-group');
      if (group) {
        group.querySelectorAll('.material-option').forEach(option => {
          option.classList.remove('active');
        });
      }
      
      // 设置当前选项为活动状态
      optionElement.classList.add('active');
      
      // 获取选中的材质名称
      const materialValue = optionElement.dataset.value;
      console.log('选择材质:', materialValue);
      
      // 更新摘要区域显示
      updateSummary('material', materialValue);
      
      // 更新材质信息卡
      const selectedMaterial = document.querySelector('.selected-material');
      if (selectedMaterial) {
        selectedMaterial.textContent = materialValue;
      }
      
      // 更新价格区间选项
      updatePriceRangeOptions(materialValue);
    }

    // 更新价格区间选项
    function updatePriceRangeOptions(materialValue) {
      // 获取对应材质的价格区间数据
      const priceRanges = pickerData.materialPriceRange[materialValue] || [];
      const priceRangeContainer = document.querySelector('.price-range-options');
      
      if (priceRangeContainer && priceRanges.length > 0) {
        // 清空现有选项
        priceRangeContainer.innerHTML = '';
        
        // 添加新的价格区间选项
        priceRanges.forEach((range, index) => {
          const priceLevel = index + 1; // 价格等级 (1-3)
          const priceTier = ['经济型', '中端型', '高端型', '奢华型'][index] || '定制型';
          
          const priceOption = document.createElement('div');
          priceOption.className = 'price-option' + (index === 0 ? ' active' : '');
          priceOption.dataset.value = range;
          
          priceOption.innerHTML = `
            <div class="price-option-inner">
              <span>${range}</span>
              <div class="price-level">
                ${Array(3).fill(0).map((_, i) => i < priceLevel ? 
                  '<i class="fas fa-circle"></i>' : 
                  '<i class="far fa-circle"></i>'
                ).join('')}
              </div>
              <div class="price-label">${priceTier}</div>
            </div>
          `;
          
          priceOption.addEventListener('click', handlePriceOptionClick);
          priceRangeContainer.appendChild(priceOption);
        });
        
        // 更新摘要区域显示
        if (priceRanges.length > 0) {
          updateSummary('price', priceRanges[0]);
        }
      }
    }

    // 处理价格选项点击
    function handlePriceOptionClick(event) {
      let optionElement = event.target;
      
      // 如果点击的是子元素，找到父级 .price-option
      if (!optionElement.classList.contains('price-option')) {
        optionElement = optionElement.closest('.price-option');
        if (!optionElement) return;
      }
      
      // 移除所有选项的活动状态
      document.querySelectorAll('.price-option').forEach(option => {
        option.classList.remove('active');
      });
      
      // 设置当前选项为活动状态
      optionElement.classList.add('active');
      
      // 获取选中的价格区间
      const priceValue = optionElement.dataset.value;
      console.log('选择价格区间:', priceValue);
      
      // 更新摘要区域显示
      updateSummary('price', priceValue);
    }

    // 初始化沙发形状选择器
    function initSofaShapeSelector() {
      const shapeButtons = document.querySelectorAll('.shape-selector .segmented-btn-new');
      if (shapeButtons.length > 0) {
        console.log('初始化沙发形状选择器，找到', shapeButtons.length, '个按钮');
        
        shapeButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            // 移除所有活动状态
            shapeButtons.forEach(b => b.classList.remove('active'));
            
            // 设置当前按钮为活动状态
            this.classList.add('active');
            
            // 获取形状值
            const shapeValue = this.dataset.value;
            console.log('选择沙发形状:', shapeValue);
            
            // 更新摘要区域显示
            updateSummary('shape', shapeValue);
            
            // 更新预览图
            const previewImage = document.querySelector('.shape-preview-image img');
            if (previewImage) {
              // 使用已有的沙发图片
              let imagePath = 'images/sofa/sofa4.jpg'; // 默认L型沙发图片
              
              // 根据形状选择不同的图片
              switch(shapeValue) {
                case 'L型':
                  imagePath = 'images/sofa/sofa4.jpg';
                  break;
                case '一字型':
                  imagePath = 'images/sofa/sofa1.jpg';
                  break;
                case '组合型':
                  imagePath = 'images/sofa/sofa2.jpg';
                  break;
                case 'U型':
                  imagePath = 'images/sofa/sofa3.jpg';
                  break;
                case '贵妃榻':
                  imagePath = 'images/sofa/sofa5.jpg';
                  break;
              }
              
              previewImage.src = imagePath;
              previewImage.alt = `${shapeValue}沙发`;
            }
          });
        });
      }
      
      // 监听长度输入变化
      const lengthInput = document.querySelector('.length-input');
      if (lengthInput) {
        lengthInput.addEventListener('input', function() {
          const lengthValue = this.value;
          console.log('沙发长度变更为:', lengthValue);
          
          // 更新摘要区域显示
          updateSummary('length', `${lengthValue}米`);
        });
      }
    }

    // 初始化附加功能选项卡
    function initFeaturesTab() {
      // 电动功能位步进器
      const electricStepperValue = document.querySelector('[data-type="sofaElectricFunction"]');
      const electricStepperButtons = document.querySelectorAll('[data-target="sofaElectricFunction"]');
      
      if (electricStepperValue && electricStepperButtons.length === 2) {
        console.log('初始化电动功能位步进器');
        
        electricStepperButtons.forEach(btn => {
          btn.addEventListener('click', function() {
            const action = this.dataset.action;
            let value = parseInt(electricStepperValue.textContent);
            
            if (action === 'minus' && value > 0) {
              value--;
            } else if (action === 'plus' && value < 5) {
              value++;
            }
            
            electricStepperValue.textContent = value;
            console.log('电动功能位数量:', value);
            
            // 更新摘要区域显示
            updateSummary('electric', `${value}个`);
          });
        });
      }
      
      // 附加功能切换开关
      const toggleInputs = document.querySelectorAll('.toggle-switch input[type="checkbox"]');
      if (toggleInputs.length > 0) {
        console.log('初始化附加功能切换开关，找到', toggleInputs.length, '个开关');
        
        toggleInputs.forEach(input => {
          input.addEventListener('change', function() {
            updateFeaturesSummary();
          });
        });
        
        // 初始化摘要
        updateFeaturesSummary();
      }
    }

    // 更新附加功能摘要
    function updateFeaturesSummary() {
      const features = [];
      
      // 收集所有启用的功能
      document.querySelectorAll('.toggle-switch input[type="checkbox"]:checked').forEach(input => {
        const labelElement = input.closest('.toggle-item').querySelector('.toggle-label');
        if (labelElement) {
          features.push(labelElement.textContent);
        }
      });
      
      // 更新摘要区域显示
      updateSummary('features', features.join(', ') || '无');
    }

    // 更新摘要区域
    function updateSummary(key, value) {
      const summaryElement = document.getElementById(`summary-${key}`);
      if (summaryElement) {
        summaryElement.textContent = value;
      }
    }

    // 初始化所有选项卡相关交互
    function initTabDesign() {
      console.log('初始化选项卡式设计交互...');
      
      // 初始化选项卡导航
      initTabNavigation();
      
      // 初始化材质类型选择器
      initMaterialTypeSelector();
      
      // 为材质选项添加点击事件
      document.querySelectorAll('.material-option').forEach(option => {
        option.addEventListener('click', handleMaterialOptionClick);
      });
      
      // 初始化沙发形状选择器
      initSofaShapeSelector();
      
      // 初始化附加功能选项卡
      initFeaturesTab();
      
      // 为价格选项添加点击事件
      document.querySelectorAll('.price-option').forEach(option => {
        option.addEventListener('click', handlePriceOptionClick);
      });
      
      console.log('选项卡式设计交互初始化完成');
    }

    // 在装载页面后执行初始化
    document.addEventListener('DOMContentLoaded', function() {
      // 其他初始化代码...
      
      // 当选择沙发报价选项卡时，初始化选项卡式设计
      document.querySelectorAll('.feature-pill').forEach(pill => {
        pill.addEventListener('click', function() {
          if (this.dataset.target === 'sofa') {
            // 延迟一点初始化，确保模板已加载
            setTimeout(initTabDesign, 100);
          }
        });
      });
    });

    // 在页面加载后初始化选项卡式设计
    // 确保这个代码块添加到DOMContentLoaded事件之后，或者修改已有的DOMContentLoaded事件
    document.addEventListener('DOMContentLoaded', function() {
      // 页面加载完成后，检查是否已经存在sofa选项卡
      const sofaPill = document.querySelector('.feature-pill[data-target="sofa"]');
      if (sofaPill) {
        // 监听沙发报价标签点击
        sofaPill.addEventListener('click', function() {
          console.log('沙发标签被点击，初始化选项卡设计');
          // 延迟一点初始化，确保模板已加载
          setTimeout(initTabDesign, 100);
        });
        
        // 如果sofa标签是当前激活的，立即初始化
        if (sofaPill.classList.contains('active')) {
          console.log('沙发标签已激活，立即初始化选项卡设计');
          setTimeout(initTabDesign, 100);
        }
      }
      
      // 其他初始化代码...
    });

    // 添加一个直接调用的初始化，确保在切换到沙发选项卡时能够初始化选项卡设计
    function initSofaTabDesign() {
      console.log('尝试初始化沙发选项卡设计...');
      const sofaTemplate = document.getElementById('sofa-template');
      if (sofaTemplate && !sofaTemplate.classList.contains('hidden')) {
        console.log('沙发模板可见，立即初始化选项卡设计');
        initTabDesign();
      }
    }

    // 处理隐藏茶几步进器
    const hiddenTableValue = document.querySelector('[data-type="sofaHiddenTable"]');
    const hiddenTableButtons = document.querySelectorAll('[data-target="sofaHiddenTable"]');

    if (hiddenTableValue && hiddenTableButtons.length === 2) {
      console.log('初始化隐藏茶几步进器');
      
      hiddenTableButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          const action = this.dataset.action;
          let value = parseInt(hiddenTableValue.textContent);
          
          if (action === 'minus' && value > 0) {
            value--;
          } else if (action === 'plus' && value < 2) {
            value++;
          }
          
          hiddenTableValue.textContent = value;
          console.log('隐藏茶几数量:', value);
          
          // 更新摘要或查询文本
          updateQuerySummary();
        });
      });
    }

    // 移除重复的选项数据
    pickerData.sofaPullOutBed = ['否', '单人', '双人', '三人'];

    // 为隐藏拉床按钮添加点击事件
    const pullOutBedElement = document.querySelector('[data-type="sofaPullOutBed"]');
    if (pullOutBedElement) {
      console.log('初始化隐藏拉床选择器');
      pullOutBedElement.addEventListener('click', function() {
        // 打开Picker
        openPicker(this);
      });
    }

    // 为妃位储物开关添加状态文本切换逻辑
    const sofaStorageCheckbox = document.querySelector('input[data-type="sofaHasStorage"]');
    const storageStateText = document.querySelector('.toggle-state-text');

    if (sofaStorageCheckbox && storageStateText) {
      console.log('初始化妃位储物开关状态文本');
      
      // 设置初始状态
      updateStorageStateText();
      
      // 添加切换事件
      sofaStorageCheckbox.addEventListener('change', updateStorageStateText);
      
      function updateStorageStateText() {
        const isChecked = sofaStorageCheckbox.checked;
        const onText = storageStateText.dataset.on || '是';
        const offText = storageStateText.dataset.off || '否';
        
        storageStateText.textContent = isChecked ? onText : offText;
        console.log('妃位储物状态:', isChecked ? '是' : '否');
      }
    }

    // 为妃位储物是/否按钮添加交互逻辑
    const storageYesNoButtons = document.querySelectorAll('.yes-no-btn[data-type="sofaHasStorage"]');
    if (storageYesNoButtons.length > 0) {
      console.log('初始化妃位储物是/否按钮');
      
      storageYesNoButtons.forEach(btn => {
        btn.addEventListener('click', function() {
          // 先移除所有按钮的活动状态
          storageYesNoButtons.forEach(b => b.classList.remove('active'));
          
          // 设置当前按钮为活动状态
          this.classList.add('active');
          
          // 获取当前选择的值
          const value = this.dataset.value;
          console.log('妃位储物状态:', value);
          
          // 更新摘要或查询文本
          updateQuerySummary();
        });
      });
    }

    // 为妃位储物添加点击切换功能
    const storageToggle = document.querySelector('[data-type="sofaHasStorage"]');
    if (storageToggle) {
      console.log('初始化妃位储物切换');
      
      storageToggle.addEventListener('click', function() {
        // 获取当前值
        const valueText = this.querySelector('.value-text');
        if (valueText) {
          // 切换值
          const currentValue = valueText.textContent;
          const newValue = currentValue === '是' ? '否' : '是';
          
          // 更新显示
          valueText.textContent = newValue;
          console.log('妃位储物状态切换为:', newValue);
          
          // 更新摘要
          updateQuerySummary();
        }
      });
    }
});