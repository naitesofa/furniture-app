// 功能按钮点击事件
const functionButtons = document.querySelectorAll('.fixed.bottom-16 button');
functionButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const pages = ['ai-assistant-chat.html', 'ai-pricing.html', 'ai-design.html', 'ai-diagnosis.html', 'ai-video.html'];
    if (index < pages.length) {
      window.location.href = pages[index];
    }
    
    // 更新按钮样式
    functionButtons.forEach(btn => {
      btn.classList.remove('text-blue-500');
      btn.classList.add('text-gray-600');
    });
    button.classList.remove('text-gray-600');
    button.classList.add('text-blue-500');
  });
});

// 添加SVG图标按钮样式
document.addEventListener('DOMContentLoaded', function() {
  // 添加样式到head
  const style = document.createElement('style');
  style.textContent = `
    .message-action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: transparent;
      transition: all 0.2s ease;
      opacity: 0.7;
      position: relative;
    }
    
    .message-action-btn:active {
      transform: scale(0.92);
      opacity: 1;
    }
    
    .message-action-btn svg {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;
    }
    
    .message-action-btn:active svg {
      transform: scale(0.9);
    }
    
    /* 按钮点击波纹效果 */
    .message-action-btn:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: rgba(0, 0, 0, 0.1);
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s ease;
    }
    
    .message-action-btn:active:after {
      opacity: 1;
      transform: scale(1);
      transition: 0s;
    }
    
    /* 添加按钮悬停效果 */
    @media (hover: hover) {
      .message-action-btn:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      .message-user .message-action-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }
  `;
  document.head.appendChild(style);
});

// 胶囊按钮功能
document.addEventListener('DOMContentLoaded', () => {
  const featurePills = document.querySelectorAll('.feature-pill');
  
  featurePills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
      const pages = ['ai-pricing.html', 'ai-design.html', 'ai-diagnosis.html', 'ai-image.html'];
      if (index < pages.length) {
        window.location.href = pages[index];
      }
    });
  });
  
  // 支持滚动功能
  const pillsContainer = document.querySelector('.pills-container');
  if (pillsContainer) {
    // 触摸滑动支持
    let startX;
    let scrollLeft;
    
    pillsContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].pageX - pillsContainer.offsetLeft;
      scrollLeft = pillsContainer.scrollLeft;
    }, { passive: true });
    
    pillsContainer.addEventListener('touchmove', (e) => {
      if (!startX) return;
      const x = e.touches[0].pageX - pillsContainer.offsetLeft;
      const walk = (x - startX);
      pillsContainer.scrollLeft = scrollLeft - walk;
    }, { passive: true });
    
    pillsContainer.addEventListener('touchend', () => {
      startX = null;
    });
  }
  
  // 返回按钮点击事件
  const backButton = document.getElementById('backButton');
  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }
  
  // 功能菜单切换
  const menuButton = document.getElementById('menuButton');
  const functionMenu = document.getElementById('functionMenu');
  
  if (menuButton && functionMenu) {
    menuButton.addEventListener('click', () => {
      if (functionMenu.classList.contains('translate-x-full')) {
        functionMenu.classList.remove('translate-x-full');
      } else {
        functionMenu.classList.add('translate-x-full');
      }
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', (e) => {
      if (!menuButton.contains(e.target) && !functionMenu.contains(e.target)) {
        functionMenu.classList.add('translate-x-full');
      }
    });
  }
  
  // 处理热门问题点击事件
  setupHotQuestions();
  
  // 输入框展开功能
  initInputExpansion();
});

