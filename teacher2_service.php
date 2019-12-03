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

$year = new DateTime();
$year = $year->format('Y');
if (!empty($params->year)) {
    $year = $params->year;
}
$sign = "UNK";
if (empty($params->sign)) {
    $sign = $_SESSION['username'];
} else {
    $sign = $params->sign;
}
$update = "UNK";
if (isset($params->update)) {
    $update = $params->update;
}

//$isUnlocked = false;
$isUnlocked = $_SESSION["access"];

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
} else if (strcmp($op, "UPDATECOURSEINSTANCE_STUDENTS") === 0 && is_object($update) && $isUnlocked) {
    $students = "UNK";
    if (isset($update->updatevalue)) {
        $students = $update->updatevalue;
    }
    $ciid = "UNK";
    if (isset($update->updaterow)) {
        $ciid = $update->updaterow;
    }
    if ($students !== "UNK" && $ciid !== "UNK") {
        try {
            $sql = 'UPDATE course_instance SET students=:students,changed_ts=NOW() WHERE ciid=:ciid;';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':students', $students);
            $stmt->bindParam(':ciid', $ciid);
            $stmt->execute();
        } catch (PDOException $e) {
            $error = "Database error: Could not update # students\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
        }
    }
} else if (strcmp($op, "UPDATECOURSEINSTANCE_TIMEBUDGET") === 0 && is_object($update) && $isUnlocked) {
    $sql = 'UPDATE course_instance SET time_budget=:time_budget,changed_ts=NOW() WHERE ciid=:ciid;';
    $timebudget = "UNK";
    if (isset($update->updatevalue)) {
        $timebudget = json_encode($update->updatevalue);
    }
    $ciid = "UNK";
    if (isset($update->updaterow)) {
        $ciid = $update->updaterow;
    }
    if ($timebudget !== "UNK" && $ciid !== "UNK") {
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':time_budget', $timebudget);
            $stmt->bindParam(':ciid', $ciid);
            $stmt->execute();
        } catch (PDOException $e) {
            $error = "Database error: Could not update time budget\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
        }
    }
} else if (strcmp($op, "UPDATECOURSEINSTANCE_COMMENT") === 0 && is_object($update) && $isUnlocked) {
    $sql = 'UPDATE course_instance SET comment=:comment,changed_ts=NOW() WHERE ciid=:ciid;';
    $comment = "UNK";
    if (isset($update->updatevalue)) {
        $comment = $update->updatevalue;
    }
    $ciid = "UNK";
    if (isset($update->updaterow)) {
        $ciid = $update->updaterow;
    }
    if ($comment !== "UNK" && $ciid !== "UNK") {
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':comment', $comment);
            $stmt->bindParam(':ciid', $ciid);
            $stmt->execute();
        } catch (PDOException $e) {
            $error = "Database error: Could not update comment\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
        }
    }
} else if (strcmp($op, "ADD_TEACHER_PLAN") === 0 && $isUnlocked) {
    //INSERT INTO teacher_year_budget(year,tid,yperiod,wtype,whours) VALUES (2020,1,5,1,220);
    $sql = 'SELECT tid FROM teacher WHERE sign=:sign;';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':sign', $sign);
    $stmt->execute();
    $tid = "UNK";
    foreach ($stmt as $key => $row) {
        $tid = intval($row["tid"]);
    }
    $error="SNUS";
    if (is_int($tid)) {
        $yperiod = "UNK";
        if (isset($params->yperiod)) {
            $yperiod = $params->yperiod;
        }
        $year = "UNK";
        if (isset($params->year)) {
            $year = $params->year;
        }
        $wtype = "UNK";
        if (isset($params->wtype)) {
            $wtype = $params->wtype;
        }
        $whours = "UNK";
        if (isset($params->whours)) {
            $whours = $params->whours;
        }
        $error.=$year."!!".$yperiod."!!".$whours."!!".$wtype;
        if ($year !== "UNK" && $tid !== "UNK" && $yperiod !== "UNK" && $wtype !== "UNK" && $whours !== "UNK") {
            try {
                $sql = 'INSERT INTO teacher_year_budget(year,tid,yperiod,wtype,whours) VALUES (:year,:tid,:yperiod,:wtype,:whours);';
                $stmt = $pdo->prepare($sql);
                $stmt->bindParam(':year', $year);
                $stmt->bindParam(':tid', $tid);
                $stmt->bindParam(':yperiod', $yperiod);
                $stmt->bindParam(':wtype', $wtype);
                $stmt->bindParam(':whours', $whours);
                $stmt->execute();
            } catch (PDOException $e) {
                $error = "Database error: Could not update comment\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
            }
        }
    
    }
}
// Get the Data
// -------------------------------------------------------------------------

