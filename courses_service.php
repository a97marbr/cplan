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
    if (strcmp($op, "UDATE_COURSE_ACTIVE") === 0) {

        //TODO

    }else if (strcmp($op, "UDATE_COURSE_CCODE") === 0) {

        //TODO

    }else if (strcmp($op, "UDATE_COURSE_CNAME") === 0) {

        //TODO

    }else if (strcmp($op, "UDATE_COURSE_CLASS") === 0) {

        //TODO

    }else if (strcmp($op, "UDATE_COURSE_CREDITS") === 0) {

        //TODO

    } else if (strcmp($op, "ADD_COURSE") === 0) {

        if (isset($params->update->ccode)) {
            $ccode = $params->update->ccode;
        } else {
            $ccode = "UNK";
        }

        if (isset($params->update->cname)) {
            $cname = $params->update->cname;
        } else {
            $cname = "UNK";
        }

        if (isset($params->update->class)) {
            $class = $params->update->class;
        } else {
            $class = "UNK";
        }

        if (isset($params->update->credits)) {
            $credits = $params->update->credits;
        } else {
            $credits = "UNK";
        }

        if ($ccode != "UNK" && $cname != "UNK") {
            $sql = "INSERT INTO course (ccode,cname,class,credits) values(:ccode,:cname,:class,:credits);";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':ccode', $ccode, PDO::PARAM_STR, 45);
            $stmt->bindParam(':cname', $cname, PDO::PARAM_STR, 100);
            $stmt->bindParam(':class', $class, PDO::PARAM_STR, 45);
            $stmt->bindParam(':credits', $credits, PDO::PARAM_STR);
            $stmt->execute();
        }
    }
}

try {
    $sql = 'SELECT * FROM course ORDER BY cid;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $courses = array();
    foreach ($stmt as $key => $row) {
        $course = array(
            "cid" => intval($row["cid"]),
            "ccode" => $row["ccode"],
            "cname" => $row["cname"],
            "credits" => floatval($row["credits"]),
            "class" => $row["class"],
            "active" => intval($row["active"])
        );
        array_push($courses, $course);
    }
} catch (PDOException $e) {
    $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
}

$data = array(
    "courses" => $courses,
);

$ret_data = array(
    "op" => $op,
    "params" => $params,
    "data" => $data,
    "error" => $error
);
header('Content-type: application/json');

echo json_encode($ret_data);