// 处理热门问题点击事件
function setupHotQuestions() {
  // 获取所有热门问题容器
  const questionsContainer = document.querySelector('.questions-container');
  const questionsScrollContainer = document.querySelector('.questions-scroll-container');
  const accordionQuestions = document.querySelector('.accordion-questions');
  const questionTabs = document.querySelector('.question-tabs');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const initialContent = document.getElementById('initialContent');
  
  // 原始热门问题
  const hotQuestions = document.querySelectorAll('.hot-question');
  
  // 水平滚动卡片问题
  const questionCards = document.querySelectorAll('.question-card');
  
  // 手风琴问题
  const accordionItems = document.querySelectorAll('.accordion-question');
  
  // 标签式问题
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const tabQuestions = document.querySelectorAll('.tab-content .hot-question');
  
  // 处理原始热门问题点击
  hotQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const questionText = question.querySelector('p').textContent.trim();
      sendMessageToChat(questionText);
      
      // 隐藏热门问题区域
      hideQuestionContainers();
    });
  });
  
  // 处理水平滚动卡片问题点击
  questionCards.forEach(card => {
    card.addEventListener('click', () => {
      const questionText = card.querySelector('p').textContent.trim();
      sendMessageToChat(questionText);
      
      // 隐藏热门问题区域
      hideQuestionContainers();
    });
  });
  
  // 处理手风琴问题点击
  accordionItems.forEach(accordion => {
    const header = accordion.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
      // 切换展开/收起状态
      accordion.classList.toggle('expanded');
      
      // 如果有其他展开的问题，则关闭它们
      accordionItems.forEach(other => {
        if (other !== accordion && other.classList.contains('expanded')) {
          other.classList.remove('expanded');
        }
      });
    });
    
    accordion.addEventListener('click', (e) => {
      // 防止冒泡，避免点击内容区域时触发
      if (!e.target.closest('.accordion-content')) {
        const questionText = accordion.querySelector('h4').textContent.trim();
        sendMessageToChat(questionText);
        
        // 隐藏热门问题区域
        hideQuestionContainers();
      }
    });
  });
  
  // 处理标签切换
  tabButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      // 移除所有标签的激活状态
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      // 隐藏所有标签内容
      tabContents.forEach(content => content.classList.remove('active'));
      
      // 激活当前标签和内容
      button.classList.add('active');
      tabContents[index].classList.add('active');
    });
  });
  
  // 处理标签内问题点击
  tabQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const questionText = question.querySelector('p').textContent.trim();
      sendMessageToChat(questionText);
      
      // 隐藏热门问题区域
      hideQuestionContainers();
    });
  });
  
  // 函数：隐藏所有热门问题容器
  function hideQuestionContainers() {
    if (questionsContainer) questionsContainer.style.display = 'none';
    if (questionsScrollContainer) questionsScrollContainer.style.display = 'none';
    if (accordionQuestions) accordionQuestions.style.display = 'none';
    if (questionTabs) questionTabs.style.display = 'none';
    
    // 隐藏欢迎消息和头像
    if (welcomeMessage) welcomeMessage.style.display = 'none';
    if (initialContent) initialContent.style.display = 'none';
  }
}

// 将消息发送到聊天区域
function sendMessageToChat(text) {
  // 获取聊天容器
  const chatContainer = document.getElementById('chatContainer');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const initialContent = document.getElementById('initialContent');
  if (!chatContainer) return;
  
  // 隐藏欢迎消息和头像
  if (welcomeMessage) welcomeMessage.style.display = 'none';
  if (initialContent) initialContent.style.display = 'none';
  
  // 添加扩展类
  chatContainer.classList.add('expanded');
  
  // 创建用户消息元素
  const userMessage = document.createElement('div');
  userMessage.className = 'message message-user';
  
  const messageParagraph = document.createElement('p');
  messageParagraph.textContent = text;
  userMessage.appendChild(messageParagraph);
  
  // 创建消息底部区域（时间和操作按钮）
  const messageFooter = document.createElement('div');
  messageFooter.className = 'message-footer';
  
  // 添加时间
  const messageTime = document.createElement('div');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();
  messageFooter.appendChild(messageTime);
  
  // 添加消息操作按钮
  const messageActions = document.createElement('div');
  messageActions.className = 'message-actions';
  
  // 复制按钮
  const copyButton = document.createElement('button');
  copyButton.className = 'message-action-btn copy';
  copyButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="2">
    <rect x="8" y="8" width="12" height="12" rx="1"></rect>
    <path d="M16 8V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2"></path>
  </svg>`;
  copyButton.title = '复制';
  copyButton.addEventListener('click', () => {
    copyToClipboard(text);
    showToast('已复制到剪贴板');
  });
  
  // 编辑按钮
  const editButton = document.createElement('button');
  editButton.className = 'message-action-btn edit';
  editButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="2">
    <path d="M17 3a2.85 2.85 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>`;
  editButton.title = '编辑';
  editButton.addEventListener('click', () => {
    editMessageInInputArea(text);
  });
  
  messageActions.appendChild(copyButton);
  messageActions.appendChild(editButton);
  messageFooter.appendChild(messageActions);
  
  // 将底部区域添加到消息元素
  userMessage.appendChild(messageFooter);
  
  // 添加到聊天容器
  chatContainer.appendChild(userMessage);
  
  // 自动滚动到底部
  scrollToBottom(chatContainer);
  
  // 模拟AI响应（可以替换为实际的API调用）
  setTimeout(() => {
    simulateAIResponse(text);
  }, 500);
}

