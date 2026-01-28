
export function isEmail(v) { return /\S+@\S+\.\S+/.test(v); }
export function required(v){ return (v ?? '').toString().trim().length > 0; }
export function minLength(v, n) { return (v ?? '').toString().trim().length >= n; }
