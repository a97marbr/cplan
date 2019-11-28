var isLocked = false;
var sprogram;
var myTable;

function dropdown(el) {
    document.getElementById("dropdown_" + el).classList.toggle("show");
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
    let year = "";
    if ($('#year').val()) {
        year = $('#year').val();
    }
    let sprogram = "";
    if ($('#sprogram').val()) {
        sprogram = $('#sprogram').val();
    }
    console.log(year, sprogram)
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
        .done(returnData)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function returnData(json) {
    //alert( "success"+data );
    //let json = JSON.parse(data);

    $("#title-year").html(json.data.year);
    var colsums = ["students", "time_budget"];
    var rowsums = [[{ "name": "Total Allocated", "id": "tallocated" }]];

    for (let k = 0; k < json.data.courses_table.columnOrder.length; k++) {
        if (json.data.courses_table.columnOrder[k].startsWith("teacher_")) {
            colsums.push(json.data.courses_table.columnOrder[k]);
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.unspecified");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.lecture");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.seminar");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.supervision");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.preparation");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.development");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.grading");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.examination");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.running");
            rowsums[0].push(json.data.courses_table.columnOrder[k] + ".allocation.other");
        }
    }
    //console.log(rowsums);
    myTable = new SortableTable({
        data: json.data.courses_table.tbldata,
        tableElementId: "c",
        filterElementId: "columnFilter",
        //tableCaption:"Teaching allocation for "+sprogram+" courses in year "+year,
        renderCellCallback: renderCell,
        renderSortOptionsCallback: renderSortOptions,
        renderColumnFilterCallback: renderColumnFilter,
        rowFilterCallback: rowFilter,
        columnOrder: json.data.courses_table.columnOrder,
        columnSumCallback: makeSum,
        columnSum: colsums,
        rowSum: rowsums,
        displayCellEditCallback: displayCellEdit,
        updateCellCallback: updateCellCallback,
        freezePaneIndex: 2,
        hasRowHighlight: true,
        hasMagicHeadings: true,
        hasCounterColumn: true
    });

    var colorder = myTable.getColumnOrder();
    for (let k = 0; k < colorder.length; k++) {
        if (colorder[k] === "tallocated") {
            colorder.splice(k, 1);
            break;
        }
    }
    for (let k = 0; k < colorder.length; k++) {
        if (colorder[k] === "time_budget") {
            colorder.splice(k + 1, 0, "tallocated");
            break;
        }
    }
    myTable.reorderColumns(colorder);
    myTable.renderTable();

}

//------------==========########### FUNCTIONZ ###########==========------------

//--------------------------------------------------------------------------
// renderColumnFilter
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderColumnFilter(col, status, colname) {
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

function renderSortOptions(col, status, colname) {
    str = "";
    if (status == -1) {

        if (col == "ccode" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "students" || col == "study_program" || col == "tallocated") {
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "</span>";
        } else if (col == "cname" || col == "comment") {
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "</span>";
        } else if (col == "time_budget") {
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Budget</span>";
            str += "<div><span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Stud</span>|";
            str += "<span class='ellipsis' onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>Time</span></div>";
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
        if (col == "ccode" || col == "cname" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "students" || col == "study_program" || col == "tallocated") {
            if (status == 0) {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
            }
        } else if (col == "cname" || col == "comment") {
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
    } else if (col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "tallocated") {
        t = celldata;
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
    if (searchterm == "") {
        return true;
    } else {
        for (var property in row) {
            if (row.hasOwnProperty(property)) {
                if (row[property] != null && row[property].indexOf != null) {
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
function compare(a, b) {
    // Find out which column and part of column are we sorting on from currentTable
    let col = sortableTable.currentTable.getSortcolumn();
    let kind = sortableTable.currentTable.getSortkind();
    // We allways sort none numbers below 
    let tmp = (sortableTable.currentTable.ascending) ? -1000000 : 1000000;

    if (col == "ccode" || col == "cname" || col == "start_period" || col == "end_period" || col == "class" || col == "comment" || col == "study_program" || col == "tallocated") {
        let tmp = (sortableTable.currentTable.ascending) ? -1 : 1;
        if (a == "UNK") return -tmp;
        if (b == "UNK") return tmp;
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    } else if (col == "credits") {

        let left = (isNaN(a)) ? tmp : +a;
        let right = (isNaN(b)) ? tmp : +b;
        return left - right;
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

        return left - right;
    } else if (col == "students") {
        // We allways sort none numbers below 
        let tmp = (sortableTable.currentTable.ascending) ? -1000000 : 1000000;

        let left = (isNaN(a)) ? tmp : +a;
        let right = (isNaN(b)) ? tmp : +b;
        return left - right;
    } else {
        // We allways sort none numbers below 
        let tmp = (sortableTable.currentTable.ascending) ? 1000000 : -1000000;
        let left;
        let right;
        if (a.allocation === null || a.allocation === "UNK") {
            left = tmp;
        } else {
            left = a.allocation.unspecified + a.allocation.lecture + a.allocation.supervision + a.allocation.seminar + a.allocation.development + a.allocation.preparation + a.allocation.other + a.allocation.running + a.allocation.grading + a.allocation.examination;
        }

        if (b.allocation === null || b.allocation === "UNK") {
            right = tmp;
        } else {
            right = b.allocation.unspecified + b.allocation.lecture + b.allocation.supervision + b.allocation.seminar + b.allocation.development + b.allocation.preparation + b.allocation.other + b.allocation.running + b.allocation.grading + b.allocation.examination;
        }

        return left - right;
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
        str += "<div class='editInput'><label>Grading:</label><input type='text' id='popoveredit_grading' class='popoveredit' style='flex-grow:1' value='" + celldata.grading + "' size='" + celldata.grading.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Examination:</label><input type='text' id='popoveredit_examination' class='popoveredit' style='flex-grow:1' value='" + celldata.examination + "' size='" + celldata.examination.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Running</label><input type='text' id='popoveredit_running' class='popoveredit' style='flex-grow:1' value='" + celldata.running + "' size='" + celldata.running.toString().length + "'/></div>";
        str += "<div class='editInput'><label>Other:</label><input type='text' id='popoveredit_other' class='popoveredit' style='flex-grow:1' value='" + celldata.other + "' size='" + celldata.other.toString().length + "'/></div>";
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
            updateDB(tableid, rowid, column, newvalue, "COURSEINSTANCE");
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
        updateDB(tableid, rowid, column, newvalue, "COURSEINSTANCE");
        return newvalue;
    } else if (column == "comment") {
        var newvalue = "";
        if (oldvalue === "UNK") newvalue = oldvalue;
        newvalue = document.getElementById("popoveredit_comment").value;
        updateDB(tableid, rowid, column, newvalue, "COURSEINSTANCE");
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
            updateDB(tableid, rowid, column, newvalue, "TEACHING");
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
function updateDB(tableid, rowno, col, val, dbtbl) {
    var command;
    if (dbtbl == "TEACHING") {
        command = "UPDATETEACHING";
    } else if (dbtbl == "COURSEINSTANCE") {
        command = "UPDATECOURSEINSTANCE";
    }

    $.ajax({
        method: "POST",
        url: "course_service.php",
        data: { "command": command, "updatecol": col, "updatetable": tableid, "updatevalue": JSON.stringify(val), "updaterow": rowno }
    })
        .done(function (data) {
            clearUpdateCellInternal();
        });
}
