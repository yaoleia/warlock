const _ = require('lodash');
export default {
  ifOk(type) {
    if (type) {
      return 'NG';
    }
    if (type === 0) {
      return 'OK';
    }
    return '';
  },
  defectType(type) {
    if (type === 0) {
      return '无缺陷';
    }
    if (type === 1) {
      return '多螺丝';
    }
    if (type === 2) {
      return '少螺丝';
    }
    return '';
  },
  difference(object, base) {
    function changes(object, base) {
      return _.transform(object, (result, value, key) => {
        if (!_.isEqual(value, base[key])) {
          result[key] = (_.isObject(value) && _.isObject(base[key])) ? changes(value, base[key]) : value;
        }
      });
    }
    return changes(object, base);
  }
};
