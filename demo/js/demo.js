// 视频联动产品展示 - 主控制器
class VideoProductDemo {
    constructor() {
        this.videoConfig = null;
        this.products = null;
        this.currentScene = null;
        this.video = null;
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        try {
            // 加载配置数据
            await this.loadData();
            
            // 初始化DOM元素
            this.initElements();
            
            // 设置事件监听
            this.setupEventListeners();
            
            // 初始化时间轴
            this.initTimeline();
            
            // 标记为已初始化
            this.isInitialized = true;
            
            console.log('视频产品联动系统初始化完成');
        } catch (error) {
            console.error('初始化失败:', error);
            this.showError('系统初始化失败，请刷新页面重试');
        }
    }
    
    async loadData() {
        try {
            // 加载视频配置
            const videoConfigResponse = await fetch('data/video-config.json');
            this.videoConfig = await videoConfigResponse.json();
            
            // 加载产品数据
            const productsResponse = await fetch('data/products.json');
            this.products = await productsResponse.json();
            
            console.log('数据加载完成:', {
                scenes: this.videoConfig.scenes.length,
                products: this.products.products.length
            });
        } catch (error) {
            throw new Error('数据加载失败: ' + error.message);
        }
    }
    
    initElements() {
        // 获取DOM元素
        this.video = document.getElementById('main-video');
        this.currentSceneElement = document.getElementById('current-scene');
        this.videoDurationElement = document.getElementById('video-duration');
        this.timelineElement = document.getElementById('timeline');
        this.productsGrid = document.getElementById('products-grid');
        this.productsDescription = document.getElementById('products-description');
        this.productsCount = document.getElementById('products-count');
        this.loadingIndicator = document.getElementById('loading-indicator');
        this.sceneIndicator = document.getElementById('scene-indicator');
        
        // 检查必要元素
        if (!this.video || !this.productsGrid) {
            throw new Error('关键DOM元素未找到');
        }
    }
    
    setupEventListeners() {
        // 视频事件监听
        this.video.addEventListener('loadedmetadata', () => {
            this.updateVideoDuration();
        });
        
        this.video.addEventListener('timeupdate', () => {
            this.handleTimeUpdate();
        });
        
        this.video.addEventListener('play', () => {
            this.handleVideoPlay();
        });
        
        this.video.addEventListener('pause', () => {
            this.handleVideoPause();
        });
        
        // 产品模态框事件
        this.setupModalEvents();
    }
    
    initTimeline() {
        if (!this.timelineElement || !this.videoConfig) return;
        
        this.timelineElement.innerHTML = '';
        
        // 创建进度条
        const progressBar = document.createElement('div');
        progressBar.className = 'timeline-progress';
        progressBar.id = 'timeline-progress';
        this.timelineElement.appendChild(progressBar);
        
        // 创建场景段
        this.videoConfig.scenes.forEach(scene => {
            const segment = document.createElement('div');
            segment.className = `timeline-segment ${scene.sceneType}`;
            segment.style.left = `${(scene.startTime / this.videoConfig.duration) * 100}%`;
            segment.style.width = `${((scene.endTime - scene.startTime) / this.videoConfig.duration) * 100}%`;
            segment.textContent = scene.sceneName;
            segment.title = `${scene.sceneName} (${scene.startTime}s - ${scene.endTime}s)`;
            
            // 点击跳转到对应时间
            segment.addEventListener('click', () => {
                if (this.video) {
                    this.video.currentTime = scene.startTime;
                }
            });
            
            this.timelineElement.appendChild(segment);
        });
    }
    
    updateVideoDuration() {
        if (this.videoDurationElement && this.video) {
            const duration = this.formatTime(this.video.duration);
            this.videoDurationElement.textContent = `时长: ${duration}`;
        }
    }
    
    handleTimeUpdate() {
        if (!this.video || !this.videoConfig) return;
        
        const currentTime = this.video.currentTime;
        
        // 更新进度条
        this.updateProgressBar(currentTime);
        
        // 检查场景切换
        this.checkSceneChange(currentTime);
    }
    
