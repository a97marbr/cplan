<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script
			  src="https://code.jquery.com/jquery-3.2.1.min.js"
			  integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
			  crossorigin="anonymous"></script>
    <script src="course.js"></script> 
</head>
<body onload="getData();">
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
<table id="c"  style='border-collapse: collapse;'></table>

<?php

?>
