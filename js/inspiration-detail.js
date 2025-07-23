// 创意详情页面脚本
document.addEventListener('DOMContentLoaded', function() {
    // 添加页面加载动画
    document.body.classList.add('page-loaded');
    
    // 获取URL参数
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    // 如果没有ID参数，返回到发现页面
    if (!articleId) {
        window.location.href = 'discover.html';
        return;
    }
    
    // 对于北欧风格小户型改造页面，内容已经在HTML中静态定义
    // 仅需加载相关推荐和购物车数量
    if (articleId === '1') {
        // 添加图片加载完成事件
        const images = document.querySelectorAll('.article-content img');
        images.forEach(img => {
            img.onload = function() {
                this.classList.add('img-loaded');
            };
            // 如果图片已经缓存，可能不会触发onload事件
            if (img.complete) {
                img.classList.add('img-loaded');
            }
        });
        
        // 加载相关推荐
        loadRelatedArticles(articleId);
        
        // 加载购物车数量
        loadCartBadge();
        
        // 添加分享按钮事件
        setupShareButtons();
    } else {
        // 其他文章ID，动态加载内容
        loadArticleContent(articleId);
        loadRelatedArticles(articleId);
        loadCartBadge();
    }
    
    // 添加滚动效果
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // 初始检查
});

// 滚动显示效果
function revealOnScroll() {
    const elements = document.querySelectorAll('.article-content h2, .article-content h3, .article-content p, .article-content ul, .article-content blockquote');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('element-visible');
        }
    });
}

// 设置分享按钮事件
function setupShareButtons() {
    const shareButtons = document.querySelectorAll('.share-btn');
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    
    shareButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            let shareUrl = '';
            
            switch(index) {
                case 0: // 微信
                    alert('请使用微信扫一扫，分享本页面');
                    break;
                case 1: // 微博
                    shareUrl = `http://service.weibo.com/share/share.php?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
                    window.open(shareUrl, '_blank');
                    break;
                case 2: // QQ
                    shareUrl = `http://connect.qq.com/widget/shareqq/index.html?url=${encodeURIComponent(pageUrl)}&title=${encodeURIComponent(pageTitle)}`;
                    window.open(shareUrl, '_blank');
                    break;
            }
        });
    });
}

