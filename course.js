var sprogram;
var myTable;

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
  
    //alert(y + " " + sp);
  
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+y+'&sprogram='+sprogram
        }) 
        .done(function(data) {
          //alert( "success"+data );
          var json = JSON.parse(data);
          //render(json);
          myTable = new sortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+y,
              function(celldata, col){return renderCell(celldata,col)},
              function(col, status){return renderSortOptions(col,status)},
              function(col, status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              function(colno,status){ return compare(colno,status)}
          );
          myTable.renderTable();
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
            url: 'course_service.php',
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

function render(json){
  /*
  for(let sign in json.teachers){
      alert(sign + " " + json.teachers[sign].name + " : " + json.teachers[sign].total);
  }
  for(let cinstance in json.courses){
      alert(cinstance + json.courses[cinstance].cname);
  }
  */
  
  var tuples = [];

//          for (var key in json.courses) tuples.push([key, json.courses[key]]);
  let j=0;
  for (var key in json.courses) tuples[j++]=json.courses[key];

  tuples.sort(function(a, b) {
      a = a['study_program'];
      b = b['study_program'];
      return a < b ? -1 : (a > b ? 1 : 0);
  });
  /*
  tuples.sort(function(a, b) {
      a = a['start_period'];
      b = b['start_period'];
      return a < b ? -1 : (a > b ? 1 : 0);
  });

  tuples.sort(function(a, b) {
      a = a['cname'];
      b = b['cname'];
      return a < b ? -1 : (a > b ? 1 : 0);
  });
*/
  for (var i = 0; i < tuples.length; i++) {
    //  alert(tuples[i].cname);
  }

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
      str+="<td>"+course.ccode+"</td><td><div style='max-width:250px;' class='ellipsis'>"+course.cname+"</div></td><td>"+course.class+"</td><td>"+course.credits+"</td><td>"+course.start_period+"</td><td>"+course.end_period+"</td><td style='text-align:center;'>"+course.students+"</td>";
      for(let teacher in course.teachers){
          let cellid=null;
          if(course.teachers[teacher].teid){
              cellid=course.teachers[teacher].teid;
          } else {
              cellid="new_"+cinstance+"_"+course.teachers[teacher].tid;
          }
          if (course.teachers[teacher].hours){
              let status;
              if (course.teachers[teacher].status==0){
                  status="confirmed";
              } else if (course.teachers[teacher].status==1){
                  status="unconfirmed";
              } else if (course.teachers[teacher].status==2){
                  status="mustchange";
              }else {
                  status="error";
              }

              //str+="<td class='"+status+"' ";
              //str+="style='text-align:center'><input type='text' "+course.teachers[teacher].hours+"</td>";
              str+="<td style='text-align:center'><div style='min-width:100px;'><input maxlength='5' size='5' class='timecell "+status+"' id='teid_"+cellid+"' value='"+course.teachers[teacher].hours+"'>";
              /*
              str+="<div class='dropdown'>";
              str+="<div onclick='dropdown("+json.courses[cinstance].teid+")' class='dropbtn'>*</div>";
              str+="<div id='dropdown_"+json.courses[cinstance].teid+"' class='dropdown-content'>";
              str+="<div class='confirmed' onclick='updateStatus("+json.courses[cinstance].teid+",0)'>Confirmed</div>";
              str+="<div class='unconfirmed' onclick='updateStatus("+json.courses[cinstance].teid+",1)'>Unconfirmed</div>";
              str+="<div class='mustchange' onclick='updateStatus("+json.courses[cinstance].teid+",2)'>Must change</div>";
              str+="<div class='error' onclick='updateStatus("+json.courses[cinstance].teid+",3)'>Error</div>";
              str+="</div>";
              str+="</div>";
              str+="</td>";
              */
          } else {
              str+= "<td style='text-align:center'><div style='min-width:100px;'><input maxlength='5' size='5' class='newtimecell' id='"+cellid+"'>";
          }
          str+="<div class='dropdown'>";
          str+="<div onclick='dropdown("+cellid+")' class='dropbtn'>*</div>";
          str+="<div id='dropdown_"+cellid+"' class='dropdown-content'>";
          str+="<div class='confirmed' onclick='updateStatus("+cellid+",0)'>Confirmed</div>";
          str+="<div class='unconfirmed' onclick='updateStatus("+cellid+",1)'>Unconfirmed</div>";
          str+="<div class='mustchange' onclick='updateStatus("+cellid+",2)'>Must change</div>";
          str+="<div class='error' onclick='updateStatus("+cellid+",3)'>Error</div>";
          str+="</div>";
          str+="</div>";
          str+="</div>";
          str+="</td>";                  
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

    let teid=param.id.replace("teid_", "");
    if(teid.indexOf("new")){
        teid=null;
    }
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
            url: 'course_service.php',
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
          myTable = new sortableTable(json,"c","columnFilter","Teaching allocation for WEBUG courses in year"+year,
              function(celldata, col){return renderCell(celldata,col)},
              function(col, status){return renderSortOptions(col,status)},
              function(col, status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              function(colno,status){ return compare(colno,status)}
          );
          myTable.renderTable();

        })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
          //alert( "complete" );
        });    
}

