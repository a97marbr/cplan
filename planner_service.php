<?php 
    require 'dbconnect.php';
?>

<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Course planing</h3>
<?php 
    require 'menu.php';
?>

<form action="planner_service.php" method="post">
    <select size='1' name='year'>
        <option hidden disabled selected value>Select Year</option>
        <option value='2018'>2018</option>
        <option value='2017'>2017</option>
    </select>
    <select size='1' name='planner'>
    <option hidden disabled selected value>Select Teacher</option>
    <?php      
        foreach($pdo->query( 'SELECT lname,fname,sign,tid FROM teacher ORDER BY lname;' ) as $row){
          echo '<option value="'.$row['tid'].'">';
          echo $row['lname'].", ".$row['fname']." - (".$row['sign'].")";
          echo '</option>';
        }    
    ?>
    </select>
    <input type="submit" value="Send">
</form> 
<?php
    
    if(isset($_POST['year'])){      
        $year=$_POST['year'];
    } else {
        $year="2018";
    }
    if(isset($_POST['planner'])){  
        $planner=$_POST['planner'];
    } else {
        $planner=1; // BROM
    }
    $courses = array();
    $teachers = array();
    $plannerName="UNK";
    $max_teachers=0;

    $sql = 'SELECT * FROM course,course_instance,teacher where teacher.tid=course_instance.planner and course.cid=course_instance.cid and course_instance.year=:year and course_instance.planner=:planner ORDER BY start_period,cname;';  
    $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));    
    $stmt->bindParam(':year', $year);
    $stmt->bindParam(':planner', $planner);
    $stmt->execute();
    foreach($stmt as $key => $row){
        $plannerName=$row['fname']." ".$row['lname'];
        $courses[$row['ciid']]=array('ccode'=>$row['ccode'],'cname'=>$row['cname'],'class'=>$row['class'],'credits'=>$row['credits'],'start_period'=>$row['start_period'],'end_period'=>$row['end_period'], 'students'=>$row['students'],'study_program'=>$row['study_program'], 'teachers'=>array());
    }
            
    foreach($courses as $ciid => $row){
        $no_teachers = 0;
        $sql = 'SELECT * FROM teaching,course_instance,course,teacher WHERE course.cid=course_instance.cid and course_instance.ciid=teaching.ciid and teacher.tid=teaching.teacher and teaching.ciid=:ciid and course_instance.year=:year ORDER BY sign;';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':ciid', $ciid);
        $stmt->execute();
        foreach($stmt as $key => $row){
            $teacher = array('sign'=>$row['sign'],'hours'=>$row['hours'],'status'=>$row['status']);
            array_push($courses[$ciid]['teachers'], $teacher);
            $tmp = array('sign'=>$row['sign'],'name'=>$row['fname']." ".$row['lname']);
            /*
            if (!in_array($tmp,$teachers)){
                array_push($teachers,$tmp);
            }
            */
            $teachers[$row['sign']]=$row['fname']." ".$row['lname'];
        }
        
    }
    
    ksort($teachers);
    $max_teachers = count($teachers);
    
    echo "<table style='border-collapse: collapse;'>";
    echo "<caption>Courses planned by ".$plannerName." for year ".$year."</caption>";
    echo "<thead>";    
    echo "<tr><th>Kurskod</th><th>Kursnamn</th><th>typ</th><th>poäng</th><th>start</th><th>stop</th><th>studenter</th>";
    foreach($teachers as $key => $teacher){
        echo "<th><span style='padding:0 10px 0 10px;'>".$teacher."</span></th>";
    }
    echo "</tr>";
    echo "<tr>";
    echo "<th colspan='7'></th>";
    foreach($teachers as $key => $teacher){
        echo "<th>".$key."</th>";
    }    
    echo "</tr>";    
    echo "</thead>";
    echo "<tbody>";    
    $period="";
    foreach($courses as $ccode => $row){
        if($period != $row['start_period']){
            echo "<tr style='border-top:2px solid #000;'>";              
            $period=$row['start_period'];
        } else {
            echo "<tr>";              
        }
        echo "<td>".$row['ccode']."</td><td>".$row['cname']."</td><td>".$row['class']."</td><td>".$row['credits']."</td><td>".$row['start_period']."</td><td>".$row['end_period']."</td><td style='text-align:center;'>".$row['students']."</td>";
        $idx=0;
        foreach($row['teachers'] as $key => $teacher){
          //array_search("car",array_keys($a))
            //while($teachers[$idx]['sign']!=$teacher['sign'] && $idx < $max_teachers){
            while(array_search($teacher['sign'],array_keys($teachers))!=$idx && $idx <= $max_teachers){
                echo "<td></td>";
                $idx++;
            }
            
            $status="confirmed";
            if ($teacher['status']==0){
                $status="confirmed";
            } else if ($teacher['status']==1){
                $status="unconfirmed";
            } else if ($teacher['status']==2){
                $status="mustchange";
            }else {
                $status="error";
            }
            
            echo "<td style='text-align:center' class='".$status."'>".$teacher['hours']."</td>";
            $idx++;
        }
        while($idx <= $max_teachers){
            echo "<td></td>";
            $idx++;              
        }
        echo "</tr>";
    }
    echo "</tbody>";    
    echo "<tfoot style='border-top:2px solid #000'>";
    echo "<tr style='font-style:italic;'>";
    echo "<td colspan='7' style='text-align:right;'>Total teaching hours</td>";
    foreach($teachers as $key => $teacher){
        $sql = 'select start_period,SUM(hours) as total FROM teaching, teacher, course_instance, course WHERE teaching.ciid=course_instance.ciid and course_instance.cid=course.cid and course_instance.year=:year and teaching.teacher=teacher.tid and teacher.sign=:sign and planner=:planner';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':sign', $key);
        $stmt->bindParam(':year', $year);
        $stmt->bindParam(':planner', $planner);
        $stmt->execute();
        
        foreach($stmt as $key => $row){
            echo "<td style='text-align:center'>".$row['total']."</td>";
        }
    }
    echo "</tr>";
    echo "</tfoot></table>";
    
    echo "</table>";
    echo "<div><span class='unconfirmed'>Unconfirmed</span><span class='mustchange'>Must change</span><span class='error'>Error</span></div>"
    /*
    echo "<pre>";
    var_dump($courses);
    echo "<br><br>";
    print_r($teachers);
    echo "<br><br>";
    print_r($max_teachers);
    echo "</pre>";
    */
    
?>
 
 
</body>
</html>
