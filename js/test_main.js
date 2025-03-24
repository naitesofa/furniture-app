document.addEventListener('DOMContentLoaded', function() {
    // 立即隐藏骨架屏
    document.getElementById('skeletonList').style.display = 'none';
    document.getElementById('skeletonGrid').style.display = 'none';
    
    // 显示产品列表
    document.getElementById('productList').style.display = 'block';
    
    console.log('test_main.js 已执行，骨架屏应该已经隐藏');
}); 