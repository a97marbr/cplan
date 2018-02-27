var isLocked=false;
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
          
          myTable = new SortableTable(
              json.tbldata,
              "c",
              "columnFilter",
              "Teaching allocation for "+sprogram+" courses in year "+year,
              renderCell,
              renderSortOptions,
              renderColumnFilter,
              rowFilter,
              sumColList,
              sumRowList,
              "Course Total",
      				function(col, val, rowno, row){return makeSum(col,val,rowno,row)},
              "Course Name",
              rowHighlightOn,
              rowHighlightOff,
              displayCellEdit,
              updateCellCallback
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
        } else if(col=="Course Name" || col=="Comment"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</span>";
        }else if(col=="Budget"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Budget</span>";
            str+="<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Stud</span>|";
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Time</span></div>";
        } else{
            let sign=col.substring(col.lastIndexOf(" "),col.length);
            let fname=col.substring(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));
            str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>";
            str+="<div style='white-space:nowrap;'>"+fname+" "+lname+"</div> ";				
            str+="<div>"+sign+"</div>";				
            str+="</div>";
				}
		}else{
        if(col=="CCode" || col=="Course Name" || col=="Class" || col=="Credits" || col=="Start" || col=="End" || col=="Students" || col=="SProgram"){
            if(status==0){
                str+="<div onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+col+"&#x25b4;</div>";
            }else{
                str+="<div onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"&#x25be;</div>";
            }
        } else if(col=="Course Name" || col=="Comment"){
            str+="<div class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+col+"</div>";
        }else if(col=="Budget"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Budget</span>";
        } else{
            let sign=col.substr(col.lastIndexOf(" "),col.length);
            let fname=col.substr(0,col.indexOf(" "));
            let lname=col.substring(col.indexOf(" ")+1,col.lastIndexOf(" "));      
            if(status==0){
                str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>";
                str+="<div style='white-space:nowrap;'>"+fname+" "+lname+" &#x25b2;</div> ";				
                str+="<div>"+sign+"</div>";				
                str+="</div>";
            } else {
                str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>";
                str+="<div style='white-space:nowrap;'>"+fname+" "+lname+" &#x25bc;</div> ";				
                str+="<div>"+sign+"</div>";				
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
		
function renderCell(celldata,col,cellid,rowdata,colnames){
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
    } else if (col=="Budget") {
        //console.log(rowdata);
        //console.log(colnames);
        // lecture / seminar / supervision / preparation / development / grading / examination / running / other / total        
        let students=parseInt(rowdata[colnames.indexOf("students")].students);
        let total=celldata.time_budget.unspecified+celldata.time_budget.lecture+celldata.time_budget.seminar+celldata.time_budget.supervision+celldata.time_budget.preparation+celldata.time_budget.development+(celldata.time_budget.grading*students)+(celldata.time_budget.examination*students)+(celldata.time_budget.running*students)+(celldata.time_budget.other*students);
        let sclass="";
        if (celldata.time_budget.status==0){
            sclass="confirmed";
        } else if (celldata.time_budget.status==1){
            sclass="unconfirmed";
        } else if (celldata.time_budget.status==2){
            sclass="mustchange";
        }else {
            sclass="error";
        }
        t="<div id='datacell_"+cellid+"' style='text-align:center;display:flex;justify-content:flext-start;' class='"+sclass+"'><div style='margin-right:15px;'>"+celldata.time_budget.students+"</div><div>"+total+"</div></div>";              
//        t="<div id='datacell_'"+cellid+"' style='text-align:center;position:relative' class=''>"+total;
        /*
        t+="<div id='datacelldropdown_"+cellid+"' style='text-align:center;position:absolute;top:0px;left:0px;background-color:#cc5' placeholder='Enter comment' class='hoCh'>";
            t+="<div title='"+celldata.time_budget.lecture+"h in lecture' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetLecture\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Lecture:"+celldata.time_budget.lecture+"</div> + ";
            t+="<div title='"+celldata.time_budget.seminar+"h in seminar' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetSeminar\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Seminar:"+celldata.time_budget.seminar+"</div> + ";
            t+="<div title='"+celldata.time_budget.supervision+"h in supervision' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetSupervision\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Supervision"+celldata.time_budget.supervision+"</div> + ";
            t+="<div title='"+celldata.time_budget.preparation+"h in preparation' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetPreparation\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Preparation"+celldata.time_budget.preparation+"</div> + ";
            t+="<div title='"+celldata.time_budget.development+"h in development' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetDevelopment\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Development"+celldata.time_budget.development+"</div> + ";
            t+="<div>( #students * <span title='"+celldata.time_budget.grading+"h grading per student' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetGrading\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Grading"+celldata.time_budget.grading+"</div> ) + ";
            t+="<div>( #students * <span title='"+celldata.time_budget.examination+"h examination per student' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetExamination\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>Examination"+celldata.time_budget.examination+"</div> ) + ";
            t+="<div title='"+celldata.time_budget.running+"h running the course' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetRunning\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.running+"</div> + ";
            t+="<div title='"+celldata.time_budget.other+"h other time' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"timeBudgetOther\",\""+cellid+"\",\"UNK\","+celldata.ciid+",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\""+celldata.studentTime+"\")'>"+celldata.time_budget.other+"</div> = ";
            t+="<div title='"+celldata.time_budget.total+"h total time budgeted for the course' >"+celldata.time_budget.total+"</div>";
            t+="</div>"
            */
        t+="</div>"; 
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
        if(celldata.allocation!=="UNK" && celldata.allocation!==null){
          /*
          unspecified:parseInt(document.getElementById("popoveredit_unspecified").value),
          lecture:parseInt(document.getElementById("popoveredit_lecture").value),
          seminar:parseInt(document.getElementById("popoveredit_seminar").value),
          supervision:parseInt(document.getElementById("popoveredit_supervision").value),
          preparation:parseInt(document.getElementById("popoveredit_preparation").value),
          development:parseInt(document.getElementById("popoveredit_development").value),
          grading:parseInt(document.getElementById("popoveredit_grading").value),
          examination:parseInt(document.getElementById("popoveredit_examination").value),
          running:parseInt(document.getElementById("popoveredit_running").value),
          other:parseInt(document.getElementById("popoveredit_other").value),
          */
            let total=celldata.allocation.unspecified+celldata.allocation.lecture+celldata.allocation.seminar+celldata.allocation.supervision+celldata.allocation.preparation+celldata.allocation.development+celldata.allocation.grading+celldata.allocation.examination+celldata.allocation.running+celldata.allocation.other;
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
            t="<div id='datacell_"+cellid+"' style='text-align:center' class='"+sclass+"'>"+total+"</div>";              
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
    let col=sortableTable.currentTable.getSortcolumn();
    console.log(col);
    let kind=sortableTable.currentTable.getSortkind();
    // We allways sort none numbers below 
    let tmp=(sortableTable.currentTable.ascending) ? -1000000 : 1000000;

    if (col == "CCode" || col == "Course Name" || col == "Start" || col == "End" || col == "Class" || col == "Comment" || col == "SProgram"){
        let tmp=(sortableTable.currentTable.ascending) ? -1 : 1;
        if ( a=="UNK" ) return -tmp;
        if ( b=="UNK" ) return tmp;
        if ( a < b ) return -1; 
        if ( a > b ) return 1; 
        return 0; 
    } else if (col == "Credits"){
        
        let left = (isNaN(a)) ? tmp : +a; 
        let right = (isNaN(b)) ? tmp : +b; 
        return right-left;     
    }else if (col == "Budget"){
        /*
        let left = (isNaN(a.time_budget.unspecified)) ? tmp : +a.time_budget.unspecified; 
        let right = (isNaN(b.time_budget.unspecified)) ? tmp : +b.time_budget.unspecified; 
        */
        let left = a.time_budget.unspecified+a.time_budget.lecture+a.time_budget.supervision+a.time_budget.seminar+a.time_budget.development+a.time_budget.preparation;
        let right = b.time_budget.unspecified+b.time_budget.lecture+b.time_budget.supervision+b.time_budget.seminar+b.time_budget.development+b.time_budget.preparation;
        return right-left;     
    }  else if (col == "Students"){
        // We allways sort none numbers below 
        let tmp=(sortableTable.currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a.students)) ? tmp : +a.students; 
        let right = (isNaN(b.students)) ? tmp : +b.students; 
        return right-left;     
    } else {
        // We allways sort none numbers below 
        let tmp=(sortableTable.currentTable.ascending) ? -1000000 : 1000000;
        
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

function makeSum(col,value){
    if(col=="Students"){
        return parseFloat(value.students);
    } else if(col=="Budget"){
        //console.log(value);
        let total=value.time_budget.unspecified+value.time_budget.lecture+value.time_budget.seminar+value.time_budget.supervision+value.time_budget.preparation+value.time_budget.development+value.time_budget.grading+value.time_budget.examination+value.time_budget.running+value.time_budget.other;
        return parseFloat(total);
    } else{
				if(value.hours=="UNK"){
						return 0;
				}else{
            //alert(value.hours);
            let total=0;
            if(value.allocation !== null){
                total=value.allocation.unspecified+value.allocation.lecture+value.allocation.seminar+value.allocation.supervision+value.allocation.preparation+value.allocation.development+value.allocation.grading+value.allocation.examination+value.allocation.running+value.allocation.other;
            }            
						return parseFloat(total);
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

//--------------------------------------------------------------------------
// editCell
// ---------------
//  Callback function for showing a cell editing interface
//--------------------------------------------------------------------------
function displayCellEdit(celldata,rowno,rowelement,cellelement,column,colno,rowdata,coldata,tableid){
    isLocked=true;
    let str="";
    if(column=="students"){
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str+="<input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='"+celldata.students+"' size='"+celldata.students.toString().length+"'/>";
        str+="</div>";
    }else if (column=="budget"){
        console.log(celldata);
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str+="<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
              str+="<option value='0'>confirmed</option>";
              str+="<option value='1'>unconfirmed</option>";
              str+="<option value='2'>must change</option>";
              str+="<option value='3'>error</option>";
          str+="</select>";            
          str+="<div class='editInput'><label>Students:</label><input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.students+"' size="+celldata.time_budget.students.toString().length+"/></div>";
          str+="<div class='editInput'><label>Fixed time</label>&nbsp;</div>";
          str+="<div class='editInput'><label>Unspecified:</label><input type='text' id='popoveredit_unspecified' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.unspecified+"' size="+celldata.time_budget.unspecified.toString().length+"/></div>";
          str+="<div class='editInput'><label>Lecture:</label><input type='text' id='popoveredit_lecture' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.lecture+"' size='"+celldata.time_budget.lecture.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Seminar:</label><input type='text' id='popoveredit_seminar' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.seminar+"' size='"+celldata.time_budget.seminar.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Supervision:</label><input type='text' id='popoveredit_supervision' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.supervision+"' size='"+celldata.time_budget.supervision.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Preparation:</label><input type='text' id='popoveredit_preparation' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.preparation+"' size='"+celldata.time_budget.preparation.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Development:</label><input type='text' id='popoveredit_development' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.development+"' size='"+celldata.time_budget.development.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Varying Time</label>&nbsp;</div>";
          str+="<div class='editInput'><label>Grading:</label><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.grading+"' size='"+celldata.time_budget.grading.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Examination:</label><input type='text' id='popoveredit_examination' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.examination+"' size='"+celldata.time_budget.examination.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Running</label><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.running+"' size='"+celldata.time_budget.running.toString().length+"'/></div>";
          str+="<div class='editInput'><label>Other:</label><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.other+"' size='"+celldata.time_budget.other.toString().length+"'/></div>";
          //str+="<div class='editInput'><label>Total:</label><input type='text' id='popoveredit_total' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.total+"' size='"+celldata.time_budget.total.toString().length+"'/></div>";
      str+="</div>";
    }else if (column=="comment"){
      console.log(celldata);
      str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
          str+="<div class='editInput'><label>Comment:</label><input type='text' id='popoveredit_comment' class='popoveredit' style='flex-grow:1' value='"+celldata.comment+"' size="+celldata.comment.toString().length+"/></div>";
      str+="</div>";
    }else{
        var ta;
        if (celldata.allocation=="UNK" || celldata.allocation===null){
            ta={"unspecified":0,"lecture":0,"seminar":0,"supervision":0,"preparation":0,"development":0,"grading":0,"examination":0,"running":0,"other":0,"total":0,"status":0};
        }else{
            ta=celldata.allocation;
        }
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
            str+="<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
                str+="<option value='0'>confirmed</option>";
                str+="<option value='1'>unconfirmed</option>";
                str+="<option value='2'>must change</option>";
                str+="<option value='3'>error</option>";
            str+="</select>";            
            str+="<div class='editInput'><label>Unspecified:</label><input type='text' id='popoveredit_unspecified' class='popoveredit' style='flex-grow:1' value='"+ta.unspecified+"' size="+ta.unspecified.toString().length+"/></div>";
            str+="<div class='editInput'><label>Lecture:</label><input type='text' id='popoveredit_lecture' class='popoveredit' style='flex-grow:1' value='"+ta.lecture+"' size="+ta.lecture.toString().length+"/></div>";
            str+="<div class='editInput'><label>Seminar:</label><input type='text' id='popoveredit_seminar' class='popoveredit' style='flex-grow:1' value='"+ta.seminar+"' size="+ta.seminar.toString().length+"/></div>";
            str+="<div class='editInput'><label>Supervision:</label><input type='text' id='popoveredit_supervision' class='popoveredit' style='flex-grow:1' value='"+ta.supervision+"' size="+ta.supervision.toString().length+"/></div>";
            str+="<div class='editInput'><label>Preparation:</label><input type='text' id='popoveredit_preparation' class='popoveredit' style='flex-grow:1' value='"+ta.preparation+"' size="+ta.preparation.toString().length+"/></div>";
            str+="<div class='editInput'><label>Development:</label><input type='text' id='popoveredit_development' class='popoveredit' style='flex-grow:1' value='"+ta.development+"' size="+ta.development.toString().length+"/></div>";
            str+="<div class='editInput'><label>Grading:</label><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' value='"+ta.grading+"' size="+ta.grading.toString().length+"/></div>";
            str+="<div class='editInput'><label>Examination:</label><input type='text' id='popoveredit_examination' class='popoveredit' style='flex-grow:1' value='"+ta.examination+"' size="+ta.examination.toString().length+"/></div>";
            str+="<div class='editInput'><label>Running</label><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' value='"+ta.running+"' size="+ta.running.toString().length+"/></div>";
            str+="<div class='editInput'><label>Other:</label><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' value='"+ta.other+"' size="+ta.other.toString().length+"/></div>";
            //str+="<div class='editInput'><label>Total:</label><input type='text' id='popoveredit_total' class='popoveredit' style='flex-grow:1' value='"+ta.total+"' size="+ta.total.toString().length+"/></div>";
            str+="</div>";
        str+="</div>";
    }
    return str;          
}

//--------------------------------------------------------------------------
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function updateCellCallback(rowno,colno,column,tableid,oldvalue){
    isLocked=false;
    // Make AJAX call and return 
    if(column=="students"){        
        var newvalue=oldvalue;
        var newcelldata=parseInt(document.getElementById("popoveredit_students").value);
        if(isNaN(newcelldata)){
            return -1;// This must be handled
        }else{
            newvalue.students=newcelldata;
            updateDB(tableid,rowno,column,newvalue,"COURSEINSTANCE");
            return newvalue;
        }          
    }else if(column=="num"){
        var newcelldata=parseInt(document.getElementById("popoveredit0").value);
        if(isNaN(newcelldata)){
            return -1;// This must be handled
        }else{
            updateDB(tableid,rowno,column,newcelldata);
            return newcelldata;
        }          
    }else if(column=="budget"){
        //console.log(rowno,colno,column,tableid,oldvalue);
        var newvalue=oldvalue;
        newvalue.students=parseInt(document.getElementById("popoveredit_students").value);
        var obj={
            students:parseInt(document.getElementById("popoveredit_students").value),
            unspecified:parseInt(document.getElementById("popoveredit_unspecified").value),
            lecture:parseInt(document.getElementById("popoveredit_lecture").value),
            seminar:parseInt(document.getElementById("popoveredit_seminar").value),
            supervision:parseInt(document.getElementById("popoveredit_supervision").value),
            preparation:parseInt(document.getElementById("popoveredit_preparation").value),
            development:parseInt(document.getElementById("popoveredit_development").value),
            grading:parseInt(document.getElementById("popoveredit_grading").value),
            examination:parseInt(document.getElementById("popoveredit_examination").value),
            running:parseInt(document.getElementById("popoveredit_running").value),
            other:parseInt(document.getElementById("popoveredit_other").value),
            //total:parseInt(document.getElementById("popoveredit_total").value),
            status:parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };        
        newvalue.time_budget=obj;
        //newvalue.status=parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value);
        //newvalue.hours=0;
        updateDB(tableid,rowno,column,newvalue,"COURSEINSTANCE");
        return newvalue;
    }else if(column=="comment"){
        //console.log(rowno,colno,column,tableid,oldvalue);
        var newvalue=oldvalue;
        newvalue.comment=document.getElementById("popoveredit_comment").value;
        updateDB(tableid,rowno,column,newvalue,"COURSEINSTANCE");
        return newvalue;
    }else{     
        //console.log(rowno,colno,column,tableid,oldvalue);
        var newvalue=oldvalue;
        var obj={
            unspecified:parseInt(document.getElementById("popoveredit_unspecified").value),
            lecture:parseInt(document.getElementById("popoveredit_lecture").value),
            seminar:parseInt(document.getElementById("popoveredit_seminar").value),
            supervision:parseInt(document.getElementById("popoveredit_supervision").value),
            preparation:parseInt(document.getElementById("popoveredit_preparation").value),
            development:parseInt(document.getElementById("popoveredit_development").value),
            grading:parseInt(document.getElementById("popoveredit_grading").value),
            examination:parseInt(document.getElementById("popoveredit_examination").value),
            running:parseInt(document.getElementById("popoveredit_running").value),
            other:parseInt(document.getElementById("popoveredit_other").value),
            //total:parseInt(document.getElementById("popoveredit_total").value),
            status:parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };        
        newvalue.allocation=obj;
        newvalue.status=parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value);
        newvalue.hours=0;
        updateDB(tableid,rowno,column,newvalue,"TEACHING");
        return newvalue;
        /*
        updateDB(tableid,rowno,column,document.getElementById("popoveredit0").value);
        return document.getElementById("popoveredit0").value;
        */
    }    
}

//--------------------------------------------------------------------------
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function clearUpdateCell(){
    isLocked=false;
}
			
//--------------------------------------------------------------------------
// updateDB
// ---------------
// AJAX call to update cell value in database on server
//--------------------------------------------------------------------------
function updateDB(tableid,rowno,col,val,dbtbl){
    console.log(val);
  
    var id="UNK";
    var command;
    if(dbtbl=="TEACHING"){
        id=val.teid;
        if(id!=="UNK"){
            command="UPDATETEACHING";
        }else{
            command="INSERTTEACHING";
        }      
    }else if(dbtbl=="COURSEINSTANCE"){
        id=val.ciid;
        command="UPDATECOURSEINSTANCE";
    }
  
    $.ajax({
        method: "POST",
        url: "course_service.php",
        data: {"command":command,"updatecol":col,"updatetable":tableid,"updatevalue":JSON.stringify(val),"updaterow":id}
    })
    .done(function( data ) {
        
        clearUpdateCellInternal();
    });
}

//--------------------------------------------------------------------------
// rowHighlight
// ---------------
//  Callback function that highlights the currently hovered row
//--------------------------------------------------------------------------
			
function rowHighlightOn(rowid,rowno,colclass,centerel){
    if(!isLocked){
        document.getElementById(rowid).style.border="2px solid rgba(255,0,0,1)";
        document.getElementById(rowid+"_mvh").style.borderLeft="2px solid rgba(255,0,0,1)";
        document.getElementById(rowid+"_mvh").style.borderTop="2px solid rgba(255,0,0,1)";
        document.getElementById(rowid+"_mvh").style.borderBottom="2px solid rgba(255,0,0,1)";
    		var collist = document.getElementsByClassName(colclass);
    		for(let i=0;i<collist.length;i++){
    			collist[i].style.borderLeft="2px solid rgba(255,0,0,1)";
    			collist[i].style.borderRight="2px solid rgba(255,0,0,1)";
    		}   		
    		centerel.style.backgroundImage="radial-gradient(RGBA(0,0,0,0),RGBA(0,0,0,0.2))";      
    }
}

function rowHighlightOff(rowid,rowno,colclass,centerel){
    if(!isLocked){
        /*
        document.getElementById(rowid).style.border="2px solid rgba(255,0,0,0)";
        document.getElementById(rowid+"_mvh").style.borderLeft="2px solid rgba(255,0,0,0)";
        document.getElementById(rowid+"_mvh").style.borderTop="2px solid rgba(255,0,0,0)";
        document.getElementById(rowid+"_mvh").style.borderBottom="2px solid rgba(255,0,0,0)";
    		var collist = document.getElementsByClassName(colclass);
    		for(let i=0;i<collist.length;i++){
    			collist[i].style.borderLeft="2px solid rgba(255,0,0,0)";
    			collist[i].style.borderRight="2px solid rgba(255,0,0,0)";
    		}   		
    		centerel.style.backgroundImage="none";
        */
        document.getElementById(rowid).style.border="";
        document.getElementById(rowid+"_mvh").style.borderLeft="";
        document.getElementById(rowid+"_mvh").style.borderTop="";
        document.getElementById(rowid+"_mvh").style.borderBottom="";
    		var collist = document.getElementsByClassName(colclass);
    		for(let i=0;i<collist.length;i++){
    			collist[i].style.borderLeft="";
    			collist[i].style.borderRight="";
    		}   		
    		centerel.style.backgroundImage="none";
    }
}
