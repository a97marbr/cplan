/*
*
* Constants from Henrik S's budget model
*
*/
const HOURS_PER_HP=17;
const HOURS_PER_STUDENT=3;
const HOURS_PER_STUDENT_FINAL_YEAR_PROJECT=30;
const FINANCIAL_CONSTANT=1.0763;

var serviceData=null;
var isLocked = false;
var sprogram;
var myTable;

function calcSum(el)
{
    let tmp=el.id.split("_");
    let students=Number($("#"+tmp[0]+"_students").val());
    let amount=Number(el.value);
    console.log(students,amount)
    if(!isNaN(students)&&!isNaN(amount)){
        $("#"+el.id+"_sum").html((students*amount))
    }
}

function dropdown(el) {
    document.getElementById("dropdown_" + el).classList.toggle("show");
}

function showTooltip(el,data)
{
    const allocations = Object.entries(data);
    let elpos=el.getBoundingClientRect();
    let str="";
    str+="<div style='background-color:#FFF;box-shadow:4px 4px 10px #000;'>"
    str+="<table>";
    for(const [allocationtype,allocation] of allocations){
        str+="<tr>";
        str+="<td>"+allocationtype+":</td>"
        str+="<td>"+allocation+"</td>";
        str+="</tr>";    
    }
    str+="</table>";
    str+="</div>";
    $("#tooltip").html(str);
    $("#tooltip").css({left:elpos.left+"px",top:elpos.bottom+"px"});
    $("#tooltip").show();
}

