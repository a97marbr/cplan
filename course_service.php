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
$sprogram = "";
if (!empty($params->sprogram)) {
    $sprogram = '%' . $params->sprogram . '%';
}
$update = "UNK";
if (isset($params->update)) {
    $update = $params->update;
}

$error = "UNK";
$courses = array();
$teachers = array();
$max_teachers = 0;
if (strcmp($op, "UPDATETEACHING") === 0 && is_object($update) && $isUnlocked) {
    try {
        $updatevalue = $update->updatevalue;
        $timeAllocation = json_encode($updatevalue->allocation);
        $status = intval($updatevalue->status);
        $teid = $updatevalue->teid;
        $hours = intval($updatevalue->hours);
        $ciid = intval($updatevalue->ciid);
        $tid = intval($updatevalue->tid);
        if ($teid !== "UNK" && $timeAllocation !== "UNK") {
            $sql = 'CALL update_teaching(:usrid,:teid,:hours,:status,:allocation)';
            //$sql = 'UPDATE teaching SET allocation=:allocation,status=:status,changed_ts=NOW() WHERE teid=:teid;';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':usrid', $_SESSION["teacherid"]);
            $stmt->bindParam(':teid', $teid);
            $stmt->bindParam(':hours', $hours);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':allocation', $timeAllocation);
            $stmt->execute();
        } else {
            $sql = 'CALL insert_teaching (:usrid,:hours,:status,:ciid,:tid,:allocation);';
            //$sql = 'INSERT INTO teaching (hours,status,ciid,teacher,create_ts,allocation) VALUES(:hours,:status,:ciid,:tid,NOW(),:allocation);';
            $error = $sql;
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':hours', $hours);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':ciid', $ciid);
            $stmt->bindParam(':tid', $tid);
            $stmt->bindParam(':allocation', $timeAllocation);
            $stmt->bindParam(':usrid', $_SESSION["teacherid"]);

            $stmt->execute();
        }
    } catch (PDOException $e) {
        $error = "Database error: Could not update # students\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
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
}

// Get the Data
// -------------------------------------------------------------------------

if ($sprogram == "ALL") {
    $csql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year ORDER BY start_period,cname;';
} else {
    $csql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year and course_instance.study_program like :sprogram ORDER BY study_program,start_period,cname;';
}
$cstmt = $pdo->prepare($csql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
$cstmt->bindParam(':year', $year);
if ($sprogram != "ALL") {
    $cstmt->bindParam(':sprogram', $sprogram);
}
$cstmt->execute();

$tblhead = array(
    'ciid' => 'Course Instance ID',
    'ccode' => 'CCode',
    'cname' => 'Course Name',
    'class' => 'Class',
    'credits' => 'Credits',
    'start_period' => 'Start',
    'end_period' => 'End',
    'study_program' => 'SProgram',
    'students' => 'Students',
    'lecture_time' => 'Lecture Time',
    'supervise_time' => 'Supervise Time',
    'student_time' => 'Student Time',
    'time_budget' => 'Budget',
    'totalAllocation' => 'Total allocation',
    'hsbudget' => 'Henrik S Budget',
    'coordinator' => 'Coordinator',
    'examinators' => 'Examinator(s)',
);

$columnOrder = array('ccode', 'cname', 'class', 'credits', 'coordinator', 'examinators', 'start_period', 'end_period', 'study_program', 'students', 'time_budget');
$sumColumns = array();
$sql2 = 'SELECT fname,lname,sign FROM teacher WHERE active=1 ORDER BY lname ASC;';
$stmt2 = $pdo->prepare($sql2);
$stmt2->execute();
$resColumn = $stmt2->fetchAll(PDO::FETCH_ASSOC);
$columnOrderIdx = sizeof($columnOrder);
foreach ($resColumn as $key => $row) {
    $columnName = 'teacher_' . strtolower($row['fname'] . '_' . $row['lname'] . '_' . $row['sign']);
    $tblhead[$columnName] = $row['lname'] . ', ' . $row['fname'] . ' (' . $row['sign'] . ')';
    $columnOrder[$columnOrderIdx++] = $columnName;
}

$tblbody = array();
$tblfoot = array();
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, '');
array_push($tblfoot, 'Budget');

