function getData() {
    let op = ""
    let params = {

    }

    //alert(year + " " + sign);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courses_service.php',
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
    $("#course-list-table-filter input.row-filter").each(function(){
        console.log("Found input",this.id)
    });
    //tbl.render();
    $("#hide-less-range-val").html($("#hide-less-range").val());
    $("#hide-more-range-val").html($("#hide-more-range").val());
    myTable.renderTable();
}

function returned_data(json) {

    let tdata = {
        tblhead: { ccode: "CCode", cname: "Course Name", active: "Active", credits:"Credits", class:"Classification", del: "" },
        tblbody: [],
        tblfoot: {}
    }
    let colOrder = ["ccode", "cname", "class", "credits", "active", "del"];

    if (json.data.courses.length > 0) {
        for (let i = 0; i < json.data.courses.length; i++) {
            let c = json.data.courses[i];
            console.log(c)
            tdata.tblbody.push({ ccode: c.ccode, cname: c.cname, active: c.active, credits: c.credits, del: c.cid, class:c.class });
        }
        console.log(tdata);

        myTable = new SortableTable({
            data: tdata,
            tableElementId: "course-list-table",
            filterElementId: "columnFilter",
            renderCellCallback: renderCell,
            renderSortOptionsCallback: renderSortOptions,
            renderColumnFilterCallback: renderColumnFilter,
            rowFilterCallback: rowFilter,
            columnOrder: colOrder,
            // displayCellEditCallback: displayCellEdit,
            // updateCellCallback: updateCellCallback,
            // preRenderCallback:preRender,
            freezePaneIndex: 1,
            hasRowHighlight: true,
            hasMagicHeadings: true,
            hasCounterColumn: true
        });

        myTable.renderTable();

    } else {
        $("#course-list-table").html("There are currently no courses in DB. Use the above form to add courses to the DB.");
    }

}



function addCourse() {
    let op = "ADD_COURSE";
    let ccode = $("#ccode").val();
    let cname = $("#cname").val();
    let credits = $("#credits").val();
    let cclass = $("#class").val();

    let params = {
        update: {
            ccode: ccode,
            cname: cname,
            credits: credits,
            class: cclass
        }
    }

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courses_service.php',
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
        url: 'courses_service.php',
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

function updateStatus(param, newstatus) {
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

    let teid = param;
    let hours = $("#teid_" + param).val();
    $("#teid_" + param).removeClass("confirmed unconfirmed mustchange error");
    $("#teid_" + param).addClass(newstatus);
    let status = newstatus;
    if (status == 0) {
        $("#teid_" + param.id).addClass("confirmed")
    } else if (status == 1) {
        $("#teid_" + param.id).addClass("unconfirmed")
    } else if (status == 2) {
        $("#teid_" + param.id).addClass("mustchange")
    } else {
        $("#teid_" + param.id).addClass("error");
    }

    //alert(teid + " " + hours + " " + status);

    var jqxhr = $.ajax({
        type: 'POST',
        url: 'courses_service.php',
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

    if (col === "ccode" || col === "cname"|| col === "class") {
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
