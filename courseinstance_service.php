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

try {
    /*

    ciid SERIAL NOT NULL,
    cid INT NOT NULL,
    coordinator INT NOT NULL,
    examiner INT NOT NULL,
    -- SHOULD NOT BE USED ... USE course_instance_examiner table instead
    start_period INT DEFAULT NULL,
    end_period INT DEFAULT NULL,
    year varchar(4) DEFAULT NULL,
    students INT DEFAULT NULL,
    study_program varchar(100) DEFAULT NULL,
    planner INT DEFAULT NULL,
    comment varchar(1024) DEFAULT NULL,
    create_ts timestamp DEFAULT NULL,
    changed_ts timestamp DEFAULT NULL,
    alt_ts timestamp DEFAULT NULL,
    lecture_time INT DEFAULT 0,
    supervise_time INT DEFAULT 0,
    student_time INT DEFAULT 0,
    time_budget JSONB,

    */
    $sql = 'SELECT * FROM course_instance ORDER BY ciid DESC;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $courseinstances = array();
    foreach ($stmt as $key => $row) {
        $courseinstance = array(
            "ciid" => intval($row["ciid"]),
            "cid" => intval($row["cid"]),
            "coordinator" => intval($row["coordinator"]),
            "start_period" => intval($row["start_period"]),
            "end_period" => intval($row["end_period"]),
            "students" => intval($row["students"]),
            "study_program" => $row["study_program"],

            "year" => intval($row["year"]),
            "planner" => intval($row["planner"]),
            "comment" => $row["comment"],
            "create_usr" => intval($row["create_usr"]),
            "create_ts" => $row["create_ts"],
            "changed_usr" => intval($row["changed_usr"]),
            "changed_ts" => $row["changed_ts"],
            "alt_usr" => intval($row["alt_usr"]),
            "alt_ts" => $row["alt_ts"],
            "timebudget" => $row["timebudget"]

        );
        array_push($courseinstances, $courseinstance);
    }

    $sql = 'SELECT * FROM course WHERE active=1 ORDER BY cid;';
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

    $sql = 'SELECT * FROM teacher WHERE active=1 ORDER BY tid;';
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

    $sql = 'SELECT * FROM year_period ORDER BY id;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $teachers = array();
    foreach ($stmt as $key => $row) {
        $teacher = array(
            "id"=>intval($row["id"]),
            "short_desc"=>$row["short_desc"],
            "long_desc"=>$row["long_desc"],
        );
        array_push($teachers,$teacher);
    }

    $sql = 'SELECT * FROM course_instance_examiner ORDER BY ciid;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $examiners = array();
    foreach ($stmt as $key => $row) {
        $examiner = array(
            "tid"=>intval($row["tid"]),
            "ciid"=>intval($row["ciid"]),
        );
        array_push($examiners,$examiner);
    }

} catch (PDOException $e) {
    $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
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
    "courseinstances" => $courseinstances,
    "courses" => $courses,
    "teachers" => $teachers,
    "examiners" => $examiners,
);

$ret_data = array(
    "op"=>$op,
    "params"=>$params,
    "data"=>$data,
    "error" => $error
);
header('Content-type: application/json');
echo json_encode($ret_data);
