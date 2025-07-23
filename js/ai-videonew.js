document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const chatContainer = document.getElementById('chatContainer');
  const fullscreenContainer = document.getElementById('fullscreenContainer');
  const fullscreenVideo = document.getElementById('fullscreenVideo');
  const closeFullscreenBtn = document.getElementById('closeFullscreen');
  const fullscreenVideoContainer = document.getElementById('fullscreenVideoContainer');
  
  // 底部输入框相关
  const bottomInput = document.querySelector('.bottom-input');
  const textInput = document.getElementById('textInput');
  const createBtn = document.getElementById('createBtn');

  // 创作面板相关
  const startCreateBtn = document.getElementById('startCreateBtn');
  const userMessageTemplate = document.getElementById('userMessageTemplate');
  const aiMessageTemplate = document.getElementById('aiMessageTemplate');
  
  // 应用状态
  let appState = {
    generationCount: 0,
    isGenerating: false,
    messages: [], // 用于存储历史消息
    activeVideo: null // 当前激活的视频
  };
  
  // 应用设置
  const appSettings = {
    aspectRatio: '9:16', // 默认视频比例
    maxVideoHeight: '50vh' // 默认视频最大高度
  };

  /**
   * 初始化应用
   */
  function init() {
    // 保存欢迎消息和预设图片区域
    const welcomeSection = document.querySelector('.welcome-section') || document.querySelector('.welcome-message');
    const presetImagesSection = document.querySelector('.preset-images-section');
    
    // 只有在没有预设图片的情况下才清空容器
    if (chatContainer && !presetImagesSection) {
      if (welcomeSection) {
        chatContainer.innerHTML = '';
        chatContainer.appendChild(welcomeSection);
      }
    }
    
    // 初始化事件监听器
    setupEventListeners();
    
    // 初始化创作面板
    if (typeof initCreativePanel === 'function') {
      initCreativePanel();
    }
  }

  /**
   * 设置事件监听器
   */
  function setupEventListeners() {
    // 开始创建按钮点击事件
    if (startCreateBtn) {
      startCreateBtn.addEventListener('click', function() {
        openCreativePanelFromButton();
      });
    }
    
    // 底部输入区点击事件
    const composer = document.getElementById('composer');
    const inputFieldContainer = document.getElementById('inputFieldContainer');
    const addBtn = document.getElementById('addBtn');
    
    if (composer && inputFieldContainer) {
      // 输入框点击事件
      inputFieldContainer.addEventListener('click', function(e) {
        // 如果点击的是输入框容器本身（不是其中的按钮），打开创作面板
        if (e.target === this || e.target === composer) {
          // 获取底部输入栏元素
          const smartInputBar = document.getElementById('smartInputBar');
          
          // 先隐藏底部输入栏
          if (smartInputBar) {
            smartInputBar.style.display = 'none';
          }
          
          // 隐藏预设图片区域
          const presetImagesSection = document.querySelector('.preset-images-section');
          if (presetImagesSection) {
            presetImagesSection.style.display = 'none';
          }
          
          // 然后打开创作面板
          openCreativePanelFromButton();
        }
      });
      
      // 输入框聚焦事件
      composer.addEventListener('focus', function() {
        // 获取底部输入栏元素
        const smartInputBar = document.getElementById('smartInputBar');
        
        // 先隐藏底部输入栏
        if (smartInputBar) {
          smartInputBar.style.display = 'none';
        }
        
        // 隐藏预设图片区域
        const presetImagesSection = document.querySelector('.preset-images-section');
        if (presetImagesSection) {
          presetImagesSection.style.display = 'none';
        }
        
        // 然后打开创作面板
        openCreativePanelFromButton();
      });
    }
    
    // 加号按钮点击事件
    if (addBtn) {
      addBtn.addEventListener('click', function() {
        // 获取底部输入栏元素
        const smartInputBar = document.getElementById('smartInputBar');
        
        // 先隐藏底部输入栏
        if (smartInputBar) {
          smartInputBar.style.display = 'none';
        }
        
        // 隐藏预设图片区域
        const presetImagesSection = document.querySelector('.preset-images-section');
        if (presetImagesSection) {
          presetImagesSection.style.display = 'none';
        }
        
        // 然后打开创作面板
        openCreativePanelFromButton();
      });
    }
    
    // 监听创作面板关闭事件
    document.addEventListener('panel:closed', handlePanelClosed);
    
    // 监听创作面板生成事件
    document.addEventListener('panel:generate', handlePanelGenerate);
    
    // 监听视频点击事件，实现全屏播放
    document.addEventListener('click', function(event) {
      if (event.target.tagName === 'VIDEO') {
        openFullscreenVideo(event.target);
      }
    });
    
    // 关闭全屏按钮
    if (closeFullscreenBtn) {
      closeFullscreenBtn.addEventListener('click', closeFullscreenVideo);
    }
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', handleOrientationChange);
  }

  /**
   * 从按钮打开创作面板
   */
  function openCreativePanelFromButton() {
    if (typeof openCreativePanel === 'function') {
      // 隐藏底部输入框
      if (bottomInput) {
        bottomInput.classList.add('slide-down');
        setTimeout(() => {
          bottomInput.classList.add('hidden');
        }, 300);
      }
      
      openCreativePanel();
    }
  }

  /**
   * 从输入框打开创作面板
   * @param {string} inputText - 输入文本
   */
  function openCreativePanelFromInput(inputText) {
    if (typeof openCreativePanel === 'function') {
      // 隐藏底部输入框
      if (bottomInput) {
        bottomInput.classList.add('slide-down');
        setTimeout(() => {
          bottomInput.classList.add('hidden');
        }, 300);
      }
      
      openCreativePanel(inputText);
      
      // 清空输入框
      textInput.value = '';
    }
  }

  // 显示底部输入栏
  function showSmartInputBar() {
    const smartInputBar = document.getElementById('smartInputBar');
    if (smartInputBar) {
      smartInputBar.style.display = '';
    }
  }

  // 隐藏底部输入栏
  function hideSmartInputBar() {
    const smartInputBar = document.getElementById('smartInputBar');
    smartInputBar.classList.add('hidden');
    // 等待动画完成后再隐藏
    setTimeout(() => {
      smartInputBar.style.display = 'none';
    }, 300);
  }
  
  // 处理打开创作面板事件
  function handleOpenCreativePanel() {
    // 隐藏底部输入栏
    hideSmartInputBar();
    
    // 通过创作面板模块打开面板
    if (window.CreativePanel) {
      window.CreativePanel.open('');
    }
  }
  
  // 处理面板关闭事件
  function handlePanelClosed(event) {
    // 显示底部输入栏
    showSmartInputBar();
    
    // 检查是否已有生成内容
    const hasGeneratedContent = document.querySelector('.message-container');
    
    // 如果没有生成内容，恢复显示预设图片区域
    if (!hasGeneratedContent) {
      const presetImagesSection = document.querySelector('.preset-images-section');
      if (presetImagesSection) {
        presetImagesSection.style.display = 'block';
      }
    }
    
    // 如果有event.detail并且包含textInput，可以处理用户输入的文本
    if (event.detail && event.detail.textInput) {
      // 这里可以处理用户输入的文本
      const composer = document.getElementById('composer');
      if (composer) {
        composer.value = event.detail.textInput || '';
      }
    }
  }
  
  // 处理面板生成事件
  function handlePanelGenerate(event) {
    if (!event.detail) return;
    
    // 获取创作数据
    const data = event.detail;
    
    // 清空输入框
    if (composer) {
      composer.value = '';
    }
    
    // 获取欢迎信息和预设图片区域
    const welcomeMessage = document.querySelector('.welcome-message');
    const presetImagesSection = document.querySelector('.preset-images-section');
    
    // 隐藏预设图片区域（如果存在）
    if (presetImagesSection) {
      presetImagesSection.style.display = 'none';
    }
    
    // 如果存在欢迎信息且是第一次创作
    if (welcomeMessage && !presetImagesSection) {
      welcomeMessage.remove();
    } else if (welcomeMessage) {
      // 如果同时存在欢迎信息，隐藏欢迎信息
      welcomeMessage.style.display = 'none';
    }
    
    // 先添加用户消息到对话流
    addUserMessage(data);
    
    // 然后开始显示生成进度
    startGeneration(data);
    
    // 不要在这里显示底部输入栏，等生成完成后再显示
  }
  
  // 添加用户消息
  function addUserMessage(data) {
    // 克隆用户消息模板
    const userMessageNode = userMessageTemplate.content.cloneNode(true);
    
    // 设置消息内容
    userMessageNode.querySelector('.message-text').textContent = data.description || "生成视频";
    
    // 设置首帧图片
    if (data.firstFrameUrl) {
      userMessageNode.querySelector('.reference-image').src = data.firstFrameUrl;
    } else if (data.imageDataUrl) {
      // 兼容旧代码
    userMessageNode.querySelector('.reference-image').src = data.imageDataUrl;
    }
    
    // 设置消息时间
    userMessageNode.querySelector('.message-time').textContent = getCurrentTime();
    
    // 添加标签
    const ratioTag = userMessageNode.querySelector('.ratio-tag');
    const cameraTag = userMessageNode.querySelector('.camera-tag');
    const durationTag = userMessageNode.querySelector('.duration-tag');
    
    ratioTag.textContent = data.selectedRatio || '9:16';
    cameraTag.textContent = data.selectedCamera || '环绕';
    durationTag.textContent = data.selectedDuration || '5s';
    
    // 如果有尾帧，添加尾帧标签
    if (data.hasLastFrame && data.lastFrameUrl) {
    const tagsContainer = userMessageNode.querySelector('.message-tags');
      const lastFrameTag = document.createElement('span');
      lastFrameTag.className = 'tag last-frame-tag';
      lastFrameTag.textContent = '双帧模式';
      tagsContainer.appendChild(lastFrameTag);
    }
    
    // 将消息添加到对话流的底部
    chatContainer.appendChild(userMessageNode);
    
    // 滚动到底部
    scrollToBottom();
    
    // 保存消息到内存中
    saveMessage({
      type: 'user',
      text: data.description || "生成视频",
      firstFrame: data.firstFrameUrl || data.imageDataUrl,
      lastFrame: data.lastFrameUrl,
      hasLastFrame: data.hasLastFrame,
      ratio: data.selectedRatio || '9:16',
      camera: data.selectedCamera || '环绕',
      duration: data.selectedDuration || '5s',
      time: getCurrentTime()
    });
  }
  
  // 开始生成视频
  function startGeneration(data) {
    // 更新状态
    appState.isGenerating = true;
    appState.generationCount++;
    
    // 显示进度浮层
    showGenerationProgress();
    
    // 重置进度环
    const progressRing = document.querySelector('.progress-ring-circle');
    const progressPercentage = document.querySelector('.progress-percentage');
    const remainingTime = document.getElementById('remainingTime');
    
    if (!progressRing || !progressPercentage || !remainingTime) {
      console.error('进度元素未找到');
      return;
    }
    
    const circumference = 2 * Math.PI * 27; // 圆环周长
    progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
    progressRing.style.strokeDashoffset = `${circumference}`;
    progressPercentage.textContent = '0%';
    
    // 模拟生成进度
    let progress = 0;
    const totalTime = 5000; // 总时间5秒
    const interval = 100; // 更新间隔100毫秒
    const steps = totalTime / interval;
    const increment = 100 / steps;
    
    const progressInterval = setInterval(() => {
      progress += increment;
      
      if (progress > 100) progress = 100;
      
      const dashoffset = circumference - (progress / 100) * circumference;
      progressRing.style.strokeDashoffset = dashoffset;
      progressPercentage.textContent = `${Math.round(progress)}%`;
      
      // 更新剩余时间
      const remaining = Math.round((100 - progress) * totalTime / 100 / 1000);
      remainingTime.textContent = `${remaining}秒`;
      
      if (progress >= 100) {
        clearInterval(progressInterval);
        setTimeout(() => {
        completeGeneration(data);
        }, 500); // 完成后等待500毫秒再隐藏进度条
      }
    }, interval);
  }
  
  // 完成生成
  function completeGeneration(data) {
    // 更新状态
    appState.isGenerating = false;
    
    // 隐藏进度浮层
    hideGenerationProgress();
    
    // 由于无法生成真实视频，使用模拟视频URL
    // 这里可以替换为真实的视频生成API
    const mockVideoUrl = data.imageDataUrl; // 使用图片作为假视频
    
    // 添加AI消息
    addAIMessage(mockVideoUrl, data);
    
    // 等待进度浮层隐藏动画完成后再显示底部输入栏
    setTimeout(() => {
      // 确保底部输入栏可见，方便用户继续创作
      showSmartInputBar();
      
      // 确保底部输入框完全可见
      if (bottomInput) {
        bottomInput.classList.remove('hidden');
        bottomInput.classList.remove('slide-down');
        bottomInput.style.display = '';
      }
      
      // 确保预设图片区域保持隐藏
      const presetImagesSection = document.querySelector('.preset-images-section');
      if (presetImagesSection) {
        presetImagesSection.style.display = 'none';
      }
    }, 300);
  }
  
  // 添加AI消息
  function addAIMessage(videoUrl, data) {
    // 克隆AI消息模板
    const aiMessageNode = aiMessageTemplate.content.cloneNode(true);
    
    // 设置视频
    const videoElement = aiMessageNode.querySelector('.response-video');
    videoElement.src = videoUrl;
    videoElement.poster = data.imageDataUrl;
    
    // 确保视频容器有正确的比例
    const videoContainer = aiMessageNode.querySelector('.video-container');
    videoContainer.style.aspectRatio = '9/16';
    
    // 添加视频点击事件 - 修改为打开全屏视频
    videoContainer.addEventListener('click', function() {
      openFullscreenVideo(videoUrl);
    });
    
    // 设置操作按钮事件
    const editBtn = aiMessageNode.querySelector('.edit-btn');
    const regenerateBtn = aiMessageNode.querySelector('.regenerate-btn');
    
    editBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡，避免触发视频点击事件
      reopenCreativePanel(data);
    });
    
    regenerateBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡，避免触发视频点击事件
      regenerateVideo(data);
    });
    
    // 将AI消息添加到对话流的底部
    chatContainer.appendChild(aiMessageNode);
    
    // 滚动到底部
    scrollToBottom();
    
    // 保存消息到内存中
    saveMessage({
      type: 'ai',
      video: videoUrl,
      poster: data.imageDataUrl,
      ratio: data.selectedRatio || '9:16',
      camera: data.selectedCamera || '环绕',
      duration: data.selectedDuration || '5s'
    });
  }
  
  // 下载视频功能
  function downloadVideo(videoUrl) {
    // 创建一个临时链接
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `video_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  // 重新打开创作面板
  function reopenCreativePanel(data) {
    // 隐藏底部输入栏
    hideSmartInputBar();
    
    // 通过创作面板模块打开面板
    if (window.CreativePanel) {
      window.CreativePanel.open(data.description || '');
      
      // 预填充之前的设置
      setTimeout(() => {
        // 设置首帧图片
        if (data.firstFrameUrl) {
          displayFrame('first', data.firstFrameUrl);
        } else if (data.imageDataUrl) {
          // 兼容旧代码
          displayFrame('first', data.imageDataUrl);
        }
        
        // 设置尾帧图片（如果有）
        if (data.hasLastFrame && data.lastFrameUrl) {
          displayFrame('last', data.lastFrameUrl);
        }
        
        // 设置比例
        if (data.selectedRatio) {
          const ratioOptions = document.querySelectorAll('.ratio-btn');
          ratioOptions.forEach(option => {
            if (option.textContent.trim() === data.selectedRatio) {
              option.click();
            }
          });
        }
        
        // 设置运镜方式
        if (data.selectedCamera) {
          const cameraOptions = document.querySelectorAll('.camera-options .option-tag');
          cameraOptions.forEach(option => {
            if (option.textContent === data.selectedCamera) {
              option.click();
            }
          });
        }
        
        // 设置时长
        if (data.selectedDuration) {
          const durationOptions = document.querySelectorAll('.duration-options .option-tag');
          durationOptions.forEach(option => {
            if (option.textContent === data.selectedDuration) {
              option.click();
            }
          });
        }
      }, 500);
    }
  }
  
  // 重新生成视频
  function regenerateVideo(data) {
    // 直接使用相同参数开始生成
    startGeneration(data);
  }
  
  // 渲染消息（仅用于当前会话，不再从localStorage加载）
  function renderMessages(messages) {
    // 如果不是当前会话的消息，则不显示
    if (!messages || messages !== appState.messages) {
      return;
    }
    
    // 清空聊天容器
    while (chatContainer.firstChild) {
      chatContainer.removeChild(chatContainer.firstChild);
    }
    
    // 按时间顺序渲染消息（从上到下）
    if (messages.length > 0) {
      // 创建消息对的数组，每对包含一个用户消息和对应的AI消息
      const messagePairs = [];
      let currentPair = { user: null, ai: null };
      
      for (let i = 0; i < messages.length; i++) {
        const message = messages[i];
        
        if (message.type === 'user') {
          // 如果当前对已有用户消息，创建新的对
          if (currentPair.user !== null) {
            messagePairs.push({ ...currentPair });
            currentPair = { user: message, ai: null };
          } else {
            currentPair.user = message;
          }
        } else if (message.type === 'ai') {
          // 如果已有用户消息，将AI消息添加到当前对
          if (currentPair.user !== null) {
            currentPair.ai = message;
            messagePairs.push({ ...currentPair });
            currentPair = { user: null, ai: null };
          }
        }
      }
      
      // 处理可能剩余的不完整对
      if (currentPair.user !== null) {
        messagePairs.push(currentPair);
      }
      
      // 按顺序渲染每对消息
      messagePairs.forEach(pair => {
        if (pair.user) {
          renderUserMessage(pair.user);
        }
        
        if (pair.ai) {
          renderAIMessage(pair.ai, pair.user);
      }
    });
    
    // 滚动到底部
    scrollToBottom();
    }
  }

  // 渲染用户消息
  function renderUserMessage(userMessage) {
    // 创建用户消息元素
    const userMessageNode = userMessageTemplate.content.cloneNode(true);
    
    // 设置消息内容
    userMessageNode.querySelector('.message-text').textContent = userMessage.text;
    
    // 设置首帧图片
    if (userMessage.firstFrame) {
      userMessageNode.querySelector('.reference-image').src = userMessage.firstFrame;
    } else if (userMessage.image) {
      // 兼容旧数据
      userMessageNode.querySelector('.reference-image').src = userMessage.image;
    } else {
      userMessageNode.querySelector('.reference-image-container').style.display = 'none';
    }
    
    // 设置消息时间
    userMessageNode.querySelector('.message-time').textContent = userMessage.time;
    
    // 添加标签
    const ratioTag = userMessageNode.querySelector('.ratio-tag');
    const cameraTag = userMessageNode.querySelector('.camera-tag');
    const durationTag = userMessageNode.querySelector('.duration-tag');
    
    ratioTag.textContent = userMessage.ratio || '9:16';
    cameraTag.textContent = userMessage.camera || '环绕';
    durationTag.textContent = userMessage.duration || '5s';
    
    // 如果有尾帧，添加尾帧标签
    if (userMessage.hasLastFrame && userMessage.lastFrame) {
      const tagsContainer = userMessageNode.querySelector('.message-tags');
      const lastFrameTag = document.createElement('span');
      lastFrameTag.className = 'tag last-frame-tag';
      lastFrameTag.textContent = '双帧模式';
      tagsContainer.appendChild(lastFrameTag);
    }
    
    // 将用户消息添加到对话流
    chatContainer.appendChild(userMessageNode);
  }

  // 渲染AI消息
  function renderAIMessage(aiMessage, userMessage) {
    // 创建AI消息元素
    const aiMessageNode = aiMessageTemplate.content.cloneNode(true);
    
    // 设置视频
    const videoElement = aiMessageNode.querySelector('.response-video');
    videoElement.src = aiMessage.video;
    if (aiMessage.poster) {
      videoElement.poster = aiMessage.poster;
    } else if (userMessage && userMessage.firstFrame) {
      // 如果没有海报，使用首帧作为海报
      videoElement.poster = userMessage.firstFrame;
    }
    
    // 确保视频容器有正确的比例
    const videoContainer = aiMessageNode.querySelector('.video-container');
    videoContainer.style.aspectRatio = '9/16';
    
    // 添加视频点击事件 - 修改为打开全屏视频
    videoContainer.addEventListener('click', function() {
      openFullscreenVideo(aiMessage.video);
    });
    
    // 设置操作按钮事件
    const editBtn = aiMessageNode.querySelector('.edit-btn');
    const regenerateBtn = aiMessageNode.querySelector('.regenerate-btn');
    
    editBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      reopenCreativePanel({
        description: aiMessage.text || '',
        imageDataUrl: aiMessage.poster,
        selectedRatio: aiMessage.ratio || '9:16',
        selectedCamera: aiMessage.camera || '环绕',
        selectedDuration: aiMessage.duration || '5s'
      });
    });
    
    regenerateBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      regenerateVideo({
        description: aiMessage.text || '',
        imageDataUrl: aiMessage.poster,
        selectedRatio: aiMessage.ratio || '9:16',
        selectedCamera: aiMessage.camera || '环绕',
        selectedDuration: aiMessage.duration || '5s'
      });
    });
    
    // 将AI消息添加到对话流
    chatContainer.appendChild(aiMessageNode);
  }
  
  // 保存消息到内存中（不再使用localStorage）
  function saveMessage(message) {
    // 这里我们不再将消息保存到localStorage
    // 如果需要在会话中保存消息，可以使用内存变量
    if (!appState.messages) {
      appState.messages = [];
    }
    appState.messages.push(message);
  }
  
  // 获取当前时间
  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }
  
  // 处理设备方向变化
  function handleOrientationChange() {
    // 如果当前有全屏视频，调整其布局
    if (fullscreenVideoContainer.classList.contains('active')) {
      // 给浏览器一点时间来完成旋转
      setTimeout(() => {
        // 重新计算视频尺寸和位置
        const videoAspect = 9/16;
        const windowAspect = window.innerWidth / window.innerHeight;
        
        if (windowAspect > videoAspect) {
          // 窗口更宽，视频高度受限
          fullscreenVideo.style.width = 'auto';
          fullscreenVideo.style.height = '100%';
        } else {
          // 窗口更高，视频宽度受限
          fullscreenVideo.style.width = '100%';
          fullscreenVideo.style.height = 'auto';
        }
      }, 300);
    }
  }
  
  // 打开全屏视频
  function openFullscreenVideo(videoSrc) {
    // 设置视频源
    fullscreenVideo.src = videoSrc;
    
    // 显示全屏容器
    fullscreenVideoContainer.classList.add('active');
    
    // 播放视频
    fullscreenVideo.play().catch(error => {
      console.log('自动播放失败:', error);
      // 在某些浏览器中，如果用户未与页面交互，自动播放可能会失败
    });
    
    // 禁止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 在iOS上特别处理
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      fullscreenVideo.setAttribute('playsinline', '');
    }
    
    // 设置全屏保存按钮事件
    const fullscreenSaveBtn = document.getElementById('fullscreenSaveBtn');
    if (fullscreenSaveBtn) {
      // 移除旧的事件监听器，避免重复绑定
      fullscreenSaveBtn.removeEventListener('click', handleFullscreenSave);
      
      // 添加新的事件监听器
      fullscreenSaveBtn.addEventListener('click', handleFullscreenSave);
    }
    
    // 添加控制区域显示/隐藏的交互
    setupFullscreenControls();
  }

  // 处理全屏保存按钮点击
  function handleFullscreenSave() {
    // 获取当前播放的视频源
    const videoSrc = fullscreenVideo.src;
    
    // 调用下载函数
    if (videoSrc) {
      downloadVideo(videoSrc);
    }
  }

  // 设置全屏控制区域的显示/隐藏
  function setupFullscreenControls() {
    const topControls = document.querySelector('.fullscreen-top-controls');
    const bottomControls = document.querySelector('.fullscreen-bottom-controls');
    const container = fullscreenVideoContainer;
    
    let timeout;
    
    // 初始显示控制区
    showControls();
    
    // 移动时显示控制区
    container.addEventListener('mousemove', function() {
      showControls();
    });
    
    // 触摸时显示控制区
    container.addEventListener('touchstart', function() {
      showControls();
    });
    
    // 点击视频时切换控制区显示状态
    fullscreenVideo.addEventListener('click', function(e) {
      e.stopPropagation();
      if (topControls.style.opacity === '0') {
        showControls();
      } else {
        hideControls();
      }
    });
    
    function showControls() {
      // 清除之前的定时器
      clearTimeout(timeout);
      
      // 显示控制区
      if (topControls) topControls.style.opacity = '1';
      if (bottomControls) bottomControls.style.opacity = '1';
      
      // 设置定时器，3秒后自动隐藏
      timeout = setTimeout(hideControls, 3000);
    }
    
    function hideControls() {
      if (topControls) topControls.style.opacity = '0';
      if (bottomControls) bottomControls.style.opacity = '0';
    }
  }

  // 关闭全屏视频
  function closeFullscreenVideo() {
    // 暂停视频
    fullscreenVideo.pause();
    
    // 隐藏全屏容器
    fullscreenVideoContainer.classList.remove('active');
    
    // 允许背景滚动
    document.body.style.overflow = '';
  }
  
  // 辅助函数：显示帧图片
  function displayFrame(frameType, imageUrl) {
    if (frameType === 'first') {
      // 显示首帧
      const firstFramePreview = document.getElementById('firstFramePreview');
      const firstFrameImage = document.getElementById('firstFrameImage');
      if (firstFramePreview && firstFrameImage) {
        firstFrameImage.src = imageUrl;
        firstFramePreview.classList.remove('hidden');
      }
    } else if (frameType === 'last') {
      // 显示尾帧
      const lastFramePreview = document.getElementById('lastFramePreview');
      const lastFrameImage = document.getElementById('lastFrameImage');
      if (lastFramePreview && lastFrameImage) {
        lastFrameImage.src = imageUrl;
        lastFramePreview.classList.remove('hidden');
      }
    }
  }

/**
 * 显示生成进度
 */
function showGenerationProgress() {
  const progressOverlay = document.getElementById('progressOverlay');
  if (progressOverlay) {
    progressOverlay.style.display = 'flex';
    // 使用setTimeout确保CSS过渡效果正常工作
    setTimeout(() => {
      progressOverlay.classList.remove('hidden');
    }, 10);
  }
}

/**
 * 隐藏生成进度
 */
function hideGenerationProgress() {
  const progressOverlay = document.getElementById('progressOverlay');
  if (progressOverlay) {
    progressOverlay.classList.add('hidden');
    // 等待过渡效果完成后隐藏元素
    setTimeout(() => {
      progressOverlay.style.display = 'none';
    }, 300);
  }
}

/**
 * 滚动聊天容器到底部
 */
  function scrollToBottom() {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
  
  // 初始化应用
  init();
}); 