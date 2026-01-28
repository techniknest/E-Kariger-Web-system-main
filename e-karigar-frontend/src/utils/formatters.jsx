
export const currency = (n) => `Rs ${Number(n ?? 0).toLocaleString()}`;
export const shortDate = (d) => new Date(d).toLocaleString();
