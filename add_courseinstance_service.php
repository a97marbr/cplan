<?php 
    require '../dbconnect.php';
?>

<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Add course instance</h3>
<?php 
    require 'menu.php';
?>

<form action="add_courseinstance_service.php" method="post">
  Kurs<select size='1' name='cid'>
  <?php
      foreach($pdo->query( 'SELECT DISTINCT cid,ccode,cname FROM course ORDER BY cname;' ) as $row){
        echo '<option value="'.$row['cid'].'">';
        echo $row['ccode'].", ".$row['cname'];      
        echo '</option>';
      }    
  ?>
  </select>
    Kursansvarig<select size='1' name='coordinator'>
    <?php
        foreach($pdo->query( 'SELECT tid,sign FROM teacher ORDER BY sign;' ) as $row){
          echo '<option value="'.$row['tid'].'">';
          echo $row['sign'];      
          echo '</option>';
        }    
    ?>
    </select>
    Examinator<select size='1' name='examiner'>
    <?php
        foreach($pdo->query( 'SELECT tid,sign FROM teacher ORDER BY sign;' ) as $row){
          echo '<option value="'.$row['tid'].'">';
          echo $row['sign'];      
          echo '</option>';
        }    
    ?>
    </select>
    År:<input type="text" name="year" placeholder="2018">
    <select size='1' name='start_period'>
        <option value='1'>lp1</option>
        <option value='2'>lp2</option>
        <option value='3'>lp3</option>
        <option value='4'>lp4</option>
        <option value='5'>lp5</option>
    </select>
    <select size='1' name='end_period'>
        <option value='1'>lp1</option>
        <option value='2'>lp2</option>
        <option value='3'>lp3</option>
        <option value='4'>lp4</option>
        <option value='5'>lp5</option>
    </select>
    Antal studenter:<input type="text" name="students" placeholder='40'>
    ProgramÅr:<input type="text" name="study_program" placeholder='WEBUG1'>

    <input type="submit" value="Send">
</form>
 
<?php
        
    if(isset($_POST['cid'])){
        $cid=$_POST['cid'];
    } else {
        $cid="UNK";
    }

    if(isset($_POST['coordinator'])){
        $coordinator=$_POST['coordinator'];
    } else {
        $coordinator="UNK";
    }

    if(isset($_POST['examiner'])){
        $examiner=$_POST['examiner'];
    } else {
        $examiner="UNK";
    }

    if(isset($_POST['start_period'])){
        $start_period=$_POST['start_period'];
    } else {
        $start_period="UNK";
    }

    if(isset($_POST['end_period'])){
        $end_period=$_POST['end_period'];
    } else {
        $end_period="UNK";
    }

    if(isset($_POST['year'])){
        $year=$_POST['year'];
    } else {
        $year="UNK";
    }
    
    if(isset($_POST['students'])){
        $students=intval($_POST['students']);
    } else {
        $students=0;
    }

    if(isset($_POST['study_program'])){
        $study_program=$_POST['study_program'];
    } else {
        $study_program="UNK";
    }
    if ($cid != "UNK" && $coordinator!="UNK" && $examiner != "UNK" && $start_period!="UNK" && $end_period!="UNK" && $year!="UNK"){        
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
 
?>  
 
</body>
</html>
