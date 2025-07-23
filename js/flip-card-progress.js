/**
 * 翻牌式AI设计进度控制器
 * 实现AI处理状态区的翻牌式进度显示，包括进度更新、翻牌动效和状态控制
 */

class FlipCardProgress {
  constructor(containerId, options = {}) {
    // 默认配置
    this.config = {
      progressDuration: options.progressDuration || 12000, // 默认进度持续时间（毫秒）
      flippingDelay: options.flippingDelay || 200, // 两张卡片翻转的延迟时间
      initialText: options.initialText || 'AI正在创作两套设计方案...',
      completingText: options.completingText || '即将完成...',
      preloadImages: options.preloadImages || [], // 预加载的结果图片
      showStatus: options.showStatus !== undefined ? options.showStatus : true, // 是否显示状态文本
      aspectRatio: options.aspectRatio || '1:1', // 卡片比例，默认1:1
      showActions: options.showActions !== undefined ? options.showActions : true, // 是否显示操作按钮
      onComplete: options.onComplete || function() {},
      onEdit: options.onEdit || function() { console.log('编辑按钮被点击'); },
      onRegenerate: options.onRegenerate || function() { console.log('重新生成按钮被点击'); }
    };
    
    // 比例映射表
    this.aspectRatioMap = {
      '16:9': { width: 16, height: 9, paddingBottom: '56.25%' },
      '3:4': { width: 3, height: 4, paddingBottom: '133.33%' },
      '4:3': { width: 4, height: 3, paddingBottom: '75%' },
      '1:1': { width: 1, height: 1, paddingBottom: '100%' },
      '2:3': { width: 2, height: 3, paddingBottom: '150%' },
      '9:16': { width: 9, height: 16, paddingBottom: '177.78%' }
    };

    // 状态变量
    this.progress = 0;
    this.isRunning = false;
    this.isComplete = false;
    this.container = document.getElementById(containerId);
    
    if (!this.container) {
      console.error('翻牌进度容器不存在:', containerId);
      return;
    }
    
    // 初始化UI
    this.initUI();
    
    // 预加载图片
    this.preloadImages();
  }
  
  // 初始化UI
  initUI() {
    this.container.classList.add('flip-progress-container');
    
    // 创建两张卡片
    this.cardA = this.createCard('A');
    this.cardB = this.createCard('B');
    
    this.container.appendChild(this.cardA);
    this.container.appendChild(this.cardB);
    
    // 应用初始比例设置
    this.setAspectRatio(this.config.aspectRatio);
    
    // 只在需要时创建状态文本
    if (this.config.showStatus) {
      this.statusElement = document.createElement('div');
      this.statusElement.className = 'progress-status';
      this.statusElement.textContent = this.config.initialText;
      this.container.parentNode.insertBefore(this.statusElement, this.container.nextSibling);
    } else {
      this.statusElement = null; // 不显示状态文本
    }
    
    // 存储卡片正面元素引用（用于更新图片）
    this.cardABack = this.cardA.querySelector('.flip-card-back');
    this.cardBBack = this.cardB.querySelector('.flip-card-back');
    
    // 存储进度百分比元素
    this.percentageElement = this.cardA.querySelector('.progress-percentage');
  }
  
