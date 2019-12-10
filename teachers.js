function getData() {
    let op = ""
    let params = {

    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'teachers_service.php',
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

function updateRowFilter(tbl)
{
    // Store the updated row-filter in localstorage
    $("#teacher-list-container-filter input[type=checkbox].row-filter").each(function(){
        console.log("Found input",this.id)
    });
    //tbl.render();
    myTable.renderTable();
}

function returned_data(json) {

    let tdata = {
        tblhead: { name: "Name", sign: "SIGN", active: "Active", access: "Role", del: "" },
        tblbody: [],
        tblfoot: {}
    }
    let colOrder = ["name", "sign", "active", "access", "del"];

    if (json.data.teachers.length > 0) {
        for (let i = 0; i < json.data.teachers.length; i++) {
            let t = json.data.teachers[i];
            tdata.tblbody.push({ name: t.fname + " " + t.lname, sign: t.sign, active: t.active, access: t.access, del: t.tid, tid:t.tid });
        }

        myTable = new SortableTable({
            data: tdata,
            tableElementId: "teacher-list-container",
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
        $("#teacher-list-container").html("There are currently no teachers in DB. Use the above form to add teachers to the DB.");
    }

}



function addTeacher() {
    let op = "ADD_TEACHER";
    let fname = $("#fname").val();
    let lname = $("#lname").val();
    let sign = $("#sign").val();

    let params = {
        update: {
            fname: fname,
            lname: lname,
            sign: sign
        }
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'teachers_service.php',
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

function deleteTeacher(tid)
{
    alert("Feature not yet implemented!");
}

function updateTeaching(param) {
    if ($('#year').val()) {
        year = $('#year').val();
    } else {
        year = 2018;
    }
    if ($('#sign').val()) {
        sign = $('#sign').val();
    } else {
        sign = 'BROM';
    }

    let teid = param.id.replace("teid_", "");;
    let hours = $("#" + param.id).val();
    let status = 0;
    if ($("#" + param.id).hasClass("confirmed")) {
        status = 0;
    } else if ($("#" + param.id).hasClass("unconfirmed")) {
        status = 1;
    } else if ($("#" + param.id).hasClass("mustchange")) {
        status = 2;
    } else {
        status = 3;
    }

    //alert(teid + " " + hours + " " + status);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'teacher_service.php',
        data: 'year=' + year + '&sign=' + sign + '&op=UPDATE&teid=' + teid + '&hours=' + hours + '&status=' + status
    })
        .done(function (data) {
            //alert( "success"+data );
            var json = JSON.parse(data);
            render(json);
        })
        .fail(function () {
            alert("error");
        })
        .always(function () {
            //alert( "complete" );
        });
}

function updateTeacherActive(tid, active) {
    let op = "UPDATE_TEACHER_ACTIVE"
    let params = {
        tid: tid,
        active: active
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'teachers_service.php',
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

function updateTeacherAccess(tid, access) {
    let op = "UPDATE_TEACHER_ACCESS"
    let params = {
        tid: tid,
        access: access
    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'teachers_service.php',
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

//--------------------------------------------------------------------------
// renderColumnFilter
// ---------------
//  Callback function that renders the col filter div
//--------------------------------------------------------------------------

function renderColumnFilter(col, status, colname) {
    str = "<div>";
    if (status) {
        str += "<input id='" + colname + "_" + col + "' type='checkbox' checked onchange='myTable.toggleColumn(\"" + col + "\")'>"
        str += "<label for='" + colname + "_" + col + "'>" + colname + "</label>";
    } else {
        str += "<input id='" + colname + "_" + col + "' type='checkbox' onchange='myTable.toggleColumn(\"" + col + "\")'>"
        str += "<label for='" + colname + "_" + col + "'>" + colname + "</label>";
    }
    str += "</div>";

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
        t = "<span class='btn btn-primary btn-sm' onclick='deleteTeacher(" + celldata + ")'>Delete</span>";
    } else if (col == "active") {
        let activestr="";
        if(celldata===0){
            activestr="No longer teaching";
        }else if(celldata===1){
            activestr="Active";
        }else{
            activestr="Unknown activity status";
        }
        t = "<span>" + activestr + "</span>";
    } else if (col == "access") {
        let astr="";
        if(celldata===0){
            astr="Cplan user";
        }else if(celldata===1){
            astr="CPlan Administrator";
        }else{
            astr="Unknown Cplan role!";
        }
        t = "<span>" + astr + "</span>";
    } else {
        t += celldata;
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

    let hideAdmins = $("#hide-admins").prop("checked");
    if (hideAdmins) {
        if (row.access > 0) {
            ret = false;
        }
    }

    let hideUsers = $("#hide-users").prop("checked");
    if (hideUsers) {
        if (row.access === 0) {
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

    if (col === "sign" || col === "name") {
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
// updateCellCallback
// ---------------
//  Callback function for updating a cell value after editing a cell
//--------------------------------------------------------------------------
function updateCellCallback(rowno, colno, column, tableid, oldvalue, rowid) {
    oldvalue = sortableTable.edit_celldata;
    isLocked = false;
    // Make AJAX call and return 
    if (column == "active") {
        let newvalue = oldvalue;
        let tid=parseInt(document.getElementById("popoveredit_tid").value);
        let new_active = parseInt(document.getElementById("popoveredit_active").value);
        let newcelldata = new_active;        
        updateTeacherActive(tid,new_active);
        return newcelldata;
    } else if (column == "access") {
        let newvalue = oldvalue;
        let tid=parseInt(document.getElementById("popoveredit_tid").value);
        let new_access = parseInt(document.getElementById("popoveredit_access").value);
        let newcelldata = new_access;        
        updateTeacherAccess(tid,new_access);
        return newcelldata;
    } 
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
    if (column === "active") {
        let spstr = "";
        if(typeof celldata !== "undefined"){
            spstr=celldata;
        }
        let tidstr = "";
        if(typeof rowdata.tid !== "undefined"){
            tidstr=rowdata.tid;
        }
        str +="<input type='hidden' id='popoveredit_tid' class='popoveredit' value='" + tidstr + "' />";
        str +="<select id='popoveredit_active'>"
        let optArr=["No longer teaching","Active"];
        for(let i=0;i<optArr.length;i++){
            let o=optArr[i];
            if(i===celldata){
                str+="<option selected value='"+i+"'>"+o+"</option>";
            }else{
                str+="<option value='"+i+"'>"+o+"</option>";
            }
        }
        str +="</select>"
    } else if (column === "access") {
        let examinatorsstr = "";
        if(typeof celldata !== "undefined"){
            examinatorsstr=celldata;
        }
        let tidstr = "";
        if(typeof rowdata.tid !== "undefined"){
            tidstr=rowdata.tid;
        }
        str += "<input type='hidden' id='popoveredit_tid' class='popoveredit' value='" + tidstr + "' />";
        str +="<select id='popoveredit_access'>"
        let optArr=["CPlan User","CPlan Administrator"];
        for(let i=0;i<optArr.length;i++){
            let o=optArr[i];
            if(i===celldata){
                str+="<option selected value='"+i+"'>"+o+"</option>";
            }else{
                str+="<option value='"+i+"'>"+o+"</option>";
            }
        }
        str +="</select>"
        //str += "<div class='editInput'><label>Examinators:</label><input type='text' id='popoveredit_examinators' class='popoveredit' style='flex-grow:1' value='" + examinatorsstr + "' size=" + examinatorsstr.toString().length + "/></div>";   
    } else {
        console.log(celldata, rowno, rowelement, cellelement, column, colno, rowdata, coldata, tableid)
        str=false;
    }
    return str;
}
