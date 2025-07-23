// 添加设置菜单和最近对话功能的JavaScript代码
document.addEventListener('DOMContentLoaded', function() {
  // 菜单相关元素
  const menuButton = document.getElementById('menuButton');
  const closeMenuButton = document.getElementById('closeMenuButton');
  const functionMenu = document.getElementById('functionMenu');
  const menuOverlay = document.getElementById('menuOverlay');
  const settingsMenuItem = document.getElementById('settingsMenuItem');
  const closeSettingsButton = document.getElementById('closeSettingsButton');
  const settingsPage = document.getElementById('settingsPage');
  
  // 智能输入栏相关元素
  const composer = document.getElementById('composer');
  const uploadBtn = document.getElementById('uploadBtn');
  const sendBtn = document.getElementById('sendBtn');
  const typeToggleBtn = document.getElementById('typeToggleBtn');
  const pillsContainer = document.getElementById('pillsContainer');
  const bottomSheet = document.getElementById('bottomSheet');
  const closeSheetBtn = document.getElementById('closeSheetBtn');
  const smartInputBar = document.getElementById('smartInputBar');
  
  // 沉浸式创作模式相关元素
  const creativePanel = document.getElementById('creativePanel');
  const closeCreativeBtn = document.getElementById('closeCreativeBtn');
  const creativeTextarea = document.getElementById('creativeTextarea');
  const referenceUpload = document.getElementById('referenceUpload');
  const referencePreview = document.getElementById('referencePreview');
  const referenceImage = document.getElementById('referenceImage');
  const generateBtn = document.getElementById('generateBtn');
  const styleOptions = document.getElementById('styleOptions');
  const roomBtns = document.querySelectorAll('.room-btn');
  
  // 当前选中的风格和房间类型
  let currentStyle = '';
  let currentRoom = '风格';
  
  // 菜单开关功能
  if (menuButton) {
    menuButton.addEventListener('click', function() {
      functionMenu.classList.remove('translate-x-full');
      menuOverlay.classList.remove('hidden');
      setTimeout(() => {
        menuOverlay.classList.add('opacity-100');
      }, 10);
      document.body.style.overflow = 'hidden'; // 防止背景滚动
    });
  }
  
  function closeMenu() {
    menuOverlay.classList.remove('opacity-100');
    setTimeout(() => {
      functionMenu.classList.add('translate-x-full');
      menuOverlay.classList.add('hidden');
      document.body.style.overflow = ''; // 恢复滚动
    }, 300);
  }
  
  if (closeMenuButton) {
    closeMenuButton.addEventListener('click', closeMenu);
  }
  
  if (menuOverlay) {
    menuOverlay.addEventListener('click', closeMenu);
  }
  
  // 设置菜单项点击事件
  if (settingsMenuItem) {
    settingsMenuItem.addEventListener('click', function(e) {
      e.preventDefault();
      // 关闭菜单
      closeMenu();
      // 显示设置页面
      if (settingsPage) {
        settingsPage.classList.remove('translate-y-full');
      }
    });
  }
  
  // 关闭设置按钮点击事件
  if (closeSettingsButton) {
    closeSettingsButton.addEventListener('click', function() {
      if (settingsPage) {
        settingsPage.classList.add('translate-y-full');
      }
    });
  }
  
  // 底部抽屉功能
  // 参数选择相关功能
  const paramTypes = {
    'style': ['现代简约', '北欧风格', '美式', '中式', '法式', '日式', '工业风', '地中海', '混搭'],
    'room': ['客厅', '卧室', '厨房', '餐厅', '书房', '卫生间', '阳台', '儿童房', '玄关'],
    'type': ['毛坯房设计', '旧屋改造', '新房软装']
  };
  
  // 参数类型对应的中文名称
  const paramTypeLabels = {
    'style': '风格',
    'room': '房间',
    'type': '类型'
  };
  
  // 添加快捷参数按钮
  function addQuickParamButtons() {
    // 在这里可以添加快捷参数按钮的代码
    // 例如在输入框下方显示常用的风格、房间类型等
  }
  
  // 打开底部抽屉函数
  function openBottomSheet(type, title) {
    if (!bottomSheet) return;
    
    const sheetTitle = document.getElementById('sheetTitle');
    const sheetOptions = document.getElementById('sheetOptions');
    
    if (sheetTitle) {
      sheetTitle.textContent = title || `选择${paramTypeLabels[type] || '选项'}`;
    }
    
    if (sheetOptions) {
      // 清空现有选项
      sheetOptions.innerHTML = '';
      
      // 添加新选项
      if (paramTypes[type]) {
        paramTypes[type].forEach(option => {
          const optionBtn = document.createElement('button');
          optionBtn.className = 'option-btn';
          optionBtn.textContent = option;
          optionBtn.dataset.value = option;
          optionBtn.dataset.type = type;
          
          // 检查是否已选中
          const existingPill = pillsContainer.querySelector(`.param-pill[data-type="${type}"][data-value="${option}"]`);
          if (existingPill) {
            optionBtn.classList.add('selected');
          }
          
          optionBtn.addEventListener('click', function() {
            // 添加参数到Pills容器
            addParamPill(type, option);
            // 关闭底部抽屉
            closeBottomSheet();
          });
          
          sheetOptions.appendChild(optionBtn);
        });
      }
    }
    
    // 显示底部抽屉
    bottomSheet.classList.add('visible');
    menuOverlay.classList.remove('hidden');
    setTimeout(() => {
      menuOverlay.classList.add('opacity-100');
    }, 10);
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
  }
  
  // 关闭底部抽屉函数
  function closeBottomSheet() {
    if (!bottomSheet) return;
    
    bottomSheet.classList.remove('visible');
    menuOverlay.classList.remove('opacity-100');
    setTimeout(() => {
      menuOverlay.classList.add('hidden');
      // 恢复滚动
      document.body.style.overflow = '';
    }, 300);
  }
  
  // 添加参数Pills
  function addParamPill(type, value) {
    if (!pillsContainer) return;
    
    // 检查是否已存在同类型的pill
    const existingPills = pillsContainer.querySelectorAll(`.param-pill[data-type="${type}"]`);
    existingPills.forEach(pill => pill.remove());
    
    // 创建新的pill
    const pill = document.createElement('div');
    pill.className = 'param-pill';
    pill.dataset.type = type;
    pill.dataset.value = value;
    
    // 设置pill内容
    pill.innerHTML = `
      <span>${value}</span>
      <button class="remove-pill-btn">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    // 添加删除按钮事件
    const removeBtn = pill.querySelector('.remove-pill-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        pill.remove();
        updateInputState();
      });
    }
    
    // 添加点击编辑事件
    pill.addEventListener('click', function() {
      openBottomSheet(type, `选择${paramTypeLabels[type] || '选项'}`);
    });
    
    // 添加到容器
    pillsContainer.appendChild(pill);
    
    // 更新输入状态
    updateInputState();
  }
  
  // 添加快速参数选择按钮
  function addQuickParamSelector() {
    // 添加快速选择按钮
    const addStyleBtn = document.createElement('button');
    addStyleBtn.className = 'quick-param-btn';
    addStyleBtn.textContent = '+ 添加风格';
    addStyleBtn.addEventListener('click', function() {
      openBottomSheet('style');
    });
    
    const addRoomBtn = document.createElement('button');
    addRoomBtn.className = 'quick-param-btn';
    addRoomBtn.textContent = '+ 添加房间';
    addRoomBtn.addEventListener('click', function() {
      openBottomSheet('room');
    });
    
    const addTypeBtn = document.createElement('button');
    addTypeBtn.className = 'quick-param-btn';
    addTypeBtn.textContent = '+ 添加类型';
    addTypeBtn.addEventListener('click', function() {
      openBottomSheet('type');
    });
    
    // 可以在适当的位置添加这些按钮
    // 例如在输入框获得焦点时显示
  }
  
  // 如果有底部抽屉关闭按钮，添加事件
  if (closeSheetBtn) {
    closeSheetBtn.addEventListener('click', closeBottomSheet);
  }
  
  // 输入状态更新
  function updateInputState() {
    if (!composer) return;
    
    const hasText = composer.value.trim() !== '';
    const hasPills = pillsContainer && pillsContainer.children.length > 0;
    
    // 更新发送按钮状态
    // if (sendBtn) {
    //   if (hasText || hasPills) {
    //     sendBtn.removeAttribute('disabled');
    //     sendBtn.classList.add('active');
    //   } else {
    //     sendBtn.setAttribute('disabled', 'true');
    //     sendBtn.classList.remove('active');
    //   }
    // }
  }
  
  // 创作模式状态更新
  function updateCreativeState() {
    if (!creativeTextarea || !generateBtn) return;
    
    const hasText = creativeTextarea.value.trim() !== '';
    const hasReference = referencePreview && !referencePreview.classList.contains('hidden');
    
    // 更新生成按钮状态
    if (hasText || hasReference) {
      generateBtn.removeAttribute('disabled');
      // 使用setTimeout确保CSS过渡效果正常工作
      setTimeout(() => {
        generateBtn.classList.add('visible'); // 显示按钮
      }, 10);
      
      // 确保文本区域高度正确
      if (hasText) {
        autoResizeTextarea(creativeTextarea);
      }
    } else {
      generateBtn.setAttribute('disabled', 'true');
      generateBtn.classList.remove('visible'); // 隐藏按钮
    }
  }
  
  // 处理键盘弹出
  function handleKeyboardAppearance() {
    // 监听窗口大小变化，判断键盘是否弹出
    const initialHeight = window.innerHeight;
    let isKeyboardOpen = false;
    
    window.addEventListener('resize', function() {
      const currentHeight = window.innerHeight;
      
      // 如果高度减少超过一定值，认为是键盘弹出
      if (initialHeight - currentHeight > 100) {
        if (!isKeyboardOpen) {
          isKeyboardOpen = true;
          document.body.classList.add('keyboard-open');
          
          // 可以在这里添加键盘弹出时的额外处理
          if (creativePanel && creativePanel.classList.contains('active')) {
            creativePanel.classList.add('keyboard-mode');
            
            // 如果有显示的选项行，确保它可见
            if (styleOptions && styleOptions.classList.contains('visible')) {
              setTimeout(() => {
                styleOptions.scrollIntoView({ behavior: 'smooth', block: 'end' });
              }, 300);
            }
          }
          
          // 触发自定义事件
          document.dispatchEvent(new CustomEvent('keyboardopen'));
        }
      } else {
        if (isKeyboardOpen) {
          isKeyboardOpen = false;
          document.body.classList.remove('keyboard-open');
          
          // 可以在这里添加键盘收起时的额外处理
          if (creativePanel) {
            creativePanel.classList.remove('keyboard-mode');
            
            // 如果有显示的选项行，重新调整布局
            if (styleOptions && styleOptions.classList.contains('visible')) {
              // 延迟执行以确保过渡效果平滑
              setTimeout(() => {
                // 触发重新布局
                window.dispatchEvent(new Event('resize'));
              }, 300);
            }
          }
          
          // 触发自定义事件
          document.dispatchEvent(new CustomEvent('keyboardclose'));
        }
      }
    });
    
    // 监听方向变化
    window.addEventListener('orientationchange', function() {
      // 延迟处理，等待方向变化完成
      setTimeout(() => {
        // 重新计算布局
        if (styleOptions && styleOptions.classList.contains('visible')) {
          styleOptions.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      }, 300);
    });
  }
  
  // 打开创作模式
  function openCreativeMode() {
    if (!creativePanel) return;
    
    // 显示创作面板
    creativePanel.classList.add('active');
    
    // 显示遮罩层，防止点击其他元素
    if (menuOverlay) {
      menuOverlay.classList.remove('hidden');
      setTimeout(() => {
        menuOverlay.classList.add('opacity-100');
      }, 10);
    }
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
    
    // 确保生成按钮初始状态为隐藏
    if (generateBtn) {
      generateBtn.classList.remove('visible');
    }
    
    // 确保选项行默认隐藏
    if (styleOptions) {
      styleOptions.style.display = 'none';
      styleOptions.classList.remove('visible');
    }
    
    // 确保没有按钮被默认选中
    document.querySelectorAll('.room-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // 如果有输入内容，复制到创作文本区，但不覆盖已有内容
    if (composer && creativeTextarea && !creativeTextarea.value.trim()) {
      // 只有当创作文本区为空时才复制
      if (composer.value.trim()) {
        creativeTextarea.value = composer.value;
      }
      
      // 初始化文本区域高度
      setTimeout(() => {
        autoResizeTextarea(creativeTextarea);
        
        // 更新创作状态（包括生成按钮状态）
        updateCreativeState();
      }, 50);
    } else {
      // 确保更新创作状态
      updateCreativeState();
    }
    
    // 聚焦格式化文本区
    setTimeout(() => {
      if (formattedTextArea) {
        formattedTextArea.focus();
        
        // 将光标移到文本末尾
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(formattedTextArea);
        range.collapse(false); // 折叠到末尾
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }, 400); // 等待动画完成
  }
  
  // 关闭创作模式
  function closeCreativeMode() {
    if (!creativePanel) return;
    
    // 隐藏创作面板
    creativePanel.classList.remove('active');
    
    // 隐藏遮罩层
    if (menuOverlay) {
      menuOverlay.classList.remove('opacity-100');
      setTimeout(() => {
        menuOverlay.classList.add('hidden');
        // 恢复背景滚动
        document.body.style.overflow = '';
      }, 300);
    }
    
    // 如果有创作内容，复制到输入框
    if (creativeTextarea && composer) {
      composer.value = creativeTextarea.value;
      composer.style.height = 'auto';
      composer.style.height = (composer.scrollHeight) + 'px';
      updateInputState();
    }
  }
  
  // 监听文本输入
  if (composer) {
    composer.addEventListener('input', function() {
      updateInputState();
      
      // 自动调整高度
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    
    // 添加焦点事件
    composer.addEventListener('focus', function() {
      // 打开创作模式
      openCreativeMode();
    });
  }
  
  // 添加智能输入栏点击事件
  if (smartInputBar) {
    smartInputBar.addEventListener('click', function(e) {
      // 如果点击的是输入栏本身（不是其中的按钮），打开创作模式
      if (e.target === this || e.target.classList.contains('input-wrapper') || e.target === composer) {
        openCreativeMode();
      }
    });
  }
  
  // 获取格式化文本区域
  const formattedTextArea = document.getElementById('formattedTextArea');
  
  // 初始化格式化文本区域
  function initFormattedTextArea() {
    if (!formattedTextArea || !creativeTextarea) return;
    
    // 获取模板区域和用户编辑区域
    const templateArea = document.getElementById('templateArea');
    const userEditArea = document.getElementById('userEditArea');
    
    if (!templateArea || !userEditArea) return;
    
    // 将初始文本进行格式化并显示在模板区域
    const initialText = creativeTextarea.value;
    templateArea.innerHTML = formatTextWithKeywords(initialText);
    
    // 设置适当的样式类来优化视觉效果
    formattedTextArea.classList.add('unified-text-area');
    
    // 监听用户编辑区域的输入事件
    userEditArea.addEventListener('input', function() {
      // 更新隐藏的textarea的值
      updateHiddenTextarea();
      
      // 如果用户编辑区有内容，添加class
      this.classList.toggle('has-content', this.textContent.trim().length > 0);
    });
    
    // 监听模板区域点击事件
    templateArea.addEventListener('click', function(e) {
      const target = e.target;
      
      // 如果点击的是关键词
      if (target.classList.contains('keyword')) {
        e.preventDefault(); // 防止光标定位
        console.log('点击了关键词:', target.textContent, '类型:', target.getAttribute('data-type'));
        
        // 根据关键词类型执行不同操作
        if (target.classList.contains('design-type')) {
          // 点击设计类型，打开设计选项
          const designBtn = document.querySelector('.room-btn[data-room="设计"]');
          console.log('找到设计按钮:', designBtn ? '是' : '否');
          if (designBtn) designBtn.click();
          
          // 自动选择对应的设计选项
          const designType = target.getAttribute('data-type');
          setTimeout(() => {
            const designOption = document.querySelector(`.style-btn[data-style="${designType}"]`);
            console.log('找到设计选项:', designOption ? '是' : '否', designType);
            if (designOption) designOption.click();
          }, 300);
        } else if (target.classList.contains('style-type')) {
          // 点击风格类型，打开风格/户型选项并滚动到风格部分
          const styleBtn = document.querySelector('.room-btn[data-room="风格/户型"]');
          console.log('找到风格/户型按钮:', styleBtn ? '是' : '否');
          if (styleBtn) {
            styleBtn.click();
            
            // 获取点击的风格类型
            const styleType = target.getAttribute('data-type');
            
            setTimeout(() => {
              // 查找包含"风格"文本的标题元素
              const styleTitles = document.querySelectorAll('.options-title');
              const styleTitle = Array.from(styleTitles).find(el => el.textContent.includes('风格'));
              console.log('找到风格标题:', styleTitle ? '是' : '否');
              if (styleTitle) styleTitle.scrollIntoView({ behavior: 'smooth' });
              
              // 自动选择对应的风格选项
              const styleOption = document.querySelector(`.style-btn[data-style="${styleType}"][data-type="风格"]`);
              console.log('找到风格选项:', styleOption ? '是' : '否', styleType);
              if (styleOption) styleOption.click();
            }, 300);
          }
        } else if (target.classList.contains('room-type')) {
          // 点击户型类型，打开风格/户型选项并滚动到户型部分
          const styleBtn = document.querySelector('.room-btn[data-room="风格/户型"]');
          console.log('找到风格/户型按钮:', styleBtn ? '是' : '否');
          if (styleBtn) {
            styleBtn.click();
            
            // 获取点击的户型类型
            const roomType = target.getAttribute('data-type');
            
            setTimeout(() => {
              // 查找包含"户型"文本的标题元素
              const roomTitles = document.querySelectorAll('.options-title');
              const roomTitle = Array.from(roomTitles).find(el => el.textContent.includes('户型'));
              console.log('找到户型标题:', roomTitle ? '是' : '否');
              if (roomTitle) roomTitle.scrollIntoView({ behavior: 'smooth' });
              
              // 自动选择对应的户型选项
              // 先尝试使用data-style和data-type一起查找
              let roomOption = document.querySelector(`.style-btn[data-style="${roomType}"][data-type="户型"]`);
              
              // 如果没找到，只使用data-style查找
              if (!roomOption) {
                roomOption = document.querySelector(`.style-btn[data-style="${roomType}"]`);
              }
              
              console.log('找到户型选项:', roomOption ? '是' : '否', roomType);
              if (roomOption) roomOption.click();
            }, 300);
          }
        }
      } else {
        // 如果点击的是模板区域的其他部分，将焦点定位到用户编辑区域
        e.preventDefault();
        focusUserEditArea();
      }
    });
    
    // 给用户编辑区域添加点击事件，关闭选项面板
    userEditArea.addEventListener('click', function() {
      // 当输入框获得焦点时，隐藏选项行
      if (styleOptions) {
        styleOptions.style.display = 'none';
        styleOptions.classList.remove('visible');
      }
    });
    
    // 打开创作模式时，自动聚焦到用户编辑区
    setTimeout(() => {
      focusUserEditArea();
    }, 500);
  }
  
  // 新增函数：聚焦到用户编辑区域
  function focusUserEditArea() {
    const userEditArea = document.getElementById('userEditArea');
    if (!userEditArea) return;
    
    // 聚焦到用户编辑区
    userEditArea.focus();
    
    // 将光标移到末尾
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(userEditArea);
    range.collapse(false); // 折叠到末尾
    sel.removeAllRanges();
    sel.addRange(range);
  }
  
  // 新增函数：更新隐藏的textarea值
  function updateHiddenTextarea() {
    if (!creativeTextarea) return;
    
    const templateArea = document.getElementById('templateArea');
    const userEditArea = document.getElementById('userEditArea');
    
    if (!templateArea || !userEditArea) return;
    
    // 合并模板文本和用户输入
    const templateText = templateArea.textContent;
    const userText = userEditArea.textContent;
    
    // 更新隐藏文本框的值
    creativeTextarea.value = templateText + (userText ? '\n' + userText : '');
    
    // 更新创作状态
    updateCreativeState();
  }
  
  // 修改格式化文本，高亮关键词
  function formatTextWithKeywords(text) {
    if (!text) return '';
    
    // 确保只处理传入的文本，不添加任何额外内容
    console.log('格式化文本:', text);
    
    // 转义HTML特殊字符
    let safeText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // 设计类型关键词
    const designTypes = ['毛坯图', '毛坯房设计', '旧房', '旧屋改造', '新房软装'];
    
    // 风格类型关键词
    const styleTypes = ['简约', '现代', '北欧风格', '北欧', '中式', '美式', '工业风', '日式'];
     
    // 户型类型关键词
    const roomTypes = ['客厅', '卧室', '厨房', '餐厅', '书房', '卫生间'];
    
    // 替换设计类型关键词
    designTypes.forEach(type => {
      const regex = new RegExp(type, 'g');
      safeText = safeText.replace(regex, `<span class="keyword design-type" data-type="${type}">${type}</span>`);
    });
    
    // 替换风格类型关键词 - 先检查更复杂的术语，然后是简单术语
    const sortedStyleTypes = [...styleTypes].sort((a, b) => b.length - a.length);
    sortedStyleTypes.forEach(type => {
      // 确保只替换"风格XXX"中的XXX部分
      const styleRegex = new RegExp(`风格${type}`, 'g');
      if (styleRegex.test(safeText)) {
        safeText = safeText.replace(styleRegex, `风格<span class="keyword style-type" data-type="${type}">${type}</span>`);
      } else {
        // 也可能是单独的风格名称，不包含"风格"前缀
        const regex = new RegExp(`(^|[^风格])${type}([^风格]|$)`, 'g');
        safeText = safeText.replace(regex, (match, p1, p2) => 
          `${p1}<span class="keyword style-type" data-type="${type}">${type}</span>${p2}`
        );
      }
    });
     
    // 替换户型类型关键词
    roomTypes.forEach(type => {
      // 确保只替换"户型XXX"中的XXX部分
      const regex = new RegExp(`户型${type}`, 'g');
      safeText = safeText.replace(regex, `户型<span class="keyword room-type" data-type="${type}">${type}</span>`);
      
      // 添加对单独户型词的处理，不含"户型"前缀
      const standaloneRegex = new RegExp(`(^|[^户型])${type}([^户型]|$)`, 'g');
      safeText = safeText.replace(standaloneRegex, (match, p1, p2) => 
        `${p1}<span class="keyword room-type" data-type="${type}">${type}</span>${p2}`
      );
    });
    
    return safeText;
  }
  
  // 更新模板文字后重新格式化显示
  function updateFormattedText() {
    const templateArea = document.getElementById('templateArea');
    const userEditArea = document.getElementById('userEditArea');
    
    if (!templateArea || !creativeTextarea) return;
    
    // 获取当前模板文本
    const currentText = creativeTextarea.value;
    console.log('更新格式化文本:', currentText);
    
    // 分离模板文本和用户输入
    let templateText = currentText;
    let userText = '';
    
    // 如果有换行符，则第一行作为模板，其余作为用户输入
    const lines = currentText.split('\n');
    if (lines.length > 1) {
      templateText = lines[0];
      userText = lines.slice(1).join('\n');
    }
    
    // 更新模板区域的内容
    templateArea.innerHTML = formatTextWithKeywords(templateText);
    
    // 如果有用户编辑区域，更新其内容
    if (userEditArea) {
      userEditArea.textContent = userText;
    }
  }
  
  // 创作文本区输入事件
  if (creativeTextarea) {
    creativeTextarea.addEventListener('input', function() {
      updateCreativeState();
      
      // 自动调整文本区域高度
      autoResizeTextarea(this);
      
      // 更新格式化文本
      updateFormattedText();
    });
    
    // 添加焦点事件
    creativeTextarea.addEventListener('focus', function() {
      // 当输入框获得焦点时，隐藏选项行
      if (styleOptions) {
        styleOptions.style.display = 'none';
        styleOptions.classList.remove('visible');
      }
    });
  }
  
  // 自动调整文本区域高度的函数
  function autoResizeTextarea(textarea) {
    if (!textarea) return;
    
    // 固定高度为60px（两行文字），但启用滚动
    textarea.style.height = '60px';
    
    // 如果内容超过两行，启用滚动，但不显示滚动条
    textarea.style.overflowY = textarea.scrollHeight > 60 ? 'auto' : 'hidden';
    
    // 确保光标可见
    if (document.activeElement === textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }
  
  // 功能切换按钮点击事件
  if (typeToggleBtn) {
    typeToggleBtn.addEventListener('click', function() {
      // 打开类型选择底部抽屉
      openBottomSheet('type', '选择设计类型');
    });
  }
  
  // 上传按钮点击事件
  if (uploadBtn) {
    uploadBtn.addEventListener('click', function() {
      // 创建隐藏的文件输入框
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*'; // 只接受图片文件
      fileInput.style.display = 'none';
      
      // 添加到文档并触发点击
      document.body.appendChild(fileInput);
      fileInput.click();
      
      // 监听文件选择
      fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
          // 处理选择的文件
          const file = this.files[0];
          console.log('选择的文件:', file.name);
          
          // 这里可以添加上传文件的逻辑
          // 例如显示预览、上传到服务器等
          
          // 示例：添加一个上传的文件标签
          const fileTag = document.createElement('div');
          fileTag.className = 'param-pill file-pill';
          fileTag.innerHTML = `
            <span><i class="fas fa-image"></i> ${file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}</span>
            <button class="remove-pill-btn">
              <i class="fas fa-times"></i>
            </button>
          `;
          
          // 添加删除按钮事件
          const removeBtn = fileTag.querySelector('.remove-pill-btn');
          if (removeBtn) {
            removeBtn.addEventListener('click', function(e) {
              e.stopPropagation();
              fileTag.remove();
              updateInputState();
            });
          }
          
          // 添加到容器
          if (pillsContainer) {
            pillsContainer.appendChild(fileTag);
            updateInputState();
          }
        }
        
        // 从文档中移除
        document.body.removeChild(fileInput);
      });
    });
  }
  
  // 参考图上传按钮点击事件 - 这部分逻辑已经移到示例图快速选择功能中
  // 避免重复添加事件监听
  
  // 移除参考图按钮点击事件
  if (referencePreview) {
    const removeBtn = referencePreview.querySelector('.remove-reference-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', function() {
        // 隐藏预览区域，显示上传区域
        referencePreview.classList.add('hidden');
        referenceUpload.classList.remove('hidden');
        
        // 清空图片源
        setTimeout(() => {
          referenceImage.src = '#';
        }, 300);
        
        // 更新创作状态
        updateCreativeState();
      });
    }
  }
  
  // 选项配置
  const optionsConfig = {
    '设计': ['毛坯房设计', '旧屋改造', '新房软装'],
    '风格': ['现代', '简约', '中式', '北欧', '工业风', '美式'],
    '户型': ['客厅', '卧室', '厨房', '餐厅', '书房', '卫生间'],
    '比例': ['9:16', '3:4', '2:3', '1:1', '3:2']
  };
  
  // 当前选中的比例
  let currentRatio = '3:4';
  
  // 创建选项按钮
  function createOptionButton(option, type) {
    const btn = document.createElement('button');
    btn.className = 'style-btn';
    btn.dataset.style = option;
    btn.dataset.type = type; // 添加类型属性
    btn.textContent = option;
    
    // 检查是否已选中
    if ((type === '风格' && currentStyle === option) || 
        (type === '户型' && currentRoom === option) ||
        (type === '比例' && currentRatio === option)) {
      btn.classList.add('active');
    }
    
    // 添加点击事件
    btn.addEventListener('click', function(e) {
      // 阻止事件冒泡，防止触发父元素的事件处理器
      e.stopPropagation();
      
      // 添加触觉反馈（如果设备支持）
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // 短暂振动50ms
      }
      
      // 移除同类型按钮的激活状态
      document.querySelectorAll(`.style-btn[data-type="${type}"]`).forEach(b => b.classList.remove('active'));
      
      // 添加当前按钮的激活状态（延迟一点点，增强视觉效果）
      setTimeout(() => {
        this.classList.add('active');
        
                  // 更新当前选中的选项
          if (type === '风格') {
            currentStyle = option;
            console.log(`选中风格:`, option);
            
            // 更新模板文字中的风格
            updateTemplateText('风格', option);
          } else if (type === '户型') {
            currentRoom = option; // 更新当前选中的户型
            console.log(`选中户型:`, option);
            
            // 更新模板文字中的户型
            updateTemplateText('户型', option);
            
            // 更新示例图的房间类型
            if (window.setExampleGalleryRoomType) {
              window.setExampleGalleryRoomType(option);
            }
          } else if (type === '设计') {
            // 更新设计类型
            console.log(`选中设计类型:`, option);
            
            // 更新模板文字中的设计类型描述
            updateTemplateText('设计', option);
            
            // 更新示例图的设计类型
            if (window.setExampleDesignType) {
              window.setExampleDesignType(option);
            }
          } else if (type === '比例') {
            currentRatio = option; // 更新当前选中的比例
            console.log(`选中比例:`, option);
            
            // 不再更新模板文字中的比例
            // updateTemplateText('比例', option);
            
            // 只更新比例按钮的文本
            const ratioBtn = document.querySelector('.room-btn[data-room="比例"]');
            if (ratioBtn) {
              ratioBtn.textContent = option;
            }
          }
        
        // 添加选中的动画效果
        animateSelection(this);
        
        // 确保选项行保持可见
        if (styleOptions) {
          // 防止选项消失
          styleOptions.style.display = 'flex';
          styleOptions.classList.add('visible');
        }
      }, 50);
    });
    
    return btn;
  }
  
  // 更新模板文字中的风格、户型、设计类型
  function updateTemplateText(type, option) {
    const templateArea = document.getElementById('templateArea');
    if (!templateArea) return;
    
    // 获取原始模板文本
    const originalText = templateArea.textContent;
    console.log('原始模板文本:', originalText);
    
    // 根据类型修改模板文本
    let newText = originalText;
    
    if (type === '风格') {
      // 使用更精确的正则表达式替换"风格XXX"中的XXX部分
      const styleRegex = /风格([^、，,。.\s]+)/;
      const match = styleRegex.exec(originalText);
      
      if (match && match[1]) {
        console.log('找到风格:', match[1], '替换为:', option);
        newText = originalText.replace(match[0], `风格${option}`);
      } else {
        console.log('未找到风格部分，文本未修改');
      }
    } else if (type === '户型') {
      // 使用更精确的正则表达式替换"户型XXX"中的XXX部分
      const roomRegex = /户型([^、，,。.\s]+)/;
      const match = roomRegex.exec(originalText);
      
      if (match && match[1]) {
        console.log('找到户型:', match[1], '替换为:', option);
        newText = originalText.replace(match[0], `户型${option}`);
      } else {
        console.log('未找到户型部分，文本未修改');
      }
    } else if (type === '设计') {
      // 根据设计类型更新前半部分文字
      if (option === '毛坯房设计') {
        newText = originalText.replace(/^[^，,、。.]+/g, '请将毛坯图生成设计图');
      } else if (option === '旧屋改造') {
        newText = originalText.replace(/^[^，,、。.]+/g, '旧房生成改造图');
      } else if (option === '新房软装') {
        newText = originalText.replace(/^[^，,、。.]+/g, '生成新房软装图');
      }
    }
    
    // 如果文本有变化，更新模板区域
    if (newText !== originalText) {
      console.log('更新后的模板文本:', newText);
      
      // 更新模板区域
      templateArea.innerHTML = formatTextWithKeywords(newText);
      
      // 更新隐藏文本框
      updateHiddenTextarea();
    } else {
      console.log('模板文本未更改');
    }
  }
  
  // 辅助函数：找到户型类型的结束位置
  function findRoomTypeEnd(text, startPos) {
    const roomTypes = ['客厅', '卧室', '厨房', '餐厅', '书房', '卫生间', '阳台', '儿童房', '玄关'];
    
    for (const roomType of roomTypes) {
      if (text.substring(startPos).startsWith(roomType)) {
        return startPos + roomType.length;
      }
    }
    
    // 如果没有找到特定的户型类型，尝试找到下一个分隔符
    const nextDelimiter = Math.min(
      text.indexOf('，', startPos) > -1 ? text.indexOf('，', startPos) : Infinity,
      text.indexOf('。', startPos) > -1 ? text.indexOf('。', startPos) : Infinity,
      text.indexOf(',', startPos) > -1 ? text.indexOf(',', startPos) : Infinity,
      text.indexOf('.', startPos) > -1 ? text.indexOf('.', startPos) : Infinity
    );
    
    return nextDelimiter !== Infinity ? nextDelimiter : text.length;
  }
  
  // 添加选中的动画效果
  function animateSelection(element) {
    // 创建一个临时的动画元素
    const animElement = document.createElement('span');
    animElement.className = 'selection-anim';
    animElement.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(42, 157, 143, 0.2);
      border-radius: 8px;
      transform: scale(0);
      opacity: 1;
      pointer-events: none;
      z-index: -1;
    `;
    
    // 添加到按钮中
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(animElement);
    
    // 触发动画
    setTimeout(() => {
      animElement.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
      animElement.style.transform = 'scale(1)';
      animElement.style.opacity = '0';
      
      // 动画结束后移除元素
      setTimeout(() => {
        if (element.contains(animElement)) {
          element.removeChild(animElement);
        }
      }, 500);
    }, 0);
  }
  
  // 房间类型按钮点击事件
  if (roomBtns) {
    roomBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        try {
          // 防止多次快速点击
          if (this.dataset.processing === 'true') {
            return;
          }
          this.dataset.processing = 'true';
          
          console.log('点击了房间按钮:', this.dataset.room);
          
          // 让文本区域失去焦点，收起键盘
          if (creativeTextarea) {
            creativeTextarea.blur();
          }
          
          // 移除所有按钮的激活状态
          roomBtns.forEach(b => b.classList.remove('active'));
          
          // 添加当前按钮的激活状态
          this.classList.add('active');
          
          // 更新当前选中的房间类型
          const roomType = this.dataset.room;
          currentRoom = roomType;
          
          // 获取键盘选项面板
          const keyboardOptionsPanel = document.getElementById('keyboardOptionsPanel');
          console.log('键盘选项面板存在:', keyboardOptionsPanel ? '是' : '否');
          
          // 确保选项区域可见
          if (keyboardOptionsPanel) {
            // 初始化选项区域（如果尚未初始化）
            initKeyboardOptionsPanel();
            
            // 显示选项面板
            keyboardOptionsPanel.style.display = 'block';
            setTimeout(() => {
              keyboardOptionsPanel.classList.add('visible');
            }, 10);
            
            // 滚动到对应的部分
            setTimeout(() => {
              let targetSection = null;
              
              switch (roomType) {
                case '设计':
                  targetSection = document.getElementById('designSection');
                  break;
                case '风格/户型':
                  targetSection = document.getElementById('styleSection');
                  break;
                case '比例':
                  targetSection = document.getElementById('ratioSection');
                  break;
              }
              
              console.log('目标部分存在:', targetSection ? '是' : '否', roomType);
              
              if (targetSection) {
                // 滚动到目标部分，使用平滑滚动
                const scrollContainer = document.querySelector('.options-scroll-container');
                console.log('滚动容器存在:', scrollContainer ? '是' : '否');
                if (scrollContainer) {
                  scrollContainer.scrollTo({
                    top: targetSection.offsetTop - 16,
                    behavior: 'smooth'
                  });
                }
              }
              
              // 重置处理状态
              this.dataset.processing = 'false';
            }, 100);
          } else {
            this.dataset.processing = 'false';
          }
        } catch (err) {
          console.error('处理按钮点击事件时出错:', err);
          this.dataset.processing = 'false';
        }
      });
    });
  }

