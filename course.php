<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script> 
    <script src="course.js"></script> 
</head>
<body onload="getData();" onkeypress='keypressHandler(event)';>
<h3>Course planing overview</h3>
<?php 
    require 'menu.php';
?>
<div>
    <select size='1' name='year' id='year'>
        <option hidden disabled selected value>Select Year</option>
        <option value='2018'>2018</option>
        <option value='2017'>2017</option>
    </select>
    <select size='1' name='sprogram' id='sprogram'>
        <option hidden disabled selected value>Select Study Program</option>
        <option value='ALL'>All</option>
        <option value='WEBUG'>WEBUG</option>
    </select>
    <button onclick="getData()">Get Data</button>
</div> 
<h2>Column filter for Course Table</h2>
<div id="columnFilter"></div>
<div id="c"></div>
<div id="editpopover" style="display:none;"></div>

<?php

?>
