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
$error = "UNK";

$isUnlocked = false;
if ($_SESSION["access"] > 0) {
    $isUnlocked = true;
}

$max_teachers = 0;
/*
    if (isset($_POST['cid'])) {
        $cid = $_POST['cid'];
    } else {
        $cid = "UNK";
    }

    if (isset($_POST['coordinator'])) {
        $coordinator = $_POST['coordinator'];
    } else {
        $coordinator = "UNK";
    }

    if (isset($_POST['examiner'])) {
        $examiner = $_POST['examiner'];
    } else {
        $examiner = "UNK";
    }

    if (isset($_POST['start_period'])) {
        $start_period = $_POST['start_period'];
    } else {
        $start_period = "UNK";
    }

    if (isset($_POST['end_period'])) {
        $end_period = $_POST['end_period'];
    } else {
        $end_period = "UNK";
    }

    if (isset($_POST['year'])) {
        $year = $_POST['year'];
    } else {
        $year = "UNK";
    }

    if (isset($_POST['students'])) {
        $students = intval($_POST['students']);
    } else {
        $students = 0;
    }

    if (isset($_POST['study_program'])) {
        $study_program = $_POST['study_program'];
    } else {
        $study_program = "UNK";
    }
    if ($cid != "UNK" && $coordinator != "UNK" && $examiner != "UNK" && $start_period != "UNK" && $end_period != "UNK" && $year != "UNK") {
        $sql = 'INSERT INTO course_instance (cid,coordinator,examiner,start_period,end_period,year,students,study_program) values(:cid,:coordinator,:examiner,:start_period,:end_period,:year,:students,:study_program)';

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':cid', $cid);
        $stmt->bindParam(':coordinator', $coordinator);
        $stmt->bindParam(':examiner', $examiner);
        $stmt->bindParam(':start_period', $start_period);
        $stmt->bindParam(':end_period', $end_period);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':students', $students);
        $stmt->bindParam(':study_program', $study_program);
        $stmt->execute();
    }

*/
if ($op == "ADD_COURSEINSTANCE" && isset($params->courseinstance) && $isUnlocked) {
    if (isset($params->courseinstance->cid)) {
        $cid = $params->courseinstance->cid;
    } else {
        $cid = "UNK";
    }

    if (isset($params->courseinstance->coordinator)) {
        $coordinator = $params->courseinstance->coordinator;
    } else {
        $coordinator = "UNK";
    }

    if (isset($params->courseinstance->examinators)) {
        $examinators = $params->courseinstance->examinators;
    } else {
        $examinators = "UNK";
    }

    if (isset($params->courseinstance->start_period)) {
        $start_period = $params->courseinstance->start_period;
    } else {
        $start_period = "UNK";
    }

    if (isset($params->courseinstance->end_period)) {
        $end_period = $params->courseinstance->end_period;
    } else {
        $end_period = "UNK";
    }

    if (isset($params->courseinstance->year)) {
        $year = $params->courseinstance->year;
    } else {
        $year = "UNK";
    }

    if (isset($params->courseinstance->students)) {
        $students = intval($params->courseinstance->students);
    } else {
        $students = 0;
    }

    if (isset($params->courseinstance->study_program)) {
        $study_program = $params->courseinstance->study_program;
    } else {
        $study_program = "UNK";
    }

    if ($cid != "UNK" && $coordinator != "UNK" && $examinators != "UNK" && $start_period != "UNK" && $end_period != "UNK" && $year != "UNK") {
        $sql = 'INSERT INTO course_instance (cid,coordinator,start_period,end_period,year,students,study_program,examinators) values(:cid,:coordinator,:start_period,:end_period,:year,:students,:study_program,:examinators)';

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':cid', $cid);
        $stmt->bindParam(':coordinator', $coordinator);
        $stmt->bindParam(':examinators', $examinators);
        $stmt->bindParam(':start_period', $start_period);
        $stmt->bindParam(':end_period', $end_period);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':students', $students);
        $stmt->bindParam(':study_program', $study_program);
        $stmt->execute();
    }
} else if ($op == "DELETE_COURSE_INSTANCE" && $isUnlocked) {
    try {
        if (isset($params->ciid)) {
            $ciid = $params->ciid;
        } else {
            $ciid = "UNK";
        }

        if ($ciid !== "UNK") {
            $sql = 'DELETE FROM course_instance WHERE ciid=:ciid;';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':ciid', $ciid);
            $stmt->execute();
        }
    } catch (PDOException $e) {
        $error = "Database error!\n\n" . $e->getMessage() . "\n\nError Code:" . $e->getCode();
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
            "examinators" => $row["examinators"],
            "start_period" => intval($row["start_period"]),
            "end_period" => intval($row["end_period"]),
            "students" => intval($row["students"]),
            "study_program" => $row["study_program"],

            "year" => intval($row["year"]),
            "planner" => intval($row["planner"]),
            "comment" => $row["comment"],
            "create_usr" => intval($row["create_usr"]),
            "create_ts" => $row["create_ts"],
            "change_usr" => intval($row["change_usr"]),
            "change_ts" => $row["change_ts"],
            "alt_usr" => intval($row["alt_usr"]),
            "alt_ts" => $row["alt_ts"],
            "time_budget" => $row["time_budget"]

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
            "tid" => intval($row["tid"]),
            "fname" => $row["fname"],
            "lname" => $row["lname"],
            "sign" => $row["sign"],
            "access" => intval($row["access"]),
            "active" => intval($row["active"])
        );
        array_push($teachers, $teacher);
    }

    $sql = 'SELECT * FROM year_period ORDER BY id;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $year_periods = array();
    foreach ($stmt as $key => $row) {
        $year_period = array(
            "id" => intval($row["id"]),
            "short_desc" => $row["short_desc"],
            "long_desc" => $row["long_desc"],
        );
        array_push($year_periods, $year_period);
    }

    $sql = 'SELECT * FROM course_instance_examiner ORDER BY ciid;';
    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $examinators = array();
    foreach ($stmt as $key => $row) {
        $examiner = array(
            "tid" => intval($row["tid"]),
            "ciid" => intval($row["ciid"]),
        );
        array_push($examinators, $examiner);
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
    "examinators" => $examinators,
    "year_periods" => $year_periods,
);

$ret_data = array(
    "op" => $op,
    "params" => $params,
    "data" => $data,
    "error" => $error
);
header('Content-type: application/json');
echo json_encode($ret_data);
