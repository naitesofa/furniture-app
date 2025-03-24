/**
 * 底部导航栏交互逻辑
 * 所有页面共享的底部导航栏交互行为
 */

document.addEventListener('DOMContentLoaded', function() {
    // 底部标签栏交互效果
    const tabItems = document.querySelectorAll('.tab-item');
    
    // 页面加载时为活动标签添加动画
    window.addEventListener('load', function() {
        const activeTab = document.querySelector('.tab-item.active');
        if (activeTab) {
            const icon = activeTab.querySelector('.tab-icon i');
            icon.classList.add('animated');
            setTimeout(() => {
                icon.classList.remove('animated');
            }, 300);
        }
    });
    
    tabItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 如果已经是活动标签，不执行任何操作
            if (this.classList.contains('active')) {
                e.preventDefault();
                return;
            }
            
            // 添加页面过渡动画
            document.body.classList.add('page-transition');
            
            // 为点击的图标添加动画
            const icon = this.querySelector('.tab-icon i');
            icon.classList.add('animated');
            
            // 延迟导航，让动画有时间播放
            if (!this.classList.contains('active')) {
                e.preventDefault();
                setTimeout(() => {
                    // 在跳转前移除动画类
                    icon.classList.remove('animated');
                    window.location.href = this.getAttribute('href');
                }, 200);
            }
        });
    });
    
    // 页面加载完成后移除过渡类
    window.addEventListener('pageshow', function() {
        setTimeout(() => {
            document.body.classList.remove('page-transition');
        }, 300);
    });
}); 