function processReply(data) {
    var json = JSON.parse(data);

    if (json.login === 1) {
        window.location = "course.php";
    } else {
        alert("Wrong password");
    }
}

function logout() {
    $.ajax({
        type: 'POST',
        url: 'login_service.php',
        data: 'op=logout'
    })
        .done(function (){
            location.reload();
        })
        .fail(function () {
            alert("error!!");
        })
        .always(function () {

        });
}