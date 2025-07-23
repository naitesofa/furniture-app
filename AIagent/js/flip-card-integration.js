/**
 * 翻牌式AI设计进度 - 专业重构集成
 * 本文件将翻牌式进度指示器集成到AI设计页面中
 */

// 在文档加载后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 覆盖原有进度处理函数
  if (typeof window.simulateMainContentProgress === 'function') {
    console.log('正在替换进度显示为翻牌式进度方案...');
    window.originalSimulateMainContentProgress = window.simulateMainContentProgress;
    window.simulateMainContentProgress = simulateFlipCardProgress;
  }
  
  // 加载操作区样式
  loadStylesheet('css/flip-card-actions.css');
});

/**
 * 动态加载CSS文件
 * @param {string} href - CSS文件路径
 */
function loadStylesheet(href) {
  const linkExists = Array.from(document.getElementsByTagName('link')).some(
    link => link.href.includes(href)
  );
  
  if (!linkExists) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
    console.log(`动态加载样式: ${href}`);
  }
}

/**
 * 翻牌式进度显示实现，替代原有的simulateMainContentProgress
 * @param {HTMLElement} aiMessage - 消息容器元素
 */
function simulateFlipCardProgress(aiMessage) {
  console.log('启动翻牌式进度显示');

  // 获取处理元素
  const processingElement = aiMessage.querySelector('.message-processing');
  if (!processingElement) {
    console.error('未找到处理状态元素');
    return;
  }

  // 获取生成数据，防御性处理
  const generationData = window.currentGenerationData || {};
  if (!generationData || Object.keys(generationData).length === 0) {
    console.error('generationData 未定义或为空，无法渲染翻牌进度');
    processingElement.innerHTML = '<div style="color:#e76f51;text-align:center;padding:24px 0;">生成数据丢失，请重试</div>';
    return;
  }

  // 清空处理元素内容，但保留现有的用户输入区
  // 我们只添加翻牌区域，不再创建重复的用户输入展示区
  processingElement.innerHTML = '';

  // 创建结果图片数组，为翻牌做准备
  // 这里使用随机选择的一对图片，实际项目应该连接到后端API
  const resultImagePairs = [
    ['images/AIdesign/新房软装1.jpg', 'images/AIdesign/新房软装2.jpg'],
    ['images/AIdesign/旧房改造1.jpg', 'images/AIdesign/旧房改造2.jpg'],
    ['images/AIdesign/cf.jpg', 'images/AIdesign/kt.jpg']
  ];
  
  // 随机选择一对结果图
  const randomPair = resultImagePairs[Math.floor(Math.random() * resultImagePairs.length)];

  // 从生成数据中获取比例参数
  const selectedRatio = generationData.selectedRatio || '1:1';
  
  // 创建翻牌区域容器
  const flipCardContainer = document.createElement('div');
  flipCardContainer.id = 'flipCardProgress';
  flipCardContainer.className = 'flip-card-progress-container';
  processingElement.appendChild(flipCardContainer);

  // 初始化翻牌进度控制器
  const flipProgress = new FlipCardProgress('flipCardProgress', {
    progressDuration: 10000, // 10秒完成
    preloadImages: randomPair,
    initialText: '', // 不显示文字描述
    completingText: '', // 不显示文字描述
    showStatus: false, // 禁用状态文本显示
    aspectRatio: selectedRatio, // 使用所选比例
    showActions: true, // 启用操作按钮
    onComplete: function() {
      console.log('翻牌式进度显示完成，左下角显示操作按钮');
    },
    onEdit: function() {
      console.log('用户点击了重新编辑按钮');
      // 实际项目中应返回编辑界面，或打开编辑对话框
      triggerActionCallback('editDesign', generationData);
    },
    onRegenerate: function() {
      console.log('用户点击了再次生成按钮');
      // 实际项目中应重新开始生成
      triggerActionCallback('regenerateDesign', generationData);
    }
  });

  // 开始进度显示
  flipProgress.start();
}

/**
 * 触发操作回调
 * @param {string} action - 操作名称
 * @param {object} data - 相关数据
 */
function triggerActionCallback(action, data) {
  // 检查是否存在全局回调函数
  if (typeof window.onAIDesignAction === 'function') {
    window.onAIDesignAction(action, data);
  } else {
    console.log(`未找到操作回调函数，操作: ${action}`);
    
    // 默认处理逻辑
    if (action === 'regenerateDesign') {
      // 如果是重新生成，可以重新调用原始的生成函数
      if (typeof window.originalSimulateMainContentProgress === 'function') {
        const aiMessage = document.querySelector('.ai-message:last-child');
        if (aiMessage) {
          window.originalSimulateMainContentProgress(aiMessage);
          simulateFlipCardProgress(aiMessage);
        }
      }
    } else if (action === 'editDesign') {
      // 如果是编辑，可以显示一个提示
      alert('返回编辑界面功能将在后续版本实现');
    }
  }
}

/**
 * 添加操作按钮到结果区域
 * @param {HTMLElement} processingElement - 处理状态容器
 * @param {HTMLElement} aiMessage - 消息容器
 * @param {Array} imagePair - 图片对
 */
function addActionButtons(processingElement, aiMessage, imagePair) {
  // 功能已移除 - 不再添加任何按钮
  // 设计图片生成后直接展示结果
}

// 重写displayGenerationInMainContent函数，使其与新的进度显示方式兼容
window.originalDisplayGenerationInMainContent = window.displayGenerationInMainContent;
window.displayGenerationInMainContent = function(generationData) {
  console.log('启用翻牌式设计进度显示', generationData);
  
  // 保存生成数据，供翻牌进度显示使用
  window.currentGenerationData = generationData;
  
  // 调用原始函数创建消息结构
  window.originalDisplayGenerationInMainContent(generationData);
}; 