<template>
    <div class="fabric-page" v-loading="loading">
        <el-button v-if="cut.bigSrc" @click='cancelCut' class="btn cancel-btn" size="mini">取消</el-button>
        <img ref='bigSrc' v-if="cut.bigSrc" class="cut-img" :src="cut.bigSrc">
        <canvas ref="c" class="playground" :height="inner.height" :width="inner.width"></canvas>
        <div class="control-wrap" v-show="!cut.bigSrc">
            <div class="move-mode" v-show='!editMode' key="move">
                <el-button @click='cutImg' class="btn btn-info" size="mini">裁剪</el-button>
                <el-button @click='reset' class="btn btn-info" size="mini">重置</el-button>
                <div v-show='current.angle!==null'>{{current.angle}}°</div>
            </div>

            <div class="free-edit" v-show='editMode' key="edit">

                <el-radio-group v-model="editor.type" size="mini">
                    <el-radio-button label="">选择</el-radio-button>
                    <el-radio-button label="brush">🖋</el-radio-button>
                    <el-radio-button label="mline">多段线</el-radio-button>
                    <el-radio-button label="labelRect">矩形</el-radio-button>
                    <el-radio-button label="labelCircle">圆形</el-radio-button>
                    <el-radio-button label="textbox">文字</el-radio-button>
                </el-radio-group>

                <div class="block" v-show="editor.type==='brush'">
                    <span>lineMode:</span>
                    <el-select @change="selectChange" v-model="editor.lineMode" placeholder="请选择">
                        <el-option v-for="option in editor.lines" :key="option" :label="option" :value="option">
                        </el-option>
                    </el-select>
                </div>

                <div class="block">
                    <span>Line width:</span>
                    <el-slider @change="drawingLineWidth" v-model="editor.line.width" :min="1" :max="150" show-input></el-slider>
                </div>

                <div class="block">
                    <span>Line color:</span>
                    <el-color-picker v-model="editor.line.color" @change="drawingLineColor"></el-color-picker>
                </div>
            </div>
            <el-button class="btn btn-info" @click="drawingMode" type="success" size="mini">{{editMode?"上一步":"下一步"}}</el-button>
        </div>
        <div class="active-obj" v-if="activeObj">
            <el-input v-model="activeObjLabel"></el-input>
        </div>
    </div>
</template>

