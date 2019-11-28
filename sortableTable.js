// Keep track of Currently active Table and all sortable tables
var sortableTable = {
    currentTable:null,
    sortableTables:[],
    edit_rowno:-1,
    edit_rowid:null,
    edit_row:null,
    edit_columnno:-1,
    edit_columnname:null,
    edit_tableid:null,
}

function searchKeyUp(e) {
	// look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13) {
        document.getElementById('searchbutton').click();
        return false;
    }
    return true;
}

function keypressHandler(event) {
    if (event.keyCode == 13) {
        updateCellInternal();
    } else if(event.keyCode == 27) {
        clearUpdateCellInternal();
    }
}

function defaultRowFilter() {
	return true;
}

// Global sorting function global
function sortableInternalSort(a,b) {
	var ret = 0;
    //var colname = sortableTable.currentTable.getKeyByValue();
    var colname = sortableTable.currentTable.getSortcolumn();
    
	if (sortableTable.currentTable.ascending) {
		//alert("Compare: "+a+" "+b);
		ret = compare(a[colname],b[colname]);
	} else {
		//alert("Compare: "+b+" "+a);
		ret = compare(b[colname],a[colname]);
	}
	return ret;
}

function clearUpdateCellInternal() {
    sortableTable.edit_rowno =- 1;
    sortableTable.edit_rowid =null;
    sortableTable.edit_columnno =- 1;
    sortableTable.edit_columnname = null;
    sortableTable.edit_tableid = null;
    sortableTable.edit_celldata = null;
    document.getElementById('editpopover').style.display = "none";
}

function updateCellInternal() {
    for (var i = 0; i < sortableTable.sortableTables.length; i++) {
        if (sortableTable.sortableTables[i].tableid == sortableTable.edit_tableid) {
            sortableTable.sortableTables[i].updateCell();
        }
    }
    clearUpdateCellInternal();
}

// clickedInternal
function clickedInternal(event,clickdobj) {
  let clickedTbl=event.target.closest("table").id.substring(0,event.target.closest("table").id.indexOf("_tbl"));
  let active=null;
  for (let i=0;i<sortableTable.sortableTables.length;i++){
      if(sortableTable.sortableTables[i].tableid==clickedTbl){
          active=sortableTable.sortableTables[i];
          break;
      }
  }
  sortableTable.currentTable=active;
  //console.log(sortableTable.currentTable);
  
	if (sortableTable.currentTable.showEditCell != null) {
		var cellelement = event.target.closest("td");
    /*
		var arr = cellelement.id.split("_");
		var rowelement = event.target.closest("tr");
		var barr = rowelement.id.split("_");
    arr[0] = arr[0].split("r")[1];
		var columnname = arr[2];
		var columnno = arr[0];

		var rowno = parseInt(barr[1]);
		var tableid = barr[0];
    */
    var rowelement = event.target.closest("tr");
    let match=cellelement.id.match(/^r([0-9]+)_([a-zA-Z]+)_(.*)/);
    var rowno = match[1];
    var columnno = null; // Not used anymore
    var tableid = match[2];
    var columnname=match[3]

		var str = "";
    var rowdata = sortableTable.currentTable.getRow(rowno);
		var coldata = rowdata[columnname];

		sortableTable.edit_rowno = rowno;
    sortableTable.edit_row = rowdata;
		sortableTable.edit_columnno = columnno;
		sortableTable.edit_columnname = columnname;
		sortableTable.edit_tableid = tableid;
    sortableTable.edit_celldata = coldata;

		str += "<div id='input-container' style='flex-grow:1'>";
		str += sortableTable.currentTable.showEditCell(coldata,rowno,rowelement,cellelement,columnname,columnno,rowdata,coldata,tableid);
		str += "</div>";
		str += "<img id='popovertick' class='icon' src='Icon_Tick.svg' onclick='updateCellInternal();'>";
		str += "<img id='popovercross' class='icon' src='Icon_Cross.svg' onclick='clearUpdateCellInternal();'>";
		var lmnt = cellelement.getBoundingClientRect();
		console.log(lmnt.top, lmnt.right, lmnt.bottom, lmnt.left, lmnt.height, lmnt.width);
		var popoverelement = document.getElementById("editpopover");

		popoverelement.innerHTML = str;
		var popoveredit = document.getElementById("popoveredit");
		var xscroll = window.pageXOffset;
		var yscroll = window.pageYOffset;

		popoverelement.style.left = Math.round(lmnt.left+xscroll)+"px";
		popoverelement.style.top = Math.round(lmnt.top+yscroll)+"px";
		popoverelement.style.minHeight = (Math.round(lmnt.height)-5)+"px";
		//popoverelement.style.maxWidth = "fit-content";
		popoverelement.style.display = "flex";
	}
}

