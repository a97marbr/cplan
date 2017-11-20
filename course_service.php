<?php 
    require 'dbconnect.php';
?>

<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Course planing overview</h3>
<?php 
    require 'menu.php';
?>

<form action="course_service.php" method="post">
    <select size='1' name='year'>
        <option hidden disabled selected value>Select Year</option>
        <option value='2018'>2018</option>
        <option value='2017'>2017</option>
    </select>
    <select size='1' name='sprogram'>
        <option hidden disabled selected value>Select Study Program</option>
        <option value='ALL'>All</option>
        <option value='WEBUG'>WEBUG</option>
    </select>
    <input type="submit" value="Send">
</form> 
<?php
    
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
    $courses = array();
    $teachers = array();
    $max_teachers=0;

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
            $teacher = array('sign'=>$row['sign'],'hours'=>$row['hours']);
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
    echo "<caption>Teaching allocation for WEBUG courses in year ".$year."</caption>";
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
    $study_program="";
    foreach($courses as $ccode => $row){
        if($sprogram !="ALL" && $study_program!=$row['study_program']){
            echo "<tr><th colspan='".(7+$max_teachers)."' style='text-align:left'>".$row['study_program']."</th></tr>";
            $study_program=$row['study_program'];
        }
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
            echo "<td style='text-align:center'>".$teacher['hours']."</td>";
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
        if ($sprogram=="ALL"){
            $sql = 'select start_period,SUM(hours) as total FROM teaching, teacher, course_instance, course WHERE teaching.ciid=course_instance.ciid and course_instance.cid=course.cid and course_instance.year=:year and teaching.teacher=teacher.tid and teacher.sign=:sign';
        } else {
            $sql = 'select start_period,SUM(hours) as total FROM teaching, teacher, course_instance, course WHERE teaching.ciid=course_instance.ciid and course_instance.cid=course.cid and course_instance.year=:year and teaching.teacher=teacher.tid and teacher.sign=:sign and study_program like :sprogram';
        }      
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':sign', $key);
        $stmt->bindParam(':year', $year);
        if ($sprogram!="ALL"){
            $stmt->bindParam(':sprogram', $sprogram);
        }
        $stmt->execute();
        
        foreach($stmt as $key => $row){
            echo "<td style='text-align:center'>".$row['total']."</td>";
        }
    }
    echo "</tr>";
    echo "</tfoot></table>";
    
    echo "</table>";
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
