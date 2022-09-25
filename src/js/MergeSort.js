export function getMergeSortComparisons(array) {
  const comparisons = [];
  if (array.length <= 1) return array;
  const auxiliaryArray = array.slice();
  mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, comparisons);
  return comparisons;
}

function mergeSortHelper(
  mainArray,
  startIdx,
  endIdx,
  auxiliaryArray,
  comparisons,
) {
  if (startIdx === endIdx) return;
  const middleIdx = Math.floor((startIdx + endIdx) / 2);
  mergeSortHelper(auxiliaryArray, startIdx, middleIdx, mainArray, comparisons);
  mergeSortHelper(auxiliaryArray, middleIdx + 1, endIdx, mainArray, comparisons);
  doMerge(mainArray, startIdx, middleIdx, endIdx, auxiliaryArray, comparisons);
}

function doMerge(
  mainArray,
  startIdx,
  middleIdx,
  endIdx,
  auxiliaryArray,
  comparisons,
) {
  let k = startIdx;
  let i = startIdx;
  let j = middleIdx + 1;
  while (i <= middleIdx && j <= endIdx) {
    comparisons.push([i, j]);
    comparisons.push([i, j]);
    if (auxiliaryArray[i] <= auxiliaryArray[j]) {
      comparisons.push([k, auxiliaryArray[i]]);
      mainArray[k++] = auxiliaryArray[i++];
    } else {
      comparisons.push([k, auxiliaryArray[j]]);
      mainArray[k++] = auxiliaryArray[j++];
    }
  }

  while (i <= middleIdx) {
    comparisons.push([i, i]);
    comparisons.push([i, i]);
    comparisons.push([k, auxiliaryArray[i]]);
    mainArray[k++] = auxiliaryArray[i++];
  }
  while (j <= endIdx) {
    comparisons.push([j, j]);
    comparisons.push([j, j]);
    comparisons.push([k, auxiliaryArray[j]]);
    mainArray[k++] = auxiliaryArray[j++];
  }
}