// Get teacher id for selected sign
try {
    $sql = 'SELECT tid FROM teacher WHERE sign=:sign;';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':sign', $sign);
    $stmt->execute();
    $tid = "UNK";
    $teacher_plans = array();
    foreach ($stmt as $key => $row) {
        $tid = intval($row["tid"]);
    }
    if (is_int($tid)) {
        // Get teacher's overall budget
        // SELECT SUM(whours) FROM teacher_year_budget LEFT OUTER JOIN year_period ON teacher_year_budget.yperiod=year_period.id AND tid=1 AND year=2020;
        // SELECT * FROM teacher_year_budget LEFT OUTER JOIN year_period ON teacher_year_budget.yperiod=year_period.id LEFT JOIN worktype ON teacher_year_budget.wtype=worktype.id AND tid=1 AND year=2020;

        // Get teacher's overall budget by year periods
        // SELECT year_period.id AS year_period,SUM(whours) AS hours FROM teacher_year_budget LEFT OUTER JOIN year_period ON teacher_year_budget.yperiod=year_period.id AND tid=1 AND year=2020 GROUP BY year_period.id ORDER BY year_period.short_desc;
        // SELECT teacher_year_budget.*,year_period.*,worktype.short_desc AS wtype_desc,worktype.letter FROM teacher_year_budget JOIN year_period ON teacher_year_budget.yperiod=year_period.id JOIN worktype ON teacher_year_budget.wtype=worktype.id WHERE tid=1 AND year=2020;
        $y = intval($year);
        $sql = 'SELECT teacher_year_budget.*,year_period.*,worktype.long_desc AS wtype_desc,worktype.letter FROM teacher_year_budget JOIN year_period ON teacher_year_budget.yperiod=year_period.id JOIN worktype ON teacher_year_budget.wtype=worktype.id WHERE tid=:tid AND year=:year;';
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':tid', $tid);
        $stmt->bindParam(':year', $y);
        $stmt->execute();
        foreach ($stmt as $key => $row) {
            $plan = array(
                "year" => intval($row['year']),
                "period" => intval($row['yperiod']),
                "wtype" => $row['wtype_desc'],
                "wtype_letter" => $row['letter'],
                "whours" => floatval($row['whours']),
            );

            array_push($teacher_plans, $plan);
        }
    }
    $sql = 'SELECT * FROM teacher,teaching,course_instance,course WHERE teacher.tid=teaching.teacher and teacher.sign=:sign and teaching.ciid=course_instance.ciid and course.cid=course_instance.cid and course_instance.year=:year order by course_instance.start_period;';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':sign', $sign);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $tblhead = array("ccode" => "Course Code", "cname" => "Course Name", "time_allocation" => "Total Allocated", "start_period" => "Start", "end_period" => "End", "unspecified" => "Unspecified", "lecture" => "Lecture", "supervision" => "Supervision", "seminar" => "Seminar", "development" => "Development", "preparation" => "Preparation", "grading" => "Grading", "examination" => "Examination", "running" => "Running", "other" => "Other");
    $tblfoot = array();
    $tblbody = array();
    $columnOrder = array("ccode", "cname", "start_period", "end_period", "time_allocation", "unspecified", "lecture", "supervision", "seminar", "development", "preparation", "grading", "examination", "running", "other");
    foreach ($stmt as $key => $row) {
        $item = array(
            "teid" => $row['teid'],
            "ccode" => $row['ccode'],
            "cname" => $row['cname'],
            "start_period" => $row['start_period'],
            "end_period" => $row['end_period'],
            "time_allocation" => json_decode($row['allocation'])
        );
        foreach (json_decode($row['allocation']) as $allocType => $allocValue) {
            $item[$allocType] = $allocValue;
        }

        array_push($tblbody, $item);
    }

    $sql = 'SELECT * FROM teacher ORDER BY lname';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $teachers = array();
    $selected = "UNK";
    foreach ($stmt as $key => $row) {
        $item = array(
            "fname" => $row['fname'],
            "lname" => $row['lname'],
            "sign" => $row['sign'],
        );
        if ($row['sign'] == $sign) {
            $selected = $row['sign'];
        }

        array_push($teachers, $item);
    }

    $sql = 'SELECT * FROM worktype ORDER BY id';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $worktypes = array();    
    foreach ($stmt as $key => $row) {
        $worktype = array(
            "id" => intval($row['id']),
            "letter" => $row['letter'],
            "short_desc" => $row['short_desc'],
            "long_desc" => $row['long_desc'],
        );
        array_push($worktypes, $worktype);
    }
} catch (PDOException $e) {
    $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
}

$data = array(
    "teaching_table" => array("tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot), "columnOrder" => $columnOrder),
    "year" => $year,
    "teachers" => $teachers,
    "selected" => $selected,
    "teacher_plans" => $teacher_plans,
    "worktypes"=>$worktypes
);

$ret_data = array(
    "op" => $op,
    "params" => $params,
    "data" => $data,
    "error" => $error
);
header('Content-type: application/json');

echo json_encode($ret_data);
