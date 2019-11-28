<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}
?>
<html>
<head>
  <meta charset="utf-8">
  <link rel="stylesheet" type="text/css" href="style.css">
  <script
      src="https://code.jquery.com/jquery-3.2.1.min.js"
      integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
      crossorigin="anonymous"></script>
  <script src="unlock.js"></script>       
  <script src="teacher.js"></script> 
  <script src="basic.js"></script>
</head>
<body onload="getData();">
<h3>Teacher View</h3>
<?php 
    require 'menu.php';
?>
<div>
    <select size='1' name='sign' id=sign></select>
    <select size='1' name='year' id='year'>
        <option value='2018'>2018</option>
        <option value='2017'>2017</option>
    </select>
    <button onclick='getData();'>Get Data</button>
</div>
<table id="c"></table>
<div><span class='unconfirmed' style='padding:0 5px 0 5px'>Unconfirmed time</span><span class='mustchange' style='padding:0 5px 0 5px'>Must change time</span></div>
</body>
</html>
