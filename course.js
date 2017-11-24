var sprogram;

function dropdown(el) {
    document.getElementById("dropdown_"+el).classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function getData(){
    let y,sp;
    if ($('#year').val()){
        y=$('#year').val();
    } else {
        y=2018;
    }
    if($('#sprogram').val()){
        sprogram=$('#sprogram').val();
    } else {
        sprogram='ALL';
    }
  
    alert(y + " " + sp);
  
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+y+'&sprogram='+sprogram
        }) 
        .done(function (data) { render(data, "c"); })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}
function updateStatus(param,newstatus){
    if ($('#year').val()){
        year=$('#year').val();
    } else {
        year=2018;
    }
    if($('#sign').val()){
        sign=$('#sign').val();
    } else {
        sign='BROM';
    }    

    let teid=param;
    let hours=$("#teid_"+param).val();

    $("#teid_"+param).removeClass("confirmed unconfirmed mustchange error");
    $("#teid_"+param).addClass(newstatus);
    let status=newstatus;
    if (status==0){        
        $("#teid_"+param.id).addClass("confirmed")
    } else if(status==1){        
        $("#teid_"+param.id).addClass("unconfirmed")
    } else if (status==2){        
        $("#teid_"+param.id).addClass("mustchange")
    } else {
        $("#teid_"+param.id).addClass("error");
    }
    
    //alert(teid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATE&teid='+teid+'&hours='+hours+'&status='+status
        }) 
        .done(function(data) { render(data, "c"); })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}

function render(tbldata, tblID){
  let json = JSON.parse(tbldata);
  let tbl = json.tbldata;
  
  alert(tblID);
  var str="";
  str+="<table style='border-collapse: collapse;'>";
  str+= "<caption>Teaching allocation for WEBUG courses in year </caption>";
  str+= "<thead>";    
  str+= "<tr>";
  for(let col in tbl.tblhead){
      str+= "<th><span style='padding:0 10px 0 10px;'>"+tbl.tblhead[col]+"</span></th>";
  }
  str+= "</tr>";
  str+= "</thead>";
  str+= "<tbody>";    
  for(let row in tbl.tblbody){
      str+="<tr>";
      for(let col in tbl.tblbody[row]){
          if (tbl.tblbody[row][col]!="UNK"){
              str+="<td>"+tbl.tblbody[row][col]+"</td>";
          } else {
              str+="<td> </td>";
          }
      }
      str+="</tr>";
  }
  str+= "</tbody>";    
  str+= "<tfoot style='border-top:2px solid #000'>";
  str+= "<tr style='font-style:italic;'>";
  for(let col in tbl.tblfoot){
      if (tbl.tblfoot[col]!="UNK"){
          str+="<td>"+tbl.tblfoot[col]+"</td>";
      } else {
          str+="<td> </td>";
      }
  }
  str+="</tr>";      
  str+= "</tfoot></table>";    
  str+= "</table>";
  document.getElementById(tblID).innerHTML=str;
  /*
  $('.timecell').keydown(function (e){
    if(e.keyCode == 13){
        updateTeaching(this);
    }
  });
  $('.timecell').keydown(function (e){
      if(e.keyCode == 27){
          getData();
      }
  });
  $('.newtimecell').keydown(function (e){
    if(e.keyCode == 13){
        var tmp=this.id.split("_");        
        insertTeaching(this,tmp[1],tmp[2]);
    }
  });
  $('.newtimecell').keydown(function (e){
      if(e.keyCode == 27){
          getData();
      }
  });
*/
}

function updateTeaching(param){
  alert("snus");
    let hours=param.value;

    if ($('#year').val()){
        year=$('#year').val();
    } else {
        year=2018;
    }
    if($('#sign').val()){
        sign=$('#sign').val();
    } else {
        sign='BROM';
    }

/*
    let teid=param.id.replace("teid_", "");
    if(teid.indexOf("new")){
        teid=null;
    }
*/
      
    
    let status=0;
    if ($(param).hasClass("confirmed")){
        status=0;
    } else if($(param).hasClass("unconfirmed")) {
        status=1;
    } else if ($(param).hasClass("mustchange")){
        status=2;
    } else {
        status=3;
    }
    
    //alert(teid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATE&teid='+teid+'&hours='+hours+'&status='+status,
            dataType: 'json'
        }) 
        .done(render(data, "c"))
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}

function insertTeaching(param,ciid,tid){
    if ($('#year').val()){
        year=$('#year').val();
    } else {
        year=2018;
    }
    if($('#sign').val()){
        sign=$('#sign').val();
    } else {
        sign='BROM';
    }

    let teid=param.id.replace("teid_", "");
    if(teid.indexOf("new")){
        teid=null;
    }
    let hours=$("#"+param.id).val();
    let status=0;
    /*
    if ($("#"+param.id).hasClass("confirmed")){
        status=0;
    } else if($("#"+param.id).hasClass("unconfirmed")) {
        status=1;
    } else if ($("#"+param.id).hasClass("mustchange")){
        status=2;
    } else {
        status=3;
    }
    */
    //alert(teid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATE&hours='+hours+'&status='+status+'&ciid='+ciid+'&tid='+tid
        }) 
        .done(function(data) {
          //alert( "success"+data );
          var json = JSON.parse(data);
          render(json);
        })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}
