/**
 * 创作面板交互逻辑
 * 负责处理创作面板的所有交互功能，包括面板开关、参数选择、图片上传等
 */

// 创作面板相关变量
let creativePanel;
let creativePanelOverlay;
let closeCreativeBtn;
let localFileUpload;
let uploadImageBtn;
let firstFramePreview;
let firstFrameImage;
let lastFramePreview;
let lastFrameImage;
let removeFirstFrameBtn;
let removeLastFrameBtn;
let promptTextarea;
let generateBtn;

// 操作按钮
let ratioBtn;
let cameraBtn;
let durationBtn;

// 参数区域相关
let paramsArea;
let paramsScrollContainer;

// 应用状态
const panelState = {
  hasFirstFrame: false,
  hasLastFrame: false,
  selectedRatio: '9:16', // 默认9:16比例
  selectedCamera: '环绕',
  selectedDuration: '5s', // 默认5秒
  firstFrameUrl: null,
  lastFrameUrl: null,
  descriptionText: '',
  activeSection: 'camera' // 默认激活运镜方式区域
};

// 运镜方式描述
const cameraDescriptions = {
  '环绕': '镜头围绕主体进行拍摄',
  '推进': '镜头逐渐靠近主体',
  '拉远': '镜头逐渐远离主体',
  '快速推拉': '镜头快速靠近并远离主体'
};

/**
 * 初始化创作面板
 */
function initCreativePanel() {
  // 获取DOM元素
  creativePanel = document.getElementById('creativePanel');
  creativePanelOverlay = document.getElementById('creativePanelOverlay');
  closeCreativeBtn = document.querySelector('.close-handle');
  localFileUpload = document.getElementById('localFileUpload');
  uploadImageBtn = document.getElementById('uploadImageBtn');
  firstFramePreview = document.getElementById('firstFramePreview');
  firstFrameImage = document.getElementById('firstFrameImage');
  lastFramePreview = document.getElementById('lastFramePreview');
  lastFrameImage = document.getElementById('lastFrameImage');
  promptTextarea = document.getElementById('promptTextarea');
  generateBtn = document.getElementById('generateBtn');
  
  // 获取删除按钮
  const removeButtons = document.querySelectorAll('.remove-frame-btn');
  removeFirstFrameBtn = removeButtons[0];
  removeLastFrameBtn = removeButtons[1];
  
  // 操作按钮
  ratioBtn = document.getElementById('ratioBtn') || document.getElementById('durationBtn'); // 兼容旧代码
  cameraBtn = document.getElementById('cameraBtn');
  durationBtn = document.getElementById('durationBtn');
  
  // 参数区域相关
  paramsArea = document.querySelector('.params-area');
  paramsScrollContainer = document.querySelector('.params-scroll-container');
  
  // 设置初始比例按钮文本
  if (durationBtn) {
    durationBtn.textContent = panelState.selectedRatio;
  }
  
  // 初始化选中状态
  initSelectedOptions();
  
  // 添加事件监听
  setupEventListeners();
}

/**
 * 初始化选中状态
 */
function initSelectedOptions() {
  // 设置默认选中的比例
  const ratioOptions = document.querySelectorAll('.ratio-btn-container .ratio-btn');
  ratioOptions.forEach(option => {
    if (option.textContent.trim() === panelState.selectedRatio) {
      option.classList.add('active');
      option.querySelector('.ratio-checkbox').checked = true;
    }
  });
  
  // 设置默认选中的运镜方式
  const cameraOptions = document.querySelectorAll('.camera-options .option-tag');
  cameraOptions.forEach(option => {
    if (option.textContent === panelState.selectedCamera) {
      option.classList.add('active');
    }
  });
  
  // 设置默认选中的时长
  const durationOptions = document.querySelectorAll('.duration-options .option-tag');
  durationOptions.forEach(option => {
    if (option.textContent === panelState.selectedDuration) {
      option.classList.add('active');
      
      // 更新标题显示
      const durationTitle = document.querySelector('.duration-section .param-section-title');
      if (durationTitle) {
        durationTitle.textContent = `视频时长: ${option.textContent}`;
      }
    }
  });
}

/**
 * 设置事件监听
 */
