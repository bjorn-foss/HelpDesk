const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main');

document.getElementById('visibility_button').onclick = function () {
    if(document.getElementById('opened').value == true){  //is closing
        document.getElementById('visibility_button').innerText = '<'
        document.getElementById('opened').value = false;
    }
    else{  //is opening
        document.getElementById('visibility_button').innerText = '>';
        document.getElementById('opened').value = true;
    }
    sidebar.classList.toggle('sidebar_small');
    mainContent.classList.toggle('main-content_large')
}

