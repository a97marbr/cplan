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
    
    $courses = array();
    $teachers = array();
    $max_teachers=0;
    
    if ($op=="UPDATE" && $isUnlocked){
      if ($teid!=="UNK" && $hours!=="UNK" && $status!=="UNK"){
          $sql = 'UPDATE teaching SET hours=:hours,status=:status WHERE teid=:teid;';
          
          $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
          $stmt->bindParam(':teid', $teid);
          $stmt->bindParam(':hours', $hours);
          $stmt->bindParam(':status', $status);
          $stmt->execute();
      } else if ($teid=="UNK" && $hours!=="UNK" && $status!=="UNK" && $ciid!=="UNK" && $tid!=="UNK"){
          $sql = 'INSERT INTO teaching (hours,status,ciid,teacher) VALUES(:hours,:status,:ciid,:tid);';
          
          $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
          $stmt->bindParam(':hours', $hours);
          $stmt->bindParam(':status', $status);          
          $stmt->bindParam(':ciid', $ciid);
          $stmt->bindParam(':tid', $tid);
          $stmt->execute();
      }
    }    

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
    
    $tblhead[]='Course Code';
    $tblhead[]='Course Name';
    $tblhead[]='Class';
    $tblhead[]='Credits';
    $tblhead[]='Start';
    $tblhead[]='End';
    $tblhead[]='Students';
    $tblhead[]='SProgram';    

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
        array_push($course,$crow['students']);
        array_push($course,$crow['study_program']);
        
        $sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,teid from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid from teaching where ciid=:ciid) b ON a.tid=b.teacher ORDER BY sign;';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':ciid', $crow['ciid']);
        $stmt->execute();
        foreach($stmt as $key => $row){
            if(!$hasHeading){
              array_push($tblhead,$row['sign']);
            }
            if ($row['hours']){
                array_push($course,$row['hours']);
            } else {
                array_push($course,"UNK");
            }
        }
        $hasHeading=true;

        if($hasFooter){
            $hasFooter=true;
        }
        $tblbody[]=$course;
    }

    $data=array(
      "tbldata" => array("tblhead" => $tblhead,"tblbody" => $tblbody,"tblfoot" => $tblfoot)
    );
    echo json_encode($data);
?>
 
