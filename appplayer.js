
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const audio = $("#audio");
const timeCurrent = $(".current-time");
const timeDuration = $(".duration-time");
const playerBtn = $(".player-btn");
const playerWrap = $(".player-wrap");

//-----------------------------App-----------------------------// 
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: {},

    songs: [
        {
        name: "English Acoustic Love Songs 2021",
        singer: "Acoustic 8PM",
        path: "./assets/music/English Acoustic Love Songs 2021.mp3",
        image: "./assets/imgs/songImg/English Acoustic Love Songs 2021.jpg"
        },
        {
        name: "English Acoustic Cover Love Songs 2021",
        singer: "Acoustic Songs Collection",
        path: "./assets/music/English Acoustic Cover Love Songs 2021.mp3",
        image:"./assets/imgs/songImg/English Acoustic Cover Love Songs 2021.jpg"
        },
        {
        name: "Gangster Rap Trap Mix",
        singer: "The Amazing 10",
        path:"./assets/music/Gangster Rap Trap Mix.mp3",
        image: "./assets/imgs/songImg/Gangster Rap Trap Mix.jpg"
        },
        {
        name: "Lofi beat so chill",
        singer: "ANT Muzik",
        path: "./assets/music/Lofi beat so chill.mp3",
        image:"./assets/imgs/songImg/Lofi beat so chill.jpg"
        },
        {
        name: "Relax beats to sleepstudy x Fall In Luv",
        singer: "Fall In Chill",
        path: "./assets/music/Relax beats to sleepstudy x Fall In Luv.mp3",
        image:"./assets/imgs/songImg/Relax beats to sleepstudy x Fall In Luv.jpg"
        },
        {
        name: "Hip HopTrap Instrumental Beats Mix 2019",
        singer: "Nicop Records",
        path:"./assets/music/Hip HopTrap Instrumental Beats Mix 2019.mp3",
        image:"./assets/imgs/songImg/Hip HopTrap Instrumental Beats Mix 2019.jpg"
        },
        {
        name: "Nhạc English Nhẹ Nhàng Chill Acoustic",
        singer: "ANT muzik",
        path: "./assets/music/Nhạc English Nhẹ Nhàng Chill Acoustic.mp3",
        image:"./assets/imgs/songImg/Nhạc English Nhẹ Nhàng Chill Acoustic.jpg"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
        return `
            <div class="song ${
            index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
        `;
        });
        playlist.innerHTML = htmls.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
        get: function () {
            return this.songs[this.currentIndex];
        }
        });
    },
    handleEvents: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        };

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        };

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(
                (audio.currentTime / audio.duration) * 100
                );
                progress.value = progressPercent;
            }
        };

        // Xử lý khi tua song
        progress.oninput = function(e){
            audio.pause()
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
            progress.onchange = function(){
              audio.play()
            }
        }

        // Khi next song
        nextBtn.onclick = function () {
        if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Khi prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        // Xử lý bật / tắt random song
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom;
            _this.setConfig("isRandom", _this.isRandom);
            randomBtn.classList.toggle("active", _this.isRandom);
        };

        // Xử lý lặp lại một song
        repeatBtn.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig("isRepeat", _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat);
        };

        // Xử lý next song khi audio ended
        audio.onended = function () {
        if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            if (songNode || e.target.closest(".option")) {
                // Xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }

                // Xử lý khi click vào song option
                // if (e.target.closest(".option")) {
                // }


            }
        };
        
        audio.ontimeupdate = function () {
            //Hiển thị thời gian trên thanh progress
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
                progress.style.background = 'linear-gradient(to right, #ec1f55 0%, #ec1f55 ' + progressPercent + '%, #d3d3d3 ' + progressPercent + '%, #d3d3d3 100%)';
                // Đếm thời gian của thời gian hiện tại
                var e = Math.floor(audio.currentTime);
                var d = e % 60; // Số giây
                var b = Math.floor(e / 60); // Số phút
                var f = Math.floor(b / 60 ); 
                if (d < 10) {
                    var c = 0;
                } else {
                    var c = "";
                }
                if (b > 59) {
                    var b = b - 60;
                }
                if (b < 10) {
                    var g = "0";
                } else {
                    var g = "";
                }
                timeCurrent.textContent = "0" + f + ":" + g + b + ":" + c + d;
        
                // Đếm thời gian của thời lượng âm thanh
                var ee = Math.floor(audio.duration);
                var dd = ee % 60; //số giây
                var bb = Math.floor(ee / 60); //số phút
                var ff = Math.floor(bb / 60 ); 
                if (bb > 59) {
                    var bb = bb - 60;
                }
                if (bb < 10) {
                    var gg = "0";
                } else {
                    var gg = "";
                }
                
                timeDuration.textContent = "0" + ff + ":" + gg + bb + ":" + dd;
            }
        
            if(!audio.duration) {
                timeCurrent.textContent = '00' + ":" + "00";
                timeDuration.textContent = '00' + ":" + "00";
            }
        };

        playerBtn.onclick = function () {
            if (playerWrap) {
                playerWrap.classList.toggle("player--change")
                backgroundList.classList.remove("background--change")
            }
        }  
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
        $(".song.active").scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
        this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function () {
        let newIndex;
        do {
        newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong();

        // Render playlist
        this.render();

        // // Hiển thị trạng thái ban đầu của button repeat & random
        // randomBtn.classList.toggle("active", this.isRandom);
        // repeatBtn.classList.toggle("active", this.isRepeat);
    }


};

app.start();

//-----------------------------BacfkgroundList-----------------------------//


