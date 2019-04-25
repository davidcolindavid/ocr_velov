class Form {
    constructor() {
        this.forms = document.getElementById('reservation_form');
        this.firstName = document.querySelector('#prenom');
        this.lastName = document.querySelector('#nom');
        this.formSignElt = document.querySelector('#sign_form')
        this.validationElt = document.querySelector('#validation')
        self = this;

        this.save();
        this.show();
        this.booking();
    }

    save() {
        // Enregistrement des données dans localStorage
        this.firstName.addEventListener('keyup', function () {
            localStorage.setItem('Prénom', form.firstName.value); // stockage (clé, valeur)
        })

        this.lastName.addEventListener('keyup', function () {
            localStorage.setItem('Nom', form.lastName.value);
        })
    }

    show() {
        // Affiche des données du localStorage
        if (typeof(Storage) !== "undefined") {
            this.firstName.value = localStorage.getItem("Prénom");
            this.lastName.value = localStorage.getItem("Nom");
        } 
    }

    booking() {
        // Clique sur sur le btn réserver
        document.querySelector('#btn_reserver').addEventListener('click', function (e) {
            e.preventDefault();
            // Si les champs Prénom et Nom ne sont pas remplis
            if (self.firstName.value.trim().length === 0 || self.lastName.value.trim().length === 0) {
                // Signaler Prénom si aucun caractère
                if (self.firstName.value.length === 0) {
                    self.firstName.style.border = "1px solid #FFFFFF";
                    self.firstName.addEventListener("focus", function () {
                        self.firstName.style.border = "0px solid #4469C9";
                    }) 
                // Signaler nom si aucun caractère
                } else if (self.lastName.value.length === 0) {
                    self.lastName.style.border = "1px solid #FFFFFF";
                    self.lastName.addEventListener("click", function () {
                        self.lastName.style.border = "0px solid #4469C9";
                    })
                }
            // Si la case mention légale n'est pas cochée
            } else if ((document.querySelector("#rgpd").checked == false)) {
                document.querySelector('.checkbox .box').style.borderColor = "#FFFFFF";
                document.querySelector('.checkbox').addEventListener("click", function () {
                    document.querySelector('.checkbox .box').style.borderColor = "#396dca";
                })
            } else {
                // Affiche le canvas
                document.querySelector("#sign_form").style.visibility = "visible"
                $('html, body').animate({scrollTop: $('#reservation').offset().top}, 300);
                e.preventDefault();
            }  
        })
    }
}

let form = new Form ()