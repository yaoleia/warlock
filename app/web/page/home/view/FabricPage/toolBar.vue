<template>
    <div class="tool-bar">
        <!-- 用于裁剪功能的img,不是裁剪状态 不渲染 -->
        <div class="cut-img-wrap" v-if="cut.bigSrc">
            <img ref='bigSrc' class="cut-img" :src="cut.bigSrc" crossorigin>
            <div class="cut-btns">
                <el-button @click='cancelCut' class="btn" size="mini">取消</el-button>
                <p>Angle:</p>
                <el-slider vertical v-model="cutAngle" :min="0" :max="360" :step="0.1" show-input></el-slider>
            </div>
        </div>

        <div class="control-wrap">

            <div class="left-control btns">
                <div v-show='!loading&&!cut.bigSrc'>
                    <el-upload action='' :on-change="beforeAvatarUpload" :auto-upload='false'>
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-button @click='cutImg' type="text" size="small" v-show='hasImg'>裁剪</el-button>
                    <el-button @click='reset' type="text" size="small" v-show='hasImg'>重置画板</el-button>
                    <el-button @click='clearMark(false)' type="text" size="small" v-show='hasImg'>清空标注</el-button>
                    <el-button @click='toJson' type="text" size="small" v-show='hasImg'>json</el-button>
                    <el-button @click='toPng' type="text" size="small" v-show='hasImg'>png</el-button>
                </div>
            </div>

            <div class="right-control">
                <div v-show='hasImg'>
                    <el-button @click='undo' type="text" size="small">undo</el-button>
                    <el-button @click='redo' type="text" size="small">redo</el-button>
                    <el-radio-group v-model="editor.type" class="main-group" size="small">
                        <el-radio-button label="brush">画笔</el-radio-button>
                        <el-radio-button label="labelRect">矩形</el-radio-button>
                        <el-radio-button label="labelCircle">圆形</el-radio-button>
                        <el-radio-button label="labelPolygon">多边形</el-radio-button>
                    </el-radio-group>

                    <el-radio-group v-show="editor.type==='brush'" @change="selectChange" v-model="editor.lineMode" size="mini" class="line-group">
                        <el-radio-button v-for="option in editor.lines" :key="option" :label="option">{{option}}</el-radio-button>
                    </el-radio-group>

                    <div class="block">
                        <span>color:</span>
                        <el-color-picker v-model="editor.line.color" @change="drawingLineColor" show-alpha :predefine="editor.predefineColors"></el-color-picker>
                    </div>
                    <div class="block">
                        <span>width:</span>
                        <el-slider @change="drawingLineWidth" vertical v-model="editor.line.width" :min="1" :max="150" show-input></el-slider>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script type="babel">
    export default {
        data() {
            return {
                cutAngle: 0,
                undoArr: []
            }
        },
        props: ['current', 'editor', 'canvas', 'cut', 'loading', 'hasImg'],
        components: {
        },
        computed: {

        },
        methods: {
            async clearMark(bol = false) {
                if (this.canvas.getObjects().length <= 1) return;
                if (!bol) {
                    const resp = await this.$confirm('操作将清空所有标注，是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    if (!resp) return;
                }
                const canvas = this.canvas;
                const items = canvas.getObjects();
                if (items.length == 1) return;
                let i = items.length - 1;
                while (i >= 1) {
                    canvas.remove(canvas.item(i));
                    i--;
                }
            },
            undo() {
                const canvas = this.canvas;
                const items = canvas.getObjects();
                if (items.length == 1) return;
                const undoItem = canvas.item(items.length - 1);
                this.undoArr.push(undoItem)
                canvas.remove(undoItem);
            },
            redo() {
                if (!this.undoArr.length) return;
                const redoItem = this.undoArr.splice(-1)[0];
                this.canvas.add(redoItem);
            },
            toPng() {
                this.$parent.$refs.c.toBlob(c => {
                    this.downloadImg(URL.createObjectURL(c));
                })

                this.canvas.item(0).visible = false;
                this.canvas.renderAll();
                this.$parent.$refs.c.toBlob(c => {
                    this.downloadImg(URL.createObjectURL(c));
                    this.canvas.item(0).visible = true;
                    this.canvas.renderAll();
                })
            },
            toJson() {
                const json = this.canvas.toDatalessJSON();
                console.log(json.objects)
                if (!json.objects.length) return;
                this.downloadImg(json.objects[0].src);
            },
            downloadImg(url) {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'www';
                document.body.appendChild(a);
                a.click();
                a.remove();
            },
            beforeAvatarUpload(file) {
                const url = URL.createObjectURL(file.raw);
                this.$parent.addImage(url);
            },
            cancelCut() {
                this.cut.bigSrc = null;
            },
            async clear(bol = false) {
                if (!bol) {
                    const resp = await this.$confirm('该操作将清空画板，是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    if (!resp) return;
                }
                this.canvas.clear();
                this.$parent.setZoom(this.canvas);
                this.$emit('update:hasImg', false);
                this.editor.type = '';
            },
            freeDrawingBrush() {
                const canvas = this.canvas;
                if (canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = this.editor.line.color;
                    canvas.freeDrawingBrush.width = parseInt(this.editor.line.width, 10) || 1;
                }
            },
            cancelSelection() {
                this.canvas.discardActiveObject();
                this.canvas.requestRenderAll();
            },
            ifEdit(bol = false) {
                this.canvas.selectable = bol;
                this.canvas.selection = bol;
                this.canvas.skipTargetFind = !bol;
            },
            setCutMode(bol) {
                this.ifEdit(bol);
                this.cut.cutMode = bol;
                if (this.editor.type === 'brush') {
                    this.canvas.isDrawingMode = !bol;
                }
                this.cancelSelection();
            },
            drawingLineColor() {
                this.canvas.freeDrawingBrush.color = this.editor.line.color;
            },
            drawingLineWidth() {
                this.canvas.freeDrawingBrush.width = parseInt(this.editor.line.width, 10) || 1;
            },
            selectChange() {
                this.canvas.freeDrawingBrush = new fabric[`${this.editor.lineMode}Brush`](this.canvas);
                this.freeDrawingBrush();
            },
            async cutImg() {
                if (this.canvas.getObjects().length > 1) {
                    const resp = await this.$confirm('裁剪将清空所有标注，是否继续?', '提示', {
                        confirmButtonText: '继续',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                    if (!resp) return;
                    this.clearMark(true);
                }
                this.$emit('update:loading', true);
                const self = this;
                this.ifEdit();
                this.cancelSelection();
                setTimeout(async () => {
                    this.cut.bigSrc = await new Promise((resolve, reject) => {
                        self.$parent.$refs.c.toBlob(blob => {
                            resolve(URL.createObjectURL(blob))
                        })
                    })

                    let $bigSrc = null;
                    this.$nextTick(async () => {
                        $bigSrc = $(self.$refs.bigSrc);
                        if (!$bigSrc.cropper) {
                            await import('cropperjs/dist/cropper.css');
                            await import('cropper');
                        }
                        $bigSrc.cropper({
                            scalable: false,
                            dragMode: 'move',
                            autoCrop: false,
                            autoCropArea: 0.5,
                            ready() {
                                self.$emit('update:loading', false);
                            }
                        });
                    })

                    $('.fabric-page').one('dblclick', '.cropper-move', () => {
                        this.clear(true);
                        const croppedCanvas = $bigSrc.cropper('getCroppedCanvas');
                        croppedCanvas.toBlob(async blob => {
                            this.cut.resultSrc = URL.createObjectURL(blob);
                            await this.$parent.addImage(this.cut.resultSrc);
                            this.cut.bigSrc = null;
                        })
                    })
                }, 100);
            },
            reset() {
                this.clear();
            }
        },
        mounted() {
        },
        watch: {
            'cut.bigSrc': function(src, oldSrc) {
                if (oldSrc) {
                    URL.revokeObjectURL(oldSrc);
                }
                if (src) {
                    this.ifEdit();
                    return;
                }
                this.ifEdit(true);
                $('.cut-img', this.$el).cropper('destroy');
                $('.fabric-page').off('dblclick', '.cropper-move');
                this.cutAngle = 0;
            },
            'editor.type': function(type) {
                const canvas = this.canvas;
                this.cancelCut();
                this.$parent.activeObj = null;

                const cutType = [];
                this.setCutMode(cutType.includes(type))

                // 自由画笔模式
                const bol = type === 'brush';
                canvas.isDrawingMode = bol;
                canvas.skipTargetFind = bol;
                this.cancelSelection();
            },
            cutAngle(value, oldValue) {
                $(this.$refs.bigSrc).cropper('rotate', value - oldValue);
            }
        }
    }
</script>
<style lang="scss">
    .tool-bar {
        width: 150px;
        flex-shrink: 0;
        .el-slider.is-vertical.el-slider--with-input {
            height: 150px;
            .el-slider__input {
                bottom: 15px;
                width: 44px;
                left: -3px;
                border-radius: 5px;
                .el-input-number__increase ~ .el-input .el-input__inner {
                    border: 5px;
                    border-bottom-left-radius: 5px;
                    border-bottom-right-radius: 5px;
                }
                .el-input-number__increase,
                .el-input-number__decrease {
                    top: 36px;
                    border-radius: 3px;
                }
            }
        }
        .line-group.el-radio-group {
            border-radius: 5px;
            width: 50px;
            overflow: hidden;
            .el-radio-button__inner {
                padding: 10px 5px;
                border-radius: 0 !important;
                width: 50px;
            }
        }
        .main-group.el-radio-group {
            border-radius: 5px;
            width: 55px;
            overflow: hidden;
            margin-bottom: 10px;
            .el-radio-button__inner {
                padding: 15px 10px;
                border-radius: 0 !important;
                width: 55px;
            }
        }
        .el-upload-list {
            display: none;
        }
        .cut-img-wrap {
            position: absolute;
            right: 0;
            top: 0;
            height: 100%;
            width: calc(100% - 150px);
            z-index: 100;
            border: 1px solid #444;
            border-radius: 5px;
        }
        .cut-img {
            width: 100%;
            height: 100%;
        }
        .control-wrap {
            display: flex;
            justify-content: space-around;
            > div {
                width: 50%;
            }
            .right-control {
                > div {
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                }
            }
            .left-control {
                > div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    .el-button {
                        margin-left: 0;
                    }
                }
            }
        }
        .cut-btns {
            position: absolute;
            right: 0;
            top: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background: rgba($color: #444, $alpha: 0.5);
            box-shadow: 0 5px 5px 0 rgba($color: #000, $alpha: 0.5);
            border-radius: 0 0 5px 5px;
            > p {
                margin-top: 50px;
            }
            .el-slider.is-vertical.el-slider--with-input {
                height: 300px;
            }
        }
        .block {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 0 0 10px 0;
            margin-top: 10px;
            width: 50px;
            border: 1px solid #444;
            border-radius: 5px;
            > span {
                display: block;
            }
        }
    }
</style>
