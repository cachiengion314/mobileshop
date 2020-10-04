// user modal
let userModal = document.getElementById(`modal_user`);
let sideIcon = document.getElementById(`side_icon_img`);
let userBlockInfo = document.getElementById(`modal_user_block_info`);

function loadUserStatus() {
    let users = getUsersArray();
    userModal.style.display = `block`;
    userBlockInfo.innerHTML = ``;
    for (let i = 0; i < users.length; i++) {
        userBlockInfo.insertAdjacentHTML(`beforeend`, `
        <!-- one user start  -->
        <div class="slice_bar"></div>
        <div class="space"></div>
        <div class="modal_user_block">
            <div class="user">
                <img id="modal_user_bagImg" src=${avatar2ImageUrl} alt="">
                <div class="user_name">${users[i].user_name}</div>
            </div>
            <div class="user_password">${users[i].password}</div>
            <div id="products_choices_${i}" class="products_choices">
               
            </div>
            <div class="option_button">
                <button id="history_button_${i}" class="history_button">Xem</button>
                <button id="delete_button_${i}" class="delete_button">Xoá</button>
            </div>
        </div>
        <div class="space"></div>
        <!-- one user end  -->
        `);
        if (users[i].product_choices.length > 0) {
            for (let ii = 0; ii < users[i].product_choices.length; ii++) {
                document.getElementById(`products_choices_${i}`).insertAdjacentHTML(`beforeend`, `
                ${users[i].product_choices[ii].product_name},
            `);
            }
        } else {
            document.getElementById(`products_choices_${i}`).insertAdjacentHTML(`beforeend`, `
              Chưa chọn sản phẩm nào
            `);
        }
        document.getElementById(`delete_button_${i}`).onclick = () => {
            if (i != 0) {
                removeUserInUsersArrayAt(i);
                loadUserStatus();
            } else {
                notificationPopUp(`Bạn không có quyền xoá admin`, sadImageUrl);
            }
        }
        document.getElementById(`history_button_${i}`).onclick = () => {
            loadOrderHistory(i);
        }
    }
}

function openUserModal() {
    if (getUserSignInIndex() == 0) {
        loadUserStatus();
    } else {
        notificationPopUp(`Bạn cần có quyền admin`, sadImageUrl);
    }

}
sideIcon.onclick = openUserModal;

// order history section

function loadOrderHistory(indexOfUser) {
    document.getElementById(`modal_order_history`).style.display = `block`;
    let thisOrderHistorys = getUsersArray()[indexOfUser].order_historys;
    document.getElementById(`modal_order_block_root`).innerHTML = ``;
    let index = 0;
    if (thisOrderHistorys.length > 5) {
        index = thisOrderHistorys.length - 5;
    }
    for (let i = index; i < thisOrderHistorys.length; i++) {
        document.getElementById(`modal_order_block_root`).insertAdjacentHTML(`beforeend`, `
        <!-- one order start -->
        <div class="slice_bar"></div>
        <div class="space"></div>
        <div id="modal_order_block_info" class="modal_order_block_info">
            <div class="id_number font_size_15">${i}</div>
            <div class="account_name font_size_15">${thisOrderHistorys[i].user_name}</div>
            <div class="address font_size_15">${thisOrderHistorys[i].address}</div>
            <div class="pay_form font_size_15">${thisOrderHistorys[i].payForm}</div>
            <div class="telephone font_size_15">${thisOrderHistorys[i].telephone_number}</div>
            <div class="total_paid font_size_15">${(thisOrderHistorys[i].total_paid/1000).toLocaleString()}, 000 vnd</div>
            <div class="product_choices font_size_15">${thisOrderHistorys[i].product_choices}</div>
            <div class="order_date font_size_15">${thisOrderHistorys[i].date_order}</div>
        </div>
    <!-- one order end -->
    `);
    }
}

document.getElementById(`history_btn`).onclick = () => {
    loadOrderHistory(getUserSignInIndex());
}