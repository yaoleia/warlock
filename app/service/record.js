const Service = require('egg').Service;

class RecordService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ctx = ctx;
    this.serverUrl = this.app.config.serverUrl;
  }
  async getRecordList(json) {
    let reqObj = null;
    if (json.endTime) {
      reqObj = {
        limit: json.pageSize,
        offset: (json.pageIndex - 1) * json.pageSize,
        end_time: json.endTime
      };
      if (json.dateRange) {
        reqObj.start_time = json.dateRange[0];
        if (json.endTime > json.dateRange[1]) {
          reqObj.end_time = json.dateRange[1];
        }
      }
    } else {
      reqObj = {
        limit: 20,
        offset: 0,
        end_time: new Date().getTime()
      };
    }

    console.log(reqObj);
    // const p1 = this.ctx.http.post(`${this.serverUrl}/record_size`, reqObj);
    // const p2 = this.ctx.http.post(`${this.serverUrl}/record`, reqObj);
    // const resp = await Promise.all([p1, p2]);
    // return resp;
    return {
      total: 32,
      list: [
        {
          dm_code: 'FJW5675789734WTG',
          seg_img_path: '/img/1.jpg',
          reg_img_path: '/img/2.jpg',
          dm_code_path: '/img/dmcode--1538018674.jpg',
          mask_img_path: '/img/3.jpg',
          defect_type: 0,
          timestamp: new Date().getTime()
        },
        {
          dm_code: 'FJW5675789734WTG',
          seg_img_path: '/img/1.jpg',
          mask_img_path: '/img/3.jpg',
          reg_img_path: '/img/2.jpg',
          dm_code_path: '/img/dmcode--1538018674.jpg',
          defect_type: 1,
          timestamp: new Date().getTime()
        },
        {
          dm_code: 'FJW5675789734WTG',
          seg_img_path: '/img/1.jpg',
          mask_img_path: '/img/3.jpg',
          reg_img_path: '/img/2.jpg',
          dm_code_path: '/img/dmcode--1538018674.jpg',
          defect_type: 2,
          timestamp: new Date().getTime()
        }
      ]
    };
  }
}

module.exports = RecordService;
