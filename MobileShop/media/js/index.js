// scroll to top button section
mybutton = document.getElementById("to_the_top_button");
window.onscroll = scrollCallback;

function scrollCallback() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function toTheTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Sidebar Section
function openNav() {
    document.getElementById("mySidebar").style.width = "180px";
    document.getElementById("main").style.marginLeft = "115px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modalSignUp) {
        modalSignUp.style.display = "none";
    } else if (event.target == modalSignIn) {
        modalSignIn.style.display = "none";
    }
}

// display banner section
let imgSlides = document.getElementsByClassName(`img_slides`);
let indicateDots = document.getElementsByClassName(`indicate_dot`);
let directions = document.getElementsByClassName(`direction`);
let indexOfBanner = 0;

for (let i = 0; i < indicateDots.length; i++) {
    indicateDots[i].onclick = () => {
        indexOfBanner = showSlideBannerAt(i);
    }
}
for (let i = 0; i < directions.length; i++) {
    directions[i].onclick = () => {
        if (i == 0) {
            indexOfBanner--;
        } else {
            indexOfBanner++;
        }
        indexOfBanner = showSlideBannerAt(indexOfBanner);
    }
}

function showSlideBannerAuto() {
    setTimeout(() => {
        indexOfBanner++;
        indexOfBanner = showSlideBannerAt(indexOfBanner);
        showSlideBannerAuto();
    }, 3000);
}

function showSlideBannerAt(index) {
    if (index > imgSlides.length - 1) {
        index = 0;
    } else if (index < 0) {
        index = imgSlides.length - 1;
    }
    for (let i = 0; i < imgSlides.length; i++) {
        imgSlides[i].style.display = `none`;
    }
    for (let i = 0; i < indicateDots.length; i++) {
        indicateDots[i].className = indicateDots[i].className.replace(` turquoise`, ``);
    }
    indicateDots[index].className += ` turquoise`;
    imgSlides[index].style.display = `block`;
    return index;
}

// welcome title section
let welcomeTitle = document.getElementById(`welcome_title`);
let mainPageUrl = `index.html`;

welcomeTitle.onclick = () => {
    location.href = mainPageUrl;
}

// Sign up / sign in section
let keySignInRemeberCheckBox = `sign_remember_check`;
let keyCurrentUserSignIn = `current_user_sign_in`;
let keyUsersLocalStorage = `users_data`;

let modalSignUp = document.getElementById('id01');
let modalSignIn = document.getElementById(`id02`);
let nameInput = document.getElementById(`sign_up_name_input`);
let passwordInput = document.getElementById(`sign_up_password_input`);
let repeatPasswordInput = document.getElementById(`repeat_password_input`);
let signUpBtn = document.getElementById(`sign_up_btn`);
let signInBtn = document.getElementById(`sign_in_btn`);
let modalSignUpBtn = document.getElementById(`modal_sign_up_btn`);
let modalSignInBtn = document.getElementById(`modal_sign_in_btn`);
let modalNameInput = document.getElementById(`sign_in_name_input`);
let modalPasswordInput = document.getElementById(`sign_in_password_input`);
let modalSignInStatusTitle = document.getElementById(`sign_in_status_title`);
let signOutBtn = document.getElementById(`sign_out_btn`);
let sideName = document.getElementById(`side_user_name`);
let signInRemeberCheckBox = document.getElementById(`sign_in_remember_checkbox`);
let signUpRemeberCheckBox = document.getElementById(`sign_up_remember_checkbox`);
let modalSignUpStatusTitle = document.getElementById(`sign_up_status_title`);

function saveUsersDataForTheFirstTime() {
    if (isFirstTime()) {
        localStorage.setItem(keyUsersLocalStorage, JSON.stringify(users));
    }
}

function isFirstTime() {
    let rawArr = localStorage.getItem(keyUsersLocalStorage);
    if (rawArr == undefined || rawArr == null) {
        // This is the first time that the user has click into this website
        return true;
    }
    return false;
}

function setUserSignInIndex(index) {
    localStorage.setItem(keyCurrentUserSignIn, index);
}

function setSignRemeberCheck(check) {
    localStorage.setItem(keySignInRemeberCheckBox, check);
}

function getUserSignInIndex() {
    let index = localStorage.getItem(keyCurrentUserSignIn);
    if (index == null || index == undefined || index == -1) {
        return -1;
    }
    return index;
}

function getSignRemeberCheck() {
    let check = localStorage.getItem(keySignInRemeberCheckBox);
    if (check == null || check == undefined || check == -1) {
        return false;
    }
    return true;
}

function clearAllData() {
    if (!isFirstTime()) {
        localStorage.removeItem(keyUsersLocalStorage);
    }
    if (getUserSignInIndex() != undefined || getUserSignInIndex() != null) {
        localStorage.removeItem(keyCurrentUserSignIn);
    }
}

function checkUserSignStatus() {
    if (getSignRemeberCheck() == true) {
        if (getUserSignInIndex() == -1) {
            signOut();
        } else {
            signIn(getUserSignInIndex());
        }
    } else {
        signOut();
    }
}

