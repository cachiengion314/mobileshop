// cart section 
let cartIcon = document.getElementById(`content_title_bag`);
let modalCart = document.getElementById(`cart`);
let containerCartItems = document.getElementById(`container_cart_items`);

cartIcon.onclick = () => {
    if (getUserSignInIndex() != -1) {
        modalCart.style.display = `block`;
        closeNav();
        createCartItemList();
    } else {
        notificationPopUp(`Bạn phải đăng nhập để thực hiện tính năng này`, sadImageUrl);
    }
}

function setCurrentUserToUsersArray(currentUser) {
    let usersArray = getUsersArray();
    usersArray[getUserSignInIndex()] = currentUser;
    localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
}

function removeAProductOfCurrentUserProductChoicesAt(index) {
    let usersArray = getUsersArray();
    let currentUserProducts = usersArray[getUserSignInIndex()].product_choices;
    if (currentUserProducts.length > 0) {
        currentUserProducts.splice(index, 1);
    }
    usersArray[getUserSignInIndex()].product_choices = currentUserProducts;
    localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
}

function createCartItemList() {
    let usersArray = getUsersArray();
    let indexOfThisUser = getUserSignInIndex();
    let sumPrice = 0;
    containerCartItems.innerHTML = ``;
    for (let i = 0; i < usersArray[indexOfThisUser].product_choices.length; i++) {
        let price = usersArray[indexOfThisUser].product_choices[i].price_number;
        let productNumber = usersArray[indexOfThisUser].product_choices[i].product_number;
        containerCartItems.insertAdjacentHTML(`beforeend`, `
     <!-- one item start  -->
     <div class="slice_bar"></div>
     <div class="space"></div>
     <div class="modal_cart_block_item">
        <div class="item_products">
            <img src=${usersArray[indexOfThisUser].product_choices[i].product_imageUrl} alt="">
            <div class="product_name">${usersArray[indexOfThisUser].product_choices[i].product_name}</div>
        </div>
        <div class="item_price">
           ${price.toLocaleString(undefined, { minimumFractionDigits: 0 })} vnd
        </div>
        <div class="item_numbers">
            <input id="product_number_input_${i}" type="number" placeholder="${productNumber}"></input>
            <button id="${usersArray[indexOfThisUser].product_choices[i].product_name}_delete_button">Xóa</button>
        </div>
     </div>
     <div class="space"></div>
     <!-- one item end  -->
     `);
        let productNumberInput = document.getElementById(`product_number_input_${i}`);
        productNumberInput.value = productNumber;
        productNumberInput.addEventListener(`change`, () => {
            if (productNumberInput.value > 0) {
                usersArray[indexOfThisUser].product_choices[i].product_number = Number(productNumberInput.value);
                localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
                createCartItemList();
            } else {
                productNumberInput.value = 1;
                usersArray[indexOfThisUser].product_choices[i].product_number = Number(productNumberInput.value);
                localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
                createCartItemList();
            }
            showCurrentUserRedDotBag();
        });

        document.getElementById(`${usersArray[indexOfThisUser].product_choices[i].product_name}_delete_button`).onclick = () => {
            removeAProductOfCurrentUserProductChoicesAt(i);
            showCurrentUserRedDotBag();
            createCartItemList();
            console.log(`index of delete: `, i);
        }
        sumPrice += price * productNumber;
    }
    document.getElementById(`sum_price`).textContent = `${sumPrice.toLocaleString()} vnd`;
}

// pay section
let payTypesObj = {
    0: "Thanh toán bằng tiền mặt",
    1: "Thanh toán thông qua thẻ",
    2: "Thanh toán bằng điện thoại",
    3: "Thanh toán bằng chuyển tiền",
}
let typeSelect = document.getElementById(`type_select`);
let chosenProductsInfo = document.getElementById(`chosen_products_info`);
let cartPayBtn = document.getElementById(`cart_pay_button`);
let modalPay = document.getElementById(`pay`);
let modalPayTitle = document.getElementById(`modal_pay_title`);
let payPriceInfo = document.getElementById(`pay_price_info`);
let modalPayBtn = document.getElementById(`modal_pay_button`);
let addressInput = document.getElementById(`address_input`);
let telephoneInput = document.getElementById(`telephone_input`);

