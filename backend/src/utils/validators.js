const validateInput = (input) => {
    if (!input || typeof input !== 'string') {
        return { isValid: false, message: 'Message must be a non-empty string.' };
    }
    return { isValid: true };
};

const validateAmount = (amount) => {
    const regex = /^\d+(\.\d{1,2})?$/;
    if (!regex.test(amount)) {
        return { isValid: false, message: 'Amount must be a valid number with up to two decimal places.' };
    }
    return { isValid: true };
};

const validateDate = (date) => {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
        return { isValid: false, message: 'Date must be a valid date.' };
    }
    return { isValid: true };
};

// Validate chat request bodies
const validateChatRequest = (req) => {
    const { message } = req.body || {};
    const messageValidation = validateInput(message);
    if (!messageValidation.isValid) return messageValidation.message;
    return null;
};

module.exports = {
    validateInput,
    validateAmount,
    validateDate,
    validateChatRequest
};