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

        <div class="control-wrap" v-show="!loading&&!cut.bigSrc">
            <div class="left-control btns">
                <el-upload action='' :on-change="beforeAvatarUpload" :auto-upload='false'>
                    <v-icon name='appendix'></v-icon>
                </el-upload>
                <div v-show='hasImg'>
                    <el-button @click='cutImg' type="text" size="small" v-show='hasImg' title='裁剪'>
                        <v-icon name='cut'></v-icon>
                    </el-button>
                    <el-button @click='reset' type="text" size="small" v-show='hasImg' title="重置画板">
                        <v-icon name='shanchu'></v-icon>
                    </el-button>
                    <el-button @click='clearMark(false)' type="text" size="small" v-show='hasImg' title='清空标注'>
                        <v-icon name='reset'></v-icon>
                    </el-button>
                    <el-button @click='fixIn' type="text" size="small" v-show='hasImg' title="适应画布">
                        <v-icon name='fullscreen'></v-icon>
                    </el-button>
                    <el-button @click='toJson' type="text" size="small" v-show='hasImg' title='导出json'>
                        <v-icon name='JSON'></v-icon>
                    </el-button>
                    <el-button @click='toPng' type="text" size="small" v-show='hasImg' title='导出png'>
                        <v-icon name='ds-png'></v-icon>
                    </el-button>
                </div>
            </div>

            <div class="right-control">
                <div v-show='hasImg'>
                    <el-radio-group v-model="editor.type" class="main-group" size="small">
                        <el-radio-button label="brush">
                            <v-icon name='pen'></v-icon>
                        </el-radio-button>
                        <el-radio-button label="labelRect">
                            <v-icon name='rect'></v-icon>
                        </el-radio-button>
                        <el-radio-button label="labelCircle">
                            <v-icon name='circle'></v-icon>
                        </el-radio-button>
                        <el-radio-button label="labelPolygon">
                            <v-icon name='polygon'></v-icon>
                        </el-radio-button>
                    </el-radio-group>
                    <div class="revoke">
                        <el-button @click='undo' type="text" size="small" title="后退">
                            <v-icon name='undo'></v-icon>
                        </el-button>
                        <el-button @click='redo' type="text" size="small" title="前进">
                            <v-icon name='redo'></v-icon>
                        </el-button>
                    </div>
                    <el-radio-group v-show="editor.type==='brush'" @change="selectChange" v-model="editor.lineMode" size="mini" class="line-group">
                        <el-radio-button v-for="option in editor.lines" :key="option" :label="option">{{option}}</el-radio-button>
                    </el-radio-group>

                    <div class="block">
                        <v-icon name='tiaoseban'></v-icon>
                        <el-color-picker v-model="editor.line.color" @change="drawingLineColor" show-alpha :predefine="editor.predefineColors"></el-color-picker>
                    </div>
                    <div class="block">
                        <v-icon name='width'></v-icon>
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
            fixIn() {
                this.$parent.setZoom(this.canvas);
                this.canvas.absolutePan({ x: 0, y: 0 });
            },
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
                a.download = this.imageName;
                document.body.appendChild(a);
                a.click();
                a.remove();
            },
            splitFileName(text) {
                const pattern = /\.{1}[a-z]{1,}$/;
                if (pattern.exec(text) !== null) {
                    return (text.slice(0, pattern.exec(text).index));
                } else {
                    return text;
                }
            },
            beforeAvatarUpload(file) {
                const url = URL.createObjectURL(file.raw);
                this.imageName = this.splitFileName(file.name);
                this.$parent.addImage(url, this.imageName);
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
                // this.canvas.selectable = bol;
                // this.canvas.selection = bol;
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
                            await this.$parent.addImage(this.cut.resultSrc, this.imageName);
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
        .v-icon {
            font-size: 20px;
        }
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
                padding: 10px 7px;
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
            background: rgba($color: #444, $alpha: 0.5);
            box-shadow: 0 5px 5px 0 rgba($color: #000, $alpha: 0.5);
            padding: 20px 0 30px;
            border-radius: 5px;
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
            left: -120px;
            top: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            background: rgba($color: #444, $alpha: 0.5);
            box-shadow: 0 5px 5px 0 rgba($color: #000, $alpha: 0.5);
            border-radius: 5px;
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
