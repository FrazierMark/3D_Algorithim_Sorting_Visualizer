export function getInsertionSortComparisons(array) {
    const comparisons = []
    if (array.length <= 1) return array;
    insertionSort(array, comparisons)
    return comparisons
}


function insertionSort(array, comparisons) {
    let n = array.length
    let i, key, j;
    for (i = 1; i < n; i++) {
        key = array[i];
        j = i - 1;

        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        while (j >= 0 && array[j] > key) {

            comparisons.push([j + 1, j])
            comparisons.push([j + 1, j])
            comparisons.push([j + 1, j])

            array[j + 1] = array[j];
            j = j - 1;
        }
        array[j + 1] = key;
    }
}

