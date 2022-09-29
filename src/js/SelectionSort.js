export function getSelectionSortComparisons(array) {
    const comparisons = []
    if (array.length <= 1) return array;
    selectionSort(array, comparisons)
    return comparisons

}

function selectionSort(array, comparisons) {
    for (let i = 0; i < array.length; i++) {
        let min = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[min]) {
                min = j;
            }
        }
        if (i !== min) {

            comparisons.push([i, min])
            comparisons.push([i, min])
            comparisons.push([i, min])

            swap(array, i, min)
        }
    }
}

function swap(array, index_A, index_B) {
    var temp = array[index_A];
    array[index_A] = array[index_B];
    array[index_B] = temp;
}
