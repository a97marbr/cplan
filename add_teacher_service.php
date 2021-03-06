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
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
    <script src="basic.js"></script>
</head>

<body>
    <?php
    require 'menu.php';
    ?>
    <h3>Add teacher</h3>
    <form action="add_teacher_service.php" method="post">
        Förnamn:<input type="text" name="fname" placeholder='Marcus'>
        Efternamn:<input type="text" name="lname" placeholder="Brohede">
        Signatur:<input type="text" name="sign" placeholder="BROM">
        <input type="submit" value="Send">
    </form>

    <?php

    if (isset($_POST['fname'])) {
        $fname = $_POST['fname'];
    } else {
        $fname = "UNK";
    }

    if (isset($_POST['lname'])) {
        $lname = $_POST['lname'];
    } else {
        $lname = "UNK";
    }

    if (isset($_POST['sign'])) {
        $sign = $_POST['sign'];
    } else {
        $sign = "UNK";
    }

    if ($fname != "UNK" && $lname != "UNK" && $sign != "UNK") {
        $sql = "INSERT INTO teacher (fname,lname,sign) VALUES(:fname,:lname,:sign);";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':fname', $fname, PDO::PARAM_STR, 100);
        $stmt->bindParam(':lname', $lname, PDO::PARAM_STR, 100);
        $stmt->bindParam(':sign', $sign, PDO::PARAM_STR, 5);
        $stmt->execute();
    }

    ?>

</body>

</html>