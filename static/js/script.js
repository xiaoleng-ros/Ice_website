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



function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}



document.addEventListener('DOMContentLoaded', function () {

    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";
    var tanChiShe = document.getElementById("tanChiShe");

    function changeTheme(theme) {
        tanChiShe.src = "./static/svg/snake-" + theme + ".svg";
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }

    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });

    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);



    /*
    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);
    
    var showFPS = (function () {
        var requestAnimationFrame =
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame;
    
        var fps = 0,
            lastLoop = new Date().getTime(),
            offset, step, appendFps;
    
        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };
    
        step = function () {
            offset = new Date().getTime() - lastLoop;
            fps += 1;
            if (offset >= 1000) {
                lastLoop = new Date().getTime();
                appendFps(fps);
                fps = 0;
            }
            requestAnimationFrame(step);
        };
    
        return step;
    })();
    showFPS();
    */
    
    //pop('./static/img/tz.jpg')
    
    
});




var pageLoading = document.querySelector("#Iceuu-loading");
window.addEventListener('load', function() {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
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
                    lyricsInterval = setInterval(displayLyrics, 100); // Update lyrics every 100ms
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

