console.log('%cCopyright © 2024 Iceuu.net',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function (event) {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});







document.addEventListener('DOMContentLoaded', function () {

    // 粒子背景动画
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0;
        let mouseY = 0;
        let animationId;

        // 设置canvas尺寸
        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // 粒子类
        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.hue = Math.random() * 60 + 180; // 蓝色到青色范围
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // 鼠标交互
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 100) {
                    const force = (100 - distance) / 100;
                    this.x -= dx * force * 0.02;
                    this.y -= dy * force * 0.02;
                }

                // 边界检查
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
                ctx.fill();
            }
        }

        // 创建粒子
        function createParticles() {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        createParticles();

        // 绘制连线
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = (1 - distance / 120) * 0.15;
                        ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 绘制粒子
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // 绘制连线
            drawConnections();

            animationId = requestAnimationFrame(animate);
        }
        animate();

        // 鼠标跟踪
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 窗口调整时重新创建粒子
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
    }
});




var pageLoading = document.querySelector("#Iceuu-loading");
window.addEventListener('load', function() {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
        setTimeout(function() {
            pageLoading.style.display = 'none';
        }, 500);
    }, 100);
});


// 计算网站运行时间
function calculateUptime() {
    const startDate = new Date('2025-09-20'); // 网站起始日期
    const currentDate = new Date();
    const timeDiff = currentDate.getTime() - startDate.getTime();
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    document.getElementById('website-uptime').textContent = days;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', calculateUptime);


// Music Player Logic
document.addEventListener('DOMContentLoaded', function () {
    const musicPlayer = document.getElementById('music-player');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    const playIconSmall = document.getElementById('play-icon-small');
    const pauseIconSmall = document.getElementById('pause-icon-small');
    const lyricsDisplay = document.getElementById('lyrics-display');
    const lyricsContainer = document.getElementById('lyrics-container');
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const recordPlayer = document.querySelector('.record-player');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const playBtn = document.getElementById('play-btn');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeRange = document.getElementById('volume-range');

    let sound;
    let isPlaying = false;
    let currentSongIndex = 0;
    let lyrics = [];
    let lyricsInterval;
    let volume = 0.8;
    let playlist = [];

    // 从API获取音乐列表
    async function fetchMusicList() {
        try {
            const response = await fetch('/api/music');
            const result = await response.json();
            
            if (result.success && result.data.length > 0) {
                playlist = result.data;
                console.log(`成功加载 ${playlist.length} 首歌曲`);
                
                // 加载第一首歌曲
                loadSong(currentSongIndex);
            } else {
                console.error('没有找到音乐文件');
                // 使用默认音乐
                playlist = [{
                    title: '暂无音乐',
                    artist: '请添加音乐文件',
                    src: '',
                    cover: '/static/img/music.png',
                    lyrics: null
                }];
            }
        } catch (error) {
            console.error('获取音乐列表失败:', error);
            // 使用默认音乐
            playlist = [{
                title: '我好像在哪见过你',
                artist: '薛之谦',
                src: './static/music/我好像在哪见过你 - 薛之谦.mp3',
                cover: '/static/img/music.png',
                lyrics: './static/music/我好像在哪见过你 - 薛之谦.lrc'
            }];
            loadSong(currentSongIndex);
        }
    }

    function loadSong(index) {
        if (playlist.length === 0) {
            console.error('播放列表为空');
            return;
        }
        
        if (sound) {
            sound.stop();
            sound.unload();
        }

        const song = playlist[index];
        recordPlayer.querySelector('img').src = song.cover;
        
        // 更新歌曲信息
        if (songTitle) songTitle.textContent = song.title;
        if (songArtist) songArtist.textContent = song.artist;

        // Load lyrics
        if (song.lyrics) {
            fetch(song.lyrics)
                .then(response => response.text())
                .then(text => {
                    lyrics = parseLRC(text);
                    lyricsDisplay.textContent = '';
                })
                .catch(error => {
                    console.error('Error loading lyrics:', error);
                    lyrics = [];
                    lyricsDisplay.textContent = '';
                });
        } else {
            lyrics = [];
            lyricsDisplay.textContent = '';
            // 无歌词时隐藏歌词容器
            lyricsContainer.style.display = 'none';
        }

        sound = new Howl({
            src: [song.src],
            html5: true,
            volume: volume,
            onplay: function () {
                isPlaying = true;
                updatePlayPauseIcons(true);
                recordPlayer.classList.add('playing');
                requestAnimationFrame(updateProgressBar);
                if (lyrics.length > 0) {
                    lyricsContainer.style.display = 'block';
                    lyricsInterval = setInterval(displayLyrics, 500);
                }
                // 更新总时长
                if (totalTimeEl) {
                    totalTimeEl.textContent = formatTime(sound.duration());
                }
            },
            onpause: function () {
                isPlaying = false;
                updatePlayPauseIcons(false);
                recordPlayer.classList.remove('playing');
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
            },
            onend: function () {
                isPlaying = false;
                updatePlayPauseIcons(false);
                recordPlayer.classList.remove('playing');
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
                // 自动播放下一首
                nextSong();
            },
            onstop: function () {
                isPlaying = false;
                updatePlayPauseIcons(false);
                recordPlayer.classList.remove('playing');
                progressBar.style.width = '0%';
                if (currentTimeEl) currentTimeEl.textContent = '0:00';
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
            }
        });
    }

    function updatePlayPauseIcons(playing) {
        if (playing) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
            if (playIconSmall) playIconSmall.style.display = 'none';
            if (pauseIconSmall) pauseIconSmall.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
            if (playIconSmall) playIconSmall.style.display = 'block';
            if (pauseIconSmall) pauseIconSmall.style.display = 'none';
        }
    }

    function playPause() {
        if (!sound) {
            loadSong(currentSongIndex);
            sound.play();
            return;
        }
        
        if (sound.playing()) {
            sound.pause();
        } else {
            sound.play();
        }
    }

    function nextSong() {
        if (playlist.length === 0) return;
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            sound.play();
        }
    }

    function prevSong() {
        if (playlist.length === 0) return;
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        if (isPlaying) {
            sound.play();
        }
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    function parseLRC(lrcText) {
        const lines = lrcText.split('\n');
        const parsedLyrics = [];
        const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

        lines.forEach(line => {
            const match = timeRegex.exec(line);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = parseInt(match[3], 10) * (match[3].length === 2 ? 10 : 1);
                const time = (minutes * 60 + seconds) * 1000 + milliseconds;
                const text = line.replace(timeRegex, '').trim();
                parsedLyrics.push({ time, text });
            }
        });
        return parsedLyrics.sort((a, b) => a.time - b.time);
    }

    function displayLyrics() {
        if (!sound) return;
        const currentTime = sound.seek() * 1000;
        let currentLyric = '';

        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                currentLyric = lyrics[i].text;
                break;
            }
        }
        lyricsDisplay.textContent = currentLyric;
    }

    function updateProgressBar() {
        if (sound && sound.playing()) {
            const seek = sound.seek() || 0;
            const duration = sound.duration() || 0;
            const progress = (seek / duration) * 100;
            progressBar.style.width = progress + '%';
            
            // 更新当前时间
            if (currentTimeEl) {
                currentTimeEl.textContent = formatTime(seek);
            }
            
            requestAnimationFrame(updateProgressBar);
        }
    }

    // 进度条点击事件
    progressBarContainer.addEventListener('click', function (e) {
        if (!sound) return;
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = sound.duration();
        sound.seek((clickX / width) * duration);
    });

    // 播放/暂停按钮事件
    playPauseBtn.addEventListener('click', playPause);
    if (playBtn) {
        playBtn.addEventListener('click', playPause);
    }

    // 上一首/下一首按钮事件
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSong);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSong);
    }

    // 音量控制事件
    if (volumeRange) {
        volumeRange.addEventListener('input', function() {
            volume = this.value / 100;
            if (sound) {
                sound.volume(volume);
            }
            // 更新音量条样式
            this.style.setProperty('--volume-percent', this.value + '%');
        });
        // 初始化音量
        volumeRange.value = volume * 100;
        volumeRange.style.setProperty('--volume-percent', (volume * 100) + '%');
    }

    // 音量按钮静音切换
    if (volumeBtn) {
        let isMuted = false;
        let previousVolume = volume;
        
        volumeBtn.addEventListener('click', function() {
            if (sound) {
                if (isMuted) {
                    sound.volume(previousVolume);
                    volumeRange.value = previousVolume * 100;
                    volumeRange.style.setProperty('--volume-percent', (previousVolume * 100) + '%');
                    isMuted = false;
                } else {
                    previousVolume = volume;
                    sound.volume(0);
                    volumeRange.value = 0;
                    volumeRange.style.setProperty('--volume-percent', '0%');
                    isMuted = true;
                }
            }
        });
    }

    // 监听页面可见性变化，同步播放状态
    let wasPlayingBeforeHidden = false;
    
    document.addEventListener('visibilitychange', function() {
        if (!sound) return;
        
        if (document.hidden) {
            // 页面隐藏前，记录当前播放状态
            wasPlayingBeforeHidden = sound.playing();
        } else {
            // 页面重新可见时
            // 延迟检查，等待浏览器恢复音频状态
            setTimeout(function() {
                if (!sound) return;
                
                const isNowPlaying = sound.playing();
                
                // 如果之前在播放，但现在暂停了，恢复播放
                if (wasPlayingBeforeHidden && !isNowPlaying) {
                    sound.play();
                }
                
                // 同步UI状态
                isPlaying = sound.playing();
                updatePlayPauseIcons(isPlaying);
                
                if (isPlaying) {
                    recordPlayer.classList.add('playing');
                    requestAnimationFrame(updateProgressBar);
                    if (lyrics.length > 0) {
                        lyricsContainer.style.display = 'block';
                        clearInterval(lyricsInterval);
                        lyricsInterval = setInterval(displayLyrics, 500);
                    }
                } else {
                    recordPlayer.classList.remove('playing');
                    clearInterval(lyricsInterval);
                    lyricsContainer.style.display = 'none';
                }
            }, 100);
        }
    });

    // Load the first song on page load
    fetchMusicList();
});