// 复制文本到剪贴板
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).catch(err => {
    console.error('无法复制文本: ', err);
  });
}

// 显示提示消息
function showToast(message) {
  // 检查是否已存在toast元素，如果存在则移除
  const existingToast = document.querySelector('.toast-message');
  if (existingToast) {
    existingToast.remove();
  }
  
  // 创建新的toast元素
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.textContent = message;
  
  // 添加到body
  document.body.appendChild(toast);
  
  // 显示toast
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 3秒后隐藏并移除
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

// 模拟AI响应
function simulateAIResponse(userText) {
  // 获取聊天容器
  const chatContainer = document.getElementById('chatContainer');
  if (!chatContainer) return;
  
  // 创建AI消息元素
  const aiMessage = document.createElement('div');
  aiMessage.className = 'message message-ai';
  
  const messageParagraph = document.createElement('p');
  
  // 根据用户问题生成不同的回复
  let aiResponseText = '';
  
  if (userText.includes('麦吉纳小程序')) {
    aiResponseText = '麦吉纳小程序提供家居设计、智能报价、3D户型规划、AR试家具等功能，让您足不出户就能体验专业家居服务。';
  } else if (userText.includes('装修设计') || userText.includes('流行趋势')) {
    aiResponseText = '2024年流行的装修设计趋势包括自然材质、极简风格、多功能家具、可持续设计和智能家居集成。您想了解哪个方面的更多细节？';
  } else if (userText.includes('核算') || userText.includes('价格')) {
    aiResponseText = '根据您提供的信息，3米长、3+妃位、一个功能位、头层牛皮沙发的价格大约在8000-15000元之间，具体价格取决于品牌、皮质等级和工艺。需要更精准的报价吗？';
  } else if (userText.includes('生图')) {
    aiResponseText = '我已接收到您的图片生成需求，正在为您生成法式风格、白色为主、搭配木质元素的客厅图片，请稍候...';
  } else {
    aiResponseText = '感谢您的问题，我正在为您查找相关信息，请稍等片刻...';
  }
  
  messageParagraph.textContent = aiResponseText;
  aiMessage.appendChild(messageParagraph);
  
  // 创建消息底部区域（时间和操作按钮）
  const messageFooter = document.createElement('div');
  messageFooter.className = 'message-footer';
  
  // 添加时间
  const messageTime = document.createElement('div');
  messageTime.className = 'message-time';
  messageTime.textContent = getCurrentTime();
  messageFooter.appendChild(messageTime);
  
  // 添加消息操作按钮
  const messageActions = document.createElement('div');
  messageActions.className = 'message-actions';
  
  // 复制按钮
  const copyButton = document.createElement('button');
  copyButton.className = 'message-action-btn copy';
  copyButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="2">
    <rect x="8" y="8" width="12" height="12" rx="1"></rect>
    <path d="M16 8V6a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h2"></path>
  </svg>`;
  copyButton.title = '复制';
  copyButton.addEventListener('click', () => {
    copyToClipboard(aiResponseText);
    showToast('复制成功');
  });
  
  // 重新生成按钮
  const regenerateButton = document.createElement('button');
  regenerateButton.className = 'message-action-btn regenerate';
  regenerateButton.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" fill="none" stroke-width="2">
    <path d="M21 12a9 9 0 0 1-9 9"></path>
    <path d="M3 12a9 9 0 0 1 9-9"></path>
    <path d="M12 21a9 9 0 0 0 0-18"></path>
    <polyline points="16 16 21 12 16 8"></polyline>
  </svg>`;
  regenerateButton.title = '重新生成';
  regenerateButton.addEventListener('click', () => {
    // 移除当前AI回复
    aiMessage.remove();
    
    // 显示加载状态
    showToast('正在重新生成回答...');
    
    // 延迟一下，模拟重新生成过程
    setTimeout(() => {
      // 重新生成回复
      simulateAIResponse(userText);
    }, 800);
  });
  
  messageActions.appendChild(copyButton);
  messageActions.appendChild(regenerateButton);
  messageFooter.appendChild(messageActions);
  
  // 将底部区域添加到消息元素
  aiMessage.appendChild(messageFooter);
  
  // 添加到聊天容器
  chatContainer.appendChild(aiMessage);
  
  // 自动滚动到底部
  scrollToBottom(chatContainer);
}

// 滚动到底部
function scrollToBottom(element) {
  // 使用平滑滚动
  element.scrollTo({
    top: element.scrollHeight,
    behavior: 'smooth'
  });
}

// 获取当前时间
function getCurrentTime() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  
  // 补零
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  return hours + ':' + minutes;
}

