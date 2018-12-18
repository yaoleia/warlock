const Service = require('egg').Service;
const sendToWormhole = require('stream-wormhole');

class UploadService extends Service {
    constructor(ctx) {
        super(ctx);
        this.ctx = ctx;
        this.serverUrl = this.app.config.serverUrl;
    }
    async uploadFile(ctx) {
        let stream;
        try {
            stream = await ctx.getFileStream();
            const resp = await this.app.curl(`${this.serverUrl}/api/upload`, {
                method: 'POST',
                stream
            });
            return resp;
        } catch (error) {
            await sendToWormhole(stream);
            throw error;
        }
    }
}

module.exports = UploadService;
