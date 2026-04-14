import * as dfd from "danfojs";
import { Dataframe, KeyIndex } from "../dataframe";
/**
 * 判断数组是否应转换为 Dataframe
 * @param {Array} arr - 待检查的数组
 * @returns {boolean}
 */
function shouldConvertToDataframe(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return false;

  // 检查第一项的类型（必须是普通对象）
  const firstItem = arr[0];
  if (
    typeof firstItem !== "object" ||
    firstItem === null ||
    Array.isArray(firstItem)
  ) {
    return false;
  }

  // 记录第一项的属性名集合
  const expectedKeys = new Set(Object.keys(firstItem));

  // 检查后续所有项的键是否完全一致
  for (let i = 1; i < arr.length; i += 1) {
    const currentKeys = new Set(Object.keys(arr[i]));
    if (
      currentKeys.size !== expectedKeys.size ||
      ![...expectedKeys].every((k) => currentKeys.has(k))
    ) {
      return false;
    }
  }

  return true;
}

/**
 * 转化Array对象为Dataframe对象
 * @param {Array} dataArray - 等待转化的Array对象
 * @returns {*} 转换后Dataframe
 */

function convertToDataframeFormat(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return null;

  const colIndex = Object.keys(dataArray[0]); // 列索引

  // 构建列式数据
  const columnarData = [];
  colIndex.forEach((col) => {
    columnarData.push(dataArray.map((row) => row[col]));
  });

  // 设置维度 [行数, 列数]
  const dims = [dataArray.length, colIndex.length];
  const rowIndex = Array.from({ length: dims[0] }, (_, i) => i); // 行索引

  const df = new Dataframe(
    dims,
    columnarData,
    new KeyIndex(rowIndex),
    new KeyIndex(colIndex)
  );
  return df;
}

/**
 * 智能转换对象为 Dataframe（如果符合条件）
 * @param {*} obj - 输入数据
 * @param {Function} Dataframe - 你的 Dataframe 构造函数
 * @returns {*} 转换后的数据
 */
export function smartConvertToDataframe(obj, dfFormat = "Dataframe") {
  // 如果是数组且符合条件，转换为 Dataframe
  if (shouldConvertToDataframe(obj)) {
    // return "Dataframe";
    if (dfFormat === "Dataframe") {
      return convertToDataframeFormat(obj);
    } 
      // danfo框架的DataFrame，JSON格式直接创建
      return new dfd.DataFrame(obj);
    
  }

  // 处理嵌套对象
  if (typeof obj === "object" && obj !== null) {
    if (Array.isArray(obj)) {
      // 数组但不符合条件 → 递归处理每一项
      return obj.map((item) => smartConvertToDataframe(item, dfFormat));
    } 
      // 普通对象 → 递归处理每个属性
      const result = {};
      Object.entries(obj).forEach(([key, value]) => {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          result[key] = smartConvertToDataframe(value, dfFormat);
        }
      });

      return result;
    
  }

  // 基本类型直接返回
  return obj;
}
