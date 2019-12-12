<?php
if (session_status() == PHP_SESSION_NONE) {
    // Set cookie life length and start session
    //ini_set('session.gc_maxlifetime', 18000);
    //session_set_cookie_params('18000');
    session_start();
}
?>
<!DOCTYPE html>
<html lang="se">

<head>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#ffee77">
    <meta name="theme-color" content="#ffee77">
    <link href="https://fonts.googleapis.co00">
    <meta charset="utf-8" http-equiv="X-UA-Compatible" content="IE=11">
    <meta name="viewport" content="width=device-width" />
    <link rel="stylesheet" type="text/css" href="bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44=" crossorigin="anonymous"></script>
    <script>
        function login() {
            let username = document.getElementById("login").value;
            let pwd = document.getElementById("pwd").value;
            var jqxhr = $.ajax({
                    type: 'POST',
                    url: 'login_service.php',
                    data: 'op=login&username=' + username + '&pwd=' + pwd
                })
                .done(processReply)
                .fail(function() {
                    alert("error");
                })
                .always(function() {
                    //alert( "complete" );
                });
        }
        $(document).ready(function() {
            $(document).keyup(function(e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    document.getElementById("login").value = "";
                    document.getElementById("pwd").value = "";
                }
            });

            $(document).keyup(function(e) {
                if (e.key === "Enter") { // enter key maps to keycode `13`
                    login();
                }
            });
        });
    </script>
    <script src="basic.js"></script>
    <link rel="stylesheet" type="text/css" href="style.css">
</head>

<body>
    <div style="height:100vh;display:flex;justify-content:center;align-items:center;flex-direction:column;">
        <div style="display:flex;justify-content:center;align-items:center;flex-direction:column;border:4px solid #0000FF; padding:10px; border-radius:15px;position:relative;">
            <div style='max-width:350px;margin:auto;'><img style="width:350px" src="logo_cplan.svg"></div>
            <div id="logindialog">
                <div>Username</div>
                <input id="login" type="text" style="border:none;border-bottom:2px solid #cbcbcb;">
                <div>Password</div>
                <input id="pwd" type="password" style="border:none;border-bottom:2px solid #cbcbcb;">
                <div style="text-align:right;">
                    <button onclick="login()">Login</button>
                </div>
            </div>
            <!--
        <div class="alert alert-danger" style="margin-top:10px;" role="alert">
            Detta är en demo-sida INGEN produktionsdata bör läggas på denna app. Data tömms regelbundet.
        </div>
        -->
            <div style='position:absolute;top:100%;right:0px;padding:5px;color:rgba(0,0,0,0.5);font-size:small;'><a class='logo-link' href='https://github.com/a97marbr/cplan'>CPlan</a> is developed on GitHub</div>
        </div>
    </div>
</body>

</html>