<template>
    <div class="navigator">
        <div class="pannel-title">导航器</div>
        <slot name='minimap' />
        <div class="zoom-slider">
            <el-slider v-model="curZoomValue" :min="minZoom" :max="maxZoom" :step="0.01" :format-tooltip="formatTooltip" />
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    export default {
        props: {
            curZoom: {
                type: Number
            },
            minZoom: {
                type: Number
            },
            maxZoom: {
                type: Number
            }
        },
        data() {
            return {
                curZoomValue: this.curZoom
            };
        },
        watch: {
            curZoomValue: _.throttle(function(value) {
                this.$emit('change-zoom', value);
            }, 100),
            curZoom(z) {
                this.curZoomValue = z;
            }
        },
        methods: {
            formatTooltip(value) {
                return `${(value * 100).toFixed(0)}%`;
            }
        }
    };
</script>
<style lang="scss">
    .navigator {
        width: 260px;
        height: 200px;
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 3;
        .slider {
            margin: 7px 10px 10px;
            float: left;
            width: 120px;
        }
        .minimap {
            width: 200px;
            height: 120px;
            margin: 10px auto;
        }
        .g6-editor-minimap-container {
            background: none !important;
        }
        .zoom-slider {
            padding: 0 20px;
            .el-slider__runway {
                margin-top: 10px;
                margin-bottom: 10px;
            }
        }
    }
</style>