    updateProgressBar(currentTime) {
        const progressBar = document.getElementById('timeline-progress');
        if (progressBar && this.video) {
            const progress = (currentTime / this.video.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    checkSceneChange(currentTime) {
        const newScene = this.videoConfig.scenes.find(scene => 
            currentTime >= scene.startTime && currentTime < scene.endTime
        );
        
        if (newScene && newScene.id !== this.currentScene?.id) {
            this.switchScene(newScene);
        }
    }
    
    async switchScene(scene) {
        console.log('切换场景:', scene.sceneName);
        
        this.currentScene = scene;
        
        // 更新场景指示器
        this.updateSceneIndicator(scene);
        
        // 更新时间轴活动状态
        this.updateTimelineActive(scene);
        
        // 显示场景切换动画
        this.showSceneChangeAnimation(scene);
        
        // 加载对应产品
        await this.loadSceneProducts(scene);
    }
    
    updateSceneIndicator(scene) {
        if (this.currentSceneElement) {
            this.currentSceneElement.innerHTML = `
                <i class="fas fa-home mr-1"></i>
                ${scene.sceneName}
            `;
        }
    }
    
    updateTimelineActive(scene) {
        // 移除所有活动状态
        document.querySelectorAll('.timeline-segment').forEach(segment => {
            segment.classList.remove('active');
        });
        
        // 添加当前场景的活动状态
        const activeSegment = document.querySelector(`.timeline-segment.${scene.sceneType}`);
        if (activeSegment) {
            activeSegment.classList.add('active');
        }
    }
    
    showSceneChangeAnimation(scene) {
        if (this.sceneIndicator) {
            this.sceneIndicator.querySelector('span').textContent = `切换到${scene.sceneName}`;
            this.sceneIndicator.classList.add('show');
            
            setTimeout(() => {
                this.sceneIndicator.classList.remove('show');
            }, 2000);
        }
    }
    
    async loadSceneProducts(scene) {
        if (!this.products || !scene.products) return;
        
        // 显示加载状态
        this.showLoading(true);
        
        // 筛选场景相关产品
        const sceneProducts = this.products.products.filter(product => 
            scene.products.includes(product.category) && 
            product.sceneType === scene.sceneType
        );
        
        // 更新产品描述
        this.updateProductsDescription(scene, sceneProducts.length);
        
        // 渲染产品
        await this.renderProducts(sceneProducts);
        
        // 隐藏加载状态
        this.showLoading(false);
    }
    
    updateProductsDescription(scene, productCount) {
        if (this.productsDescription) {
            this.productsDescription.textContent = scene.description;
        }
        
        if (this.productsCount) {
            this.productsCount.textContent = `${productCount} 件商品`;
        }
    }
    
    async renderProducts(products) {
        if (!this.productsGrid) return;
        
        // 添加淡出动画
        this.productsGrid.classList.add('fade-out');
        
        // 等待动画完成
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 清空现有内容
        this.productsGrid.innerHTML = '';
        
        if (products.length === 0) {
            this.productsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="text-center py-12">
                        <i class="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-500 mb-2">暂无相关产品</h3>
                        <p class="text-gray-400">该场景暂时没有配置产品</p>
                    </div>
                </div>
            `;
        } else {
            // 创建产品容器
            const container = document.createElement('div');
            container.className = 'products-container';
            
            // 渲染产品卡片
            products.forEach((product, index) => {
                const productCard = this.createProductCard(product, index);
                container.appendChild(productCard);
            });
            
            this.productsGrid.appendChild(container);
        }
        
        // 移除淡出，添加淡入
        this.productsGrid.classList.remove('fade-out');
        this.productsGrid.classList.add('fade-in');
        
        // 清理动画类
        setTimeout(() => {
            this.productsGrid.classList.remove('fade-in');
        }, 600);
    }
    
    createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = `product-card product-card-enhanced product-card-stagger animate-delay-${(index % 6 + 1) * 100}`;
        
        const originalPrice = product.originalPrice > product.price ? 
            `<span class="text-sm text-gray-400 line-through ml-2">¥${product.originalPrice}</span>` : '';
        
        card.innerHTML = `
            <img src="images/${product.images[0]}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    ¥${product.price}
                    ${originalPrice}
                </div>
                <div class="product-tags">
                    ${product.tags.slice(0, 3).map(tag => `<span class="product-tag">${tag}</span>`).join('')}
                </div>
                <p class="product-description">${product.description}</p>
                <div class="flex items-center justify-between mt-3 text-sm text-gray-500">
                    <span class="flex items-center">
                        <i class="fas fa-star text-yellow-400 mr-1"></i>
                        ${product.rating} (${product.reviewCount})
                    </span>
                    <span class="${product.inStock ? 'text-green-600' : 'text-red-600'}">
                        ${product.inStock ? '现货' : '缺货'}
                    </span>
                </div>
            </div>
        `;
        
        // 添加点击事件
        card.addEventListener('click', () => {
            this.showProductModal(product);
        });
        
        return card;
    }
    
    showProductModal(product) {
        const modal = document.getElementById('product-modal');
        const modalName = document.getElementById('modal-product-name');
        const modalImage = document.getElementById('modal-product-image');
        const modalDetails = document.getElementById('modal-product-details');
        
        if (!modal || !modalName || !modalImage || !modalDetails) return;
        
        // 设置产品信息
        modalName.textContent = product.name;
        modalImage.src = `images/${product.images[0]}`;
        modalImage.alt = product.name;
        
        // 设置详细信息
        modalDetails.innerHTML = `
            <div class="space-y-4">
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">价格</h4>
                    <div class="text-2xl font-bold text-blue-600">
                        ¥${product.price}
                        ${product.originalPrice > product.price ? 
                            `<span class="text-lg text-gray-400 line-through ml-2">¥${product.originalPrice}</span>` : ''}
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">产品描述</h4>
                    <p class="text-gray-600">${product.description}</p>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">规格参数</h4>
                    <div class="grid grid-cols-2 gap-2 text-sm">
                        ${Object.entries(product.specifications).map(([key, value]) => 
                            `<div><span class="text-gray-500">${key}:</span> <span class="text-gray-800">${value}</span></div>`
                        ).join('')}
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-2">产品特色</h4>
                    <div class="flex flex-wrap gap-2">
                        ${product.features.map(feature => 
                            `<span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">${feature}</span>`
                        ).join('')}
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t">
                    <div class="flex items-center space-x-4">
                        <span class="flex items-center text-yellow-500">
                            <i class="fas fa-star mr-1"></i>
                            ${product.rating}
                        </span>
                        <span class="text-gray-500">${product.reviewCount} 条评价</span>
                    </div>
                    <span class="px-3 py-1 rounded-full text-sm ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">
                        ${product.inStock ? '现货供应' : '暂时缺货'}
                    </span>
                </div>
                
                <button class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    ${product.inStock ? '立即购买' : '到货通知'}
                </button>
            </div>
        `;
        
        // 显示模态框
        modal.classList.remove('hidden');
    }
    
    setupModalEvents() {
        const modal = document.getElementById('product-modal');
        const closeButton = document.getElementById('close-modal');
        const overlay = modal?.querySelector('.product-modal-overlay');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        }
        
        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }
    
    handleVideoPlay() {
        console.log('视频开始播放');
        // 如果还没有当前场景，检查一次
        if (!this.currentScene && this.video) {
            this.checkSceneChange(this.video.currentTime);
        }
    }
    
    handleVideoPause() {
        console.log('视频暂停');
    }
    
    showLoading(show) {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.toggle('hidden', !show);
        }
        
        if (this.productsGrid) {
            this.productsGrid.classList.toggle('loading', show);
        }
    }
    
    showError(message) {
        console.error(message);
        if (this.productsGrid) {
            this.productsGrid.innerHTML = `
                <div class="empty-state">
                    <div class="text-center py-12">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-300 mb-4"></i>
                        <h3 class="text-lg font-medium text-red-500 mb-2">加载失败</h3>
                        <p class="text-red-400">${message}</p>
                    </div>
                </div>
            `;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.videoProductDemo = new VideoProductDemo();
}); 