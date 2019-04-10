<template>
    <div class="fabric-page">
        <tool-bar ref="toolBar" :loading.sync='loading' :cut='cut' :hasImg.sync='hasImg' :current='current' :editor='editor' :canvas='canvas'></tool-bar>
        <div class="playground-wrap" v-loading="loading">
            <canvas ref="c" class="playground" :height="inner.height" :width="inner.width"></canvas>
            <div class="active-obj" v-if="activeObj">
                label:
                <el-input v-model="activeObjLabel"></el-input>
            </div>
            <div class="active-obj angle" v-show='current.angle!==null'>angle: {{current.angle}}°</div>
        </div>
    </div>
</template>

<script type="babel">
    import toolBar from './toolBar'
    export default {
        data() {
            return {
                canvas: null,
                loading: false,
                hasImg: false,
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
                    predefineColors: [
                        '#ff8800',
                        '#ff4500',
                        '#ffd700',
                        '#90ee90',
                        '#00ced1',
                        '#1e90ff',
                        '#c71585',
                        'rgba(255, 69, 0, 0.68)',
                        'rgb(255, 120, 0)',
                        'hsv(51, 100, 98)',
                        'hsva(120, 40, 94, 0.5)',
                        'hsl(181, 100%, 37%)',
                        'hsla(209, 100%, 56%, 0.73)',
                        '#c7158577'
                    ],
                    lineMode: 'Pencil',
                    line: {
                        color: '#ff8800',
                        width: 1,
                    },
                    mouseFrom: {},
                    mouseTo: {},
                    drawingObject: null,
                    doDrawing: false,
                    type: '',
                    canDrawing: true
                },
                cut: {
                    cutMode: false,
                    bigSrc: null,
                    resultSrc: null
                },
                activeObj: null,
            }
        },
        components: {
            toolBar
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
            deleteSelected() {
                const activeObjects = this.canvas.getActiveObjects();
                this.canvas.discardActiveObject();
                if (activeObjects.length) {
                    this.canvas.remove.apply(this.canvas, activeObjects);
                }
            },
            selectAll() {
                const canvas = this.canvas;
                canvas.discardActiveObject();
                const sel = new fabric.ActiveSelection(canvas.getObjects(), {
                    canvas,
                });
                sel.lockUniScaling = true;
                // sel.hasRotatingPoint = false;
                canvas.setActiveObject(sel);
                canvas.requestRenderAll();
            },
            async addImage(imageUrl = '/public/mock-img/1.jpg') {
                this.canvas.clear();
                const img = await new Promise((resolve, reject) => {
                    this.fabric.Image.fromURL(imageUrl, image => {
                        image.lockUniScaling = true;
                        // image.hasRotatingPoint = false;
                        this.canvas.add(image);
                        this.setZoom(this.canvas, image);
                        image.set({
                            angle: 0,
                            cornerSize: 15,
                            transparentCorners: false,
                            cornerStyle: 'circle'
                        });
                        image.viewportCenter();
                        resolve(image);
                    });
                })
                return img;
            },
            freeDrawingBrush() {
                const canvas = this.canvas;
                if (canvas.freeDrawingBrush) {
                    canvas.freeDrawingBrush.color = this.editor.line.color;
                    canvas.freeDrawingBrush.width = parseInt(this.editor.line.width, 10) || 1;
                }
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

                let Points = [],
                    mouseDownPoint = null,
                    selection = null,
                    shiftKeyDown = false;

                fabric.LabelPolygon = fabric.util.createClass(fabric.Polygon, {
                    type: 'labelPolygon',
                    initialize(points, options) {
                        options || (options = {});
                        this.callSuper('initialize', points, options);
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
                fabric.LabelPolygon.fromObject = function(options, callback) {
                    callback(new fabric.LabelPolygon(options.points, options));
                }

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
                fabric.LabelRect.fromObject = function(options, callback) {
                    callback(new fabric.LabelRect(options));
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
                fabric.LabelCircle.fromObject = function(options, callback) {
                    callback(new fabric.LabelCircle(options));
                }


                fabric.util.addListener(document.body, 'keydown', options => {
                    if (options.repeat) {
                        return;
                    }
                    const key = options.which || options.keyCode; // key detection
                    if (key == 16) { // handle Shift key
                        canvas.isDrawingMode = false;
                        canvas.defaultCursor = 'move';
                        shiftKeyDown = true;
                        selection = canvas.selection;
                        canvas.selection = false;
                    }
                });

                fabric.util.addListener(document.body, 'keyup', options => {
                    const key = options.which || options.keyCode; // key detection
                    if (key == 16) { // handle Shift key
                        canvas.defaultCursor = 'default';
                        if (this.editor.type === 'brush') {
                            canvas.isDrawingMode = true;
                        }
                        shiftKeyDown = false;
                        canvas.selection = selection;
                    }
                    if (key == 13) {
                        if (this.editor.type === 'labelPolygon') {
                            this.drawing(Points);
                            Points = [];
                            this.editor.drawingObject.evented = true;
                            this.editor.drawingObject.selectable = true;
                            this.editor.drawingObject = null;
                        }
                    }
                });

                canvas.on('mouse:down', options => {
                    const pointer = canvas.getPointer(options.e, true);
                    mouseDownPoint = new fabric.Point(pointer.x, pointer.y);
                });
                canvas.on('mouse:up', options => {
                    mouseDownPoint = null;
                });
                canvas.on('mouse:move', options => {
                    if (shiftKeyDown && mouseDownPoint) {
                        const pointer = canvas.getPointer(options.e, true);
                        const mouseMovePoint = new fabric.Point(pointer.x, pointer.y);
                        canvas.relativePan(mouseMovePoint.subtract(mouseDownPoint));
                        mouseDownPoint = mouseMovePoint;
                    }
                });

                $('.playground-wrap', this.$el).on('mousewheel', options => {
                    const delta = options.originalEvent.wheelDelta;
                    if (delta != 0) {
                        let zoom = canvas.getZoom();
                        const pointer = canvas.getPointer(options.e, true);
                        const point = new fabric.Point(pointer.x, pointer.y);
                        if (delta > 0) {
                            zoom += 0.1;
                            if (zoom > 5) zoom = 5;
                            canvas.zoomToPoint(point, zoom);
                        } else if (delta < 0) {
                            zoom -= 0.1;
                            if (zoom < 0.05) zoom = 0.05;
                            canvas.zoomToPoint(point, zoom);
                        }
                        this.userZoom = zoom;
                    }
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
                    if (shiftKeyDown) return;
                    if (!this.editor.canDrawing) return;
                    this.editor.mouseFrom = this.transformMouse(options, false);
                    this.editor.doDrawing = true;

                    if (this.editor.type === 'labelPolygon') {
                        Points.push(this.transformMouse(options, false))
                        this.drawing(Points);
                        this.editor.drawingObject.evented = false;
                        this.editor.drawingObject.selected = false;
                    }
                });
                canvas.on('mouse:up', options => {
                    if (shiftKeyDown) return;
                    if (!this.editor.canDrawing) return;
                    if (this.editor.type !== 'labelPolygon') {
                        this.editor.drawingObject = null;
                    }
                    this.editor.mouseFrom = null;
                    this.editor.mouseTo = null;
                    this.editor.doDrawing = false;
                });
                canvas.on('mouse:move', options => {
                    if (shiftKeyDown) return;
                    if (this.editor.type === 'labelPolygon') {
                        if (this.editor.drawingObject && Points.length > 0) {
                            const arr = [...Points]
                            arr.push(this.transformMouse(options, false))
                            this.drawing(arr);
                            this.editor.drawingObject.evented = false;
                            this.editor.drawingObject.selected = false;
                        }
                    }
                });
                canvas.on('mouse:move', options => {
                    if (shiftKeyDown) return;
                    if (!this.editor.canDrawing) return;
                    if (!this.editor.doDrawing) return;
                    this.editor.mouseTo = this.transformMouse(options, false);
                    if (this.editor.type !== 'labelPolygon') {
                        this.drawing();
                    }
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
                canvas.on('object:added', options => {
                    if (!this.hasImg) {
                        this.hasImg = true;
                    }
                })
            },
            ifDraw(options, bol = false) {
                if (this.cut.cutMode) return;
                if (options.selected && options.selected[0]) {
                    const obj = options.selected[0];
                    const editorType = this.editor.type;
                    if (obj.type === 'image' || (obj.type !== editorType && editorType)) {
                        this.$refs.toolBar.cancelSelection();
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
            drawing(points) {
                if (this.editor.drawingObject) {
                    this.canvas.remove(this.editor.drawingObject);
                }
                const type = this.editor.type;
                const { mouseFrom, mouseTo, line } = this.editor;
                let x,
                    y;
                if (mouseFrom) {
                    x = mouseFrom.x;
                    y = mouseFrom.y;
                }
                let canvasObject = null;
                let radius = null;
                const fabric = this.fabric;
                let subtract;
                const POINTS = {};
                if (!points) {
                    subtract = this.editor.mouseTo.subtract(this.editor.mouseFrom);
                } else {
                    POINTS.x = Math.min.apply(null, points.map(p => p.x))
                    POINTS.y = Math.min.apply(null, points.map(p => p.y))
                }

                switch (this.editor.type) {
                    case 'labelRect':
                        canvasObject = new fabric.LabelRect({
                            left: x,
                            top: y,
                            width: subtract.x < 0 ? 0 : subtract.x,
                            height: subtract.y < 0 ? 0 : subtract.y,
                            stroke: line.color,
                            strokeWidth: line.width,
                            label: ''
                        });
                        break;
                    case 'labelCircle':
                        radius = Math.sqrt(subtract.x * subtract.x + subtract.y * subtract.y) / 2;
                        canvasObject = new fabric.LabelCircle({
                            radius,
                            left: x - radius,
                            top: y - radius,
                            stroke: line.color,
                            strokeWidth: line.width
                        });
                        break;
                    case 'labelPolygon':
                        canvasObject = new fabric.LabelPolygon(points, {
                            left: POINTS.x,
                            top: POINTS.y,
                            stroke: line.color,
                            strokeWidth: line.width
                        })
                        break;
                    default:
                        break;
                }
                if (canvasObject) {
                    this.canvas.add(canvasObject);
                    this.editor.drawingObject = canvasObject;
                    canvasObject.set({
                        cornerSize: 15,
                        transparentCorners: false,
                        cornerStyle: 'circle'
                    });
                    // canvasObject.hasControls = false;
                }
            },
            getInnerHeight() {
                if (EASY_ENV_IS_BROWSER) {
                    this.inner.height = this.$el.clientHeight - 2;
                    this.inner.width = this.$el.clientWidth - 152;
                }
            },
            async keyEvent() {
                $(window).on('keyup.fabric', (e) => {
                    if (e.keyCode === 8) {
                        if (document.activeElement.tagName === 'INPUT') return;
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
                width: 1748
            }) {
                this.getInnerHeight();
                let zoom = 1;

                const eleHeight = this.inner.height,
                    eleWidth = this.inner.width,
                    cHeight = canvas.height,
                    cWidth = canvas.width;

                if (canvas.item(0)) {
                    SIZE = canvas.item(0);
                }

                const rate = eleWidth / eleHeight;
                const imgRate = SIZE.width / SIZE.height;
                const width = eleWidth;
                const height = eleHeight;
                const ratio = imgRate > rate;
                if (ratio) {
                    zoom = width / SIZE.width;
                } else {
                    zoom = height / SIZE.height;
                }

                canvas.setZoom(zoom);
                canvas.setWidth(width);
                canvas.setHeight(height);
                this.userZoom = zoom;
                canvas.renderAll();
                return ratio;
            },
            addRect() {
                const rect = new fabric.Rect({ width: 200, height: 200, top: 175, left: 475, opacity: 0.2 });
                this.canvas.add(rect);
            },
            transformMouse(options, bol = true) {
                const pointer = this.canvas.getPointer(options.e, bol);
                return new fabric.Point(pointer.x, pointer.y);
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
        },
        watch: {
            'cut.resultSrc': function(src, oldSrc) {
                if (src && oldSrc) {
                    URL.revokeObjectURL(oldSrc);
                }
            }
        }
    }
</script>
<style lang="scss">
    .fabric-page {
        position: relative;
        color: #fff;
        line-height: 35px;
        display: flex;
        .active-obj {
            position: absolute;
            right: 0;
            top: 0;
            background: rgba($color: #444, $alpha: 0.5);
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 5px 5px 0 rgba($color: #000, $alpha: 0.5);
            .el-input {
                width: 140px;
            }
            &.angle {
                height: 80px;
                width: 130px;
            }
        }
        .el-loading-mask {
            background: rgba($color: #000, $alpha: 0.5);
        }
        .playground-wrap {
            border: 1px solid #444;
            border-radius: 5px;
        }
    }
</style>
