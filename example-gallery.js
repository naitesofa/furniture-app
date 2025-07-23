// 示例图选择功能
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const referencePreview = document.getElementById('referencePreview');
  const referenceImage = document.getElementById('referenceImage');
  const localFileUpload = document.getElementById('localFileUpload');
  const uploadImageBtn = document.getElementById('uploadImageBtn');
  const exampleThumbsRow = document.querySelector('.example-thumbs-row');
  
  console.log('DOM元素加载状态:', {
    referencePreview: !!referencePreview,
    referenceImage: !!referenceImage,
    localFileUpload: !!localFileUpload,
    uploadImageBtn: !!uploadImageBtn,
    exampleThumbsRow: !!exampleThumbsRow
  });
  
  // 当前设计类型
  let currentDesignType = '毛坯房设计'; // 默认设计类型
  
  // 示例图数据 - 按设计类型分组
  const exampleImagesByType = {
    '毛坯房设计': [
      {
        id: 'cf',
        thumbnail: 'images/AIdesign/cf.jpg',
        fullImage: 'images/AIdesign/cf.jpg',
        type: '客厅',
        description: '客厅毛坯图'
      },
      {
        id: 'kt',
        thumbnail: 'images/AIdesign/kt.jpg',
        fullImage: 'images/AIdesign/kt.jpg',
        type: '厨房',
        description: '厨房毛坯图'
      }
    ],
    '旧屋改造': [
      {
        id: 'old1',
        thumbnail: 'images/AIdesign/旧房改造1.jpg',
        fullImage: 'images/AIdesign/旧房改造1.jpg',
        type: '客厅',
        description: '旧房改造客厅图'
      },
      {
        id: 'old2',
        thumbnail: 'images/AIdesign/旧房改造2.jpg',
        fullImage: 'images/AIdesign/旧房改造2.jpg',
        type: '厨房',
        description: '旧房改造厨房图'
      }
    ],
    '新房软装': [
      {
        id: 'new1',
        thumbnail: 'images/AIdesign/新房软装1.jpg',
        fullImage: 'images/AIdesign/新房软装1.jpg',
        type: '客厅',
        description: '新房软装客厅图'
      },
      {
        id: 'new2',
        thumbnail: 'images/AIdesign/新房软装2.jpg',
        fullImage: 'images/AIdesign/新房软装2.jpg',
        type: '厨房',
        description: '新房软装厨房图'
      }
    ]
  };
  
  // 获取当前设计类型的示例图
  function getCurrentExampleImages() {
    return exampleImagesByType[currentDesignType] || exampleImagesByType['毛坯房设计'];
  }
  
  // 更新示例图缩略图
  function updateExampleThumbs() {
    if (!exampleThumbsRow) return;
    
    // 清空现有示例图
    exampleThumbsRow.innerHTML = '';
    
    // 获取当前设计类型的示例图
    const currentExamples = getCurrentExampleImages();
    
    // 创建并添加新的示例图缩略图
    currentExamples.forEach(example => {
      const thumbContainer = document.createElement('div');
      thumbContainer.className = 'example-thumb-container';
      thumbContainer.dataset.id = example.id;
      
      thumbContainer.innerHTML = `
        <img src="${example.thumbnail}" alt="${example.description}" class="example-thumb">
      `;
      
      // 添加点击事件
      thumbContainer.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // 获取示例图ID
        const exampleId = this.dataset.id;
        console.log('点击示例图:', exampleId);
        useExample(exampleId);
      });
      
      // 添加触摸反馈效果
      thumbContainer.addEventListener('touchstart', function(e) {
        this.style.transform = 'scale(0.95)';
        this.style.opacity = '0.9';
      }, { passive: true });
      
      ['touchend', 'touchcancel'].forEach(event => {
        thumbContainer.addEventListener(event, function() {
          this.style.transform = '';
          this.style.opacity = '';
        }, { passive: true });
      });
      
      exampleThumbsRow.appendChild(thumbContainer);
    });
    
    console.log(`已更新示例图缩略图，当前设计类型: ${currentDesignType}`);
  }
  
  // 设置当前设计类型并更新示例图
  window.setExampleDesignType = function(designType) {
    if (designType && exampleImagesByType[designType]) {
      currentDesignType = designType;
      updateExampleThumbs();
      console.log(`设计类型已更改为: ${designType}`);
    }
  };
  
  // 使用选中的示例图
  function useExample(exampleId) {
    if (!referenceImage || !referencePreview) return;
    
    console.log('选择示例图:', exampleId);
    
    // 获取当前设计类型的示例图
    const currentExamples = getCurrentExampleImages();
    
    // 查找对应的示例图数据
    const example = currentExamples.find(item => item.id === exampleId);
    if (!example) return;
    
    // 设置参考图
    referenceImage.src = example.fullImage;
    
    // 显示参考图预览区域，隐藏上传按钮
    referencePreview.classList.remove('hidden');
    if (uploadImageBtn) {
      uploadImageBtn.style.visibility = 'hidden';
    }
    
    // 隐藏示例图缩略图行
    if (exampleThumbsRow) {
      exampleThumbsRow.classList.add('hidden');
    }
    
    // 更新创作状态（如果存在此函数）
    if (typeof updateCreativeState === 'function') {
      updateCreativeState();
    }
    
    // 如果当前选择的是户型，更新文本模板
    if (example.type && typeof updateTemplateText === 'function') {
      updateTemplateText('户型', example.type);
    }
    
    // 自动聚焦到用户编辑区
    setTimeout(() => {
      if (typeof focusUserEditArea === 'function') {
        focusUserEditArea();
      }
    }, 300);
  }
  
  // 处理本地文件上传
  function handleLocalFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    console.log('选择本地文件:', file.name);
    
    // 检查文件是否为图片
    if (!file.type.startsWith('image/')) {
      console.error('请选择图片文件');
      return;
    }
    
    // 创建文件URL
    const fileURL = URL.createObjectURL(file);
    
    // 设置参考图
    if (referenceImage) {
      referenceImage.src = fileURL;
    }
    
    // 显示参考图预览区域，隐藏上传按钮
    if (referencePreview) {
      referencePreview.classList.remove('hidden');
    }
    if (uploadImageBtn) {
      uploadImageBtn.style.visibility = 'hidden';
    }
    
    // 隐藏示例图缩略图行
    if (exampleThumbsRow) {
      exampleThumbsRow.classList.add('hidden');
    }
    
    // 更新创作状态（如果存在此函数）
    if (typeof updateCreativeState === 'function') {
      updateCreativeState();
    }
    
    // 自动聚焦到用户编辑区
    setTimeout(() => {
      if (typeof focusUserEditArea === 'function') {
        focusUserEditArea();
      }
    }, 300);
    
    // 重置文件输入，以便可以再次选择相同的文件
    event.target.value = '';
  }
  
  // 初始化事件监听
  function initEventListeners() {
    // 本地文件上传事件
    if (localFileUpload) {
      localFileUpload.addEventListener('change', handleLocalFileUpload);
    }
    
    // 上传图片按钮点击事件 - 直接触发文件选择
    if (uploadImageBtn && localFileUpload) {
      uploadImageBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        // 直接点击隐藏的文件输入框，打开文件选择对话框
        localFileUpload.click();
      });
    }
    
    // 移除参考图按钮点击事件
    const removeReferenceBtn = document.querySelector('.remove-reference-btn');
    if (removeReferenceBtn) {
      removeReferenceBtn.addEventListener('click', function() {
        // 隐藏预览区域，显示上传按钮
        referencePreview.classList.add('hidden');
        if (uploadImageBtn) {
          uploadImageBtn.style.visibility = 'visible';
        }
        
        // 显示示例图缩略图行
        if (exampleThumbsRow) {
          exampleThumbsRow.classList.remove('hidden');
        }
        
        // 清除参考图
        setTimeout(() => {
          referenceImage.src = '#';
        }, 300);
        
        // 更新创作状态（如果存在此函数）
        if (typeof updateCreativeState === 'function') {
          updateCreativeState();
        }
      });
    }
    
    // 监听设计类型按钮点击事件
    document.addEventListener('click', function(e) {
      const targetBtn = e.target.closest('.style-btn[data-type="设计"]');
      if (targetBtn) {
        const designType = targetBtn.dataset.style;
        window.setExampleDesignType(designType);
      }
    });
  }
  
  // 初始化
  function init() {
    console.log('初始化示例图功能');
    // 初始化事件监听
    initEventListeners();
    
    // 初始化示例图缩略图
    updateExampleThumbs();
    
    // 添加触摸反馈效果
    addTouchFeedback();
  }
  
  // 添加触摸反馈效果
  function addTouchFeedback() {
    // 需要添加触摸反馈的元素
    const touchElements = document.querySelectorAll('.local-upload-btn, .example-thumb-container, .remove-reference-btn');
    
    touchElements.forEach(element => {
      // 触摸开始时
      element.addEventListener('touchstart', function(e) {
        this.style.transform = 'scale(0.95)';
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
  
  // 调用初始化函数
  init();
}); 