// 初始化键盘选项面板
function initKeyboardOptionsPanel() {
  try {
    // 获取所有选项网格
    const designGrid = document.getElementById('designGrid');
    const styleGrid = document.getElementById('styleGrid');
    const roomGrid = document.getElementById('roomGrid');
    const ratioGrid = document.getElementById('ratioGrid');
    
    console.log('选项网格是否存在:', {
      designGrid: designGrid ? '是' : '否',
      styleGrid: styleGrid ? '是' : '否',
      roomGrid: roomGrid ? '是' : '否',
      ratioGrid: ratioGrid ? '是' : '否'
    });
    
    // 确保选项配置已加载
    if (!window.optionsConfig) {
      console.log('选项配置不存在，正在初始化...');
      initializeOptions();
    } else {
      console.log('选项配置已存在:', Object.keys(window.optionsConfig));
    }
    
    // 清空现有选项
    if (designGrid) designGrid.innerHTML = '';
    if (styleGrid) styleGrid.innerHTML = '';
    if (roomGrid) roomGrid.innerHTML = '';
    if (ratioGrid) ratioGrid.innerHTML = '';
    
    // 添加设计选项
    if (designGrid && window.optionsConfig['设计']) {
      window.optionsConfig['设计'].forEach(option => {
        const optionBtn = createOptionButton(option, '设计');
        designGrid.appendChild(optionBtn);
      });
      console.log('已添加设计选项:', window.optionsConfig['设计'].length);
    }
    
    // 添加风格选项
    if (styleGrid && window.optionsConfig['风格']) {
      window.optionsConfig['风格'].forEach(option => {
        const optionBtn = createOptionButton(option, '风格');
        styleGrid.appendChild(optionBtn);
      });
      console.log('已添加风格选项:', window.optionsConfig['风格'].length);
    }
    
    // 添加户型选项
    if (roomGrid && window.optionsConfig['户型']) {
      window.optionsConfig['户型'].forEach(option => {
        const optionBtn = createOptionButton(option, '户型');
        roomGrid.appendChild(optionBtn);
      });
      console.log('已添加户型选项:', window.optionsConfig['户型'].length);
    }
    
    // 添加比例选项
    if (ratioGrid && window.optionsConfig['比例']) {
      window.optionsConfig['比例'].forEach(option => {
        const optionBtn = createOptionButton(option, '比例');
        ratioGrid.appendChild(optionBtn);
      });
      console.log('已添加比例选项:', window.optionsConfig['比例'].length);
    }
    
    // 初始化水印开关
    initWatermarkToggle();
    
    // 添加文本区域点击事件，关闭选项面板
    const formattedTextArea = document.getElementById('formattedTextArea');
    if (formattedTextArea) {
      formattedTextArea.addEventListener('click', hideKeyboardOptionsPanel);
    }
    
    // 添加滚动监听，更新当前激活的按钮
    const scrollContainer = document.querySelector('.options-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateActiveButtonOnScroll);
    }
  } catch (err) {
    console.error('初始化键盘选项面板时出错:', err);
  }
}

