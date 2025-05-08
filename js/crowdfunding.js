// 众筹数据 - 在实际应用中这些数据应该从API获取
const crowdfundingData = [
    {
        id: 1,
        title: "未来感智能沙发 - 内置按摩、语音控制",
        description: "采用航天级记忆材料，内置8点按摩系统，支持语音控制和手机APP远程操作",
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        status: "ongoing",
        statusText: "众筹中",
        raised: 198520,
        goal: 100000,
        percent: 198,
        supporters: 328,
        earlyBirdPrice: 2999,
        retailPrice: 4999,
        countdown: {
            days: 12,
            hours: 5,
            minutes: 36
        },
        features: ["智能控制", "语音交互", "记忆材质", "APP操控"]
    },
    {
        id: 2,
        title: "模块化智能沙发 - 可拆卸充电组件",
        description: "可随意组合的沙发模块，内置无线充电，USB接口，氛围灯光系统",
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=600&fit=crop",
        status: "upcoming",
        statusText: "预热中",
        raised: 0,
        goal: 150000,
        percent: 0,
        supporters: 0,
        likes: 168,
        isLiked: false,
        earlyBirdPrice: 3299,
        retailPrice: 5299,
        reminderCount: 286,
        releaseDate: "9月20日",
        features: ["模块化设计", "无线充电", "智能灯光", "扩展接口"]
    },
    {
        id: 3,
        title: "智能变形沙发床 - 一键自动展开收纳",
        description: "智能电动控制，3秒完成沙发/床切换，内置智能睡眠监测系统",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
        status: "ended",
        statusText: "生产中",
        raised: 385600,
        goal: 250000,
        percent: 154,
        supporters: 472,
        earlyBirdPrice: 3899,
        retailPrice: 5999,
        shipDate: "11月",
        features: ["自动变形", "睡眠监测", "一键控制", "智能家居"]
    },
    {
        id: 4,
        title: "温控科技沙发 - 四季恒温舒适系统",
        description: "可调节温度控制系统，四季舒适，智能识别多人使用场景",
        image: "https://images.unsplash.com/photo-1588279102960-e40f7cb34c81?w=800&h=600&fit=crop",
        status: "ended",
        statusText: "已发货",
        raised: 268300,
        goal: 200000,
        percent: 134,
        supporters: 393,
        earlyBirdPrice: 2899,
        retailPrice: 4799,
        features: ["温度控制", "智能识别", "节能系统", "环境适应"]
    }
];

// 轮播图数据
const bannerData = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=400&fit=crop",
        alt: "科技沙发",
        link: "crowdfunding-detail.html?id=1",
        badge: "新品预售",
        title: "智能舒适体验",
        subtitle: "前沿科技与人体工程学的完美结合"
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&h=400&fit=crop",
        alt: "创新设计",
        link: "crowdfunding-detail.html?id=2",
        badge: "限时特惠",
        title: "未来感沙发系列",
        subtitle: "体验前所未有的舒适与科技"
    }
];

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    initTabSlider();
    initSearchbox();
    initBanner();
    renderCrowdfundingList("all");
    initLoadMore();
    initTabNavigation();
    addParticleEffect();
});

// 返回上一页
function goBack() {
    window.history.back();
}

// 导航到其他页面
function navigateTo(route) {
    // 添加触觉反馈
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
    
    // 实际应用中应该跳转到对应页面
    const routes = {
        home: "index.html",
        crowdfunding: "crowdfunding.html",
        category: "category.html",
        cart: "cart.html",
        profile: "profile.html"
    };
    
    if (routes[route]) {
        window.location.href = routes[route];
    } else {
        showToast("页面开发中...");
    }
}

