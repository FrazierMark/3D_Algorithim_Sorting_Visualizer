export function getHeapSortComparisons(array) {
   const comparisons = [];
   if (array.length <= 1) return array;
   heapSort(array, comparisons)
   return comparisons
}


var array_length;
/* to create MAX  array */
function heap_root(array, i, comparisons) {
   var left = 2 * i + 1;
   var right = 2 * i + 2;
   var max = i;

   if (left < array_length && array[left] > array[max]) {
      max = left;
   }

   if (right < array_length && array[right] > array[max]) {
      max = right;
   }

   if (max != i) {

      comparisons.push([i, max])
      comparisons.push([i, max])
      comparisons.push([i, max])

      swap(array, i, max);
      heap_root(array, max, comparisons);
   }
}

function swap(array, index_A, index_B) {
   var temp = array[index_A];
   array[index_A] = array[index_B];
   array[index_B] = temp;
}

function heapSort(array, comparisons) {
   array_length = array.length;

   for (var i = Math.floor(array_length / 2); i >= 0; i -= 1) {
      heap_root(array, i, comparisons);
   }

   for (i = array.length - 1; i > 0; i--) {

      comparisons.push([0, i])
      comparisons.push([0, i])
      comparisons.push([0, i])

      swap(array, 0, i);
      array_length--;
      
      heap_root(array, 0, comparisons);
   }
}


