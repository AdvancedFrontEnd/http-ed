// 接口增删改查的文件
const router = require('koa-router')()
const MockCtl = require('../controller/mock')
router.prefix('/mock')

// GET请求路由
router.get('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;

  // 获取所有查询参数的键
  const queryParams = JSON.stringify(ctx.query);

  // 根据项目、接口和查询参数返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, queryParams);

  if (mockData&&mockCode) {
    ctx.body = mockData;
    ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});

// POST请求路由
router.post('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const requestBody = ctx.request.body;

  // 根据项目和接口以及请求体返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, requestBody);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});

// PUT请求路由
router.put('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const requestBody = ctx.request.body;

  // 根据项目和接口以及请求体返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, requestBody);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});

// DELETE请求路由
router.delete('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const requestBody = ctx.request.body;

  // 根据项目和接口以及请求体返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, requestBody);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});
// HEAD请求路由
router.head('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const queryParams = JSON.stringify(ctx.query);

  // 根据项目、接口和查询参数返回对应的mock数据
  const {mockData,mockCode } = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, queryParams);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});
// OPTIONS请求路由
router.options('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const requestBody = ctx.request.body;

  // 根据项目和接口以及请求体返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, requestBody);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});
// PATCH请求路由
router.patch('/mock/:project/:api', (ctx) => {
  const project = ctx.params.project;
  const api = ctx.params.api;
  const requestBody = ctx.request.body;

  // 根据项目和接口以及请求体返回对应的mock数据
  const {mockData, mockCode} = MockCtl.getMockData(project, api, ctx.method,  ctx.request.headers, requestBody);

  if (mockData&&mockCode) {
   ctx.body = mockData;  
   ctx.status = mockCode;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'Mock data not found' };
  }
});

module.exports = router