<template>
    <div class="dialog-detail">
        <magnifier :mask_img_path="cur.mask_img_path" :reg_img_path='cur.reg_img_path' ref="magnifier">
            <imgStream class="img-big" :url="cur.reg_img_path"></imgStream>
            <imgStream :url="cur.mask_img_path"></imgStream>
        </magnifier>
        <div class="right">
            <!-- <imgStream title="目标定位" :url="cur.seg_img_path"></imgStream> -->
            <el-card class="msg">
                <p class="title">检测结果详情</p>
                <span>{{cur.dm_code}}</span>
                <span>{{ifOk(cur.defect_type)}}</span>
                <span>{{defectType(cur.defect_type)}}</span>
                <img class="dm-code-img" v-if="cur.dm_path" :src="cur.dm_path">
                <p>{{this.$dateFns.format(cur.detect_time-0, 'YYYY-MM-DD HH:mm:ss')}}</p>
            </el-card>
        </div>
    </div>
</template>
<style lang="scss">
    .dialog-detail {
        display: flex;
        justify-content: space-around;
        align-items: center;
        .el-card {
            background: none;
            border: none;
        }
        .right {
            width: 600px;
        }
        .msg {
            background: rgba(255, 255, 255, 0.03);
            color: #dbdbdb;
            margin-top: 30px;
            height: 140px;
            position: relative;
            .title {
                color: #888;
            }
            span {
                padding: 0 30px 0 0;
                line-height: 36px;
            }
            .dm-code-img {
                position: absolute;
                right: 40px;
                top: 0;
                bottom: 0;
                margin: auto;
                width: 80px;
                height: 80px;
            }
        }
        .result {
            p {
                position: absolute;
                line-height: 600px;
                width: 100%;
                text-align: center;
                color: #555;
                font-size: 17px;
                z-index: 0;
            }
            .img {
                position: relative;
                z-index: 1;
            }
        }

        .magnifier {
            width: 430px;
            height: 860px;
            .big-area {
                left: 100%;
                right: auto;
            }
        }
    }
    @media screen and (max-width: 1920px) {
        .dialog-detail {
            .magnifier {
                width: 325px;
                height: 650px;
            }
            .right {
                width: 500px;
                .result {
                    p {
                        line-height: 500px;
                    }
                }
                .msg {
                    height: 120px;
                }
            }
        }
    }
</style>
<script type="text/babel">
    import imgStream from 'component/imgStream'
    import magnifier from 'component/magnifier'
    import utils from 'framework/utils'
    export default {
        props: {
            cur: {
                type: Object,
                required: true
            }
        },
        components: {
            imgStream,
            magnifier
        },
        methods: {
            ifOk(type) {
                return utils.ifOk(type)
            },
            defectType(type) {
                const msg = utils.defectType(type)
                return msg === '无缺陷' ? '-' : msg
            }
        },
        beforeMount() { },
        watch: {
            cur(c) {
                if (c) {
                    this.$refs.magnifier.close();
                }
            }
        }
    }
</script>