function signIn(index) {
    let rawString = localStorage.getItem(keyUsersLocalStorage);
    let usersArr = JSON.parse(rawString);
    welcomeTitle.textContent = `Chào mừng bạn ${usersArr[index].user_name} đến với Mobile Shop`;
    signInBtn.style.display = `none`;
    signUpBtn.style.display = `none`;
    signOutBtn.style.display = `block`;
    sideName.textContent = usersArr[index].user_name;
    document.getElementById(`history_btn`).style.display = `block`;
    setUserSignInIndex(index);
    showCurrentUserRedDotBag();
    console.log(usersArr);
}

function signOut() {
    signInBtn.style.display = `block`;
    signUpBtn.style.display = `block`;
    signOutBtn.style.display = `none`;
    sideName.textContent = `no name`;
    welcomeTitle.textContent = `Chào mừng đến với Mobile Shop. Xin bạn vui lòng đăng nhập`;
    document.getElementById(`history_btn`).style.display = `none`;
    setUserSignInIndex(-1);
    showCurrentUserRedDotBag();
}

function closeNavigationWhenClickSignOut() {
    closeNav();
}

signOutBtn.addEventListener(`click`, signOut);
signOutBtn.addEventListener(`click`, closeNavigationWhenClickSignOut);

function modalSignUpOnclickCallback() {
    if (passwordInput.value != repeatPasswordInput.value ||
        nameInput.value == `` || passwordInput.value == `` || repeatPasswordInput.value == `` ||
        nameInput.value == null) {
        modalSignUpStatusTitle.textContent = `Sai thông tin! Vui lòng nhập lại!`;
        modalSignUpStatusTitle.style.color = `red`;
        passwordInput.value = null;
        repeatPasswordInput.value = null;
        return;
    }
    let newUser = {
        user_name: nameInput.value,
        password: repeatPasswordInput.value,
        product_choices: [],
        order_historys: [],
    }
    let rawData = localStorage.getItem(keyUsersLocalStorage);
    let usersArray = JSON.parse(rawData);
    usersArray.push(newUser);
    localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
    signIn(usersArray.length - 1);
    nameInput.value = null;
    passwordInput.value = null;
    repeatPasswordInput.value = null;
    modalSignUp.style.display = `none`;
    closeNav();
}
modalSignUpBtn.addEventListener(`click`, modalSignUpOnclickCallback);

function compareStringIgnoreCase(str_1, str_2) {
    if (str_1.toLocaleLowerCase(`tr`) === str_2.toLocaleLowerCase(`tr`)) {
        return true;
    }
    return false;
}

function signInOnClickCallback() {
    modalSignInStatusTitle.textContent = `Đăng nhập thành viên trang web`;
    modalSignInStatusTitle.style.color = `black`;
    signInRemeberCheckBox.checked = getSignRemeberCheck();
}

signInBtn.addEventListener(`click`, signInOnClickCallback);

function signUpOnclickCallback() {
    modalSignUpStatusTitle.textContent = `Đăng ký thành viên trang web`;
    modalSignUpStatusTitle.style.color = `black`;
    signUpRemeberCheckBox.checked = getSignRemeberCheck();
}
signUpBtn.onclick = () => {
    if (getUsersArray().length > 5) {
        notificationPopUp(`Bạn không thể đăng ký quá 5 tài khoản`, sadImageUrl);
    } else {
        document.getElementById('id01').style.display = 'block';
    }
}
signUpBtn.addEventListener(`click`, signUpOnclickCallback);

function modalSignInOnclickCallback() {
    let rawData = localStorage.getItem(keyUsersLocalStorage);
    let usersArray = JSON.parse(rawData);
    let isUserTypeRight = false;
    for (let i = 0; i < usersArray.length; i++) {
        if (compareStringIgnoreCase(usersArray[i].user_name, modalNameInput.value) &&
            usersArray[i].password === modalPasswordInput.value) {
            signIn(i);
            isUserTypeRight = true;
        }
    }
    if (isUserTypeRight) {
        modalNameInput.value = null;
        modalPasswordInput.value = null;
        modalSignIn.style.display = `none`;
        closeNav();
    } else {
        modalSignInStatusTitle.textContent = `Thông tin sai! Vui lòng điền lại`;
        modalSignInStatusTitle.style.color = `red`;
        modalNameInput.value = null;
        modalPasswordInput.value = null;
    }
}

modalSignInBtn.addEventListener(`click`, modalSignInOnclickCallback);

signInRemeberCheckBox.addEventListener(`change`, () => {
    if (signInRemeberCheckBox.checked) {
        setSignRemeberCheck(1);
    } else {
        setSignRemeberCheck(-1);
    }
});

signUpRemeberCheckBox.addEventListener(`change`, () => {
    if (signUpRemeberCheckBox.checked) {
        setSignRemeberCheck(1);
    } else {
        setSignRemeberCheck(-1);
    }
});