modalPayBtn.onclick = () => {
    modalCart.style.display = `none`;
    modalPay.style.display = `none`;

    let currentTime = new Date();
    let order = {
        user_name: getUsersArray()[getUserSignInIndex()].user_name,
        address: addressInput.value,
        payForm: typeSelect.value,
        telephone_number: telephoneInput.value,
        total_paid: createPayPriceInfo(),
        product_choices: createChosenProductsInfo(),
        date_order: `${currentTime.getDate()}-${currentTime.getMonth()}-${currentTime.getFullYear()}`,
    }
    let currentUser = getUsersArray()[getUserSignInIndex()];
    currentUser.product_choices.splice(0, currentUser.product_choices.length);
    currentUser.order_historys.push(order);
    setCurrentUserToUsersArray(currentUser);
    showCurrentUserRedDotBag();

    notificationPopUp(`Xin chờ giây lát! Đơn hàng đang được xử lý...`, sandClockImageUrl, true);
    setTimeout(() => {
        notificationPopUp(`Xin chúc mừng. Bạn đã đặt hàng thành công`, successImageUrl);
        console.log(getUsersArray());
    }, randomNumberFromAToB(2, 5) * 1000);
}

cartPayBtn.onclick = () => {
    if (getUsersArray()[getUserSignInIndex()].product_choices.length > 0) {
        modalPay.style.display = `block`;
        createPayTitle();
        createChosenProductsInfo();
        createPayPriceInfo()
        createPayTypeOptions();
    } else {
        notificationPopUp(`Bạn chưa đặt hàng sản phẩm nào`, questionImageUrl);
    }
}

function randomNumberFromAToB(a, b) {
    let randomRange = Math.floor(Math.random() * (b - a));
    return randomRange + a;
}

function createPayPriceInfo() {
    let productChoices = getUsersArray()[getUserSignInIndex()].product_choices;
    let sumPrice = 0;
    for (let i = 0; i < productChoices.length; i++) {
        sumPrice += productChoices[i].price_number * productChoices[i].product_number;
    }
    payPriceInfo.textContent = `${sumPrice.toLocaleString()} vnd`;
    return sumPrice;
}

function createPayTitle() {
    modalPayTitle.textContent = `Thông tin đơn hàng của bạn ${getUsersArray()[getUserSignInIndex()].user_name}`;
}

function createChosenProductsInfo() {
    let productChoices = getUsersArray()[getUserSignInIndex()].product_choices;
    let str = ``;
    for (let i = 0; i < productChoices.length; i++) {
        if (i == productChoices.length - 1) {
            let tempStr1 = `x ${productChoices[i].product_number}`;
            str += `${productChoices[i].product_name} ` + tempStr1;
        } else {
            let tempStr2 = `x ${productChoices[i].product_number}, `;
            str += `${productChoices[i].product_name} ` + tempStr2;
        }
    }
    chosenProductsInfo.textContent = str;
    return str;
}

function createPayTypeOptions() {
    if (typeSelect.options.length > 0) {
        for (let i = 0; i < typeSelect.options.length; i++) {
            typeSelect.options[i] = new Option(payTypesObj[i], payTypesObj[i]);
        }
    } else {
        for (let item in payTypesObj) {
            typeSelect.options[typeSelect.options.length] = new Option(payTypesObj[item], payTypesObj[item]);
        }
    }
}

// Add to cart section
let modalAddToCartSuccess = document.getElementById(`add_to_cart_success`);
let modalImg = document.getElementById(`modal_add_success_bagImg`);
let modalH1Txt = document.getElementById(`modal_add_success_title`);
let bagRedDot = document.getElementById(`bag_red_dot`);

function getUsersArray() {
    let rawData = localStorage.getItem(keyUsersLocalStorage);
    let usersArr = JSON.parse(rawData);
    return usersArr;
}

function removeUserInUsersArrayAt(index) {
    let usersArray = getUsersArray();
    usersArray.splice(index, 1);
    localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
}

