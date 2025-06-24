const options = [
    {
        id: 0,
        value: "TOO_WEAK",
        minDiversity: 0,
        minLength: 0
    },
    {
        id: 1,
        value: "WEAK",
        minDiversity: 2,
        minLength: 8
    },
    {
        id: 2,
        value: "MEDIUM",
        minDiversity: 4,
        minLength: 10
    },
    {
        id: 3,
        value: "STRONG",
        minDiversity: 4,
        minLength: 12
    }
] as const;

type Option = (typeof options)[number];

export const convertValueToTitleCase = (value: Option["value"]) => {
    switch (value) {
        case "TOO_WEAK":
            return "Too Weak";
        case "WEAK":
            return "Weak";
        case "MEDIUM":
            return "Medium";
        case "STRONG":
            return "Strong";
        default:
            return null;
    }
};

export const owaspSymbols = "!\"#$%&'()*+,-./\\:;<=>?@[]^_`{|}~";

const rules = [
    {
        key: "lowercase",
        regex: "[a-z]"
    },
    {
        key: "uppercase",
        regex: "[A-Z]"
    },
    {
        key: "number",
        regex: "[0-9]"
    },
    {
        key: "symbol",
        regex: "[^a-zA-Z0-9]"
    }
] as const;

export const checkPasswordStrength = (password: string) => {
    const contains = rules
        .filter((rule) => new RegExp(`${rule.regex}`).test(password))
        .map((rule) => rule.key);

    const fulfilledOptions = options
        .filter((option) => contains.length >= option.minDiversity)
        .filter((option) => password.length >= option.minLength)
        .sort((o1, o2) => o2.id - o1.id)
        .map((option) => ({ id: option.id, value: option.value }));

    return {
        contains,
        length: password.length,
        ...fulfilledOptions[0]
    };
};