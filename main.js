(async () => {

  // Settings
  const fadeDuration = 0.4;
  const volume = 0;
  const numFiles = 15;
  const basePath = "../../_media/";
  const movieTypes = ["webm", "mp4"];
  const imageTypes = ["png", "gif", "jpg", "jpeg", "svg"];
  const container = document.querySelector("#container");
  const imageDuration = Math.max(await getImageDuration(), fadeDuration * 2);

  // App
  const fileTypes = [];
  let loopers = [];

  movieTypes.forEach(type => fileTypes.push({
    type,
    isVideo: true
  }));

  imageTypes.forEach(type => fileTypes.push({
    type,
    isImage: true
  }));

  class Looper {
    constructor(fileName) {
      this.fileName = fileName;
      this.isValid = false;
    }

    async load() {

      const baseUrl = basePath + this.fileName;

      const configs = fileTypes.map(config => {
        return {
          ...config,
          url: `${baseUrl}.${config.type}`
        };
      });

      const res = await Promise.all(
        configs.map(config => this.fetchFile(config))
      );

      const config = res.filter(r => r)[0];

      if (!config) {
        return;
      }

      this.url = config.url;
      this.isVideo = config.isVideo;
      this.isImage = config.isImage;
      const element = await this.createElement();

      if (element) {
        this.element = element;
        this.isValid = true;
      }
    }

    fetchFile(config) {
      return new Promise(async (resolve) => {

        $.get(config.url)
          .done(() => resolve(config))
          .fail(() => resolve());
      });
    }

    createImage() {
      return new Promise((resolve) => {
        const element = new Image();
        element.src = this.url;
        element.onload = fulfill;
        element.onerror = fulfill;

        function fulfill(e) {
          element.onload = null;
          element.onerror = null;
          if (e.type === "error") {
            resolve();
          } else {
            resolve(element);
          }            
        }
      });
    }

    createVideo() {
      return new Promise((resolve) => {
        const element = document.createElement("video");
        element.src = this.url;
        element.volume = volume;

        if (element.readyState > 3) {
          resolve(element);
        } else {
          element.oncanplaythrough = fulfill;
          element.onerror = fulfill;
        }

        function fulfill(e) {
          element.oncanplaythrough = null;
          element.onerror = null;
          if (e.type === "error") {
            resolve();
          } else {
            resolve(element);
          }            
        }
      });
    }

    createElement() {

      if (this.isVideo) {
        return this.createVideo();
      }

      return this.createImage();
    }

    play() {
      if (this.isVideo) {
        
        this.playVideo();
      } else {
        this.playImage();
      }
    }

    playNext() {

      if (!this.delay) {
        return this.next.play();
      }

      gsap.delayedCall(this.delay, () => this.next.play());
    }

    playVideo() {
      
      const element = this.element;
      element.currentTime = 0;
      element.play();
      gsap.set(element, { autoAlpha: 1 });
      element.onended = () => {
        element.onended = null;
        gsap.set(element, { autoAlpha: 0 });
        this.playNext();
      }
    }

    playImage() {
      gsap.timeline({ onComplete: () => this.playNext()})
        .to(this.element, {
          duration: fadeDuration,
          autoAlpha: 1
        })
        .to(this.element, {
          duration: fadeDuration,
          autoAlpha: 0
        }, "+=" + (imageDuration - fadeDuration * 2));   
    }
  }

  init();

  async function init() {
    
    for (let i = 0; i < numFiles; i++) {
      const looper = new Looper(i + 1);
      
      loopers.push(looper);
    }
    
    await Promise.all(loopers.map(looper => looper.load()));
    
    loopers = loopers.filter(looper => looper.isValid);

    function randomArrayShuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }
    
    randomArrayShuffle(loopers); 
    
    if (!loopers.length) {
      return showWarning();
    }

    const wrap = gsap.utils.wrap(loopers);

    loopers.forEach((looper, i) => {
      container.append(looper.element);
      looper.next = wrap(i + 1);
      
      if (delayBetweenEach) {
        looper.delay = delay;
      }
      
    });

    if (!delayBetweenEach) {
    loopers[loopers.length - 1].delay = delay;
    }
    
    loopers[0].play();

    gsap.set(container, { autoAlpha: 1 });
  }

  function showWarning() {
    $.get("../../_code/warning.html")
      .done(res => $("body").append(res));
  }

  function getImageDuration() {
    return new Promise(resolve => {
      $.get("../../_options/image-duration.txt")
        .done(res => {
          resolve(parseFloat(res));
        })
        .fail(() => resolve(1)); // fallback
    });
  }
})();
