export function getInsertionSortComparisons(array) {
    const comparisons = []
    if (array.length <= 1) return array;
    insertionSort(array, comparisons)
    return comparisons
}




function insertionSort(arr, n) {
    let i, key, j;
    for (i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;

        /* Move elements of arr[0..i-1], that are  
        greater than key, to one position ahead  
        of their current position */
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

// A utility function to print an array of size n  
function printArray(arr, n) {
    let i;
    for (i = 0; i < n; i++)
        document.write(arr[i] + " ");
    document.write("<br>");
}