function setupEventListeners() {
  // 关闭创作面板按钮
  closeCreativeBtn.addEventListener('click', closeCreativePanel);
  
  // 遮罩层点击事件
  creativePanelOverlay.addEventListener('click', closeCreativePanel);
  
  // 图片上传处理
  localFileUpload.addEventListener('change', handleImageUpload);
  
  // 移除首帧按钮
  removeFirstFrameBtn.addEventListener('click', function() {
    removeFrame('first');
  });
  
  // 移除尾帧按钮
  removeLastFrameBtn.addEventListener('click', function() {
    removeFrame('last');
  });
  
  // 文本区域点击，显示键盘，隐藏参数区
  promptTextarea.addEventListener('click', function() {
    paramsArea.classList.add('hidden');
    promptTextarea.focus();
  });
  
  // 文本区域内容变化监听
  promptTextarea.addEventListener('input', function() {
    // 根据文本区域是否为空来控制生成按钮的显示和隐藏
    if (this.value.trim() === '') {
      generateBtn.style.display = 'none';
    } else {
      generateBtn.style.display = 'block';
    }
  });
  
  // 初始化时检查文本区域内容
  if (promptTextarea.value.trim() === '') {
    generateBtn.style.display = 'none';
  } else {
    generateBtn.style.display = 'block';
  }
  
  // 操作按钮点击事件
  cameraBtn.addEventListener('click', function() {
    // 隐藏键盘
    promptTextarea.blur();
    
    // 显示参数区
    paramsArea.classList.remove('hidden');
    
    // 滚动到运镜方式区域
    scrollToSection('camera');
    
    // 设置激活按钮
    setActiveButton('camera');
  });
  
  if (durationBtn) {
    durationBtn.addEventListener('click', function() {
      // 隐藏键盘
      promptTextarea.blur();
      
      // 显示参数区
      paramsArea.classList.remove('hidden');
      
      // 滚动到比例区域
      scrollToSection('ratio');
      
      // 设置激活按钮
      setActiveButton('ratio');
    });
  }
  
  // 比例选项点击事件
  const ratioOptions = document.querySelectorAll('.ratio-btn-container .ratio-btn');
  ratioOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 获取复选框
      const checkbox = this.querySelector('.ratio-checkbox');
      
      // 移除所有选项的激活状态和取消选中所有复选框
      ratioOptions.forEach(opt => {
        opt.classList.remove('active');
        opt.querySelector('.ratio-checkbox').checked = false;
      });
      
      // 激活当前选项并选中复选框
      this.classList.add('active');
      checkbox.checked = true;
      
      // 更新比例状态
      panelState.selectedRatio = this.textContent.trim();
      
      // 更新比例按钮文本
      if (durationBtn) {
        durationBtn.textContent = panelState.selectedRatio;
      }
    });
  });
  
  // 运镜方式选项点击事件
  const cameraOptions = document.querySelectorAll('.camera-options .option-tag');
  cameraOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除所有选项的激活状态
      cameraOptions.forEach(opt => opt.classList.remove('active'));
      
      // 激活当前选项
      this.classList.add('active');
      
      // 更新运镜方式状态
      panelState.selectedCamera = this.textContent;
    });
  });
  
  // 时长选项点击事件
  const durationOptions = document.querySelectorAll('.duration-options .option-tag');
  durationOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除所有选项的激活状态
      durationOptions.forEach(opt => opt.classList.remove('active'));
      
      // 激活当前选项
      this.classList.add('active');
      
      // 更新时长状态
      panelState.selectedDuration = this.textContent;
      
      // 更新标题显示
      const durationTitle = document.querySelector('.duration-section .param-section-title');
      if (durationTitle) {
        durationTitle.textContent = `视频时长: ${this.textContent}`;
      }
    });
  });
  
  // 参数区域滚动事件
  paramsScrollContainer.addEventListener('scroll', handleParamsScroll);
  
  // 生成按钮点击事件
  generateBtn.addEventListener('click', handleGenerate);
}

/**
 * 处理参数区域滚动
 */
function handleParamsScroll() {
  // 获取当前滚动位置
  const scrollTop = paramsScrollContainer.scrollTop;
  const containerHeight = paramsScrollContainer.clientHeight;
  
  // 获取所有参数区域
  const sections = document.querySelectorAll('.param-section');
  
  // 判断当前可见的区域
  let activeSection = '';
  sections.forEach((section, index) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    // 调整判断逻辑，适应更紧凑的布局
    if (scrollTop >= sectionTop - 30 && 
        scrollTop < sectionTop + sectionHeight - 30) {
      // 根据ID获取区域类型
      activeSection = section.id.replace('Section', '').toLowerCase();
      
      // 更新状态
      panelState.activeSection = activeSection;
      
      // 更新按钮状态
      setActiveButton(activeSection);
    }
  });
}

/**
 * 滚动到指定区域
 * @param {string} section - 区域名称
 */
function scrollToSection(section) {
  const sectionElement = document.getElementById(section + 'Section');
  if (sectionElement) {
    // 添加小偏移量，确保标题完全可见
    const offsetTop = sectionElement.offsetTop - 5;
    
    paramsScrollContainer.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
    
    // 更新状态
    panelState.activeSection = section;
  }
}

