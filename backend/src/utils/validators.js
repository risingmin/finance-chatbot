export const validateInput = (input) => {
    if (!input || typeof input !== 'string') {
        return { isValid: false, message: 'Input must be a non-empty string.' };
    }
    return { isValid: true };
};

export const validateAmount = (amount) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(amount)) {
        return { isValid: false, message: 'Amount must be a valid number with up to two decimal places.' };
    }
    return { isValid: true };
};

export const validateDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return { isValid: false, message: 'Date must be a valid date.' };
    }
    return { isValid: true };
};