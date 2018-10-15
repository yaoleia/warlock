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
    try {
      const resp = await this.ctx.http.post(
        `${this.serverUrl}/api/record`,
        reqObj
      );

      // const resp = {
      //   code: 1,
      //   data: {
      //     total: 32,
      //     list: [
      //       {
      //         dm_code: 'FJW5675789734WTG1',
      //         seg_img_path: '/img/1.jpg',
      //         reg_img_path: '/img/2.jpg',
      //         dm_img_path: '/img/dmcode--1538018674.jpg',
      //         mask_img_path: '/img/3.jpg',
      //         defect_type: 0,
      //         detect_time: new Date().getTime()
      //       },
      //       {
      //         dm_code: 'FJW5675789734WTG2',
      //         seg_img_path: '/img/1.jpg',
      //         mask_img_path: '/img/3.jpg',
      //         reg_img_path: '/img/2.jpg',
      //         dm_img_path: '/img/dmcode--1538018674.jpg',
      //         defect_type: 1,
      //         detect_time: new Date().getTime()
      //       },
      //       {
      //         dm_code: 'FJW5675789734WTG3',
      //         seg_img_path: '/img/1.jpg',
      //         mask_img_path: '/img/3.jpg',
      //         reg_img_path: '/img/2.jpg',
      //         dm_img_path: '/img/dmcode--1538018674.jpg',
      //         defect_type: 2,
      //         detect_time: new Date().getTime()
      //       }
      //     ]
      //   }
      // };
      if (resp.data && resp.code === 1) {
        resp.data.list.forEach(l => {
          l.seg_img_path = l.seg_img_path.replace(
            'http://0.0.0.0:5000',
            this.serverUrl
          );
          l.reg_img_path = l.reg_img_path.replace(
            'http://0.0.0.0:5000',
            this.serverUrl
          );
          l.dm_img_path = l.dm_img_path.replace(
            'http://0.0.0.0:5000',
            this.serverUrl
          );
          l.mask_img_path = l.mask_img_path.replace(
            'http://0.0.0.0:5000',
            this.serverUrl
          );
        });
        return resp.data;
      } else {
        return resp;
      }
    } catch (error) {
      return error;
    }
  }
}

module.exports = RecordService;
