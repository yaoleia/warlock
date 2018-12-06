<template>
    <div class="item-pannel">
        <div class="title">工具箱</div>
        <ul class="item-pannel-list">
            <li class="getItem" data-shape="distortion-correction" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" />畸变校正
            </li>
            <li class="getItem" data-shape="image-compression" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" />图像压缩
            </li>
            <li class="getItem" data-shape="image-registration" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" />图像配准
            </li>
            <li class="getItem" data-shape="bar-code-recognition" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" />条码识别
            </li>
            <li class="getItem" data-shape="dm-code-recognition" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" />二维码识别
            </li>
            <li class="getItem" data-shape="factory-card" data-type="node" data-size="100*100">
                <span class="pannel-type-icon" />图标
            </li>
        </ul>
    </div>
</template>

<script>
    import factory from 'asset/images/factory.svg';
    import G6Editor from '@antv/g6-editor';
    const Flow = G6Editor.Flow;

    export default {
        data() {
            return {
                name: 'itempannel'
            }
        }
    }
</script>
<style lang="scss">
    .item-pannel {
        height: 100%;
        position: absolute;
        left: 0px;
        z-index: 2;
        width: 200px;
        border: 1px solid #444;
        border-top: 0;
        text-align: left;
        .title {
            line-height: 32px;
            background: #666;
            color: #eee;
            font-size: 15px;
            padding-left: 12px;
        }
        ul {
            padding: 0px;
            padding-left: 16px;
            li {
                width: 160px;
                font-size: 15px;
                line-height: 26px;
                padding: 3px 3px 3px 8px;
                margin: 7px 0;
                color: #ccc;
                list-style-type: none;
                border-radius: 4px;
                border: 1px solid rgba(0, 0, 0, 0);
                &:hover {
                    color: #ff8800;
                    cursor: move;
                    border: 1px solid #ff8800;
                }
            }
        }
        .pannel-type-icon {
            width: 16px;
            height: 16px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 8px;
            background: url(https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg);
        }
    }
</style>