/**
 * 打开创作面板
 * @param {string} inputText - 初始输入文本
 */
function openCreativePanel(inputText) {
  if (!creativePanel) {
    console.error('创作面板未初始化');
    return;
  }
  
  // 显示遮罩层
  creativePanelOverlay.classList.add('active');
  
  // 显示创作面板
  creativePanel.classList.add('active');
  
  // 添加创作模式类
  document.body.classList.add('creative-mode');
  
  // 如果有初始输入文本，则填充到面板中
  if (inputText) {
    promptTextarea.value = inputText;
    // 有文本时显示生成按钮
    generateBtn.style.display = 'block';
  } else {
    // 无文本时隐藏生成按钮
    generateBtn.style.display = 'none';
  }
  
  // 根据当前状态决定是否显示上传按钮
  const uploadBtnContainer = document.querySelector('.upload-btn-container');
  if (uploadBtnContainer) {
    if (panelState.hasFirstFrame && panelState.hasLastFrame) {
      // 如果已有两张图片，隐藏上传按钮
      uploadBtnContainer.style.display = 'none';
    } else {
      // 否则显示上传按钮
      uploadBtnContainer.style.display = 'block';
    }
  }
  
  // 隐藏参数选择区，确保初始状态下只显示文本输入框
  paramsArea.classList.add('hidden');
  
  // 移除所有按钮的激活状态
  cameraBtn.classList.remove('active');
  if (durationBtn) {
    durationBtn.classList.remove('active');
  }
  
  // 自动聚焦文本输入框，唤起键盘
  setTimeout(() => {
    promptTextarea.focus();
  }, 300); // 添加延迟，确保动画完成后再聚焦
  
  // 添加页面滚动到顶部，确保遮罩层完全覆盖
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 关闭创作面板
 */
function closeCreativePanel() {
  // 隐藏创作面板
  creativePanel.classList.remove('active');
  
  // 隐藏遮罩层
  creativePanelOverlay.classList.remove('active');
  
  // 移除创作模式类
  document.body.classList.remove('creative-mode');
  
  // 触发自定义事件，通知外部面板已关闭
  const event = new CustomEvent('panel:closed', {
    detail: { textInput: promptTextarea.value }
  });
  document.dispatchEvent(event);
  
  // 显示底部输入框
  const bottomInput = document.querySelector('.bottom-input');
  if (bottomInput) {
    bottomInput.classList.remove('hidden');
    setTimeout(() => {
      bottomInput.classList.remove('slide-down');
    }, 10);
  }
}

/**
 * 设置激活的按钮
 * @param {string} buttonType - 按钮类型（'ratio'/'camera'/'duration'）
 */
function setActiveButton(buttonType) {
  // 更新状态
  panelState.activeSection = buttonType;
  
  // 移除所有按钮的激活状态
  cameraBtn.classList.remove('active');
  if (durationBtn) {
    durationBtn.classList.remove('active');
  }
  
  // 激活当前按钮
  if (buttonType === 'camera') {
    cameraBtn.classList.add('active');
  } else if (buttonType === 'ratio') {
    if (durationBtn) {
      durationBtn.classList.add('active');
    }
  }
}

/**
 * 处理图片上传
 * @param {Event} event - 上传事件对象
 */
function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      const imageDataUrl = e.target.result;
      
      // 根据当前状态决定是上传首帧还是尾帧
      if (!panelState.hasFirstFrame) {
        // 上传首帧
        displayFirstFrame(imageDataUrl);
      } else if (!panelState.hasLastFrame) {
        // 上传尾帧
        displayLastFrame(imageDataUrl);
      }
    };
    
    reader.readAsDataURL(file);
  } else {
    alert('请选择图片文件');
  }
  
  // 清空文件输入，以便于再次选择同一文件
  localFileUpload.value = '';
}

/**
 * 显示首帧图片
 * @param {string} imageUrl - 图片URL
 */
function displayFirstFrame(imageUrl) {
  // 显示首帧图片预览
  firstFrameImage.src = imageUrl;
  firstFramePreview.classList.remove('hidden');
  
  // 更新状态
  panelState.hasFirstFrame = true;
  panelState.firstFrameUrl = imageUrl;
}

/**
 * 显示尾帧图片
 * @param {string} imageUrl - 图片URL
 */
function displayLastFrame(imageUrl) {
  // 显示尾帧图片预览
  lastFrameImage.src = imageUrl;
  lastFramePreview.classList.remove('hidden');
  
  // 更新状态
  panelState.hasLastFrame = true;
  panelState.lastFrameUrl = imageUrl;
  
  // 隐藏上传按钮容器，因为已经上传了两张图片
  const uploadBtnContainer = document.querySelector('.upload-btn-container');
  if (uploadBtnContainer) {
    uploadBtnContainer.style.display = 'none';
  }
}

