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
        $sql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year ORDER BY start_period,cname;';  
    } else {
        $sql = 'SELECT * FROM course,course_instance where course.cid=course_instance.cid and course_instance.year=:year and course_instance.study_program like :sprogram ORDER BY study_program,start_period,cname;';  
    }
    $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));    
    $stmt->bindParam(':year', $year);
    if ($sprogram!="ALL"){
        $stmt->bindParam(':sprogram', $sprogram);
    }
    $stmt->execute();
    foreach($stmt as $key => $row){
        //$courses[]=array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());
        $courses[$row['ciid']]=array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());
    }
            
    foreach($courses as $ciid => $row){
        $no_teachers = 0;
        $sql = 'select a.lname,a.fname,a.sign,a.tid,b.hours,b.status,teid from (select lname,fname,sign,tid from teacher) a left outer join (select hours,teacher,status,teid from teaching where ciid=:ciid) b ON a.tid=b.teacher ORDER BY sign;';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':ciid', $ciid);
        $stmt->execute();
        foreach($stmt as $key => $row){
            $teacher = array('sign'=>$row['sign'],'hours'=>$row['hours'],'status'=>$row['status'],'teid'=>$row['teid'],'tid'=>$row['tid']);
            array_push($courses[$ciid]['teachers'], $teacher);
            $tmp = array('sign'=>$row['sign'],'name'=>$row['fname']." ".$row['lname']);
            /*
            if (!in_array($tmp,$teachers)){
                array_push($teachers,$tmp);
            }
            */
            $teachers[$row['sign']]=array('name'=>$row['fname']." ".$row['lname']);
        }
        
    }
/*    
    ksort($teachers);
    $max_teachers = count($teachers);
  */  
    foreach($teachers as $key => $teacher){
        if ($sprogram=="ALL"){
            $sql='select a.lname,a.sign,sum(b.hours) as total from (select lname,sign,tid from teacher) a left outer join (select hours,teacher from teaching,course_instance where teaching.ciid=course_instance.ciid and course_instance.year=:year) b ON a.tid=b.teacher group by sign ORDER BY sign;';
        } else {
            $sql='select a.lname,a.sign,sum(b.hours) as total from (select lname,sign,tid from teacher) a left outer join (select hours,teacher from teaching,course_instance where teaching.ciid=course_instance.ciid and course_instance.year=:year and study_program like :sprogram) b ON a.tid=b.teacher group by sign ORDER BY sign;';
        }      
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        //$stmt->bindParam(':sign', $key);
        $stmt->bindParam(':year', $year);
        if ($sprogram!="ALL"){
            $stmt->bindParam(':sprogram', $sprogram);
        }
        $stmt->execute();
        
        foreach($stmt as $key => $row){
            $teachers[$row['sign']]['total']=$row['total'];
            //echo "<td style='text-align:center'>".$row['total']."</td>";
        }
    }
    $data=array(
      "courses" => $courses,
      "teachers" => $teachers
    );
    echo json_encode($data);
?>
 
