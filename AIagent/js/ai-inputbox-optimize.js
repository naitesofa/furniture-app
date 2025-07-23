// ai-inputbox-optimize.js
// 专注于AI设计页面底部输入框的行为优化
// 点击生成/发送后，自动清空输入框并保持可编辑

(function() {
  // 适配不同页面的输入框和生成按钮ID或class
  // 请根据实际页面结构调整选择器
  const inputSelectors = [
    '#ai-input', // 假设AI设计输入框ID
    '.ai-input', // 或class
    'textarea[data-role="ai-input"]' // 其他可能的选择器
  ];
  const sendBtnSelectors = [
    '#ai-send-btn',
    '.ai-send-btn',
    'button[data-role="ai-send"]',
    '.generate-btn',
    '.send-btn'
  ];

  function getInputEl() {
    for (const sel of inputSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }
  function getSendBtn() {
    for (const sel of sendBtnSelectors) {
      const el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function clearInputBox() {
    const input = getInputEl();
    if (input) {
      input.value = '';
      input.removeAttribute('readonly');
      input.removeAttribute('disabled');
      input.focus();
    }
  }

  function bindSendEvent() {
    const btn = getSendBtn();
    if (btn) {
      btn.addEventListener('click', function() {
        setTimeout(clearInputBox, 0); // 等待主逻辑执行后清空
      });
    }
    // 兼容回车发送
    const input = getInputEl();
    if (input) {
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          setTimeout(clearInputBox, 0);
        }
      });
    }
  }

  // 页面加载后自动绑定
  document.addEventListener('DOMContentLoaded', bindSendEvent);
})(); 