function pushItemInProductChoicesCurrentUser(item) {
    let usersArray = getUsersArray();
    if (getUserSignInIndex() > -1) {
        usersArray[getUserSignInIndex()].product_choices.push(item);
    }
    localStorage.setItem(keyUsersLocalStorage, JSON.stringify(usersArray));
}

function showCurrentUserRedDotBag() {
    if (getUserSignInIndex() == -1 || getUsersArray()[getUserSignInIndex()].product_choices == undefined || getUsersArray()[getUserSignInIndex()].product_choices.length == 0) {
        bagRedDot.style.display = `none`;
        return;
    }
    bagRedDot.style.display = `block`;
    let sumAllProducts = 0;
    for (let i = 0; i < getUsersArray()[getUserSignInIndex()].product_choices.length; i++) {
        sumAllProducts += getUsersArray()[getUserSignInIndex()].product_choices[i].product_number;
    }
    bagRedDot.textContent = sumAllProducts;
}

// create and search product list section
let searchInput = document.getElementById(`search_input`);
let searchBtn = document.getElementById(`search_button`);
let searchList = document.getElementById(`search_product_list`);
let allSubnavBtn = document.getElementsByClassName(`subnavbtn`);
let rootBrandSection = document.getElementById(`root_brand_section`);

allSubnavBtn[0].onclick = () => {
    clearAllSection();
    createAllSection();
}
allSubnavBtn[1].onclick = () => {
    clearAllSection();
    createProductList(searchAllProducstByBrand(`apple`), createSection(`Tất cả điện thoại của apple`));
}
allSubnavBtn[2].onclick = () => {
    clearAllSection();
    createProductList(searchAllProducstByBrand(`samsung`), createSection(`Tất cả điện thoại của samsung`));
}
allSubnavBtn[3].onclick = () => {
    clearAllSection();
    createProductList(searchAllProducstByBrand(`xiaomi`), createSection(`Tất cả điện thoại của xiaomi`));
}

searchInput.addEventListener(`change`, () => {
    clearAllSection();
    if (searchAllProducstByName(searchInput.value).length > 0) {
        createProductList(searchAllProducstByName(searchInput.value), createSection(`Tất cả các sản phẩm bạn muốn tìm có ký tự: ${searchInput.value}`));
    } else {
        createSection(`Tất cả các sản phẩm bạn muốn tìm có ký tự: ${searchInput.value}`);
        createSection(`Không có sản phẩm nào tìm được`);
    }
    searchInput.value = ``;
});

function filterAnArray(callback, array) {
    let filterArray = [];
    for (let i = 0; i < array.length; i++) {
        if (callback(array[i])) {
            filterArray.push(array[i]);
        }
    }
    return filterArray;
}

function isStringInString(keyString, originString) {
    keyString = keyString.toLocaleLowerCase(`tr`);
    originString = originString.toLocaleLowerCase(`tr`);
    for (let i = 0; i < originString.length; i++) {
        let indexKeyString = 0;
        let indexOriginString = i;
        while (indexKeyString < keyString.length && keyString[indexKeyString] == originString[indexOriginString]) {
            indexKeyString++;
            indexOriginString++;
        }
        if (indexKeyString == keyString.length) {
            return true;
        }
    }
    return false;
}

function notificationPopUp(notifyText, imageUrl, isNeedToDisabled = false) {
    document.getElementById(`add_to_cart_success`).style.display = `block`;
    document.getElementById(`modal_add_success_title`).textContent = notifyText;
    document.getElementById(`modal_add_success_bagImg`).src = imageUrl;
    if (isNeedToDisabled) {
        document.getElementById(`modal_ok_button`).style.display = `none`;
    } else {
        document.getElementById(`modal_ok_button`).style.display = `block`;
    }
    document.getElementById(`modal_ok_button`).disabled = isNeedToDisabled;
}

function clearAllSection() {
    rootBrandSection.innerHTML = ``;
}

function createAllSection() {
    createProductList(searchAllProducstByBrand(`apple`), createSection(`Tất cả điện thoại apple`));
    createProductList(searchAllProducstByBrand(`samsung`), createSection(`Tất cả điện thoại samsung`));
    createProductList(searchAllProducstByBrand(`xiaomi`), createSection(`Tất cả điện thoại xiaomi`));
}

