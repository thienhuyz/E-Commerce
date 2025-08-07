export const createslug = string =>
    string.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(' ')
        .join('-');
