const Service = require('egg').Service;

class UploadService extends Service {
    constructor(ctx) {
        super(ctx);
        this.ctx = ctx;
        this.serverUrl = this.app.config.serverUrl;
    }
    async uploadFile(ctx) {
        const stream = await ctx.getFileStream();
        const resp = await this.app.curl(`${this.serverUrl}/api/upload`, {
            method: 'POST',
            stream
        });
        return resp;
    }
}

module.exports = UploadService;