/**
 * 移除帧
 * @param {string} frameType - 帧类型 ('first' 或 'last')
 */
function removeFrame(frameType) {
  if (frameType === 'first') {
    // 移除首帧
    firstFramePreview.classList.add('hidden');
    firstFrameImage.src = '';
    
    // 如果有尾帧，将尾帧变为首帧
    if (panelState.hasLastFrame) {
      firstFrameImage.src = lastFrameImage.src;
      firstFramePreview.classList.remove('hidden');
      
      // 清除尾帧
      lastFramePreview.classList.add('hidden');
      lastFrameImage.src = '';
      
      // 更新状态
      panelState.firstFrameUrl = panelState.lastFrameUrl;
      panelState.lastFrameUrl = null;
      panelState.hasLastFrame = false;
      
      // 显示上传按钮容器，因为现在只有一张图片
      const uploadBtnContainer = document.querySelector('.upload-btn-container');
      if (uploadBtnContainer) {
        uploadBtnContainer.style.display = 'block';
      }
    } else {
      // 更新状态
      panelState.hasFirstFrame = false;
      panelState.firstFrameUrl = null;
      
      // 显示上传按钮容器，因为现在没有图片
      const uploadBtnContainer = document.querySelector('.upload-btn-container');
      if (uploadBtnContainer) {
        uploadBtnContainer.style.display = 'block';
      }
    }
  } else if (frameType === 'last') {
    // 移除尾帧
    lastFramePreview.classList.add('hidden');
    lastFrameImage.src = '';
    
    // 更新状态
    panelState.hasLastFrame = false;
    panelState.lastFrameUrl = null;
    
    // 显示上传按钮容器，因为现在只有一张图片
    const uploadBtnContainer = document.querySelector('.upload-btn-container');
    if (uploadBtnContainer) {
      uploadBtnContainer.style.display = 'block';
    }
  }
}

/**
 * 处理生成按钮点击
 */
function handleGenerate() {
  if (!panelState.hasFirstFrame) {
    alert('请先上传至少一张图片');
    return;
  }
  
  // 获取描述文本
  panelState.descriptionText = promptTextarea.value.trim();
  
  // 如果没有描述文本，使用默认描述
  if (!panelState.descriptionText) {
    panelState.descriptionText = `使用${panelState.selectedRatio}比例生成视频，采用${panelState.selectedCamera}运镜方式，时长${panelState.selectedDuration}`;
  }
  
  // 收集创作数据
  const creationData = {
    description: panelState.descriptionText,
    firstFrameUrl: panelState.firstFrameUrl,
    lastFrameUrl: panelState.lastFrameUrl,
    hasLastFrame: panelState.hasLastFrame,
    selectedRatio: panelState.selectedRatio,
    selectedCamera: panelState.selectedCamera,
    selectedDuration: panelState.selectedDuration
  };
  
  // 为了兼容现有代码，保留imageDataUrl字段
  creationData.imageDataUrl = panelState.firstFrameUrl;
  
  // 关闭创作面板
  creativePanel.classList.remove('active');
  
  // 隐藏遮罩层
  creativePanelOverlay.classList.remove('active');
  
  // 移除创作模式类
  document.body.classList.remove('creative-mode');
  
  document.body.style.overflow = '';
  
  // 触发自定义事件，通知外部开始生成
  const event = new CustomEvent('panel:generate', {
    detail: creationData
  });
  document.dispatchEvent(event);
  
  // 触发面板关闭事件，确保底部输入框显示
  const closedEvent = new CustomEvent('panel:closed', {
    detail: { textInput: panelState.descriptionText }
  });
  document.dispatchEvent(closedEvent);
}

/**
 * 重置创作面板
 */
function resetCreativePanel() {
  // 清空输入文本
  promptTextarea.value = '';
  
  // 重置图片预览
  firstFramePreview.classList.add('hidden');
  firstFrameImage.src = '';
  lastFramePreview.classList.add('hidden');
  lastFrameImage.src = '';
  
  // 重置状态
  panelState.hasFirstFrame = false;
  panelState.hasLastFrame = false;
  panelState.firstFrameUrl = null;
  panelState.lastFrameUrl = null;
  panelState.descriptionText = '';
  
  // 重置选项
  initSelectedOptions();
  
  // 确保上传按钮显示
  const uploadBtnContainer = document.querySelector('.upload-btn-container');
  if (uploadBtnContainer) {
    uploadBtnContainer.style.display = 'block';
  }
}

// 导出公共API
window.CreativePanel = {
  init: initCreativePanel,
  open: function(inputText) {
    resetCreativePanel();
    openCreativePanel(inputText);
  },
  getState: () => ({ ...panelState })
}; 