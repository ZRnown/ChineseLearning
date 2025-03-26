interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    message: string;
}

interface ValidationRules {
    [key: string]: ValidationRule;
}

export const validateField = (value: string, rules: ValidationRule): string | null => {
    if (rules.required && !value.trim()) {
        return rules.message;
    }

    if (rules.minLength && value.length < rules.minLength) {
        return `长度不能小于 ${rules.minLength} 个字符`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        return `长度不能大于 ${rules.maxLength} 个字符`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message;
    }

    return null;
};

export const validateForm = (values: { [key: string]: string }, rules: ValidationRules): { [key: string]: string | null } => {
    const errors: { [key: string]: string | null } = {};

    Object.keys(rules).forEach((field) => {
        errors[field] = validateField(values[field] || '', rules[field]);
    });

    return errors;
};

export const hasErrors = (errors: { [key: string]: string | null }): boolean => {
    return Object.values(errors).some((error) => error !== null);
}; 