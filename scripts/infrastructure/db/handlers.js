/**
 * Creates a default request handler.
 * @param {IDBRequest} request 
 * @returns {Promise<any>}
 */
export function defaultIDBRequestHandler(request) {
    return new Promise((resolve, reject) => {
        /** 
         * @param {Event & {target: IDBRequest}} evt
         */
        request.onsuccess = (evt) => {
            resolve(evt.target.result);
        };

        /** 
         * @param {Event & {target: IDBRequest}} evt
         */
        request.onerror = (evt) => {
            evt.stopPropagation();
            reject(request.error);
        };
    });
}