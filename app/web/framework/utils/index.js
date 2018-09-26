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
  }
};
