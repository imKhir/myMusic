
const backgroundList = $(".background-list");
const backgroundImg = $(".background-img");
const body = $("body");
const changeBackground = $(".background-btn");

const backgroundSlide = {
    currentIndex: 0,
    config: {},

    backgrounds: [
        {
            image: "/assets/imgs/backgroundImg/background.gif"
        },
        {
            image: "/assets/imgs/backgroundImg/background1.gif"
        },
        {
            image: "/assets/imgs/backgroundImg/background2.gif"
        },
        {
            image: "/assets/imgs/backgroundImg/background3.gif"
        },
        {
            image: "/assets/imgs/backgroundImg/background4.gif"
        },
        {
            image: "/assets/imgs/backgroundImg/background5.gif"
        }
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
    },

    render: function () {
        const htmlS = this.backgrounds.map((background,index) => {
        return `
            <div class="background-item ${
                index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                <img src="${background.image}" class="background-img" alt="">
            </div>
        `;
        });
        backgroundList.innerHTML = htmlS.join("");
    },
    defineProperties: function () {
        Object.defineProperty(this, "currentBackground", {
        get: function () {
            return this.backgrounds[this.currentIndex];
        }
        });
    },

    handleEvents: function () {
        const _this = this;

        // Lắng nghe hành vi click vào backgroundList
        backgroundList.onclick = function (e) {
            const backgroundNode = e.target.closest(".background-item:not(.active)");
    
            if (backgroundNode) {
                // Xử lý khi click vào background-item
                if (backgroundNode) {
                    _this.currentIndex = Number(backgroundNode.dataset.index);
                    _this.loadCurrentBackground();
                    _this.render();
                }
            }
        };

        // Xử lý hành vi click backgroundBtn
        changeBackground.onclick = function () {
            if (backgroundList) {
                backgroundList.classList.toggle("background--change")
                playerWrap.classList.remove("player--change")
            }
        }
    },
    loadCurrentBackground: function () {
        body.style.backgroundImage = `url('${this.currentBackground.image}')`;
    },

    start: function () {
        // Render backgroundlist
        this.render();

        // Định nghĩa các thuộc tính cho object
        this.defineProperties();

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents();

        // Tải thông tin background đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentBackground();
    }
}

backgroundSlide.start();

