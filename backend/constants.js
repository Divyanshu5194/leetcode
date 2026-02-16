export const PROBLEM_TAGS = [
  "Array",
  "String",
  "Hash Table",
  "Math",
  "Dynamic Programming",
  "Sorting",
  "Greedy",
  "Depth-First Search",
  "Binary Search",
  "Database",
  "Bit Manipulation",
  "Matrix",
  "Tree",
  "Breadth-First Search",
  "Two Pointers",
  "Prefix Sum",
  "Heap (Priority Queue)",
  "Simulation",
  "Counting",
  "Graph Theory",
  "Binary Tree",
  "Stack",
  "Sliding Window",
  "Enumeration",
  "Design",
  "Backtracking",
  "Union-Find",
  "Number Theory",
  "Linked List",
  "Ordered Set",
  "Segment Tree",
  "Monotonic Stack",
  "Divide and Conquer",
  "Trie",
  "Combinatorics",
  "Bitmask",
  "Queue",
  "Recursion",
  "Geometry",
  "Binary Indexed Tree",
  "Memoization",
  "Binary Search Tree",
  "Hash Function",
  "Topological Sort",
  "Shortest Path",
  "String Matching",
  "Rolling Hash",
  "Game Theory",
  "Data Stream",
  "Interactive",
  "Monotonic Queue",
  "Brainteaser",
  "Doubly-Linked List",
  "Merge Sort",
  "Randomized",
  "Counting Sort",
  "Iterator",
  "Concurrency",
  "Quickselect",
  "Suffix Array",
  "Sweep Line",
  "Probability and Statistics",
  "Minimum Spanning Tree",
  "Bucket Sort",
  "Shell",
  "Reservoir Sampling",
  "Strongly Connected Component",
  "Eulerian Circuit",
  "Radix Sort",
  "Rejection Sampling",
  "Biconnected Component"
];

const boilerPlateCodes={
  JavaScript: (code) => 
`const fs=require('fs');
const input=fs.readFileSync(0,'utf8').trim().split(/\\s+/).map(Number);

function solve(nums){
${code}
}

console.log(solve(input));`
,
  Python: (code) => 
`import sys
data=list(map(int,sys.stdin.read().split()))

def solve(nums):
${code}

print(solve(data))`
,
  c: (code) => 
`#include <stdio.h>

int solve(int arr[], int n){
${code}
}

int main(){
    int arr[1000], n=0;
    while(scanf("%d",&arr[n])!=EOF) n++;
    printf("%d", solve(arr,n));
    return 0;
}`
}
export {boilerPlateCodes}