<?php 
    require 'dbconnect.php';
?>
<html>
<head>
    <meta charset="utf-8">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>
<body>
<h3>Add course</h3>
<?php 
    require 'menu.php';
?>
<form action="add_course_service.php" method="post">
    Kurskod:<input type="text" name="ccode" placeholder='IT108G'>
    Kursnamn:<input type="text" name="cname" placeholder="Webbutveckling - Webbplatsdesign">
    Klassificering:<input type="text" name="class" placeholder="G1N">
    Högskolepoäng:<input type="text" name="credits" placeholder="7.5">
    <input type="submit" value="Send">
</form>
 
<?php
        
    if(isset($_POST['ccode'])){
        $ccode=$_POST['ccode'];
    } else {
        $ccode="UNK";
    }

    if(isset($_POST['cname'])){
        $cname=$_POST['cname'];
    } else {
        $cname="UNK";
    }

    if(isset($_POST['cname'])){
        $cname=$_POST['cname'];
    } else {
        $cname="UNK";
    }

    if(isset($_POST['class'])){
        $class=$_POST['class'];
    } else {
        $class="UNK";
    }

    if(isset($_POST['credits'])){
        $credits=floatval($_POST['credits']);
    } else {
        $credits=0.0;
    }

    if ($ccode != "UNK" && $cname!="UNK"){        
        $sql = 'INSERT INTO course (ccode,cname,class,credits) values(:ccode,:cname,:class,:credits)';
        
        $stmt = $pdo->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_SCROLL));
        $stmt->bindParam(':ccode', $ccode);
        $stmt->bindParam(':cname', $cname);
        $stmt->bindParam(':class', $class);
        $stmt->bindParam(':credits', $credits);
        $stmt->execute();      
    }        
 
?>  
 
</body>
</html>
