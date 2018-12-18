<template>
    <div class="item-pannel">
        <div class="title">工具箱</div>
        <ul class="item-pannel-list">
            <li v-for="(super_modules,super_type) in algorithmTree" :key="super_type">
                <div class="super-type">
                    <v-icon name='zhongleiquan'></v-icon> {{super_type}}
                </div>
                <div v-for="(modules,type) in super_modules" :key="type">
                    <div class="type">
                        <v-icon name='module-B'></v-icon> {{type}}
                    </div>
                    <div class="getItem" v-for='item in modules' :key="item.module" :data-shape="item.module" data-type="node" data-size="200*50">
                        <v-icon name='module'></v-icon><span> {{item.module}}</span>
                    </div>
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
        border-top: 0;
        text-align: left;
        user-select: none;
        .v-icon {
            vertical-align: middle;
        }
        .getItem {
            margin-left: 10px;
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
        .type {
            margin-left: 10px;
        }
        .type,
        .super-type {
            color: #888;
            border-bottom: 1px solid #444;
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