// 隐藏键盘选项面板
function hideKeyboardOptionsPanel() {
  const keyboardOptionsPanel = document.getElementById('keyboardOptionsPanel');
  if (keyboardOptionsPanel) {
    keyboardOptionsPanel.classList.remove('visible');
    setTimeout(() => {
      keyboardOptionsPanel.style.display = 'none';
    }, 250);
  }
}

// 初始化水印开关
function initWatermarkToggle() {
  const watermarkToggle = document.getElementById('watermarkToggle');
  if (watermarkToggle) {
    // 恢复保存的状态
    const savedState = localStorage.getItem('watermarkEnabled');
    watermarkToggle.checked = savedState === 'true';
    
    // 添加事件监听
    watermarkToggle.addEventListener('change', function() {
      // 保存状态
      localStorage.setItem('watermarkEnabled', this.checked);
      // 更新全局状态
      window.watermarkEnabled = this.checked;
      console.log(`水印已${this.checked ? '启用' : '禁用'}`);
    });
  }
}

// 根据滚动位置更新激活按钮
function updateActiveButtonOnScroll() {
  if (!roomBtns) return;
  
  const scrollContainer = document.querySelector('.options-scroll-container');
  if (!scrollContainer) return;
  
  const scrollTop = scrollContainer.scrollTop;
  const designSection = document.getElementById('designSection');
  const styleSection = document.getElementById('styleSection');
  const ratioSection = document.getElementById('ratioSection');
  
  // 判断当前可见的主要区域
  if (designSection && scrollTop < styleSection.offsetTop - 50) {
    // 设计区域可见
    roomBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.room === '设计');
    });
  } else if (styleSection && scrollTop >= styleSection.offsetTop - 50 && scrollTop < ratioSection.offsetTop - 50) {
    // 风格/户型区域可见
    roomBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.room === '风格/户型');
    });
  } else if (ratioSection && scrollTop >= ratioSection.offsetTop - 50) {
    // 比例区域可见
    roomBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.room === '比例');
    });
  }
}

