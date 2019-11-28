function processReply(data)
{
    var json = JSON.parse(data);

    if(json.login===1){
        window.location="course.php";
    }else{
        alert("Wrong password");
    }
}