// 天气与时钟部件逻辑
document.addEventListener('DOMContentLoaded', function () {
    const dateElement = document.getElementById('widget-date');
    const timeElement = document.getElementById('widget-time');
    const addressElement = document.getElementById('weather-address');
    const conditionElement = document.getElementById('weather-condition');
    const tempElement = document.getElementById('weather-temp');
    const windElement = document.getElementById('weather-wind');

    function updateClock() {
        const now = new Date();
        
        // 更新日期
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        const day = dayNames[now.getDay()];
        dateElement.textContent = `${year} 年 ${month} 月 ${date} 日 ${day}`;

        // 更新时间
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        timeElement.textContent = `${hours}:${minutes}:${seconds}`;
    }

    async function updateWeather() {
        try {
            let city = '';
            let address = '';

            // 1. 尝试使用浏览器 GPS 定位
            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('浏览器不支持定位'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: true
                });
            });

            const { latitude, longitude } = position.coords;

            // 2. 通过经纬度反向地理编码获取城市名
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh-CN`);
            const geoData = await geoRes.json();

            if (geoData.address) {
                city = geoData.address.city || geoData.address.town || geoData.address.county || '';
                const province = geoData.address.state || '';
                address = province && city !== province ? `${province}${city}` : city;
            }

            if (!city) {
                throw new Error('无法解析城市名');
            }

            addressElement.textContent = address || city;

            // 3. 获取天气信息
            const weatherRes = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C;%t;%w&lang=zh-cn`);
            if (weatherRes.ok) {
                const weatherText = await weatherRes.text();
                const parts = weatherText.split(';');
                if (parts.length >= 3) {
                    conditionElement.textContent = parts[0].trim();
                    tempElement.textContent = parts[1].trim();
                    windElement.textContent = parts[2].trim();
                } else {
                    throw new Error('天气格式解析失败');
                }
            } else {
                throw new Error('天气接口请求失败');
            }

        } catch (error) {
            console.error('获取天气/位置失败:', error);
            
            // GPS 定位失败时，回退到 IP 定位
            if (error.code === 1 || error.message.includes('定位')) {
                console.log('GPS 定位失败，尝试 IP 定位...');
                await updateWeatherByIP();
            } else {
                // 显示默认值
                addressElement.textContent = '定位失败';
                conditionElement.textContent = '多云';
                tempElement.textContent = '16℃';
                windElement.textContent = '东风 3级';
            }
        }
    }

    // IP 定位备用方案
    async function updateWeatherByIP() {
        try {
            const locRes = await fetch('http://ip-api.com/json/?lang=zh-CN');
            const locData = await locRes.json();

            let city = locData.city || '北京';
            let region = locData.regionName || '';

            if (region === city) {
                addressElement.textContent = city;
            } else {
                addressElement.textContent = `${region}${city}`;
            }

            const weatherRes = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C;%t;%w&lang=zh-cn`);
            if (weatherRes.ok) {
                const weatherText = await weatherRes.text();
                const parts = weatherText.split(';');
                if (parts.length >= 3) {
                    conditionElement.textContent = parts[0].trim();
                    tempElement.textContent = parts[1].trim();
                    windElement.textContent = parts[2].trim();
                }
            }
        } catch (error) {
            console.error('IP 定位也失败了:', error);
            addressElement.textContent = '北京市';
            conditionElement.textContent = '多云';
            tempElement.textContent = '16℃';
            windElement.textContent = '东风 3级';
        }
    }

    // 初始化
    setInterval(updateClock, 1000);
    updateClock();
    updateWeather();
    
    // 每小时更新一次天气
    setInterval(updateWeather, 3600000);
});

// 添加点击涟漪效果
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');
    
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }
    
    button.appendChild(circle);
}

// 为按钮添加涟漪效果
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.iconItem, .projectItem, .left-tag-item');
    buttons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });
});

// 添加弹性点击效果
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.iconItem, .projectItem, .left-tag-item, .left-div');
    items.forEach(item => {
        item.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
            this.style.transition = 'transform 0.1s ease';
        });
        item.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// 添加鼠标跟踪光效（可选，性能敏感）
document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('.Iceuu-main');
    if (!main) return;
    
    let lightEffect = document.createElement('div');
    lightEffect.style.cssText = `
        position: fixed;
        width: 300px;
        height: 300px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(137, 180, 250, 0.1) 0%, transparent 70%);
        pointer-events: none;
        z-index: 1;
        transition: transform 0.1s ease;
        will-change: transform;
    `;
    document.body.appendChild(lightEffect);
    
    document.addEventListener('mousemove', function(e) {
        requestAnimationFrame(function() {
            lightEffect.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
        });
    });
});

