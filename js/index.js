const canvas = document.getElementById('map')
const ctx = canvas.getContext('2d')
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let adj = {}
let start = ""
let end = ""

const loadJSON = async (url) => {
    const response = await fetch(url)
    return await response.json()
}

const init = async () => {
    const corners = await loadJSON('../assets/db/corners.json')
    const streets = await loadJSON('../assets/db/streets.json')

    adj = Array(corners.length).fill(null).map(() => [])

    streets.forEach(street => {
        let start = corners[street.startVertex];
        let end = corners[street.endVertex];

        ctx.beginPath();
        ctx.moveTo(start.ejeX * canvas.width, start.ejeY * canvas.height);
        ctx.lineTo(end.ejeX * canvas.width, end.ejeY * canvas.height);
        ctx.strokeStyle = 'white'; 
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
        ctx.fillStyle = 'white'
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
    start = this.value
})

document.getElementById('destination-vertex').addEventListener('change', function() {
    end = this.value
})

const startAlg = () =>{
    console.log(start, end)
    dijkstra(adj, start, end)
}

init()
loadCities()



