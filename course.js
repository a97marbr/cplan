var sprogram;
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
        sprogram='WEBUG';
    }
  
    //alert(y + " " + sp);
  
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+y+'&sprogram='+sprogram
        }) 
        .done(function(data) {
          //alert( "success"+data );
          var json = JSON.parse(data);
          /*
          for(let sign in json.teachers){
              alert(sign + " " + json.teachers[sign].name + " : " + json.teachers[sign].total);
          }
          for(let cinstance in json.courses){
              alert(cinstance + json.courses[cinstance].cname);
          }
          */
          var str="";
          str+="<table style='border-collapse: collapse;'>";
          str+= "<caption>Teaching allocation for WEBUG courses in year </caption>";
          str+= "<thead>";    
          str+= "<tr><th>Kurskod</th><th>Kursnamn</th><th>typ</th><th>poäng</th><th>start</th><th>stop</th><th>studenter</th>";
          for(let sign in json.teachers){
              str+= "<th><span style='padding:0 10px 0 10px;'>"+json.teachers[sign].name+"</span></th>";
          }
          str+= "</tr>";
          str+= "<tr>";
          str+= "<th colspan='7'></th>";
          for(let sign in json.teachers){
              str+= "<th>"+sign+"</th>";
          }    
          str+= "</tr>";    
          str+= "</thead>";
          str+= "<tbody>";    
          let period="";          
          let study_program="";
          let num_teachers = Object.keys(json.teachers).length;
          for(let cinstance in json.courses){
              let course=json.courses[cinstance];              
              if(sprogram !="ALL" && study_program!=course.study_program){
                  str+= "<tr><th colspan='"+(7+num_teachers)+"' style='text-align:left'>"+course.study_program+"</th></tr>";
                  study_program=course.study_program;
              }
              if(period != cinstance['start_period']){
                  str+= "<tr style='border-top:2px solid #000;'>";              
                  period=cinstance['start_period'];
              } else {
                  str+= "<tr>";              
              }
              str+="<td>"+course.ccode+"</td><td>"+course.cname+"</td><td>"+course.class+"</td><td>"+course.credits+"</td><td>"+course.start_period+"</td><td>"+course.end_period+"</td><td style='text-align:center;'>"+course.students+"</td>";
              for(let teacher in course.teachers){
                  if (course.teachers[teacher].hours){
                      str+= "<td style='text-align:center'>"+course.teachers[teacher].hours+"</td>";
                  } else {
                      str+= "<td style='text-align:center'></td>";
                  }
                  
              }
              str+= "</tr>";
          }
          str+= "</tbody>";    
          str+= "<tfoot style='border-top:2px solid #000'>";
          str+= "<tr style='font-style:italic;'>";
          str+= "<td colspan='7' style='text-align:right;'>Total teaching hours</td>";
          for(let teacher in json.teachers){
              if (json.teachers[teacher].total){
                  str+= "<td style='text-align:center'>"+json.teachers[teacher].total+"</td>";
              } else {
                  str+= "<td style='text-align:center'></td>";
              }
              
          }          
          str+= "</tr>";
          str+= "</tfoot></table>";    
          str+= "</table>";
          document.getElementById('c').innerHTML=str;
        })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}
