(function () {
    
    const alertType = 'follow',
        showIntroText = 'false', // true or false
        showFloatingText = 'floatingRight',
        fpsValue = 60,
        soundOneURL = 'https://uploads.twitchalerts.com/000/070/135/721/predator-' + alertType + '.ogg',
        animationPath = 'https://ext-assets.streamlabs.com/users/140067/predator-' + alertType + '-' + fpsValue +  '.json';
    
    var introDelay = 1.5,
        animationDelay = 0,
        audioDelay = .1,
        accentColor = "#00ff00",
        floatTextColor = "#FFFFFF",
        floatOffset = -100,
        soundVolume = 30 * .01,
        soundOne,
        floatAnimateOffset
    ;
    
    function loadScript (url) {
      return new Promise(function (resolve, reject) {
        const script = document.createElement('script')
        script.onload = resolve
        script.onerror = reject
  
        script.src = url
  
        document.head.appendChild(script)
      })
    }
    
    loadScript('https://ext-assets.streamlabs.com/users/140067/gsap-2-1-1.js').then(function () { 
      loadScript('https://ext-assets.streamlabs.com/users/140067/bm.js').then(function () {
        if(alertType == 'follow' || alertType == 'cheer'){
          animate();
        } else {
          var elem = document.getElementById("animationWindow")
          var animData = {
              container: elem,
              renderer: 'svg',
              loop: false,
              autoplay: false,
              rendererSettings: {
                  progressiveLoad:true
              },
              path: animationPath
          };
         
          anim = bodymovin.loadAnimation(animData);
          anim.setSpeed(1);
          anim.addEventListener('data_ready', function(){
            animate();
          });
        }
      });
    })
  
  var animate = function() {
    
    loadSources();
    
    soundOne = document.getElementById("soundOne");
        
    /* ===================================================*/
    /* Helpers Functions =================================*/
    /* ===================================================*/
    
    // timeline animations 
    
    const alertContainer = document.querySelector("#alertContainer"),
          introText = document.querySelector("#introText"),
          topLine = document.querySelector("#introText #topLine"),
          botLine = document.querySelector("#introText #botLine"),
          mainHolder = document.querySelector("#mainHolder"),
          innerShapeTwo = document.querySelector("#innerShapeTwo"),
          mainText = document.querySelector("#mainText"),
          imageHolder = document.querySelector("#imageHolder"),
          actualImage = document.querySelector("#actualImage"),
          floatingText = document.querySelector("#floatingText"),
          gradientCircle = document.querySelector("#gradientCircle"),
          innerImage = document.querySelector("#innerImage"),
          innerShapeOne = document.querySelector("#innerShapeOne"),
          cornerTriangs = document.querySelectorAll("#cornerTriangles polygon")
          ;
    
    if(showIntroText && alertType == 'follow'){
      audioDelay = 1.5;
    }
    
    if(alertType == 'bars'){
      if(showIntroText){
        introDelay = 0;
        animationDelay = 1.5;
        audioDelay = 1.4;
      }
      if(!showIntroText){
        introDelay = 0;
        animationDelay = .2;   
      }
    }
    if(alertType == 'cheer'){
      var holder = document.getElementById("imageHolder");
      holder.classList.add("dontHide");
      var image = document.getElementById("actualImage");
      image.classList.add("dontHide");
      if(showIntroText){
        introDelay = 0;
        animationDelay = 0;
        audioDelay = 1.4;
      }
      if(!showIntroText){
        introDelay = 0;
        animationDelay = 0;   
      }
    }
  
    if(alertType == 'circle' || alertType == 'diamond' || alertType == 'rectangle' || alertType == 'hexagon'){
      audioDelay = .6;
    }
  
    if(alertType == 'swipe'){
      if(showIntroText){
        introDelay = 0;
        animationDelay = 1.5;
        audioDelay = 1.4;
      }
      if(!showIntroText){
        introDelay = 0;
        animationDelay = .2;
        audioDelay = .6;
      }
    }
    if(showFloatingText == 'false'){
       var holder = document.getElementById("floatingText");
       holder.classList.add("hideImage");
    } else {
      outroDelay = .8;
    }
    if(floatOffset >= 0){
      TweenMax.set(floatingText, {y: "-=40"})
      floatAnimateOffset = "+=80";
    }
    if(floatOffset < 0){
      TweenMax.set(floatingText, {y: "+=40"})
      floatAnimateOffset = "-=80";
    }
  
    // cap fps
    TweenLite.ticker.fps(fpsValue);
  
    // looping animations 
    TweenMax.to(gradientCircle, 4, {rotation: -359, ease: Power0.easeNone, repeat: -1});
    TweenMax.to(innerImage, 4, {rotation: 359, ease: Power0.easeNone, repeat: -1});
    TweenMax.to(innerShapeOne, 18, {y: -563, ease: Power0.easeNone, repeat: -1});
    TweenMax.staggerFrom(cornerTriangs, 2, {yoyo: true, repeat: -1, scale: .6, opacity:0, transformOrigin: "center center"}, 0.2);
       
    tl = new TimelineMax({paused: true});
    tl.timeScale(1);
    
    tl.to(alertContainer, .1, {autoAlpha: 1, delay: .2, onComplete: playSound})
    
      if(alertType !== 'follow'){
        animTl = new TimelineMax();
        animTl
          .to(alertContainer, .1, {delay: .1, onComplete: playAnimation})
          .to(alertContainer, .1, {delay: introDelay})
        tl.add(animTl);
      }
    
      if(showIntroText){
        introTl = new TimelineMax();
        introTl
          .set(introText, {autoAlpha: 1 })
          .from(topLine, .2, {scale: 1.2, transformOrigin: "center"})
          .from(botLine, .2, {scale: 1.2, transformOrigin: "center"}, '-=.2')
          .to(topLine, .2, {delay: 1, autoAlpha: 0, scale: 1.2, transformOrigin: "center"})
          .to(botLine, .2, {autoAlpha: 0, scale: 1.2, transformOrigin: "center"}, "-=.2")
        tl.add(introTl);
      }
      
      mainAreaTl = new TimelineMax();
      mainAreaTl
        .from(mainHolder, .4, {autoAlpha: 0}, "-=.1")
        .from(mainHolder, 1, {x: "-=300", ease: Power4.easeOut}, "-=.6")
        .from(innerShapeTwo, .6, {x: "-100%", ease: Power4.easeOut}, "-=.6")
        .from(mainText, .1, {autoAlpha: 0})
        .to(innerShapeTwo, .6, {x: "-100%", ease: Power1.easeIn}, "-=.3")
        .from(mainText, .4, {color: accentColor}, "-=.2")
      tl.add(mainAreaTl);
  
      if(alertType == 'cheer'){
        cheerTl = new TimelineMax();
        cheerTl
          .to(imageHolder, .3, {ease: Power1.easeOut, y: "-=200", autoAlpha: 1}, "-=.2")
          .to(actualImage, .3, {ease: Power1.easeOut, y: "-=200", autoAlpha: 1}, "-=.2")
          .to(imageHolder, .4, {ease: Power4.easeIn, y: "+=100"})
          .to(actualImage, .4, {ease: Power4.easeIn, y: "+=100"}, "-=.2")
         tl.add(cheerTl);
      }
    
      if(showFloatingText !== 'false'){
        floatTl = new TimelineMax({pause: true});
        floatTl
          .to(floatingText, 1, {autoAlpha: 1, color: floatTextColor, ease: Power2.easeOut})
          .to(floatingText, 3, {y: floatAnimateOffset, ease: Circ.easeOut}, "-=1")
          .to(floatingText, 1, {autoAlpha: 0}, "-=1.2")
        tl.add(floatTl);
      }
      
      outro = new TimelineMax();
      outro
        .to(mainHolder, 1, {delay: outroDelay, x: "+=200", ease: Power4.easeIn})
        .to(mainHolder, .3, {autoAlpha: 0}, "-=.3")
      tl.add(outro);
    
      if(alertType == 'cheer'){
        cheerOutroTl = new TimelineMax();
        cheerOutroTl
          .to(imageHolder, .4, {x: "+=40", autoAlpha: 0}, "-=.2")
          .to(actualImage, .4, {x: "+=40", autoAlpha: 0}, "-=.4")
        tl.add(cheerOutroTl);
      }
    
    ;
    
    function awaitVideoLoad (media) {
      return new Promise((resolve, reject) => {
        media.oncanplay = resolve
        media.onerror = reject
      })
    }
    
    function playAnimation(){
      setTimeout(function(){ 
        anim.play();
      }, animationDelay * 1000);
    }
    
    function playSound(){
      setTimeout(function(){ 
        soundOne.play();
      }, audioDelay * 1000);
    }
    
    async function loadSources() {
      
      // Stuff to load
      soundOne = document.getElementById("soundOne");
      soundOne.src = soundOneURL;
      soundOne.volume = soundVolume;
  
      await Promise.all([
        awaitVideoLoad(soundOne)
      ])
  
      // Once sources have loaded
      soundOne.oncanplaythrough = function() {
        tl.play()
      };
    } 
  }
  
  }());