// 当输入区域获得焦点时关闭选项面板
if (creativeTextarea) {
  creativeTextarea.addEventListener('focus', hideKeyboardOptionsPanel);
}
  
  // 关闭创作模式按钮点击事件
  if (closeCreativeBtn) {
    closeCreativeBtn.addEventListener('click', function() {
      closeCreativeMode();
    });
  }
  
  // 添加遮罩层点击事件，点击时关闭创作面板
  if (menuOverlay) {
    // 已有的菜单关闭事件监听
    menuOverlay.addEventListener('click', closeMenu);
    
    // 添加新的事件监听，用于关闭创作面板
    // 使用事件委托来确定是否应该关闭创作面板
    menuOverlay.addEventListener('click', function(e) {
      // 如果创作面板是活动状态，点击遮罩层时关闭它
      if (creativePanel && creativePanel.classList.contains('active')) {
        closeCreativeMode();
      }
    });
  }
  
  // 生成按钮点击事件
  if (generateBtn) {
    generateBtn.addEventListener('click', function() {
      if (this.hasAttribute('disabled')) return;
      
      // 获取创作内容
      const text = creativeTextarea.value.trim();
      const hasReference = referencePreview && !referencePreview.classList.contains('hidden');
      let referenceImageSrc = '';
      
      // 获取参考图片元素
      const referenceImage = document.getElementById('referenceImage');
      if (hasReference && referenceImage) {
        referenceImageSrc = referenceImage.src;
      }
      
      // 获取选中的风格和房间类型
      const selectedStyle = window.currentStyle || '简约';
      const selectedRoom = window.currentRoom || '客厅';
      const selectedRatio = window.currentRatio || '3:4';
      
      // 收集用户输入数据
      const generationData = { 
        text, 
        hasReference,
        referenceImageSrc,
        selectedStyle, 
        selectedRoom,
        selectedRatio,
        // 提取文本中的风格和户型信息
        textStyle: text.match(/风格([^、，,。.]+)/)?.[1] || selectedStyle,
        textRoom: text.match(/户型([^、，,。.]+)/)?.[1] || selectedRoom
      };
      
      console.log('生成内容:', generationData);
      
      // 关闭创作模式，回到主界面
      closeCreativeMode();
      
      // 使用displayGenerationInMainContent函数显示双环进度系统和双图结果
      displayGenerationInMainContent(generationData);
      // 新增：重置输入框
      resetInputBox();
    });
  }
  
  // 发送按钮点击事件
  if (sendBtn) {
    sendBtn.addEventListener('click', function() {
      if (this.hasAttribute('disabled')) return;
      
      // 获取输入内容
      const text = composer.value.trim();
      const pills = Array.from(pillsContainer.children).map(pill => {
        return {
          type: pill.dataset.type,
          value: pill.dataset.value
        };
      });
      
      // 在这里处理发送逻辑
      console.log('发送内容:', { text, pills });
      
      // 清空输入框和pills
      composer.value = '';
      pillsContainer.innerHTML = '';
      composer.style.height = 'auto';
      // 新增：重置输入框
      resetInputBox();
      // 更新输入状态
      updateInputState();
    });
  }
  
  // 初始化输入状态
  updateInputState();
  
  // 初始化创作状态
  updateCreativeState();
  
  // 初始化文本区域高度，适应预设文本
  if (creativeTextarea) {
    autoResizeTextarea(creativeTextarea);
  }
  
  // 初始化格式化文本区域
  initFormattedTextArea();
  
  // 初始化选项
  function initializeOptions() {
    // 选项配置对象
    window.optionsConfig = {
      '设计': ['毛坯房设计', '旧屋改造', '新房软装'],
      '风格': ['现代简约', '北欧风格', '美式', '中式', '法式', '日式', '工业风', '地中海', '混搭'],
      '户型': ['客厅', '卧室', '厨房', '餐厅', '书房', '卫生间', '阳台', '儿童房', '玄关'],
      '比例': ['9:16', '3:4', '2:3', '1:1', '3:2', '16:9']
    };
    
    // 初始化全局变量
    window.currentStyle = '简约';
    window.currentRoom = '客厅';
    window.currentRatio = '3:4';
    window.watermarkEnabled = false; // 添加水印全局变量
    
    // 不自动选中任何按钮，等待用户点击
    // 只预加载选项数据
    
    // 添加错误处理
    window.addEventListener('error', function(e) {
      console.error('UI错误:', e.message);
      // 尝试恢复UI状态
      const styleOptions = document.getElementById('styleOptions');
      if (styleOptions) {
        styleOptions.style.display = 'flex';
        styleOptions.classList.add('visible');
      }
    });
    
    // 添加触摸事件优化
    document.addEventListener('touchstart', function() {
      // 空函数，用于激活移动设备上的:active伪类
    }, {passive: true});
  }
  
  // 移除性能监控功能，确保动画效果始终启用
  // 如果页面已经加载了reduce-animations类，移除它
  if (document.body.classList.contains('reduce-animations')) {
    document.body.classList.remove('reduce-animations');
  }
  
  // 初始化键盘处理
  handleKeyboardAppearance();
  
  // 添加快速参数选择按钮样式
  const style = document.createElement('style');
  style.textContent = `
    .quick-param-btn {
      background: none;
      border: 1px dashed var(--text-secondary);
      color: var(--text-secondary);
      border-radius: 16px;
      padding: 4px 10px;
      font-size: 14px;
      margin-right: 8px;
      margin-bottom: 8px;
      transition: all 0.2s ease;
    }
    
    .quick-param-btn:active {
      background-color: rgba(42, 157, 143, 0.1);
      color: var(--main-color);
      border-color: var(--main-color);
    }
    
    .option-btn.selected {
      background-color: rgba(42, 157, 143, 0.1);
      color: var(--main-color);
      border: 1px solid var(--main-color);
    }
    
    .file-pill {
      background-color: rgba(233, 196, 106, 0.1);
      color: #e9c46a;
    }
    
    .keyboard-open .creative-panel {
      height: 100vh;
    }
    
    .creative-panel.keyboard-mode .reference-area {
      display: none;
    }
  `;
  document.head.appendChild(style);
  
  // 初始化选项显示
  initializeOptions();
  
  // 为选项容器添加点击事件，防止选项消失
  const optionsContainer = document.getElementById('styleOptions');
  if (optionsContainer) {
    optionsContainer.addEventListener('click', function(e) {
      // 阻止事件冒泡，防止触发父元素的事件处理器
      e.stopPropagation();
    });
  }
  
  // 添加触摸反馈效果
  addTouchFeedback();
}); 

  // 添加示例图快速选择功能
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const referenceUpload = document.getElementById('referenceUpload');
  const referencePreview = document.getElementById('referencePreview');
  const referenceImage = document.getElementById('referenceImage');
  
  // 初始化事件监听
  function initReferenceUpload() {
    // 参考图上传按钮点击事件
    if (referenceUpload) {
      // 移除所有现有的事件监听器
      const newReferenceUpload = referenceUpload.cloneNode(true);
      referenceUpload.parentNode.replaceChild(newReferenceUpload, referenceUpload);
      
      console.log('重置参考图上传按钮的事件监听器');
    }
  }
  
  // 初始化
  initReferenceUpload();
}); 

  // 设备和浏览器功能检测
  function detectFeatures() {
    const features = {
      touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      passiveEvents: false,
      smoothScroll: 'scrollBehavior' in document.documentElement.style
      // 移除reducedMotion检测，确保动画效果始终启用
    };
    
    // 检测是否支持被动事件监听器
    try {
      const options = Object.defineProperty({}, 'passive', {
        get: function() {
          features.passiveEvents = true;
          return true;
        }
      });
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {}
    
    // 应用相应的类名到body
    if (features.touch) {
      document.body.classList.add('touch-device');
    }
    
    // 移除减少动画的功能
    if (document.body.classList.contains('reduce-animations')) {
      document.body.classList.remove('reduce-animations');
    }
    
    return features;
  }
  
  // 在初始化时调用
  const deviceFeatures = detectFeatures();
  
  // 根据设备特性优化UI
  function optimizeForDevice() {
    if (deviceFeatures.touch) {
      // 为触摸设备优化
      const allButtons = document.querySelectorAll('.room-btn, .style-btn');
      allButtons.forEach(btn => {
        btn.addEventListener('touchstart', function() {
          this.classList.add('touch-active');
        }, deviceFeatures.passiveEvents ? { passive: true } : false);
        
        btn.addEventListener('touchend', function() {
          this.classList.remove('touch-active');
        }, deviceFeatures.passiveEvents ? { passive: true } : false);
      });
    }
    
    // 监听屏幕方向变化
    window.addEventListener('orientationchange', function() {
      // 重新布局选项
      setTimeout(function() {
        const visibleOptions = document.querySelector('.template-row.visible');
        if (visibleOptions) {
          // 确保选项可见
          visibleOptions.scrollIntoView({ behavior: deviceFeatures.smoothScroll ? 'smooth' : 'auto', block: 'nearest' });
        }
      }, 300);
    });
  }
  
  // 在DOM加载完成后调用
  document.addEventListener('DOMContentLoaded', optimizeForDevice); 

  // 检查是否需要显示滚动指示器
  function checkScrollIndicators() {
    const optionsGrids = document.querySelectorAll('.options-grid');
    
    optionsGrids.forEach(grid => {
      // 如果内容宽度大于容器宽度，显示滚动指示器
      if (grid.scrollWidth > grid.clientWidth) {
        grid.classList.add('has-more');
        
        // 监听滚动事件
        grid.addEventListener('scroll', function() {
          // 如果滚动到最右侧，隐藏指示器
          if (grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 10) {
            grid.classList.remove('has-more');
          } else {
            grid.classList.add('has-more');
          }
        }, { passive: true });
      } else {
        grid.classList.remove('has-more');
      }
    });
  }
  
  // 监听DOM变化，检查新添加的选项网格
  function observeOptionsChanges() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // 检查是否添加了新的选项网格
          setTimeout(checkScrollIndicators, 100);
        }
      });
    });
    
    // 观察模板行的变化
    const templateRow = document.getElementById('styleOptions');
    if (templateRow) {
      observer.observe(templateRow, { childList: true, subtree: true });
    }
  }
  
  // 在DOM加载完成后调用
  document.addEventListener('DOMContentLoaded', () => {
    observeOptionsChanges();
    
    // 监听窗口大小变化，重新检查滚动指示器
    window.addEventListener('resize', checkScrollIndicators, { passive: true });
  }); 

