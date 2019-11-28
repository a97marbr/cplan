<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}
require '../dbconnect.php';

if (isset($_POST['sign'])) {
    $sign = $_POST['sign'];
} else {
    $sign = "BROM";
}
if (isset($_POST['year'])) {
    $year = $_POST['year'];
} else {
    $year = "2018";
}
if (isset($_POST['op'])) {
    $op = $_POST['op'];
} else {
    $op = "UNK";
}
if (isset($_POST['teid'])) {
    $teid = $_POST['teid'];
} else {
    $teid = "UNK";
}
if (isset($_POST['hours'])) {
    $hours = intval($_POST['hours']);
} else {
    $hours = "UNK";
}
if (isset($_POST['status'])) {
    $status = intval($_POST['status']);
} else {
    $status = "UNK";
}
if ($op == "UPDATE" && $isUnlocked) {
    if ($teid !== "UNK" && $hours !== "UNK" && $status !== "UNK") {
        $sql = 'UPDATE teaching SET hours=:hours,status=:status WHERE teid=:teid;';

        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':teid', $teid);
        $stmt->bindParam(':hours', $hours);
        $stmt->bindParam(':status', $status);
        $stmt->execute();
    }
}

$sql = 'select fname,lname,sign,ccode,cname,hours,status,start_period,end_period,teid from teaching,teacher,course,course_instance WHERE teaching.ciid=course_instance.ciid and course_instance.year=:year and course_instance.cid=course.cid and teaching.teacher=teacher.tid and teacher.sign=:sign ORDER BY start_period,cname;';

$stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
$stmt->bindParam(':sign', $sign);
$stmt->bindParam(':year', $year);
$stmt->execute();
$courses = array();
$totals = array();

foreach ($stmt as $key => $row) {
    array_push($courses, $row);
}

$sql = 'select start_period,SUM(hours) as total FROM teaching, teacher, course_instance, course WHERE teaching.ciid=course_instance.ciid and course_instance.cid=course.cid and course_instance.year=:year and teaching.teacher=teacher.tid and teacher.sign=:sign group by start_period;';
$stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
$stmt->bindParam(':sign', $sign);
$stmt->bindParam(':year', $year);
$stmt->execute();
foreach ($stmt as $key => $row) {
    $totals[$row['start_period']] = $row['total'];
}

foreach ($pdo->query('SELECT lname,fname,sign FROM teacher ORDER BY lname;') as $row) {
    $teachers[] = array('fname' => $row['fname'], 'lname' => $row['lname'], 'sign' => $row['sign']);
}

$data = array(
    'courses' => $courses,
    'teachers' => $teachers,
    'totals' => $totals
);
echo json_encode($data);
