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
    <script src="teacher2.js"></script>
    <script src="basic.js"></script>
</head>

<body onload="getData();" onkeypress='keypressHandler(event)' ;>
    <?php
    require 'menu.php';
    ?>
    <select id="teacherSelect" onchange='getData();'></select>
    <div style="font-weight:bold">Column filter</div>
    <div id="columnFilter"></div>
    <hr>
    <h2>Total year</h2>
    <div style="margin-bottom:0px;"><span>Search:</span><input type="text" id="lookingGlass" placeholder="write your query" onkeyup="searchterm=document.getElementById('lookingGlass').value;myTable.renderTable();" /></div>
    <div id="yearallocation"></div>
    <h2>Läsperiod 1</h2>
    <div id="columnFilter1"></div>
    <div id="lp1_allocation"></div>
    <h2>Läsperiod 2</h2>
    <div id="columnFilter2"></div>
    <div id="lp2_allocation"></div>
    <h2>Läsperiod 3</h2>
    <div id="columnFilter3"></div>
    <div id="lp3_allocation"></div>
    <h2>Läsperiod 4</h2>
    <div id="columnFilter4"></div>
    <div id="lp4_allocation"></div>
    <h2>Läsperiod 5</h2>
    <div id="columnFilter5"></div>
    <div id="lp5_allocation"></div>
    <div id="editpopover" style="display:none;"></div>
</body>
</html>