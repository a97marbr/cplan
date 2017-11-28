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
    if ($('#year').val()){
        year=$('#year').val();
    } else {
        year=2018;
    }
    if($('#sprogram').val()){
        sprogram=$('#sprogram').val();
    } else {
        sprogram='ALL';
    }
    var sign="BROM";
    var status="UNK";
    var teid="UNK";
    var hours="UNK";
    var op="GETDATA";
  
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sprogram='+sprogram+'&sign='+sign+'&op='+op+'&teid='+teid+'&hours='+hours+'&status='+status
        }) 
        .done(function(data) {
          //alert( "success"+data );
          let json = JSON.parse(data);
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)}
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
function updateStatus(cellid,teid,newstatus){
    let hours=$("#input_"+cellid).val();

    $("#datacell_"+cellid).removeClass("confirmed unconfirmed mustchange error");
    $("#datacell_"+cellid).addClass(newstatus);

    if (newstatus==0){        
        $("#datacell_"+cellid).addClass("confirmed")
    } else if(newstatus==1){        
        $("#datacell_"+cellid).addClass("unconfirmed")
    } else if (newstatus==2){        
        $("#datacell_"+cellid).addClass("mustchange")
    } else {
        $("#datacell_"+cellid).addClass("error");
    }
    
    //alert(teid + " " + hours + " " + newstatus);    
    updateTeaching(teid,hours,newstatus);
}

