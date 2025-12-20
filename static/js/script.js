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

    // 背景轮播逻辑 (双图层交替淡入淡出实现无缝衔接)
    let currentBgIndex = 1;
    const maxBgIndex = 11; // 目前文件夹中只有 1~11.jpg
    const bgInterval = 5000; // 5秒
    const bgLayers = [
        document.querySelector('.Iceuu-background.bg-1'),
        document.querySelector('.Iceuu-background.bg-2')
    ];
    let activeLayerIndex = 0;

    function changeBackground() {
        const nextBgIndex = (currentBgIndex % maxBgIndex) + 1;
        const nextBgUrl = `./static/img/background/${nextBgIndex}.jpg`;
        
        // 预加载下一张图片
        const img = new Image();
        img.src = nextBgUrl;
        
        // 图片加载成功
        img.onload = function() {
            const inactiveLayerIndex = 1 - activeLayerIndex;
            const inactiveLayer = bgLayers[inactiveLayerIndex];
            const activeLayer = bgLayers[activeLayerIndex];

            if (inactiveLayer) {
                inactiveLayer.style.backgroundImage = `url('${nextBgUrl}')`;
                inactiveLayer.classList.add('active');
            }
            
            if (activeLayer) {
                activeLayer.classList.remove('active');
            }

            activeLayerIndex = inactiveLayerIndex;
            currentBgIndex = nextBgIndex;
            console.log(`背景已平滑切换至: ${nextBgUrl}`);
        };

        // 图片加载失败处理 (防止卡死)
        img.onerror = function() {
            console.error(`无法加载图片: ${nextBgUrl}，跳过该图`);
            currentBgIndex = nextBgIndex; // 跳过这张图，下次尝试加载下一张
        };
    }

    // 初始化第一张背景
    if (bgLayers[0]) {
        bgLayers[0].style.backgroundImage = `url('./static/img/background/1.jpg')`;
        bgLayers[0].classList.add('active');
    }
    
    // 设置定时轮播
    setInterval(changeBackground, bgInterval);
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
    const lyricsDisplay = document.getElementById('lyrics-display');
    const lyricsContainer = document.getElementById('lyrics-container');
    const progressBar = document.getElementById('progress-bar');
    const progressBarContainer = document.getElementById('progress-bar-container');
    const recordPlayer = document.querySelector('.record-player');

    let sound;
    let isPlaying = false;
    let currentSongIndex = 0;
    let lyrics = [];
    let lyricsInterval;

    const playlist = [
        {
            title: '我好像在哪见过你',
            artist: '薛之谦',
            src: './static/music/我好像在哪见过你 - 薛之谦.mp3',
            cover: './static/img/music.png',
            lyrics: './static/music/我好像在哪见过你 - 薛之谦.lrc'
        }
        // Add more songs here if needed
    ];

    function loadSong(index) {
        if (sound) {
            sound.stop();
            sound.unload();
        }

        const song = playlist[index];
        recordPlayer.querySelector('img').src = song.cover;

        // Load lyrics
        if (song.lyrics) {
            fetch(song.lyrics)
                .then(response => response.text())
                .then(text => {
                    lyrics = parseLRC(text);
                    lyricsDisplay.textContent = ''; // Clear previous lyrics
                })
                .catch(error => {
                    console.error('Error loading lyrics:', error);
                    lyrics = [];
                    lyricsDisplay.textContent = '歌词加载失败';
                });
        } else {
            lyrics = [];
            lyricsDisplay.textContent = '暂无歌词';
        }

        sound = new Howl({
            src: [song.src],
            html5: true,
            onplay: function () {
                isPlaying = true;
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                recordPlayer.classList.add('playing');
                requestAnimationFrame(updateProgressBar);
                if (lyrics.length > 0) {
                    lyricsContainer.style.display = 'block';
                    lyricsInterval = setInterval(displayLyrics, 500); // Update lyrics every 500ms for better performance
                }
            },
            onpause: function () {
                isPlaying = false;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                recordPlayer.classList.remove('playing');
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
            },
            onend: function () {
                isPlaying = false;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                recordPlayer.classList.remove('playing');
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
            },
            onstop: function () {
                isPlaying = false;
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                recordPlayer.classList.remove('playing');
                progressBar.style.width = '0%';
                clearInterval(lyricsInterval);
                lyricsDisplay.textContent = '';
                lyricsContainer.style.display = 'none';
            }
        });
    }

    function playPause() {
        if (sound.playing()) {
            sound.pause();
        } else {
            sound.play();
        }
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
        const currentTime = sound.seek() * 1000; // Convert to milliseconds
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
        if (sound.playing()) {
            const seek = sound.seek() || 0;
            const duration = sound.duration() || 0;
            const progress = (seek / duration) * 100;
            progressBar.style.width = progress + '%';
            requestAnimationFrame(updateProgressBar);
        }
    }

    progressBarContainer.addEventListener('click', function (e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = sound.duration();
        sound.seek((clickX / width) * duration);
    });

    playPauseBtn.addEventListener('click', playPause);

    // Load the first song on page load
    loadSong(currentSongIndex);
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
            // 1. 获取位置信息 (使用 ip-api.com 获取中文地址)
            const locRes = await fetch('http://ip-api.com/json/?lang=zh-CN');
            const locData = await locRes.json();
            
            let city = locData.city || '未知城市';
            let region = locData.regionName || '';
            
            // 避免重复显示，如 "北京市, 北京市"
            if (region === city) {
                addressElement.textContent = city;
            } else {
                addressElement.textContent = `${region}${city}`;
            }

            // 2. 获取天气信息 (使用 wttr.in)
            // 这里的 city 虽然是中文，但 wttr.in 支持大部分中文城市名的查询
            const weatherRes = await fetch(`https://wttr.in/${city}?format=%C;%t;%w&lang=zh-cn`);
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

