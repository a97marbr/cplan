<?php
    if (session_status() == PHP_SESSION_NONE) {  
      // Set cookie life length and start session
      //ini_set('session.gc_maxlifetime', 18000);
      //session_set_cookie_params('18000');
      session_start();
    }
    require '../dbconnect.php';
    require 'basic.php';

    $op=getOP("op");

    $login=0;
    $error="UNK";

    if($op=="login"){
        $username=getOP("username");
        $pwd=getOP("pwd");        

        $csql = 'SELECT pwd,fname,lname,tid,sign,access FROM teacher WHERE active=1 AND LOWER(sign)=LOWER(:sign);';
        $cstmt = $pdo->prepare($csql);
        $cstmt->bindParam(':sign', $username);
        $cstmt->execute();    
        foreach($cstmt as $key => $row){  
            $error=$row["pwd"];
            if(empty($row['pwd'])){
                $dbpwd=password_hash(strtolower($row["sign"]), PASSWORD_DEFAULT);
                $csql = 'UPDATE teacher SET pwd=:pwd WHERE tid=:tid;';
                $cstmt = $pdo->prepare($csql);
                $cstmt->bindParam(':tid', $row["tid"]);
                $cstmt->bindParam(':pwd', $dbpwd);
                $cstmt->execute();                    
            }else{
                $dbpwd=$row["pwd"];
            }
            if(password_verify($pwd, $dbpwd)){
                $teacher=intval($row["tid"]);
                $tname=$row["fname"]." ".$row["lname"];

                $_SESSION["username"]=$row["sign"];
                $_SESSION["tname"]=$tname;
                $_SESSION["teacherid"]=$teacher;
                $_SESSION["pwd"]=$row['pwd'];      
                $_SESSION["access"]=intval($row['access']);   
                $login=1;     
            }            
        }  
        
    }else{
        $_SESSION = array();
        session_unset();
        session_destroy();
        clearstatcache(); 
        // Remove the cookies.
        setcookie('username', '', 0, '/');
        setcookie('password', '', 0, '/');
        header("Refresh:0; url=showsched.php");
    }

    $data=array(
      "login" => $login,
      "op" => $op,
      "error"=>$error
    );                  
    echo json_encode($data);
?>