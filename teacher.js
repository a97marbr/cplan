var sign="UNK";
var year;

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

function render (json){
    var select = "<select size='1' name='sign' id=sign>";
    if (sign=="UNK"){
      select+="<option hidden disabled selected value>Select Teacher</option>";      
    }
    for(let i in json.teachers){
        select+="<option value='"+json.teachers[i].sign+"'";
        if(sign==json.teachers[i].sign){
            select+=" selected ";
        }
        select+=">";
        select+=json.teachers[i].fname+" "+json.teachers[i].lname+" - ("+json.teachers[i].sign+")";
        select+="</option>";
  //              alert(sign + " " + json.teachers[sign].name + " : " + json.teachers[sign].total);
    }
        
        
    select+="</select>";
    document.getElementById("sign").innerHTML=select;
    var tbl="";
    if (Object.keys(json.courses).length>0) {
        tbl+="<table style='border-collapse: collapse;' id='c'>";
        tbl+="<caption>Teaching allocation for "+json.courses[0]['fname']+" "+ json.courses[0]['lname']+" ("+json.courses[0]['sign']+") during year "+year+"</caption>";
        tbl+="<thead>";
        tbl+="<tr><th>Kurskod</th><th>Kursnamn</th><th>start</th><th>slut</th><th>timmar</th></tr>";
        tbl+="</thead>";
        tbl+="<tbody>";
        let period="";              
        for(let cinstance in json.courses){
  //              alert(cinstance + json.courses[cinstance].cname);
            if(period != json.courses[cinstance].start_period){
                tbl+="<tr style='border-top:2px solid #000;'>";              
                period=json.courses[cinstance].start_period;
            } else {
                tbl+="<tr>";              
            }              
            tbl+="<td>"+json.courses[cinstance].ccode+"</td><td>"+json.courses[cinstance].cname+"</td><td>"+json.courses[cinstance].start_period+"</td><td>"+json.courses[cinstance].end_period+"</td>";
            let status;
            if (json.courses[cinstance].status==0){
                status="confirmed";
            } else if (json.courses[cinstance].status==1){
                status="unconfirmed";
            } else if (json.courses[cinstance].status==2){
                status="mustchange";
            }else {
                status="error";
            }
            tbl+="<td><input maxlength='5' size='5' class='timecell "+status+"' id='teid_"+json.courses[cinstance].teid+"' value='"+json.courses[cinstance].hours+"'>";
            tbl+="<div class='dropdown'>";
            tbl+="<div onclick='dropdown("+json.courses[cinstance].teid+")' class='dropbtn'>*</div>";
            tbl+="<div id='dropdown_"+json.courses[cinstance].teid+"' class='dropdown-content'>";
            tbl+="<div class='confirmed' onclick='updateStatus("+json.courses[cinstance].teid+",0)'>Confirmed</div>";
            tbl+="<div class='unconfirmed' onclick='updateStatus("+json.courses[cinstance].teid+",1)'>Unconfirmed</div>";
            tbl+="<div class='mustchange' onclick='updateStatus("+json.courses[cinstance].teid+",2)'>Must change</div>";
            tbl+="<div class='error' onclick='updateStatus("+json.courses[cinstance].teid+",3)'>Error</div>";
            tbl+="</div>";
            tbl+="</div>";
            tbl+="</td></tr>";
            tbl+="</tr>";
        }

        tbl+="</tbody>";
        tbl+="<tfoot style='border-top:2px solid #000'>";
        for(let p in json.totals){
            tbl+="<tr style='font-style:italic;'>";
            tbl+="<td colspan='4' style='text-align:right;'>Total teaching hours in "+p+"</td><td>"+json.totals[p]+"</td>";
            tbl+="</tr>";
        }
        
        tbl+="</tfoot></table>";              
    } else {
        tbl+="<em id='c'>No teaching registered for "+sign+" in budget year "+year+"</em>";
    }
    document.getElementById("c").outerHTML=tbl;
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
}

function getData(){
    let year="";
    if ($('#year').val()){
        year=$('#year').val();
    }

    let sign=""
    if($('#sign').val()){
        sign=$('#sign').val();
    }
    let op=""
    let params={
        year:year,
        sign:sign
    }
  
    //alert(year + " " + sign);
  
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'teacher_service.php',
            data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
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

function updateTeaching(param){
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

    let teid=param.id.replace("teid_", "");;
    let hours=$("#"+param.id).val();
    let status=0;
    if ($("#"+param.id).hasClass("confirmed")){
        status=0;
    } else if($("#"+param.id).hasClass("unconfirmed")) {
        status=1;
    } else if ($("#"+param.id).hasClass("mustchange")){
        status=2;
    } else {
        status=3;
    }
    
    //alert(teid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'teacher_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATE&teid='+teid+'&hours='+hours+'&status='+status
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
            url: 'teacher_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATE&teid='+teid+'&hours='+hours+'&status='+status
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
