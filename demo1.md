### 格式

```
{
	"dm_code": "FJW5675789734WTG",
	"seg_img_path": "/tmp/foxconn/seg/2_15884679942.jpg", //目标定位
    "reg_img_path": "/tmp/foxconn/sem/2_15884679942.jpg", //高清图
    "dm_code_path": "/img/dmcode--1538018674.jpg',
    "mask_img_path": "3.jpg", //标记图
    "defect_type": 0,
    "timestamp": 1537844475264
}
```

### 参数说明

| 参数         | 类型      | 是否必须 | 参数解释                                 | 备注 |
| :----------- | --------- | -------- | ---------------------------------------- | ---- |
| dm_code      | Str       | True     | 二维码（唯一标识）                       |      |
| seg_img_path | int       | true     | 分割图的存储路径                         |      |
| reg_img_path | str       | true     | 检测结果图存储路径                       |      |
| defect_type  | int       | true     | 缺陷类型：0: 无缺陷; 1:多螺丝; 2:少螺丝; |      |
| timestamp    | timestamp | true     | 时间戳                                   |      |

### 请求示例

```javascript
 <script src="https://cdn.bootcss.com/socket.io/2.1.1/socket.io.dev.js"></script>
    <script>
        var socket = io('http://0.0.0.0:5000/websocket/refresh');---------->  后台接口
        socket.on('connect', function() { // 发送到服务器的通信内容
        socket.emit('connect_event', {data: '我已连接上服务端！'});
    });

    socket.on('server_response', function(msg) {
      //显示接受到的通信内容，包括服务器端直接发送的内容和反馈给客户端的内容
        console.log(msg);
    });
    socket.on('response', function(msg) {
        // 获取后端传过来的业务数据
        var obj = eval(msg.data[0]);
        console.log(obj);
        $("#auto_num").empty();
        $("#auto_num").append(obj['pic_data']);

    });
    </script>
```
