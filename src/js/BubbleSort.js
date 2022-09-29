export function getBubbleSortComparisons(array) {
    const comparisons = []
    if (array.length <= 1) return array;
    bubbleSort(array, comparisons)
    return comparisons
}

function bubbleSort(array, comparisons) {
    var i, j;
    var len = array.length;
    var isSwapped = false;

    for (i = 0; i < len; i++) {
        isSwapped = false;

        for (j = 0; j < len; j++) {
            if (array[j] > array[j + 1]) {

                comparisons.push([j, j + 1])
                comparisons.push([j, j + 1])
                comparisons.push([j, j + 1])

                var temp = array[j]
                array[j] = array[j + 1];
                array[j + 1] = temp;
                isSwapped = true;
            }
        }

        // If no two elements were swapped by inner loop, then break
        if (!isSwapped) {
            break;
        }
    }
};