  // 创建单个卡片
  createCard(identifier) {
    const card = document.createElement('div');
    card.className = 'flip-card';
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">
          ${identifier === 'A' ? '<div class="progress-percentage">0%</div>' : ''}
          <div class="brand-watermark"></div>
          <div class="card-identifier">${identifier}</div>
        </div>
        <div class="flip-card-back">
          <img class="result-image" src="" alt="设计方案${identifier}" />
        </div>
      </div>
    `;
    
    // 移除点击放大事件 - 图片只作为结果展示
    
    return card;
  }
  
  // 开始进度
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.startTime = Date.now();
    this.endTime = this.startTime + this.config.progressDuration;
    
    this.updateProgress();
    this.progressInterval = setInterval(() => this.updateProgress(), 200);
  }
  
  // 更新进度
  updateProgress() {
    const now = Date.now();
    let linearProgress;
    
    if (now >= this.endTime) {
      linearProgress = 100;
      this.complete();
    } else {
      linearProgress = ((now - this.startTime) / this.config.progressDuration) * 100;
    }
    
    // 使用easeInOutCubic缓动函数使进度更自然
    this.progress = this.easeInOutCubic(linearProgress / 100) * 100;
    this.updateUI();
  }
  
  // easeInOutCubic缓动函数 - 使进度增长更自然
  easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // 更新UI显示
  updateUI() {
    // 更新百分比文本
    const percentText = Math.round(this.progress) + '%';
    this.percentageElement.textContent = percentText;
    
    // 添加数字更新动画
    this.percentageElement.classList.add('updating');
    setTimeout(() => {
      this.percentageElement.classList.remove('updating');
    }, 200);
    
    // 更新状态文本（如果状态元素存在）
    if (this.statusElement && this.progress >= 95 && this.statusElement.textContent !== this.config.completingText) {
      this.statusElement.textContent = this.config.completingText;
    }
    
    // 更新背景渐变
    this.updateBackgroundGradient();
    
    // 更新无障碍通知
    this.updateAccessibilityAnnouncement();
  }
  
  // 更新卡片背景渐变
  updateBackgroundGradient() {
    const frontA = this.cardA.querySelector('.flip-card-front');
    const frontB = this.cardB.querySelector('.flip-card-front');
    
    // 移除所有阶段类
    frontA.classList.remove('progress-stage-1', 'progress-stage-2');
    frontB.classList.remove('progress-stage-1', 'progress-stage-2');
    
    // 根据进度添加阶段类
    if (this.progress >= 50) {
      frontA.classList.add('progress-stage-1');
      frontB.classList.add('progress-stage-1');
    }
    
    if (this.progress >= 90) {
      frontA.classList.add('progress-stage-2');
      frontB.classList.add('progress-stage-2');
    }
  }
  
  // 更新无障碍通知
  updateAccessibilityAnnouncement() {
    // 每25%进度播报一次
    const currentQuarter = Math.floor(this.progress / 25);
    
    if (currentQuarter !== this.lastAnnouncedQuarter) {
      this.lastAnnouncedQuarter = currentQuarter;
      
      // 创建无障碍提示元素（实际项目中应使用专门的无障碍API）
      const announcement = `设计生成进度 ${Math.round(this.progress)}%`;
      
      // 此处可以连接到项目的无障碍系统进行播报
      console.log('[无障碍播报]', announcement);
    }
  }
  
  // 完成进度
  complete() {
    if (this.isComplete) return;
    
    clearInterval(this.progressInterval);
    this.isRunning = false;
    this.isComplete = true;
    this.progress = 100;
    
    // 更新最终UI状态
    this.updateUI();
    
    // 触发翻牌
    setTimeout(() => {
      this.flipCard(this.cardA);
      
      setTimeout(() => {
        this.flipCard(this.cardB);
        
        // 完成后初始化操作按钮
        setTimeout(() => {
          this.initActionsButtons();
          this.config.onComplete();
        }, 1000);
      }, this.config.flippingDelay);
    }, 500);
  }
  
  // 初始化操作按钮
  initActionsButtons() {
    // 只在配置允许时显示操作按钮
    if (this.config.showActions) {
      // 检查是否已经加载了操作按钮相关文件
      if (typeof FlipCardActions !== 'undefined') {
        // 创建操作按钮实例
        this.actions = new FlipCardActions(this.container, {
          onEdit: () => {
            // 销毁当前实例
            if (this.actions) {
              this.actions.destroy();
              this.actions = null;
            }
            
            // 触发编辑回调
            this.config.onEdit();
          },
          onRegenerate: () => {
            // 销毁当前实例
            if (this.actions) {
              this.actions.destroy();
              this.actions = null;
            }
            
            // 触发重新生成回调
            this.config.onRegenerate();
          }
        });
      } else {
        console.warn('FlipCardActions 未定义，无法初始化操作按钮');
      }
    }
  }
  
  // 翻转卡片
  flipCard(card) {
    // 设置卡片图片（如果有预加载图片）
    const identifier = card.querySelector('.card-identifier').textContent;
    const imageIndex = identifier === 'A' ? 0 : 1;
    
    if (this.config.preloadImages[imageIndex]) {
      const imageElement = card.querySelector('.result-image');
      const imageSrc = this.config.preloadImages[imageIndex];
      
      // 如果图片已加载，可以检测其比例
      // 并且在必要时调整卡片比例以匹配图片
      if (this.preloadedImages && this.preloadedImages[imageIndex]) {
        const img = this.preloadedImages[imageIndex];
        if (img.complete) {
          const imgRatio = img.naturalWidth / img.naturalHeight;
          // 根据图片比例，设置最接近的卡片比例
          this.setCardRatioFromImageRatio(imgRatio, card);
        }
      }
      
      // 设置图片源
      imageElement.src = imageSrc;
      
      // 图片加载事件，可以再次检测比例
      imageElement.onload = () => {
        const loadedImgRatio = imageElement.naturalWidth / imageElement.naturalHeight;
        this.setCardRatioFromImageRatio(loadedImgRatio, card);
      };
    }
    
    // 添加翻转类
    card.classList.add('flipped');
    
    // 添加落定动画
    setTimeout(() => {
      card.classList.add('settled');
    }, 700);
  }
  
  // 根据图片比例设置最接近的卡片比例
  setCardRatioFromImageRatio(imgRatio, card) {
    // 寻找最接近的预定义比例
    let closestRatio = '1:1';
    let minDiff = Number.MAX_VALUE;
    
    for (const [ratio, data] of Object.entries(this.aspectRatioMap)) {
      const ratioValue = data.width / data.height;
      const diff = Math.abs(ratioValue - imgRatio);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestRatio = ratio;
      }
    }
    
    // 只调整单个卡片的比例，因为我们已经在翻牌阶段
    const aspectData = this.aspectRatioMap[closestRatio];
    const inner = card.querySelector('.flip-card-inner');
    if (inner) inner.dataset.ratio = closestRatio;
    
    console.log(`图片比例: ${imgRatio.toFixed(2)}, 使用卡片比例: ${closestRatio}`);
  }
  
  // 预加载图片
  preloadImages() {
    this.preloadedImages = this.config.preloadImages.map((url, index) => {
      const img = new Image();
      
      // 添加加载事件以检测比例
      img.onload = () => {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        console.log(`预加载图片 ${index+1} 比例: ${imgRatio.toFixed(2)}`);
        
        // 如果是第一张图片，可以提前调整卡片比例
        if (index === 0 && !this.isComplete) {
          this.updateCardRatioBasedOnImage(imgRatio);
        }
      };
      
      img.src = url;
      return img;
    });
  }
  
  // 基于图片比例更新卡片比例
  updateCardRatioBasedOnImage(imgRatio) {
    // 寻找最接近的预定义比例
    let closestRatio = '1:1';
    let minDiff = Number.MAX_VALUE;
    
    for (const [ratio, data] of Object.entries(this.aspectRatioMap)) {
      const ratioValue = data.width / data.height;
      const diff = Math.abs(ratioValue - imgRatio);
      
      if (diff < minDiff) {
        minDiff = diff;
        closestRatio = ratio;
      }
    }
    
    // 如果找到的比例与当前设置不同，则更新
    if (closestRatio !== this.config.aspectRatio) {
      console.log(`检测到图片比例: ${imgRatio.toFixed(2)}, 更新卡片比例为: ${closestRatio}`);
      this.setAspectRatio(closestRatio);
    }
  }
  
  // 设置卡片宽高比
  setAspectRatio(ratio) {
    if (!ratio || !this.aspectRatioMap[ratio]) {
      console.warn(`未知比例: ${ratio}, 使用默认比例 1:1`);
      ratio = '1:1';
    }
    
    this.config.aspectRatio = ratio;
    const aspectData = this.aspectRatioMap[ratio];
    
    // 应用新比例到卡片
    if (this.cardA && this.cardB) {
      // 添加平滑过渡
      this.cardA.style.transition = 'padding-bottom 0.5s ease';
      this.cardB.style.transition = 'padding-bottom 0.5s ease';
      
      this.cardA.style.paddingBottom = aspectData.paddingBottom;
      this.cardB.style.paddingBottom = aspectData.paddingBottom;
      
      // 为了防止卡片内容被拉伸，也更新内部元素
      const innerA = this.cardA.querySelector('.flip-card-inner');
      const innerB = this.cardB.querySelector('.flip-card-inner');
      if (innerA) innerA.dataset.ratio = ratio;
      if (innerB) innerB.dataset.ratio = ratio;
      
      console.log(`卡片比例已调整为: ${ratio} (${aspectData.paddingBottom})`);
    }
  }
  
  // 移除放大查看图片方法
  
  // 重置进度器
  reset() {
    clearInterval(this.progressInterval);
    this.isRunning = false;
    this.isComplete = false;
    this.progress = 0;
    
    // 重置UI
    this.percentageElement.textContent = '0%';
    if (this.statusElement) {
      this.statusElement.textContent = this.config.initialText;
    }
    
    // 移除翻转类
    this.cardA.classList.remove('flipped', 'settled');
    this.cardB.classList.remove('flipped', 'settled');
    
    // 移除渐变类
    const frontA = this.cardA.querySelector('.flip-card-front');
    const frontB = this.cardB.querySelector('.flip-card-front');
    frontA.classList.remove('progress-stage-1', 'progress-stage-2');
    frontB.classList.remove('progress-stage-1', 'progress-stage-2');
    
    // 销毁操作按钮
    if (this.actions) {
      this.actions.destroy();
      this.actions = null;
    }
  }
  
  // 设置结果图片
  setResultImages(imageUrls) {
    this.config.preloadImages = imageUrls;
    this.preloadImages();
  }
}

// 导出供其他模块使用
window.FlipCardProgress = FlipCardProgress; 