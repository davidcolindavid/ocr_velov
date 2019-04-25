class Canvas {
    constructor() {  
        this.canvas = document.getElementById('canvas_sign');  
        
        this.isDrawing = false;
        this.drew = false;

        this.countDownStop = true
        
        this.init()
        this.drawStart()
        this.drawMove()
        this.drawEnd()
        this.initEvent()
        this.initCountDown()
        this.submit()
    }
    
    init() {
        // CANVAS OPTIMISE POUR LES ECRANS RETINAS:
        // récupère le device pixel ratio
        this.dpr = window.devicePixelRatio || 1;    
        // récupère la taille du canvas en pixels
        this.rect = this.canvas.getBoundingClientRect()
        // donne les dimensions au canvas en pixels
        // taille * device pixel ratio.
        // console.log(this.rect.width, this.dpr)
        this.canvas.width = this.rect.width * this.dpr;
        this.canvas.height = this.rect.height * this.dpr;
        this.ctx = this.canvas.getContext('2d');
        // mise à l'échelle selon le terminal de l'utilisateur
        this.ctx.scale(this.dpr, this.dpr);
        
        // Style ligne
        this.ctx.strokeStyle = "#ffffff";
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = "round";
    }


    drawStart() {
        this.isDrawing = true
        // défini un nouveau tracé
        this.ctx.moveTo(this.x, this.y) 
        this.ctx.beginPath()
    }

    drawMove() {
        if (this.isDrawing) {
            this.ctx.lineTo(this.x, this.y);
            this.ctx.stroke();
        }
    }

    drawEnd() {
        this.isDrawing = false
    }

    initEvent() {
        // Evenement redimentionnement de la fenêtre
        window.addEventListener('resize', function () {
            canvas.init()
        }); 

        // Evenement souris
        this.canvas.addEventListener("mousedown", function (e) {
            canvas.x = e.pageX - $('#canvas_sign').offset().left;
            canvas.y = e.pageY - $('#canvas_sign').offset().top;
            canvas.drawStart();
            canvas.drew = true;
        })

        this.canvas.addEventListener("mousemove", function(e) {
            canvas.x = e.pageX - $('#canvas_sign').offset().left;
            canvas.y = e.pageY - $('#canvas_sign').offset().top;
            canvas.drawMove();
        });

        this.canvas.addEventListener("mouseup", function() {
            canvas.drawEnd();
        })


        // Evenement tactile
        this.canvas.addEventListener("touchstart", function (e) {
            e.preventDefault();
            canvas.y = e.changedTouches[0].pageY - $('#canvas_sign').offset().top;
            canvas.x = e.changedTouches[0].pageX - $('#canvas_sign').offset().left;
            canvas.drawStart();
            canvas.drew = true;
        })

        this.canvas.addEventListener("touchmove", function(e) {
            e.preventDefault();
            canvas.y = e.changedTouches[0].pageY - $('#canvas_sign').offset().top;
            canvas.x = e.changedTouches[0].pageX - $('#canvas_sign').offset().left;
            canvas.drawMove();
        });

        this.canvas.addEventListener("touchend", function(e) {
            e.preventDefault();
            canvas.drawEnd()
        })


        // Evenement btn annuler
        document.querySelector("#btn_clear").addEventListener("click", function (e) {
            canvas.ctx.clearRect(0, 0, canvas.canvas.width, canvas.canvas.height);
            sessionStorage.clear();
            $("#validation").slideUp("fast");
            document.querySelector("#ok").style.display = "none";
            canvas.drew = false;
            e.preventDefault();
            canvas.countDownStop = true;
        })
    }

    initCountDown() {
        // Sélectionne l'élément du Dom
        this.secElt = document.querySelector("#seconde")
        this.minElt = document.querySelector("#minute")
        // Initialisation du compteur à 20min
        this.secElt.textContent = 0
        this.minElt.textContent = 20
        // Affiche le décompte dans le Dom
        this.sec = this.secElt.textContent; // 0 dans le DOM
        this.min = this.minElt.textContent; // 20 dans le DOM
    }

    submit() {
        // Message reservation perdue
        this.pCanceled = document.createElement('p')
        this.pCanceled.appendChild(document.createTextNode("Réservation perdue"));
        document.querySelector('#validation').appendChild(this.pCanceled);
        this.pCanceled.style.display = "none"

        // Lance le décompte, nécessaire si on actualise la page
        this.countdown = setInterval(counter, 1000);

        document.querySelector('#btn_valider').addEventListener('click', function (e) {
            e.preventDefault();
            if (canvas.drew === true) {
                // copie des infos stations/prénom/nom depuis le DOM ou le localstorage
                let infoStationElt = document.querySelector("#station_name").textContent;
                document.querySelector("#infostation").textContent = infoStationElt
                let infoPrenomElt = localStorage.getItem("Prénom");
                document.querySelector("#infoprenom").textContent = infoPrenomElt
                let infoNomElt = localStorage.getItem("Nom");
                document.querySelector("#infonom").textContent = infoNomElt

                sessionStorage.setItem("Sign", canvas.canvas.toDataURL());
                $("#validation").slideDown("fast");
                canvas.countDownStop = false
                // Relance le décompte à partir de 20min
                canvas.initCountDown()
                // Affiche le message de réservation
                document.querySelector("#ok").style.display = "block";
                canvas.pCanceled.style.display = "none"
        
                // Enregistrement des données dans sessionStorage
                sessionStorage.setItem('Station', infoStationElt);
                sessionStorage.setItem('Prénom', infoPrenomElt);
                sessionStorage.setItem('Nom', infoNomElt);
                clearInterval(canvas.countdown)
                canvas.countdown = setInterval(counter, 1000);
            }
        })
        
        // Décompte à partir de 20min
        
        function counter () {
            if (canvas.countDownStop === false) {
                if (canvas.sec == 0 && canvas.min > 0) { 
                    canvas.sec = 59;
                    canvas.min--;
                } else if (canvas.sec > 0) {
                    canvas.sec--;
                } 
                canvas.minElt.textContent = canvas.min
                canvas.secElt.textContent = canvas.sec 
                sessionStorage.setItem('Sec', canvas.sec)
                sessionStorage.setItem('Min', canvas.min)
                if (canvas.sec == 0 & canvas.min == 0) {
                    clearInterval(canvas.countdown)
                    if (canvas.countDownStop === false) {
                        document.querySelector("#ok").style.display = "none";
                        canvas.pCanceled.style.display = "block"
                        canvas.countDownStop = true
                        if (window.sessionStorage) {
                            // Suppression des données dans le session storage
                            sessionStorage.clear();
                        }
                    }
                } 
            }   
        };

        if (sessionStorage.length != 0) { 
            this.countDownStop = false
            $("#validation").slideDown("fast");
            // Affiche les données enregistrées dans sessionStorage
            this.sec = sessionStorage.getItem('Sec')
            this.min = sessionStorage.getItem('Min')
            document.querySelector("#infostation").textContent = sessionStorage.getItem('Station')
            document.querySelector("#infoprenom").textContent = sessionStorage.getItem('Prénom')
            document.querySelector("#infonom").textContent = sessionStorage.getItem('Nom')
        }
    }
}

const canvas = new Canvas ()