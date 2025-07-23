// Design Type Switcher 交互逻辑（科技感升级版）
(function(){
  const DESIGN_TYPES = [
    { key: 'rough', label: '毛坯房设计', desc: '空间结构生成', icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="5" y="13" width="18" height="9" rx="2.5" stroke="#2a9d8f" stroke-width="2.2"/><polygon points="14,6 24,13 4,13" fill="none" stroke="#2a9d8f" stroke-width="2.2"/></svg>` },
    { key: 'new', label: '新房软装设计', desc: '软装搭配推荐', icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="6" y="15" width="16" height="6" rx="2.5" stroke="#2a9d8f" stroke-width="2.2"/><rect x="9" y="11" width="10" height="6" rx="2.5" stroke="#2a9d8f" stroke-width="2.2"/></svg>` },
    { key: 'old', label: '旧房改造', desc: '空间焕新改造', icon: `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="5" y="13" width="18" height="9" rx="2.5" stroke="#2a9d8f" stroke-width="2.2"/><path d="M14 8v4" stroke="#2a9d8f" stroke-width="2.2" stroke-linecap="round"/><path d="M10 10l4-4 4 4" stroke="#2a9d8f" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>` }
  ];

  function createOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'design-type-overlay';
    overlay.tabIndex = -1;
    return overlay;
  }

  function createMenu(selectedKey, onSelect) {
    const menu = document.createElement('div');
    menu.className = 'design-type-menu';
    // 拖拽条
    const dragBar = document.createElement('div');
    dragBar.className = 'design-type-dragbar';
    menu.appendChild(dragBar);
    DESIGN_TYPES.forEach(type => {
      const item = document.createElement('div');
      item.className = 'design-type-item' + (type.key === selectedKey ? ' selected' : '');
      item.innerHTML = `<span class="icon">${type.icon}</span><span class="label-desc"><span class="label">${type.label}</span><span class="desc">${type.desc}</span></span>`;
      item.onclick = () => onSelect(type.key);
      menu.appendChild(item);
    });
    return menu;
  }

  function showDesignTypeMenu(selectedKey, onSelect) {
    if(document.querySelector('.design-type-overlay')) return;
    const overlay = createOverlay();
    const menu = createMenu(selectedKey, (key) => {
      close();
      onSelect && onSelect(key);
    });
    overlay.appendChild(menu);
    document.body.appendChild(overlay);
    setTimeout(()=>{
      overlay.classList.add('show');
      menu.classList.add('show');
    }, 10);
    function close() {
      overlay.classList.remove('show');
      menu.classList.remove('show');
      setTimeout(()=>{
        overlay.remove();
      }, 350);
    }
    overlay.onclick = (e) => {
      if(e.target === overlay) close();
    };
    return close;
  }

  window.showDesignTypeMenu = showDesignTypeMenu;
})(); 