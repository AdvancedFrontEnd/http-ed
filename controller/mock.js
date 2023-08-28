const { Hope } = require("../models/hope");
const { Interface } = require("../models/interface");
const { Projects } = require("../models/projects");
const response = require("../utils/response");
const crud = require("./CRUDUtil/index");
const yaml = require('js-yaml');
const xml2js = require('xml2js');
const XLSX = require('xlsx');
const _ = require('lodash')
const Mock = require('mockjs');

function checkDataType(data) {
  try {
    const jsonRes = JSON.parse(data);
    return ["json", jsonRes];
  } catch (error) {
    try {
      xml2js.parseString(data, (err, result) => {
        if (err) {
          throw new Error();
        }else  {
          return ["xml", result];
        }
      });
    } catch (error) {
      try {
        const yamlRes  = yaml.safeLoad(data);
        return ["yaml", yamlRes];
      } catch (error) {
        const workbook = XLSX.readFile('data.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        return ["file", jsonData];
      }
    }
  }
}

function convertDataToFormat(format, jsonData) {
  let convertedData;
  try {
    if (format === 'json') {
      convertedData = JSON.stringify(jsonData);
    } else if (format === 'xml') {
      const builder = new xml2js.Builder({ rootName: 'data' });
      convertedData = builder.buildObject(jsonData);
    } else if (format === 'yaml') {
      convertedData = yaml.safeDump(jsonData);
    } else {
      throw new Error('不支持返回这个格式');
    }
    return convertedData;
  } catch (error) {
    console.error('Error converting data:', error.message);
  }
}

// 生成随机的 HTTP 响应码
const randomResponseCode = () => {
  const codes = [200, 201, 300, 301, 302, 304, 400, 404, 500, 501, 502];
  const randomIndex = Math.floor(Math.random() * codes.length);
  return codes[randomIndex];
};



const getMockData = async(project, api, method, header, params) => {
  const {projectId, requestMethod} =  await crud.findOne(Interface, {name: api})
  console.log(`这个接口的名字对应的id为${projectId}, 请求方法为${requestMethod}`)
  const {projectId : expectId} =  await crud.findOne(Projects, {projectName: project})
  console.log(`这个项目的名字对应的id为${expectId}`)
  if(projectId === expectId && method === requestMethod){
    const result = checkDataType(params)
    const type = result[0]
    const requestData = result[1]
    const {data, responseType, responseCode, isDynamicCode, isDynamicData} = await crud.findOne(Hope, {
      requestType: type,
      $where: function() {
        return _.isEqual(JSON.parse(this.requestParams), requestData)&& _.isEqual(JSON.parse(this.requestHeader), header);
      }
    })
    if(data){
      const responseRes = response(JSON.parse(data))
      let mockData = convertDataToFormat(responseType, responseRes)
      let mockCode = responseCode
      while(isDynamicCode){
        mockCode = randomResponseCode()
        isDynamicCode = false
      }
      while(isDynamicData){
        mockData =  Mock.mock({
          number: '@integer(1, 100)',
          boolean: '@boolean',
          string: () => '★'.repeat(3)
        })
        isDynamicData = false
      }
      return {
        mockData,
        mockCode
      }
    }else{
      console.log('期望中没有对应的请求头和参数与本次请求匹配')
    }   
  } else {
    return null
  } 
}

module.exports = {
  getMockData
};