/**
 * 为参考区域的元素添加触摸反馈效果
 */
function addTouchFeedback() {
  // 需要添加触摸反馈的元素
  const touchElements = document.querySelectorAll('.reference-placeholder, .local-upload-btn, .example-thumb-container, .remove-reference-btn');
  
  touchElements.forEach(element => {
    // 触摸开始时
    element.addEventListener('touchstart', function(e) {
      this.style.transform = 'scale(0.97)';
      this.style.opacity = '0.9';
    }, { passive: true });
    
    // 触摸结束或取消时
    ['touchend', 'touchcancel'].forEach(event => {
      element.addEventListener(event, function() {
        this.style.transform = '';
        this.style.opacity = '';
      }, { passive: true });
    });
  });
} 

// 在主内容区域展示生成过程和结果
function displayGenerationInMainContent(generationData) {
  console.log('开始生成内容:', generationData);
  
  // 获取主内容区
  const mainContent = document.querySelector('main');
  if (!mainContent) return;
  
  // 清空欢迎信息
  mainContent.innerHTML = '';
  mainContent.className = 'flex-1 flex flex-col p-4 overflow-y-auto';
  
  // 创建聊天容器
  let chatContainer = mainContent.querySelector('.chat-container');
  if (!chatContainer) {
    chatContainer = document.createElement('div');
    chatContainer.className = 'chat-container w-full max-w-3xl mx-auto';
    mainContent.appendChild(chatContainer);
  }
  
  // 构建用户消息
  const userMessage = document.createElement('div');
  userMessage.className = 'message-container user-message';
  
  // 获取用户输入文本
  const displayText = generationData.text;
  
  // 获取风格和户型标签
  const userStyleTags = [];
  if (generationData.textStyle) {
    userStyleTags.push(generationData.textStyle);
  } else if (generationData.selectedStyle) {
    userStyleTags.push(generationData.selectedStyle);
  }
  
  const userRoomTags = [];
  if (generationData.textRoom) {
    userRoomTags.push(generationData.textRoom);
  } else if (generationData.selectedRoom) {
    userRoomTags.push(generationData.selectedRoom);
  }
  
  // 获取比例标签
  const userRatioTag = generationData.selectedRatio || '3:4';
  
  // 构建标签HTML
  const userTagsHTML = `
    <div class="tags-container">
      ${userStyleTags.map(tag => `<span class="tag bg-green-500">${tag}</span>`).join('')}
      ${userRoomTags.map(tag => `<span class="tag bg-blue-500">${tag}</span>`).join('')}
      <span class="tag bg-purple-500">${userRatioTag}</span>
    </div>
  `;
  
  // 构建用户消息内容HTML
  let userContentHTML = `
    <div class="message-content">
      <div class="message-text">${displayText}</div>
      <div class="content-metadata-row">
  `;
  
  // 如果有参考图片，添加参考图片
  if (generationData.referenceImageSrc) {
    userContentHTML += `
      <div class="reference-thumbnail">
        <img src="${generationData.referenceImageSrc}" alt="参考图片" onclick="showFullImage('${generationData.referenceImageSrc}')">
      </div>
    `;
  }
  
  // 添加标签
  userContentHTML += userTagsHTML;
  
  // 关闭消息内容div
  userContentHTML += `
      </div>
    </div>
  `;
  
  // 设置用户消息内容
  userMessage.innerHTML = userContentHTML;
  
  // 添加用户消息到聊天容器
  chatContainer.appendChild(userMessage);
  
  // 创建AI消息
  const aiMessage = document.createElement('div');
  aiMessage.className = 'message-container ai-message';
  aiMessage.innerHTML = `
    <div class="message-content">
      <div class="message-processing">
        <!-- 处理状态将在这里显示 -->
      </div>
    </div>
  `;
  
  // 添加AI消息到聊天容器
  chatContainer.appendChild(aiMessage);
  
  // 更新底部操作栏
  // const actionBar = document.querySelector('.action-bar') || document.createElement('div');
  // actionBar.className = 'action-bar flex justify-center space-x-4 mt-4 mb-2';
  // actionBar.innerHTML = `
  //   <button class="action-button primary" id="newDesignBtn">
  //     <i class="fas fa-plus"></i> 新设计
  //   </button>
  // `;
  
  // 如果操作栏不在DOM中，添加它
  // if (!actionBar.parentNode) {
  //   chatContainer.appendChild(actionBar);
  // }
  
  // // 绑定新设计按钮事件
  // const newDesignBtn = document.getElementById('newDesignBtn');
  // if (newDesignBtn) {
  //   newDesignBtn.addEventListener('click', () => {
  //     openCreativeMode();
  //   });
  // }
  
  // 滚动到底部
  mainContent.scrollTop = mainContent.scrollHeight;
  
  // 删除这段代码，因为我们已经在showFullImage函数中实现了这个功能
  
  // 开始处理进度动画
  simulateMainContentProgress(aiMessage);
}

