<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}
require '../dbconnect.php';
?>
<html>

<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script>

    <script src="basic.js"></script>
    <script src="courses.js"></script>
</head>

<body onload="getData();">
    <?php
    require 'menu.php';
    ?>
    <div class="container-fluid">
        <h3>Add course</h3>
        <div>
            <label>Kurskod:</label><input type="text" id="ccode" placeholder='IT108G'>
            <label>Kursnamn:</label><input type="text" id="cname" placeholder="Webbutveckling - Webbplatsdesign">
            <label>Klassificering:</label><input type="text" id="class" placeholder="G1N">
            <label>Högskolepoäng:</label><input type="text" id="credits" placeholder="7.5">
            <span class="btn btn-primary" onclick="addCourse();">Add Course</span>
        </div>
        <h3>List Courses</h3>
        <div class="btn btn-primary btn-sm" onclick="$('#course-list-table-filter').toggle( 'slow' );">Show/hide table filter</div>
        <div style="display:none;" id="course-list-table-filter">
            <div id="columnFilter"></div>
            <div id="rowFilter">
                <input type="checkbox" id="hide-inactive" class="course-list-table-row-filter" onchange="updateRowFilter()"><label for="hide-inactive">Hide Inactive courses</label><br>
                <input type="checkbox" id="hide-less" class="course-list-table-row-filter" onchange="updateRowFilter()"><input type="range" id="hide-less-range" max="60" min="0" step="0.5" class="course-list-table-row-filter" onchange="updateRowFilter()"><label style="opacity:0.5" for="hide-admins">Hide courses with less then <span id="hide-less-range-val"></span> credits</label><br>
                <input type="checkbox" id="hide-more" class="course-list-table-row-filter" onchange="updateRowFilter()"><input type="range" id="hide-more-range" max="60" min="0" step="0.5" class="course-list-table-row-filter" onchange="updateRowFilter()"><label style="opacity:0.5" for="hide-users">Hide courses with more then <span id="hide-more-range-val"> credits</label>
            </div>
        </div>
        <div id="course-list-table"></div>
    </div>
</body>

</html>