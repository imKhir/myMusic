
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
        name: "SUNDAY HIPHOP CYPHER",
        singer: "16 Typh 16 BrT Lil Wuyn RIC",
        path: "./assets/music/16 Typh 16 BrT Lil Wuyn RIC  SUNDAY HIPHOP CYPHER Official MV.mp3",
        image: "https://zmp3-photo-fbcrawler.zadn.vn/thumb_video/f/b/8/e/fb8ee5871fa4807c41aa2235ae9f0fa6.jpg"
        },
        {
        name: "PHI HÀNH GIA",
        singer: "RENJA x SLOW T x LIL WUYN x KAIN x SUGAR CANE",
        path: "./assets/music/BASS6 x 95G  PHI HÀNH GIA  RENJA x SLOW T x LIL WUYN x KAIN x SUGAR CANE Prod THINHHO.mp3",
        image:"https://photo2.tinhte.vn/data/attachment-files/2021/12/5773548_Cover_thuc-an-khong-gian.png"
        },
        {
        name: "CUA",
        singer: "Hieuthuhai",
        path:"./assets/music/CUA.mp3",
        image: "https://i1.sndcdn.com/artworks-2VzsDyLQyWbjf0uD-aOtO8Q-t500x500.jpg"
        },
        {
        name: " CHƠI",
        singer: "HIEUTHUHAI",
        path: "./assets/music/HIEUTHUHAI  CHƠI rmx FtMANBO LvK x BILLY100.mp3",
        image:"https://images.genius.com/8b2c221d45d74973af2726b90cb1e202.1000x1000x1.png"
        },
        {
        name: "THAY ĐỔI",
        singer: "LIL WUYN",
        path: "./assets/music/LIL WUYN  THAY ĐỔI  HỘI NGHE  S04E24.mp3",
        image:"https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/06/08/1/f/f/2/1591582947365_600.jpg"
        },
        {
        name: "Thủ Đô Cypher",
        singer: "BeckStage X Bitis Hunter RPT Orijinn LOW G",
        path:"./assets/music/Thủ Đô Cypher  BeckStage X Bitis Hunter  RPT Orijinn LOW G RZMas RPT MCK.mp3",
        image:"https://images.genius.com/7263a9d590cc8d8155d97c17bac5c016.500x500x1.jpg"
        },
        {
        name: "Chơi Đồ",
        singer: "MCK",
        path: "./assets/music/Chơi Đồ.mp3",
        image:"https://avatar-ex-swe.nixcdn.com/singer/avatar/2020/11/16/6/5/0/2/1605491409204_600.jpg"
        },
        {
        name: "Em iu",
        singer: "Andree",
        path: "./assets/music/Andree Right Hand  Em iu feat Wxrdie Bình Gold 2pillz  Official MV.mp3",
        image:"https://i1.sndcdn.com/artworks-EE7n9I22sVC8Jebl-2wHRag-t500x500.jpg"
        },
        {
        name: "iceMan",
        singer: "Sol7 ft MCK",
        path: "./assets/music/Sol7 ft MCK  iceMan Prod Yung Lando Yung Tago.mp3",
        image:"https://avatar-ex-swe.nixcdn.com/song/2021/03/03/3/4/4/5/1614785212642_640.jpg"
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

                //xử lý khi click vào option
                if(e.target.closest('.option')) {
                    alert("Chưa kịp làm! HEHE ^^")
                }
            }
        };
        
        // Xử lý thời lượng bài hát
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
                if (d < 10) {
                    var c = 0;
                } else {
                    c = "";
                }
                timeCurrent.textContent = '0' + b + ":" + c + d;
            
                // Đếm thời gian của thời lượng âm thanh
                var ee = Math.floor(audio.duration);
                var dd = ee % 60; //số giây
                var bb = Math.floor(ee / 60); //số phút
                if (dd < 10) {
                    var cc = 0;
                } else {
                    cc = "";
                }
                
                timeDuration.textContent = '0' + bb + ":" + cc + dd;
            }
        
            if(!audio.duration) {
                timeCurrent.textContent = '00' + ":" + "00";
                timeDuration.textContent = '00' + ":" + "00";
            }
        };

        //Xử lý playerBtn
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


