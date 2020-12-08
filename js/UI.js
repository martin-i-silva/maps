class UI {
    constructor() {
        // Instanciar la API
        this.api = new API();
        //console.log(this.api)

        // crear los markers con layer groups
        this.markers = new L.layerGroup();
         // Iniciar el mapa
         this.mapa = this.inicializarMapa();

    }

    inicializarMapa() {
         // Inicializar y obtener la propiedad del mapa
         const map = L.map('mapa').setView([19.390519, -99.3739778], 6);
         const enlaceMapa = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
         L.tileLayer(
             'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
             attribution: '&copy; ' + enlaceMapa + ' Contributors',
             maxZoom: 18,
             }).addTo(map);
         return map;

    }
    mostrarEstablecimientos() {
        // muestra los puntos en el mapa
        this.api.obtenerDatos()
            .then(datos => {
                const resultado = datos.respuestaJSON.results;

                // ejecutar la funcion para mostrar los pines
                this.mostrarPines(resultado);
            })
    }
    mostrarPines(datos){
        // limpiar los markers antes de mandarlo a llamar con una funcion de leaflets
        this.markers.clearLayers();
        // recorrer los establecimientos
        datos.forEach(dato=>{
            // destructuring
            const{latitude, longitude, calle, regular, premium} = dato;
            
            // crear un pop up
            const opcionesPopUp = L.popup()
                .setContent(`
                <p>Calle: ${calle}</p>
                <p><b>Regular:</b> ${regular}</p>
                <p><b>Premium:</b> ${premium}</p>
                `)

            // agregar el pin
            const marker = new L.marker([
                parseFloat(latitude),
                parseFloat(longitude)
            ]).bindPopup(opcionesPopUp) ;
            this.markers.addLayer(marker);
        })
        this.markers.addTo(this.mapa)
    }

    obtenerSugerencias(busqueda){
        this.api.obtenerDatos()
        .then(datos=>{
            const resultado = datos.respuestaJSON.results;
        // enviar el JSON y la busqueda para el filtrado
        this.filtrarSugerencias(resultado, busqueda)
        })
    }
    // filtrar las sugerencias en base al input
    filtrarSugerencias(resultado, busqueda){
        // filtrar con .filter 
        const filtro = resultado.filter(filtro => filtro.calle.indexOf(busqueda) !== -1)
        console.log(filtro)
        // mostrar los pines
        this.mostrarPines(filtro);
    }   
}

