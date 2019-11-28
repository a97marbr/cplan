<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script>
    <script src="course.js"></script>
    <script src="basic.js"></script>
</head>
<body onload="getData();" onkeypress='keypressHandler(event)';>
<?php 
    require 'menu.php';
?>
<div>
    <select size='1' name='year' id='year'>
        <option hidden disabled selected value>Select Year</option>
        <option value='2020'>2020</option>
        <option value='2019'>2019</option>
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
<hr>
<div style="font-weight:bold">Column filter for Course Table</div>
<div id="columnFilter"></div>
<hr>
<div style="margin-bottom:0px;"><span>Search:</span><input type="text" id="lookingGlass" placeholder="write your query" onkeyup="searchterm=document.getElementById('lookingGlass').value;myTable.renderTable();"/></div>
<div id="c"></div>
<div id="editpopover" style="display:none;z-index:5000;"></div>
<?php

    ?>
</body>

</html>