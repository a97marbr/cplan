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
$year=$year->format('Y');
if (!empty($params->year)) {
    $year = $params->year;
}
$sprogram = "ALL";
if (!empty($params->sprogram)) {
    $sprogram = '%'.$params->sprogram.'%';
}
/*
if (isset($_POST['year'])) {
    $year = $_POST['year'];
} else {
    $year = "2018";
}
if (isset($_POST['sprogram'])) {
    if ($_POST['sprogram'] != "ALL") {
        $sprogram = '%' . $_POST['sprogram'] . '%';
    } else {
        $sprogram = "ALL";
    }
} else {
    $sprogram = "ALL";
}

if (isset($_POST['command'])) {
    $op = $_POST['command'];
} else {
    $op = "UNK";
}
*/
if (isset($_POST['updaterow'])) {
    $updaterow = intval($_POST['updaterow']);
} else {
    $updaterow = "UNK";
}
if (isset($_POST['updatecol'])) {
    $updatecol = $_POST['updatecol'];
} else {
    $updatecol = "UNK";
}
if (isset($_POST['updatevalue'])) {
    $updatevalue = json_decode($_POST['updatevalue'], true);
} else {
    $updatevalue = "UNK";
}
if (isset($_POST['status'])) {
    $status = intval($_POST['status']);
} else {
    $status = "UNK";
}
if (isset($_POST['ciid'])) {
    $ciid = intval($_POST['ciid']);
} else {
    $ciid = "UNK";
}
if (isset($_POST['tid'])) {
    $tid = intval($_POST['tid']);
} else {
    $tid = "UNK";
}
if (isset($_POST['comment'])) {
    if ($_POST['comment'] !== "UNK") {
        $comment = $_POST['comment'];
    } else {
        $comment = "UNK";
    }
} else {
    $comment = "UNK";
}
if (isset($_POST['students'])) {
    if ($_POST['students'] !== "UNK") {
        $students = intval($_POST['students']);
    } else {
        $students = "UNK";
    }
} else {
    $students = "UNK";
}
if (isset($_POST['lectureTime'])) {
    if ($_POST['lectureTime'] !== "UNK") {
        $lectureTime = intval($_POST['lectureTime']);
    } else {
        $lectureTime = "UNK";
    }
} else {
    $lectureTime = "UNK";
}
if (isset($_POST['superviseTime'])) {
    if ($_POST['superviseTime'] !== "UNK") {
        $superviseTime = intval($_POST['superviseTime']);
    } else {
        $superviseTime = "UNK";
    }
} else {
    $superviseTime = "UNK";
}
if (isset($_POST['studentTime'])) {
    if ($_POST['studentTime'] !== "UNK") {
        $studentTime = intval($_POST['studentTime']);
    } else {
        $studentTime = "UNK";
    }
} else {
    $studentTime = "UNK";
}

$error = "UNK";
$courses = array();
$teachers = array();
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
    'time_budget' => 'Budget'
);

$columnOrder = array('ccode', 'cname', 'class', 'credits', 'start_period', 'end_period', 'study_program', 'students', 'time_budget');
$sumColumns = array();
$sql2 = 'SELECT fname,lname,sign FROM teacher ORDER BY lname ASC;';
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
    //$courses[]=array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());    
    //$course = array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());
    /*
        array_push($course,$crow['ccode']);
        array_push($course,$crow['cname']);
        array_push($course,$crow['class']);
        array_push($course,$crow['credits']);
        array_push($course,$crow['start_period']);
        array_push($course,$crow['end_period']);
        */
    $course['ciid'] = $crow['ciid'];
    $course['ccode'] = $crow['ccode'];
    $course['cname'] = $crow['cname'];
    $course['class'] = $crow['class'];
    $course['credits'] = $crow['credits'];
    $course['start_period'] = $crow['start_period'];
    $course['end_period'] = $crow['end_period'];

    if ($crow['study_program']) {
        //array_push($course,$crow['study_program']);
        $course['study_program'] = $crow['study_program'];
    } else {
        $course['study_program'] = "UNK";
        //array_push($course,"UNK");
    }

    /*
        array_push($course,array('ciid'=>$crow['ciid'],'students'=>$crow['students']));
        array_push($course,array('ciid'=>$crow['ciid'],'lectureTime'=>$crow['lecture_time']));
        array_push($course,array('ciid'=>$crow['ciid'],'superviseTime'=>$crow['supervise_time']));
        array_push($course,array('ciid'=>$crow['ciid'],'studentTime'=>$crow['student_time']));
        array_push($course,array('ciid'=>$crow['ciid'],'time_budget'=>json_decode($crow['time_budget'])));
        */
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

/*
$data = array(
    "tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot),
    "columnOrder" => $columnOrder,
    "error" => $error
);
echo json_encode($data);
*/
$data = array(
    "courses_table"=>array("tbldata" => array("tblhead" => $tblhead, "tblbody" => $tblbody, "tblfoot" => $tblfoot), "columnOrder" => $columnOrder),
    "year"=>$year
);

$ret_data = array(
    "op"=>$op,
    "params"=>$params,
    "data"=>$data,
    "error" => $error
);
header('Content-type: application/json');
echo json_encode($ret_data);
