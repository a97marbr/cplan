<?php 
//------------------------------------------------------------------------------------------------
// getOP
// 
// Success: returns url decoded posted paramter
// Fail: Returns "UNK" if paramter not set/posted
// 
// It $type is defined to float,int,or JSON we parse accordingly before returning
//
//------------------------------------------------------------------------------------------------
function getOP($name,$default="UNK",$type="string")
{
    $ret=$default;
    if(isset($_POST[$name])) {
        if(strcmp($type,"float")==0){
            $ret=floatval(urldecode($_POST[$name]));
        }else if(strcmp($type,"int")==0){
            $ret=intval(urldecode($_POST[$name]));
        }else if(strcmp($type,"json")==0){
            $ret=json_decode(urldecode($_POST[$name]));
        }else{
            $ret=urldecode($_POST[$name]);
        }        
    } 
    return $ret;
}

function getUserIpAddr(){
    if(!empty($_SERVER['HTTPS_CLIENT_IP'])){
        //ip from share internet
        $ip = $_SERVER['HTTPS_CLIENT_IP'];
    }elseif(!empty($_SERVER['HTTPS_X_FORWARDED_FOR'])){
        //ip pass from proxy
        $ip = $_SERVER['HTTPS_X_FORWARDED_FOR'];
    }else{
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    return $ip;
}
?>