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
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script>

    <script src="basic.js"></script>
    <script src="courseinstance.js"></script>
</head>

<body onload="getData();">
    <?php
    require 'menu.php';
    ?>
    <div class="container-fluid">
        <h3>Add Course Instance</h3>
        <div>
            <!--
            <label for="fname">Förnamn:</label><input type="text" id="fname" placeholder='Marcus'>
            <label for="lname">Efternamn:</label><input type="text" id="lname" placeholder="Brohede">
            <label for="sign">Signatur:</label><input type="text" id="sign" placeholder="BROM">
            <span class="btn btn-primary" onclick="addTeacher();">Add Teacher</span>
            -->
            <label for="cid">Kurs</label><select size='1' id='cid'></select>
            <label for="coordinator">Kursansvarig</label><select size='1' id='coordinator'></select>
            <label for="examinators">Examinatorer</label>
            <select size='1' id='examinators'></select>
            <!--<input type="text" id="examinators" placeholder="BROM,GUSH">-->
            <!--
            <select>
                <option disabled>Select examinors</option>
            </select>
            -->
            <label for="year">År</label><input type="text" id="year" placeholder="2018">
            <label for="start_period">Start</label><select size='1' id='start_period'></select>
            <label for="end_period">Slut</label><select size='1' id='end_period'></select>
            <label for="study_program">ProgramÅr:</label><input type="text" id="study_program" placeholder='WEBUG1'>
            <span class="btn btn-primary" onclick="addCourseInstance();">Add Course Instance</span>

        </div>
        <h3>List of Course Instances</h3>
        <div class="btn btn-primary btn-sm" onclick="$('#courseinstance-list-table-filter').toggle( 'slow' );">Show/hide table filter</div>
        <div style="display:none" id="courseinstance-list-table-filter">
            <div id="columnFilter"></div>
            <div id="rowFilter">
                <!--
                <input type="checkbox" id="hide-inactive" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-inactive">Hide Inactive teachers</label><br>
                <input type="checkbox" id="hide-admins" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-admins">Hide Administrator teachers</label><br>
                <input type="checkbox" id="hide-users" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-users">Hide Regular teachers</label>
                -->
            </div>
        </div>
        <div style="width:100%;overflow:scroll;" id="courseinstance-list-table"></div>
    </div>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>