function hideTooltip()
{
    $("#tooltip").hide();
    $("#tooltip").html("");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
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

function getData() {
    if ($('#year').prop("selectedIndex") === 0) {        
        $("#year").val($("#year option:first").val());    
    }
    let year = $('#year').val();

    if ($('#sprogram').prop("selectedIndex") === 0) {        
        $("#sprogram").val($("#sprogram option:first").val());    
    }
    let sprogram = $('#sprogram').val();

    var sign = "BROM";
    var status = "UNK";
    var teid = "UNK";
    var hours = "UNK";
    var op = "GETDATA";
    let params = {
        year: year,
        sprogram: sprogram,
        sign: sign,
        teid: teid,
        hours: hours,
        status: status
    }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'course_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(dataReturned)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function dataReturned(json) {
    //alert( "success"+data );
    //let json = JSON.parse(data);
    serviceData=json;
    $("#title-year").html(json.params.year);
    $('#year').val(json.params.year);
    $('#sprogram').val(json.params.sprogram);
    var colsums = ["students", "time_budget"];    

    myTable = new SortableTable({
        data: json.data.courses_table.tbldata,
        tableElementId: "c",
        filterElementId: "columnFilter",
        renderCellCallback: renderCell,
        renderSortOptionsCallback: renderSortOptions,
        renderColumnFilterCallback: renderColumnFilter,
        rowFilterCallback: rowFilter,
        columnOrder: json.data.courses_table.columnOrder,
        columnSumCallback: makeSum,
        columnSum: colsums,
        displayCellEditCallback: displayCellEdit,
        updateCellCallback: updateCellCallback,
        preRenderCallback:preRender,
        freezePaneIndex: 2,
        hasRowHighlight: true,
        hasMagicHeadings: true,
        hasCounterColumn: true
    });

    var colorder = myTable.getColumnOrder();
    for (let k = 0; k < colorder.length; k++) {
        if (colorder[k] === "totalAllocation") {
            colorder.splice(k, 1);
            break;
        }
    }
    for (let k = 0; k < colorder.length; k++) {
        if (colorder[k] === "time_budget") {
            colorder.splice(k + 1, 0, "hsbudget","totalAllocation");
            break;
        }
    }
    myTable.reorderColumns(colorder);
    myTable.renderTable();

}

//------------==========########### FUNCTIONZ ###########==========------------

function preRender(tbl){
    let tblbody=tbl.tblbody;
    let rownum=0;
    let row=null;
    while(row=tbl.getRow(rownum)){
        let tot={unspecified:0,lecture:0,seminar:0,supervision:0,preparation:0,development:0,grading:0,examination:0,running:0,other:0};
        let totKeys=Object.keys(tot);
        const entries = Object.entries(row)
        for(const [cell, value] of entries){
            if(cell.startsWith("teacher_")){
                let ta=value.allocation;                
                if(typeof ta === 'object' && ta !== null){
                    for(const alloctype of totKeys){
                        tot[alloctype]+=ta[alloctype];       
                    }
                }
    
            }            
        }
        row["totalAllocation"]=tot;               
        let s=0;
        if(row["time_budget"]!==null){
            s=row["time_budget"]["students"];
        }

        //
        // Henrik Svensson course budget model 2019
        //
        let c=0;
        if(!isNaN(row["credits"])){
            c=row["credits"];
        }
        if(row["cname"].startsWith("Examensarbete")){
            row["hsbudget"]=Math.round((s*HOURS_PER_STUDENT_FINAL_YEAR_PROJECT));
        }else{
            row["hsbudget"]=Math.round((c*HOURS_PER_HP)+(s*HOURS_PER_STUDENT));
        }        

        rownum++;
    }        
}


//--------------------------------------------------------------------------
// renderColumnFilter
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderColumnFilter(col, status, colname) {
    str = "<div>";
    if (status) {
        str+="<input id='"+colname+"_"+col+"' type='checkbox' checked onchange='myTable.toggleColumn(\"" + col + "\")'>"
        str+="<label for='"+colname+"_"+col+"'>" + colname + "</label>";
    } else {
        str+="<input id='"+colname+"_"+col+"' type='checkbox' onchange='myTable.toggleColumn(\"" + col + "\")'>"
        str+="<label for='"+colname+"_"+col+"'>" + colname + "</label>";
    }
    str+="</div>";

    return str;
}

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderSortOptions(col, status, colname) {
    str = "";
    if (status == -1) {

        if (col == "ccode" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "study_program" || col == "tallocated"|| col == "examinators"|| col == "coordinator") {
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
        } else if ( col == "students") {            
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Actual #<br>" + colname + "</span>";
        }else if ( col == "hsbudget") {            
            str += "<span title='Formula\n\nHOURS_PER_CREDIT=17\nHOURS_PER_STUDENT=3\n\nCOURSE_TOT=(CREDITS*HOURS_PER_CREDITS)+(STUDENTS*HOURS_PER_STUDENTS)' class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname.replace(/\s([^\s]*)$/, "<br>" + "$1") + "</span>";
        }else if (col == "cname" || col == "comment" || col == "totalAllocation") {
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
        } else if (col == "time_budget") {
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Budget</span>";
            str += "<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Stud</span>|";
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Time</span></div>";
        } else {
            let sign = colname.substring(colname.lastIndexOf(" "), colname.length);
            let fname = colname.substring(0, colname.indexOf(" "));
            let lname = colname.substring(colname.indexOf(" ") + 1, colname.lastIndexOf(" "));
            str += "<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>";
            str += "<div style='white-space:nowrap;'>" + fname + " " + lname + "</div> ";
            str += "<div>" + sign + "</div>";
            str += "</div>";
        }
    } else {
        if (col == "ccode" || col == "cname" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "study_program" || col == "tallocated"|| col == "examinators"|| col == "coordinator") {
            if (status == 0) {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
            }
        } else if (col == "students") {
            if (status == 0) {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Actual #<br>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Actual #<br>" + colname + "&#x25be;</div>";
            }
        }else if (col == "cname" || col == "comment"|| col == "totalAllocation") {
            if (status == 0) {
                str += "<div class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
            }
        } else if (col == "time_budget") {
            if (status == 0) {
                str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Budget</span>";
                str += "<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Stud</span>|";
                str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Time&#x25b4;</span></div>";
            } else {
                str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Budget</span>";
                str += "<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Stud</span>|";
                str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>Time&#x25be;</span></div>";
            }
        }else if ( col == "hsbudget") {            
            if (status == 0) {
                //str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
                str += "<span title='Formula\n\nHOURS_PER_CREDIT=17\nHOURS_PER_STUDENT=3\n\nCOURSE_TOT=(CREDITS*HOURS_PER_CREDITS)+(STUDENTS*HOURS_PER_STUDENTS)' class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname.replace(/\s([^\s]*)$/, "<br>" + "$1") + "&#x25b4;</span>";
                } else {
                //str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
                str += "<span title='Formula\n\nHOURS_PER_CREDIT=17\nHOURS_PER_STUDENT=3\n\nCOURSE_TOT=(CREDITS*HOURS_PER_CREDITS)+(STUDENTS*HOURS_PER_STUDENTS)' class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname.replace(/\s([^\s]*)$/, "<br>" + "$1") + "&#x25be;</span>";
                }
        } else {
            let sign = colname.substr(colname.lastIndexOf(" "), colname.length);
            let fname = colname.substr(0, colname.indexOf(" "));
            let lname = colname.substring(colname.indexOf(" ") + 1, colname.lastIndexOf(" "));
            if (status == 0) {
                str += "<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>";
                str += "<div style='white-space:nowrap;'>" + fname + " " + lname + " &#x25b2;</div> ";
                str += "<div>" + sign + "</div>";
                str += "</div>";
            } else {
                str += "<div style='display:inline-block;margin:0 15px;' onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>";
                str += "<div style='white-space:nowrap;'>" + fname + " " + lname + " &#x25bc;</div> ";
                str += "<div>" + sign + "</div>";
                str += "</div>";
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

function renderCell(col, celldata, cellid, rowdata, colnames) {
    let t = "";
    if (col == "ccode") {
        t = "<span style='font-family:monospace'>" + celldata + "</span>";
    } else if (col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "tallocated"|| col == "hsbudget") {
        t = "<div style='text-align:center'>"+celldata+"</div>";
    } else if (col == "students") {
        t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"students\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"" + celldata.students + "\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>" + celldata + "</div>";
    } else if (col == "lecture_time") {
        t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"lectureTime\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"" + celldata.lectureTime + "\",\"UNK\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>" + celldata + "</div>";
    } else if (col == "supervise_time") {
        t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"superviseTime\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"" + celldata.superviseTime + "\",\"UNK\")' style='text-align:center;' placeholder='Enter comment'>" + celldata + "</div>";
    } else if (col == "student_time") {
        t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"studentTime\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\",\"" + celldata.studentTime + "\")' style='text-align:center;' placeholder='Enter comment'>" + celldata + "</div>";
    } else if (col == "time_budget") {
        // lecture / seminar / supervision / preparation / development / grading / examination / running / other / total        
        if (celldata === null) {
            celldata = {
                students: 0,
                unspecified: 0,
                lecture: 0,
                seminar: 0,
                supervision: 0,
                preparation: 0,
                development: 0,
                grading: 0,
                examination: 0,
                running: 0,
                other: 0,
                status: 0
            }
        }
        let students = parseInt(celldata.students);
        let total = celldata.unspecified + celldata.lecture + celldata.seminar + celldata.supervision + celldata.preparation + celldata.development + (celldata.grading * students) + (celldata.examination * students) + (celldata.running * students) + (celldata.other * students);
        let sclass = "";
        if (celldata.status == 0) {
            sclass = "confirmed";
        } else if (celldata.status == 1) {
            sclass = "unconfirmed";
        } else if (celldata.status == 2) {
            sclass = "mustchange";
        } else {
            sclass = "error";
        }
        t = "<div id='datacell_" + cellid + "' style='text-align:center;display:flex;justify-content:space-between;padding:0 5px;' class='" + sclass + "'><div style='margin-right:15px;'>" + celldata.students + "</div><div>" + total + "</div></div>";
        t += "</div>";
    } else if (col == "study_program") {
        if (celldata === "UNK") {
            t = "<span> </span>";
        } else {
            t = celldata;
        }
    } else if (col == "comment") {
        if (celldata === "UNK") {
            //t="<span  style='border-left:1px solid #000'> </span>";
            t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"UNKUNK\",\"UNK\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:left;border-left:1px solid #000;padding-left:5px;' placeholder='Enter comment'>&nbsp;</div>";
        } else {
            //t="<span class='ellipsis' style='border-left:1px solid #000'>"+celldata+"</span>";        
            t = "<div class='ellipsis' id='datacell_" + cellid + "' ondblclick='makeEditbox(\"UPDATE_COURSE_INSTANCE\",\"" + cellid + "\",\"UNK\"," + celldata.ciid + ",\"UNK\",\"UNK\",\"UNK\",\"" + celldata.comment + "\",\"UNK\",\"UNK\",\"UNK\",\"UNK\")' style='text-align:left;border-left:1px solid #000;padding-left:5px;' placeholder='Enter comment'>" + celldata + "</div>";
        }
    } else if (col == "cname") {
        if (celldata === "UNK") {
            t = "<div class='ellipsis' style='max-width:300px;'> </div>";
        } else {
            t = "<div class='ellipsis' style='max-width:300px;' title='" + celldata + "'>" + celldata + "</div>";
        }
    } else if (col.indexOf("teacher_") == 0) {
        if (typeof celldata.allocation !== 'undefined' && celldata.allocation !== "UNK" && celldata.allocation !== null) {
            let total = celldata.allocation.unspecified + celldata.allocation.lecture + celldata.allocation.seminar + celldata.allocation.supervision + celldata.allocation.preparation + celldata.allocation.development + celldata.allocation.grading + celldata.allocation.examination + celldata.allocation.running + celldata.allocation.other;
            let sclass = "";
            if (celldata.status == 0) {
                sclass = "confirmed";
            } else if (celldata.status == 1) {
                sclass = "unconfirmed";
            } else if (celldata.status == 2) {
                sclass = "mustchange";
            } else {
                sclass = "error";
            }
            t = "<div id='datacell_" + cellid + "' style='text-align:center' class='" + sclass + "'>" + total + "</div>";
        }
    }else if (col === "totalAllocation") {
        if (typeof celldata !== 'undefined' && celldata !== "UNK" && celldata !== null) {
            let total = celldata.unspecified + celldata.lecture + celldata.seminar + celldata.supervision + celldata.preparation + celldata.development + celldata.grading + celldata.examination + celldata.running + celldata.other;
            let sclass = "";
            if (celldata.status == 0) {
                sclass = "confirmed";
            } else if (celldata.status == 1) {
                sclass = "unconfirmed";
            } else if (celldata.status == 2) {
                sclass = "mustchange";
            } else {
                sclass = "error";
            }
            t = "<div id='tacell_" + cellid + "' onmouseover='showTooltip(this,"+JSON.stringify(celldata)+");' onmouseout='hideTooltip();' style='text-align:center;position:relative;' class='" + sclass + "'>" + total + "</div>";
        }
    } else if (col == "coordinator") {
        console.log("coordinator",celldata)
        teacherstr="Saknas";
        if(typeof serviceData.data.teachers[celldata] !== "undefined"){
            teacher=serviceData.data.teachers[celldata];
            teacherstr=teacher.sign;
        }
        t = "<span>" + teacherstr + "</span>";
    } else if (col == "examinators") {
        console.log("examinators",celldata)
        t = "<span>" + celldata + "</span>";
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
    
    let ret=false;
    if (searchterm == "") {
        ret=true;
    } else {
        const cols=Object.entries(row);
        for (const [colname,colval] of cols) {
            if (colname==="cname" || colname === "study_program"|| colname === "credits"|| colname === "ccode"|| colname === "class") {
                if (typeof colval !== "undefined") {
                    if ((""+colval).toLowerCase().indexOf(searchterm.toLowerCase()) != -1) {
                        ret=true;
                    }
                }
            }
        }
    }

    return ret;
}

//--------------------------------------------------------------------------
// compare
// ---------------
//  Callback function with different compare alternatives for the column sort
//--------------------------------------------------------------------------
function compare(a, b) {
    // Find out which column and part of column are we sorting on from currentTable
    let col = sortableTable.currentTable.getSortcolumn();
    let kind = sortableTable.currentTable.getSortkind();
    // We allways sort none numbers below 
    let tmp = (sortableTable.currentTable.ascending) ? -1000000 : 1000000;

    if (col == "ccode" || col == "cname" || col == "start_period" || col == "end_period" || col == "class" || col == "comment" || col == "study_program" || col == "tallocated"|| col == "examinators"|| col == "coordinator") {
        //let tmp = (sortableTable.currentTable.ascending) ? -1 : 1;    
        if(kind===0){
            if (a == "UNK") tmp=-tmp;
            if (b == "UNK") tmp=tmp;
            if (a===b) tmp=0;
            if (a < b) tmp=-1;
            if (a > b) tmp= 1;    
        }else{
            if (a == "UNK") tmp=tmp;
            if (b == "UNK") tmp=-tmp;
            if (a===b) tmp=0;
            if (a < b) tmp=1;
            if (a > b) tmp=-1;    
        }    
        return tmp;        
    } else if (col == "credits" || col == "hsbudget") {        
        let left = (isNaN(a)) ? tmp : +a;
        let right = (isNaN(b)) ? tmp : +b;
        if(kind===0){
            return left - right;
        }else{
            return right - left;
        }
        
    } else if (col == "time_budget") {
        let left;
        let right;        
        if (a === null || a === "UNK") {
            left = tmp;
        } else {
            left = a.unspecified + a.lecture + a.supervision + a.seminar + a.development + a.preparation + (a.students * a.grading) + (a.students * a.examination) + (a.students * a.running) + (a.students * a.other);
        }

        if (b === null || b === "UNK") {
            right = tmp;
        } else {
            right = b.unspecified + b.lecture + b.supervision + b.seminar + b.development + b.preparation + (b.students * b.grading) + (b.students * b.examination) + (b.students * b.running) + (b.students * b.other);
        }

        if(kind===0){
            return left - right;
        }else{
            return right - left;
        }
    } else if (col == "totalAllocation") {
        let left;
        let right;        
        if (a === null || a === "UNK") {
            left = tmp;
        } else {
            left = a.unspecified + a.lecture + a.supervision + a.seminar + a.development + a.preparation + a.grading + a.examination + a.running + a.other;
        }

        if (b === null || b === "UNK") {
            right = tmp;
        } else {
            right = b.unspecified + b.lecture + b.supervision + b.seminar + b.development + b.preparation + b.grading + b.examination + b.running + b.other;
        }

        if(kind===0){
            return left - right;
        }else{
            return right - left;
        }
    } else if (col == "students") {
        // We allways sort none numbers below 
        let tmp = (sortableTable.currentTable.ascending) ? -1000000 : 1000000;

        let left = (isNaN(a)) ? tmp : +a;
        let right = (isNaN(b)) ? tmp : +b;
        if(kind===0){
            return left - right;
        }else{
            return right - left;
        }
    } else {
        // We allways sort none numbers below 
        let tmp = (sortableTable.currentTable.ascending) ? 1000000 : -1000000;
        let left;
        let right;
        if (typeof a === "undefined" || a.allocation === null || a.allocation === "UNK") {
            left = tmp;
        } else {
            left = a.allocation.unspecified + a.allocation.lecture + a.allocation.supervision + a.allocation.seminar + a.allocation.development + a.allocation.preparation + a.allocation.other + a.allocation.running + a.allocation.grading + a.allocation.examination;
        }

        if (typeof b === "undefined" || b.allocation === null || b.allocation === "UNK") {
            right = tmp;
        } else {
            right = b.allocation.unspecified + b.allocation.lecture + b.allocation.supervision + b.allocation.seminar + b.allocation.development + b.allocation.preparation + b.allocation.other + b.allocation.running + b.allocation.grading + b.allocation.examination;
        }

        if(kind===0){
            return left - right;
        }else{
            return right - left;
        }
    }
}

//--------------------------------------------------------------------------
// makeSum
// ---------------
//	makeSum col,value  
//--------------------------------------------------------------------------

function makeSum(col, value) {
    if (col == "students") {
        return parseFloat(value);
    } else if (col == "time_budget") {
        //console.log(value);
        let total = 0;
        if (value !== null) total = value.unspecified + value.lecture + value.seminar + value.supervision + value.preparation + value.development + value.grading + value.examination + value.running + value.other;
        return parseFloat(total);
    } else {
        if (value.hours == "UNK") {
            return 0;
        } else {
            //alert(value.hours);
            let total = 0;
            if (value.allocation !== null) {
                total = value.allocation.unspecified + value.allocation.lecture + value.allocation.seminar + value.allocation.supervision + value.allocation.preparation + value.allocation.development + value.allocation.grading + value.allocation.examination + value.allocation.running + value.allocation.other;
            }
            return parseFloat(total);
        }
    }
    return 0;
}

//--------------------------------------------------------------------------
// editCell
// ---------------
//  Callback function for showing a cell editing interface
//  We must define the identifying parameter for the row, i.e., the primary key 
//  for the edited cell.
//  *must* define sortableTable.edit_rowid for each column
//--------------------------------------------------------------------------
function displayCellEdit(celldata, rowno, rowelement, cellelement, column, colno, rowdata, coldata, tableid) {
    isLocked = true;
    let str = "";
    if (column == "students") {
        sortableTable.edit_rowid = rowdata.ciid;
        str += "<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str += "<input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='" + celldata + "' size='" + celldata.toString().length + "'/>";
        str += "</div>";
    } else if (column == "time_budget") {
        if (celldata === null) {
            celldata = {
                students: 0,
                unspecified: 0,
                lecture: 0,
                seminar: 0,
                supervision: 0,
                preparation: 0,
                development: 0,
                grading: 0,
                examination: 0,
                running: 0,
                other: 0,
                status: 0
            }
        }
        sortableTable.edit_rowid = rowdata.ciid;
        str += "<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str += "<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
        str += "<option ";
        if (celldata.status == 0) { str += "selected"; }
        str += " value='0'>confirmed</option>";
        str += "<option ";
        if (celldata.status == 1) { str += "selected"; }
        str += " value='1'>unconfirmed</option>";
        str += "<option ";
        if (celldata.status == 2) { str += "selected"; }
        str += " value='2'>must change</option>";
        str += "<option ";
        if (celldata.status == 3) { str += "selected"; }
        str += " value='3'>error</option>";
        str += "</select>";
        str += "<div class='editInput'><label>Students:</label><input type='text' id='popoveredit_students' class='popoveredit' style='flex-grow:1' value='" + celldata.students + "' size=" + celldata.students.toString().length + "/></div>";
        str += "<div class='editInput'><label>Fixed time</label>&nbsp;</div>";
        str += "<div class='editInput'><label>Unspecified:</label><input type='text' id='popoveredit_unspecified' class='popoveredit' style='flex-grow:1' value='" + celldata.unspecified + "' size=" + celldata.unspecified.toString().length + "/></div>";
        str += "<div class='editInput'><label>Lecture:</label><input type='text' id='popoveredit_lecture' class='popoveredit' style='flex-grow:1' value='" + celldata.lecture + "' size='" + celldata.lecture.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Seminar:</label><input type='text' id='popoveredit_seminar' class='popoveredit' style='flex-grow:1' value='" + celldata.seminar + "' size='" + celldata.seminar.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Supervision:</label><input type='text' id='popoveredit_supervision' class='popoveredit' style='flex-grow:1' value='" + celldata.supervision + "' size='" + celldata.supervision.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Preparation:</label><input type='text' id='popoveredit_preparation' class='popoveredit' style='flex-grow:1' value='" + celldata.preparation + "' size='" + celldata.preparation.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Development:</label><input type='text' id='popoveredit_development' class='popoveredit' style='flex-grow:1' value='" + celldata.development + "' size='" + celldata.development.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Varying Time</label>&nbsp;</div>";
        str += "<div class='editInput'><label>Grading:</label><div style='display:flex;'><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' onkeyup='calcSum(this)' value='" + celldata.grading + "' size='" + celldata.grading.toString().length + "'/><span id='popoveredit_grading_sum'>"+celldata.students*celldata.grading+"</span></div></div>";
        str += "<div class='editInput'><label>Examination:</label><div style='display:flex;'><input type='text' id='popoveredit_examination' onkeyup='calcSum(this)' class='popoveredit' style='flex-grow:1' value='" + celldata.examination + "' size='" + celldata.examination.toString().length + "'/><span id='popoveredit_examination_sum'>"+celldata.students*celldata.examination+"</span></div></div>";
        str += "<div class='editInput'><label>Running</label><div style='display:flex;'><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' onkeyup='calcSum(this)' value='" + celldata.running + "' size='" + celldata.running.toString().length + "'/><span id='popoveredit_running_sum'>"+celldata.students*celldata.running+"</span></div></div>";
        str += "<div class='editInput'><label>Other:</label><div style='display:flex;'><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' onkeyup='calcSum(this)' value='" + celldata.other + "' size='" + celldata.other.toString().length + "'/><span id='popoveredit_other_sum'>"+celldata.students*celldata.other+"</span></div></div>";
        //str+="<div class='editInput'><label>Total:</label><input type='text' id='popoveredit_total' class='popoveredit' style='flex-grow:1' value='"+celldata.time_budget.total+"' size='"+celldata.time_budget.total.toString().length+"'/></div>";
        str += "</div>";
    } else if (column == "comment") {
        sortableTable.edit_rowid = rowdata.ciid;
        str += "<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        if (celldata === "UNK") {
            str += "<div class='editInput'><label>Comment:</label><input type='text' id='popoveredit_comment' class='popoveredit' style='flex-grow:1' value='' size='3'/></div>";
        } else {
            str += "<div class='editInput'><label>Comment:</label><input type='text' id='popoveredit_comment' class='popoveredit' style='flex-grow:1' value='" + celldata + "' size=" + celldata.toString().length + "/></div>";
        }
        str += "</div>";
    } else if (column == "tallocated") {
        return null;
    } else {
        var ta;
        if (celldata.allocation == "UNK" || celldata.allocation === null) {
            ta = { "unspecified": 0, "lecture": 0, "seminar": 0, "supervision": 0, "preparation": 0, "development": 0, "grading": 0, "examination": 0, "running": 0, "other": 0, "total": 0, "status": 0 };
            sortableTable.edit_rowid = "UNK";
        } else {
            ta = celldata.allocation;
            sortableTable.edit_rowid = celldata.teid;
        }
        str += "<div style='display:flex;flex-direction:column;flex-grow:1;'>";
        str += "<div class='editInput'><label>Status:</label><select id='popoveredit_status' class='popoveredit' style='width:100%;padding:0;'>";
        str += "<option ";
        if (celldata.status == 0) { str += "selected"; }
        str += " value='0'>confirmed</option>";
        str += "<option ";
        if (celldata.status == 1) { str += "selected"; }
        str += " value='1'>unconfirmed</option>";
        str += "<option ";
        if (celldata.status == 2) { str += "selected"; }
        str += " value='2'>must change</option>";
        str += "<option ";
        if (celldata.status == 3) { str += "selected"; }
        str += " value='3'>error</option>";
        str += "</select>";
        str += "<div class='editInput'><label>Unspecified:</label><input type='text' id='popoveredit_unspecified' class='popoveredit' style='flex-grow:1' value='" + ta.unspecified + "' size=" + ta.unspecified.toString().length + "/></div>";
        str += "<div class='editInput'><label>Lecture:</label><input type='text' id='popoveredit_lecture' class='popoveredit' style='flex-grow:1' value='" + ta.lecture + "' size=" + ta.lecture.toString().length + "/></div>";
        str += "<div class='editInput'><label>Seminar:</label><input type='text' id='popoveredit_seminar' class='popoveredit' style='flex-grow:1' value='" + ta.seminar + "' size=" + ta.seminar.toString().length + "/></div>";
        str += "<div class='editInput'><label>Supervision:</label><input type='text' id='popoveredit_supervision' class='popoveredit' style='flex-grow:1' value='" + ta.supervision + "' size=" + ta.supervision.toString().length + "/></div>";
        str += "<div class='editInput'><label>Preparation:</label><input type='text' id='popoveredit_preparation' class='popoveredit' style='flex-grow:1' value='" + ta.preparation + "' size=" + ta.preparation.toString().length + "/></div>";
        str += "<div class='editInput'><label>Development:</label><input type='text' id='popoveredit_development' class='popoveredit' style='flex-grow:1' value='" + ta.development + "' size=" + ta.development.toString().length + "/></div>";
        str += "<div class='editInput'><label>Grading:</label><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' value='" + ta.grading + "' size=" + ta.grading.toString().length + "/></div>";
        str += "<div class='editInput'><label>Examination:</label><input type='text' id='popoveredit_examination' class='popoveredit' style='flex-grow:1' value='" + ta.examination + "' size=" + ta.examination.toString().length + "/></div>";
        str += "<div class='editInput'><label>Running</label><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' value='" + ta.running + "' size=" + ta.running.toString().length + "/></div>";
        str += "<div class='editInput'><label>Other:</label><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' value='" + ta.other + "' size=" + ta.other.toString().length + "/></div>";
        str += "</div>";
        str += "</div>";
    }
    return str;
}

//--------------------------------------------------------------------------
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function updateCellCallback(rowno, colno, column, tableid, oldvalue, rowid) {
    oldvalue = sortableTable.edit_celldata;
    isLocked = false;
    // Make AJAX call and return 
    if (column == "students") {
        var newvalue = oldvalue;
        var newcelldata = parseInt(document.getElementById("popoveredit_students").value);
        if (isNaN(newcelldata)) {
            return -1;// This must be handled
        } else {
            newvalue = newcelldata;
            updateDB(tableid, rowid, column, newvalue, "UPDATECOURSEINSTANCE_STUDENTS");
            return newvalue;
        }
    } else if (column == "num") {
        var newcelldata = parseInt(document.getElementById("popoveredit0").value);
        if (isNaN(newcelldata)) {
            return -1;// This must be handled
        } else {
            updateDB(tableid, rowno, column, newcelldata);
            return newcelldata;
        }
    } else if (column == "time_budget") {
        //console.log(rowno,colno,column,tableid,oldvalue);
        if (oldvalue === null) {
            oldvalue = {
                students: 0,
                unspecified: 0,
                lecture: 0,
                seminar: 0,
                supervision: 0,
                preparation: 0,
                development: 0,
                grading: 0,
                examination: 0,
                running: 0,
                other: 0,
                status: 0
            }
        }
        var newvalue = oldvalue;
        newvalue.students = parseInt(document.getElementById("popoveredit_students").value);
        var obj = {
            students: parseInt(document.getElementById("popoveredit_students").value),
            unspecified: parseInt(document.getElementById("popoveredit_unspecified").value),
            lecture: parseInt(document.getElementById("popoveredit_lecture").value),
            seminar: parseInt(document.getElementById("popoveredit_seminar").value),
            supervision: parseInt(document.getElementById("popoveredit_supervision").value),
            preparation: parseInt(document.getElementById("popoveredit_preparation").value),
            development: parseInt(document.getElementById("popoveredit_development").value),
            grading: parseFloat(document.getElementById("popoveredit_grading").value.replace(",", ".")),
            examination: parseFloat(document.getElementById("popoveredit_examination").value.replace(",", ".")),
            running: parseFloat(document.getElementById("popoveredit_running").value.replace(",", ".")),
            other: parseFloat(document.getElementById("popoveredit_other").value.replace(",", ".")),
            status: parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };
        newvalue = obj;
        updateDB(tableid, rowid, column, newvalue, "UPDATECOURSEINSTANCE_TIMEBUDGET");
        return newvalue;
    } else if (column == "comment") {
        var newvalue = "";
        if (oldvalue === "UNK") newvalue = oldvalue;
        newvalue = document.getElementById("popoveredit_comment").value;
        updateDB(tableid, rowid, column, newvalue, "UPDATECOURSEINSTANCE_COMMENT");
        return newvalue;
    } else {
        var newvalue;
        if (oldvalue !== null) {
            newvalue = oldvalue;
        } else {
            newvalue = { allocation: "UNK", hours: "UNK", status: "UNK", teid: "UNK", tid: "UNK", ciid: "UNK" };
        }
        var obj = {
            unspecified: parseInt(document.getElementById("popoveredit_unspecified").value),
            lecture: parseInt(document.getElementById("popoveredit_lecture").value),
            seminar: parseInt(document.getElementById("popoveredit_seminar").value),
            supervision: parseInt(document.getElementById("popoveredit_supervision").value),
            preparation: parseInt(document.getElementById("popoveredit_preparation").value),
            development: parseInt(document.getElementById("popoveredit_development").value),
            grading: parseFloat(document.getElementById("popoveredit_grading").value.replace(",", ".")),
            examination: parseFloat(document.getElementById("popoveredit_examination").value.replace(",", ".")),
            running: parseFloat(document.getElementById("popoveredit_running").value.replace(",", ".")),
            other: parseFloat(document.getElementById("popoveredit_other").value.replace(",", ".")),
            status: parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value)
        };
        newvalue.allocation = obj;
        newvalue.status = parseInt(document.getElementById("popoveredit_status").options[document.getElementById("popoveredit_status").selectedIndex].value);
        newvalue.hours = 0;
        newvalue.ciid =
            updateDB(tableid, rowid, column, newvalue, "UPDATETEACHING");
        return newvalue;
    }
}

//--------------------------------------------------------------------------
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function clearUpdateCell() {
    isLocked = false;
}

//--------------------------------------------------------------------------
// updateDB
// ---------------
// AJAX call to update cell value in database on server
//--------------------------------------------------------------------------
function updateDB(tableid, rowno, col, val, op) {
    //let op;
    /*
    if (dbtbl == "TEACHING") {
        op = "UPDATETEACHING";
    } else if (dbtbl == "COURSEINSTANCE") {
        op = "UPDATECOURSEINSTANCE";
    }*/
    if ($('#year').prop("selectedIndex") === 0) {        
        $("#year").val($("#year option:first").val());    
    }
    let year = $('#year').val();

    if ($('#sprogram').prop("selectedIndex") === 0) {        
        $("#sprogram").val($("#sprogram option:first").val());    
    }
    let sprogram = $('#sprogram').val();

    let params={        
        update:{ "updatecol": col, "updatetable": tableid, "updatevalue": val, "updaterow": rowno },
        year:year,
        sprogram:sprogram
    }

/*function (data) {
            clearUpdateCellInternal();
            myTable.renderTable();
        }
*/
    $.ajax({
        method: "POST",
        url: "course_service.php",
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(dataReturned);
}
