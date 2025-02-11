document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('img[src$=".gif"]').forEach(img => {
        const container = document.createElement('div');
        container.className = 'gif-container';
        img.parentNode.replaceChild(container, img);
        container.appendChild(img);

        // 创建加载提示
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'gif-loading-container';
        loadingContainer.textContent = '加载中...';
        container.appendChild(loadingContainer);

        // 创建播放、重播和暂停按钮
        const playButton = document.createElement('button');
        playButton.className = 'gif-play-button';
        playButton.style.display = 'none';
        
        const replayButton = document.createElement('button');
        replayButton.className = 'gif-replay-button';
        replayButton.style.display = 'none';
        
        const pauseButton = document.createElement('button');
        pauseButton.className = 'gif-pause-button';
        pauseButton.style.display = 'none';
        
        container.appendChild(playButton);
        container.appendChild(replayButton);
        container.appendChild(pauseButton);

        // 初始化 GIF 控制器
        const gifCtrl = new SuperGif({
            gif: img,
            auto_play: false,
            loop_mode: false,
            show_progress_bar: true,
            progressbar_height: 4,
            progressbar_background_color: 'rgba(0, 0, 0, 0.3)',
            progressbar_foreground_color: 'rgba(255, 255, 255, 0.9)',
            on_end: function() {
                // GIF 播放结束时的处理
                gifCtrl.pause();
                gifCtrl.move_to(0);
                replayButton.style.display = 'block';
                pauseButton.style.display = 'none';
            }
        });

        // 加载 GIF
        gifCtrl.load(() => {
            // 加载完成后移除加载提示并显示播放按钮
            loadingContainer.remove();
            playButton.style.display = 'block';
            
            // 确保初始状态显示第一帧
            gifCtrl.move_to(0);
            
            // 播放按钮点击事件
            playButton.addEventListener('click', () => {
                playButton.style.display = 'none';
                replayButton.style.display = 'none';
                gifCtrl.play();
            });

            // 重播按钮点击事件
            replayButton.addEventListener('click', () => {
                replayButton.style.display = 'none';
                pauseButton.style.display = 'none';  // 确保暂停按钮隐藏
                gifCtrl.move_to(0);
                gifCtrl.play();
            });

            // 添加鼠标悬停事件
            container.addEventListener('mouseenter', () => {
                // 只有在GIF正在播放且不是初始或结束状态时才显示暂停按钮
                if (gifCtrl.get_playing() && 
                    playButton.style.display === 'none' && 
                    replayButton.style.display === 'none') {
                    pauseButton.style.display = 'block';
                }
            });

            container.addEventListener('mouseleave', () => {
                pauseButton.style.display = 'none';
            });

            // 暂停按钮点击事件
            pauseButton.addEventListener('click', () => {
                gifCtrl.pause();
                pauseButton.style.display = 'none';
                playButton.style.display = 'block';
            });
        });
    });
});