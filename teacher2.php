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
<html lang="en">

<head>
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet"> 
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
    <select size='1' name='year' id='year'>
        <!--<option hidden disabled selected value>Select Year</option>-->
        <option value='2020'>2020</option>
        <option value='2019'>2019</option>
        <option value='2018'>2018</option>
        <option value='2017'>2017</option>
    </select>
    <button onclick="getData()">Get Data</button>
    <div style="font-weight:bold">Column filter</div>
    <div id="columnFilter"></div>
    <hr>
    <h2>Planned duties</h2>
    <div id="teacher_plan" style='margin:20px 0;'>
        <table>
            <tr>
                <th>Task</th>
                <th>lp1</th>
                <th>lp2</th>
                <th>lp3</th>
                <th>lp4</th>
                <th>lp5</th>
                <th>tot</th>
            </tr>
            <tr>
                <td>teaching</td>
                <td>40</td>
                <td>200</td>
                <td>130</td>
                <td>200</td>
                <td>200</td>
                <td>200</td>
            </tr>
            <tr>
                <td>Pers dev</td>
                <td>lp1</td>
                <td>lp2</td>
                <td>lp3</td>
                <td>lp4</td>
                <td>lp5</td>
                <td>200</td>
            </tr>
            <tr>
                <td>Research</td>
                <td>lp1</td>
                <td>lp2</td>
                <td>lp3</td>
                <td>lp4</td>
                <td>lp5</td>
                <td>200</td>
            </tr>
            <tr>
                <th>Total</th>
                <th>lp1</th>
                <th>lp2</th>
                <th>lp3</th>
                <th>lp4</th>
                <th>lp5</th>
                <th>200</th>
            </tr>
        </table>
    </div>
    <div>
        <label>Work type</label>
        <select size='1' id='plan_wtype'>
            <!--<option hidden disabled selected value>Select Year</option>-->
            <option value='1'>Teaching</option>
            <option value='2'>Research</option>
            <option value='3'>Pers Dev</option>
            <option value='4'>SP Coordinator</option>
        </select>
        <label>Year Period</label>
        <select size='1' id='plan_period'>
            <!--<option hidden disabled selected value>Select Year</option>-->
            <option value='1'>lp1</option>
            <option value='2'>lp2</option>
            <option value='3'>lp3</option>
            <option value='4'>lp4</option>
            <option value='5'>lp5</option>
        </select>
        <label>Hours</label>
        <input type="text" id="plan_hours">
        <button onclick="add_teacher_plan();">Add teacher plan</button>
    </div>
    <hr>
    <h2>Teaching Total year</h2>
    <div id='total-teaching-container'>
        <div style="margin-bottom:0px;"><span>Search:</span><input type="text" id="lookingGlass" placeholder="write your query" onkeyup="searchterm=document.getElementById('lookingGlass').value;myTable.renderTable();" /></div>
        <div id="yearallocation"></div>
        <h2>Teaching Läsperiod 1</h2>
        <div id="columnFilter1"></div>
        <div class="period-tbl" id="lp1_allocation"></div>
        <h2>Teaching Läsperiod 2</h2>
        <div id="columnFilter2"></div>
        <div class="period-tbl" id="lp2_allocation"></div>
        <h2>Teaching Läsperiod 3</h2>
        <div id="columnFilter3"></div>
        <div class="period-tbl" id="lp3_allocation"></div>
        <h2>Teaching Läsperiod 4</h2>
        <div id="columnFilter4"></div>
        <div class="period-tbl" id="lp4_allocation"></div>
        <h2>Teaching Läsperiod 5</h2>
        <div id="columnFilter5"></div>
        <div class="period-tbl" id="lp5_allocation"></div>
        <div id="editpopover" style="display:none;"></div>
    </div>
</body>

</html>