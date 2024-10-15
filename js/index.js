const canvas = document.getElementById('map')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let adj = {}
let source = ""
let destination = ""
let selectedSource = null
let selectedDestination = null
let path = []

const loadJSON = async (url) => {
    const response = await fetch(url)
    return await response.json()
}

const drawMap = async () => {
    const corners = await loadJSON('../assets/db/corners.json')
    const streets = await loadJSON('../assets/db/streets.json')

    adj = Array(corners.length).fill(null).map(() => [])

    streets.forEach(street => {
        let start = corners[street.startVertex];
        let end = corners[street.endVertex];

        ctx.beginPath();
        ctx.moveTo(start.ejeX * canvas.width, start.ejeY * canvas.height);
        ctx.lineTo(end.ejeX * canvas.width, end.ejeY * canvas.height);

        if(isShortPath(street.startVertex, street.endVertex)){
            ctx.strokeStyle = 'blue'; 
        }else{
            ctx.strokeStyle = 'white'; 
        }

        ctx.stroke();

        let mx = ((start.ejeX * canvas.width) + (end.ejeX * canvas.width)) / 2;
        let my = ((start.ejeY * canvas.height) + (end.ejeY * canvas.height)) / 2;

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.fillText(`${street.distance}`, mx, my);

        adj[parseInt(street.startVertex)][parseInt(street.endVertex)] = parseInt(street.distance)
        adj[parseInt(street.endVertex)][parseInt(street.startVertex)] = parseInt(street.distance)
    });

    corners.forEach(corner => {
        ctx.beginPath()
        ctx.arc(corner.ejeX * canvas.width, corner.ejeY * canvas.height, 10, 0, Math.PI * 2)

        if(parseInt(corner.vertex) == selectedSource){
            ctx.fillStyle = 'green'
        }else if(parseInt(corner.vertex) == selectedDestination){
            ctx.fillStyle = 'red'
        }else{
            ctx.fillStyle = 'white'
        }
        
        ctx.fill()
    })
}

const loadCities = async () => {
    const corners = await loadJSON('../assets/db/corners.json')
    const sourceVertex = document.getElementById('source-vertex')
    const destinationVertex = document.getElementById('destination-vertex')
        
    corners.forEach(corner => {
        let optionSource = new Option(corner.city, corner.vertex)
        let destinationSource = new Option(corner.city, corner.vertex)
        
        sourceVertex.add(optionSource)
        destinationVertex.add(destinationSource)
    })
}

document.getElementById('source-vertex').addEventListener('change', function() {
    source = this.value
    selectedSource = parseInt(this.value)
    drawMap()
})

document.getElementById('destination-vertex').addEventListener('change', function() {
    destination = this.value
    selectedDestination = parseInt(this.value)
    drawMap()
})

const startAlg = () =>{
    console.log(source, destination)
    dijkstra(adj, source, destination)
}

const pathAlg = (pahtA) => {
    path = pahtA
    console.log(path)
    drawMap()
}

const isShortPath = (startVertex, endVertex) => {
    for(let i = 0; i < path.length - 1; i++){
        if((startVertex == path[i] && endVertex == path[i + 1]) || (endVertex == path[i] && startVertex == path[i + 1])){
            return true
        }
    }

    return false
}

drawMap()
loadCities()