$hasHeading = false;
$hasFooter = false;
foreach ($cstmt as $ckey => $crow) {
    $course = array();
    $course['ciid'] = $crow['ciid'];
    $course['ccode'] = $crow['ccode'];
    $course['cname'] = $crow['cname'];
    $course['class'] = $crow['class'];
    $course['coordinator'] = $crow['coordinator'];
    $course['examinators'] = $crow['examinators'];
    $cred = 0;
    if (isset($crow['credits'])) {
        $course['credits'] = floatval($crow['credits']);
    }
    $course['start_period'] = $crow['start_period'];
    $course['end_period'] = $crow['end_period'];

    $course['study_program'] = "UNK";
    if (!empty($crow['study_program'])) {
        $course['study_program'] = $crow['study_program'];
    }
    $course['students'] = $crow['students'];
    $course['lecture_time'] = $crow['lecture_time'];
    $course['supervise_time'] = $crow['supervise_time'];
    $course['student_time'] = $crow['student_time'];
    $course['time_budget'] = json_decode($crow['time_budget']);

    $sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,b.allocation,teid,ciid from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid,ciid,allocation from teaching where ciid=:ciid) b ON a.tid=b.teacher ORDER BY sign;';
    //$sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,teid,ciid,comment from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid,course_instance.ciid,course_instance.comment from teaching left outer join course_instance on teaching.ciid=course_instance.ciid where teaching.ciid=:ciid ) b ON a.tid=b.teacher ORDER BY sign;';
    $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
    $stmt->bindParam(':ciid', $crow['ciid']);
    $stmt->execute();
    foreach ($stmt as $key => $row) {
        if ($row['allocation'] != "UNK" && $row['allocation'] != null) {
            $course[strtolower('teacher_' . $row['fname'] . '_' . $row['lname'] . '_' . $row['sign'])] = array(
                'allocation' => json_decode($row['allocation']),
                'hours' => $row['hours'],
                'status' => $row['status'],
                'teid' => $row['teid'],
                'tid' => intval($row['tid']),
                'ciid' => intval($row['ciid'])
            );
        } else {
            $course[strtolower('teacher_' . $row['fname'] . '_' . $row['lname'] . '_' . $row['sign'])] = array(
                'allocation' => 'UNK',
                'hours' => "UNK",
                'status' => "UNK",
                'teid' => "UNK",
                'tid' => intval($row['tid']),
                'ciid' => intval($crow['ciid'])
            );
        }
    }
    $hasHeading = true;
    if ($crow['comment']) {
        $course['comment'] = $crow['comment'];
    } else {
        $course['comment'] = "UNK";
    }

    if ($hasFooter) {
        $hasFooter = true;
    }
    $tblbody[] = $course;
}
$tblhead['comment'] = 'Comment';
$columnOrder[$columnOrderIdx++] = 'comment';

array_push($tblfoot, '');

$teachers = array();
try {
    $sql = 'SELECT * FROM teacher WHERE active=1 ORDER BY tid;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $teachers = array();
    foreach ($stmt as $key => $row) {
        $teacher = array(
            "tid" => intval($row["tid"]),
            "fname" => $row["fname"],
            "lname" => $row["lname"],
            "sign" => $row["sign"],
            "access" => intval($row["access"]),
            "active" => intval($row["active"])
        );
        $teachers[$teacher["tid"]] = $teacher;
    }
} catch (PDOException $e) {
    $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
}

/*
$data = array(
    "tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot),
    "columnOrder" => $columnOrder,
    "error" => $error
);
echo json_encode($data);
*/
$data = array(
    "courses_table" => array("tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot), "columnOrder" => $columnOrder),
    "teachers" => $teachers,
    "year" => $year,
);

$ret_data = array(
    "op" => $op,
    "params" => $params,
    "data" => $data,
    "error" => $error
);
header('Content-type: application/json');
echo json_encode($ret_data);
