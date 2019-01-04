'use strict';
import _ from 'lodash';
export default {
    algorithmModuleList: state => Object.values(state.algorithmMap).map(item => item.module),
    algorithmTree: state => {
        const tree = _.groupBy(state.algorithmMap, 'super_type');
        for (const key in tree) {
            tree[key] = _.groupBy(tree[key], 'type');
        }
        return tree;
    }
};