
LeetCode初级算法题--最大子序和

### [最大子序和](https://leetcode.com/problems/maximum-subarray/description/)

#### 问题描述

> 给定一个整数数组 nums ，找到一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。

#### 示例:
```
输入: [-2,1,-3,4,-1,2,1,-5,4],
输出: 6
解释: 连续子数组 [4,-1,2,1] 的和最大，为 6。
```

#### 分析
- 最简单的情况数组长度为1
```
输入: [-2]
输出: -2
```
- 数组长度为2时
```
输入: [-2, 1]
```
连续子数组有[-2],[-2, 1],[1],对比长度为1时，增加了两个连续子数组[-2, 1],[1]，这是和最大的子数组为[1]，其和为1

- 数组长度为3时
```
输入: [-2, 1, -3]
```
连续子数组有[-2],[-2, 1],[1]，[-2, 1, -3], [1,-3],[-3], 新增子数组为[-2, 1, -3], [1,-3],[-3]，可见增加第i个输入数组时，新增的连续子数组为i个，新增的连续子数组为第i个数往前的包括i的所有连续数组，比如新增第4个值时如图：

![](https://s2.ax1x.com/2019/06/22/ZpAuHP.jpg)

最大的子数组和在原来的最大值和新增的子数组中产生

#### 伪代码
```
输入[1, 2, 3, ..., n]
使用递归的方式将数组的前1到n-1个进行递归
拿到n-1数组的最大子序和(lastMax)
计算n对比n-1新增的子数组中的最大值(curMax)
返回lastMax与curMax中的最大值
```

#### 实现

```golang
func maxSubArray(nums []int) int {
    // 长度为1时直接返回
    if len(nums) == 1 {
		return nums[0]
    }
    // 获取第1个到第n-1个数组值
	var lastArray = nums[:len(nums)-1]
    // 递归计算第1个到第n-1个的最大值
	var lastMax = maxSubArray(lastArray)

    // 获取数组的最后一个值
    var curVal = nums[len(nums)-1]
    // 设置默认的新增子数组的最大值
    var curMax = curVal
    // 计算新增子数组的最大值
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
```

#### 执行结果
![](https://s2.ax1x.com/2019/06/22/ZpAogH.png)

只是完成了功能的实现，对算法的性能、内存占用等没有考虑