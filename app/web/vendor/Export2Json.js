import dateFns from 'date-fns'
export function export2Json(list) {
    import('file-saver').then(FileSaver => {
        const blob = new Blob([JSON.stringify(list)], { type: 'text/plain;charset=utf-8' });
        FileSaver.saveAs(blob, `${dateFns.format(new Date(), 'YYYYMMDDHHmmss')}.json`);
    })
}