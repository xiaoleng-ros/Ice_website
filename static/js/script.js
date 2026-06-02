// 减少动画偏好
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 切到后台时暂停所有 rAF 循环
let isPageVisible = !document.hidden;
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
});

// 动态填入 footer 年份
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

function handlePress() {
    this.classList.add('pressed');
}

function handleRelease() {
    this.classList.remove('pressed');
}

function handleCancel() {
    this.classList.remove('pressed');
}

const buttons = document.querySelectorAll('.projectItem');
buttons.forEach((button) => {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    const tcMainElement = document.querySelector('.tc-img');
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass('.tc-main', 'active');
    toggleClass('.tc', 'active');
}

const tc = document.getElementsByClassName('tc');
const tcMain = document.getElementsByClassName('tc-main');
if (tc[0]) tc[0].addEventListener('click', pop);
if (tcMain[0]) tcMain[0].addEventListener('click', (e) => e.stopPropagation());

// 事件委托：所有 data-popup 的按钮共用一个 listener
document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-popup]');
    if (!btn) return;
    e.preventDefault();
    pop(btn.dataset.popup);
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
            if (!isPageVisible || prefersReducedMotion) {
                animationId = requestAnimationFrame(animate);
                return;
            }
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
    let volume = 1.0;
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
        const imgEl = recordPlayer.querySelector('img');
        const sourceEl = recordPlayer.querySelector('source');
        if (imgEl) imgEl.src = song.cover;
        if (sourceEl && song.cover) sourceEl.srcset = song.cover.replace(/\.png$/i, '.webp');

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

    // localStorage 缓存相关
    const CACHE_KEY = 'ice_weather_cache';
    const CACHE_TTL = 6 * 60 * 60 * 1000; // 6 小时
    const PERMISSION_KEY = 'ice_geo_permission';

    function getCachedLocation() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (!data || !data.timestamp) return null;
            if (Date.now() - data.timestamp > CACHE_TTL) return null;
            return data;
        } catch (e) {
            return null;
        }
    }

    function setCachedLocation(data) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({
                ...data,
                timestamp: Date.now()
            }));
        } catch (e) {
            // localStorage 可能被禁用，忽略
        }
    }

    function clearCachedLocation() {
        try { localStorage.removeItem(CACHE_KEY); } catch (e) {}
    }

    function getPermissionState() {
        try { return localStorage.getItem(PERMISSION_KEY); } catch (e) { return null; }
    }

    function setPermissionState(state) {
        try { localStorage.setItem(PERMISSION_KEY, state); } catch (e) {}
    }

    function applyWeatherToUI(address, weather) {
        if (address) addressElement.textContent = address;
        if (weather) {
            if (weather.condition) conditionElement.textContent = weather.condition;
            if (weather.temp) tempElement.textContent = weather.temp;
            if (weather.wind) windElement.textContent = weather.wind;
        }
    }

    function setLoadingState() {
        addressElement.textContent = '正在定位...';
        conditionElement.textContent = '加载中...';
        tempElement.textContent = '--';
        windElement.textContent = '--';
    }

    // 主入口：定位 + 天气
    async function updateWeather(forceRefresh = false) {
        // 1. 优先用本地缓存
        if (!forceRefresh) {
            const cached = getCachedLocation();
            if (cached) {
                applyWeatherToUI(cached.address, cached.weather);
                console.log(`使用缓存定位 (${cached.source}):`, cached.address);
                return;
            }
        } else {
            clearCachedLocation();
        }

        setLoadingState();

        // 2. 尝试 GPS 浏览器定位（最准确，会弹出授权）
        try {
            const coords = await getGPSCoords();
            if (coords) {
                setPermissionState('granted');
                const { latitude, longitude } = coords;
                const coordText = `GPS 定位 (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`;
                addressElement.textContent = coordText;

                // 天气和反向地理编码并行请求
                const [weatherResult, addressResult] = await Promise.allSettled([
                    fetchWeatherByCoords(latitude, longitude),
                    reverseGeocode(latitude, longitude)
                ]);

                if (weatherResult.status === 'fulfilled' && weatherResult.value) {
                    applyWeatherToUI(null, weatherResult.value);
                } else {
                    conditionElement.textContent = '--';
                    tempElement.textContent = '--';
                    windElement.textContent = '--';
                }

                const address = (addressResult.status === 'fulfilled' && addressResult.value) ? addressResult.value : null;
                if (address) {
                    addressElement.textContent = address.display;
                }

                setCachedLocation({
                    latitude,
                    longitude,
                    city: address ? address.city : '',
                    address: address ? address.display : coordText,
                    source: 'gps',
                    weather: weatherResult.status === 'fulfilled' ? weatherResult.value : null
                });
                console.log('GPS 定位成功：', address ? address.display : coordText);
                return;
            }
        } catch (e) {
            console.log('GPS 定位失败：', e.message);
        }

        // 3. GPS 不可用时降级到 IP 定位
        try {
            const ipLoc = await getIPLocation();
            if (ipLoc && ipLoc.city) {
                addressElement.textContent = ipLoc.address;
                const weather = await fetchWeatherByCity(ipLoc.city);
                if (weather) {
                    applyWeatherToUI(null, weather);
                }
                setCachedLocation({
                    address: ipLoc.address,
                    city: ipLoc.city,
                    source: 'ip',
                    weather
                });
                console.log('IP 定位成功:', ipLoc.address);
                return;
            }
        } catch (e) {
            console.log('IP 定位失败：', e.message);
        }

        // 4. 全部失败
        addressElement.textContent = '定位失败，点击重试';
        conditionElement.textContent = '--';
        tempElement.textContent = '--';
        windElement.textContent = '--';
    }

    // 带超时的 fetch 封装
    function fetchWithTimeout(url, options = {}, timeoutMs = 5000) {
        const controller = new AbortController();
        const t = setTimeout(() => controller.abort(), timeoutMs);
        return fetch(url, { ...options, signal: controller.signal })
            .finally(() => clearTimeout(t));
    }

    // GPS 浏览器定位（主方案，只返回坐标，速度优先）
    function getGPSCoords() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('浏览器不支持定位'));
                return;
            }
            if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
                reject(new Error('非 HTTPS 环境无法使用 GPS 定位'));
                return;
            }

            if (navigator.permissions && navigator.permissions.query) {
                navigator.permissions.query({ name: 'geolocation' }).then((perm) => {
                    if (perm.state === 'denied') {
                        reject(new Error('用户已拒绝定位授权'));
                    } else {
                        requestPosition();
                    }
                }).catch(() => requestPosition());
            } else {
                requestPosition();
            }

            function requestPosition() {
                navigator.geolocation.getCurrentPosition((pos) => {
                    resolve({
                        latitude: pos.coords.latitude,
                        longitude: pos.coords.longitude,
                        accuracy: pos.coords.accuracy
                    });
                }, (err) => {
                    let msg = '定位失败';
                    if (err.code === 1) msg = '用户拒绝定位授权';
                    else if (err.code === 2) msg = '位置不可用';
                    else if (err.code === 3) msg = '定位超时';
                    setPermissionState('denied');
                    reject(new Error(msg));
                }, {
                    timeout: 8000,
                    maximumAge: 60000,
                    enableHighAccuracy: false
                });
            }
        });
    }

    // 通过经纬度反向地理编码（并行尝试多个源，4s 超时）
    async function reverseGeocode(latitude, longitude) {
        // 优先用 BigDataCloud（免 key，国内访问稳定，~300ms）
        try {
            const res = await fetchWithTimeout(
                `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=zh`,
                {},
                4000
            );
            if (res.ok) {
                const d = await res.json();
                const country = d.countryName || '';
                const state = d.principalSubdivision || '';  // 省（已带"省/市"后缀）
                const city  = d.city || d.locality || '';     // 市/区
                if (city) {
                    let display;
                    if (country === '中国' || country === 'China' || country.includes('中国')) {
                        display = state && state !== city ? `${state} · ${city}` : city;
                    } else {
                        const parts = [country, state, city].filter(Boolean);
                        display = parts.length ? parts.join(' · ') : city;
                    }
                    return { city, display };
                }
            }
        } catch (e) {
            // 继续尝试 Nominatim
        }

        // 备用：Nominatim（限速 1 req/s，国内慢）
        try {
            const res = await fetchWithTimeout(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=zh-CN&zoom=10&addressdetails=1`,
                { headers: { 'User-Agent': 'Iceuu-Website/1.0' } },
                4000
            );
            if (res.ok) {
                const d = await res.json();
                const a = d.address || {};
                const state = a.state || '';
                const city  = cleanCityName(a.city || a.town || a.county || a.village || a.state || '');
                const country = a.country || '';
                if (city) {
                    let display;
                    if (country === '中国' || country === 'China') {
                        display = state && state !== city ? `${state} · ${city}` : city;
                    } else {
                        const parts = [country, state, city].filter(Boolean);
                        display = parts.length ? parts.join(' · ') : city;
                    }
                    return { city, display };
                }
            }
        } catch (e) {}

        return null;
    }

    // IP 定位（兜底方案，并行尝试 4 个源，取最快成功的）
    async function getIPLocation() {
        const sources = [
            async () => {
                const r = await fetch('http://ip-api.com/json/?lang=zh-CN');
                if (!r.ok) throw new Error('ip-api http');
                const d = await r.json();
                if (d.status !== 'success' || !d.city) throw new Error('ip-api invalid');
                const city = cleanCityName(d.city);
                const region = cleanCityName(d.regionName);
                if (!city) throw new Error('ip-api no city');
                return { city, address: region && region !== city ? `${region} · ${city}` : city };
            },
            async () => {
                const r = await fetch('https://ipwho.is/');
                if (!r.ok) throw new Error('ipwho http');
                const d = await r.json();
                if (d.success === false || !d.city) throw new Error('ipwho invalid');
                const city = cleanCityName(d.city);
                const region = cleanCityName(d.region);
                if (!city) throw new Error('ipwho no city');
                return { city, address: region && region !== city ? `${region} · ${city}` : city };
            },
            async () => {
                const r = await fetch('https://ipapi.co/json/');
                if (!r.ok) throw new Error('ipapi http');
                const d = await r.json();
                if (!d.city || d.city === 'undefined') throw new Error('ipapi invalid');
                const city = cleanCityName(d.city);
                const region = cleanCityName(d.region);
                if (!city) throw new Error('ipapi no city');
                return { city, address: region && region !== city ? `${region} · ${city}` : city };
            },
            async () => {
                const r = await fetch('https://ipinfo.io/json');
                if (!r.ok) throw new Error('ipinfo http');
                const d = await r.json();
                if (!d.city) throw new Error('ipinfo invalid');
                const city = cleanCityName(d.city);
                const region = cleanCityName(d.region);
                if (!city) throw new Error('ipinfo no city');
                return { city, address: region && region !== city ? `${region} · ${city}` : city };
            }
        ];

        try {
            return await Promise.any(sources.map(fn => fn().catch(e => Promise.reject(e))));
        } catch (e) {
            return null;
        }
    }

    // 拼音/英文 → 中文城市名映射（130+ 城市，从 city-pinyin.json 加载）
    let cityPinyinMap = null;
    async function loadCityMap() {
        if (cityPinyinMap) return cityPinyinMap;
        try {
            const r = await fetch('/static/data/city-pinyin.json');
            cityPinyinMap = await r.json();
        } catch (e) {
            cityPinyinMap = {};
        }
        return cityPinyinMap;
    }

    // 同步版本（IP 定位解析时不可异步，用预加载 + 兜底）
    function cleanCityName(name) {
        if (!name) return '';
        const trimmed = String(name).trim();
        if (!trimmed) return '';

        // 完整中文城市名（直接放行）
        if (/[\u4e00-\u9fa5]/.test(trimmed)) {
            return trimmed
                .replace(/(市辖区|市辖|辖区)$/g, '')
                .replace(/(区|县|镇|乡|街道|街道办|村)$/g, '')
                .trim();
        }

        // 拼音/英文名 → 中文字典（同步使用 window.__cityPinyinMap，提前注入）
        const map = window.__cityPinyinMap || {};
        const lower = trimmed.toLowerCase().trim();
        if (map[lower]) return map[lower];

        const cleaned = trimmed.replace(/\s*(shi|city|prefecture|district|county)$/i, '').trim();
        const lower2 = cleaned.toLowerCase();
        if (map[lower2]) return map[lower2];

        return cleaned;
    }

    // 提前加载城市映射表，注入到 window
    loadCityMap().then((map) => { window.__cityPinyinMap = map; });

    // 按经纬度查天气（Open-Meteo，无需先 geocoding，最准）
    async function fetchWeatherByCoords(latitude, longitude) {
        try {
            const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`
            );
            if (!res.ok) throw new Error('open-meteo 请求失败');
            const data = await res.json();
            if (!data.current) throw new Error('open-meteo 无数据');
            const c = data.current;
            return {
                condition: getWeatherDescription(c.weather_code),
                temp: `${Math.round(c.temperature_2m)}℃`,
                wind: `风速 ${Math.round(c.wind_speed_10m)} km/h`
            };
        } catch (e) {
            console.log('open-meteo 天气获取失败：', e.message);
            return null;
        }
    }

    // 按城市名查天气（先 wttr.in，再 open-meteo geocoding + forecast）
    async function fetchWeatherByCity(city) {
        // 方案1: wttr.in（直接接受城市名）
        try {
            const res = await fetch(
                `https://wttr.in/${encodeURIComponent(city)}?format=%C;%t;%w&lang=zh-cn`,
                { headers: { 'User-Agent': 'curl' } }
            );
            if (res.ok) {
                const text = await res.text();
                if (!text.includes('<!DOCTYPE') && !text.includes('<html') && text.includes(';')) {
                    const parts = text.split(';');
                    if (parts.length >= 3) {
                        return {
                            condition: parts[0].trim(),
                            temp: parts[1].trim(),
                            wind: parts[2].trim()
                        };
                    }
                }
            }
        } catch (e) {}

        // 方案2: open-meteo geocoding + forecast
        try {
            const geoRes = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=zh`
            );
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
                const { latitude, longitude } = geoData.results[0];
                return await fetchWeatherByCoords(latitude, longitude);
            }
        } catch (e) {}

        return null;
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

    // 暴露给 UI 按钮的重新定位方法
    window.refreshWeatherLocation = function () {
        return updateWeather(true);
    };

    // 绑定重新定位按钮（如果存在）
    const refreshBtn = document.getElementById('weather-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            this.classList.add('spinning');
            updateWeather(true).finally(() => {
                setTimeout(() => this.classList.remove('spinning'), 600);
            });
        });
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
        if (isPageVisible && !prefersReducedMotion) {
            outerX += (cursorX - outerX) * 0.15;
            outerY += (cursorY - outerY) * 0.15;
            cursorOuter.style.left = outerX + 'px';
            cursorOuter.style.top = outerY + 'px';
        }
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

// 全局点击波纹已由 createRipple 统一处理（见上），此处不再重复添加

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
        if (isPageVisible && !prefersReducedMotion) {
            // 主光效缓慢跟随（延迟效果）
            lightX += (mouseX - lightX) * 0.08;
            lightY += (mouseY - lightY) * 0.08;
            lightEffect.style.transform = `translate(${lightX - 200}px, ${lightY - 200}px)`;

            // 紫色光效更慢跟随
            purpleX += (mouseX - purpleX) * 0.05;
            purpleY += (mouseY - purpleY) * 0.05;
            purpleLight.style.transform = `translate(${purpleX - 125}px, ${purpleY - 125}px)`;
        }
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

