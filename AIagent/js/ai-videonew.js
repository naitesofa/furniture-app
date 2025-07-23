document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const backButton = document.getElementById('backButton');
  const menuButton = document.getElementById('menuButton');
  const composer = document.getElementById('composer');
  const creativePanel = document.getElementById('creativePanel');
  const closeCreativeBtn = document.getElementById('closeCreativeBtn');
  const localFileUpload = document.getElementById('localFileUpload');
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const referencePreview = document.getElementById('referencePreview');
  const referenceImage = document.getElementById('referenceImage');
  const removeReferenceBtn = document.querySelector('.remove-reference-btn');
  const ratioButtons = document.querySelectorAll('.ratio-btn');
  const cameraButtons = document.querySelectorAll('.camera-btn');
  const cameraDesc = document.getElementById('cameraDesc');
  const promptTextarea = document.getElementById('promptTextarea');
  const generateBtn = document.getElementById('generateBtn');
  const progressOverlay = document.getElementById('progressOverlay');
  const progressRing = document.querySelector('.progress-ring-circle');
  const progressPercentage = document.querySelector('.progress-percentage');
  const remainingTime = document.getElementById('remainingTime');
  const chatContainer = document.getElementById('chatContainer');
  const userMessageTemplate = document.getElementById('userMessageTemplate');
  const aiMessageTemplate = document.getElementById('aiMessageTemplate');
  
  // 运镜方式描述
  const cameraDescriptions = {
    '环绕': '环绕：镜头围绕主体进行拍摄',
    '拉近': '拉近：镜头从远处逐渐靠近主体',
    '拉远': '拉远：镜头从近处逐渐远离主体'
  };
  
  // 应用状态
  let appState = {
    hasImage: false,
    isGenerating: false,
    selectedRatio: '1:1',
    selectedCamera: '环绕',
    imageDataUrl: null,
    descriptionText: '',
    generationCount: 0
  };
  
  // 初始化
  function init() {
    // 返回按钮点击事件
    backButton.addEventListener('click', function() {
      window.location.href = 'ai-assistant.html';
    });
    
    // 底部输入框获取焦点时展开创作面板
    composer.addEventListener('click', openCreativePanel);
    
    // 关闭创作面板按钮
    closeCreativeBtn.addEventListener('click', closeCreativePanel);
    
    // 图片上传处理
    localFileUpload.addEventListener('change', handleImageUpload);
    
    // 移除参考图按钮
    removeReferenceBtn.addEventListener('click', removeReferenceImage);
    
    // 比例按钮点击事件
    ratioButtons.forEach(button => {
      button.addEventListener('click', function() {
        setActiveRatio(this.getAttribute('data-ratio'));
      });
    });
    
    // 运镜方式按钮点击事件
    cameraButtons.forEach(button => {
      button.addEventListener('click', function() {
        setActiveCamera(this.getAttribute('data-camera'));
      });
    });
    
    // 生成按钮点击事件
    generateBtn.addEventListener('click', handleGenerate);
    
    // 清除欢迎信息，如果有历史消息
    if (localStorage.getItem('videoMessages')) {
      try {
        const messages = JSON.parse(localStorage.getItem('videoMessages'));
        if (messages.length > 0) {
          document.querySelector('.welcome-message').classList.add('hidden');
          renderMessages(messages);
        }
      } catch (e) {
        console.error('Error parsing messages from localStorage', e);
      }
    }
  }
  
  // 打开创作面板
  function openCreativePanel() {
    creativePanel.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止背景滚动
    promptTextarea.focus();
    
    // 将输入框内容同步到创作面板
    promptTextarea.value = composer.value;
  }
  
  // 关闭创作面板
  function closeCreativePanel() {
    creativePanel.classList.remove('active');
    document.body.style.overflow = '';
    
    // 将创作面板内容同步到输入框
    composer.value = promptTextarea.value;
  }
  
  // 处理图片上传
  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        const imageDataUrl = e.target.result;
        
        // 显示图片预览
        referenceImage.src = imageDataUrl;
        referencePreview.classList.remove('hidden');
        uploadImageBtn.classList.add('hidden');
        
        // 更新状态
        appState.hasImage = true;
        appState.imageDataUrl = imageDataUrl;
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('请选择图片文件');
    }
  }
  
  // 移除参考图片
  function removeReferenceImage() {
    referencePreview.classList.add('hidden');
    uploadImageBtn.classList.remove('hidden');
    referenceImage.src = '';
    localFileUpload.value = '';
    
    // 更新状态
    appState.hasImage = false;
    appState.imageDataUrl = null;
  }
  
  // 设置活动比例
  function setActiveRatio(ratio) {
    appState.selectedRatio = ratio;
    
    ratioButtons.forEach(button => {
      if (button.getAttribute('data-ratio') === ratio) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
  }
  
  // 设置活动运镜方式
  function setActiveCamera(camera) {
    appState.selectedCamera = camera;
    
    cameraButtons.forEach(button => {
      if (button.getAttribute('data-camera') === camera) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // 更新运镜方式描述
    cameraDesc.textContent = cameraDescriptions[camera] || '';
  }
  
  // 处理生成按钮点击
  function handleGenerate() {
    if (!appState.hasImage) {
      alert('请先上传参考图片');
      return;
    }
    
    if (appState.isGenerating) {
      return; // 防止重复点击
    }
    
    // 获取描述文本
    appState.descriptionText = promptTextarea.value.trim();
    
    // 如果没有描述文本，使用默认描述
    if (!appState.descriptionText) {
      appState.descriptionText = `使用${appState.selectedRatio}比例生成视频，采用${appState.selectedCamera}运镜方式`;
    }
    
    // 关闭创作面板
    closeCreativePanel();
    
    // 清空输入框
    composer.value = '';
    promptTextarea.value = '';
    
    // 添加用户消息到对话流
    addUserMessage();
    
    // 开始生成视频
    startGeneration();
  }
  
  // 添加用户消息
  function addUserMessage() {
    // 移除欢迎信息
    document.querySelector('.welcome-message').classList.add('hidden');
    
    // 克隆用户消息模板
    const userMessageNode = userMessageTemplate.content.cloneNode(true);
    
    // 设置消息内容
    userMessageNode.querySelector('.message-text').textContent = appState.descriptionText;
    userMessageNode.querySelector('.reference-image').src = appState.imageDataUrl;
    
    // 设置消息时间
    userMessageNode.querySelector('.message-time').textContent = getCurrentTime();
    
    // 添加标签
    const tagsContainer = userMessageNode.querySelector('.message-tags');
    tagsContainer.innerHTML = `
      <span class="tag">#${appState.selectedRatio}</span>
      <span class="tag">#${appState.selectedCamera}</span>
    `;
    
    // 将消息添加到对话流
    chatContainer.appendChild(userMessageNode);
    
    // 滚动到底部
    scrollToBottom();
    
    // 保存消息到历史记录
    saveMessage({
      type: 'user',
      text: appState.descriptionText,
      image: appState.imageDataUrl,
      ratio: appState.selectedRatio,
      camera: appState.selectedCamera,
      time: getCurrentTime()
    });
  }
  
  // 添加AI消息
  function addAIMessage(videoUrl) {
    // 克隆AI消息模板
    const aiMessageNode = aiMessageTemplate.content.cloneNode(true);
    
    // 设置消息内容
    aiMessageNode.querySelector('.message-text').textContent = `已生成视频，按照${appState.selectedRatio}比例和${appState.selectedCamera}运镜方式展示。`;
    
    // 设置视频
    const videoElement = aiMessageNode.querySelector('.response-video');
    videoElement.src = videoUrl;
    videoElement.poster = appState.imageDataUrl;
    
    // 设置消息时间
    aiMessageNode.querySelector('.message-time').textContent = getCurrentTime();
    
    // 设置操作按钮事件
    const downloadBtn = aiMessageNode.querySelector('.download-btn');
    const shareBtn = aiMessageNode.querySelector('.share-btn');
    const regenerateBtn = aiMessageNode.querySelector('.regenerate-btn');
    
    // 下载按钮事件
    downloadBtn.addEventListener('click', function() {
      alert('下载功能待实现');
    });
    
    // 分享按钮事件
    shareBtn.addEventListener('click', function() {
      alert('分享功能待实现');
    });
    
    // 重新生成按钮事件
    regenerateBtn.addEventListener('click', function() {
      // 打开创作面板，保留当前参数
      openCreativePanel();
      
      // 恢复之前的参数
      if (appState.imageDataUrl) {
        referenceImage.src = appState.imageDataUrl;
        referencePreview.classList.remove('hidden');
        uploadImageBtn.classList.add('hidden');
      }
      
      // 设置相同的比例和运镜方式
      setActiveRatio(appState.selectedRatio);
      setActiveCamera(appState.selectedCamera);
    });
    
    // 将消息添加到对话流
    chatContainer.appendChild(aiMessageNode);
    
    // 滚动到底部
    scrollToBottom();
    
    // 保存消息到历史记录
    saveMessage({
      type: 'ai',
      text: `已生成视频，按照${appState.selectedRatio}比例和${appState.selectedCamera}运镜方式展示。`,
      video: videoUrl,
      poster: appState.imageDataUrl,
      time: getCurrentTime()
    });
  }
  
  // 开始生成视频
  function startGeneration() {
    // 更新状态
    appState.isGenerating = true;
    appState.generationCount++;
    
    // 显示进度浮层
    progressOverlay.classList.remove('hidden');
    
    // 重置进度环
    const circumference = 2 * Math.PI * 54;
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;
    progressPercentage.textContent = '0%';
    
    // 模拟生成进度
    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      const dashoffset = circumference - (progress / 100) * circumference;
      progressRing.style.strokeDashoffset = dashoffset;
      progressPercentage.textContent = `${progress}%`;
      
      // 更新剩余时间
      const remaining = Math.round(60 * (100 - progress) / 100);
      remainingTime.textContent = `${remaining}秒`;
      
      if (progress >= 100) {
        clearInterval(interval);
        completeGeneration();
      }
    }, 200);
  }
  
  // 完成生成
  function completeGeneration() {
    // 更新状态
    appState.isGenerating = false;
    
    // 隐藏进度浮层
    progressOverlay.classList.add('hidden');
    
    // 由于无法生成真实视频，使用模拟视频URL
    // 这里可以替换为真实的视频生成API
    const mockVideoUrl = appState.imageDataUrl; // 使用图片作为假视频
    
    // 添加AI消息
    addAIMessage(mockVideoUrl);
    
    // 重置参考图
    removeReferenceImage();
  }
  
  // 渲染历史消息
  function renderMessages(messages) {
    messages.forEach(message => {
      if (message.type === 'user') {
        // 恢复用户消息
        const userMessageNode = userMessageTemplate.content.cloneNode(true);
        userMessageNode.querySelector('.message-text').textContent = message.text;
        userMessageNode.querySelector('.reference-image').src = message.image;
        userMessageNode.querySelector('.message-time').textContent = message.time;
        
        const tagsContainer = userMessageNode.querySelector('.message-tags');
        tagsContainer.innerHTML = `
          <span class="tag">#${message.ratio}</span>
          <span class="tag">#${message.camera}</span>
        `;
        
        chatContainer.appendChild(userMessageNode);
      } else if (message.type === 'ai') {
        // 恢复AI消息
        const aiMessageNode = aiMessageTemplate.content.cloneNode(true);
        aiMessageNode.querySelector('.message-text').textContent = message.text;
        
        const videoElement = aiMessageNode.querySelector('.response-video');
        videoElement.src = message.video;
        videoElement.poster = message.poster;
        
        aiMessageNode.querySelector('.message-time').textContent = message.time;
        
        // 设置操作按钮事件
        aiMessageNode.querySelector('.download-btn').addEventListener('click', function() {
          alert('下载功能待实现');
        });
        
        aiMessageNode.querySelector('.share-btn').addEventListener('click', function() {
          alert('分享功能待实现');
        });
        
        aiMessageNode.querySelector('.regenerate-btn').addEventListener('click', function() {
          openCreativePanel();
        });
        
        chatContainer.appendChild(aiMessageNode);
      }
    });
    
    // 滚动到底部
    scrollToBottom();
  }
  
  // 保存消息到历史记录
  function saveMessage(message) {
    try {
      let messages = [];
      const storedMessages = localStorage.getItem('videoMessages');
      
      if (storedMessages) {
        messages = JSON.parse(storedMessages);
      }
      
      messages.push(message);
      
      // 限制历史记录长度
      if (messages.length > 20) {
        messages = messages.slice(-20);
      }
      
      localStorage.setItem('videoMessages', JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving message to localStorage', e);
    }
  }
  
  // 获取当前时间
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // 滚动到底部
  function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // 初始化应用
  init();
}); 