// 初始化搜索框
function initSearchbox() {
    const searchIcon = document.getElementById('searchIcon');
    const searchContainer = document.getElementById('searchContainer');
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    // 默认隐藏搜索框
    searchContainer.style.display = 'none';
    
    // 点击搜索图标显示搜索框
    searchIcon.addEventListener('click', function() {
        searchContainer.style.display = 'block';
        searchInput.focus();
        // 添加动画效果
        searchContainer.classList.add('fade-in');
        setTimeout(() => {
            searchContainer.classList.remove('fade-in');
        }, 300);
    });
    
    // 清除搜索
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchInput.focus();
    });
    
    // 搜索事件
    searchInput.addEventListener('input', function() {
        // 这里实现搜索逻辑
        const searchTerm = searchInput.value.toLowerCase();
        filterProjectsBySearch(searchTerm);
    });
}

// 搜索项目
function filterProjectsBySearch(searchTerm) {
    const filteredProjects = searchTerm ? 
        crowdfundingData.filter(project => 
            project.title.toLowerCase().includes(searchTerm) || 
            project.description.toLowerCase().includes(searchTerm) ||
            (project.features && project.features.some(feature => feature.toLowerCase().includes(searchTerm)))
        ) : 
        crowdfundingData;
    
    renderCrowdfundingList("search", filteredProjects);
}

// 初始化轮播图
function initBanner() {
    const bannerContainer = document.getElementById('bannerContainer');
    const bannerWrapper = bannerContainer.querySelector('.banner-wrapper');
    const bullets = document.querySelectorAll('.banner-bullet');
    
    let currentBanner = 0;
    
    // 自动轮播
    setInterval(function() {
        currentBanner = (currentBanner + 1) % bannerData.length;
        updateBanner();
    }, 5000);
    
    // 点击指示器切换
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', function() {
            currentBanner = index;
            updateBanner();
        });
    });
    
    // 触摸滑动
    let startX = 0;
    let isSwiping = false;
    
    bannerContainer.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        isSwiping = true;
    });
    
    bannerContainer.addEventListener('touchmove', function(e) {
        if (!isSwiping) return;
        
        const currentX = e.touches[0].clientX;
        const diffX = currentX - startX;
        const translateX = -currentBanner * 100 + (diffX / bannerContainer.offsetWidth) * 100;
        
        bannerWrapper.style.transition = 'none';
        bannerWrapper.style.transform = `translateX(${translateX}%)`;
    });
    
    bannerContainer.addEventListener('touchend', function(e) {
        if (!isSwiping) return;
        
        isSwiping = false;
        const endX = e.changedTouches[0].clientX;
        const diffX = endX - startX;
        
        bannerWrapper.style.transition = 'transform 0.3s ease';
        
        if (Math.abs(diffX) > bannerContainer.offsetWidth / 3) {
            if (diffX > 0 && currentBanner > 0) {
                currentBanner--;
            } else if (diffX < 0 && currentBanner < bannerData.length - 1) {
                currentBanner++;
            }
        }
        
        updateBanner();
    });
    
    // 更新轮播图位置和指示器
    function updateBanner() {
        bannerWrapper.style.transition = 'transform 0.3s ease';
        bannerWrapper.style.transform = `translateX(-${currentBanner * 100}%)`;
        
        bullets.forEach((bullet, index) => {
            if (index === currentBanner) {
                bullet.classList.add('active');
            } else {
                bullet.classList.remove('active');
            }
        });
    }
}

// 初始化标签导航
function initTabNavigation() {
    const tabs = document.querySelectorAll('.tab-nav-item');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            const index = parseInt(this.getAttribute('data-index'));
            
            // 更新标签状态
            updateTab(index);
            
            // 过滤项目
            renderCrowdfundingList(type);
            
            // 触觉反馈
            if ('vibrate' in navigator) {
                navigator.vibrate(5);
            }
        });
    });
}

// 初始化标签滑块
function initTabSlider() {
    const tabSlider = document.getElementById('tabSlider');
    const tabItems = document.querySelectorAll('.tab-nav-item');
    
    // 计算每个标签的宽度百分比
    const tabWidth = 100 / tabItems.length;
    
    // 设置滑块初始宽度
    tabSlider.style.width = `${tabWidth}%`;
    
    // 设置初始位置
    updateTab(0);
}