// 模拟主内容区域的进度展示
function simulateMainContentProgress(aiMessage) {
  // 添加调试日志
  console.log('开始双环进度动画', aiMessage);
  
  // 先清除现有的处理状态内容
  const processingElement = aiMessage.querySelector('.message-processing');
  if (!processingElement) {
    console.error('未找到处理状态元素');
    return;
  }
  
  // 更新为双环进度系统
  processingElement.innerHTML = `
    <div class="processing-preview-container">
      <!-- 双环进度指示器 -->
      <div class="dual-progress-container">
        <!-- 左侧环形进度 -->
        <div class="progress-ring-wrapper left">
          <svg class="progress-ring" width="100" height="100">
            <circle class="progress-ring-circle-bg" stroke-width="6" fill="transparent" r="44" cx="50" cy="50"/>
            <circle class="progress-ring-circle" stroke-width="6" fill="transparent" r="44" cx="50" cy="50" stroke-dasharray="276.46" stroke-dashoffset="276.46"/>
          </svg>
          <div class="progress-percentage">0%</div>
          <div class="particles-container left"></div>
        </div>
        
        <!-- 右侧环形进度 -->
        <div class="progress-ring-wrapper right">
          <svg class="progress-ring" width="100" height="100">
            <circle class="progress-ring-circle-bg" stroke-width="6" fill="transparent" r="44" cx="50" cy="50"/>
            <circle class="progress-ring-circle" stroke-width="6" fill="transparent" r="44" cx="50" cy="50" stroke-dasharray="276.46" stroke-dashoffset="276.46"/>
          </svg>
          <div class="progress-percentage">0%</div>
          <div class="particles-container right"></div>
        </div>
        
        <!-- 中央状态显示 -->
        <div class="central-status">
          <div class="status-text">正在分析设计要素...</div>
          <div class="dual-progress-text">生成中</div>
        </div>
      </div>
      
      <!-- 渐进式生成预览区域 -->
      <div class="preview-placeholder">
        <div class="preview-gradient"></div>
      </div>
    </div>
    
    <div class="processing-status">
      <div class="processing-text">AI正在生成您的设计方案</div>
      <div class="processing-substatus">正在创建两套设计方案...</div>
    </div>
  `;
  
  // 获取左右两侧的进度环元素
  const leftProgressRing = processingElement.querySelector('.progress-ring-wrapper.left .progress-ring-circle');
  const rightProgressRing = processingElement.querySelector('.progress-ring-wrapper.right .progress-ring-circle');
  const leftPercentage = processingElement.querySelector('.progress-ring-wrapper.left .progress-percentage');
  const rightPercentage = processingElement.querySelector('.progress-ring-wrapper.right .progress-percentage');
  const centralStatus = processingElement.querySelector('.central-status .status-text');
  const processingSubstatus = processingElement.querySelector('.processing-substatus');
  const previewGradient = processingElement.querySelector('.preview-gradient');
  
  // 添加调试日志，检查是否获取到了元素
  console.log('获取双环元素:', {
    leftProgressRing,
    rightProgressRing,
    leftPercentage,
    rightPercentage,
    centralStatus,
    processingSubstatus
  });
  
  // 如果找不到元素，尝试重新查找
  if (!leftProgressRing || !rightProgressRing) {
    console.warn('未找到进度环元素，尝试重新查询');
    console.log('处理元素HTML:', processingElement.innerHTML);
    return; // 如果元素不存在，终止函数执行
  }
  
  // 创建粒子效果
  createParticles(processingElement.querySelector('.particles-container.left'), '#1E88E5', 15);
  createParticles(processingElement.querySelector('.particles-container.right'), '#2A9D8F', 15);
  
  // 进度阶段
  const stages = [
    { percent: 15, status: '正在分析设计要素...', color: '#e9c46a' },
    { percent: 40, status: '生成双方案布局框架...', color: '#f4a261' },
    { percent: 75, status: '完善设计细节...', color: '#e76f51' },
    { percent: 95, status: '优化渲染效果...', color: '#2a9d8f' },
    { percent: 100, status: '设计已完成！', color: '#2a9d8f' }
  ];
  
  let currentStage = 0;
  let leftPercent = 0;
  let rightPercent = 0;
  
  // 计算圆环周长
  const radius = leftProgressRing.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  
  // 设置初始偏移
  leftProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  leftProgressRing.style.strokeDashoffset = `${circumference}`;
  rightProgressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  rightProgressRing.style.strokeDashoffset = `${circumference}`;
  
  // 更新圆环进度
  function setProgress(ring, percent, percentageElement) {
    const offset = circumference - (percent / 100) * circumference;
    ring.style.strokeDashoffset = offset;
    if (percentageElement) {
      percentageElement.textContent = `${percent}%`;
    }
  }
  
  // 更新预览渐变
  function updatePreviewGradient(percent, color) {
    if (!previewGradient) return;
    const gradientOpacity = Math.min(0.8, percent / 100 * 0.8);
    previewGradient.style.opacity = gradientOpacity;
    previewGradient.style.background = `linear-gradient(135deg, ${color}40 0%, ${color}80 100%)`;
  }
  
  // 更新进度函数
  function updateProgress() {
    if (currentStage >= stages.length) {
      // 生成完成，显示结果
      showMainContentResult(aiMessage);
      return;
    }
    
    const targetPercent = stages[currentStage].percent;
    
    // 左右环形进度略有不同，模拟真实的双方案生成
    if (leftPercent < targetPercent) {
      leftPercent++;
      setProgress(leftProgressRing, leftPercent, leftPercentage);
    }
    
    if (rightPercent < targetPercent - 2 + Math.random() * 4) {
      rightPercent++;
      setProgress(rightProgressRing, rightPercent, rightPercentage);
    }
    
    // 更新预览渐变
    updatePreviewGradient(Math.max(leftPercent, rightPercent), stages[currentStage].color);
    
    // 更新状态文本
    if (centralStatus) {
      centralStatus.textContent = stages[currentStage].status;
    }
    
    if (processingSubstatus) {
      processingSubstatus.textContent = `正在创建两套设计方案...`;
    }
    
    // 检查是否两个环都达到了目标进度
    if (leftPercent >= targetPercent && rightPercent >= targetPercent - 3) {
      // 当前阶段完成，进入下一阶段
      currentStage++;
      
      // 如果还有下一阶段，延迟一下再继续
      if (currentStage < stages.length) {
        setTimeout(updateProgress, 500);
      } else {
        // 所有阶段完成，显示结果
        setTimeout(() => {
          showMainContentResult(aiMessage);
        }, 500);
      }
    } else {
      // 继续更新
      setTimeout(updateProgress, 30);
    }
  }
  
  // 开始更新进度
  console.log('开始更新双环进度');
  updateProgress();
}

