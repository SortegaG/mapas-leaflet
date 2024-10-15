let titulo;
let fecha;
let ubicacion;
let codigo;
let magnitud;
let resultados;
let fechaConv;

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        console.log(`Latitud: ${position.coords.latitude}\nLongitud: ${position.coords.longitude}`);

        var map = L.map("map").setView([position.coords.latitude, position.coords.longitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

    var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);

    });
} else {
    console.warn("Tu navegador no soporta Geolocalización!! ");
}


//var map = L.map("map").setView([40.4233, -3.6927], 13);

// L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     maxZoom: 19,
//     attribution:
//         '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
// }).addTo(map);

// var marker = L.marker([40.4233, -3.6927]).addTo(map);

// -------------------------------------------------------------------------------------------

async function getEarthquake() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }

        const data = await response.json();
        resultados = data.features;

        titulo = resultados.map(dato => dato.properties.title);
        fecha = resultados.map(dato => new Date(dato.properties.time));
        ubicacion = resultados.map(dato => dato.geometry.coordinates);
        codigo = resultados.map(dato => dato.properties.code);
        magnitud = resultados.map(dato => dato.properties.mag);

        return { resultados, titulo, fecha, ubicacion, codigo, magnitud };

    } catch (error) {
        console.log('Error', error);
    }
}

getEarthquake().then(dato => console.log(dato));
const getIconByMagnitude = (magnitude) => {
    if (magnitude <= 2) {
        return L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34]
        });
    } else if (magnitude <= 4) {
        return L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-orange.png',
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [1, -34]
        });
    } else if (magnitude <= 6) {
        return L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
            iconSize: [35, 50],
            iconAnchor: [17, 50],
            popupAnchor: [1, -34]
        });
    } else {
        return L.icon({
            iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-black.png',
            iconSize: [40, 55],
            iconAnchor: [20, 55],
            popupAnchor: [1, -34]
        });
    }
}


// -------------------------------------------------------------------------------------------
// Segundo mapa
var map2 = L.map("map2").setView([40.4233, -3.6927], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 3,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map2);

async function addMarkers() {
    await getEarthquake();

    for (let i = 0; i < ubicacion.length; i++) {

        const icono = getIconByMagnitude(magnitud[i]); // Asignar el ícono según la magnitud
        const marcador2 = L.marker([ubicacion[i][1], ubicacion[i][0]], { icon: icono }).addTo(map2);
        marcador2.bindPopup(`<p><strong>Título:</strong><br />${titulo[i]}</p>
                            <p><strong>Ubicación (Lat, Long):</strong><br />${ubicacion[i][1]}, ${ubicacion[i][0]}</p>
                            <p><strong>Código:</strong><br />${codigo[i]}</p>
                            <p><strong>Fecha:</strong><br />${fecha[i]}</p>
                            <p><strong>Magnitud (escala Richter):</strong><br />${magnitud[i]}</p>`).openPopup();
    }
}

addMarkers();