<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script
    			  src="jquery-2.2.4.min.js"
    			  integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
    			  crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script> 
    <script src="courseinstance.js"></script> 
</head>
<body onload="getData();" onkeypress='keypressHandler(event)';>
<?php 
    require 'menu.php';
?>
<select id="courseinstanceSelect" onchange='getData();'></select>
<div style="font-weight:bold">Column filter</div>
<div id="columnFilter"></div>
<hr>
<h2>Total year</h2>
<div style="margin-bottom:0px;"><span>Search:</span><input type="text" id="lookingGlass" placeholder="write your query" onkeyup="searchterm=document.getElementById('lookingGlass').value;myTable.renderTable();"/></div>
<div id="courseinstance"></div>
<div id="editpopover" style="display:none;"></div>

<?php

?>
