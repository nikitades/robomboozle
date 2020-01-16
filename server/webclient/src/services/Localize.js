export default function Localize(lang = "ru", key, args) {
    switch (lang) {
        case "ru":
            switch (key) {
                case "NEW_CLIENT_TYPE":
                    return "Подключен новый клиент!";
                case "NEW_CLIENT_TEXT":
                    const role = args.role.toLowerCase() === "steerman" ? "рулевой" : "зритель";
                    return `${args.name} (${role})`;
                case "THIS_IS_HOW_YOU_CONTROL":
                    return "Это вы контролируете робота";
                case "THIS_IS_HOW_YOU_LOOK":
                    return "Это вы наблюдаете за роботом";
                case "FAMILY_MEMBER":
                    return "Член семьи";
                case "DEAR_GUEST":
                    return "Дорогой гость";
                case "WATCH_AND_CONTROL":
                    return "Смотрите и управляйте";
                case "JUST_WATCH":
                    return "Просто наблюдайте";
                case "PASSWORD":
                    return "Пароль"
                case "NAME":
                    return "Имя"
                case "ENTER_THE_PASSWORD":
                    return "Введите пароль"
                case "EXIT":
                    return "Выход"
                default:
                    return "(НЕПЕРЕВЕДЕННАЯ ФРАЗА)";
            }
        case "en":
            switch (key) {
                case "NEW_CLIENT_TYPE":
                    return "New client has connected!";
                case "NEW_CLIENT_TEXT":
                    const role = args.role.toLowerCase() === "steerman" ? "watcher" : "steerman";
                    return `${args.name} (${role})`;
                case "THIS_IS_HOW_YOU_CONTROL":
                    return "This is how you control the robot";
                case "THIS_IS_HOW_YOU_LOOK":
                    return "This is how you observer what robot sees";
                case "FAMILY_MEMBER":
                    return "Family member";
                case "DEAR_GUEST":
                    return "Dear guest";
                case "WATCH_AND_CONTROL":
                    return "Watch & control the robot.";
                case "JUST_WATCH":
                    return "Just watch the robot.";
                case "PASSWORD":
                    return "Password";
                case "NAME":
                    return "Name";
                case "ENTER_THE_PASSWORD":
                    return "Enter the password";
                case "EXIT":
                    return "Exit";
                default:
                    return "(UNKNOWN PHRASE)";
            }
        default:
            return "(UNKNOWN LANG GIVEN)";
    }
}