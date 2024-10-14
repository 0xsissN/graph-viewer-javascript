class MinPriorityQueue {
    constructor() {
        this.heap = [];
    }

    enqueue(element) {
        this.heap.push(element);
        this.heap.sort((a, b) => a[0] - b[0]);  
    }

    front() {
        return this.heap[0];  
    }
}

const dijkstra = (adj, source, destination) => {
    const inf = Number.MAX_SAFE_INTEGER;
    const nodeData = {
        '0': { cost: inf, pred: [] },
        '1': { cost: inf, pred: [] },
        '2': { cost: inf, pred: [] },
        '3': { cost: inf, pred: [] },
        '4': { cost: inf, pred: [] }
    };
    
    nodeData[source].cost = 0;
    const visited = [];
    let temp = source;

    for (let i = 0; i < 3; i++) {
        if (!visited.includes(temp)) {
            visited.push(temp);
            const minHeap = new MinPriorityQueue();

            for (let neighbor in adj[temp]) {
                if (!visited.includes(neighbor)) {
                    const cost = nodeData[temp].cost + adj[temp][neighbor];
                    if (cost < nodeData[neighbor].cost) {
                        nodeData[neighbor].cost = cost;
                        nodeData[neighbor].pred = [...nodeData[temp].pred, temp];
                    }
                    minHeap.enqueue([nodeData[neighbor].cost, neighbor]);
                }
            }
            
            temp = minHeap.front()[1];  
        }
    }

    console.log("Shortest distance: " + nodeData[destination].cost);
    console.log("Shortest path: " + [...nodeData[destination].pred, destination].join(' -> '));
}