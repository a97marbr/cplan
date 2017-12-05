var sprogram;
var myTable;
var sumColFilterList=["CCode","Course Name","Class","Credits","Start","End","Students","SProgram","Comment","Lecture Time","Supervise Time","Student Time"];
var sumRowFilterList=["CCode","Course Name","Class","Credits","Start","End","Students","SProgram","Comment","Lecture Time","Supervise Time","Student Time"];

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
          
          sumRowList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
      
          sumColList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
          
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              sumColList,
              sumRowList,
              "Course Total",
      				function(col, val, rowno, row){return makeSum(col,val,rowno,row)}
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
          sumRowList = json.tbldata.tblhead.filter( function( el ) {
            return !sumRowFilterList.includes( el );
          } );
      
          sumColList = json.tbldata.tblhead.filter( function( el ) {
            return !sumColFilterList.includes( el );
          } );
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for WEBUG courses in year"+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              sumColList,
              sumRowList,
              "Course Total",
              function(col, val, rowno, row){return makeSum(col,val,rowno,row)}
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
          sumRowList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
      
          sumColList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              sumColList,
              sumRowList,
              "Course Total",      				
              function(col, val, rowno, row){return makeSum(col,val,rowno,row)}
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

function updateCourseInstance(ciid,comment,students,lectureTime,superviseTime,studentTime){
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

    var jqxhr = $.ajax({
            type: 'POST',
            url: 'course_service.php',
            data: 'year='+year+'&sign='+sign+'&op=UPDATECOURSEINSTANCE&ciid='+ciid+'&comment='+comment+'&students='+students+'&lectureTime='+lectureTime+'&superviseTime='+superviseTime+'&studentTime='+studentTime
        }) 
        .done(function(data) {
          let json = JSON.parse(data);
          sumRowList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
      
          sumColList = json.tbldata.tblhead.filter( function( el ) {
            return !(sumRowFilterList.indexOf( el )>=0);
          } );
          myTable = new SortableTable(json.tbldata,"c","columnFilter","Teaching allocation for "+sprogram+" courses in year "+year,
              function(celldata,col,cellid){return renderCell(celldata,col,cellid)},
              function(col,status){return renderSortOptions(col,status)},
              function(col,status){return renderColumnFilter(col,status)},
              function(row){ return rowFilter(row)},
              sumColList,
              sumRowList,
              "Course Total",
              function(col, val, rowno, row){return makeSum(col,val,rowno,row)}
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
        } else if(col=="Course Name" || col=="Comment" || col=="Time Budget (lecture / seminar / supervision / preparation / development / grading / examination / running / other / total)"){
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
        if(col=="CCode" || col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram"){
            if(status==0){
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
        t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"students\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.students+"\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>"+celldata.students+"</div>"; 
    } else if (col=="Lecture Time") {
        t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"lectureTime\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.lectureTime+"\",\"UNK\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>"+celldata.lectureTime+"</div>"; 
    } else if (col=="Supervise Time") {
        t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"superviseTime\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.superviseTime+"\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>"+celldata.superviseTime+"</div>"; 
    } else if (col=="Student Time") {
        t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"studentTime\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")' style='text-align:center;' placeholder='Enter comment'>"+celldata.studentTime+"</div>"; 
    } else if (col=="Time Budget (lecture / seminar / supervision / preparation / development / grading / examination / running / other / total)") {
        // lecture / seminar / supervision / preparation / development / grading / examination / running / other / total
        t="<div id='datacell_'"+cellid+"' style='text-align:center;position:relative' class='hoPa'>"+celldata.time_budget.total;
        t+="<div id='datacelldropdown_"+cellid+"' style='text-align:center;position:absolute;bottom:-20pxpx;left:0px;background-color:#bbb' placeholder='Enter comment' class='hoCh'>";
            t+="<div title='"+celldata.time_budget.lecture+"h in lecture' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetLecture\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.lecture+"</div> + ";
            t+="<div title='"+celldata.time_budget.seminar+"h in seminar' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetSeminar\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.seminar+"</div> + ";
            t+="<div title='"+celldata.time_budget.supervision+"h in supervision' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetSupervision\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.supervision+"</div> + ";
            t+="<div title='"+celldata.time_budget.preparation+"h in preparation' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetPreparation\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.preparation+"</div> + ";
            t+="<div title='"+celldata.time_budget.development+"h in development' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetDevelopment\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.development+"</div> + ";
            t+="<div>( #students * <span title='"+celldata.time_budget.grading+"h grading per student' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetGrading\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.grading+"</div> ) + ";
            t+="<div>( #students * <span title='"+celldata.time_budget.examination+"h examination per student' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetExamination\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.examination+"</div> ) + ";
            t+="<div title='"+celldata.time_budget.running+"h running the course' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetRunning\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.running+"</div> + ";
            t+="<div title='"+celldata.time_budget.other+"h other time' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetOther\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.other+"</DIVspan> = ";
            t+="<div title='"+celldata.time_budget.total+"h total time budgeted for the course' >"+celldata.time_budget.total+"</div>";
        +"</div></div>"; 
    } else if (col=="SProgram") {
        if (celldata==="UNK"){
            t="<span> </span>";
        } else {
            t=celldata;        
        }      
    } else if (col=="Comment") {
        if (celldata.comment==="UNK"){
            //t="<span  style='border-left:1px solid #000'> </span>";
            t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNKUNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:left;border-left:1px solid #000;padding-left:5px;' placeholder='Enter comment'>&nbsp;</div>"; 
        } else {
            //t="<span class='ellipsis' style='border-left:1px solid #000'>"+celldata+"</span>";        
            t="<div class='ellipsis' id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\""+celldata.comment+"\",\"UNK\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:left;border-left:1px solid #000;padding-left:5px;' placeholder='Enter comment'>"+celldata.comment+"</div>"; 
        }      
    } else if (col=="Course Name") {
        if (celldata==="UNK"){
            t="<div class='ellipsis' style='max-width:300px;'> </div>";
        } else {
            t="<div class='ellipsis' style='max-width:300px;' title='"+celldata+"'>"+celldata+"</div>";        
        }      
    } else {
        if (celldata.teid==="UNK"){
            t="<div id='datacell_"+cellid+"' ondblclick='makeEditbox(\"INSERT_TEACHING\",\""+cellid+"\","+celldata.tid+","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:center'>&nbsp;</div>";
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
            t="<div id='datacell_"+cellid+"' ondblclick='makeEditbox(\"UPDATE_TEACHING\",\""+cellid+"\","+celldata.tid+","+celldata.ciid+","+celldata.teid+","+celldata.hours+","+celldata.status+",\"UNK\",\"UNK\")' style='text-align:center' class='"+sclass+"'>"+celldata.hours+"</div>";            
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
    // We allways sort none numbers below 
    let tmp=(currentTable.ascending) ? -1000000 : 1000000;

    if (col == "CCode" || col == "Course Name" || col == "Start" || col == "End" || col == "Class" || col == "Comment" || col == "SProgram"){
        let tmp=(currentTable.ascending) ? -1 : 1;
        if ( a=="UNK" ) return -tmp;
        if ( b=="UNK" ) return tmp;
        if ( a < b ) return -1; 
        if ( a > b ) return 1; 
        return 0; 
    } else if (col == "Credits"){
        
        let left = (isNaN(a)) ? tmp : +a; 
        let right = (isNaN(b)) ? tmp : +b; 
        return right-left;     
    }  else if (col == "Students"){
        // We allways sort none numbers below 
        let tmp=(currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a.students)) ? tmp : +a.students; 
        let right = (isNaN(b.students)) ? tmp : +b.students; 
        return right-left;     
    } else {
        // We allways sort none numbers below 
        let tmp=(currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a.hours)) ? tmp : +a.hours; 
        let right = (isNaN(b.hours)) ? tmp : +b.hours; 
        
        return right-left;     
    }  
}

//--------------------------------------------------------------------------
// makeSum
// ---------------
//	makeSum col,value  
//--------------------------------------------------------------------------

function makeSum(col,value,rowno,row){
    if(col=="Students"){
        return parseFloat(value.students);
    } else if(col=="Time Budget (lecture / seminar / supervision / preparation / development / grading / examination / running / other / total)"){
        // We need to calc the value for total
        let students=row[currentTable.tbl.tblhead.indexOf("Students")].students;
        let ttb=value.time_budget.lecture+value.time_budget.seminar+value.time_budget.supervision+value.time_budget.preparation+value.time_budget.development+(value.time_budget.grading * students)+value.time_budget.examination+value.time_budget.running+value.time_budget.other;        
        currentTable.tbl.tblbody[rowno][currentTable.tbl.tblhead.indexOf(col)].time_budget.total=ttb;
        return parseFloat(ttb);
    } else{
				if(value.hours=="UNK"){
						return 0;
				}else{
            //alert(value.hours);
						return parseFloat(value.hours);
				}
		}
		return 0;
}

// 
// makeEditbox
// Generates an editbox that will 
// type: INSERT_TEACHING, UPDATE_TEACHING or UPDATE_COURSE_INSTANCE
// cellid: the id of html element that we should put the editbox
// --- Change teaching ---
// tid: teacher id
// teid: teaching id
// hours: num hours 
// --- Change Course instance ---
// ciid: course instance id
// status: 0 - verified, 1 - unverified, 2 - must change, 3 - error
// comment: comment on course instance
// students: num of students
// {"lecture":0,"seminar":0,"supervision":0,"preparation":0,"development":0,"grading":0,"examination":0,"running":0,"other":0,"total":0}
// 
function makeEditbox(type,cellid,tid,ciid,teid,hours,status,comment,students,timeBudget){
    myTable.renderTable();
    let str="";
    if(type==="INSERT_TEACHING"){
        if(tid!=="UNK"&&ciid!=="UNK"){
              str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                str+="<input maxlength='5' size='5' class='newtimecell' id='input_"+cellid+"' placeholder='hours' onchange='insertTeaching("+tid+","+ciid+",this.value,0)' >";
                str+="</div>";
        }      
    } else if (type==="UPDATE_TEACHING"){
        str+="<div id='datacell_"+cellid+"' style='min-width:100px;' >";
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
        str+="</div>";      
    } else if (type==="UPDATE_COURSE_INSTANCE"){
        if(ciid!=="UNK"){
          if(comment!=="UNK"){
              str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                  str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='updateCourseInstance("+ciid+",this.value,\"UNK\",\"UNK\",\"UNK\",\"UNK\")' value='"+comment+"'>";            
              str+="</div>";
          } else if(students!=="UNK"){
            str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='updateCourseInstance("+ciid+",\"UNK\",this.value,\"UNK\",\"UNK\",\"UNK\")' value='"+students+"'>";            
            str+="</div>";
          } else if(lectureTime!=="UNK"){
            str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='updateCourseInstance("+ciid+",\"UNK\",\"UNK\",this.value,\"UNK\",\"UNK\")' value='"+lectureTime+"'>";            
            str+="</div>";
          } else if(superviseTime!=="UNK"){
            str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='updateCourseInstance("+ciid+",\"UNK\",\"UNK\",\"UNK\",this.value,\"UNK\")' value='"+superviseTime+"'>";            
            str+="</div>";
          } else if(studentTime!=="UNK"){
            str+="<div id='datacell_"+cellid+"'  style='min-width:100px;'>";
                str+="<input class='newtimecell' id='input_"+cellid+"' placeholder='Enter comment' onchange='updateCourseInstance("+ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",this.value)' value='"+studentTime+"'>";            
            str+="</div>";
          }
        }            
    } else {
        //str+="<input  >";
    }
    document.getElementById(cellid).outerHTML=str;
    document.getElementById("input_"+cellid).focus();    
    document.getElementById("input_"+cellid).select();
    document.getElementById("input_"+cellid).addEventListener('keydown', function(ev) { if(ev.keyCode == 27){myTable.renderTable();}});
}
