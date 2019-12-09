var serviceData = null;
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
    let op = ""
    let params = {

    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courseinstance_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(returned_data)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function addCourseInstance() {
    let op = "ADD_COURSEINSTANCE";
    let cid = $("#cid").val();
    let start_period = $("#start_period").val();
    let end_period = $("#end_period").val();
    let coordinator = $("#coordinator").val();
    let year = $("#year").val();
    let examinators = $("#examinators").val();
    let study_program = $("#study_program").val();

    let params = {
        courseinstance: {
            cid: cid,
            start_period: start_period,
            end_period: end_period,
            coordinator: coordinator,
            examinators: examinators,
            year: year,
            study_program: study_program
        }
    }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courseinstance_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(returned_data)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function returned_data(json) {
    serviceData = json;
    if (json.error !== "UNK") {
        alert(json.error);
    }
    /*
    ciid SERIAL NOT NULL,
    cid INT NOT NULL,
    coordinator INT NOT NULL,
    examiner INT NOT NULL,
    -- SHOULD NOT BE USED ... USE course_instance_examiner table instead
    start_period INT DEFAULT NULL,
    end_period INT DEFAULT NULL,
    year varchar(4) DEFAULT NULL,
    students INT DEFAULT NULL,
    study_program varchar(100) DEFAULT NULL,
    planner INT DEFAULT NULL,
    comment varchar(1024) DEFAULT NULL,
    create_ts timestamp DEFAULT NULL,
    change_ts timestamp DEFAULT NULL,
    alt_ts timestamp DEFAULT NULL,
    create_usr INT DEFAULT NULL,
    change_usr INT DEFAULT NULL,
    alt_usr INT DEFAULT NULL,
    lecture_time INT DEFAULT 0,
    supervise_time INT DEFAULT 0,
    student_time INT DEFAULT 0,
    time_budget JSONB,

    */

    let cstr = "<option disabled>Ange Kurs</option>";
    for (let i = 0; i < json.data.courses.length; i++) {
        let c = json.data.courses[i];
        cstr += "<option value='" + c.cid + "'>" + c.ccode + ":" + c.cname + "</option>";
    }
    $("#cid").html(cstr);

    let tstr = "<option disabled>Ange Kursansvarig</option>";
    for (let i = 0; i < json.data.teachers.length; i++) {
        let t = json.data.teachers[i];
        tstr += "<option value='" + t.tid + "'>" + t.sign + " (" + t.fname + " " + t.lname + ")</option>";
    }
    $("#coordinator").html(tstr);

    let estr = "<option disabled>Ange Examinator</option>";
    for (let i = 0; i < json.data.teachers.length; i++) {
        let t = json.data.teachers[i];
        estr += "<option value='" + t.sign + "'>" + t.sign + " (" + t.fname + " " + t.lname + ")</option>";
    }
    $("#examinators").html(estr);

    let pstr = "<option disabled>Ange Period</option>";;
    for (let i = 0; i < json.data.year_periods.length; i++) {
        let p = json.data.year_periods[i];
        pstr += "<option value='" + p.id + "'>" + p.short_desc + "</option>";
    }
    $("#start_period").html(pstr);
    $("#end_period").html(pstr);

    let tdata = {
        tblhead: { year: " År", ciid: "ciid", cid: "Kurskod/namn", coordinator: "Kursansvarig", examinators: "Examinatorer", start_period: "Start", end_period: "Slut", study_program: "Program", time_budget: "Budget", comment: "Kommentar", del: "" },
        tblbody: [],
        tblfoot: {}
    }
    let colOrder = ["year", "start_period", "end_period", "cid", "coordinator", "examinators", "study_program", "del"];

    if (json.data.courseinstances.length > 0) {

        for (let i = 0; i < json.data.courseinstances.length; i++) {
            let ci = json.data.courseinstances[i];
            tdata.tblbody.push({ year: ci.year, cid: ci.cid, coordinator: ci.coordinator, examinators: ci.examinators, del: ci.ciid, ciid: ci.ciid, start_period: ci.start_period, end_period: ci.end_period, comment: ci.comment, study_program: ci.study_program });
        }

        myTable = new SortableTable({
            data: tdata,
            tableElementId: "courseinstance-list-table",
            filterElementId: "columnFilter",
            renderCellCallback: renderCell,
            renderSortOptionsCallback: renderSortOptions,
            renderColumnFilterCallback: renderColumnFilter,
            rowFilterCallback: rowFilter,
            columnOrder: colOrder,
            displayCellEditCallback: displayCellEdit,
            updateCellCallback: updateCellCallback,
            // preRenderCallback:preRender,
            freezePaneIndex: 1,
            hasRowHighlight: true,
            hasMagicHeadings: true,
            hasCounterColumn: true
        });

        myTable.renderTable();

    } else {
        $("#courseinstance-list-table").html("There are currently no courseinstances in DB. Use the above form to add courseinstances to the DB.");
    }

}

function deleteCourseInstance(ciid) {
    let op = "DELETE_COURSE_INSTANCE"
    let params = {
        ciid: ciid
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courseinstance_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(returned_data)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function updateStudyProgram(ciid, study_program) {
    let op = "UPDATE_COURSE_INSTANCE_SPROGRAM"
    let params = {
        ciid: ciid,
        study_program: study_program
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courseinstance_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(returned_data)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function updateExaminators(ciid, examinators) {
    let op = "UPDATE_COURSE_INSTANCE_EXAMINATORS"
    let params = {
        ciid: ciid,
        examinators: examinators
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courseinstance_service.php',
        data: 'op=' + op + '&params=' + encodeURIComponent(JSON.stringify(params))
    })
        .done(returned_data)
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

//------------==========########### FUNCTIONZ ###########==========------------

//--------------------------------------------------------------------------
// renderColumnFilter
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderColumnFilter(col, status, colname) {
    str = "";
    if (colname !== "") {
        if (status) {
            str = "<div><label>" + colname + "</label>:<input type='checkbox' checked onclick='myTable.toggleColumn(\"" + col + "\")'></div>";
        } else {
            str = "<div><label>" + colname + "</label>:<input type='checkbox' onclick='myTable.toggleColumn(\"" + col + "\")'></div>";
        }
    }

    return str;
}

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

//--------------------------------------------------------------------------
// renderSortOptions
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderSortOptions(col, status, colname) {
    str = "";
    if (status == -1) {

        if (col == "ccode" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "study_program" || col == "tallocated") {
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
        } else {
            str += "<span onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "</span>";
        }
    } else {
        if (col == "ccode" || col == "cname" || col == "class" || col == "credits" || col == "start_period" || col == "end_period" || col == "study_program" || col == "tallocated") {
            if (status == 0) {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
            }
        } else {
            if (status == 0) {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",1)'>" + colname + "&#x25b4;</div>";
            } else {
                str += "<div onclick='myTable.toggleSortStatus(\"" + col + "\",0)'>" + colname + "&#x25be;</div>";
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
    if (col == "del") {
        t = "<span class='btn btn-primary btn-sm' onclick='deleteCourseInstance(" + celldata + ")'>Delete</span>";
    } else if (col == "cid") {
        cname = "Saknas";
        for (let i = 0; i < serviceData.data.courses.length; i++) {
            let c = serviceData.data.courses[i];
            if (c.cid === celldata) {
                cname = "<span style='font-family:monospace;font-weight:bold;'>" + c.ccode + "</span>" + ":" + c.cname;
                break;
            }
        }
        t = "<div>" + cname + "</div>";
    } else if (col == "coordinator") {
        coordinator = "Saknas";
        for (let i = 0; i < serviceData.data.teachers.length; i++) {
            let t = serviceData.data.teachers[i];
            if (t.tid === celldata) {
                coordinator = t.sign;
                break;
            }
        }
        t = "<div>" + coordinator + "</div>";
    } else if (col == "examinators") {
        /*
        estr="Saknas";
        for (let i=0;i<serviceData.data.examinators.length;i++){
            let e=serviceData.data.examinators[i];
            if(e.ciid===celldata){
                if(estr!=="Saknas")estr+=",";
                estr=e.tid;
            }
        }
        
        t = "<div>" + estr + "</div>";
        */
        t = "<div>" + celldata + "</div>";
    } else {
        if (celldata === null) {
            t += "";
            console.log(col, "null")
        } else {
            t += celldata;
        }
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
    let ret = true;

    let hideInactive = $("#hide-inactive").prop("checked");
    if (hideInactive) {
        if (row.active === 0) {
            ret = false;
        }
    }

    let hideLess = $("#hide-less").prop("checked");
    let hideLessRange = $("#hide-less-range").val();
    if (hideLess) {
        if (row.credits < hideLessRange) {
            ret = false;
        }
    }

    let hideMore = $("#hide-more").prop("checked");
    let hideMoreRange = $("#hide-more-range").val();
    if (hideMore) {
        if (row.credits > hideMoreRange) {
            ret = false;
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

    if (col === "ccode" || col === "cname" || col === "class") {
        let ret = 0;
        if (kind === 0) {
            if (typeof a === "undefined") {
                ret = 1;
            } else if (typeof b === "undefined") {
                ret = -1;
            } else {
                let astr = a.toLocaleUpperCase();
                let bstr = b.toLocaleUpperCase();
                ret = bstr.localeCompare(astr);
            }
        } else {
            if (typeof a === "undefined") {
                ret = -1;
            } else if (typeof b === "undefined") {
                ret = 1;
            } else {
                let astr = a.toLocaleUpperCase();
                let bstr = b.toLocaleUpperCase();
                ret = astr.localeCompare(bstr);
            }
        }
        return ret
    } else {
        if (kind === 0) {
            return a - b;
        } else {
            return b - a;
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
    } else if (col == "time_allocation") {
        //console.log(value);
        let total = 0;
        if (value !== null) total = value.unspecified + value.lecture + value.seminar + value.supervision + value.preparation + value.development + value.grading + value.examination + value.running + value.other;
        return parseFloat(total);
    } else {
        return parseFloat(value);
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
    if (column == "time_allocation") {
        var ta;
        if (celldata.allocation == "UNK" || celldata.allocation === null) {
            ta = { "unspecified": 0, "lecture": 0, "seminar": 0, "supervision": 0, "preparation": 0, "development": 0, "grading": 0, "examination": 0, "running": 0, "other": 0, "total": 0, "status": 0 };
            sortableTable.edit_rowid = "UNK";
        } else {
            ta = celldata;
            sortableTable.edit_rowid = rowdata.teid;
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
    } else if (column === "study_program") {
        let spstr = "";
        if(typeof celldata !== "undefined"){
            spstr=celldata;
        }
        let ciidstr = "";
        if(typeof rowdata.ciid !== "undefined"){
            ciidstr=rowdata.ciid;
        }
        str += "<input type='hidden' id='popoveredit_ciid' class='popoveredit' value='" + ciidstr + "' />";
        str += "<div class='editInput'><label>Study Program:</label><input type='text' id='popoveredit_study_program' class='popoveredit' style='flex-grow:1' value='" + spstr + "' size=" + spstr.toString().length + "/></div>";     
    } else if (column === "examinators") {
        let examinatorsstr = "";
        if(typeof celldata !== "undefined"){
            examinatorsstr=celldata;
        }
        let ciidstr = "";
        if(typeof rowdata.ciid !== "undefined"){
            ciidstr=rowdata.ciid;
        }
        str += "<input type='hidden' id='popoveredit_ciid' class='popoveredit' value='" + ciidstr + "' />";
        str += "<div class='editInput'><label>Examinators:</label><input type='text' id='popoveredit_examinators' class='popoveredit' style='flex-grow:1' value='" + examinatorsstr + "' size=" + examinatorsstr.toString().length + "/></div>";   
    } else {
        console.log(celldata, rowno, rowelement, cellelement, column, colno, rowdata, coldata, tableid)
        str=false;
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
    if (column == "study_program") {
        let newvalue = oldvalue;
        let ciid=parseInt(document.getElementById("popoveredit_ciid").value);
        let new_study_program = document.getElementById("popoveredit_study_program").value;
        let newcelldata = new_study_program;        
        updateStudyProgram(ciid,new_study_program);
        return newcelldata;

    } else if (column == "examinators") {
        let newvalue = oldvalue;
        let ciid=parseInt(document.getElementById("popoveredit_ciid").value);
        let new_examinators = document.getElementById("popoveredit_examinators").value;
        let newcelldata = new_examinators;
        updateExaminators(ciid,new_examinators);
        return newcelldata;

    } 
}
