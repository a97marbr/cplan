<?php 
    require '../dbconnect.php';

    if(isset($_POST['year'])){      
        $year=$_POST['year'];
    } else {
        $year="2018";
    }

    if(isset($_POST['sign'])){      
        $sign=$_POST['sign'];
    } else {
        $sign="ATIY";
    }
    
    if(isset($_POST['op'])){      
        $op=$_POST['op'];
    } else {
        $op="UNK";
    }

    if(isset($_POST['updatevalue'])){      
        $updatevalue=$_POST['updatevalue'];
    } else {
        $updatevalue="UNK";
    }
    
    $isUnlocked=false;
    
    $error="UNK";
    $max_teachers=0;    
    if ($op=="UPDATETEACHING" && $updatevalue !=="UNK" && $isUnlocked){
        $timeAllocation=json_encode($updatevalue["allocation"]);
        $status=intval($updatevalue['status']);
        $teid=$updatevalue['teid'];
        $hours=intval($updatevalue["hours"]);
        $ciid=intval($updatevalue['ciid']);
        $tid=intval($updatevalue['tid']);
        if ($teid!=="UNK" && $timeAllocation!=="UNK"){
            $sql = 'UPDATE teaching SET allocation=:allocation,status=:status,changed_ts=NOW() WHERE teid=:teid;';
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':teid', $teid);
            $stmt->bindParam(':allocation', $timeAllocation);
            $stmt->bindParam(':status', $status);
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }
        } else {
            $sql = 'INSERT INTO teaching (hours,status,ciid,teacher,create_ts,allocation) VALUES(:hours,:status,:ciid,:tid,NOW(),:allocation);';
            $error=$sql;
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':hours', $hours);
            $stmt->bindParam(':status', $status);          
            $stmt->bindParam(':ciid', $ciid);
            $stmt->bindParam(':tid', $tid);
            $stmt->bindParam(':allocation', $timeAllocation);
            
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }	                  
        }
    } else if ($op=="UPDATECOURSEINSTANCE" && $updatevalue !=="UNK" && $isUnlocked){
        $timebudget="UNK";
        $students="UNK";
        $comment="UNK";
        if ($updaterow!=="UNK"){
            $ciid=$updaterow;
        }
        if ($updatecol=="students"){
            $students=intval($updatevalue);
        }else if($updatecol=="comment"){
            $comment=$updatevalue;
        }else if($updatecol=="time_budget"){
            $timebudget=json_encode($updatevalue);
        }
        if ($ciid!=="UNK"){          
            $sql = 'UPDATE course_instance SET ';
            if($comment!=="UNK"){
                $sql.='comment=:comment,';
            }
            if($students!=="UNK"){
                $sql.='students=:students,';
            }
            if($timebudget!=="UNK"){
                $sql.='time_budget=:time_budget,';
            }
            $sql.='changed_ts=NOW() WHERE ciid=:ciid;';
            $error=$timebudget;
            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':ciid', $ciid);
            if($comment!=="UNK"){
                $stmt->bindParam(':comment', $comment);
            }
            if($students!=="UNK"){
                $stmt->bindParam(':students', $students);
            }
            if($timebudget!=="UNK"){
                $stmt->bindParam(':time_budget', $timebudget);
            }
            if(!$stmt->execute()){
                $error=$stmt->errorInfo();
            }							
        }
    } 
    
    // Get the Data
    // -------------------------------------------------------------------------
               
    $sql = 'select * from teacher,teaching,course_instance,course where teacher.tid=teaching.teacher and teacher.sign=:sign and teaching.ciid=course_instance.ciid and course.cid=course_instance.cid and course_instance.year=:year order by course_instance.start_period;';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':sign', $sign);
    $stmt->bindParam(':year', $year);
    $stmt->execute();
    $tblhead=array("ccode"=>"Course Code","cname"=>"Course Name","time_allocation"=>"Total Allocated","start_period"=>"Start","end_period"=>"End","unspecified"=>"Unspecified","lecture"=>"Lecture","supervision"=>"Supervision","seminar"=>"Seminar","development"=>"Development","preparation"=>"Preparation","grading"=>"Grading","examination"=>"Examination","running"=>"Running","other"=>"Other");
    $tblfoot=array();
    $tblbody=array();
    $columnOrder=array("ccode","cname","start_period","end_period","time_allocation","unspecified","lecture","supervision","seminar","development","preparation","grading","examination","running","other");
    foreach($stmt as $key => $row){
        $item=array(
            "teid"=>$row['teid'],
            "ccode"=>$row['ccode'],
            "cname"=>$row['cname'],
            "start_period"=>$row['start_period'],
            "end_period"=>$row['end_period'],
            "time_allocation"=>json_decode($row['allocation'])
        );
        foreach (json_decode($row['allocation']) as $allocType => $allocValue) {
            $item[$allocType]=$allocValue;
        }

        array_push($tblbody,$item);
    }

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

    
    $data=array(
      "tbldata" => array("tblhead" => $tblhead,"tblbody" => $tblbody,"tblfoot" => $tblfoot),
      "columnOrder" => $columnOrder,
      "teachers"=>$teachers,
      "selected"=>$selected,
      "error" => $error
    );
    echo json_encode($data);
?>
 
