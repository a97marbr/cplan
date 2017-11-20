<?php 
    require 'dbconnect.php';
?>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Teacher View</h3>
<?php 
    require 'menu.php';
?>
<form action="teacher_service.php" method="post">
    <select size='1' name='sign'>
    <option hidden disabled selected value>Select Teacher</option>
    <?php      
        foreach($pdo->query( 'SELECT lname,fname,sign FROM teacher ORDER BY lname;' ) as $row){
          echo '<option value="'.$row['sign'].'">';
          echo $row['lname'].", ".$row['fname']." - (".$row['sign'].")";
          echo '</option>';
        }    
    ?>
    </select>
    <select size='1' name='year'>
      <option value='2018'>2018</option>
      <option value='2017'>2017</option>
    <input type="submit" value="Send">
</form>
 
<?php
        
    if(isset($_POST['sign'])){
        $sign=$_POST['sign'];
        if(isset($_POST['year'])){
            $year=$_POST['year'];
        } else {
            $year="2018";
        }
        $sql = 'select fname,lname,sign,ccode,cname,hours,status,start_period,end_period from teaching,teacher,course,course_instance WHERE teaching.ciid=course_instance.ciid and course_instance.year=:year and course_instance.cid=course.cid and teaching.teacher=teacher.tid and teacher.sign=:sign ORDER BY start_period;';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':sign', $sign);
        $stmt->bindParam(':year', $year);
        $stmt->execute();
        $courses = array();
        
        foreach($stmt as $key => $row){
            array_push($courses, $row);
        }
        
        if (empty($courses)) {
            echo "<em>No teaching registered for ".$sign." in budget year ".$year."</em>";
        } else {
            echo "<table style='border-collapse: collapse;'>";
            echo "<caption>Teaching allocation for ".$courses[0]['fname']." ". $courses[0]['lname']." (".$sign.") during year ".$year."</caption>";
            echo "<thead>";
            echo "<tr><th>Kurskod</th><th>Kursnamn</th><th>start</th><th>slut</th><th>timmar</th></tr>";
            echo "</thead>";
            echo "<tbody>";
            $period="";
            foreach($courses as $key => $row){
                if($period != $row['start_period']){
                    echo "<tr style='border-top:2px solid #000;'>";              
                    $period=$row['start_period'];
                } else {
                    echo "<tr>";              
                }              
                echo "<td>".$row['ccode']."</td><td>".$row['cname']."</td><td>".$row['start_period']."</td><td>".$row['end_period']."</td>";
                /* Status: 
                 * 0 == confirmed
                 * 1 == unconfirmed
                 * 2 == must be changed
                 */
                if ($row['status']==0){
                    $status="confirmed";
                } else if ($row['status']==1){
                    $status="unconfirmed";
                } else if ($row['status']==2){
                    $status="mustchange";
                }else {
                    $status="error";
                }
                echo "<td class='".$status."'>".$row['hours']."</td></tr>";
                echo "</tr>";
            }
            $sql = 'select start_period,SUM(hours) as total FROM teaching, teacher, course_instance, course WHERE teaching.ciid=course_instance.ciid and course_instance.cid=course.cid and course_instance.year=:year and teaching.teacher=teacher.tid and teacher.sign=:sign group by start_period;';
            echo "</tbody>";
            $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
            $stmt->bindParam(':sign', $sign);
            $stmt->bindParam(':year', $year);
            $stmt->execute();
            echo "<tfoot style='border-top:2px solid #000'>";
            foreach($stmt as $key => $row){
                echo "<tr style='font-style:italic;'>";
                echo "<td colspan='4' style='text-align:right;'>Total teaching hours in ".$row['start_period']."</td><td>".$row['total']."</td>";
                echo "</tr>";
            }
            echo "</tfoot></table>";
            echo "<div><span class='unconfirmed' style='padding:0 5px 0 5px'>Unconfirmed time</span><span class='mustchange' style='padding:0 5px 0 5px'>Must change time</span></div>";
        }
    }
 
?>  
 
</body>
</html>
