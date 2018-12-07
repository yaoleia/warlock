'use strict';

export default {
    algorithmModuleList: state => Object.values(state.algorithmMap).map(item => item.module)
};