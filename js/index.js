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

const dijkstra = (n, adj, src) => {
    // Array to store minimum distances
    let dis = new Array(n + 1).fill(Number.MAX_SAFE_INTEGER);

    // Array to mark visited vertices
    let vis = new Array(n + 1).fill(false);

    // Set the distance to the source as 0
    dis[src] = 0;

    for (let i = 0; i < n; i++) {
        let v = -1;
        for (let j = 1; j <= n; j++) {
            if (!vis[j] && (v == -1 || dis[j] < dis[v]))
                v = j;
        }

        if (dis[v] == Number.MAX_SAFE_INTEGER)
            break;
        // Mark vertex v as visited
        vis[v] = true;

        for (let edge of adj[v]) {
            // Neighbor vertex
            let x = edge.vertex;
            // Edge weight
            let wt = edge.weight;

            // Update the distance if a shorter path is found
            if (dis[v] + wt < dis[x]) {
                dis[x] = dis[v] + wt;
            }
        }
    }
    // Return the array of minimum distances
    return dis.slice(1); // Remove the first element (index 0)
}

window.onload = init;


