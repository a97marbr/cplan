<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}
require '../dbconnect.php';
require 'basic.php';

$op = getOP("op", "UNK", "string");
$params = getOP("params", "UNK", "json");

if ($_SESSION["access"] > 0) {
    if (strcmp($op, "CHANGE_TEACHER_ACTIVE") === 0) {

    }else if(strcmp($op, "ADD_TEACHER") === 0){

        if (isset($params->update->fname)) {
            $fname = $params->update->fname;
        } else {
            $fname = "UNK";
        }
        
        if (isset($params->update->lname)) {
            $lname = $params->update->lname;
        } else {
            $lname = "UNK";
        }
        
        if (isset($params->update->sign)) {
            $sign = $params->update->fname;
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
        
    }

    
}

try {
    $sql = 'SELECT * FROM teacher ORDER BY tid;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $teachers = array();
    foreach ($stmt as $key => $row) {
        $teacher = array(
            "tid"=>intval($row["tid"]),
            "fname"=>$row["fname"],
            "lname"=>$row["lname"],
            "sign"=>$row["sign"],
            "access" => intval($row["access"]),
            "active" => intval($row["active"])
        );
        array_push($teachers,$teacher);
    }
} catch (PDOException $e) {
    $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
}

$data = array(
    "teachers" => $teachers,
);

$ret_data = array(
    "op" => $op,
    "params" => $params,
    "data" => $data,
    "error" => $error
);
header('Content-type: application/json');

echo json_encode($ret_data);