// 初始化输入框展开功能
function initInputExpansion() {
  const inputContainer = document.querySelector('.input-container');
  const inputField = document.querySelector('.input-text');
  const expandedInput = document.querySelector('.expanded-input');
  const expandedTextarea = document.querySelector('.expanded-textarea');
  const overlay = document.querySelector('.input-overlay');
  const sendBtn = document.querySelector('.send-btn');
  const expandedSendBtn = document.querySelector('.expanded-send-btn');
  const welcomeMessage = document.getElementById('welcomeMessage');
  const initialContent = document.getElementById('initialContent');
  
  // 确保所有需要的元素都存在
  if (!inputContainer || !inputField || !expandedInput || !expandedTextarea) {
    console.error('找不到必要的输入框元素');
    return;
  }
  
  // 点击输入框展开
  inputField.addEventListener('click', expandInput);
  inputField.addEventListener('focus', expandInput);
  
  // 展开输入框函数
  function expandInput(e) {
    // 直接展示扩展输入区
    expandedInput.style.display = 'block';
    inputContainer.classList.add('input-expanded');
    
    // 将原输入框的值复制到扩展输入框
    expandedTextarea.value = inputField.value;
    
    // 强制聚焦，触发键盘弹出
    expandedTextarea.focus();
    
    // 显示遮罩
    if (overlay) {
      overlay.style.opacity = '1';
      overlay.style.pointerEvents = 'auto';
    }
    
    // 隐藏欢迎消息和头像
    if (welcomeMessage) {
      welcomeMessage.style.display = 'none';
    }
    if (initialContent) {
      initialContent.style.display = 'none';
    }
  }
  
  // 收起输入框
  function collapseInput() {
    inputContainer.classList.remove('input-expanded');
    
    // 延迟隐藏扩展输入框，以确保过渡效果完成
    setTimeout(() => {
      expandedInput.style.display = 'none';
    }, 300);
    
    // 将扩展输入框的值复制回原输入框
    inputField.value = expandedTextarea.value;
    
    // 隐藏遮罩
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';
    }
  }
  
  // 点击遮罩层收起输入框
  if (overlay) {
    overlay.addEventListener('click', collapseInput);
  }
  
  // 设置扩展区域的发送按钮
  setupExpandedSendButton();
  
  // 原发送按钮
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      if (inputField.value.trim() !== '') {
        // 发送消息逻辑
        sendMessageToChat(inputField.value);
        inputField.value = '';
      } else {
        // 如果输入框为空，则展开输入框
        expandInput();
      }
    });
  }
  
  // 确保扩展区域中的文本域可以正确获得焦点
  expandedTextarea.addEventListener('click', function() {
    this.focus();
  });
  
  // 监听文本区域的键盘事件
  expandedTextarea.addEventListener('keydown', (e) => {
    // Enter键发送，Shift+Enter换行
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (expandedTextarea.value.trim() !== '') {
        // 发送消息逻辑
        sendMessageToChat(expandedTextarea.value);
        expandedTextarea.value = '';
        collapseInput();
      }
    }
  });
  
  // 监听输入框的输入事件，隐藏欢迎消息和头像
  inputField.addEventListener('input', () => {
    if (inputField.value.trim() !== '') {
      if (welcomeMessage) welcomeMessage.style.display = 'none';
      if (initialContent) initialContent.style.display = 'none';
    }
  });
  
  // 监听扩展文本域的输入事件，隐藏欢迎消息和头像
  expandedTextarea.addEventListener('input', () => {
    if (expandedTextarea.value.trim() !== '') {
      if (welcomeMessage) welcomeMessage.style.display = 'none';
      if (initialContent) initialContent.style.display = 'none';
    }
  });
  
  // 设置扩展区域的发送按钮
  function setupExpandedSendButton() {
    if (expandedSendBtn) {
      expandedSendBtn.addEventListener('click', () => {
        if (expandedTextarea.value.trim() !== '') {
          // 发送消息逻辑
          sendMessageToChat(expandedTextarea.value);
          expandedTextarea.value = '';
          collapseInput();
        }
      });
    }
  }
}

