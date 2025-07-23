/**
 * 翻牌式进度独立测试脚本
 * 直接在页面添加一个测试按钮，点击后可以查看翻牌效果
 */

// 在文档加载后初始化
// document.addEventListener('DOMContentLoaded', function() {
//   console.log('翻牌测试脚本加载');
  
//   // 添加测试按钮
//   const testButton = document.createElement('button');
//   testButton.id = 'flip-test-button';
//   testButton.textContent = '点击测试翻牌效果';
//   testButton.style.position = 'fixed';
//   testButton.style.top = '50%';
//   testButton.style.left = '50%';
//   testButton.style.transform = 'translate(-50%, -50%)';
//   testButton.style.zIndex = '9999';
//   testButton.style.padding = '15px 25px';
//   testButton.style.backgroundColor = '#E76F51';
//   testButton.style.color = 'white';
//   testButton.style.border = 'none';
//   testButton.style.borderRadius = '8px';
//   testButton.style.cursor = 'pointer';
//   testButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
//   testButton.style.fontSize = '18px';
//   testButton.style.fontWeight = 'bold';
//   testButton.style.animation = 'pulse 2s infinite';
  
//   // 添加脉冲动画
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes pulse {
//       0% { transform: translate(-50%, -50%) scale(1); }
//       50% { transform: translate(-50%, -50%) scale(1.05); }
//       100% { transform: translate(-50%, -50%) scale(1); }
//     }
//   `;
//   document.head.appendChild(style);
  
//   // 添加点击事件
//   testButton.addEventListener('click', function() {
//     console.log('开始翻牌测试');
//     testButton.style.display = 'none';
    
//     // 创建测试容器
//     const testContainer = document.createElement('div');
//     testContainer.style.position = 'fixed';
//     testContainer.style.top = '50%';
//     testContainer.style.left = '50%';
//     testContainer.style.transform = 'translate(-50%, -50%)';
//     testContainer.style.width = '80%';
//     testContainer.style.maxWidth = '800px';
//     testContainer.style.minHeight = '400px';
//     testContainer.style.backgroundColor = 'white';
//     testContainer.style.borderRadius = '12px';
//     testContainer.style.boxShadow = '0 5px 20px rgba(0,0,0,0.2)';
//     testContainer.style.padding = '20px';
//     testContainer.style.zIndex = '9998';
    
//     // 创建标题
//     const title = document.createElement('h2');
//     title.textContent = '翻牌式进度测试';
//     title.style.textAlign = 'center';
//     title.style.marginBottom = '20px';
//     title.style.color = '#264653';
//     testContainer.appendChild(title);
    
//     // 创建翻牌容器
//     const flipContainer = document.createElement('div');
//     flipContainer.id = 'flipProgressTest';
//     flipContainer.style.width = '100%';
//     flipContainer.style.minHeight = '300px';
//     testContainer.appendChild(flipContainer);
    
//     // 创建关闭按钮
//     const closeButton = document.createElement('button');
//     closeButton.textContent = '关闭测试';
//     closeButton.style.display = 'block';
//     closeButton.style.margin = '20px auto 0';
//     closeButton.style.padding = '10px 20px';
//     closeButton.style.backgroundColor = '#2A9D8F';
//     closeButton.style.color = 'white';
//     closeButton.style.border = 'none';
//     closeButton.style.borderRadius = '6px';
//     closeButton.style.cursor = 'pointer';
//     closeButton.addEventListener('click', function() {
//       document.body.removeChild(testContainer);
//       testButton.style.display = 'block';
//     });
//     testContainer.appendChild(closeButton);
    
//     // 添加到页面
//     document.body.appendChild(testContainer);
    
//     // 图片路径
//     const resultImagePair = [
//       './images/AIdesign/新房软装1.jpg', 
//       './images/AIdesign/旧房改造1.jpg'
//     ];
    
//     // 初始化翻牌进度
//     const flipProgress = new FlipCardProgress('flipProgressTest', {
//       progressDuration: 5000, // 5秒完成（测试用）
//       preloadImages: resultImagePair,
//       initialText: '处理中...',
//       completingText: '即将完成...',
//       showStatus: true, // 显示状态文本
//       aspectRatio: '3:4'
//     });
    
//     // 开始进度显示
//     flipProgress.start();
//   });
  
//   // 添加到页面
//   document.body.appendChild(testButton);
// }); 