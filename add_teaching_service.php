<?php 
    require 'dbconnect.php';
?>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Add teaching</h3>
<?php 
    require 'menu.php';
?>

<form action="add_teaching_service.php" method="post">
    <select size='1' name='teacher'>
    <option hidden disabled selected value>Select Teacher</option>
    <?php      
        foreach($pdo->query( 'SELECT lname,fname,tid,sign FROM teacher ORDER BY lname;' ) as $row){
          echo '<option value="'.$row['tid'].'">';
          echo $row['lname'].", ".$row['fname']." - (".$row['sign'].")";
          echo '</option>';
        }    
    ?>
    </select>
    <select size='1' name='ciid'>
    <?php         
        foreach($pdo->query( 'SELECT ciid,year,cname,start_period,end_period FROM course_instance,course WHERE course_instance.cid=course.cid ORDER BY year,cname,start_period,end_period;' ) as $row){
          echo '<option value="'.$row['ciid'].'">';
          echo $row['year'].", ".$row['cname'].", ".$row['start_period']."->".$row['end_period'];      
          echo '</option>';
        }    
    ?>
    </select>    
    Hours:<input type="text" name="hours">
    <select size='1' name='status'>
        <option value='0'><span>Confirmed</span></option>
        <option value='1'><span class='unconfirmed'>Unconfirmed</span></option>
        <option value='2'><span class='mustchange'>Must change</span></option>
    </select>
    <input type="submit" value="Send">
</form>
 
<?php
        
    if(isset($_POST['teacher'])){
        $tid=intval($_POST['teacher']);
        if(isset($_POST['ciid'])){
            $ciid=intval($_POST['ciid']);
        } else {
            $ciid="UNK";
        }
        if(isset($_POST['hours'])){
            $hours=intval($_POST['hours']);
        } else {
            $hours=null;
        }
        if(isset($_POST['status'])){
            $status=intval($_POST['status']);
        } else {
            $status=0;
        }
        
        $sql = 'INSERT INTO teaching (teacher,ciid,hours,status) VALUES(:tid,:ciid,:hours,:status);';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':tid', $tid);
        $stmt->bindParam(':ciid', $ciid);
        $stmt->bindParam(':hours', $hours);
        $stmt->bindParam(':status', $status);
        $stmt->execute();        
    }
 
?>  
 
</body>
</html>