// 在扩展输入区编辑消息
function editMessageInInputArea(text) {
  const inputContainer = document.querySelector('.input-container');
  const expandedInput = document.querySelector('.expanded-input');
  const expandedTextarea = document.querySelector('.expanded-textarea');
  const overlay = document.querySelector('.input-overlay');
  const expandedSendBtn = document.querySelector('.expanded-send-btn');
  
  if (!expandedInput || !expandedTextarea) return;
  
  // 展开输入区
  expandedInput.style.display = 'block';
  inputContainer.classList.add('input-expanded');
  
  // 将要编辑的文本填入扩展输入框
  expandedTextarea.value = text;
  
  // 强制聚焦，触发键盘弹出
  expandedTextarea.focus();
  
  // 显示遮罩
  if (overlay) {
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
  }
  
  // 滚动到文本框位置
  expandedTextarea.scrollIntoView({ behavior: 'smooth' });
  
  // 找到最后一个AI消息
  const chatContainer = document.getElementById('chatContainer');
  if (chatContainer) {
    const messages = chatContainer.querySelectorAll('.message');
    let lastAiMessage = null;
    let lastUserMessage = null;
    
    // 从后向前查找最后一个AI消息和用户消息
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].classList.contains('message-ai') && !lastAiMessage) {
        lastAiMessage = messages[i];
      }
      if (messages[i].classList.contains('message-user') && !lastUserMessage) {
        lastUserMessage = messages[i];
      }
      if (lastAiMessage && lastUserMessage) break;
    }
    
    // 如果找到了消息，在用户提交修改后删除它们
    if (lastAiMessage || lastUserMessage) {
      // 临时保存原始发送按钮
      if (expandedSendBtn) {
        // 创建新的发送按钮事件
        const handleEditSend = () => {
          if (expandedTextarea.value.trim() !== '') {
            // 删除上一个用户消息和AI回复
            if (lastUserMessage) lastUserMessage.remove();
            if (lastAiMessage) lastAiMessage.remove();
            
            // 发送修改后的消息
            sendMessageToChat(expandedTextarea.value);
            expandedTextarea.value = '';
            
            // 收起输入框
            inputContainer.classList.remove('input-expanded');
            setTimeout(() => {
              expandedInput.style.display = 'none';
            }, 300);
            
            // 隐藏遮罩
            if (overlay) {
              overlay.style.opacity = '0';
              overlay.style.pointerEvents = 'none';
            }
            
            // 恢复原始事件监听器
            expandedSendBtn.removeEventListener('click', handleEditSend);
            setupNormalSendButton();
          }
        };
        
        // 移除原有的事件监听器
        const newExpandedSendBtn = expandedSendBtn.cloneNode(true);
        expandedSendBtn.parentNode.replaceChild(newExpandedSendBtn, expandedSendBtn);
        
        // 添加编辑模式的事件监听器
        newExpandedSendBtn.addEventListener('click', handleEditSend);
        
        // 更新引用
        expandedSendBtn = newExpandedSendBtn;
        
        // 监听键盘事件，支持Enter键发送
        expandedTextarea.addEventListener('keydown', function onKeyDown(e) {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEditSend();
            expandedTextarea.removeEventListener('keydown', onKeyDown);
          }
        });
      }
    }
  }
  
  // 设置正常的发送按钮行为
  function setupNormalSendButton() {
    const newSendBtn = document.querySelector('.expanded-send-btn');
    if (newSendBtn) {
      newSendBtn.addEventListener('click', () => {
        if (expandedTextarea.value.trim() !== '') {
          sendMessageToChat(expandedTextarea.value);
          expandedTextarea.value = '';
          
          inputContainer.classList.remove('input-expanded');
          setTimeout(() => {
            expandedInput.style.display = 'none';
          }, 300);
          
          if (overlay) {
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';
          }
        }
      });
    }
  }
} 