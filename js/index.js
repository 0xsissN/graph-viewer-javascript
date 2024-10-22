const canvas = $('#map').get(0) // Selecciona el elemento <canvas> con id "map" usando jQuery y obtiene el primer elemento (el DOM).
const ctx = canvas.getContext('2d') // Obtiene el contexto 2D del canvas para poder dibujar en él.

$('.toggle-btn').on('click', () => {
    $('#sidebar').toggleClass('expand') // Añade o quita la clase "expand" del sidebar cuando se haga clic en el botón de alternancia.
})

let adj = [] // Declaración de un array para almacenar la matriz de adyacencia que representa el grafo.
let source = "" // Variable que almacenará el vértice de origen.
let destination = "" // Variable que almacenará el vértice de destino.
let selectedSource = null // Variable que contiene el vértice seleccionado como origen en el mapa.
let selectedDestination = null // Variable que contiene el vértice seleccionado como destino en el mapa.
let path = [] // Array para almacenar el camino más corto calculado por el algoritmo de Dijkstra.

const loadJSON = async (url) => {
    const response = await fetch(url) // Función que carga un archivo JSON desde una URL dada.
    return await response.json() // Retorna el contenido del JSON como objeto.
}

const drawMap = async () => {
    const cities = await loadJSON('../assets/db/cities.json') // Carga la lista de ciudades (vértices) desde un archivo JSON.
    const routes = await loadJSON('../assets/db/routes.json') // Carga la lista de rutas (aristas) desde un archivo JSON.

    adj = Array(cities.length).fill(null).map(() => []) // Inicializa la matriz de adyacencia como un array bidimensional vacío.

    routes.forEach(route => {
        let start = cities[route.startVertex]; // Obtiene las coordenadas de la ciudad de inicio de la ruta.
        let end = cities[route.endVertex]; // Obtiene las coordenadas de la ciudad de fin de la ruta.

        ctx.beginPath(); // Inicia un nuevo camino en el contexto de dibujo.
        ctx.moveTo(start.ejeX * canvas.width * 4, start.ejeY * canvas.height); // Mueve el lápiz del canvas al inicio de la ruta.
        ctx.lineTo(end.ejeX * canvas.width * 4, end.ejeY * canvas.height); // Dibuja una línea desde el punto de inicio hasta el final de la ruta.

        if(isShortPath(route.startVertex, route.endVertex)){
            ctx.strokeStyle = 'blue'; // Si la ruta forma parte del camino más corto, pinta la línea de azul.
        }else{
            ctx.strokeStyle = 'white'; // Si no es parte del camino más corto, pinta la línea de blanco.
        }

        ctx.stroke(); // Dibuja la línea en el canvas.

        // Calcula el punto medio de la ruta para colocar la distancia en el centro de la línea.
        let mx = ((start.ejeX * canvas.width * 4) + (end.ejeX * canvas.width * 4)) / 2;
        let my = ((start.ejeY * canvas.height) + (end.ejeY * canvas.height)) / 2;

        // Dibuja el texto con la distancia de la ruta en el punto medio.
        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`${route.distance}`, mx, my);

        // Añade la distancia entre los vértices en la matriz de adyacencia.
        adj[parseInt(route.startVertex)][parseInt(route.endVertex)] = parseInt(route.distance)
        adj[parseInt(route.endVertex)][parseInt(route.startVertex)] = parseInt(route.distance)
    });

    cities.forEach(city => {
        ctx.beginPath(); // Comienza un nuevo camino para dibujar el vértice.
        ctx.arc(city.ejeX * canvas.width * 4, city.ejeY * canvas.height, 10, 0, Math.PI * 2) // Dibuja un círculo en la posición de la ciudad.

        // Colorea el vértice dependiendo de si es el origen, destino o ningún punto importante.
        if(parseInt(city.vertex) == selectedSource){
            ctx.fillStyle = 'green' // Si es el origen, pinta el vértice de verde.
        }else if(parseInt(city.vertex) == selectedDestination){
            ctx.fillStyle = 'red' // Si es el destino, pinta el vértice de rojo.
        }else{
            ctx.fillStyle = 'white' // Si no es ni origen ni destino, lo pinta de blanco.
        }
        
        ctx.fill() // Rellena el círculo con el color especificado.
    })
}

const loadCities = async () => {
    const cities = await loadJSON('../assets/db/cities.json') // Carga la lista de ciudades desde el JSON.
    const sourceVertex = $('#source-vertex') // Obtiene el elemento de selección del vértice de origen.
    const destinationVertex = $('#destination-vertex') // Obtiene el elemento de selección del vértice de destino.

    cities.forEach(city => {
        // Crea opciones para los selectores de ciudades de origen y destino, basándose en los datos cargados.
        let optionSource = $('<option>').val(city.vertex).text(city.city)
        let destinationSource = $('<option>').val(city.vertex).text(city.city)
        
        // Añade las opciones a los selectores de origen y destino.
        sourceVertex.append(optionSource)
        destinationVertex.append(destinationSource)
    })
}

$('#source-vertex').on('change', (e) => {
    let eTar = $(e.target).val() // Obtiene el valor seleccionado en el selector de origen.
    source = eTar // Almacena el vértice de origen seleccionado.
    selectedSource = parseInt(eTar) // Convierte el valor del origen a número y lo guarda en la variable.
    drawMap() // Redibuja el mapa con el nuevo origen seleccionado.
})

$('#destination-vertex').on('change', (e) => {
    let eTar = $(e.target).val() 
    destination = eTar 
    selectedDestination = parseInt(eTar) 
    drawMap() 
})

$('#start-alg').on('click', () => {
    dijkstra(adj, source, destination) // Ejecuta el algoritmo de Dijkstra cuando se hace clic en el botón de "Iniciar algoritmo".
})

const pathAlg = (pahtA) => {
    path = pahtA // Almacena el camino más corto resultante del algoritmo.
    drawMap() // Redibuja el mapa para resaltar el camino más corto.
}

const isShortPath = (startVertex, endVertex) => {
    for(let i = 0; i < path.length - 1; i++){
        // Verifica si el tramo entre dos vértices es parte del camino más corto.
        if((startVertex == path[i] && endVertex == path[i + 1]) || (endVertex == path[i] && startVertex == path[i + 1])){
            return true // Si es parte del camino más corto, devuelve true.
        }
    }

    return false // Si no es parte del camino más corto, devuelve false.
}

drawMap() // Dibuja el mapa inicialmente.
loadCities() // Carga las ciudades en los selectores de origen y destino.
