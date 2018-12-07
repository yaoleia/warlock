<template>
    <div class="item-pannel">
        <div class="title">工具箱</div>
        <ul class="item-pannel-list">
            <li class="getItem" v-for="(item,key) in algorithmMap" :key="key" :data-shape="item.module" data-type="node" data-size="200*50">
                <span class="pannel-type-icon" /><span>{{item.class}}</span>
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
        },
        computed: {
            algorithmMap() {
                return this.$store.state.algorithmMap;
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
        .getItem {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
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
