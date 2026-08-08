// app/resources/dsa/[company]/page.tsx
import Link from "next/link";
import { notFound } from "next/navigation";

interface Problem {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  leetcode: string;
}

const sheetsData: Record<string, { name: string; description: string; problems: Problem[] }> = {
  google: {
    name: "Google DSA Sheet (Top 50)",
    description: "Algorithmic challenges centered around deep optimization, scaling, graph complexities, and advanced data structures.",
    problems: [
      { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Array / Hashing", leetcode: "https://leetcode.com/problems/two-sum/" },
      { id: 2, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
      { id: 4, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { id: 5, title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/container-with-most-water/" },
      { id: 6, title: "3Sum", difficulty: "Medium", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/3sum/" },
      { id: 7, title: "Remove Nth Node From End of List", difficulty: "Medium", topic: "Linked List", leetcode: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
      { id: 8, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", leetcode: "https://leetcode.com/problems/valid-parentheses/" },
      { id: 9, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { id: 10, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap / Divide & Conquer", leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { id: 11, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { id: 12, title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
      { id: 13, title: "Valid Sudoku", difficulty: "Medium", topic: "Matrix / Hash", leetcode: "https://leetcode.com/problems/valid-sudoku/" },
      { id: 14, title: "Group Anagrams", difficulty: "Medium", topic: "Hash Table", leetcode: "https://leetcode.com/problems/group-anagrams/" },
      { id: 15, title: "Maximum Subarray", difficulty: "Medium", topic: "Kadane's Algorithm", leetcode: "https://leetcode.com/problems/maximum-subarray/" },
      { id: 16, title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/spiral-matrix/" },
      { id: 17, title: "Jump Game", difficulty: "Medium", topic: "Greedy", leetcode: "https://leetcode.com/problems/jump-game/" },
      { id: 18, title: "Merge Intervals", difficulty: "Medium", topic: "Sorting", leetcode: "https://leetcode.com/problems/merge-intervals/" },
      { id: 19, title: "Rotate Image", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/rotate-image/" },
      { id: 20, title: "Maximum Product Subarray", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/maximum-product-subarray/" },
      { id: 21, title: "Minimum Window Substring", difficulty: "Hard", topic: "Sliding Window", leetcode: "https://leetcode.com/problems/minimum-window-substring/" },
      { id: 22, title: "Word Search", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/word-search/" },
      { id: 23, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { id: 24, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees / BFS", leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { id: 25, title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
      { id: 26, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees / Design", leetcode: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { id: 27, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Trees / DFS", leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { id: 28, title: "Course Schedule", difficulty: "Medium", topic: "Graph / Topo Sort", leetcode: "https://leetcode.com/problems/course-schedule/" },
      { id: 29, title: "Course Schedule II", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/course-schedule-ii/" },
      { id: 30, title: "Clone Graph", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/clone-graph/" },
      { id: 31, title: "Number of Islands", difficulty: "Medium", topic: "Graph / BFS", leetcode: "https://leetcode.com/problems/number-of-islands/" },
      { id: 32, title: "Pacific Atlantic Water Flow", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
      { id: 33, title: "Longest Consecutive Sequence", difficulty: "Medium", topic: "Hash Set", leetcode: "https://leetcode.com/problems/longest-consecutive-sequence/" },
      { id: 34, title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/word-break/" },
      { id: 35, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/coin-change/" },
      { id: 36, title: "Product of Array Except Self", difficulty: "Medium", topic: "Array", leetcode: "https://leetcode.com/problems/product-of-array-except-self/" },
      { id: 37, title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap", leetcode: "https://leetcode.com/problems/find-median-from-data-stream/" },
      { id: 38, title: "Sliding Window Maximum", difficulty: "Hard", topic: "Queue / Heap", leetcode: "https://leetcode.com/problems/sliding-window-maximum/" },
      { id: 39, title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/trapping-rain-water/" },
      { id: 40, title: "LRU Cache", difficulty: "Medium", topic: "Design / DLL", leetcode: "https://leetcode.com/problems/lru-cache/" },
      { id: 41, title: "LFU Cache", difficulty: "Hard", topic: "Design", leetcode: "https://leetcode.com/problems/lfu-cache/" },
      { id: 42, title: "Design Tic-Tac-Toe", difficulty: "Medium", topic: "Design", leetcode: "https://leetcode.com/problems/design-tic-tac-toe/" },
      { id: 43, title: "Alien Dictionary", difficulty: "Hard", topic: "Graph", leetcode: "https://leetcode.com/problems/alien-dictionary/" },
      { id: 44, title: "Word Ladder", difficulty: "Hard", topic: "Graph / BFS", leetcode: "https://leetcode.com/problems/word-ladder/" },
      { id: 45, title: "Edit Distance", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/edit-distance/" },
      { id: 46, title: "Regular Expression Matching", difficulty: "Hard", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/regular-expression-matching/" },
      { id: 47, title: "Wildcard Matching", difficulty: "Hard", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/wildcard-matching/" },
      { id: 48, title: "Burst Balloons", difficulty: "Hard", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/burst-balloons/" },
      { id: 49, title: "Text Justification", difficulty: "Hard", topic: "String Simulation", leetcode: "https://leetcode.com/problems/text-justification/" },
      { id: 50, title: "IPO", difficulty: "Hard", topic: "Greedy / Heap", leetcode: "https://leetcode.com/problems/ipo/" },
    ],
  },
  microsoft: {
    name: "Microsoft DSA Sheet (Top 50)",
    description: "Core computer science fundamentals, strings, matrix manipulations, array patterns, and system scaling trees.",
    problems: [
      { id: 1, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", leetcode: "https://leetcode.com/problems/valid-parentheses/" },
      { id: 2, title: "Reverse Linked List", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/reverse-linked-list/" },
      { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { id: 4, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { id: 5, title: "Valid Anagram", difficulty: "Easy", topic: "String / Hash", leetcode: "https://leetcode.com/problems/valid-anagram/" },
      { id: 6, title: "Linked List Cycle", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/linked-list-cycle/" },
      { id: 7, title: "Palindrome Linked List", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/palindrome-linked-list/" },
      { id: 8, title: "Maximum Depth of Binary Tree", difficulty: "Easy", topic: "Trees", leetcode: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
      { id: 9, title: "Invert Binary Tree", difficulty: "Easy", topic: "Trees", leetcode: "https://leetcode.com/problems/invert-binary-tree/" },
      { id: 10, title: "Diameter of Binary Tree", difficulty: "Easy", topic: "Trees", leetcode: "https://leetcode.com/problems/diameter-of-binary-tree/" },
      { id: 11, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { id: 12, title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/spiral-matrix/" },
      { id: 13, title: "Rotate Image", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/rotate-image/" },
      { id: 14, title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/set-matrix-zeroes/" },
      { id: 15, title: "Group Anagrams", difficulty: "Medium", topic: "Hash Table", leetcode: "https://leetcode.com/problems/group-anagrams/" },
      { id: 16, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { id: 17, title: "String to Integer (atoi)", difficulty: "Medium", topic: "String Parsing", leetcode: "https://leetcode.com/problems/string-to-integer-atoi/" },
      { id: 18, title: "Reverse Words in a String", difficulty: "Medium", topic: "String", leetcode: "https://leetcode.com/problems/reverse-words-in-a-string/" },
      { id: 19, title: "Integer to Roman", difficulty: "Medium", topic: "Math / String", leetcode: "https://leetcode.com/problems/integer-to-roman/" },
      { id: 20, title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", leetcode: "https://leetcode.com/problems/add-two-numbers/" },
      { id: 21, title: "Copy List with Random Pointer", difficulty: "Medium", topic: "Linked List", leetcode: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
      { id: 22, title: "Sort List", difficulty: "Medium", topic: "Linked List / Sorting", leetcode: "https://leetcode.com/problems/sort-list/" },
      { id: 23, title: "Reorder List", difficulty: "Medium", topic: "Linked List", leetcode: "https://leetcode.com/problems/reorder-list/" },
      { id: 24, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { id: 25, title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
      { id: 26, title: "Populating Next Right Pointers in Each Node", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/populating-next-right-pointers-in-each-node/" },
      { id: 27, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { id: 28, title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { id: 29, title: "Kth Smallest Element in a BST", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
      { id: 30, title: "Number of Islands", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/number-of-islands/" },
      { id: 31, title: "Course Schedule", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/course-schedule/" },
      { id: 32, title: "Word Search", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/word-search/" },
      { id: 33, title: "Permutations", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/permutations/" },
      { id: 34, title: "Subsets", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/subsets/" },
      { id: 35, title: "Combination Sum", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/combination-sum/" },
      { id: 36, title: "Jump Game II", difficulty: "Medium", topic: "Greedy", leetcode: "https://leetcode.com/problems/jump-game-ii/" },
      { id: 37, title: "Gas Station", difficulty: "Medium", topic: "Greedy", leetcode: "https://leetcode.com/problems/gas-station/" },
      { id: 38, title: "Maximum Subarray", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/maximum-subarray/" },
      { id: 39, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/coin-change/" },
      { id: 40, title: "House Robber", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/house-robber/" },
      { id: 41, title: "LRU Cache", difficulty: "Medium", topic: "Design", leetcode: "https://leetcode.com/problems/lru-cache/" },
      { id: 42, title: "Min Stack", difficulty: "Medium", topic: "Design", leetcode: "https://leetcode.com/problems/min-stack/" },
      { id: 43, title: "Implement Trie (Prefix Tree)", difficulty: "Medium", topic: "Design / Trie", leetcode: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
      { id: 44, title: "Find Peak Element", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/find-peak-element/" },
      { id: 45, title: "Median of Two Sorted Arrays", difficulty: "Hard", topic: "Binary Search", leetcode: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
      { id: 46, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap / Divide & Conquer", leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { id: 47, title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/trapping-rain-water/" },
      { id: 48, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees / Design", leetcode: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { id: 49, title: "Word Ladder", difficulty: "Hard", topic: "Graph", leetcode: "https://leetcode.com/problems/word-ladder/" },
      { id: 50, title: "Largest Rectangle in Histogram", difficulty: "Hard", topic: "Stack", leetcode: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    ],
  },
  amazon: {
    name: "Amazon DSA Sheet (Top 50)",
    description: "High-frequency operational SDE problems emphasizing trees, matrix handling, arrays, dynamic programming, and greedy optimization.",
    problems: [
      { id: 1, title: "Two Sum", difficulty: "Easy", topic: "Array", leetcode: "https://leetcode.com/problems/two-sum/" },
      { id: 2, title: "Valid Parentheses", difficulty: "Easy", topic: "Stack", leetcode: "https://leetcode.com/problems/valid-parentheses/" },
      { id: 3, title: "Merge Two Sorted Lists", difficulty: "Easy", topic: "Linked List", leetcode: "https://leetcode.com/problems/merge-two-sorted-lists/" },
      { id: 4, title: "Best Time to Buy and Sell Stock", difficulty: "Easy", topic: "Array", leetcode: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
      { id: 5, title: "Maximum Subarray", difficulty: "Medium", topic: "Array", leetcode: "https://leetcode.com/problems/maximum-subarray/" },
      { id: 6, title: "Group Anagrams", difficulty: "Medium", topic: "Hash Table", leetcode: "https://leetcode.com/problems/group-anagrams/" },
      { id: 7, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", topic: "Sliding Window", leetcode: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { id: 8, title: "3Sum", difficulty: "Medium", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/3sum/" },
      { id: 9, title: "Container With Most Water", difficulty: "Medium", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/container-with-most-water/" },
      { id: 10, title: "Integer to Roman", difficulty: "Medium", topic: "String", leetcode: "https://leetcode.com/problems/integer-to-roman/" },
      { id: 11, title: "Roman to Integer", difficulty: "Easy", topic: "String", leetcode: "https://leetcode.com/problems/roman-to-integer/" },
      { id: 12, title: "Add Two Numbers", difficulty: "Medium", topic: "Linked List", leetcode: "https://leetcode.com/problems/add-two-numbers/" },
      { id: 13, title: "Merge k Sorted Lists", difficulty: "Hard", topic: "Heap", leetcode: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { id: 14, title: "Search in Rotated Sorted Array", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { id: 15, title: "FindFirst and Last Position of Element in Sorted Array", difficulty: "Medium", topic: "Binary Search", leetcode: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" },
      { id: 16, title: "Rotate Image", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/rotate-image/" },
      { id: 17, title: "Spiral Matrix", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/spiral-matrix/" },
      { id: 18, title: "Set Matrix Zeroes", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/set-matrix-zeroes/" },
      { id: 19, title: "Word Search", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/word-search/" },
      { id: 20, title: "Valid Sudoku", difficulty: "Medium", topic: "Matrix", leetcode: "https://leetcode.com/problems/valid-sudoku/" },
      { id: 21, title: "Course Schedule", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/course-schedule/" },
      { id: 22, title: "Course Schedule II", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/course-schedule-ii/" },
      { id: 23, title: "Clone Graph", difficulty: "Medium", topic: "Graph", leetcode: "https://leetcode.com/problems/clone-graph/" },
      { id: 24, title: "Number of Islands", difficulty: "Medium", topic: "Graph / BFS", leetcode: "https://leetcode.com/problems/number-of-islands/" },
      { id: 25, title: "Rotting Oranges", difficulty: "Medium", topic: "Graph / BFS", leetcode: "https://leetcode.com/problems/rotting-oranges/" },
      { id: 26, title: "Validate Binary Search Tree", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/validate-binary-search-tree/" },
      { id: 27, title: "Binary Tree Level Order Traversal", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { id: 28, title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium", topic: "Trees", leetcode: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" },
      { id: 29, title: "Binary Tree Maximum Path Sum", difficulty: "Hard", topic: "Trees", leetcode: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { id: 30, title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", topic: "Trees / Design", leetcode: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
      { id: 31, title: "Word Break", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/word-break/" },
      { id: 32, title: "Coin Change", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/coin-change/" },
      { id: 33, title: "Longest Palindromic Substring", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/longest-palindromic-substring/" },
      { id: 34, title: "Maximum Product Subarray", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/maximum-product-subarray/" },
      { id: 35, title: "Edit Distance", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/edit-distance/" },
      { id: 36, title: "LRU Cache", difficulty: "Medium", topic: "Design", leetcode: "https://leetcode.com/problems/lru-cache/" },
      { id: 37, title: "LFU Cache", difficulty: "Hard", topic: "Design", leetcode: "https://leetcode.com/problems/lfu-cache/" },
      { id: 38, title: "Design Tic-Tac-Toe", difficulty: "Medium", topic: "Design", leetcode: "https://leetcode.com/problems/design-tic-tac-toe/" },
      { id: 39, title: "Top K Frequent Elements", difficulty: "Medium", topic: "Heap / Hash", leetcode: "https://leetcode.com/problems/top-k-frequent-elements/" },
      { id: 40, title: "Kth Largest Element in an Array", difficulty: "Medium", topic: "Heap", leetcode: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { id: 41, title: "Find Median from Data Stream", difficulty: "Hard", topic: "Heap", leetcode: "https://leetcode.com/problems/find-median-from-data-stream/" },
      { id: 42, title: "Sliding Window Maximum", difficulty: "Hard", topic: "Queue / Heap", leetcode: "https://leetcode.com/problems/sliding-window-maximum/" },
      { id: 43, title: "Trapping Rain Water", difficulty: "Hard", topic: "Two Pointers", leetcode: "https://leetcode.com/problems/trapping-rain-water/" },
      { id: 44, title: "Subsets", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/subsets/" },
      { id: 45, title: "Permutations", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/permutations/" },
      { id: 46, title: "Letter Combinations of a Phone Number", difficulty: "Medium", topic: "Backtracking", leetcode: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
      { id: 47, title: "Partition Equal Subset Sum", difficulty: "Medium", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { id: 48, title: "Maximum Profit in Job Scheduling", difficulty: "Hard", topic: "DP / Binary Search", leetcode: "https://leetcode.com/problems/maximum-profit-in-job-scheduling/" },
      { id: 49, title: "Minimum Difficulty of a Job Schedule", difficulty: "Hard", topic: "Dynamic Programming", leetcode: "https://leetcode.com/problems/minimum-difficulty-of-a-job-schedule/" },
      { id: 50, title: "Critical Connections in a Network", difficulty: "Hard", topic: "Graph / Tarjan's Algo", leetcode: "https://leetcode.com/problems/critical-connections-in-a-network/" },
    ],
  },
};

interface PageProps {
  params: Promise<{ company: string }>;
}

export default async function CompanyDSASheetPage({ params }: PageProps) {
  const resolvedParams = await params;
  const companyKey = resolvedParams.company.toLowerCase();
  const sheet = sheetsData[companyKey];

  if (!sheet) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black px-6 py-20 text-slate-100">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/#resources" className="text-sm font-medium text-cyan-400 transition hover:underline">
            ← Back to Home / Resources
          </Link>
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
            Verified Top 50 Sheet
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-bold text-white md:text-4xl">{sheet.name}</h1>
          <p className="mt-3 text-slate-400">{sheet.description}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(sheet, null, 2))}`}
              download={`${companyKey}-top-50-dsa-sheet.json`}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              Download Full Top 50 Sheet (.json)
            </a>
          </div>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-xs uppercase tracking-wider text-slate-400">
                <th className="p-4">#</th>
                <th className="p-4">Problem Title</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Topic Pattern</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {sheet.problems.map((item, idx) => (
                <tr key={item.id} className="transition hover:bg-white/[0.04]">
                  <td className="p-4 text-slate-500">{idx + 1}</td>
                  <td className="p-4 font-medium text-white">{item.title}</td>
                  <td className="p-4">
                    <span
                      className={`inline-block rounded-md px-2 py-0.5 text-xs font-medium ${
                        item.difficulty === "Easy"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : item.difficulty === "Medium"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {item.difficulty}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{item.topic}</td>
                  <td className="p-4 text-right">
                    <a
                      href={item.leetcode}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 transition hover:underline"
                    >
                      Solve →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-slate-400">
          Want sheets for other companies? Rest all company sheets (NVIDIA, Apple, Meta, Atlassian, etc.) will be added in future updates.
        </div>
      </div>
    </main>
  );
}