// 加载文章内容
function loadArticleContent(id) {
    // 模拟的文章数据
    const articles = {
        '2': {
            title: '客厅沙发摆放技巧',
            coverImage: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
            date: '2023年7月8日',
            views: '2,876',
            tags: ['客厅设计', '沙发摆放', '家居技巧'],
            content: `
                <p>沙发是客厅的核心家具，其摆放位置和方式直接影响着整个空间的舒适度和美观度。本文将分享6个实用的沙发摆放技巧，帮助您打造更加协调美观的客厅。</p>
                
                <img src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" alt="客厅沙发" loading="lazy">
                
                <h2>1. 考虑交通流线</h2>
                <p>沙发的摆放首先要考虑客厅的交通流线。沙发不应该阻碍人们在客厅中的移动，应该留出足够的通道空间。一般来说，主要通道应保持至少80-100厘米的宽度，以确保人们可以舒适地通过。</p>
                
                <p>在确定沙发位置时，可以先在地面上用胶带或报纸模拟沙发的大小和位置，然后走动几次，感受流线是否顺畅。</p>
                
                <h2>2. 与电视或焦点墙对齐</h2>
                <p>大多数客厅都有一个视觉焦点，可能是电视墙、壁炉或一面装饰墙。沙发应该与这个焦点对齐，形成一个视觉中心。这样不仅方便观看电视或欣赏焦点墙，还能使整个空间看起来更加和谐。</p>
                
                <img src="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg" alt="客厅布局" loading="lazy">
                
                <h2>3. 创造对话区域</h2>
                <p>沙发的摆放应该有利于家人和客人之间的交流。理想的对话距离是1.8-2.4米，超过这个距离会让交谈变得困难。可以考虑将沙发和扶手椅摆成U形或L形，创造一个舒适的对话区域。</p>
                
                <p>在大型客厅中，可以创建多个对话区域，满足不同的社交需求。</p>
                
                <h2>4. 利用墙面作为靠背</h2>
                <p>将沙发靠墙摆放是最常见的做法，这样可以节省空间，并给人一种安全感。但要注意不要让所有的家具都贴墙摆放，这样会让空间显得呆板。可以将一部分家具，如茶几、边几等放在空间中央，创造层次感。</p>
                
                <h2>5. 平衡比例与尺寸</h2>
                <p>沙发的大小应该与客厅的面积相匹配。在小客厅中，可以选择小巧的两人沙发或L形沙发；在大客厅中，可以选择大型的组合沙发或多个沙发组合使用。</p>
                
                <p>同时，沙发的高度也应该与其他家具协调。一般来说，沙发、扶手椅和边几的座面或台面高度应该接近，这样使用起来更加舒适。</p>
                
                <h3>沙发摆放的常见误区</h3>
                <ul>
                    <li>所有家具都贴墙摆放，使空间显得呆板</li>
                    <li>沙发尺寸过大或过小，与空间不协调</li>
                    <li>忽略了交通流线，导致行走不便</li>
                    <li>对话距离过远，不利于交流</li>
                    <li>没有考虑自然光线，导致沙发区域过暗或者阳光直射</li>
                </ul>
                
                <h2>6. 考虑光线因素</h2>
                <p>自然光和人工光对客厅的氛围有重要影响。在摆放沙发时，应该考虑光线的来源和方向。避免将沙发直接对着窗户摆放，这样会导致强光直射，影响舒适度。</p>
                
                <blockquote>
                    沙发摆放没有绝对的标准，关键是要根据自己家的实际情况和生活习惯来灵活调整，创造一个既美观又实用的客厅空间。
                </blockquote>
                
                <p>通过以上6个技巧，相信您可以找到最适合自己家的沙发摆放方式，让客厅焕然一新。记住，最好的设计是既符合美学标准，又满足实际生活需求的设计。</p>
                
                <div class="article-footer">
                    <div class="share-section">
                        <span class="share-title">分享文章：</span>
                        <div class="share-buttons">
                            <a href="#" class="share-btn" aria-label="分享到微信"><i class="fab fa-weixin"></i></a>
                            <a href="#" class="share-btn" aria-label="分享到微博"><i class="fab fa-weibo"></i></a>
                            <a href="#" class="share-btn" aria-label="分享到QQ"><i class="fab fa-qq"></i></a>
                        </div>
                    </div>
                    <div class="article-author">
                        <img src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg" alt="家居顾问李明" class="author-avatar">
                        <div class="author-info">
                            <div class="author-name">家居顾问李明</div>
                            <div class="author-title">专业家居顾问</div>
                        </div>
                    </div>
                </div>
            `
        },
        '3': {
            title: '多功能家具创意设计',
            coverImage: 'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg',
            date: '2023年8月20日',
            views: '4,120',
            tags: ['创意设计', '多功能家具', '空间利用'],
            content: `
                <p>在现代都市生活中，住宅空间越来越紧张，多功能家具因其实用性和创新性，成为了小户型家居的理想选择。本文将介绍几款创新的多功能家具设计，帮助您在有限的空间内实现最大的价值。</p>
                
                <img src="https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg" alt="多功能家具" loading="lazy">
                
                <h2>变形餐桌：从小到大的空间魔术师</h2>
                <p>变形餐桌是小户型家居的理想选择。平时可以折叠成小巧的边桌，需要用餐时可以展开成为4-6人的餐桌。有些设计甚至集成了储物功能，桌面下方设有抽屉或储物格，可以存放餐具、餐巾等物品。</p>
                
                <p>最新的变形餐桌设计还考虑到了高度的可调节性，既可以作为普通餐桌使用，也可以降低高度作为茶几使用，满足不同场景的需求。</p>
                
                <h2>沙发床：客厅与卧室的完美结合</h2>
                <p>沙发床是多功能家具中的经典之作。白天是舒适的沙发，晚上可以展开成为舒适的床铺。现代沙发床的设计已经大大提升了舒适度，解决了传统沙发床睡眠体验差的问题。</p>
                
                <img src="https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg" alt="沙发床" loading="lazy">
                
                <p>一些高端沙发床还集成了储物功能，座位下方可以存放被褥、枕头等物品。有些设计甚至加入了USB充电接口、阅读灯等现代化功能，提升使用体验。</p>
                
                <h2>升降书桌：工作与生活的灵活切换</h2>
                <p>随着居家办公的普及，升降书桌成为了热门的多功能家具。它可以根据需要调节高度，既可以坐着使用，也可以站着使用，有效减轻长时间久坐带来的健康问题。</p>
                
                <p>一些创新设计的升降书桌还可以折叠收纳，不使用时可以推到墙边，占用极小的空间。有些甚至集成了显示器支架、线缆管理系统等功能，为居家办公创造更加舒适的环境。</p>
                
                <h2>墙床系统：隐藏式的睡眠空间</h2>
                <p>墙床（也称为Murphy床）是一种可以垂直折叠到墙内或柜体内的床。白天可以完全隐藏，释放出宝贵的活动空间；晚上只需简单操作，就能展开成为舒适的床铺。</p>
                
                <p>现代墙床系统的设计更加智能化，有些甚至可以通过遥控器或手机APP控制，实现自动展开和收纳。一些高端设计还集成了书柜、工作台等功能，进一步提升了空间利用率。</p>
                
                <h3>选择多功能家具的考虑因素</h3>
                <ul>
                    <li>质量与耐用性：由于需要频繁变形，结构必须坚固</li>
                    <li>操作便捷性：变形机制应该简单易用，不需要太大力气</li>
                    <li>美观性：即使是多功能家具，也应该符合整体家居风格</li>
                    <li>实用性：功能应该真正满足日常需求，而不是华而不实</li>
                    <li>价格：性价比应该合理，不一定最贵的就是最好的</li>
                </ul>
                
                <h2>智能储物系统：空间利用的极致表现</h2>
                <p>智能储物系统是多功能家具中的新秀。通过模块化设计和智能控制，可以根据需要调整内部结构，最大化利用每一寸空间。一些设计还集成了感应灯、自动开合等功能，提升使用体验。</p>
                
                <blockquote>
                    多功能家具不仅仅是空间的节省者，更是现代生活方式的体现。它们融合了设计美学、工程技术和人体工学，为我们创造了更加灵活、舒适的生活环境。
                </blockquote>
                
                <p>随着技术的不断进步和设计理念的创新，多功能家具将会有更多令人惊喜的发展。在选择多功能家具时，除了考虑其变形功能外，还应该关注其质量、舒适度和与整体家居风格的协调性，这样才能真正实现"实用与美观并存"的理想状态。</p>
                
                <div class="article-footer">
                    <div class="share-section">
                        <span class="share-title">分享文章：</span>
                        <div class="share-buttons">
                            <a href="#" class="share-btn" aria-label="分享到微信"><i class="fab fa-weixin"></i></a>
                            <a href="#" class="share-btn" aria-label="分享到微博"><i class="fab fa-weibo"></i></a>
                            <a href="#" class="share-btn" aria-label="分享到QQ"><i class="fab fa-qq"></i></a>
                        </div>
                    </div>
                    <div class="article-author">
                        <img src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg" alt="创意设计师张三" class="author-avatar">
                        <div class="author-info">
                            <div class="author-name">创意设计师张三</div>
                            <div class="author-title">创意设计专家</div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    // 获取当前文章数据
    const article = articles[id];
    if (!article) {
        window.location.href = 'discover.html';
        return;
    }
    
    // 更新页面标题
    document.title = article.title + ' - 家逸生活';
    
    // 更新封面图
    document.getElementById('cover-image').src = article.coverImage;
    document.getElementById('cover-image').alt = article.title;
    
    // 更新文章标题
    document.getElementById('article-title').textContent = article.title;
    
    // 更新发布日期和浏览量
    document.getElementById('article-date').textContent = article.date;
    document.getElementById('article-views').textContent = article.views;
    
    // 更新标签
    const tagsContainer = document.getElementById('article-tags');
    tagsContainer.innerHTML = ''; // 清空现有标签
    article.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'article-tag';
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
    });
    
    // 更新文章内容
    document.getElementById('article-content').innerHTML = article.content;
    
    // 添加图片加载完成事件
    const images = document.querySelectorAll('.article-content img');
    images.forEach(img => {
        img.onload = function() {
            this.classList.add('img-loaded');
        };
        // 如果图片已经缓存，可能不会触发onload事件
        if (img.complete) {
            img.classList.add('img-loaded');
        }
    });
    
    // 设置分享按钮事件
    setupShareButtons();
}

// 加载相关推荐
function loadRelatedArticles(currentId) {
    // 模拟的相关文章数据
    const relatedArticles = [
        {
            id: '1',
            title: '北欧风格小户型改造',
            image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            desc: '60平米的小户型如何打造出宽敞舒适的北欧风格家居，这个案例告诉你答案。'
        },
        {
            id: '2',
            title: '客厅沙发摆放技巧',
            image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
            desc: '沙发是客厅的核心，如何摆放才能让空间更加协调美观？6个实用技巧分享。'
        },
        {
            id: '3',
            title: '多功能家具创意设计',
            image: 'https://images.pexels.com/photos/1668860/pexels-photo-1668860.jpeg',
            desc: '这些创新的多功能家具设计，让你的小空间发挥最大价值，实用与美观并存。'
        }
    ];
    
    // 过滤掉当前文章
    const filteredArticles = relatedArticles.filter(article => article.id !== currentId);
    
    // 更新相关推荐
    const relatedContainer = document.getElementById('related-container');
    relatedContainer.innerHTML = ''; // 清空容器
    
    filteredArticles.forEach(article => {
        const cardElement = document.createElement('div');
        cardElement.className = 'related-card';
        cardElement.onclick = function() {
            window.location.href = `inspiration-detail.html?id=${article.id}`;
        };
        
        cardElement.innerHTML = `
            <img src="${article.image}" class="related-image" alt="${article.title}" loading="lazy">
            <div class="related-content">
                <div class="related-card-title">${article.title}</div>
                <div class="related-card-desc">${article.desc}</div>
            </div>
        `;
        
        relatedContainer.appendChild(cardElement);
    });
}

// 加载购物车数量
function loadCartBadge() {
    // 模拟从localStorage获取购物车数量
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const cartBadge = document.getElementById('cart-badge');
    cartBadge.textContent = cartItems.length;
    
    // 如果购物车为空，隐藏徽章
    if (cartItems.length === 0) {
        cartBadge.style.display = 'none';
    } else {
        cartBadge.style.display = 'flex';
    }
}
