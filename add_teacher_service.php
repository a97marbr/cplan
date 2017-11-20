<?php 
    require 'dbconnect.php';
?>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Add teacher</h3>
<?php 
    require 'menu.php';
?>
<form action="add_teacher_service.php" method="post">
    Förnamn:<input type="text" name="fname" placeholder='Marcus'>
    Efternamn:<input type="text" name="lname" placeholder="Brohede">
    Signatur:<input type="text" name="sign" placeholder="BROM">
    <input type="submit" value="Send">
</form>
 
<?php
        
    if(isset($_POST['fname'])){
        $fname=$_POST['fname'];
    } else {
        $fname="UNK";
    }

    if(isset($_POST['lname'])){
        $lname=$_POST['lname'];
    } else {
        $lname="UNK";
    }

    if(isset($_POST['sign'])){
        $sign=$_POST['sign'];
    } else {
        $sign="UNK";
    }

    if ($fname != "UNK" && $lname!="UNK" && $sign != "UNK"){        
        $sql = 'INSERT INTO teacher (fname,lname,sign) values(:fname,:lname,:sign)';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':fname', $fname);
        $stmt->bindParam(':lname', $lname);
        $stmt->bindParam(':sign', $sign);
        $stmt->execute();      
    }        
 
?>  
 
</body>
</html>
