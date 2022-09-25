// var array = [5,3,7,6,2,9];
export function getQuickSortComparisons(array, left, right) {
    const comparisons = [];
    if (array.length <= 1) return array;

    //const auxiliaryArray = array.slice();

    quickSort(array, 0, array.length - 1, comparisons);
    return comparisons;

}


function swap(array, leftIndex, rightIndex) {
    var temp = array[leftIndex];
    array[leftIndex] = array[rightIndex];
    array[rightIndex] = temp;
}


function partition(array, left, right, comparisons) {
    var pivot = array[Math.floor((right + left) / 2)], //middle element
        i = left, //left pointer
        j = right; //right pointer
    while (i <= j) {
        while (array[i] < pivot) {
            i++;
        }
        while (array[j] > pivot) {
            j--;
        }
        if (i <= j) {
            comparisons.push([i, j])
            comparisons.push([i, j])
            comparisons.push([i, j])
            swap(array, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}


function quickSort(array, left, right, comparisons) {
    var index;
    if (array.length > 1) {
        index = partition(array, left, right, comparisons); //index returned from partition
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(array, left, index - 1, comparisons);
        }
        if (index < right) { //more elements on the right side of the pivot
            quickSort(array, index, right, comparisons);
        }
    }
    //return array;
}