import hash from './hash.js';

export function modifyUserData(data) {
    const user = Object.assign({}, data);
    Object.defineProperty(data, 'token', {
        configurable: true,
        enumerable: true,
        writable: true,
        value: hash.encrypt(data.email),
    });
    delete user.password;
}

export function generateToken(payload) {
    return hash.encrypt(payload);
}

export function sevenDaysFromNow() {
    const date = new Date(Date.now());
    const plusSevenDays = new Date(
        date.setDate(date.getDate() + 7)
    ).toLocaleDateString();
    return plusSevenDays;
}
