export default function isBrowser() {
    // A simple hack to distinguish between browser and Node
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}