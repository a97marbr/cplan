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
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#ffee77">
    <meta name="theme-color" content="#ffee77">
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script>
    <script src="course.js"></script>
    <script src="basic.js"></script>
</head>

<body onload="getData();" onkeypress='keypressHandler(event)' ;>
    <?php
    require 'menu.php';
    ?>
    <div>
        <select size='1' name='year' id='year' onchange='getData();'>
            <!--<option hidden disabled selected value>Select Year</option>-->
            <option value='2020'>2020</option>
            <option value='2019'>2019</option>
            <option value='2018'>2018</option>
            <option value='2017'>2017</option>
        </select>
        <select size='1' name='sprogram' id='sprogram' onchange='getData();'>
            <!--<option hidden disabled selected value>Select Study Program</option>-->
            <option value='%'>All</option>
            <option value='WEBUG'>WEBUG</option>
        </select>
        <button onclick="getData()">Get Data</button>
    </div>
    <hr>
    <h4 onclick='$("#columnFilter").toggle( "slow" );'>Column filter for Course Table &#9658;</h4>
    <div id="columnFilter" style="display:none"></div>
    <hr>
    <div style="margin-bottom:0px;"><span>Search:</span><input type="text" id="lookingGlass" placeholder="write your query" onkeyup="searchterm=document.getElementById('lookingGlass').value;myTable.renderTable();" /></div>
    <div id="c" style="width:100%;overflow:scroll;"></div>
    <div id="editpopover" style="display:none;z-index:5000;"></div>
    <div id="tooltip" style="display:none;z-index:4000;position:absolute;"></div>
</body>

</html>