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
                this.life = Math.random() * 100 + 100; // 粒子生命周期
                this.maxLife = this.life;
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

                // 生命周期减少
                this.life--;
                if (this.life <= 0) {
                    this.reset();
                }

                // 边界检查
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                // 根据生命周期调整透明度
                const lifeRatio = this.life / this.maxLife;
                const currentOpacity = this.opacity * lifeRatio;
                
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${currentOpacity})`;
                ctx.fill();
                
                // 添加发光效果
                ctx.shadowBlur = 10;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, ${currentOpacity * 0.5})`;
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
                        const lifeRatioI = particles[i].life / particles[i].maxLife;
                        const lifeRatioJ = particles[j].life / particles[j].maxLife;
                        const avgLifeRatio = (lifeRatioI + lifeRatioJ) / 2;
                        
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const opacity = (1 - distance / 120) * 0.15 * avgLifeRatio;
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

            // 1. 优先使用 IP 定位（自动获取电脑所在地，无需用户授权）
            console.log('尝试 IP 定位...');
            const ipLocation = await getIPLocation();
            
            if (ipLocation && ipLocation.city) {
                city = ipLocation.city;
                address = ipLocation.address || city;
                console.log('IP 定位成功:', address);
            } else {
                throw new Error('IP 定位失败');
            }

            addressElement.textContent = address;

            // 2. 获取天气信息
            await fetchWeather(city);

        } catch (error) {
            console.error('IP 定位失败:', error);
            
            // IP 定位失败时，尝试 GPS 定位
            console.log('尝试 GPS 定位作为备用方案...');
            await updateWeatherByGPS();
        }
    }

    // IP 定位（自动获取电脑所在地）
    async function getIPLocation() {
        // 方案1: ip-api.com（最稳定，支持中文）
        try {
            const locRes = await fetch('http://ip-api.com/json/?lang=zh-CN');
            if (locRes.ok) {
                const data = await locRes.json();
                if (data.status === 'success' && data.city) {
                    console.log('ip-api.com 定位成功');
                    const city = translateCityToChinese(data.city);
                    const region = translateCityToChinese(data.regionName);
                    return {
                        city: city,
                        address: region && region !== city 
                            ? `${region}${city}` 
                            : city
                    };
                }
            }
        } catch (e) {
            console.log('ip-api.com 失败，尝试备用 API...');
        }

        // 方案2: ipinfo.io
        try {
            const locRes = await fetch('https://ipinfo.io/json');
            if (locRes.ok) {
                const data = await locRes.json();
                if (data.city) {
                    console.log('ipinfo.io 定位成功');
                    const city = translateCityToChinese(data.city);
                    const region = translateCityToChinese(data.region);
                    return {
                        city: city,
                        address: region && region !== city 
                            ? `${region}${city}` 
                            : city
                    };
                }
            }
        } catch (e) {
            console.log('ipinfo.io 失败，尝试备用 API...');
        }

        // 方案3: ipapi.co
        try {
            const locRes = await fetch('https://ipapi.co/json/');
            if (locRes.ok) {
                const data = await locRes.json();
                if (data.city && data.city !== 'undefined') {
                    console.log('ipapi.co 定位成功');
                    const city = translateCityToChinese(data.city);
                    const region = translateCityToChinese(data.region);
                    return {
                        city: city,
                        address: region && region !== city 
                            ? `${region}${city}` 
                            : city
                    };
                }
            }
        } catch (e) {
            console.log('ipapi.co 也失败了');
        }

        // 方案4: ipwho.is
        try {
            const locRes = await fetch('https://ipwho.is/');
            if (locRes.ok) {
                const data = await locRes.json();
                if (data.city && data.success !== false) {
                    console.log('ipwho.is 定位成功');
                    const city = translateCityToChinese(data.city);
                    const region = translateCityToChinese(data.region);
                    return {
                        city: city,
                        address: region && region !== city 
                            ? `${region}${city}` 
                            : city
                    };
                }
            }
        } catch (e) {
            console.log('ipwho.is 也失败了');
        }

        return null;
    }

    // 将英文/拼音城市名转换为中文，并过滤非城市名
    function translateCityToChinese(cityName) {
        if (!cityName) return '';
        
        // 过滤掉非城市名（区县、街道、乡镇等）
        const nonCityKeywords = [
            'Wenquan', '温泉', 'District', '区', 'County', '县', 
            'Town', '镇', 'Street', '街道', 'Village', '村',
            'Shi', '市辖区'
        ];
        
        for (const keyword of nonCityKeywords) {
            if (cityName.includes(keyword)) {
                console.log(`过滤非城市名：${cityName}`);
                return '';
            }
        }

        // 常见城市英文名到中文的映射
        const cityMap = {
            'Beijing': '北京',
            'Shanghai': '上海',
            'Guangzhou': '广州',
            'Shenzhen': '深圳',
            'Chengdu': '成都',
            'Hangzhou': '杭州',
            'Wuhan': '武汉',
            'Nanjing': '南京',
            'Chongqing': '重庆',
            'Tianjin': '天津',
            'Xi an': '西安',
            'Suzhou': '苏州',
            'Zhengzhou': '郑州',
            'Changsha': '长沙',
            'Shenyang': '沈阳',
            'Qingdao': '青岛',
            'Dalian': '大连',
            'Jinan': '济南',
            'Harbin': '哈尔滨',
            'Changchun': '长春',
            'Kunming': '昆明',
            'Taiyuan': '太原',
            'Shijiazhuang': '石家庄',
            'Nanchang': '南昌',
            'Fuzhou': '福州',
            'Hefei': '合肥',
            'Nanning': '南宁',
            'Guiyang': '贵阳',
            'Lanzhou': '兰州',
            'Wulumuqi': '乌鲁木齐',
            'Fu Zhou Shi': '福州',
            'Fujian': '福建'
        };

        // 先尝试精确匹配
        if (cityMap[cityName]) {
            return cityMap[cityName];
        }

        // 尝试忽略大小写匹配
        const lowerName = cityName.toLowerCase();
        for (const [key, value] of Object.entries(cityMap)) {
            if (key.toLowerCase() === lowerName) {
                return value;
            }
        }

        // 如果没有匹配，返回原名称（可能是已经是中文）
        return cityName;
    }

    // GPS 定位备用方案
    async function updateWeatherByGPS() {
        try {
            let city = '';
            let address = '';

            const position = await new Promise((resolve, reject) => {
                if (!navigator.geolocation) {
                    reject(new Error('浏览器不支持定位'));
                    return;
                }
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 8000,
                    maximumAge: 300000,
                    enableHighAccuracy: false
                });
            });

            const { latitude, longitude } = position.coords;

            // 通过经纬度反向地理编码获取城市名
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh-CN`, {
                headers: { 'User-Agent': 'Iceuu-Website/1.0' }
            });
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
            await fetchWeather(city);

        } catch (error) {
            console.error('GPS 定位也失败了:', error);
            // 最终回退到默认值
            addressElement.textContent = '北京市';
            conditionElement.textContent = '多云';
            tempElement.textContent = '16℃';
            windElement.textContent = '东风 3级';
        }
    }

    // 获取天气信息
    async function fetchWeather(city) {
        try {
            // 方案1: wttr.in
            try {
                const weatherRes = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=%C;%t;%w&lang=zh-cn`, {
                    headers: { 'User-Agent': 'curl' }
                });
                if (weatherRes.ok) {
                    const weatherText = await weatherRes.text();
                    
                    // 检查是否返回了 HTML（说明 API 异常）
                    if (!weatherText.includes('<!DOCTYPE') && !weatherText.includes('<html') && weatherText.includes(';')) {
                        const parts = weatherText.split(';');
                        if (parts.length >= 3) {
                            conditionElement.textContent = parts[0].trim();
                            tempElement.textContent = parts[1].trim();
                            windElement.textContent = parts[2].trim();
                            console.log('wttr.in 天气获取成功');
                            return;
                        }
                    }
                }
            } catch (e) {
                console.log('wttr.in 失败，尝试备用天气 API...');
            }

            // 方案2: open-meteo (免费，无需 API key)
            try {
                // 先获取城市经纬度
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`);
                const geoData = await geoRes.json();
                
                if (geoData.results && geoData.results.length > 0) {
                    const { latitude, longitude, name } = geoData.results[0];
                    
                    // 获取天气数据
                    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`);
                    const weatherData = await weatherRes.json();
                    
                    if (weatherData.current) {
                        const current = weatherData.current;
                        const temp = `${Math.round(current.temperature_2m)}℃`;
                        const wind = `风速 ${current.wind_speed_10m}km/h`;
                        
                        // 天气代码转换为中文描述
                        const weatherDesc = getWeatherDescription(current.weather_code);
                        
                        conditionElement.textContent = weatherDesc;
                        tempElement.textContent = temp;
                        windElement.textContent = wind;
                        console.log('open-meteo 天气获取成功');
                        return;
                    }
                }
            } catch (e) {
                console.log('open-meteo 也失败了');
            }

            // 所有方案都失败
            throw new Error('所有天气 API 都失败了');
            
        } catch (error) {
            console.error('获取天气失败:', error);
            // 天气获取失败不影响地址显示
            conditionElement.textContent = '--';
            tempElement.textContent = '--';
            windElement.textContent = '--';
        }
    }

    // 天气代码转换为中文描述
    function getWeatherDescription(code) {
        const weatherMap = {
            0: '晴天',
            1: '多云',
            2: '阴天',
            3: '阴天',
            45: '雾',
            48: '雾凇',
            51: '毛毛雨',
            53: '中雨',
            55: '大雨',
            61: '小雨',
            63: '中雨',
            65: '大雨',
            71: '小雪',
            73: '中雪',
            75: '大雪',
            95: '雷暴',
            96: '雷暴伴冰雹',
            99: '强雷暴'
        };
        return weatherMap[code] || '多云';
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

// 添加滚动渐入动画
document.addEventListener('DOMContentLoaded', function() {
    // 为需要动画的元素添加初始状态
    const animatedElements = document.querySelectorAll('.projectItem, .title, .skill');
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    });
    
    // 使用 Intersection Observer 检测元素是否进入视口
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
});

