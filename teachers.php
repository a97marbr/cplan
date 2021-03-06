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
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#ffee77">
    <meta name="theme-color" content="#ffee77">
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script src="unlock.js"></script>
    <script src="sortableTable.js"></script>

    <script src="basic.js"></script>
    <script src="teachers.js"></script>
</head>

<body onload="getData();">
    <?php
    require 'menu.php';
    ?>
    <div class="container-fluid">
        <h3>Add teacher</h3>
        <div id="toast" style="display:none;"></div>
        <div>
            <label for="fname">Förnamn:</label><input type="text" id="fname" placeholder='Marcus'>
            <label for="lname">Efternamn:</label><input type="text" id="lname" placeholder="Brohede">
            <label for="sign">Signatur:</label><input type="text" id="sign" placeholder="BROM">
            <span class="btn btn-primary" onclick="addTeacher();">Add Teacher</span>
        </div>
        <h3>List of teachers</h3>
        <div class="btn btn-primary btn-sm" onclick="$('#teacher-list-container-filter').toggle( 'slow' );">Show/hide table filter</div>
        <div style="display:none" id="teacher-list-container-filter">
            <div id="columnFilter"></div>
            <div id="rowFilter">
                <input type="checkbox" id="hide-inactive" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-inactive">Hide Inactive teachers</label><br>
                <input type="checkbox" id="hide-admins" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-admins">Hide Administrator teachers</label><br>
                <input type="checkbox" id="hide-users" class="teacher-list-container-row-filter" onchange="updateRowFilter()"><label for="hide-users">Hide Regular teachers</label>
            </div>
        </div>
        <div id="teacher-list-container"></div>
    </div>
    <div id="editpopover" style="display:none;z-index:5000;"></div>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
</body>

</html>