function searchAllProducstByBrand(brandName) {
    let searchArray = filterAnArray((item) => {
        return isStringInString(brandName, item.brand);
    }, mobilesData);
    return searchArray;
}

function searchAllProducstByName(nameProduct) {
    let searchArray = filterAnArray((item) => {
        return isStringInString(nameProduct, item.name);
    }, mobilesData);
    return searchArray;
}

function createSection(brandName) {
    rootBrandSection.insertAdjacentHTML(`beforeend`, `
        <!-- brand start  -->
        <div class="brand_section">
            <p class="brand_name">${brandName}</p>
            <!-- main product layout start  -->
            <ul id="${brandName}_product_list" class="home_product_items">
    
            </ul>
            <!-- main product layout end  -->
        </div>
        <!-- brand end  -->
        `);
    return document.getElementById(`${brandName}_product_list`);
}

function createProductList(mobiles, UlHtmlElement) {
    for (let i = 0; i < mobiles.length; i++) {
        UlHtmlElement.insertAdjacentHTML(`beforeend`, `
            <!-- item feature start  -->
            <li class="home_product_items_feature">
                <!-- left side start -->
                <div class="home_product_items_feature_left">
                    <img src=${mobiles[i].imageUrl} alt="">
                    <div class="home_product_items_name">${mobiles[i].name}</div>
                    <!-- button and a link tag pair start -->
                    <div class="home_product_items_add">
                        <button id="${mobiles[i].name}_add_to_cart_btn" class="add_to_cart_btn">Thêm vào giỏ hàng</button>
                    </div>
                    <div class="home_product_items_detail">
                        <a href="">Chi tiết sản phẩm</a>
                    </div>
                    <!-- button and a link tag pair end -->
                </div>
                <!-- left side end -->
                <!-- right side start  -->
                <div>
                    <h4 class="product_info_title">Khuyến mãi</h4>
                    <ul id="${mobiles[i].name}_promotions_list" class="home_product_items_feature_right_list">
                  

                    </ul>
                    <h2 class="product_price_text">${mobiles[i].price}</h2>
                </div>
                <!-- right side end  -->
            </li>
            <!-- item feature end  -->
        `);

        for (let ii = 0; ii < mobiles[i].promotions.length; ii++) {
            document.getElementById(`${mobiles[i].name}_promotions_list`).insertAdjacentHTML(`beforeend`, `
            <li>${mobiles[i].promotions[ii]}</li>
            `);
        }

        document.getElementById(`${mobiles[i].name}_add_to_cart_btn`).addEventListener(`click`, () => {
            if (getUserSignInIndex() != -1) {
                let dublicatedProduct = false;
                for (let ii = 0; ii < getUsersArray()[getUserSignInIndex()].product_choices.length; ii++) {
                    let savedProductName = getUsersArray()[getUserSignInIndex()].product_choices[ii].product_name;
                    if (savedProductName == undefined) continue;
                    if (compareStringIgnoreCase(savedProductName, mobiles[i].name)) {
                        dublicatedProduct = true;
                    }
                }
                if (!dublicatedProduct) {
                    let item = {
                        product_name: mobiles[i].name,
                        brand: mobiles[i].brand,
                        price_number: mobiles[i].price_number,
                        product_imageUrl: mobiles[i].imageUrl,
                        product_number: 1,
                    };
                    if (getUsersArray()[getUserSignInIndex()].product_choices.length > 5) {
                        notificationPopUp(`Rất tiếc! Giỏ hàng đã quá nhiều mặt hàng`, sadImageUrl);
                    } else {
                        pushItemInProductChoicesCurrentUser(item);
                        notificationPopUp(`Đã thêm thành công vào giỏ hàng`, successImageUrl);
                    }
                } else {
                    notificationPopUp(`Bạn đã thêm sản phẩm này rồi`, questionImageUrl);
                }
                showCurrentUserRedDotBag();
            } else {
                notificationPopUp(`Bạn phải đăng nhập để thực hiện tính năng này`, sadImageUrl);
            }
        });
    }
}