var isLocked=false;
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
    var sign="ATIY";
    if($('#teacherSelect').val()){
        sign=$('#teacherSelect').val();
    }
    var status="UNK";
    var teid="UNK";
    var hours="UNK";
    var op="GETDATA";
      
    var jqxhr = $.ajax({
            type: 'POST',
            url: 'teacher2_service.php',
            data: 'year='+year+'&sign='+sign
        }) 
        .done(function(data) {
          //alert( "success"+data );
          let json = JSON.parse(data);
          
          var s="<select>";
          for(let l=0;l<json.teachers.length;l++){
              s+="<option value='"+json.teachers[l].sign+"' ";
              if(json.teachers[l].sign==json.selected) s+="selected ";
              s+=">"+json.teachers[l].lname+", "+json.teachers[l].fname+" ("+json.teachers[l].sign+")</option>"
          }
          s+="</select>";
          document.getElementById("teacherSelect").innerHTML=s;
          //console.log(rowsums);
          myTable = new SortableTable({
              data:json.tbldata,
              tableElementId:"year_allocation",
              filterElementId:"columnFilter",
              //tableCaption:"Teaching allocation for "+sprogram+" courses in year "+year,
              renderCellCallback:renderCell,
              renderSortOptionsCallback:renderSortOptions,
              renderColumnFilterCallback:renderColumnFilter,
              rowFilterCallback:rowFilter,
              columnOrder:json.columnOrder,
              columnSumCallback:makeSum,
              columnSum:"time_allocation",
              rowHighlightOnCallback:rowHighlightOn,
              rowHighlightOffCallback:rowHighlightOff,
              displayCellEditCallback:displayCellEdit,
              updateCellCallback:updateCellCallback,
              hasMagicHeadings:true,
              hasCounterColumn:true
          });          
          myTable.renderTable();
          var periods_tables=[];
          for(let jj=0;jj<json.tbldata.tblbody.length;jj++){
              //console.log(json.tbldata.tblbody[jj]);
              var data=json.tbldata.tblbody[jj];
              var courseLength=0;
              if (json.tbldata.tblbody[jj]['start_period']>json.tbldata.tblbody[jj]['end_period']){
                  
              }else{
                  courseLength=json.tbldata.tblbody[jj]['end_period']-json.tbldata.tblbody[jj]['start_period']+1;
              }

              data.time_allocation.unspecified=data.time_allocation.unspecified/courseLength;
              data.time_allocation.lecture=data.time_allocation.lecture/courseLength;
              data.time_allocation.supervision=data.time_allocation.supervision/courseLength;
              data.time_allocation.seminar=data.time_allocation.seminar/courseLength;
              data.time_allocation.development=data.time_allocation.development/courseLength;
              data.time_allocation.preparation=data.time_allocation.preparation/courseLength;
              data.time_allocation.grading=data.time_allocation.grading/courseLength;
              data.time_allocation.examination=data.time_allocation.examination/courseLength;
              data.time_allocation.running=data.time_allocation.running/courseLength;
              data.time_allocation.other=data.time_allocation.other/courseLength;

              let tot=data.time_allocation.unspecified+data.time_allocation.lecture+data.time_allocation.supervision+data.time_allocation.seminar+data.time_allocation.development+data.time_allocation.preparation+data.time_allocation.grading+data.time_allocation.examination+data.time_allocation.running+data.time_allocation.other;
              if(tot>0){
                  for(let kk=0;kk<courseLength;kk++){
                      var p=json.tbldata.tblbody[jj]['start_period']+kk;
                      if(typeof(periods_tables[p])==='undefined'){
                          periods_tables[p]=[];
                          periods_tables[p]['tblhead']=json.tbldata.tblhead;
                          periods_tables[p]['tblfoot']=json.tbldata.tblfoot;
                          periods_tables[p]['tblbody']=[]
                      }             
                      periods_tables[p]['tblbody'].push(data);
                  }                
              }
          }
          var tables=[];
          for(p in periods_tables){
              //console.log(periods_tables[p])
              tables[p] = new SortableTable({
                  data:periods_tables[p],
                  tableElementId:"lp"+p+"_allocation",
                  filterElementId:"columnFilter"+p,
                  //tableCaption:"Teaching allocation for "+sprogram+" courses in year "+year,
                  renderCellCallback:renderCell,
                  renderSortOptionsCallback:renderSortOptions,
                  renderColumnFilterCallback:renderColumnFilter,
                  rowFilterCallback:rowFilter,
                  columnOrder:json.columnOrder,
                  columnSumCallback:makeSum,
                  columnSum:"time_allocation",
                  rowHighlightOnCallback:rowHighlightOn,
                  rowHighlightOffCallback:rowHighlightOff,
                  displayCellEditCallback:displayCellEdit,
                  updateCellCallback:updateCellCallback,
                  hasMagicHeadings:true,
                  hasCounterColumn:true
              });          
              tables[p].renderTable();
          }
          
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
		
function renderColumnFilter(col,status,colname) {
  str = "";
  if (status) {
    str = "<label>" + colname + "</label>:<input type='checkbox' checked onclick='myTable.toggleColumn(\"" + col + "\")'>";
  } else {
    str = "<label>" + colname + "</label>:<input type='checkbox' onclick='myTable.toggleColumn(\"" + col + "\")'>";
  }

  return str;
}

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------
		
function renderSortOptions(col,status,colname){
		str="";
		if(status==-1){

				if(col=="ccode" || col=="class" || col=="credits" || col=="start_period" || col=="end_period" || col=="students" || col=="study_program"|| col=="tallocated"){
            str+="<span onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"</span>";
        } else if(col=="cname" || col=="comment"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"</span>";
        }else if(col=="time_budget"){
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Budget</span>";
            str+="<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Stud</span>|";
            str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Time</span></div>";
        } else{
            let sign=colname.substring(colname.lastIndexOf(" "),colname.length);
            let fname=colname.substring(0,colname.indexOf(" "));
            let lname=colname.substring(colname.indexOf(" ")+1,colname.lastIndexOf(" "));
            str+="<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>";
            str+="<div style='white-space:nowrap;'>"+fname+" "+lname+"</div> ";				
            str+="<div>"+sign+"</div>";				
            str+="</div>";
				}
		}else{
        if(col=="ccode" || col=="cname" || col=="class" || col=="credits" || col=="start_period" || col=="end_period" || col=="students" || col=="study_program"|| col=="tallocated"){
            if(status==0){
                str+="<div onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"&#x25b4;</div>";
            }else{
                str+="<div onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+colname+"&#x25be;</div>";
            }
        } else if(col=="cname" || col=="comment"){
            //str+="<div class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"</div>";
            if(status==0){
                str+="<div class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"&#x25b4;</div>";
            }else{
                str+="<div class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>"+colname+"&#x25be;</div>";
            }
        }else if(col=="time_budget"){
            if(status==0){
                str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Budget</span>";
                str+="<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Stud</span>|";
                str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>Time&#x25b4;</span></div>";
            }else{
                str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>Budget</span>";
                str+="<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>Stud</span>|";
                str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",0)'>Time&#x25be;</span></div>";              
            }
            //str+="<span class='ellipsis' onclick='myTable.toggleSortStatus(\""+col+"\",1)'>"+colname+"</span>";
        } else{
            let sign=colname.substr(colname.lastIndexOf(" "),colname.length);
            let fname=colname.substr(0,colname.indexOf(" "));
            let lname=colname.substring(colname.indexOf(" ")+1,colname.lastIndexOf(" "));      
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
		
function renderCell(col,celldata,cellid,rowdata,colnames){
    let t="";
    if(col=="ccode"){
        t="<span style='font-family:monospace'>"+celldata+"</span>";
    }else if (col=="cname"||col=="start_period"||col=="end_period") {
        if (celldata==="UNK"){
            t="<div class='ellipsis' style='max-width:300px;'> </div>";
        } else {
            t="<div class='ellipsis' style='max-width:300px;' title='"+celldata+"'>"+celldata+"</div>";        
        }      
    }else if (col=="time_allocation") {
      if(typeof celldata !== 'undefined' && celldata!=="UNK" && celldata!==null){
          console.log(celldata);
          let total=celldata.unspecified+celldata.lecture+celldata.seminar+celldata.supervision+celldata.preparation+celldata.development+celldata.grading+celldata.examination+celldata.running+celldata.other;
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
    } else {        
    }
		return t;
}

//--------------------------------------------------------------------------
// rowFilter
// ---------------
//  Callback function that filters rows in the table
//--------------------------------------------------------------------------
var searchterm = "";
function rowFilter(row) {      
  let data=row;
  let tot=data.time_allocation.unspecified+data.time_allocation.lecture+data.time_allocation.supervision+data.time_allocation.seminar+data.time_allocation.development+data.time_allocation.preparation+data.time_allocation.grading+data.time_allocation.examination+data.time_allocation.running+data.time_allocation.other;

  if(tot==0)return false;
  
  if(searchterm == ""){      
      return true;
  }else{
      for (var property in row) {
          if (row.hasOwnProperty(property)) {
              if (row[property].indexOf != null) {
                if (row[property].indexOf(searchterm) != -1) return true;
              }
          }
      }   
  }
  return false;
}

//--------------------------------------------------------------------------
// compare
// ---------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------
function compare(a,b){
    // Find out which column and part of column are we sorting on from currentTable
    let col=sortableTable.currentTable.getSortcolumn();
    let kind=sortableTable.currentTable.getSortkind();
    // We allways sort none numbers below 
    let tmp=(sortableTable.currentTable.ascending) ? -1000000 : 1000000;

    if (col == "ccode" || col == "cname" || col == "start_period" || col == "end_period" || col == "class" || col == "comment" || col == "study_program"|| col == "tallocated"){
        let tmp=(sortableTable.currentTable.ascending) ? -1 : 1;
        if ( a=="UNK" ) return -tmp;
        if ( b=="UNK" ) return tmp;
        if ( a < b ) return -1; 
        if ( a > b ) return 1; 
        return 0; 
    } else if (col == "credits"){
        
        let left = (isNaN(a)) ? tmp : +a; 
        let right = (isNaN(b)) ? tmp : +b; 
        return left-right;     
    }else if (col == "time_budget"){
        let left;
        let right;
        if(a === null||a==="UNK"){
            left=tmp;
        }else{
            left = a.unspecified+a.lecture+a.supervision+a.seminar+a.development+a.preparation+(a.students*a.grading)+(a.students*a.examination)+(a.students*a.running)+(a.students*a.other);
        }

        if(b === null||b==="UNK"){            
            right=tmp;
        }else{
            right = b.unspecified+b.lecture+b.supervision+b.seminar+b.development+b.preparation+(b.students*b.grading)+(b.students*b.examination)+(b.students*b.running)+(b.students*b.other);
        }                
        
        return left-right;   
    }  else if (col == "students"){
        // We allways sort none numbers below 
        let tmp=(sortableTable.currentTable.ascending) ? -1000000 : 1000000;
        
        let left = (isNaN(a)) ? tmp : +a; 
        let right = (isNaN(b)) ? tmp : +b; 
        return left-right;     
    } else {
        // We allways sort none numbers below 
        let tmp=(sortableTable.currentTable.ascending) ? 1000000 : -1000000;
        let left;
        let right;
        if(a.allocation === null||a.allocation==="UNK"){
            left=tmp;
        }else{
            left = a.allocation.unspecified+a.allocation.lecture+a.allocation.supervision+a.allocation.seminar+a.allocation.development+a.allocation.preparation+a.allocation.other+a.allocation.running+a.allocation.grading+a.allocation.examination;
        }

        if(b.allocation === null||b.allocation==="UNK"){            
            right=tmp;
        }else{
            right = b.allocation.unspecified+b.allocation.lecture+b.allocation.supervision+b.allocation.seminar+b.allocation.development+b.allocation.preparation+b.allocation.other+b.allocation.running+b.allocation.grading+b.allocation.examination;
        }                
        
        return left-right;     
    }  
}

//--------------------------------------------------------------------------
// makeSum
// ---------------
//	makeSum col,value  
//--------------------------------------------------------------------------

function makeSum(col,value){
    if(col=="students"){
        return parseFloat(value);
    } else if(col=="time_budget"){
        //console.log(value);
        let total=0;
        if(value!==null)total=value.unspecified+value.lecture+value.seminar+value.supervision+value.preparation+value.development+value.grading+value.examination+value.running+value.other;        
        return parseFloat(total);
    } else{
				if(value.hours=="UNK"){
						return 0;
				}else{
            //alert(value.hours);
            let total=0;
            if(value !== null){
                total=value.unspecified+value.lecture+value.seminar+value.supervision+value.preparation+value.development+value.grading+value.examination+value.running+value.other;
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
/*
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
*/

//--------------------------------------------------------------------------
// editCell
// ---------------
//  Callback function for showing a cell editing interface
//  We must define the identifying parameter for the row, i.e., the primary key 
//  for the edited cell.
//  *must* define sortableTable.edit_rowid for each column
//--------------------------------------------------------------------------
function displayCellEdit(celldata,rowno,rowelement,cellelement,column,colno,rowdata,coldata,tableid){
    isLocked=true;
    let str="";
    if(column=="students"){
        sortableTable.edit_rowid=rowdata.ciid;
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str+="<input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='"+celldata+"' size='"+celldata.toString().length+"'/>";
        str+="</div>";
    }else if (column=="time_budget"){
        if(celldata===null){
            celldata={
              students:0,
              unspecified:0,
              lecture:0,
              seminar:0,
              supervision:0,
              preparation:0,
              development:0,
              grading:0,
              examination:0,
              running:0,
              other:0,
              status:0
            }
        }
        sortableTable.edit_rowid=rowdata.ciid;
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str+="<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
            str+="<option ";
            if(celldata.status==0){str+="selected";}
            str+=" value='0'>confirmed</option>";
            str+="<option ";
            if(celldata.status==1){str+="selected";}
            str+=" value='1'>unconfirmed</option>";
            str+="<option ";
            if(celldata.status==2){str+="selected";}
            str+=" value='2'>must change</option>";
            str+="<option ";
            if(celldata.status==3){str+="selected";}
            str+=" value='3'>error</option>";
        str+="</select>";            
        str+="<div class='editInput'><label>Students:</label><input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='"+celldata.students+"' size="+celldata.students.toString().length+"/></div>";
        str+="<div class='editInput'><label>Fixed time</label>&nbsp;</div>";
        str+="<div class='editInput'><label>Unspecified:</label><input type='text' id='popoveredit_unspecified' class='popoveredit' style='flex-grow:1' value='"+celldata.unspecified+"' size="+celldata.unspecified.toString().length+"/></div>";
        str+="<div class='editInput'><label>Lecture:</label><input type='text' id='popoveredit_lecture' class='popoveredit' style='flex-grow:1' value='"+celldata.lecture+"' size='"+celldata.lecture.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Seminar:</label><input type='text' id='popoveredit_seminar' class='popoveredit' style='flex-grow:1' value='"+celldata.seminar+"' size='"+celldata.seminar.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Supervision:</label><input type='text' id='popoveredit_supervision' class='popoveredit' style='flex-grow:1' value='"+celldata.supervision+"' size='"+celldata.supervision.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Preparation:</label><input type='text' id='popoveredit_preparation' class='popoveredit' style='flex-grow:1' value='"+celldata.preparation+"' size='"+celldata.preparation.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Development:</label><input type='text' id='popoveredit_development' class='popoveredit' style='flex-grow:1' value='"+celldata.development+"' size='"+celldata.development.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Varying Time</label>&nbsp;</div>";
        str+="<div class='editInput'><label>Grading:</label><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' value='"+celldata.grading+"' size='"+celldata.grading.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Examination:</label><input type='text' id='popoveredit_examination' class='popoveredit' style='flex-grow:1' value='"+celldata.examination+"' size='"+celldata.examination.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Running</label><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' value='"+celldata.running+"' size='"+celldata.running.toString().length+"'/></div>";
        str+="<div class='editInput'><label>Other:</label><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' value='"+celldata.other+"' size='"+celldata.other.toString().length+"'/></div>";
        //str+="<div class='editInput'><label>Total:</label><input type='text' id='popoveredit_total' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.total+"' size='"+celldata.time_budget.total.toString().length+"'/></div>";
        str+="</div>";
    }else if (column=="comment"){
      sortableTable.edit_rowid=rowdata.ciid;
      str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
          str+="<div class='editInput'><label>Comment:</label><input type='text' id='popoveredit_comment' class='popoveredit' style='flex-grow:1' value='"+celldata+"' size="+celldata.toString().length+"/></div>";
      str+="</div>";
    }else if (column=="tallocated"){
        return null;
    }else{
        console.log(celldata)
        var ta;
        if (celldata.allocation=="UNK" || celldata.allocation===null){
            ta={"unspecified":0,"lecture":0,"seminar":0,"supervision":0,"preparation":0,"development":0,"grading":0,"examination":0,"running":0,"other":0,"total":0,"status":0};
            sortableTable.edit_rowid="UNK";
        }else{
            ta=celldata.allocation;
            sortableTable.edit_rowid=celldata.teid;
        }
        str+="<div style='display:flex;flex-direction:column;flex-grow:1;'>";
            str+="<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
            str+="<option ";
            if(celldata.status==0){str+="selected";}
            str+=" value='0'>confirmed</option>";
            str+="<option ";
            if(celldata.status==1){str+="selected";}
            str+=" value='1'>unconfirmed</option>";
            str+="<option ";
            if(celldata.status==2){str+="selected";}
            str+=" value='2'>must change</option>";
            str+="<option ";
            if(celldata.status==3){str+="selected";}
            str+=" value='3'>error</option>";
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
function updateCellCallback(rowno,colno,column,tableid,oldvalue,rowid){
    oldvalue=sortableTable.edit_celldata;    
    isLocked=false;
    // Make AJAX call and return 
    if(column=="students"){        
        var newvalue=oldvalue;
        var newcelldata=parseInt(document.getElementById("popoveredit_students").value);
        if(isNaN(newcelldata)){
            return -1;// This must be handled
        }else{
            newvalue=newcelldata;
            updateDB(tableid,rowid,column,newvalue,"COURSEINSTANCE");
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
    }else if(column=="time_budget"){
        //console.log(rowno,colno,column,tableid,oldvalue);
        if(oldvalue===null){
            oldvalue={
              students:0,
              unspecified:0,
              lecture:0,
              seminar:0,
              supervision:0,
              preparation:0,
              development:0,
              grading:0,
              examination:0,
              running:0,
              other:0,
              status:0
            }
        }
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
            grading:parseFloat(document.getElementById("popoveredit_grading").value.replace(",",".")),
            examination:parseFloat(document.getElementById("popoveredit_examination").value.replace(",",".")),
            running:parseFloat(document.getElementById("popoveredit_running").value.replace(",",".")),
            other:parseFloat(document.getElementById("popoveredit_other").value.replace(",",".")),
            //total:parseInt(document.getElementById("popoveredit_total").value),
            status:parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };        
        newvalue=obj;
        //newvalue.status=parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value);
        //newvalue.hours=0;
        updateDB(tableid,rowid,column,newvalue,"COURSEINSTANCE");
        return newvalue;
    }else if(column=="comment"){
        //console.log(rowno,colno,column,tableid,oldvalue);
        var newvalue=oldvalue;
        newvalue.comment=document.getElementById("popoveredit_comment").value;
        updateDB(tableid,rowid,column,newvalue,"COURSEINSTANCE");
        return newvalue;
    }else{     
        var newvalue;
        if(oldvalue!==null){
            newvalue=oldvalue;
        }else{
            newvalue={allocation:"UNK",hours:"UNK",status:"UNK",teid:"UNK",tid:"UNK",ciid:"UNK"};
        }
        var obj={
            unspecified:parseInt(document.getElementById("popoveredit_unspecified").value),
            lecture:parseInt(document.getElementById("popoveredit_lecture").value),
            seminar:parseInt(document.getElementById("popoveredit_seminar").value),
            supervision:parseInt(document.getElementById("popoveredit_supervision").value),
            preparation:parseInt(document.getElementById("popoveredit_preparation").value),
            development:parseInt(document.getElementById("popoveredit_development").value),
            grading:parseFloat(document.getElementById("popoveredit_grading").value.replace(",",".")),
            examination:parseFloat(document.getElementById("popoveredit_examination").value.replace(",",".")),
            running:parseFloat(document.getElementById("popoveredit_running").value.replace(",",".")),
            other:parseFloat(document.getElementById("popoveredit_other").value.replace(",",".")),
            status:parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };        
        newvalue.allocation=obj;
        newvalue.status=parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value);
        newvalue.hours=0;
        newvalue.ciid=
        updateDB(tableid,rowid,column,newvalue,"TEACHING");
        return newvalue;
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
    var id="UNK";
    var command;
    if(dbtbl=="TEACHING"){
        id=rowno;
        command="UPDATETEACHING";
        /*
        if(id!=="UNK"){
            command="UPDATETEACHING";
        }else{
            command="INSERTTEACHING";
        } 
        */     
    }else if(dbtbl=="COURSEINSTANCE"){
        id=rowno;
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
