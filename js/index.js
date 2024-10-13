const canvas = document.getElementById('map')
const ctx = canvas.getContext('2d')
let adj = []

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

async function loadJSON(url){
    const response = await fetch(url)
    return await response.json()
}

async function init() {
    const corners = await loadJSON('../assets/db/corners.json')
    const streets = await loadJSON('../assets/db/streets.json')

    adj = Array(corners.length).fill(null).map(() => [])

    streets.forEach(street => {
        let start = corners[street.startVertex];
        let end = corners[street.endVertex];

        ctx.beginPath();
        ctx.moveTo(start.ejeX * canvas.width, start.ejeY * canvas.height);
        ctx.lineTo(end.ejeX * canvas.width, end.ejeY * canvas.height);
        ctx.strokeStyle = street.color; 
        ctx.stroke();

        let mx = ((start.ejeX * canvas.width) + (end.ejeX * canvas.width)) / 2;
        let my = ((start.ejeY * canvas.height) + (end.ejeY * canvas.height)) / 2;

        ctx.fillStyle = street.color;
        ctx.font = '13px Arial';
        ctx.fillText(`${street.distance}`, mx, my);

        adj[street.startVertex].push({vertex: parseInt(street.endVertex), distance: parseInt(street.distance)})
        adj[street.endVertex].push({vertex: parseInt(street.startVertex), distance: parseInt(street.distance)})
        
    });

    corners.forEach(corner => {
        ctx.beginPath()
        ctx.arc(corner.ejeX * canvas.width, corner.ejeY * canvas.height, 10, 0, Math.PI * 2)
        ctx.fillStyle = corner.color
        ctx.fill()
        ctx.strokeStyle = corner.stroke
        ctx.stroke()
    })

    printAdj(adj)
}

async function selectVertex() {
    const corners = await loadJSON('../assets/db/corners.json')

    canvas.addEventListener('click', (e) => {
        const canvasRect = canvas.getBoundingClientRect()
        let clickX = e.clientX - canvasRect.left
        let clickY = e.clientY - canvasRect.top

        corners.forEach(corner => {
            let cornerX = corner.ejeX * canvas.width
            let cornerY = corner.ejeY * canvas.height
            let dist = Math.sqrt(Math.pow(cornerX - clickX, 2) + Math.pow(cornerY - clickY, 2))
            
            if(dist < 10){
                console.log(corner.city)
            }
        })
    })
}

const printAdj = (adj) => {
    adj.forEach((connections, vertex) => {
        const connectionStrings = connections.map(connection => `(${connection.vertex}, ${connection.distance})`);
        console.log(`Vertex ${vertex}: ${connectionStrings.join(', ')}`);
    });
}

window.onload = init;


