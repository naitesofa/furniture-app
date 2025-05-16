// 沙发定制页面提交按钮显示修复脚本
(function() {
    // 在页面加载完成后运行
    window.addEventListener('load', function() {
        console.log('[SUBMIT-FIX] 提交按钮显示修复脚本已加载');
        
        // 立即检查当前是否处于第5步
        checkAndShowSubmitButton();
        
        // 监听步骤变化
        setupStepChangeListeners();
        
        // 使用MutationObserver监听DOM变化
        setupDomChangeObserver();
    });
    
    // 检查当前步骤并显示/隐藏提交按钮
    function checkAndShowSubmitButton() {
        const activeContent = document.querySelector('.step-content.active');
        if (!activeContent) return;
        
        const currentStep = parseInt(activeContent.getAttribute('data-step'));
        const nextBtn = document.getElementById('nextStep');
        const submitBtn = document.getElementById('submitOrder');
        
        if (!nextBtn || !submitBtn) {
            console.error('[SUBMIT-FIX] 未找到导航按钮，无法修复显示');
            return;
        }
        
        console.log('[SUBMIT-FIX] 当前步骤:', currentStep);
        
        if (currentStep === 5) {
            console.log('[SUBMIT-FIX] 已检测到第5步，显示提交按钮');
            nextBtn.style.display = 'none';
            submitBtn.style.display = 'block';
        } else {
            console.log('[SUBMIT-FIX] 当前非第5步，显示下一步按钮');
            nextBtn.style.display = 'block';
            submitBtn.style.display = 'none';
        }
    }
    
    // 监听步骤变化
    function setupStepChangeListeners() {
        // 监听步骤指示器点击事件
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.addEventListener('click', function() {
                setTimeout(checkAndShowSubmitButton, 200);
            });
        });
        
        // 监听上一步按钮点击事件
        const prevBtn = document.getElementById('prevStep');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                setTimeout(checkAndShowSubmitButton, 200);
            });
        }
        
        // 监听下一步按钮点击事件
        const nextBtn = document.getElementById('nextStep');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                setTimeout(checkAndShowSubmitButton, 200);
            });
        }
    }
    
    // 使用MutationObserver监听DOM变化
    function setupDomChangeObserver() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    mutation.target.classList.contains('active') &&
                    mutation.target.classList.contains('step-content')) {
                    
                    // 当步骤内容的类发生变化且包含active类时，检查步骤
                    setTimeout(checkAndShowSubmitButton, 50);
                }
            });
        });
        
        // 监听所有步骤内容元素的类变化
        const stepContents = document.querySelectorAll('.step-content');
        stepContents.forEach(content => {
            observer.observe(content, { attributes: true });
        });
    }
})(); 