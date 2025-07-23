document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const productInquiry = document.getElementById('product-inquiry');
    const orderTracking = document.getElementById('order-tracking');
    const afterSales = document.getElementById('after-sales');
    const humanService = document.getElementById('human-service');
    const promotions = document.getElementById('promotions');
    const faq = document.getElementById('faq');
    const quickTags = document.querySelectorAll('.quick-tag');
    const faqDelivery = document.getElementById('faq-delivery');
    const faqReturn = document.getElementById('faq-return');
    const faqInstall = document.getElementById('faq-install');
    const chatContainer = document.getElementById('chat-container');
    
    // 检查用户来源，如果是从首页来的，添加特殊标识
    const serviceSource = localStorage.getItem('service_source');
    if (serviceSource === 'home') {
        const navTitle = document.querySelector('.nav-bar .text-lg');
        if (navTitle) {
            navTitle.innerHTML = `智能客服 <span class="ml-2 inline-block px-2 py-0.5 bg-brand-primary text-white text-xs rounded-full">首页咨询</span>`;
        }
    }
    
    // 初始化聊天界面
    initChat();
    
    // 发送按钮点击事件
    sendBtn.addEventListener('click', function() {
        sendMessage();
    });
    
    // 回车键发送消息
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    // 产品咨询点击事件 - 仅当元素存在时添加事件监听
    if (productInquiry) {
        productInquiry.addEventListener('click', function() {
            messageInput.value = "我想咨询一下产品的详细信息";
            messageInput.focus();
            
            // 添加用户消息到聊天界面
            addUserMessage("我想咨询一下产品的详细信息");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！您可以告诉我您对哪类家具感兴趣吗？比如沙发、床、餐桌等，我可以为您提供详细的产品信息和推荐。");
            }, 800);
        });
    }
    
    // 订单追踪点击事件 - 仅当元素存在时添加事件监听
    if (orderTracking) {
        orderTracking.addEventListener('click', function() {
            messageInput.value = "我想查询我的订单状态";
            messageInput.focus();
            
            // 添加用户消息到聊天界面
            addUserMessage("我想查询我的订单状态");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("请提供您的订单号，我将为您查询订单状态。如果您不记得订单号，也可以提供下单时间和购买的商品名称，我会尽力帮您查询。");
            }, 800);
        });
    }
    
    // 售后申请点击事件 - 仅当元素存在时添加事件监听
    if (afterSales) {
        afterSales.addEventListener('click', function() {
            messageInput.value = "我需要申请售后服务";
            messageInput.focus();
            
            // 添加用户消息到聊天界面
            addUserMessage("我需要申请售后服务");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！请问您需要哪种售后服务？我们提供退货、换货、维修等服务。您可以提供订单号和具体问题，我们会尽快为您处理。");
            }, 800);
        });
    }
    
    // 转人工点击事件 - 仅当元素存在时添加事件监听
    if (humanService) {
        humanService.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("我想转接人工客服");
            
            // 添加系统消息
            addSystemMessage("正在为您转接人工客服，请稍候...");
            
            setTimeout(() => {
                addHumanMessage("您好，我是客服小美，很高兴为您服务。请问有什么可以帮助您的？");
            }, 1500);
        });
    }
    
    // 优惠活动点击事件 - 仅当元素存在时添加事件监听
    if (promotions) {
        promotions.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("我想了解最新的优惠活动");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！我们目前有以下优惠活动：\n1. 新人首单满1000减100\n2. 卧室家具套装8折优惠\n3. 限时特价：精选实木餐桌5折起\n\n您对哪个活动感兴趣？可以点击了解详情。");
            }, 800);
        });
    }
    
    // 常见问题卡片点击事件 - 仅当元素存在时添加事件监听
    if (faqDelivery) {
        faqDelivery.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("发货时间一般是多久？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！正常情况下，您下单后7-12个工作日内完成发货。发货后4-6天送达，您可在「订单详情」页实时追踪物流进度。");
            }, 800);
        });
    }
    
    if (faqReturn) {
        faqReturn.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("如何申请退换货？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！申请退换货的步骤如下：1. 进入我的订单，找到相应订单 2. 点击申请售后按钮 3. 选择退货或换货选项 4. 填写申请原因并上传照片 5. 提交申请等待审核。非质量问题需在7天内申请，质量问题需在30天内申请。");
            }, 800);
        });
    }
    
    if (faqInstall) {
        faqInstall.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("安装服务是否收费？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！关于安装服务的收费情况：\n\n1. 标准家具（床、沙发、餐桌等）：首次安装免费\n2. 大型复杂家具（衣柜、书柜等）：首次安装免费\n3. 二次上门安装：收取上门费100元起\n4. 非本店购买商品：收取安装费，具体费用视商品复杂度而定\n\n免费安装服务仅限于商品送达时一并完成，如您选择暂不安装，后续需要安装服务将收取费用。");
            }, 800);
        });
    }
    
    // 新增常见问题卡片 - 家具保养
    const faqMaintenance = document.getElementById('faq-maintenance');
    if (faqMaintenance) {
        faqMaintenance.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("家具如何保养？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！关于家具保养，以下是几点建议：\n\n1. 木质家具：避免阳光直射，定期使用家具蜡保养，擦拭时使用微湿的软布\n\n2. 皮质家具：每3-6个月使用专业皮革清洁剂，避免尖锐物品划伤，远离热源\n\n3. 布艺家具：定期吸尘，遇到污渍立即处理，建议1-2年进行一次专业清洗\n\n4. 金属家具：保持干燥，定期擦拭，发现氧化及时处理\n\n如需获取特定家具的保养指南，欢迎随时咨询我们！");
            }, 800);
        });
    }
    
    // 修改常见问题卡片 - 家具尺寸选择改为沙发质保
    const faqSize = document.getElementById('faq-size');
    if (faqSize) {
        faqSize.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("沙发的质保有哪些？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！我们沙发的质保政策如下：\n\n1. 皮革类面料：质保一年\n2. 电机部分：质保三年\n3. 框架结构：质保十年\n\n如有任何质量问题，请及时联系我们的客服，我们将按照质保政策为您提供售后服务。");
            }, 800);
        });
    }
    
    // 新增常见问题卡片 - 沙发塌陷问题
    const faqSofaSink = document.getElementById('faq-sofa-sink');
    if (faqSofaSink) {
        faqSofaSink.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("沙发用了一段时间出现塌陷怎么办？");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("您好！关于沙发塌陷问题的解决方案：\n\n【质保期内】\n1. 提交照片/视频\n2. 客服审核\n3. 免费维修或更换填充物\n\n【质保期外】\n付费维修服务（维修师傅上门）\n\n如需申请维修服务，可以联系我们的客服热线或在线提交售后申请。");
            }, 800);
        });
    }
    
    // 快捷标签点击事件
    quickTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const tagText = this.textContent.trim();
            messageInput.value = tagText;
            messageInput.focus();
        });
    });
    
    // 常见问题点击事件 - 仅当元素存在时添加事件监听
    if (faq) {
        faq.addEventListener('click', function() {
            // 添加用户消息到聊天界面
            addUserMessage("我想查看常见问题解答");
            
            // 添加AI回复
            setTimeout(() => {
                addAiMessage("以下是我们的常见问题：\n1. 家具如何保养？\n2. 送货时间一般是多久？\n3. 如何申请退换货？\n4. 安装服务是否收费？\n\n请问您想了解哪个问题？");
            }, 800);
        });
    }
    
    // 发送消息函数
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message) {
            // 添加用户消息到聊天界面
            addUserMessage(message);
            
            // 清空输入框
            messageInput.value = '';
            
            // 模拟AI回复
            setTimeout(() => {
                addAiMessage("感谢您的提问！我正在处理您的问题，请稍候...");
                
                // 模拟思考时间
                setTimeout(() => {
                    addAiMessage("我已经找到了一些信息，希望对您有所帮助。如果您有其他问题，请随时告诉我。");
                }, 1500);
            }, 800);
        }
    }
    
    // 添加用户消息到聊天界面
    function addUserMessage(text) {
        const chatContainer = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 添加AI消息到聊天界面
    function addAiMessage(text) {
        const chatContainer = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ai';
        messageDiv.textContent = text;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 添加系统消息到聊天界面
    function addSystemMessage(text) {
        const chatContainer = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message system';
        messageDiv.textContent = text;
        messageDiv.style.backgroundColor = '#f0f0f0';
        messageDiv.style.color = '#666';
        messageDiv.style.fontStyle = 'italic';
        messageDiv.style.textAlign = 'center';
        messageDiv.style.maxWidth = '100%';
        messageDiv.style.padding = '8px 12px';
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 添加人工客服消息到聊天界面
    function addHumanMessage(text) {
        const chatContainer = document.getElementById('chat-container');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message human';
        
        // 创建头像和文本的容器
        const contentDiv = document.createElement('div');
        contentDiv.className = 'flex items-start';
        
        // 添加客服头像
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'w-8 h-8 rounded-full overflow-hidden mr-2 flex-shrink-0';
        const avatar = document.createElement('img');
        avatar.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';
        avatar.className = 'w-full h-full object-cover';
        avatarDiv.appendChild(avatar);
        
        // 添加文本和名称
        const textContainer = document.createElement('div');
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'text-xs text-brand-error font-medium mb-1';
        nameDiv.textContent = '客服小美';
        
        const textDiv = document.createElement('div');
        textDiv.textContent = text;
        
        textContainer.appendChild(nameDiv);
        textContainer.appendChild(textDiv);
        
        contentDiv.appendChild(avatarDiv);
        contentDiv.appendChild(textContainer);
        
        messageDiv.appendChild(contentDiv);
        messageDiv.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // 初始化聊天界面
    function initChat() {
        // 确保聊天容器滚动到底部
        chatContainer.scrollTop = chatContainer.scrollHeight;
        
        // 移除可能重复的事件监听器
        const allCards = document.querySelectorAll('.faq-card, .tool-card');
        allCards.forEach(card => {
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);
        });
        
        // 设置欢迎信息
        const serviceSource = localStorage.getItem('service_source') || '';
        const serviceTime = localStorage.getItem('service_time') || '';
        let welcomeMessage = "您好！我是小夏，很高兴为您服务，请问有什么可以帮您的？";
        
        // 根据不同来源显示不同的欢迎信息
        if (serviceSource === 'home') {
            welcomeMessage = "您好！感谢您从首页进入客服页面。我是小夏，有什么可以帮您解决的问题吗？";
        } else if (serviceSource === 'product') {
            welcomeMessage = "您好！看起来您正在浏览我们的产品。我是小夏，有关于产品的疑问都可以问我。";
        } else if (serviceSource === 'cart') {
            welcomeMessage = "您好！我看到您正在购物车页面有疑问。我是小夏，购物相关问题都可以咨询我。";
        } else if (serviceSource === 'order') {
            welcomeMessage = "您好！我看到您正在查看订单。我是小夏，订单相关问题都可以咨询我。";
        }
        
        // 添加AI欢迎消息
        setTimeout(() => {
            addAiMessage(welcomeMessage);
        }, 500);
        
        // 重新绑定常见问题卡片事件 - 仅当元素存在时添加事件监听
        const faqDeliveryElement = document.getElementById('faq-delivery');
        if (faqDeliveryElement) {
            faqDeliveryElement.addEventListener('click', function() {
                addUserMessage("发货时间一般是多久？");
                setTimeout(() => {
                    addAiMessage("您好！正常情况下，您下单后7-12个工作日内完成发货。发货后4-6天送达，您可在「订单详情」页实时追踪物流进度。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const faqReturnElement = document.getElementById('faq-return');
        if (faqReturnElement) {
            faqReturnElement.addEventListener('click', function() {
                addUserMessage("如何申请退换货？");
                setTimeout(() => {
                    addAiMessage("您好！申请退换货的步骤如下：1. 进入我的订单，找到相应订单 2. 点击申请售后按钮 3. 选择退货或换货选项 4. 填写申请原因并上传照片 5. 提交申请等待审核。非质量问题需在7天内申请，质量问题需在30天内申请。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const faqInstallElement = document.getElementById('faq-install');
        if (faqInstallElement) {
            faqInstallElement.addEventListener('click', function() {
                addUserMessage("安装服务是否收费？");
                setTimeout(() => {
                    addAiMessage("您好！关于安装服务的收费情况：\n\n1. 标准家具（床、沙发、餐桌等）：首次安装免费\n2. 大型复杂家具（衣柜、书柜等）：首次安装免费\n3. 二次上门安装：收取上门费100元起\n4. 非本店购买商品：收取安装费，具体费用视商品复杂度而定\n\n免费安装服务仅限于商品送达时一并完成，如您选择暂不安装，后续需要安装服务将收取费用。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        // 新增常见问题卡片 - 家具保养
        const faqMaintenanceElement = document.getElementById('faq-maintenance');
        if (faqMaintenanceElement) {
            faqMaintenanceElement.addEventListener('click', function() {
                addUserMessage("家具如何保养？");
                setTimeout(() => {
                    addAiMessage("您好！关于家具保养，以下是几点建议：\n\n1. 木质家具：避免阳光直射，定期使用家具蜡保养，擦拭时使用微湿的软布\n\n2. 皮质家具：每3-6个月使用专业皮革清洁剂，避免尖锐物品划伤，远离热源\n\n3. 布艺家具：定期吸尘，遇到污渍立即处理，建议1-2年进行一次专业清洗\n\n4. 金属家具：保持干燥，定期擦拭，发现氧化及时处理\n\n如需获取特定家具的保养指南，欢迎随时咨询我们！");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        // 修改常见问题卡片 - 家具尺寸选择改为沙发质保
        const faqSizeElement = document.getElementById('faq-size');
        if (faqSizeElement) {
            faqSizeElement.addEventListener('click', function() {
                addUserMessage("沙发的质保有哪些？");
                setTimeout(() => {
                    addAiMessage("您好！我们沙发的质保政策如下：\n\n1. 皮革类面料：质保一年\n2. 电机部分：质保三年\n3. 框架结构：质保十年\n\n如有任何质量问题，请及时联系我们的客服，我们将按照质保政策为您提供售后服务。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        // 新增常见问题卡片 - 沙发塌陷问题
        const faqSofaSinkElement = document.getElementById('faq-sofa-sink');
        if (faqSofaSinkElement) {
            faqSofaSinkElement.addEventListener('click', function() {
                addUserMessage("沙发用了一段时间出现塌陷怎么办？");
                setTimeout(() => {
                    addAiMessage("您好！关于沙发塌陷问题的解决方案：\n\n【质保期内】\n1. 提交照片/视频\n2. 客服审核\n3. 免费维修或更换填充物\n\n【质保期外】\n付费维修服务（维修师傅上门）\n\n如需申请维修服务，可以联系我们的客服热线或在线提交售后申请。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        // 重新绑定底部工具栏事件 - 仅当元素存在时添加事件监听
        const productInquiryElement = document.getElementById('product-inquiry');
        if (productInquiryElement) {
            productInquiryElement.addEventListener('click', function() {
                messageInput.value = "我想咨询一下产品的详细信息";
                messageInput.focus();
                addUserMessage("我想咨询一下产品的详细信息");
                setTimeout(() => {
                    addAiMessage("您好！您可以告诉我您对哪类家具感兴趣吗？比如沙发、床、餐桌等，我可以为您提供详细的产品信息和推荐。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const orderTrackingElement = document.getElementById('order-tracking');
        if (orderTrackingElement) {
            orderTrackingElement.addEventListener('click', function() {
                messageInput.value = "我想查询我的订单状态";
                messageInput.focus();
                addUserMessage("我想查询我的订单状态");
                setTimeout(() => {
                    addAiMessage("请提供您的订单号，我将为您查询订单状态。如果您不记得订单号，也可以提供下单时间和购买的商品名称，我会尽力帮您查询。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const afterSalesElement = document.getElementById('after-sales');
        if (afterSalesElement) {
            afterSalesElement.addEventListener('click', function() {
                messageInput.value = "我需要申请售后服务";
                messageInput.focus();
                addUserMessage("我需要申请售后服务");
                setTimeout(() => {
                    addAiMessage("您好！请问您需要哪种售后服务？我们提供退货、换货、维修等服务。您可以提供订单号和具体问题，我们会尽快为您处理。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const humanServiceElement = document.getElementById('human-service');
        if (humanServiceElement) {
            humanServiceElement.addEventListener('click', function() {
                addUserMessage("我想转接人工客服");
                addSystemMessage("正在为您转接人工客服，请稍候...");
                setTimeout(() => {
                    addHumanMessage("您好，我是客服小美，很高兴为您服务。请问有什么可以帮助您的？");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 1500);
            });
        }
        
        const promotionsElement = document.getElementById('promotions');
        if (promotionsElement) {
            promotionsElement.addEventListener('click', function() {
                addUserMessage("我想了解最新的优惠活动");
                setTimeout(() => {
                    addAiMessage("您好！我们目前有以下优惠活动：\n1. 新人首单满1000减100\n2. 卧室家具套装8折优惠\n3. 限时特价：精选实木餐桌5折起\n\n您对哪个活动感兴趣？可以点击了解详情。");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
        
        const faqElement = document.getElementById('faq');
        if (faqElement) {
            faqElement.addEventListener('click', function() {
                addUserMessage("我想查看常见问题解答");
                setTimeout(() => {
                    addAiMessage("以下是我们的常见问题：\n1. 家具如何保养？\n2. 送货时间一般是多久？\n3. 如何申请退换货？\n4. 安装服务是否收费？\n\n请问您想了解哪个问题？");
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                }, 800);
            });
        }
    }
}); 