// We call all highlights in order to allow hover of non-active tables
function rowHighlightInternal(event,row) {
    var arr = row.id.split("_");
    var rowno = parseInt(arr[1]);
	var centerel = event.target.closest("td");
	for (var i = 0; i < sortableTable.sortableTables.length; i++) {
		if (sortableTable.sortableTables[i].highlightRow != null) {
			sortableTable.sortableTables[i].highlightRow(row.id,rowno,centerel.className,centerel);
		}
    }
}

// We call all deHighlights in order to allow hover of non-active tables
function rowDeHighlightInternal(event,row) {
	var arr = row.id.split("_");
	var rowno = parseInt(arr[1]);
	var centerel = event.target.closest("td");
	for (var i = 0; i < sortableTable.sortableTables.length; i++) {
		if (sortableTable.sortableTables[i].deHighlightRow != null) {
			sortableTable.sortableTables[i].deHighlightRow(row.id,rowno,centerel.className,centerel);
		}
    }
}

function SortableTable(param)
{
		//------------==========########### Fenced paramters ###########==========------------    
    if(typeof param.data === "undefined"){
        param.data={tblhead:{},tblbody:[],tblfoot:{}};
    }
    var tbl = param.data;
    if(typeof param.tableElementId === "undefined"){
        param.tableElementId="UNK";
    }
    this.tableid = param.tableElementId;
    if(typeof param.filterElementId === "undefined"){
        param.filterElementId="UNK";
    }
    var filterid = param.filterElementId;
    if(typeof param.tableCaption === "undefined"){
        param.tableCaption="UNK";
    }   
    var caption = param.tableCaption;
     
    if(typeof param.renderCellCallback === "undefined"){
        param.renderCellCallback=null;
    }
    var renderCell = param.renderCellCallback;
    if(typeof param.renderSortOptionsCallback === "undefined"){
        param.renderSortOptionsCallback=null;
    }
    var renderSortOptions = param.renderSortOptionsCallback;
    if(typeof param.renderColumnFilterCallback === "undefined"){
        param.renderColumnFilterCallback=null;
    }
    var renderColumnFilter = param.renderColumnFilterCallback;

    if(typeof param.rowFilterCallback === "undefined"){
        param.rowFilterCallback=defaultRowFilter;
    }
    var rowFilter = param.rowFilterCallback;
    
    if(typeof param.columnSum === "undefined"){
        param.columnSum=[];
    }
    var colsumList = param.columnSum;
    if(typeof param.rowSum === "undefined"){
        param.rowSum=[];
    }
    var rowsumList = param.rowSum;
    if(typeof param.columnSumCallback === "undefined"){
        param.columnSumCallback=null;
    }
    var sumFunc = param.columnSumCallback;
    if(typeof param.columnOrder === "undefined"){
        param.columnOrder=[];
    }
    var columnOrder = param.columnOrder;
    if(typeof param.freezePaneIndex === "undefined"){
        param.freezePaneIndex=-1;
    }
    var freezePaneIndex = param.freezePaneIndex;
    if(typeof param.rowHighlightOnCallback === "undefined"){
        param.rowHighlightOnCallback=null;
    }
    this.highlightRow = param.rowHighlightOnCallback;
    if(typeof param.rowHighlightOffCallback === "undefined"){
        param.rowHighlightOffCallback=null;
    }
    this.deHighlightRow = param.rowHighlightOffCallback;
    if(typeof param.displayCellEditCallback === "undefined"){
        param.displayCellEditCallback=null;
    }
    this.showEditCell = param.displayCellEditCallback;
    if(typeof param.updateCellCallback === "undefined"){
        param.updateCellCallback=null;
    }
    this.updateCell = param.updateCellCallback;
    if(typeof param.hasMagicHeadings === "undefined"){
        param.hasMagicHeadings=false;
    }
    this.hasMagicHeadings = param.hasMagicHeadings;
    if(typeof param.hasCounterColumn === "undefined"){
        param.hasCounterColumn=false;
    }
    this.hasCounter = param.hasCounterColumn;
    
    //------------==========########### Private member variables ###########==========------------        
    var result = 0;
    var columnfilter = [];
    var sortcolumn = "UNK";
    var sortkind = -1;
    
    // Keeps track of the last picked sorting order
    var tableSort;
    var colSort;
    var reverseSort;
    var rowsumHeading = rowsumHeading;
    var freezePane = freezePane;
    var freezePaneArr = [];

    this.ascending = false;

    // Local variable that contains html code for main table and local variable that contains magic headings table
    var str = "";
    var mhstr = "";
    var mhvstr = "";
    var mhfstr = "";

    sortableTable.sortableTables.push(this);

    this.renderTable = function() {
        this.reRender();
    }

    this.getRow = function(rowno) {
        return tbl.tblbody[rowno];
    }

    this.reRender = function() {
    	this.rowIndex = 1;
    	// Local variable that contains html code for main table and local variable that contains magic headings table
    	str = "<table style='border-collapse: collapse;' id='"+this.tableid+"_tbl' class='list list--nomargin'>";
    	mhstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;top:0px;left:0px;z-index:2000;margin-top:0px;border-bottom:none;' class='list' id='"+this.tableid+"_tbl_mh'>";
    	mhvstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;z-index:1000;' id='"+this.tableid+"_tbl_mhv'>";
    	mhfstr = "<table style='table-layout:fixed;border-collapse: collapse;position:fixed;left:0px;top:0px;z-index:3000;' id='"+this.tableid+"_tbl_mhf'>";

      // Local variable that contains summing array
    	var sumContent = [];

    	// Assign currently active table
    	sortableTable.currentTable = this;
      
      if (JSON.parse(localStorage.getItem(this.tableid+"_filtercolnames"))===null){
          columnfilter=[];
      } else {
          columnfilter=JSON.parse(localStorage.getItem(this.tableid+"_filtercolnames"))
      }     
    	
      //console.log(columnfilter);        
      var filterstr="";
      var columnOrderIdx;
      for (columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          if(!(columnfilter[columnOrderIdx]===null||columnfilter[columnOrderIdx]===columnOrder[columnOrderIdx])){
              break;
          }
          if (renderColumnFilter != null) filterstr += renderColumnFilter({"id":columnOrder[columnOrderIdx],"name":tbl.tblhead[columnOrder[columnOrderIdx]]},columnfilter[columnOrderIdx]);
      }          
          
      for (;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          columnfilter[columnOrderIdx]=columnOrder[columnOrderIdx];
          if (renderColumnFilter != null) filterstr += renderColumnFilter({"id":columnOrder[columnOrderIdx],"name":tbl.tblhead[columnOrder[columnOrderIdx]]},columnfilter[columnOrderIdx]);
      }
      localStorage.setItem(this.tableid+"_filtercolnames",JSON.stringify(columnfilter));
  
      if (renderColumnFilter != null) {
    		  document.getElementById(filterid).innerHTML = filterstr;
    	}

    	str += "<caption>"+caption+"</caption>";

    	// Make headings Clean Contains headings using only A-Z a-z 0-9 ... move to function removes lines of code and removes redundant code/data!?
      str += "<thead class='listHeading' id='"+this.tableid+"_tblhead'><tr>";
      mhstr += "<thead class='listHeading' id='"+this.tableid+"_tblhead_mh'><tr>";
      mhvstr += "<thead class='listHeading' id='"+this.tableid+"_tblhead_mhv'><tr>";
      mhfstr += "<thead class='listHeading' id='"+this.tableid+"_tblhead_mhf'><tr>";

    	//var freezePaneIndex = tbl.tblhead.indexOf(freezePane);

    	// Add Column for counter if the sortabletable should have a counter column.
    	if(this.hasCounter) {
          str += "<th id='counter_"+this.tableid+"_tbl' class='"+this.tableid+"'></th>";
          mhstr += "<th id='counter_"+this.tableid+"_tbl_mh' class='"+this.tableid+"'></th>";
      }

//    for(var colname in tbl.tblhead) {
      for(var columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
      		var colname=columnOrder[columnOrderIdx];
          var col=tbl.tblhead[colname];

      		if (columnfilter[columnOrderIdx] !== null) {
        			if (renderSortOptions !== null) {
          				if (columnOrderIdx <= freezePaneIndex) {
            					if (colname == sortcolumn){
              				 		mhfstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mhf' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
              				 		mhvstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mhv' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
            				 	} else {
              				 		mhfstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mhf' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
              				 		mhvstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mhv' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
            				 	}
          				}
          				if (colname == sortcolumn) {
            					str += "<th id='"+colname+"_"+this.tableid+"_tbl' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
            					mhstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mh' class='"+this.tableid+"'>"+renderSortOptions(colname,sortkind,col)+"</th>";
          				} else {
            					str += "<th id='"+colname+"_"+this.tableid+"_tbl' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
            					mhstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mh' class='"+this.tableid+"'>"+renderSortOptions(colname,-1,col)+"</th>";
          				}
        			} else {
          				if (columnOrderIdx <= freezePaneIndex) {
          				 	if (colname == sortcolumn){
          				 		mhfstr += "<th id='"+cleancol+"_"+this.tableid+"_tbl_mhf' class='"+this.tableid+"'>"+col+"</th>";
          				 		mhvstr += "<th id='"+cleancol+"_"+this.tableid+"_tbl_mhv' class='"+this.tableid+"'>"+col+"</th>";
          				 	} else {
          				 		mhfstr += "<th id='"+cleancol+"_"+this.tableid+"_tbl_mhf' class='"+this.tableid+"'>"+col+"</th>";
          				 		mhvstr += "<th id='"+cleancol+"_"+this.tableid+"_tbl_mhv' class='"+this.tableid+"'>"+col+"</th>";
          				 	}
          				}
          				if (col != "move") {
          					str += "<th id='"+colname+"_"+this.tableid+"_tbl' class='"+this.tableid+"'>"+col+"</th>";
          					mhstr += "<th id='"+colname+"_"+this.tableid+"_tbl_mh' class='"+this.tableid+"'>"+col+"</th>";
          				}
        			}
          }
    	}

    	if (rowsumList.length > 0) {
      		if (rowsumHeading == sortcolumn) {
        			str += "<th id='"+rowsumHeading+"_"+this.tableid+"_tbl' class='"+tthis.ableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,sortkind)+"</th>";
        			mhstr += "<th id='"+rowsumHeading+"_"+this.tableid+"_tbl_mh' class='"+this.tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,sortkind)+"</th>";
      		} else {
        			str += "<th id='"+rowsumHeading+"_"+this.tableid+"_tbl' class='"+this.tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,-1)+"</th>";
        			mhstr += "<th id='"+rowsumHeading+"_"+this.tableid+"_tbl_mh' class='"+this.tableid+" freeze_vertical'>"+renderSortOptions(rowsumHeading,-1)+"</th>";
      		}
    	}

    	str += "</tr></thead>";
    	mhstr += "</tr></thead></table>";
    	mhfstr += "</tr></thead></table>";

    	// Render table body
    	str += "<tbody id='"+this.tableid+"_body'>";
    	mhvstr += "<tbody id='"+this.tableid+"_mhvbody'>";
    	for (var i = 0; i < tbl.tblbody.length; i++) {
      		var row = tbl.tblbody[i];
      		if (rowFilter(row)) {
        			// Keep row sum total here
        			var rowsum = 0;
        			str += "<tr id='"+this.tableid+"_"+i+"' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";
        			mhvstr += "<tr id='"+this.tableid+"_"+i+"_mvh' onmouseover='rowHighlightInternal(event,this)' onmouseout='rowDeHighlightInternal(event,this)' style='box-sizing:border-box'>";

        			// Add Counter cell to the row. The class <tableid>_counter can be used to style the counterText
        			if(this.hasCounter) {
                  str += "<td onclick='clickedInternal(event,this);' class='" + this.tableid + "_counter'><span>"+ this.rowIndex++ +"</span></td>";
              }
        			result++;
              /*
              for (var colnamez in row) {
        				//Counter for freeze here
        				// If we show this column...
        				if (columnfilter[colnamez] !== null) {
          					// This condition is true if column is in summing list and in that case perform the sum like a BOSS
          					if (colsumList.indexOf(colnamez) >- 1) {
          						if (typeof(sumContent[colnamez]) == "undefined") sumContent[colnamez] = 0;
          						sumContent[colnamez] += sumFunc(colnamez,col);
          					}

          					if (rowsumList.indexOf(colnamez) >- 1) {
          						rowsum += sumFunc(colnamez,col);
          					}

          					var cellid = "r"+i+"_"+this.tableid+"_"+colnamez;
          					str += "<td id='"+cellid+"' onclick='clickedInternal(event,this);' class='"+this.tableid+"-"+colnamez+"'>"+renderCell(colnamez,tbl.tblbody[i][colnamez],cellid)+"</td>";

          					// if (colnamez <= freezePaneIndex) {
          					// 	mhvstr+="<td id='"+cellid+"' >"+renderCell(col,colnamez,cellid)+"</td>";
          					// }
        				}
                */
                for(var columnOrderIdx=0;columnOrderIdx<columnOrder.length;columnOrderIdx++){
          				if (columnfilter[columnOrderIdx] !== null) {
            					// This condition is true if column is in summing list and in that case perform the sum like a BOSS
            					if (colsumList.indexOf(columnOrder[columnOrderIdx]) >- 1) {
            						if (typeof(sumContent[columnOrder[columnOrderIdx]]) == "undefined") sumContent[columnOrder[columnOrderIdx]] = 0;
            						sumContent[columnOrder[columnOrderIdx]] += sumFunc(columnOrder[columnOrderIdx],col);
            					}
  
            					if (rowsumList.indexOf(columnOrder[columnOrderIdx]) >- 1) {
            						rowsum += sumFunc(columnOrder[columnOrderIdx],col);
            					}
  
            					var cellid = "r"+i+"_"+this.tableid+"_"+columnOrder[columnOrderIdx];
            					str += "<td id='"+cellid+"' onclick='clickedInternal(event,this);' class='"+this.tableid+"-"+columnOrder[columnOrderIdx]+"'>"+renderCell(columnOrder[columnOrderIdx],tbl.tblbody[i][columnOrder[columnOrderIdx]],cellid)+"</td>";
  
          				}
      			}

      			if (rowsumList.length > 0) {
                str += "<td>"+rowsum+"</td>";
      			}

      			str += "</tr>";
      			mhvstr += "</tr>";
          }
    	}

    	str += "</tbody>";
    	mhvstr += "</tbody>";

    	if(tbl.tblfoot.length > 0) {
    		str += "<tfoot style='border-top:2px solid #000'>";
    		str += "<tr style='font-style:italic;'>";

    		for (var colnamez in tbl.tblfoot) {
    			// If we show this column...
    			if (columnfilter.indexOf(colnamez) >- 1) {
    				if (colsumList.indexOf(colnamez) >- 1) {
    					// If writing sum - just write it
    					str += "<td>"+sumContent[colnamez]+"</td>";
    				} else {
    					if (tbl.tblfoot[col] != "UNK") {
    						str += "<td>"+colnamez+"</td>";
    					} else {
    						str += "<td>&nbsp;</td>";
    					}
    				}
    			}
    		}

    		str+= "</tr></tfoot>";
    	}

    	str += "</table>";
    	mhvstr+= "</table>";

    	this.magicHeader();
    	freezePaneHandler();
    }

    this.toggleColumn = function(colname,col) {
    	// Assign currently active table
    	sortableTable.currentTable = this;
      /*
    	if (columnfilter[colname] == null) {
    		columnfilter[colname] = tbl.tblhead[colname];
    	} else {
    		columnfilter[colname] = null;
    	}
      */
      for(var idx=0;idx<columnOrder.length;idx++){
          if(columnOrder[idx]===colname){
              if(columnfilter[idx]){
                  columnfilter[idx]=null;
              }else{
                  columnfilter[idx]=columnOrder[idx];
              }
          }
      }
      //console.log(columnfilter);
    	localStorage.setItem(this.tableid+"_filtercolnames", JSON.stringify(columnfilter));

    	this.reRender();
    }

    this.toggleSortStatus = function(col,kind) {
    	// Assign currently active table
    	sortableTable.currentTable = this;

    	sortcolumn = col;
    	sortkind = kind;

    	// Even kind numbers will sort in ascending order
    	this.ascending = kind % 2 === 0;

    	// Sort the body of the table again
    	tbl.tblbody.sort(sortableInternalSort);

    	this.reRender();
    }

    this.getKeyByValue = function() {
      	return Object.keys(tbl.tblhead).find(key => tbl.tblhead[key] === sortcolumn);
    }

      this.getSortcolumn = function() {
          return sortcolumn;
      }

      this.getSortcolumnNum = function() {
          //return tbl.tblhead[sortcolumn];
      }

      this.getSortkind = function() {
          return sortkind;
      }

    this.magicHeader = function() {
    	// Assign table and magic headings table(s)
    	if (this.hasMagicHeadings) {
      		document.getElementById(this.tableid).innerHTML = str+mhstr+mhvstr+mhfstr;
      		document.getElementById(this.tableid+"_tbl_mh").style.width=document.getElementById(this.tableid+"_tbl").getBoundingClientRect().width+"px";
      		document.getElementById(this.tableid+"_tbl_mh").style.boxSizing = "border-box";
      		children=document.getElementById(this.tableid+"_tbl").getElementsByTagName('TH');

      		for (i = 0; i < children.length; i++) {
        			document.getElementById(children[i].id+"_mh").style.width = children[i].getBoundingClientRect().width+"px";
        			document.getElementById(children[i].id+"_mh").style.boxSizing = "border-box";
      		}

      		document.getElementById(this.tableid+"_tbl_mhf").style.width = Math.round(document.getElementById(this.tableid+"_tbl_mhv").getBoundingClientRect().width)+"px";
      		document.getElementById(this.tableid+"_tbl_mhf").style.boxSizing = "border-box";
      		children=document.getElementById(this.tableid+"_tbl_mhv").getElementsByTagName('TH');

      		for (i = 0; i < children.length; i++) {
        			document.getElementById(children[i].id.slice(0, -1)+"f").style.width = children[i].getBoundingClientRect().width+"px";
        			document.getElementById(children[i].id.slice(0, -1)+"f").style.boxSizing = "border-box";
      		}
    	} else {
    		  document.getElementById(this.tableid).innerHTML = str;
    	}

    	if (tableSort != null) {
    		  sortTable(tableSort, colSort, reverseSort);
    	}
    }

    setInterval(freezePaneHandler,30);
    function freezePaneHandler() {
    	// Hide magic headings and find minimum overdraft
    	for (var i = 0; i < sortableTable.sortableTables.length; i++) {
    		var table = sortableTable.sortableTables[i];
    		if (table.hasMagicHeadings) {
    			if (document.getElementById(table.tableid+"_tbl") != null) {
    				var thetab = document.getElementById(table.tableid+"_tbl").getBoundingClientRect();
    				var thetabhead = document.getElementById(table.tableid+"_tblhead").getBoundingClientRect();
    				// If top is negative and top+height is positive draw mh otherwise hide
    				// Vertical
    				if (thetabhead.top < 50 && thetab.bottom > 0) {
    					document.getElementById(table.tableid+"_tbl_mh").style.left = thetab.left+"px";
    					document.getElementById(table.tableid+"_tbl_mh").style.display = "table";
    				}
    				 else {
    					document.getElementById(table.tableid+"_tbl_mh").style.display = "none";
    				}
    				// Horizontal
    				if (thetab.left < 0 && thetab.right > 0) {
    					document.getElementById(table.tableid+"_tbl_mhv").style.top = thetabhead.top+"px";
    					document.getElementById(table.tableid+"_tbl_mhv").style.display = "table";
    				}
    				else {
    					document.getElementById(table.tableid+"_tbl_mhv").style.display = "none";
    				}

    				// Fixed
    				if (thetab.left < 0 && thetab.right > 0 && thetabhead.top < 0 && thetab.bottom > 0) {
    					document.getElementById(table.tableid+"_tbl_mhf").style.display = "table";
    				}
    				else {
    					document.getElementById(table.tableid+"_tbl_mhf").style.display = "none";
    				}
    			}
    		}
    	}
    }

      this.updateCell = function() {
        //rowno,colno,column,tableid,oldvalue
          console.log(sortableTable.edit_rowid,sortableTable.edit_columnname,sortableTable.edit_tableid);
          tbl.tblbody[sortableTable.edit_rowno][sortableTable.edit_columnname] = updateCellCallback(sortableTable.edit_rowno,null,sortableTable.edit_columnname,sortableTable.edit_tableid,null,sortableTable.edit_rowid);
          this.renderTable();
      }
    }

    function showVariant(param){
      var variantId="#variantInfo" + param;
      var duggaId="#dugga" + param;
      var arrowId="#arrow" + param;
      var index = variant.indexOf(param);


      if (document.getElementById("variantInfo"+param) && document.getElementById("dugga"+param)) { // Check if dugga row and corresponding variant
          if(!isInArray(variant, param)){
               variant.push(param);
          }

          if($(duggaId).hasClass("selectedtr")){ // Add a class to dugga if it is not already set and hide/show variant based on class.
              $(variantId).hide();
              $(duggaId).removeClass("selectedtr");
              $(arrowId).html("&#9658;");
              if (index > -1) {
                 variant.splice(index, 1);
              }

          } else {
              $(duggaId).addClass("selectedtr");
              $(variantId).slideDown();
              $(arrowId).html("&#x25BC;");
          }

          $(variantId).css("border-bottom", "1px solid gray");
      }
}
