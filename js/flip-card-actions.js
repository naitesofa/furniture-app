/**
 * 翻牌结果操作区交互控制器
 * 实现AI设计结果页的操作按钮交互功能
 */

class FlipCardActions {
  constructor(container, options = {}) {
    // 默认配置
    this.config = {
      onEdit: options.onEdit || function() { console.log('编辑按钮被点击'); },
      onRegenerate: options.onRegenerate || function() { console.log('重新生成按钮被点击'); },
      containerSelector: options.containerSelector || '.flip-progress-container', // 卡片容器选择器
      outerSelector: options.outerSelector || '.progress-container', // 双图展示区外层容器
    };
    
    // 保存容器引用
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    if (!this.container) {
      console.error('操作区容器不存在');
      return;
    }
    
    // 初始化
    this.init();
  }
  
  // 初始化操作区
  init() {
    // 创建操作区DOM
    this.createActionsDom();
    
    // 添加事件监听
    this.addEventListeners();
    
    // 显示操作区
    setTimeout(() => {
      this.show();
    }, 500); // 稍微延迟，等待翻牌完成
  }
  
  // 创建操作区DOM
  createActionsDom() {
    // 优先查找外层容器.progress-container
    let parentContainer = this.container.closest(this.config.outerSelector);
    if (!parentContainer) {
      // 兜底：如果找不到，仍然用原来的卡片容器
      parentContainer = this.container.closest(this.config.containerSelector);
    }
    if (!parentContainer) {
      console.error('未找到父容器');
      return;
    }
    // 确保父容器有相对或绝对定位
    if (getComputedStyle(parentContainer).position === 'static') {
      parentContainer.style.position = 'relative';
    }
    // 创建操作区容器
    this.actionsContainer = document.createElement('div');
    this.actionsContainer.className = 'flip-result-actions';
    // 编辑按钮
    const editBtn = document.createElement('button');
    editBtn.className = 'flip-action-btn flip-action-edit';
    editBtn.setAttribute('aria-label', '重新编辑');
    editBtn.innerHTML = `
      ${this.getEditIconSvg()}
      <span class="flip-action-text">重新编辑</span>
    `;
    // 重新生成按钮
    const regenerateBtn = document.createElement('button');
    regenerateBtn.className = 'flip-action-btn flip-action-regenerate';
    regenerateBtn.setAttribute('aria-label', '再次生成');
    regenerateBtn.innerHTML = `
      ${this.getRegenerateIconSvg()}
      <span class="flip-action-text">再次生成</span>
    `;
    // 添加到容器
    this.actionsContainer.appendChild(editBtn);
    this.actionsContainer.appendChild(regenerateBtn);
    // 保存引用
    this.editBtn = editBtn;
    this.regenerateBtn = regenerateBtn;
    // 将操作区添加到外层容器内
    parentContainer.appendChild(this.actionsContainer);
  }
  
  // 编辑图标SVG
  getEditIconSvg() {
    return `<svg class="flip-action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"/>
    </svg>`;
  }
  
  // 重新生成图标SVG
  getRegenerateIconSvg() {
    return `<svg class="flip-action-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12a9 9 0 0 1-9 9c-3.39 0-6.39-1.85-8-4.6m0 0L8 12.4m-4-0l4-4M3 12a9 9 0 0 1 9-9c3.39 0 6.39 1.85 8 4.6m0 0L16 11.6m4 0-4-4"/>
    </svg>`;
  }
  
  // 添加事件监听
  addEventListeners() {
    // 编辑按钮点击事件
    this.editBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // 添加退出动画
      this.actionsContainer.classList.add('exit-left');
      // 动画结束后执行回调
      setTimeout(() => {
        this.config.onEdit();
      }, 300);
    });
    // 重新生成按钮点击事件
    this.regenerateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      // 添加图标旋转动画
      const icon = this.regenerateBtn.querySelector('.flip-action-icon');
      icon.style.animation = 'rotateIcon 0.5s ease-out forwards';
      // 添加退出动画
      this.actionsContainer.classList.add('exit-right');
      // 动画结束后执行回调
      setTimeout(() => {
        this.config.onRegenerate();
      }, 300);
    });
  }
  // 显示操作区
  show() {
    this.actionsContainer.classList.add('visible');
  }
  // 销毁实例，移除DOM和事件监听
  destroy() {
    if (this.actionsContainer && this.actionsContainer.parentNode) {
      this.actionsContainer.parentNode.removeChild(this.actionsContainer);
    }
  }
}

// 导出供其他模块使用
window.FlipCardActions = FlipCardActions; 