<script type="babel">
    export default {
        data() {
            return {
                loading: false,
                current: {
                    angle: null
                },
                inner: {
                    height: 500,
                    width: 800
                },
                userZoom: 1,
                editor: {
                    lines: [
                        'Pencil', 'Spray', 'Pattern'
                    ],
                    lineMode: 'Pencil',
                    line: {
                        color: '#ff8800',
                        width: 5,
                    },
                    mouseFrom: {
                        x: '',
                        y: ''
                    },
                    mouseTo: {
                        x: '',
                        y: ''
                    },
                    textbox: null,
                    drawingObject: null,
                    doDrawing: false,
                    type: 'brush',
                    canDrawing: false
                },
                cut: {
                    bigSrc: null,
                    resultSrc: null
                },
                activeObj: null,
                editMode: false
            }
        },
        components: {
        },
        computed: {
            activeObjLabel: {
                set(label) {
                    this.activeObj.set({ label });
                    this.canvas.renderAll();
                },
                get() {
                    return this.activeObj.get('label');
                }
            }
        },
        methods: {
            cancelCut() {
                this.cut.bigSrc = null;
            },
            reset() {
                this.clear();
                this.addImage();
            },
            cutImg() {
                this.loading = true;
                const self = this;
                this.ifEdit();
                this.cancelSelection();
                setTimeout(async () => {
                    const c = this.$refs.c;
                    this.cut.bigSrc = await new Promise((resolve, reject) => {
                        c.toBlob(blob => {
                            resolve(URL.createObjectURL(blob))
                        })
                    })

                    let $bigSrc = null;
                    this.$nextTick(async () => {
                        $bigSrc = $(this.$refs.bigSrc);
                        if (!$bigSrc.cropper) {
                            await import('cropperjs/dist/cropper.css');
                            await import('cropper');
                        }
                        $bigSrc.cropper({
                            viewMode: 3,
                            autoCrop: false,
                            rotatable: false,
                            guides: false,
                            scalable: false,
                            movable: false,
                            background: false,
                            ready() {
                                self.loading = false;
                            }
                        });
                    })

                    $('.fabric-page').one('dblclick', '.cropper-move', () => {
                        this.clear();
                        const croppedCanvas = $bigSrc.cropper('getCroppedCanvas');
                        croppedCanvas.toBlob(async blob => {
                            this.cut.resultSrc = URL.createObjectURL(blob);
                            await this.addImage(this.cut.resultSrc);
                            this.cut.bigSrc = null;
                        })
                    })
                }, 100);
            },
            deleteSelected() {
                const activeObjects = this.canvas.getActiveObjects();
                this.canvas.discardActiveObject();
                if (activeObjects.length) {
                    this.canvas.remove.apply(this.canvas, activeObjects);
                }
            },
            cancelSelection() {
                this.canvas.discardActiveObject();
                this.canvas.requestRenderAll();
            },
            selectAll() {
                const canvas = this.canvas;
                canvas.discardActiveObject();
                const sel = new fabric.ActiveSelection(canvas.getObjects(), {
                    canvas,
                });
                sel.lockUniScaling = true;
                sel.hasRotatingPoint = false;
                canvas.setActiveObject(sel);
                canvas.requestRenderAll();
            },
            selectChange() {
                this.canvas.freeDrawingBrush = new fabric[`${this.editor.lineMode}Brush`](this.canvas);
                this.freeDrawingBrush();
            },
            async clear() {
                this.canvas.clear();
                this.setZoom(this.canvas);
            },
            async addImage(imageUrl = '/public/mock-img/1.jpg') {
                const img = await new Promise((resolve, reject) => {
                    this.fabric.Image.fromURL(imageUrl, image => {
                        image.set({
                            left: 0,
                            top: 0,
                            angle: 0
                        });
                        image.lockUniScaling = true;
                        image.hasRotatingPoint = false;
                        this.canvas.add(image);
                        if (this.canvas.isEmpty) {
                            this.setZoom(this.canvas, image);
                        }
                        resolve(image);
                    });
                })
                return img;
            },
            ifEdit(bol = false) {
                this.canvas.selectable = bol;
                this.canvas.selection = bol;
                this.canvas.skipTargetFind = !bol;
            },
            drawingMode() {
                this.ifEdit(this.editMode);
                this.editMode = !this.editMode;
                if (this.editor.type === 'brush') {
                    this.canvas.isDrawingMode = this.editMode;
                }
                this.editor.type = '';
                this.cancelSelection();
            },
            drawingLineColor() {
                this.canvas.freeDrawingBrush.color = this.editor.line.color;
            },
            drawingLineWidth() {
                this.canvas.freeDrawingBrush.width = parseInt(this.editor.line.width, 10) || 1;
            },
            async init() {
                const { fabric } = await import('fabric');

                const canvas = new fabric.Canvas(this.$refs.c, {
                    includeDefaultValues: false
                });
                this.fabric = fabric;
                this.canvas = canvas;
                window.canvas = canvas;
                this.freeDrawingBrush();

                fabric.LabelRect = fabric.util.createClass(fabric.Rect, {
                    type: 'labelRect',
                    initialize(options) {
                        options || (options = {});
                        this.callSuper('initialize', options);
                        this.set('label', options.label || '');
                        this.set('fill', options.fill || 'rgba(255, 255, 255, 0)');
                        if (!this.cacheProperties.includes('label')) {
                            this.cacheProperties.push('label')
                        }
                    },
                    toObject() {
                        return fabric.util.object.extend(this.callSuper('toObject'), {
                            label: this.get('label')
                        });
                    },
                    _render(ctx) {
                        this.callSuper('_render', ctx);
                        ctx.font = `${this.height / 2}px Helvetica`;
                        ctx.fillStyle = '#fff';
                        ctx.fillText(this.label, -this.width / 2 + 5, this.height / 6);
                    }
                })
                fabric.LabelRect.fromObject = function(options) {
                    return new fabric.LabelRect(options);
                }


                fabric.LabelCircle = fabric.util.createClass(fabric.Circle, {
                    type: 'labelCircle',
                    initialize(options) {
                        options || (options = {});
                        this.callSuper('initialize', options);
                        this.set('label', options.label || '');
                        this.set('fill', options.fill || 'rgba(255, 255, 255, 0)');
                        if (!this.cacheProperties.includes('label')) {
                            this.cacheProperties.push('label')
                        }
                    },
                    toObject() {
                        return fabric.util.object.extend(this.callSuper('toObject'), {
                            label: this.get('label')
                        });
                    },
                    _render(ctx) {
                        this.callSuper('_render', ctx);
                        ctx.font = `${this.radius / 2}px Helvetica`;
                        ctx.fillStyle = '#fff';
                        ctx.fillText(this.label, -this.width / 2 + 5, this.radius / 6);
                    }
                })
                fabric.LabelCircle.fromObject = function(options) {
                    return new fabric.LabelCircle(options);
                }

                canvas.on('mouse:wheel', opt => {
                    // if (this.editMode) return;
                    const delta = opt.e.deltaY;
                    let zoom = canvas.getZoom();
                    zoom = zoom + delta / 1000;
                    if (zoom > 5) zoom = 5;
                    if (zoom < 0.05) zoom = 0.05;
                    canvas.setZoom(zoom);
                    this.userZoom = zoom;
                    opt.e.preventDefault();
                    opt.e.stopPropagation();
                });

                canvas.on('object:rotating', options => {
                    const angle = options.target.angle;
                    this.current.angle = Math.floor(angle);
                });
                canvas.on('mouse:up:before', options => {
                    this.current.angle = null;
                })

                // 绑定画板事件
                canvas.on('mouse:down', options => {
                    if (!this.editor.canDrawing) return;
                    const xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
                    this.editor.mouseFrom.x = xy.x;
                    this.editor.mouseFrom.y = xy.y;
                    this.editor.doDrawing = true;
                    if (this.editor.type === 'textbox') {
                        const textbox = new fabric.Textbox('', {
                            left: xy.x - 20,
                            top: xy.y - 20,
                            width: 150,
                            fontSize: 40,
                            borderColor: '#2c2c2c',
                            fill: this.editor.line.color
                        });
                        this.canvas.add(textbox);
                        textbox.enterEditing();
                        this.editor.textbox = textbox;
                    }
                });
                canvas.on('mouse:up', options => {
                    if (!this.editor.canDrawing) return;
                    const xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
                    this.editor.mouseTo.x = xy.x;
                    this.editor.mouseTo.y = xy.y;
                    this.editor.drawingObject = null;
                    this.editor.doDrawing = false;
                });
                canvas.on('mouse:move', options => {
                    if (!this.editor.canDrawing) return;
                    if (!this.editor.doDrawing) return;
                    const xy = this.transformMouse(options.e.offsetX, options.e.offsetY);
                    this.editor.mouseTo.x = xy.x;
                    this.editor.mouseTo.y = xy.y;
                    this.drawing();
                });
                canvas.on('selection:created', options => {
                    this.ifDraw(options);
                })
                canvas.on('selection:updated', options => {
                    this.ifDraw(options);
                })
                canvas.on('selection:cleared', options => {
                    this.ifDraw(options, true);
                })
            },
            ifDraw(options, bol = false) {
                if (this.editor.textbox) {
                    this.editor.textbox.exitEditing();
                    this.editor.textbox = null;
                }
                if (!this.editMode) return;
                if (options.selected && options.selected[0]) {
                    const obj = options.selected[0];
                    const editorType = this.editor.type;
                    if (obj.type === 'image' || (obj.type !== editorType && editorType)) {
                        this.cancelSelection();
                        bol = true;
                    }
                    if (!bol) {
                        this.activeObj = obj;
                    }
                }
                if (bol) {
                    this.activeObj = null;
                }
                this.editor.canDrawing = bol;
            },
            drawing() {
                if (this.editor.drawingObject) {
                    this.canvas.remove(this.editor.drawingObject);
                }
                const type = this.editor.type;
                const { mouseFrom, mouseTo, line } = this.editor;
                let canvasObject = null;
                let radius = null;
                const left = mouseFrom.x;
                const top = mouseFrom.y;
                const fabric = this.fabric;

                switch (this.editor.type) {
                    case 'mline':
                        break;
                    case 'labelRect':
                        canvasObject = new fabric.LabelRect({
                            left,
                            top,
                            width: (mouseTo.x - mouseFrom.x) < 0 ? 0 : (mouseTo.x - mouseFrom.x),
                            height: (mouseTo.y - mouseFrom.y) < 0 ? 0 : (mouseTo.y - mouseFrom.y),
                            stroke: line.color,
                            strokeWidth: line.width,
                            label: ''
                        });
                        break;
                    case 'labelCircle':
                        radius = Math.sqrt((mouseTo.x - left) * (mouseTo.x - left) + (mouseTo.y - top) * (mouseTo.y - top)) / 2;
                        canvasObject = new fabric.LabelCircle({
                            radius,
                            left: left - radius,
                            top: top - radius,
                            stroke: line.color,
                            strokeWidth: line.width
                        });
                        break;
                    default:
                        break;
                }
                if (canvasObject) {
                    this.canvas.add(canvasObject);
                    this.editor.drawingObject = canvasObject;
                    canvasObject.hasControls = false;
                }
            },
            freeDrawingBrush() {
                const canvas = this.canvas;
                if (canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = this.editor.line.color;
                    canvas.freeDrawingBrush.width = parseInt(this.editor.line.width, 10) || 1;
                }
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    this.inner.height = this.$el.clientHeight;
                    this.inner.width = this.$el.clientWidth;
                }
            },
            async keyEvent() {
                $(window).on('keyup.fabric', (e) => {
                    if (e.keyCode === 8) {
                        this.deleteSelected()
                    }
                    e.preventDefault();
                });

                let hotkeys = await import('hotkeys-js');
                hotkeys = hotkeys.default;

                hotkeys('ctrl+a,command+a', (event, handler) => {
                    event.preventDefault()
                    this.selectAll();
                });
            },
            setZoom(canvas, SIZE = {
                height: 1080, // 默认画板高、宽
                width: 1898
            }) {
                this.getInnerHeight();
                let zoom = 1;

                const eleHeight = this.inner.height,
                    eleWidth = this.inner.width,
                    cHeight = canvas.height,
                    cWidth = canvas.width;
                let height = eleHeight > cHeight ? eleHeight : cHeight;
                let width = eleWidth > cWidth ? eleWidth : cWidth;
                if (width > height) {
                    // 横版
                    width = eleWidth;
                    height = eleHeight;
                    zoom = width / SIZE.width;
                } else {
                    // 竖版
                    height = height * eleHeight / SIZE.height * 0.8;
                    zoom = height / SIZE.height;
                }
                canvas.setZoom(zoom);
                canvas.setWidth(width);
                canvas.setHeight(height);
                this.userZoom = zoom;
                canvas.renderAll();
            },
            addRect() {
                const rect = new fabric.Rect({ width: 200, height: 200, top: 175, left: 475, opacity: 0.2 });
                this.canvas.add(rect);
            },
            transformMouse(mouseX, mouseY) {
                return { x: mouseX / this.userZoom, y: mouseY / this.userZoom };
            }
        },
        async mounted() {
            this.getInnerHeight();
            await this.init();
            await this.keyEvent();
            this.setZoom(this.canvas);
            $(window).on('resize.fabric', () => {
                this.setZoom(this.canvas);
            });
            this.$once('hook:beforeDestroy', () => {
                $(window).off('keyup.fabric resize.fabric');
                hotkeys.unbind('ctrl+a,command+a');
            })
            this.addImage();
        },
        watch: {
            'editor.type': function(type) {
                const canvas = this.canvas;
                const bol = type === 'brush';
                canvas.isDrawingMode = bol;
                canvas.skipTargetFind = bol;
                this.cancelSelection();
            },
            'cut.resultSrc': function(src, oldSrc) {
                if (src && oldSrc) {
                    URL.revokeObjectURL(oldSrc);
                }
            },
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
            }
        }
    }
</script>
<style lang="scss">
    .fabric-page {
        position: relative;
        border: 1px solid #444;
        color: #fff;
        line-height: 35px;
        .active-obj {
            position: absolute;
            right: 0;
            top: 0;
        }
        .el-loading-mask {
            background: none;
        }
        .cancel-btn {
            position: absolute;
            right: 20px;
            top: 20px;
            z-index: 100;
        }
        .cut-img {
            width: 100%;
            height: 100%;
        }
        .playground {
            width: 100%;
            height: 100%;
        }
        .block {
            margin: 10px 0;
            line-height: 24px;
            span {
                display: block;
            }
        }
        .free-edit {
            width: 400px;
        }
        .control-wrap {
            position: absolute;
            left: 0;
            top: 0;
            padding: 15px;
            background: rgba($color: #000000, $alpha: 0.2);
            border: 1px solid #bbb;
            border-radius: 4px;
        }
    }
</style>
