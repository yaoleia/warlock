const moment = require('moment');

exports.relativeTime = time => moment(new Date(time * 1000)).fromNow();

exports.parseMsg = (action, payload = {}, metadata = {}) => {
  const meta = Object.assign({}, {
    ts: Date.now(),
  }, metadata)

  return {
    meta,
    data: {
      action,
      payload,
    },
  }
}
