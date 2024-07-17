
package com.leetcode;

import java.util.*;

public class Solution {
	public int maximumLength(int[] nums) {
		int ret = 1;

		HashSet<Integer> covered = new HashSet<>(); // create a hash set of strings
		HashMap<Integer, Integer> map = new HashMap<>();
		for (int i = 0; i < nums.length; i++) {
			map.merge(nums[i], 1, Integer::sum);
		}
		for (int Key : map.keySet()) {
			int cand_max = 0;
			int key_cover = Key, key_old = Key;
			if (key_cover == 1) {
				//
				if (map.get(key_cover) % 2 == 0) {
					cand_max = (map.get(key_cover) - 1);
				} else {
					cand_max = (map.get(key_cover));
				}
			} else if (covered.contains(Key)) {
				continue;
			} else {
				// System.out.println("Current Key: x=" + Key);
				int orig_val = map.get(Key);
				while (map.containsKey(key_cover) && map.get(key_cover) > 1) {
					cand_max += 2;
					covered.add(key_cover);
					// System.out.println(key_cover + " " + key_cover);
					// the value at key_cover is 2 or abolve meaning we can decrement it for our set
					key_old = key_cover;
					key_cover = key_cover * key_cover;
				}
				if (map.containsKey(key_cover))
					cand_max = (cand_max + 1);
				else {
					cand_max = (cand_max - 1);
				}
			}
			// if(ret = -1) ret = cand_max;
			// else
			ret = Math.max(ret, cand_max);
		}
		return ret;
	}

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int[] intArray = { 5, 4,4, 2, 2 };
		Solution sol = new Solution();
		int a = sol.maximumLength(intArray);
		System.out.println(a);
	}

}
