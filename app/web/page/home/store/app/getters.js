'use strict';

export default {
    algorithmModuleList: state => Object.values(state.algorithmMap).map(item => item.module),
    algorithmTree: state => _.groupBy(state.algorithmMap, 'type')
};