// 在主内容区域显示生成结果
function showMainContentResult(aiMessage) {
  // 创建示例结果图片对
  const resultImagePairs = [
    // 每对数组包含两张图片，作为一组结果
    ['images/AIdesign/新房软装1.jpg', 'images/AIdesign/新房软装2.jpg'],
    ['images/AIdesign/旧房改造1.jpg', 'images/AIdesign/旧房改造2.jpg'],
    ['images/AIdesign/cf.jpg', 'images/AIdesign/kt.jpg']
  ];
  
  // 随机选择一对结果图
  const randomPair = resultImagePairs[Math.floor(Math.random() * resultImagePairs.length)] || resultImagePairs[0];
  
  // 获取处理元素
  const processingElement = aiMessage.querySelector('.message-processing');
  
  // 先添加淡出动画类
  processingElement.classList.add('fade-out-progress');
  
  // 等待淡出动画完成后替换内容
  setTimeout(() => {
    // 替换处理状态为双图结果内容
    processingElement.innerHTML = `
      <div class="result-image-container fade-in-results">
        <img src="${randomPair[0]}" alt="设计方案A" class="result-image" onclick="showFullImage('${randomPair[0]}')">
        <img src="${randomPair[1]}" alt="设计方案B" class="result-image" onclick="showFullImage('${randomPair[1]}')">
      </div>
    `;
    
    // 移除淡出动画类
    processingElement.classList.remove('fade-out-progress');
  }, 500);
  
  // 添加AI消息的元数据
  const messageContent = aiMessage.querySelector('.message-content');
  if (!messageContent.querySelector('.message-meta')) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'message-meta';
    metaDiv.innerHTML = `
      <span class="message-time">${new Date().toLocaleTimeString('zh-CN', {hour: '2-digit', minute:'2-digit'})}</span>
    `;
    messageContent.appendChild(metaDiv);
  }
  
  // 更新底部操作栏
  // const actionBar = document.querySelector('.action-bar');
  // if (actionBar) {
  //   actionBar.innerHTML = `
  //     <button class="action-button secondary" id="regenerateBtn">
  //       <i class="fas fa-sync-alt"></i> 重新生成
  //     </button>
  //     <button class="action-button primary" id="newDesignBtn">
  //       <i class="fas fa-plus"></i> 新设计
  //     </button>
  //     <button class="action-button accent" id="saveResultBtn">
  //       <i class="fas fa-heart"></i> 收藏
  //     </button>
  //   `;
    
  //   // 重新绑定事件
  //   const newDesignBtn = document.getElementById('newDesignBtn');
  //   if (newDesignBtn) {
  //     newDesignBtn.addEventListener('click', () => {
  //       openCreativeMode();
  //     });
  //   }
    
  //   // 添加重新生成按钮事件
  //   const regenerateBtn = document.getElementById('regenerateBtn');
  //   if (regenerateBtn) {
  //     regenerateBtn.addEventListener('click', () => {
  //       // 重置AI消息内容为处理状态
  //       messageContent.innerHTML = `
  //         <div class="message-processing">
  //           <!-- 这里的内容会被simulateMainContentProgress函数重新填充 -->
  //         </div>
  //       `;
        
  //       // 重置底部操作栏
  //       actionBar.innerHTML = `
  //         <button class="action-button primary" id="newDesignBtn">
  //           <i class="fas fa-plus"></i> 新设计
  //         </button>
  //       `;
        
  //       // 重新绑定新设计按钮事件
  //       const newBtn = document.getElementById('newDesignBtn');
  //       if (newBtn) {
  //         newBtn.addEventListener('click', () => {
  //           openCreativeMode();
  //         });
  //       }
        
  //       // 重新开始生成
  //       simulateMainContentProgress(aiMessage);
  //     });
  //   }
    
  //   // 添加收藏按钮事件
  //   const saveResultBtn = document.getElementById('saveResultBtn');
  //   if (saveResultBtn) {
  //     saveResultBtn.addEventListener('click', () => {
  //       // 显示收藏成功消息
  //       const toast = document.createElement('div');
  //       toast.className = 'toast-message';
  //       toast.textContent = '设计已添加到收藏';
  //       document.body.appendChild(toast);
        
  //       // 3秒后自动消失
  //       setTimeout(() => {
  //         toast.classList.add('fade-out');
  //         setTimeout(() => {
  //           if (toast.parentNode) {
  //             document.body.removeChild(toast);
  //           }
  //         }, 300);
  //       }, 2700);
  //     });
  //   }
  // }
}

