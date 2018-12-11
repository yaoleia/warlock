<template>
    <div class="item-pannel">
        <div class="title">工具箱</div>
        <ul class="item-pannel-list">
            <li v-for="(modules,type) in algorithmTree" :key="type">
                <div>{{type}}</div>
                <div class="getItem" v-for='item in modules' :key="item.module" :data-shape="item.module" data-type="node" data-size="200*50">
                    <span class="pannel-type-icon" /><span>{{item.module}}</span>
                </div>
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
            algorithmTree() {
                return this.$store.getters.algorithmTree;
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
            padding: 0 15px;
            li {
                font-size: 15px;
                line-height: 26px;
                margin: 7px 0;
                color: #ccc;
                list-style-type: none;
                .getItem {
                    padding: 5px;
                    border-radius: 4px;
                    border: 1px solid rgba(0, 0, 0, 0);
                }
                .getItem:hover {
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
