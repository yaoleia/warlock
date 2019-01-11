/**
 * 生产环境配置
 *
 * 最终生效的配置为 prod + default（前者覆盖后者）
 */

const env = process.env;
module.exports = app => {
  const exports = {};
  exports.serverUrl = env.SERVER_URL || 'http://0.0.0.0:5000';
  return exports;
};