//------------==========########### FUNCTIONZ ###########==========------------

//--------------------------------------------------------------------------
// renderColumnFilter
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------
		
function renderColumnFilter(col,status){
		
    if(status){
				str="<span style='margin: 0 15px'><label>"+col+"</label>:<input type='checkbox' checked onclick='myTable.toggleColumn(\""+col+"\")'><span>";
		}else{
				str="<span style='margin: 0 15px'><label>"+col+"</label>:<input type='checkbox' onclick='myTable.toggleColumn(\""+col+"\")'></span>";
		}
		return str;
}

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------
		
function renderSortOptions(col,status){
		str="";
		
		if(status==-1){

				if(col=="CCode" || col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram" || col=="Comment"){
            str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</span>";
        }else{
            let sign=col.substring(col.lastIndexOf(" "),col.length);
            let fname=col.substring(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));
            str+="<div style='display:inline-block;margin:0 15px;'>";
            str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+fname+" "+lname+"</span> ";				
            str+="</div><div>";
            str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+sign+"</span>";				
            str+="</div>";
				}
		}else{
        if(col=="Course Code" || col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram"){
            if(status){
                str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+col+"&#x25b4;</span>";
            }else{
                str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"&#x25be;</span>";
            }
        }else{
            let sign=col.substr(col.lastIndexOf(" "),col.length);
            let fname=col.substr(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));         
            if(status==0){
              str+="<div style='display:inline-block;margin:0 15px;'>";
              str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+fname+" "+lname+" &#x25b4;</span> ";				
              str+="</div><div>";
              str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+sign+"</span>";				
              str+="</div>";
            }else{
              str+="<div style='display:inline-block;margin:0 15px;'>";
              str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+fname+" "+lname+" &#x25be;</span> ";				
              str+="</div><div>";
              str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+sign+"</span>";				
              str+="</div>";
            }
        }      
		}

		return str;
}

//--------------------------------------------------------------------------
// renderCell
// ---------------
//  Callback function that renders a specific cell in the table
//--------------------------------------------------------------------------
		
function renderCell(celldata,col){
    let t="";
    if(col=="CCode"){
        t="<span style='font-family:monospace'>"+celldata+"</span>";
    } else if (col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End") {
        t=celldata;      
    } else if (col=="Students") {
        t="<span style='text-align:right'>"+celldata+"</span>";
    } else if (col=="SProgram") {
        if (celldata==="UNK"){
            t="<span> </span>";
        } else {
            t=celldata;        
        }      
    } else if (col=="Comment") {
        if (celldata==="UNK"){
            t="<span style='border-left:1px solid #000'> </span>";
        } else {
            t="<span style='border-left:1px solid #000'>"+celldata+"</span>";        
        }      
    } else {
        if (celldata.hours==="UNK"){
            t="<span> </span>";
        } else {
            let sclass="";
            if (celldata.status==0){
                sclass="confirmed";
            } else if (celldata.status==1){
                sclass="unconfirmed";
            } else if (celldata.status==2){
                sclass="mustchange";
            }else {
                sclass="error";
            }
            t="<div style='text-align:center' class='"+sclass+"'>"+celldata.hours+"</div>";
        }        
    }
		return t;
}

//--------------------------------------------------------------------------
// rowFilter
// ---------------
//  Callback function that filters rows in the table
//--------------------------------------------------------------------------
		
function rowFilter(row){
		return true;
}

//--------------------------------------------------------------------------
// compare
// ---------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------
function compare(colno,status){
    if (colno>7){
        // Sort on hours
        if(status==0){          
            return function(a,b){
                var left = (isNaN(a[colno].hours)) ? 0 : parseInt(a[colno].hours);
                var right = (isNaN(b[colno].hours)) ? 0 : parseInt(b[colno].hours);
                
                if (left < right)
                    return -1;
                if (left > right) 
                    return 1;
                return 0;
            }    
        } else {
            return function(a,b){
                var left = (isNaN(a[colno].hours)) ? 0 : parseInt(a[colno].hours);
                var right = (isNaN(b[colno].hours)) ? 0 : parseInt(b[colno].hours);
                
                if (left < right)
                    return 1;
                if (left > right) 
                    return -1;
                return 0;
            }    
        }      
    } else {
        // Sorts as number if numeric and as string otherwise
        if(status==0){
            return function (a, b) {
                function isNumeric(num){
                    return !isNaN(num)
                }

                // convert string to numbers if necessary:
                // http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
                var left = (isNumeric(a[colno])) ? +a[colno] : a[colno];
                var right = (isNumeric(b[colno])) ? +b[colno] : b[colno];

                if (left < right)
                    return -1;
                if (left > right) 
                    return 1;
                return 0;
            }                    
        } else {
          return function (a, b) {
              function isNumeric(num){
                  return !isNaN(num)
              }

              // convert string to numbers if necessary:
              // http://stackoverflow.com/questions/175739/is-there-a-built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
              var left = (isNumeric(a[colno])) ? +a[colno] : a[colno];
              var right = (isNumeric(b[colno])) ? +b[colno] : b[colno];

              if (left < right)
                  return 1;
              if (left > right) 
                  return -1;
              return 0;
          }                             
        }
    }
}
