const Mock = require("mockjs");
module.exports = function parseInterface(resInfo) {
  // 先解析期望，期望找不到就解析响应体
  // 这里只解析响应码为200的
  // 非200状态暂不处理，并且只考虑到了json类型，xml类型有待研究
  for (let i = 0; i < resInfo.length; i++) {
    if(resInfo[i].code === 200){
      const body = parseBody(resInfo[i].body);
      return body
    }
  }
  return {}
};

// 解析body,生成mock数据
const parseBody = (body) => {
  let tempEnd = body.length;
  const findEnd = (start, indent, body) => {
    let i = start
    for (; i < body.length; i++) {
      if (body[i].indent <= indent) {
        return i;
      }
    }
    return i;
  };
  const parse = (body, start, end, result) => {
    if (start >= body.length || end >= tempEnd) {
      return result;
    }
    const data = body[start];
    if (data.type !== "object" && data.type !== "array") {
      // 检查是否有占位符, 没有占位符就按原样输出
      if(data.mock[0] === '@'){
        result[data.element] = data.mock;
      } else {
        switch(data.type){
          case 'number':
            result[data.element] = Number(data.mock);
            break
          case 'boolean':
            result[data.element] = data.mock === 'false' ? false : true
            break
        }
      }
      return parse(body, start + 1, end + 1, result);
    }

    if (data.type === "array") {
      // 如果下一个节点不是数组或者对象直接把下一个节点的mock赋值给当前
      if (
        body[start + 1].type !== "object" &&
        body[start + 1].type !== "array"
      ) {
        result[`${data.element}|${data.mock}`] = [body[start + 1].mock];
        return parse(body, start + 2, end + 2, result);
      } else {
        // 获取下一个子节点的值
        const child = parse(body, start + 1, end + 1, {});
        const len = Object.keys(child).length;
        result[`${data.element}|${data.mock}`] = [child];
        return parse(body, start + 2 + len, end + 2 + len, result);
      }
    }

    tempEnd = findEnd(start + 1, body[start].indent, body);
    const child = parse(body, start + 1, end + 1, {});
    const len = Object.keys(child).length;
    if (data.element) {
      result[data.element] = child;
    } else {
      return child;
    }
    // 回到原来的位置
    tempEnd = body.length;
    return parse(body, start + len + 1, end + len + 1, result);
  };
  const result = parse(body, 0, 0, {});
  return Mock.mock(result);
};

const generateCode = () => {};
