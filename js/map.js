class Mapbox {
    constructor() {
        L.mapbox.accessToken = 'pk.eyJ1IjoiZGF2aWRjb2xpbiIsImEiOiJjanB6YmNsanYwOWV1NDFwbG4xemo5eWN6In0.jB9w3YalLWznkRiWkO7VPw';
        this.map = L.mapbox.map('map-leaflet', 'mapbox.run-bike-hike')
            .setView([45.75, 4.85], 15);
        this.removeScroll();
        this.load(this.map);
    }

    removeScroll () {
        this.map.scrollWheelZoom.disable();
        // supprime le scroll de la carte sur mobile:
        if (this.map.tap) {
            this.map.tap.disable();
            this.map.dragging.disable(); 
        }        
    }

    // méthode chargement de la carte
    load (map) {
        
        // chargement de l'API JCDecaux
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=e505d78a0bf249fdee893e66c068a9db04673366", function (reponse) {
            // Transforme la réponse en tableau d'objets JavaScript
            let stations = JSON.parse(reponse);
            let markersCluster = new L.MarkerClusterGroup({
                maxClusterRadius: 170,
                disableClusteringAtZoom: 14
            });
            stations.forEach(function (station) {
                //console.log(station.address, station.name, station.banking, station.status, station.available_bikes);
                // Chargement des marqueurs
                let marker = L.marker([station.position.lat, station.position.lng]);
                // 3 couleurs de marqueurs
                if (station.status === "OPEN" && station.available_bikes != 0) {
                    marker.setIcon(L.mapbox.marker.icon({
                        'marker-size': 'medium',
                        'marker-color': '#284fa1',
                        'marker-symbol': 'bicycle'
                    }))
                } else if (station.status === "OPEN" && station.available_bikes === 0) {
                    marker.setIcon(L.mapbox.marker.icon({
                        'marker-size': 'medium',
                        'marker-color': '#3e7cd6',
                        'marker-symbol': 'bicycle'
                    }))
                } else {
                    marker.setIcon(L.mapbox.marker.icon({
                        'marker-size': 'medium',
                        'marker-color': '#BBB', //'#5D7DD1',
                        'marker-symbol': 'cross'
                    }))
                } 
                
                // Affichage des détails de la station
                marker.addEventListener("click", function(){
                    if (station.available_bikes === 0) {
                        document.querySelector("#reservation_form").style.display = "none";
                        document.querySelector("#sign_form").style.visibility = "hidden";
                    } else {
                        document.querySelector("form").style.display = "block";
                    }
                    $('html, body').animate({scrollTop: $('#reservation').offset().top}, 300);
                    document.querySelector("#reservation").style.transform = 'translate3d(0, 0, 0)';
                    if (window.matchMedia("(min-width: 576px)").matches) {
                        $("#service_container").animate({ 
                            'padding-right': "400px",
                          }, "300");
                    } else {
                        document.querySelector("#service_container").style.paddingRight = '0px';
                    }
                    // Ferme le volet de réservation
                    document.querySelector("#btn_close").addEventListener("click", function() {
                        document.querySelector("#reservation").style.transform = 'translate3d(100%, 0, 0)';
                        document.querySelector("#service_container").style.paddingRight = '0px';
                    })
                    document.querySelector("#station_name").textContent = station.name;
                    document.querySelector("#station_address").textContent = station.address;
                    document.querySelector("#bike_stands .nbr").textContent = station.bike_stands;
                    document.querySelector("#available_bikes .nbr").textContent = station.available_bikes;
                });

                // Ajoute les markers aux clusters
                markersCluster.addLayer(marker);
                // Ajoute les clusters à la carte
                map.addLayer(markersCluster);
            });
        });
    }
}

let map = new Mapbox()