// 添加赛博朋克自定义光标
document.addEventListener('DOMContentLoaded', function() {
    // 创建光标外圈
    const cursorOuter = document.createElement('div');
    cursorOuter.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        border: 2px solid rgba(0, 212, 255, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 999999;
        transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease, transform 0.1s ease;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
    `;
    document.body.appendChild(cursorOuter);
    
    // 创建光标内点
    const cursorInner = document.createElement('div');
    cursorInner.style.cssText = `
        position: fixed;
        width: 6px;
        height: 6px;
        background: rgba(0, 212, 255, 0.9);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000000;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 8px rgba(0, 212, 255, 0.8);
    `;
    document.body.appendChild(cursorInner);
    
    let cursorX = 0, cursorY = 0;
    let outerX = 0, outerY = 0;
    
    // 鼠标移动事件
    document.addEventListener('mousemove', function(e) {
        cursorX = e.clientX;
        cursorY = e.clientY;
        
        // 内点直接跟随
        cursorInner.style.left = cursorX + 'px';
        cursorInner.style.top = cursorY + 'px';
    });
    
    // 外圈平滑跟随
    function animateCursor() {
        outerX += (cursorX - outerX) * 0.15;
        outerY += (cursorY - outerY) * 0.15;
        cursorOuter.style.left = outerX + 'px';
        cursorOuter.style.top = outerY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // 悬停时可交互元素时光标变化
    const interactiveElements = document.querySelectorAll('a, button, .iconItem, .projectItem, .left-tag-item, .control-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', function() {
            cursorOuter.style.width = '45px';
            cursorOuter.style.height = '45px';
            cursorOuter.style.borderColor = 'rgba(0, 255, 136, 0.8)';
            cursorOuter.style.boxShadow = '0 0 15px rgba(0, 255, 136, 0.5)';
            cursorInner.style.background = 'rgba(0, 255, 136, 0.9)';
            cursorInner.style.boxShadow = '0 0 12px rgba(0, 255, 136, 0.8)';
        });
        el.addEventListener('mouseleave', function() {
            cursorOuter.style.width = '30px';
            cursorOuter.style.height = '30px';
            cursorOuter.style.borderColor = 'rgba(0, 212, 255, 0.6)';
            cursorOuter.style.boxShadow = '0 0 10px rgba(0, 212, 255, 0.3)';
            cursorInner.style.background = 'rgba(0, 212, 255, 0.9)';
            cursorInner.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.8)';
        });
    });
    
    // 点击时光标收缩
    document.addEventListener('mousedown', function() {
        cursorOuter.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorInner.style.transform = 'translate(-50%, -50%) scale(0.7)';
    });
    document.addEventListener('mouseup', function() {
        cursorOuter.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorInner.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    // 鼠标离开窗口时隐藏光标
    document.addEventListener('mouseleave', function() {
        cursorOuter.style.opacity = '0';
        cursorInner.style.opacity = '0';
    });
    document.addEventListener('mouseenter', function() {
        cursorOuter.style.opacity = '1';
        cursorInner.style.opacity = '1';
    });
});

// 添加卡片3D倾斜效果
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.projectItem, .left-div');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px) scale(1.01)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = '';
        });
    });
});

// 添加打字机效果到描述文字
document.addEventListener('DOMContentLoaded', function() {
    const descriptionEl = document.querySelector('.description');
    if (!descriptionEl) return;
    
    // 获取原始文本
    const originalText = descriptionEl.textContent.trim();
    descriptionEl.textContent = '';
    descriptionEl.style.opacity = '1';
    
    // 添加光标
    const cursor = document.createElement('span');
    cursor.style.cssText = `
        display: inline-block;
        width: 2px;
        height: 1em;
        background: rgba(0, 212, 255, 0.8);
        margin-left: 2px;
        animation: blink-cursor 0.8s step-end infinite;
        vertical-align: text-bottom;
    `;
    descriptionEl.appendChild(cursor);
    
    // 添加光标闪烁动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink-cursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // 使用 Array.from 正确处理 emoji 和特殊字符
    const chars = Array.from(originalText);
    let charIndex = 0;
    const typingSpeed = 50; // 每个字符的打字速度（毫秒）
    
    function typeText() {
        if (charIndex < chars.length) {
            // 在光标前插入字符
            const textNode = document.createTextNode(chars[charIndex]);
            descriptionEl.insertBefore(textNode, cursor);
            charIndex++;
            setTimeout(typeText, typingSpeed);
        } else {
            // 打字完成后，3秒后移除光标
            setTimeout(() => {
                cursor.style.animation = 'none';
                cursor.style.opacity = '0';
            }, 3000);
        }
    }
    
    // 延迟开始打字，等待页面加载
    setTimeout(typeText, 1000);
});

// 添加点击波纹效果
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        // 创建波纹元素
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, rgba(123, 44, 191, 0.2) 40%, transparent 70%);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 999998;
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        document.body.appendChild(ripple);
        
        // 添加波纹动画
        const rippleStyle = document.createElement('style');
        if (!document.getElementById('ripple-animation-style')) {
            rippleStyle.id = 'ripple-animation-style';
            rippleStyle.textContent = `
                @keyframes ripple-expand {
                    0% {
                        width: 0;
                        height: 0;
                        opacity: 1;
                    }
                    100% {
                        width: 200px;
                        height: 200px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }
        
        // 动画结束后移除元素
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// 添加鼠标跟踪光效（赛博朋克增强版）
document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('.Iceuu-main');
    if (!main) return;
    
    // 创建主光效
    let lightEffect = document.createElement('div');
    lightEffect.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 212, 255, 0.08) 0%, rgba(123, 44, 191, 0.05) 30%, transparent 70%);
        pointer-events: none;
        z-index: 1;
        transition: opacity 0.3s ease;
        will-change: transform;
        filter: blur(20px);
    `;
    document.body.appendChild(lightEffect);
    
    // 创建辅助光效（紫色）
    let purpleLight = document.createElement('div');
    purpleLight.style.cssText = `
        position: fixed;
        width: 250px;
        height: 250px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(123, 44, 191, 0.1) 0%, transparent 60%);
        pointer-events: none;
        z-index: 1;
        will-change: transform;
        filter: blur(15px);
        opacity: 0.7;
    `;
    document.body.appendChild(purpleLight);
    
    // 创建绿色小光点
    let greenDot = document.createElement('div');
    greenDot.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(0, 255, 136, 0.8);
        pointer-events: none;
        z-index: 9999;
        will-change: transform;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.8), 0 0 20px rgba(0, 255, 136, 0.4);
    `;
    document.body.appendChild(greenDot);
    
    let mouseX = 0, mouseY = 0;
    let lightX = 0, lightY = 0;
    let purpleX = 0, purpleY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // 绿色光点跟随鼠标
        greenDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });
    
    // 平滑动画循环
    function animateLights() {
        // 主光效缓慢跟随（延迟效果）
        lightX += (mouseX - lightX) * 0.08;
        lightY += (mouseY - lightY) * 0.08;
        lightEffect.style.transform = `translate(${lightX - 200}px, ${lightY - 200}px)`;
        
        // 紫色光效更慢跟随
        purpleX += (mouseX - purpleX) * 0.05;
        purpleY += (mouseY - purpleY) * 0.05;
        purpleLight.style.transform = `translate(${purpleX - 125}px, ${purpleY - 125}px)`;
        
        requestAnimationFrame(animateLights);
    }
    animateLights();
    
    // 鼠标离开窗口时隐藏光效
    document.addEventListener('mouseleave', function() {
        lightEffect.style.opacity = '0';
        purpleLight.style.opacity = '0';
        greenDot.style.opacity = '0';
    });
    
    document.addEventListener('mouseenter', function() {
        lightEffect.style.opacity = '1';
        purpleLight.style.opacity = '0.7';
        greenDot.style.opacity = '1';
    });
});

