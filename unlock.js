function unlock(){
    let pwd=$("#pwd").val();
    var jqxhr = $.ajax({
        type: 'POST',
        url: 'unlock_service.php',
        data: 'pwd='+pwd
    }) 
    .done(function(data) {
      alert( "success");
    })
    .fail(function() {
      alert( "error" );
    })
    .always(function() {
      //alert( "complete" );
    });    

}
