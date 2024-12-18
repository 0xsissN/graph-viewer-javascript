/**
 * Dijkstra's algorithm
 * Returns the shortest path as an array
 */

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

    for (let i = 0; i < 7; i++) { 
        if (!visited.includes(temp)) { 
            visited.push(temp); 
            
            for (let neighbor in adj[temp]) { 
                if (!visited.includes(neighbor)) {
                    let cost = nodeData[temp].cost + adj[temp][neighbor]; 

                    if (cost < nodeData[neighbor].cost) {
                        nodeData[neighbor].cost = cost; 
                        nodeData[neighbor].pred = [...nodeData[temp].pred, temp];
                    }
                    minHeap.push(neighbor)
                }
            }

            minHeap.sort()
            temp = minHeap[0] 
            minHeap.shift() 
        }
    }

    let path = [...nodeData[destination].pred, destination] 
    pathAlg(path) 
}
