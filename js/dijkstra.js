const dijkstra = (adj, source, destination) => {
    const inf = Number.MAX_SAFE_INTEGER;  
    const nodeData = {
        '0': { cost: inf, pred: [] },
        '1': { cost: inf, pred: [] },
        '2': { cost: inf, pred: [] },
        '3': { cost: inf, pred: [] },
        '4': { cost: inf, pred: [] },
        '5': { cost: inf, pred: [] },
        '6': { cost: inf, pred: [] },
        '7': { cost: inf, pred: [] },
        '8': { cost: inf, pred: [] }
    };

    nodeData[source].cost = 0;  

    let visited = [];
    let temp = source;
    let minHeap = [];

    const heappush = (heap, element) => {
        heap.push(element);
        heap.sort((a, b) => a[0] - b[0]);  
    };

    for (let i = 0; i < 7; i++) {
        if (!visited.includes(temp)) {
            visited.push(temp); 
            
            for (let neighbor in adj[temp]) {
                if (!visited.includes(neighbor)) {
                    const cost = nodeData[temp].cost + adj[temp][neighbor];
                    if (cost < nodeData[neighbor].cost) {
                        nodeData[neighbor].cost = cost;
                        nodeData[neighbor].pred = [...nodeData[temp].pred, temp];  
                    }
                    heappush(minHeap, [nodeData[neighbor].cost, neighbor]);  
                }
            }

            if (minHeap.length > 0) {
                temp = minHeap[0][1];  
                minHeap.shift();  
            }
        }
    }

    let path = [...nodeData[destination].pred, destination]
    pathAlg(path)
}