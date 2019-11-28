<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION["teacherid"])) {
    header("location: login.php");
    exit;
}

require '../dbconnect.php';
$op = getOP("op", "UNK", "string");
$params = getOP("params", "UNK", "json");

$year = new DateTime('Y');
if (!empty($params['year'])) {
    $year = $params['year'];
}
$sign = "UNK";
if (!empty($params['sign'])) {
    $sign = $params['sign'];
}

$updatevalue = "UNK";
if (!empty($params['updatevalue'])) {
    $updatevalue = $params['updatevalue'];
}

$isUnlocked = false;
if ($_SESSION["access"] > 0) {
    $isUnlocked = true;
}

$error = "UNK";
$max_teachers = 0;
if ($op == "UPDATETEACHING" && $updatevalue !== "UNK" && $isUnlocked) {
    $timeAllocation = json_encode($updatevalue["allocation"]);
    $status = intval($updatevalue['status']);
    $teid = $updatevalue['teid'];
    $hours = intval($updatevalue["hours"]);
    $ciid = intval($updatevalue['ciid']);
    $tid = intval($updatevalue['tid']);
    if ($teid !== "UNK" && $timeAllocation !== "UNK") {
        $sql = 'UPDATE teaching SET allocation=:allocation,status=:status,changed_ts=NOW() WHERE teid=:teid;';
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':teid', $teid);
        $stmt->bindParam(':allocation', $timeAllocation);
        $stmt->bindParam(':status', $status);
        if (!$stmt->execute()) {
            $error = $stmt->errorInfo();
        }
    } else {
        $sql = 'INSERT INTO teaching (hours,status,ciid,teacher,create_ts,allocation) VALUES(:hours,:status,:ciid,:tid,NOW(),:allocation);';
        $error = $sql;
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':hours', $hours);
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':ciid', $ciid);
        $stmt->bindParam(':tid', $tid);
        $stmt->bindParam(':allocation', $timeAllocation);

        if (!$stmt->execute()) {
            $error = $stmt->errorInfo();
        }
    }
} else if ($op == "UPDATECOURSEINSTANCE" && $updatevalue !== "UNK" && $isUnlocked) {
    $timebudget = "UNK";
    $students = "UNK";
    $comment = "UNK";
    if ($updaterow !== "UNK") {
        $ciid = $updaterow;
    }
    if ($updatecol == "students") {
        $students = intval($updatevalue);
    } else if ($updatecol == "comment") {
        $comment = $updatevalue;
    } else if ($updatecol == "time_budget") {
        $timebudget = json_encode($updatevalue);
    }
    if ($ciid !== "UNK") {
        $sql = 'UPDATE course_instance SET ';
        if ($comment !== "UNK") {
            $sql .= 'comment=:comment,';
        }
        if ($students !== "UNK") {
            $sql .= 'students=:students,';
        }
        if ($timebudget !== "UNK") {
            $sql .= 'time_budget=:time_budget,';
        }
        $sql .= 'changed_ts=NOW() WHERE ciid=:ciid;';
        $error = $timebudget;
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ciid', $ciid);
        if ($comment !== "UNK") {
            $stmt->bindParam(':comment', $comment);
        }
        if ($students !== "UNK") {
            $stmt->bindParam(':students', $students);
        }
        if ($timebudget !== "UNK") {
            $stmt->bindParam(':time_budget', $timebudget);
        }
        if (!$stmt->execute()) {
            $error = $stmt->errorInfo();
        }
    }
}

// Get the Data
// -------------------------------------------------------------------------

$sql = 'select * from teacher,course_instance,teaching where course_instance.ciid=:ciid and teaching.ciid=course_instance.ciid and teacher.tid=teaching.teacher;';
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':ciid', $ciid);
$stmt->execute();
$tblhead = array("ccode" => "Course Code", "cname" => "Course Name", "time_allocation" => "Total Allocated", "start_period" => "Start", "end_period" => "End", "unspecified" => "Unspecified", "lecture" => "Lecture", "supervision" => "Supervision", "seminar" => "Seminar", "development" => "Development", "preparation" => "Preparation", "grading" => "Grading", "examination" => "Examination", "running" => "Running", "other" => "Other");
$tblfoot = array();
$tblbody = array();
$columnOrder = array("ccode", "cname", "start_period", "end_period", "time_allocation", "unspecified", "lecture", "supervision", "seminar", "development", "preparation", "grading", "examination", "running", "other");
foreach ($stmt as $key => $row) {
    $item = array(
        "teid" => $row['teid'],
        "start_period" => $row['start_period'],
        "end_period" => $row['end_period'],
        "time_allocation" => json_decode($row['allocation'])
    );
    foreach (json_decode($row['allocation']) as $allocType => $allocValue) {
        $item[$allocType] = $allocValue;
    }

    array_push($tblbody, $item);
}

/*
    $sql = 'select * from teacher order by lname';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $teachers=array();
    $selected="UNK";
    foreach($stmt as $key => $row){
        $item=array(
            "fname"=>$row['fname'],
            "lname"=>$row['lname'],
            "sign"=>$row['sign'],
        );
        if($row['sign']==$sign){$selected=$row['sign'];}

        array_push($teachers,$item);
    }
*/

$data = array(
    "courses_table"=>array("tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot), "columnOrder" => $columnOrder),
);

$ret_data = array(
    "op"=>$op,
    "params"=>$params,
    "data"=>$data,
    "error" => $error
);
header('Content-type: application/json');
echo json_encode($ret_data);
