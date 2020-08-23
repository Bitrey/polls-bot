export const getEmoji = (num: number): string => {
    switch (num) {
        case 0:
            return "🟦";
        case 1:
            return "🟥";
        case 2:
            return "🟩";
        case 3:
            return "🟧";
        case 4:
            return "🟪";
        case 5:
            return "🟨";
    }
    return "❌";
};

export const getAnswerIndex = (emoji: string): number => {
    switch (emoji) {
        case "🟦":
            return 0;
        case "🟥":
            return 1;
        case "🟩":
            return 2;
        case "🟧":
            return 3;
        case "🟪":
            return 4;
        case "🟨":
            return 5;
    }
    return -1;
};