// 创建粒子
function createParticles(container, color, count) {
  if (!container) return;
  
  // 清空容器
  container.innerHTML = '';
  
  // 获取容器尺寸，如果没有尺寸则使用默认值
  const containerWidth = container.offsetWidth || 100;
  const containerHeight = container.offsetHeight || 100;
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;
  const radius = Math.min(centerX, centerY) - 5;
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // 随机位置（沿着圆周）
    const angle = Math.random() * 2 * Math.PI;
    const distance = radius * (0.7 + Math.random() * 0.3); // 0.7-1.0倍半径
    
    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;
    
    // 随机大小
    const size = 2 + Math.random() * 3;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.backgroundColor = color;
    particle.style.opacity = 0.4 + Math.random() * 0.4;
    
    // 添加动画
    const duration = 2 + Math.random() * 4;
    const delay = Math.random() * 2;
    
    particle.style.animation = `moveParticle ${duration}s ${delay}s infinite`;
    
    container.appendChild(particle);
  }
  
  // 添加关键帧动画
  if (!document.getElementById('particle-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-keyframes';
    style.textContent = `
      @keyframes moveParticle {
        0% {
          transform: translate(0, 0) scale(1);
          opacity: 0.4;
        }
        50% {
          transform: translate(${Math.random() > 0.5 ? '+' : '-'}${5 + Math.random() * 10}px, ${Math.random() > 0.5 ? '+' : '-'}${5 + Math.random() * 10}px) scale(1.2);
          opacity: 0.8;
        }
        100% {
          transform: translate(0, 0) scale(1);
          opacity: 0.4;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// 新增：重置输入框及相关内容
function resetInputBox() {
  // 清空主输入框
  const composer = document.getElementById('composer');
  if (composer) {
    composer.value = '';
    composer.removeAttribute('readonly');
    composer.removeAttribute('disabled');
    composer.style.height = 'auto';
  }
  // 清空创作模式textarea
  const creativeTextarea = document.getElementById('creativeTextarea');
  if (creativeTextarea) {
    creativeTextarea.value = '';
    creativeTextarea.removeAttribute('readonly');
    creativeTextarea.removeAttribute('disabled');
    creativeTextarea.style.height = '60px';
  }
  // 清空可视化编辑区
  const userEditArea = document.getElementById('userEditArea');
  if (userEditArea) {
    userEditArea.innerText = '';
    userEditArea.removeAttribute('readonly');
    userEditArea.removeAttribute('disabled');
  }
  // 清空参数pills
  const pillsContainer = document.getElementById('pillsContainer');
  if (pillsContainer) {
    pillsContainer.innerHTML = '';
  }
}

// ... existing code ...