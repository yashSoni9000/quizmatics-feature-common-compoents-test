export function validateEmail(email: string) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        return false;
    }
    return true;
}

export function validatePassword(password: string) {
    if (password.length < 8) {
        return false;
    }
    return true;
}

export function validatePhoneNumber(phoneNumber: string) {
    const phonePattern = /^0*[789]\d{9}$/;

    return phonePattern.test(phoneNumber);
}
