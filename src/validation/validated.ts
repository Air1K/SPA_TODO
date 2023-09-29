
export const validateFormAddProject = (form)=>{
    const {name} = form
    const formErrors = {}
    const stateErr = {}
    const validateName = isValidName(name);
    if(!!validateName) {
        stateErr["name"] = false;
        formErrors["name"] = validateName;
    }else {
        stateErr["name"] = true;
    }

    return {formErrors, stateErr}
}

export const vakidateFromAddTask = (from) => {
    const {head_task, body_task, files_task} = from
    const formErrors = {}
    const stateErr = {}
    const validateHeadTask = isValidHeadTask(head_task);
    if(!!validateHeadTask) {
        stateErr["head_task"] = false;
        formErrors["head_task"] = validateHeadTask;
    }else {
        stateErr["head_task"] = true;
    }
    const validateBodyTask = isValidBodyTask(body_task);
    if(!!validateBodyTask) {
        stateErr["body_task"] = false;
        formErrors["body_task"] = validateBodyTask;
    }else {
        stateErr["body_task"] = true;
    }
    const validateFileTask = isValidFileTask(files_task);
    if(!!validateFileTask) {
        stateErr["files_task"] = false;
        formErrors["files_task"] = validateFileTask;
    }else {
        stateErr["files_task"] = true;
    }
    return {formErrors, stateErr}
}
// function isValidateUserName(userName){
//     if(!userName || userName === '') return "Пожалуйста укажите свой user name"
//     else if(userName.length > 20) return "Слишком длинный user name максимальная длина 20 символов"
//     else if(userName.length < 2) return "Слишком короткий user name минимальная длина 2 символа"
// }
function isValidName(name) {
    if(!name || name === '') return "Пожалуйста укажите название проекта"
    else if(name.length > 20) return "Слишком длинное название, максимальная длина 20 символов"
    else if(name.length < 2) return "Слишком короткое название, минимальная длина 2 символа"
    else if(name === undefined || name === null) return "Значение названия не определенно"
}
function isValidHeadTask(head_task){
    if(!head_task || head_task === '') return "Пожалуйста укажите заголовок"
    else if(head_task.length > 50) return "Слишком длинный заголовок, максимальная длина 30 символов"
    else if(head_task.length < 2) return "Слишком короткий заголовок, минимальная длина 2 символа"
    else if(head_task === undefined || head_task === null) return "Значение названия не определенно"
}
function isValidBodyTask(body_task) {
    if(!body_task || body_task === '') return "Пожалуйста укажите описание"
    else if(body_task.length > 300) return "Слишком длинный заголовок, максимальная длина 300 символов"
    else if(body_task.length < 2) return "Слишком короткий заголовок, минимальная длина 2 символа"
    else if(body_task === undefined || body_task === null) return "Значение названия не определенно"
}
function isValidFileTask(file_task){
    if(file_task.size > 500000) return "Слишком большой размер файла максимальный размер 500КБ"
}
//
// function isValidatePassword(password){
//     if(!password || password === '') return "Пожалуйста укажите свой пароль"
//     else if(password.length > 20) return "Слишком длинный пароль максимальная длина 20 символов"
//     else if(password.length < 6) return "Слишком ороткий пароль минимальная длина 6 символов"
// }
//
// function isValidateConfirmPassword(password, confirmPassword){
//     if(password!==confirmPassword || confirmPassword==='') return "Пароли не совпадают"
// }
//
// function isValidateAgreement(agreement){
//     if(!agreement) return "Для завершения регистрации необходимо принять соглашение"
// }


