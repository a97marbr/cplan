<?php 
    require 'dbconnect.php';

    if(isset($_POST['year'])){      
        $year=$_POST['year'];
    } else {
        $year="2018";
    }
    if(isset($_POST['sprogram'])){  
        if($_POST['sprogram'] != "ALL"){
            $sprogram='%'.$_POST['sprogram'].'%';
        } else {
            $sprogram="ALL";
        }        
    } else {
        $sprogram="ALL";
    }
    if(isset($_POST['op'])){
        $op=$_POST['op'];
    } else {
        $op="UNK";
    }    
    if(isset($_POST['teid'])){
        $teid=intval($_POST['teid']);
    } else {
        $teid="UNK";
    }
    if(isset($_POST['hours'])){
        $hours=intval($_POST['hours']);
    } else {
        $hours="UNK";
    }
    if(isset($_POST['status'])){
        $status=intval($_POST['status']);
    } else {
        $status="UNK";
    }
    if(isset($_POST['ciid'])){
        $ciid=intval($_POST['ciid']);
    } else {
        $ciid="UNK";
    }
    if(isset($_POST['tid'])){
        $tid=intval($_POST['tid']);
    } else {
        $tid="UNK";
    }
    if(isset($_POST['comment'])){
        if($_POST['comment']!=="UNK"){
            $comment=$_POST['comment'];
        } else {
            $comment="UNK";
        }
    } else {
        $comment="UNK";
    }   
    if(isset($_POST['students'])){
        if($_POST['students']!=="UNK"){
            $students=intval($_POST['students']);
        } else {
            $students="UNK";
        }        
    } else {
        $students="UNK";
    } 
    
    $error="UNK";
    $courses = array();
    $teachers = array();
    $max_teachers=0;
    
    if ($op=="UPDATE" && $isUnlocked){
        if ($teid!=="UNK" && $hours!=="UNK" && $status!=="UNK"){
            $sql = 'UPDATE teaching SET hours=:hours,status=:status,changed_ts=NOW() WHERE teid=:teid;';
            
            $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            $stmt->bindParam(':teid', $teid);
            $stmt->bindParam(':hours', $hours);
            $stmt->bindParam(':status', $status);
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }
        } 
    } else if ($op=="INSERT" && $isUnlocked){
        if ($teid=="UNK" && $hours!=="UNK" && $status!=="UNK" && $ciid!=="UNK" && $tid!=="UNK"){
            $sql = 'INSERT INTO teaching (hours,status,ciid,teacher,create_ts) VALUES(:hours,:status,:ciid,:tid,NOW());';
            
            $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            $stmt->bindParam(':hours', $hours);
            $stmt->bindParam(':status', $status);          
            $stmt->bindParam(':ciid', $ciid);
            $stmt->bindParam(':tid', $tid);
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }
							
        }
    } else if ($op=="UPDATECOURSEINSTANCE" && $isUnlocked){
      
        if ($ciid!=="UNK"){          
            $sql = 'UPDATE course_instance SET ';
            if($comment!=="UNK"){
                $sql.='comment=:comment,';
            }
            if($students!=="UNK"){
                $sql.='students=:students,';
            }
            $sql.='changed_ts=NOW() WHERE ciid=:ciid;';
            
            $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            $stmt->bindParam(':ciid', $ciid);
            if($comment!=="UNK"){
                $stmt->bindParam(':comment', $comment);
            }
            if($students!=="UNK"){
                $stmt->bindParam(':students', $students);
            }
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }							
        }
    } 
    
    // Get the Data
    // -------------------------------------------------------------------------

    if ($sprogram=="ALL"){
        $csql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year ORDER BY start_period,cname;';  
    } else {
        $csql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year and course_instance.study_program like :sprogram ORDER BY study_program,start_period,cname;';  
    }
    $cstmt = $pdo->prepare($csql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));    
    $cstmt->bindParam(':year', $year);
    if ($sprogram!="ALL"){
        $cstmt->bindParam(':sprogram', $sprogram);
    }
    $cstmt->execute();
    
    $tblhead=array();
    $tblbody=array();
    $tblfoot=array();
    
    array_push($tblhead,'CCode');
    array_push($tblhead,'Course Name');
    array_push($tblhead,'Class');
    array_push($tblhead,'Credits');
    array_push($tblhead,'Start');
    array_push($tblhead,'End');
    array_push($tblhead,'Students');
    array_push($tblhead,'SProgram');

    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');
    array_push($tblfoot,'');

    $hasHeading=false;
    $hasFooter=false;
    foreach($cstmt as $ckey => $crow){
        $course = array();
        //$courses[]=array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());    
        //$course = array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());
        array_push($course,$crow['ccode']);
        array_push($course,$crow['cname']);
        array_push($course,$crow['class']);
        array_push($course,$crow['credits']);
        array_push($course,$crow['start_period']);
        array_push($course,$crow['end_period']);
        array_push($course,array('ciid'=>$crow['ciid'],'students'=>$crow['students']));
        if ($crow['study_program']){
            array_push($course,$crow['study_program']);
        } else {
            array_push($course,"UNK");
        }

        
        $sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,teid,ciid from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid,ciid from teaching where ciid=:ciid) b ON a.tid=b.teacher ORDER BY sign;';
        //$sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,teid,ciid,comment from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid,course_instance.ciid,course_instance.comment from teaching left outer join course_instance on teaching.ciid=course_instance.ciid where teaching.ciid=:ciid ) b ON a.tid=b.teacher ORDER BY sign;';
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':ciid', $crow['ciid']);
        $stmt->execute();
        foreach($stmt as $key => $row){
            if(!$hasHeading){
              array_push($tblhead,$row['fname'].' '.$row['lname'].' ('.$row['sign'].')');
              array_push($tblfoot,$row['fname'].' '.$row['lname'].' ('.$row['sign'].')');
            }
            if ($row['hours']!=null){
                array_push($course,array('hours'=>$row['hours'],'status'=>$row['status'],'teid'=>$row['teid'],'tid'=>$row['tid'],'ciid'=>$row['ciid']));
            } else {
                array_push($course,array('hours'=>"UNK",'status'=>"UNK",'teid'=>"UNK",'tid'=>$row['tid'],'ciid'=>$crow['ciid']));
            }
        }
        $hasHeading=true;
        if ($crow['comment']){
            array_push($course,array('ciid'=>$crow['ciid'],'comment'=>$crow['comment']));          
        } else {
            array_push($course,array('ciid'=>$crow['ciid'],'comment'=>"UNK"));
        }

        if($hasFooter){
            $hasFooter=true;
        }
        $tblbody[]=$course;
    }
    array_push($tblhead,'Comment');
    array_push($tblfoot,'');
    
    $data=array(
      "tbldata" => array("tblhead" => $tblhead,"tblbody" => $tblbody,"tblfoot" => $tblfoot),
      "error" => $error
    );
    echo json_encode($data);
?>
 
