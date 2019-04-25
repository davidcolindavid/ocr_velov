class Carousel {
    constructor() {
        // Options
        this.slidesToScroll = 1;
        this.slidesVisible = 1;
        this.autoPlay = true;
        this.arrows = true;
        this.pause = true;

        // DOM
        this.container = document.querySelector('#carousel_container');
        this.children = this.container.children;
        this.currentItem = 0;
        this.firstItem = this.container.firstElementChild
        this.lastItem = this.container.lastElementChild
        // Boutons de navigation
        this.nextButton = document.querySelector('#carousel_next');
        this.prevButton = document.querySelector('#carousel_prev');
        this.pauseButton = document.querySelector('#carousel_pause');
        

        this.setStyle()
        this.slideNext()
        this.slidePrev()
        this.initEvent()
    }

    setStyle() {
        // Calcule: largeur du conteneur
        this.ratio = (this.children.length) / this.slidesVisible;
        this.container.style.width = (this.ratio * 100) + "%";
        // Calcule: taille des diapos
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].style.width = (((1 / this.slidesVisible) / this.ratio) * 100) + "%";
        }

        // Condition particulière
        if (this.slidesVisible >= this.children.length) {
            this.autoPlay = false
            this.pause = false
            this.arrows = false
        }
        
        if (this.arrows === false) {
            document.querySelector('#carousel').removeChild(this.nextButton)
            document.querySelector('#carousel').removeChild(this.prevButton)
        }
        if (this.pause === false) {
            document.querySelector('#carousel').removeChild(this.pauseButton)
        }
    }

    slideNext () {
        this.currentItem = this.currentItem + this.slidesToScroll
        this.translateX = -100 / (this.children.length);
        this.container.style.transition = "transform 0.3s";
        this.container.style.transform = 'translate3d(' + this.translateX + '%, 0, 0)';
        setTimeout (function() {
            carousel.container.appendChild(carousel.container.firstElementChild);
            carousel.container.style.transform = 'translate3d(0, 0, 0)';
            carousel.container.style.transition = "none";
            carousel.firstItem = carousel.container.firstElementChild // nécessaire de le redéfinir
            carousel.lastItem = carousel.container.lastElementChild // nécessaire de le redéfinir
        }, 300);
    }

    slidePrev () {
        this.container.insertBefore(this.container.lastElementChild, this.firstItem)
        this.container.style.transition = "none";
        this.translateX = -100 / (this.children.length);
        this.container.style.transform = 'translate3d(' + this.translateX + '%, 0, 0)';
        setTimeout (function () {
            carousel.container.style.transition = "transform 0.3s";
            carousel.container.style.transform = 'translate3d(0, 0, 0)';
            carousel.firstItem = carousel.container.firstElementChild // nécessaire de le redéfinir
            carousel.lastItem = carousel.container.lastElementChild // nécessaire de le redéfinir
        }, 100)
    }

    initEvent () {
        // Bouton suivant
        this.nextButton.addEventListener('click', function () { 
            window.clearInterval(carousel.automaticCarousel); 
            carousel.autoPlay = false;
            carousel.slideNext();
            document.querySelector("#carousel_pause i").className = "fa fa-play";
        })
        // Bouton précédent
        this.prevButton.addEventListener('click', function () {  
            window.clearInterval(carousel.automaticCarousel);
            carousel.autoPlay = false;
            carousel.slidePrev();
            document.querySelector("#carousel_pause i").className = "fa fa-play";
        })

        // Touches directionnelles du clavier
        document.addEventListener('keyup', function(e) {
            if (e.key === 'ArrowRight') {
                window.clearInterval(carousel.automaticCarousel);
                carousel.autoPlay = false;
                carousel.slideNext();
            } else if (e.key === 'ArrowLeft') {
                window.clearInterval(carousel.automaticCarousel);
                carousel.autoPlay = false;
                carousel.slidePrev();
            }
        })

        // Bouton Pause
        this.pauseButton.addEventListener('click', function () { 
            if (carousel.autoPlay === true) {
                carousel.autoPlay = false;
                window.clearInterval(carousel.automaticCarousel);
                document.querySelector("#carousel_pause i").className = "fa fa-play";
            } else {
                carousel.autoPlay = true;
                // clearInterval(automaticCarousel);
                window.clearInterval(carousel.automaticCarousel);
                carousel.automaticCarousel = setInterval(slider, 5000);
                document.querySelector("#carousel_pause i").className = "fas fa-pause";
            }
        })
        
        // navigation automatique
        this.automaticCarousel = setInterval(slider, 5000);
        function slider() { 
            if (carousel.autoPlay === true) {
                carousel.slideNext();
            }
        };

        // Bouton scroll jusqu'à la map
        document.querySelector("#arrow i").addEventListener("click", function () {
            $('html, body').animate({scrollTop: $('.map').offset().top}, 300);
        })
    }
};

var carousel = new Carousel();