function updateTeaching(teid,hours,status){  
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
    if($('#sprogram').val()){
        sprogram=$('#sprogram').val();
    } else {
        sprogram='ALL';
    }
        
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sprogram='+sprogram+'&sign='+sign+'&op=UPDATE&teid='+teid+'&hours='+hours+'&status='+status
        }) 
        .done(function(data) {
          let json = JSON.parse(data);
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for WEBUG courses in year"+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)}
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

function insertTeaching(tid,ciid,hours,status){
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

    //alert(tid + " "+ ciid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=INSERT&tid='+tid+'&ciid='+ciid+'&hours='+hours+'&status='+status
        }) 
        .done(function(data) {
          let json = JSON.parse(data);
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)}
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

function insertComment(ciid,comment){
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

    //alert(tid + " "+ ciid + " " + hours + " " + status);
    
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=COMMENT&ciid='+ciid+'&comment='+comment
        }) 
        .done(function(data) {
          let json = JSON.parse(data);
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)}
          );
          myTable.renderTable();
        })
        .fail(function() {
          alert( "error" );
        })
        .always(function() {
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

				if(col=="CCode" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram" ){
            str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</span>";
        } else if(col=="Course Name" || col=="Comment"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</span>";
        } else{
            let sign=col.substring(col.lastIndexOf(" "),col.length);
            let fname=col.substring(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));
            str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>";
            str+="<span style='white-space:nowrap;'>"+fname+" "+lname+"</span> ";				
            str+="<span>"+sign+"</span>";				
            str+="</div>";
				}
		}else{
        if(col=="Course Code" || col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram"){
            if(status){
                str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+col+"&#x25b4;</span>";
            }else{
                str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"&#x25be;</span>";
            }
        } else if(col=="Course Name" || col=="Comment"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</span>";
        } else{
            let sign=col.substr(col.lastIndexOf(" "),col.length);
            let fname=col.substr(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));      
            if(status==0){
                str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>";
                str+="<span style='white-space:nowrap;'>"+fname+" "+lname+" &#x25b4;</span> ";				
                str+="<span>"+sign+"</span>";				
                str+="</div>";
            } else {
                str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>";
                str+="<span style='white-space:nowrap;'>"+fname+" "+lname+" &#x25be;</span> ";				
                str+="<span>"+sign+"</span>";				
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
		
function renderCell(celldata,col,cellid){
    let t="";
    if(col=="CCode"){
        t="<span style='font-family:monospace'>"+celldata+"</span>";
    } else if (col=="Class" || col=="Credits" || col=="Start" || col=="End") {
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
        if (celldata.comment==="UNK"){
            //t="<span  style='border-left:1px solid #000'> </span>";
            t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\""+celldata.comment+"\")' style='text-align:center' placeholder='Enter comment'>&nbsp;</div>"; 
        } else {
            //t="<span class='ellipsis' style='border-left:1px solid #000'>"+celldata+"</span>";        
            t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\""+celldata.comment+"\")' style='text-align:center' placeholder='Enter comment'>"+celldata.comment+"</div>"; 
        }      
    } else if (col=="Course Name") {
        if (celldata==="UNK"){
            t="<div class='ellipsis' style='max-width:300px;'> </div>";
        } else {
            t="<div class='ellipsis' style='max-width:300px;'>"+celldata+"</div>";        
        }      
    } else {
        if (celldata.teid==="UNK"){
            t="<div id='datacell_"+cellid+"' ondblclick='makeEditbox(\""+cellid+"\","+celldata.tid+","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\")' style='text-align:center'>&nbsp;</div>";
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
            t="<div id='datacell_"+cellid+"' ondblclick='makeEditbox(\""+cellid+"\","+celldata.tid+","+celldata.ciid+","+celldata.teid+","+celldata.hours+","+celldata.status+",\"UNK\")' style='text-align:center' class='"+sclass+"'>"+celldata.hours+"</div>";            
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
function compare(a,b){
    // Find out which column and part of column are we sorting on from currentTable
    let col=currentTable.sortcolumn;
    let kind=currentTable.sortkind;

    if (col == "CCode" || col == "Course Name" || col == "Start" || col == "End" || col == "Class" || col == "Comment"){
        if ( a < b ) return -1; 
        if ( a > b ) return 1; 
        return 0; 
    } else if (col == "Credits" || col == "Students"){
        // We allways sort none numbers below 
        let tmp=(currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a)) ? tmp : +a; 
        let right = (isNaN(b)) ? tmp : +b; 
        
        return right-left;     
    }  else if (col == "SProgram"){
        // We allways sort empty cells below 
        let tmp=(currentTable.ascending) ? -1 : 1;
        if ( a=="UNK" ) return -tmp;
        if ( b=="UNK" ) return tmp;
        if ( a < b ) return -1;
        if ( a > b ) return 1;
        return 0; 

    } else {
        // We allways sort none numbers below 
        let tmp=(currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a.hours)) ? tmp : +a.hours; 
        let right = (isNaN(b.hours)) ? tmp : +b.hours; 
        
        return right-left;     
    }  
}

function makeEditbox(cellid,tid,ciid,teid,hours,status,comment){
    myTable.renderTable();
    let str="";
    if(teid==="UNK"&&hours==="UNK"&&status==="UNK"&&tid!=="UNK"){
          str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
            str+="<input maxlength='5' size='5' class='newtimecell' id='input_"+cellid+"' placeholder='hours' onchange='insertTeaching("+tid+","+ciid+",this.value,0)' >";
            str+="</div>";
    } else if(teid==="UNK"&&hours==="UNK"&&tid==="UNK"&&status==="UNK"){
          str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
            if(comment==="UNK"){
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='insertComment("+ciid+",this.value)' placeholder='Enter comment'>";
            }else{
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='insertComment("+ciid+",this.value)' value='"+comment+"'>";            
            }
          str+="</div>";
    } else {
        //str+="<input  >";
          str+="<div id='datacell_"+cellid+"'  style='min-width:100px;' >";
            str+="<input maxlength='5' size='5' onchange='updateTeaching("+teid+",this.value,"+status+")' class='newtimecell' id='input_"+cellid+"' value='"+hours+"' onfocus='this.value = this.value;'>";
          str+="<div class='dropdown'>";
            str+="<div onclick='dropdown("+teid+")' class='dropbtn'>*</div>";
            str+="<div id='dropdown_"+teid+"' class='dropdown-content'>";
              str+="<div class='confirmed' onclick='updateStatus(\""+cellid+"\","+teid+",0)'>Confirmed</div>";
              str+="<div class='unconfirmed' onclick='updateStatus(\""+cellid+"\","+teid+",1)'>Unconfirmed</div>";
              str+="<div class='mustchange' onclick='updateStatus(\""+cellid+"\","+teid+",2)'>Must change</div>";
              str+="<div class='error' onclick='updateStatus(\""+cellid+"\","+teid+",3)'>Error</div>";
          str+="</div>";
        str+="</div>";
  }
  document.getElementById(cellid).outerHTML=str;
  document.getElementById("input_"+cellid).focus();    
  document.getElementById("input_"+cellid).select();
  document.getElementById("input_"+cellid).addEventListener('keydown', function(ev) { if(ev.keyCode == 27){myTable.renderTable();}});
}