// 更新标签状态
function updateTab(index) {
    const tabSlider = document.getElementById('tabSlider');
    const tabItems = document.querySelectorAll('.tab-nav-item');
    
    // 移除所有标签的active状态
    tabItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 设置当前标签为active
    tabItems[index].classList.add('active');
    
    // 更新滑块位置
    tabSlider.style.transform = `translateX(${index * 100}%)`;
}

// 渲染众筹列表
function renderCrowdfundingList(type, customData = null) {
    const crowdfundingList = document.getElementById('crowdfundingList');
    
    // 清空列表
    crowdfundingList.innerHTML = '';
    
    // 确定要渲染的数据
    let filteredData = [];
    if (customData) {
        filteredData = customData;
    } else if (type === "all") {
        filteredData = crowdfundingData;
    } else {
        filteredData = crowdfundingData.filter(project => project.status === type);
    }
    
    // 如果没有数据
    if (filteredData.length === 0) {
        crowdfundingList.innerHTML = `
            <div class="no-data">
                <i class="fas fa-search-minus"></i>
                <p>没有找到相关项目</p>
            </div>
        `;
        return;
    }
    
    // 渲染项目卡片
    filteredData.forEach(project => {
        const card = document.createElement('div');
        card.className = 'crowdfunding-card';
        card.setAttribute('data-id', project.id);
        
        // 格式化倒计时或日期信息
        let timeInfo = '';
        if (project.status === "ongoing" && project.countdown) {
            timeInfo = `剩余${project.countdown.days}天`;
        } else if (project.status === "upcoming" && project.releaseDate) {
            timeInfo = `${project.releaseDate}开始`;
        } else if (project.status === "ended" && project.shipDate) {
            timeInfo = `预计${project.shipDate}发货`;
        } else if (project.status === "ended") {
            timeInfo = `已发货`;
        }

        let buttonHtml = '';
        let supportInfoHtml = '';
        
        // 根据项目状态显示不同的按钮和支持信息
        if (project.status === "upcoming") {
            // 预热中项目显示点赞按钮
            buttonHtml = `<button class="like-btn ${project.isLiked ? 'liked' : ''}">
                <i class="fas ${project.isLiked ? 'fa-heart' : 'fa-heart'}"></i> 点赞
            </button>`;
            
            // 显示点赞数量
            supportInfoHtml = `
                <div class="support-info">
                    <i class="fas fa-heart"></i>
                    <span>${project.likes || 0}人点赞</span>
                </div>
            `;
        } else {
            // 其他状态显示去支持按钮
            buttonHtml = `<button class="support-btn">去支持</button>`;
            
            // 显示支持人数
            supportInfoHtml = `
                <div class="support-info">
                    <i class="fas fa-user-group"></i>
                    <span>${project.supporters}人支持</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${project.image}" alt="${project.title}" class="card-image">
                <div class="card-badge">
                    <span class="status-tag status-${project.status}">${project.statusText}</span>
                </div>
                <div class="tech-overlay">
                    <div class="tech-circle"></div>
                    <div class="tech-circle"></div>
                </div>
            </div>
            <div class="card-content">
                <div>
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-desc">${project.description}</p>
                </div>
                <div class="card-bottom">
                    <div class="progress-wrapper mb-2">
                        <div class="progress-container">
                            <div class="progress-bar" style="width: ${Math.min(project.percent, 100)}%"></div>
                        </div>
                        <div class="funding-percent">已达成<span class="highlight">${project.percent}%</span></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <div class="funding-amount">¥${formatNumber(project.earlyBirdPrice)}</div>
                        ${buttonHtml}
                    </div>
                    <div class="flex justify-between items-center mt-2">
                        ${supportInfoHtml}
                        <div class="time-info">
                            <i class="fas fa-clock"></i>
                            <span>${timeInfo}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', function() {
            goToDetail(project.id, project.status);
        });
        
        // 处理按钮点击事件
        if (project.status === "upcoming") {
            // 预热中项目的点赞按钮事件
            const likeBtn = card.querySelector('.like-btn');
            if (likeBtn) {
                likeBtn.addEventListener('click', function(e) {
                    e.stopPropagation(); // 阻止冒泡
                    toggleLike(this, project.id);
                });
            }
        } else {
            // 其他状态的支持按钮事件
            const supportBtn = card.querySelector('.support-btn');
            if (supportBtn) {
                supportBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    goToDetail(project.id, project.status);
                    showToast('正在前往支持页面...');
                });
            }
        }
        
        // 添加到列表
        crowdfundingList.appendChild(card);
        
        // 添加动画效果
        setTimeout(() => {
            card.classList.add('fade-in');
        }, (filteredData.indexOf(project) * 100));
    });
}

// 切换点赞状态
function toggleLike(button, projectId) {
    const isLiked = button.classList.contains('liked');
    
    // 更新UI
    if (isLiked) {
        button.classList.remove('liked');
        button.innerHTML = '<i class="fas fa-heart"></i> 点赞';
        showToast('已取消点赞');
    } else {
        button.classList.add('liked');
        button.innerHTML = '<i class="fas fa-heart"></i> 已点赞';
        
        // 添加点赞动画效果
        const heart = button.querySelector('i');
        heart.classList.add('heart-pulse');
        setTimeout(() => {
            heart.classList.remove('heart-pulse');
        }, 800);
        
        showToast('点赞成功，感谢您的支持！');
    }
    
    // 更新项目数据
    for (let i = 0; i < crowdfundingData.length; i++) {
        if (crowdfundingData[i].id === projectId) {
            // 更新点赞状态
            crowdfundingData[i].isLiked = !isLiked;
            
            // 更新点赞数量
            if (!isLiked) {
                crowdfundingData[i].likes = (crowdfundingData[i].likes || 0) + 1;
            } else if (crowdfundingData[i].likes > 0) {
                crowdfundingData[i].likes--;
            }
            
            // 更新显示的点赞数
            const card = document.querySelector(`.crowdfunding-card[data-id="${projectId}"]`);
            if (card) {
                const likeCountEl = card.querySelector('.support-info span');
                if (likeCountEl) {
                    likeCountEl.textContent = `${crowdfundingData[i].likes || 0}人点赞`;
                }
            }
            
            break;
        }
    }
    
    // 在实际应用中，这里应该将点赞数据发送到服务器保存
    // API.saveLikeStatus(projectId, !isLiked);
}

// 切换提醒按钮
function toggleReminder(button, event, projectId) {
    // 阻止冒泡
    event.stopPropagation();
    
    const isActive = button.classList.contains('active');
    
    if (isActive) {
        button.classList.remove('active');
        button.querySelector('i').className = 'fas fa-bell-slash';
        showToast('已取消设置提醒');
    } else {
        button.classList.add('active');
        button.querySelector('i').className = 'fas fa-bell';
        showToast('已设置提醒，开售时通知您');
        
        // 添加铃铛摇动动画
        button.querySelector('i').classList.add('bell-shake');
        setTimeout(() => {
            button.querySelector('i').classList.remove('bell-shake');
        }, 1000);
    }
    
    // 更新项目数据
    crowdfundingData.forEach(project => {
        if (project.id === projectId) {
            project.isReminded = !isActive;
        }
    });
}

// 初始化加载更多功能
function initLoadMore() {
    const loadingMore = document.getElementById('loadingMore');
    
    // 监听滚动事件，实现无限滚动
    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;
        
        // 当滚动到距离底部100px时加载更多
        if (scrollHeight - scrollTop - clientHeight < 100) {
            // 这里模拟加载更多
            loadMoreProjects();
        }
    });
    
    // 点击加载更多
    loadingMore.addEventListener('click', function() {
        loadMoreProjects();
    });
}

// 模拟加载更多项目
function loadMoreProjects() {
    const loadingMore = document.getElementById('loadingMore');
    
    // 显示加载中
    loadingMore.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
        </div>
        <span>加载中...</span>
    `;
    
    // 延迟一下以模拟加载
    setTimeout(function() {
        // 显示没有更多了
        loadingMore.innerHTML = `
            <span>没有更多项目了</span>
        `;
    }, 1500);
}

// 跳转到详情页
function goToDetail(id, status) {
    console.log("跳转到项目详情页，ID:", id, "状态:", status);
    
    // 如果是预热状态项目，添加预热参数
    if (status === "upcoming") {
        window.location.href = `crowdfunding-detail.html?id=${id}&preheating=true`;
    } else {
        window.location.href = `crowdfunding-detail.html?id=${id}`;
    }
}

// 格式化数字
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// 显示提示信息
function showToast(message) {
    // 检查是否已经存在toast元素
    let toast = document.querySelector('.toast');
    
    if (toast) {
        // 如果存在，先移除它
        toast.remove();
    }
    
    // 创建新的toast元素
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // 添加到body中
    document.body.appendChild(toast);
    
    // 短暂延迟后显示
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 3秒后隐藏
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// 添加CSS动画样式
const styleElement = document.createElement('style');
styleElement.textContent = `
    .fade-in {
        animation: fadeIn 0.3s forwards;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .bell-shake {
        animation: bellShake 0.5s ease-in-out;
    }
    
    @keyframes bellShake {
        0% { transform: rotate(0); }
        20% { transform: rotate(15deg); }
        40% { transform: rotate(-15deg); }
        60% { transform: rotate(7deg); }
        80% { transform: rotate(-7deg); }
        100% { transform: rotate(0); }
    }
    
    .toast {
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        background: rgba(25, 29, 43, 0.9);
        color: white;
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        backdrop-filter: blur(10px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        opacity: 0;
        transition: all 0.3s ease;
        border: 1px solid rgba(0, 229, 255, 0.3);
    }
    
    .toast.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    
    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 0;
        color: rgba(255, 255, 255, 0.5);
    }
    
    .particle-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    }
    
    .particle {
        position: absolute;
        background: rgba(0, 229, 255, 0.3);
        border-radius: 50%;
        animation: float linear infinite;
        opacity: 0.2;
    }
    
    @keyframes float {
        0% {
            transform: translateY(0) translateX(0);
        }
        25% {
            transform: translateY(-20px) translateX(10px);
        }
        50% {
            transform: translateY(-40px) translateX(0);
        }
        75% {
            transform: translateY(-20px) translateX(-10px);
        }
        100% {
            transform: translateY(0) translateX(0);
        }
    }
`;

document.head.appendChild(styleElement);

// 添加粒子效果
function addParticleEffect() {
    // 创建粒子特效容器
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    document.body.appendChild(particleContainer);
    
    // 创建随机粒子
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 5 + 1;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        
        particleContainer.appendChild(particle);
    }
}

// 渲染项目底部信息（倒计时/日期等）
function renderProjectFooter(project) {
    if (project.status === "ongoing") {
        return `
            <div class="countdown-container">
                <div class="countdown-item">${project.countdown.days}</div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">${String(project.countdown.hours).padStart(2, '0')}</div>
                <div class="countdown-separator">:</div>
                <div class="countdown-item">${String(project.countdown.minutes).padStart(2, '0')}</div>
            </div>
        `;
    } else if (project.status === "upcoming") {
        return `
            <div class="release-date">
                <i class="fas fa-calendar-alt mr-1"></i>
                <span>${project.releaseDate}</span>
                <button class="reminder-btn ml-2 ${project.isReminded ? 'active' : ''}" onclick="toggleReminder(this, event, ${project.id})">
                    <i class="fas ${project.isReminded ? 'fa-bell' : 'fa-bell-slash'}"></i>
                </button>
            </div>
        `;
    } else if (project.status === "ended") {
        if (project.shipDate) {
            return `<div class="ship-date"><i class="fas fa-truck mr-1"></i> 预计${project.shipDate}发货</div>`;
        } else {
            return `<div class="ship-date"><i class="fas fa-check-circle mr-1"></i> 已发货</div>`;
        }
    }
} 