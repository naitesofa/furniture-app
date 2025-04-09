// 沙发定制页步骤导航修复脚本
(function() {
    // 在页面加载完成后运行
    window.addEventListener('load', function() {
        console.log('[FIX] 步骤导航修复脚本已加载');
        
        // 获取步骤导航元素
        const stepsElements = document.querySelectorAll('.step');
        const stepContents = document.querySelectorAll('.step-content');
        const prevBtnElement = document.getElementById('prevStep');
        const nextBtnElement = document.getElementById('nextStep');
        
        // 重置当前步骤
        let currentStep = 1;
        
        // 定义更新步骤的函数
        function updateSteps(stepNumber) {
            console.log('[FIX] 更新步骤: ' + stepNumber);
            
            // 更新步骤指示器
            document.querySelectorAll('.step').forEach(step => {
                const stepNum = parseInt(step.getAttribute('data-step'));
                step.classList.remove('active');
                step.classList.remove('completed');
                
                if (stepNum === stepNumber) {
                    step.classList.add('active');
                } else if (stepNum < stepNumber) {
                    step.classList.add('completed');
                }
            });
            
            // 更新内容显示
            document.querySelectorAll('.step-content').forEach(content => {
                content.classList.remove('active');
                if (parseInt(content.getAttribute('data-step')) === stepNumber) {
                    content.classList.add('active');
                }
            });
            
            // 更新底部导航按钮状态
            const prevBtn = document.getElementById('prevStep');
            const nextBtn = document.getElementById('nextStep');
            
            if (prevBtn) {
                prevBtn.disabled = stepNumber === 1;
                if (stepNumber === 1) {
                    prevBtn.classList.add('disabled');
                } else {
                    prevBtn.classList.remove('disabled');
                }
            }
            
            if (nextBtn) {
                nextBtn.disabled = stepNumber === 5;
                if (stepNumber === 5) {
                    nextBtn.textContent = '完成';
                    nextBtn.classList.add('complete');
                } else {
                    nextBtn.textContent = '下一步';
                    nextBtn.classList.remove('complete');
                }
            }
            
            // 当进入步骤3时，确保尺寸调整功能正常初始化
            if (stepNumber === 3 && typeof initializeDimensionsSettings === 'function') {
                setTimeout(() => {
                    console.log("[FIX] 进入步骤3，初始化尺寸调整功能");
                    initializeDimensionsSettings();
                    
                    // 显示提示消息，告知用户沙发预览功能已移除
                    if (typeof showToast === 'function') {
                        showToast('沙发预览功能已移除，您可以通过"调整具体尺寸"来自定义沙发尺寸');
                    }
                    
                    // 尝试高亮显示尺寸调整按钮
                    const foldBtn = document.getElementById('dimensions-fold-btn');
                    if (foldBtn) {
                        foldBtn.classList.add('highlight-change');
                        setTimeout(function() {
                            foldBtn.classList.remove('highlight-change');
                        }, 2000);
                    }
                }, 100);
            }
            
            // 当进入步骤2时，确保面料卡片点击事件正常工作
            if (stepNumber === 2) {
                setTimeout(() => {
                    console.log("[FIX] 进入步骤2，修复面料卡片点击事件");
                    fixFabricCardEvents();
                }, 100);
            }
            
            // 更新全局currentStep变量
            currentStep = stepNumber;
        }
        
        // 直接使用原生DOM API实现事件绑定，避免使用cloneNode等可能有问题的方法
        
        // 如果有下一步按钮，移除已有事件并添加新事件
        if (nextBtnElement) {
            // 创建一个完全相同的新按钮替换旧按钮
            const newNextBtn = document.createElement('button');
            newNextBtn.id = 'nextStep';
            newNextBtn.className = nextBtnElement.className;
            newNextBtn.innerHTML = nextBtnElement.innerHTML;
            
            // 替换按钮
            nextBtnElement.parentNode.replaceChild(newNextBtn, nextBtnElement);
            
            // 为新按钮添加事件监听器
            newNextBtn.onclick = function(e) {
                console.log('[FIX] 下一步按钮被点击，当前步骤: ' + currentStep);
                if (currentStep < 5) {
                    updateSteps(currentStep + 1);
                } else {
                    // 最后一步，确认订单
                    alert('订单已提交！我们将尽快处理您的定制请求。');
                }
                return false;
            };
            
            console.log('[FIX] 下一步按钮事件已重新绑定');
        }
        
        // 如果有上一步按钮，移除已有事件并添加新事件
        if (prevBtnElement) {
            // 创建一个完全相同的新按钮替换旧按钮
            const newPrevBtn = document.createElement('button');
            newPrevBtn.id = 'prevStep';
            newPrevBtn.className = prevBtnElement.className;
            newPrevBtn.innerHTML = prevBtnElement.innerHTML;
            
            // 替换按钮
            prevBtnElement.parentNode.replaceChild(newPrevBtn, prevBtnElement);
            
            // 为新按钮添加事件监听器
            newPrevBtn.onclick = function(e) {
                console.log('[FIX] 上一步按钮被点击，当前步骤: ' + currentStep);
                if (currentStep > 1) {
                    updateSteps(currentStep - 1);
                }
                return false;
            };
            
            // 确保初始状态正确
            if (currentStep === 1) {
                newPrevBtn.disabled = true;
                newPrevBtn.classList.add('disabled');
            }
            
            console.log('[FIX] 上一步按钮事件已重新绑定');
        }
        
        // 处理步骤指示器点击事件
        stepsElements.forEach(step => {
            // 创建一个新的步骤指示器元素
            const newStep = step.cloneNode(true);
            
            // 添加点击事件
            newStep.addEventListener('click', function() {
                const stepNum = parseInt(this.getAttribute('data-step'));
                console.log('[FIX] 步骤指示器 ' + stepNum + ' 被点击，当前步骤: ' + currentStep);
                
                // 只允许跳转到已完成的步骤或下一步
                if (stepNum <= Math.max(currentStep, 2)) {
                    updateSteps(stepNum);
                }
            });
            
            // 替换原元素
            step.parentNode.replaceChild(newStep, step);
        });
        
        // 修复面料卡片点击事件
        function fixFabricCardEvents() {
            // 获取所有面料卡片
            const fabricCards = document.querySelectorAll('.fabric-card');
            
            if (fabricCards && fabricCards.length > 0) {
                console.log(`[FIX] 找到${fabricCards.length}个面料卡片，修复点击事件`);
                
                fabricCards.forEach(card => {
                    // 移除旧事件监听器并添加新的
                    const newCard = card.cloneNode(true);
                    
                    // 为新卡片添加点击事件
                    newCard.addEventListener('click', function(e) {
                        console.log('[FIX] 面料卡片被点击');
                        
                        // 获取面料型号
                        const fabricModel = this.querySelector('.fabric-model').textContent;
                        
                        // 获取特性标签
                        const features = Array.from(this.querySelectorAll('.feature-tag'))
                            .map(tag => tag.textContent)
                            .join('、');
                        
                        // 获取价格信息
                        const price = this.querySelector('.fabric-price').textContent;
                        
                        // 获取预览图片（使用轮播中的第一张图片）
                        const previewImage = this.querySelector('.fabric-img.active')?.src || 
                                            this.querySelector('.fabric-img')?.src;
                        
                        if (!previewImage) {
                            console.error('[FIX] 无法找到面料预览图片');
                            return;
                        }
                        
                        // 构建面料数据对象
                        const fabricData = {
                            model: fabricModel,
                            category: features.includes('头层牛皮') ? '头层牛皮' : 
                                    features.includes('高级绒面') ? '高级绒面' : 
                                    features.includes('亚麻面料') ? '亚麻面料' : '标准面料',
                            material: features.includes('头层牛皮') ? '黄牛皮' : 
                                    features.includes('高级绒面') ? '绒面布' : 
                                    features.includes('亚麻面料') ? '亚麻' : '混纺',
                            price: price,
                            features: features,
                            previewImg: previewImage,
                            selectedColor: 'gray', // 默认选中灰色
                            colorPreviewImgs: {
                                'gray': previewImage,
                                'beige': previewImage,
                                'blue': previewImage,
                                'green': previewImage,
                                'brown': previewImage,
                                'red': previewImage,
                                'black': previewImage
                            }
                        };
                        
                        // 调用打开面料模态框函数
                        if (typeof window.openFabricModal === 'function') {
                            window.openFabricModal(fabricData);
                        } else {
                            console.error('[FIX] openFabricModal函数未定义');
                            // 尝试定义一个简单的模态框打开函数
                            const fabricModal = document.getElementById('fabricModal');
                            if (fabricModal) {
                                // 填充模态框内容
                                const modalImg = document.getElementById('modalPreviewImg');
                                if (modalImg) modalImg.src = previewImage;
                                
                                const modelEl = document.getElementById('fabricModel');
                                if (modelEl) modelEl.textContent = fabricModel;
                                
                                const categoryEl = document.getElementById('fabricCategory');
                                if (categoryEl) categoryEl.textContent = fabricData.category;
                                
                                const priceEl = document.getElementById('fabricPrice');
                                if (priceEl) priceEl.textContent = price;
                                
                                const materialEl = document.getElementById('fabricMaterial');
                                if (materialEl) materialEl.textContent = fabricData.material;
                                
                                const colorEl = document.getElementById('fabricColor');
                                if (colorEl) colorEl.textContent = '灰色';
                                
                                const featuresEl = document.getElementById('fabricFeatures');
                                if (featuresEl) {
                                    featuresEl.innerHTML = '';
                                    features.split('、').forEach(feature => {
                                        const tagEl = document.createElement('span');
                                        tagEl.className = 'detail-tag';
                                        tagEl.textContent = feature;
                                        featuresEl.appendChild(tagEl);
                                    });
                                }
                                
                                // 显示模态框
                                fabricModal.classList.add('show');
                                
                                // 添加关闭按钮事件
                                const closeBtn = fabricModal.querySelector('.close-modal');
                                if (closeBtn) {
                                    closeBtn.addEventListener('click', function() {
                                        fabricModal.classList.remove('show');
                                    });
                                }
                            }
                        }
                    });
                    
                    // 处理轮播点的点击事件，避免冒泡
                    const carouselDots = newCard.querySelectorAll('.carousel-dot');
                    carouselDots.forEach((dot, index) => {
                        dot.addEventListener('click', function(e) {
                            e.stopPropagation();
                            const slides = this.closest('.fabric-carousel').querySelectorAll('.fabric-img');
                            const allDots = this.closest('.carousel-nav').querySelectorAll('.carousel-dot');
                            
                            // 移除所有active类
                            slides.forEach(slide => slide.classList.remove('active'));
                            allDots.forEach(d => d.classList.remove('active'));
                            
                            // 将当前的设为active
                            slides[index].classList.add('active');
                            this.classList.add('active');
                        });
                    });
                    
                    // 替换原卡片
                    card.parentNode.replaceChild(newCard, card);
                });
                
                console.log('[FIX] 面料卡片点击事件已修复');
                
                // 如果已定义面料模态框但还没有初始化，手动初始化
                if (!window.openFabricModal && typeof setupFabricModal === 'function') {
                    console.log('[FIX] 初始化面料模态框控制器');
                    const fabricModalController = setupFabricModal();
                    window.openFabricModal = fabricModalController.openFabricModal;
                    window.closeFabricModal = fabricModalController.closeFabricModal;
                }
            } else {
                console.warn('[FIX] 未找到面料卡片元素');
            }
        }
        
        // 确保第一步被激活
        updateSteps(1);
        
        // 检查当前是否处于第二步（面料选择），如果是则立即修复面料卡片
        if (document.querySelector('.step-content[data-step="2"].active')) {
            console.log('[FIX] 当前在步骤2，立即修复面料卡片点击事件');
            fixFabricCardEvents();
        }
        
        console.log('[FIX] 步骤导航已修复');
    });
})(); 