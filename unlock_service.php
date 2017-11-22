<?php

$sql = "SELECT * FROM user WHERE username = '". mysqli_real_escape_string($user) ."' AND pass = '". mysqli_real_escape_string($pass) ."'" ;";

$stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
$stmt->bindParam(':sign', $sign);
$stmt->bindParam(':year', $year);
$stmt->execute();
$result = mysqli_query($dbc,$query);
if (mysqli_num_rows($result) == 1) {
//Pass
} else {
//Fail
}

?>
