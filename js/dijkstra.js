const dijkstra = (adj, source, destination) => {
    const inf = Number.MAX_SAFE_INTEGER; // Define un valor infinito utilizando el número máximo en JavaScript.
    
    // Inicializa un objeto para almacenar el costo y los predecesores de cada nodo.
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

    nodeData[source].cost = 0; // Establece el costo del nodo de origen a 0.

    let visited = []; // Inicializa un array para rastrear los nodos visitados.
    let temp = source; // Variable temporal que guarda el nodo actual.
    let minHeap = []; // Inicializa un array para almacenar los nodos vecinos que se explorarán.

    for (let i = 0; i < 7; i++) { // Realiza un bucle para visitar un número fijo de nodos.
        if (!visited.includes(temp)) { // Verifica si el nodo actual no ha sido visitado.
            visited.push(temp); // Marca el nodo actual como visitado.
            
            for (let neighbor in adj[temp]) { // Itera sobre los vecinos del nodo actual.
                if (!visited.includes(neighbor)) { // Verifica si el vecino no ha sido visitado.
                    let cost = nodeData[temp].cost + adj[temp][neighbor]; // Calcula el costo total hasta el vecino.

                    // Si el nuevo costo es menor que el costo registrado, actualiza el costo y el predecesor.
                    if (cost < nodeData[neighbor].cost) {
                        nodeData[neighbor].cost = cost; // Actualiza el costo del vecino.
                        nodeData[neighbor].pred = [...nodeData[temp].pred, temp]; // Establece el predecesor del vecino.
                    }
                    minHeap.push(neighbor) // Agrega el vecino a la lista de nodos para explorar.
                }
            }

            minHeap.sort() // Ordena el minHeap para encontrar el siguiente nodo con el menor costo.
            temp = minHeap[0] // Selecciona el nodo con el costo más bajo como el próximo nodo a visitar.
            minHeap.shift() // Elimina el nodo con el costo más bajo del minHeap.
        }
    }

    // Crea el camino a partir de los predecesores del nodo de destino.
    let path = [...nodeData[destination].pred, destination] 
    pathAlg(path) // Llama a la función pathAlg para procesar el camino encontrado.
}
