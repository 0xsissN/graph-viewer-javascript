/**
 * Create the map using canva 
 */

const canvas = $('#map').get(0)
const ctx = canvas.getContext('2d')

let adj = []
let source = ""
let destination = ""
let selectedSource = null
let selectedDestination = null
let path = []

/**
 * Loads JSON files from an URL
 */

const loadJSON = async (url) => {
    const response = await fetch(url)
    return await response.json()
}

/**
 * This function draws the map
 * Loads the data from JSON files
 * Using coordinates, draws vertices and connections
 * Creates the graph structure
 * Handles the logic for displaying the optimized path
 */

const drawMap = async () => {
    const cities = await loadJSON('../assets/db/cities.json')
    const routes = await loadJSON('../assets/db/routes.json')

    adj = Array(cities.length).fill(null).map(() => [])

    routes.forEach(route => {
        let start = cities[route.startVertex];
        let end = cities[route.endVertex];

        ctx.beginPath();
        ctx.moveTo(start.ejeX * canvas.width * 4, start.ejeY * canvas.height);
        ctx.lineTo(end.ejeX * canvas.width * 4, end.ejeY * canvas.height);

        if (isShortPath(route.startVertex, route.endVertex)) {
            ctx.strokeStyle = 'blue';
        } else {
            ctx.strokeStyle = 'white';
        }

        ctx.stroke();

        let mx = ((start.ejeX * canvas.width * 4) + (end.ejeX * canvas.width * 4)) / 2;
        let my = ((start.ejeY * canvas.height) + (end.ejeY * canvas.height)) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`${route.distance}`, mx, my);

        adj[parseInt(route.startVertex)][parseInt(route.endVertex)] = parseInt(route.distance)
        adj[parseInt(route.endVertex)][parseInt(route.startVertex)] = parseInt(route.distance)
    });

    cities.forEach(city => {
        ctx.beginPath();
        ctx.arc(city.ejeX * canvas.width * 4, city.ejeY * canvas.height, 10, 0, Math.PI * 2)

        if (parseInt(city.vertex) == selectedSource) {
            ctx.fillStyle = 'green'
        } else if (parseInt(city.vertex) == selectedDestination) {
            ctx.fillStyle = 'red'
        } else {
            ctx.fillStyle = 'white'
        }

        ctx.fill()
    })
}

/**
 * This function appends the list of cities to the select element (HTML)
 */

const loadCities = async () => {
    const cities = await loadJSON('../assets/db/cities.json')
    const sourceVertex = $('#source-vertex')
    const destinationVertex = $('#destination-vertex')

    cities.forEach(city => {
        let optionSource = $('<option>').val(city.vertex).text(city.city)
        let destinationSource = $('<option>').val(city.vertex).text(city.city)

        sourceVertex.append(optionSource)
        destinationVertex.append(destinationSource)
    })
}

/**
 * Handles sidebar expand/collapse functionality
 */

$('.toggle-btn').on('click', () => {
    $('#sidebar').toggleClass('expand')
})

/**
 * Handles the source and destination vertices highlighting
 */

$('#source-vertex').on('change', (e) => {
    let eTar = $(e.target).val()
    source = eTar
    selectedSource = parseInt(eTar)
    drawMap()
})

$('#destination-vertex').on('change', (e) => {
    let eTar = $(e.target).val()
    destination = eTar
    selectedDestination = parseInt(eTar)
    drawMap()
})

/**
 * Handles click event to execute Dijkstra's algorithm
 */

$('#start-alg').on('click', () => {
    dijkstra(adj, source, destination)
})


/**
 * Draws the shortest path with a different color
 */

const pathAlg = (pahtA) => {
    path = pahtA
    drawMap()
}

/**
 * Checks vertices existence in shortest path
 */

const isShortPath = (startVertex, endVertex) => {
    for (let i = 0; i < path.length - 1; i++) {
        if ((startVertex == path[i] && endVertex == path[i + 1]) || (endVertex == path[i] && startVertex == path[i + 1])) {
            return true
        }
    }

    return false
}

drawMap()
loadCities() 
