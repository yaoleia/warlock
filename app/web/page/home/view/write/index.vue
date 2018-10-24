<template>
    <div>
        <div class="search">
            <el-row class="clear">
                <el-input class="long-input" clearable v-model="article.title" placeholder="文章标题"></el-input>
                <el-button class="add-button" type="success" icon="el-icon-document" @click="submit(1)">提交</el-button>
                <el-button class="add-button" type="primary" icon="el-icon-document" @click="submit(0)">草稿</el-button>
            </el-row>
            <el-row class="clear top16">
                <el-input class="long-input" clearable v-model="article.tag" placeholder="标签,多个用空格隔开"></el-input>
            </el-row>
        </div>
        <div class="editor-container" v-if="isShowEditor">
        </div>
    </div>
</template>
<style>
    .editor-container {
    	width: 100%;
    }
</style>
<script type="babel">
    import { SET_SAVE_ARTICLE } from '../../store/app/mutation-type';
    export default {
        components: {
        },
        data() {
            return {
                article: {
                    html: "",
                    title: "",
                    tag: ""
                },
                isShowEditor: false
            };
        },
        computed: {},
        methods: {
            submit(status) {
                this.article.status = status;
                this.$store.dispatch(SET_SAVE_ARTICLE, this.article);
                this.$message(`添加成功`);
            }
        },
        mounted() {
            this.isShowEditor = true;
        }
    };
</script>