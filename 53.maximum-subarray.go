/*
 * @lc app=leetcode id=53 lang=golang
 *
 * [53] Maximum Subarray
 */
func maxSubArray(nums []int) int {
    if len(nums) == 1 {
		return nums[0]
	}
	var lastArray = nums[:len(nums)-1]
	var lastMax = maxSubArray(lastArray)

	var curVal = nums[len(nums)-1]
	var curMax = curVal
	for i := len(lastArray) - 1; i >= 0; i-- {
		curMax = curMax + lastArray[i]
		if curMax > curVal {
			curVal = curMax
		}
	}
	if curVal > lastMax {
		return curVal
	}
	return lastMax
}

