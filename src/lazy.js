/**
 * This is a lazy loader but is not optimised for direct record selection,
 * so code will currently load "An entire array" even if it needs only
 * a single element from that array, and the array elements are fixed width.
 *
 * @param {*} object
 * @param {*} property
 * @param {*} getter
 */
export default function lazy(object, property, getter) {
    let val;
    Object.defineProperty(object, property, {
        get: () => {
            if (val) return val;
            val = getter();
            return val;
        }
    })
};
