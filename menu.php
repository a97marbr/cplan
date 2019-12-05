<?php
echo "<div class='menu'>";
echo "<div class='user'>";
echo "<a href='https://github.com/a97marbr/cplan'><img height='48px' src='logo_cplan_white.svg'/></a>";
echo "<a class='menu-item' href='course.php'>Teaching Overview</a>";
echo "<a class='menu-item' href='teacher2.php'>Teacher View</a>";
//echo "<a class='menu-item' href='planner_service.php'>Course Planner</a>";
echo "</div>";
echo "<div class='menu-year'>";
echo "<span id='title-year'></span>";
echo "</div>";
echo "<div class='login'>";
//echo "<input type='text' placeholder='unlock code' id='pwd'><button onclick='unlock()'>Unlock</button>";
echo "<span>Logged in user: " . $_SESSION['tname'];
if ($_SESSION["access"] === 0) {
    echo "(read-only)";
}
echo "</span>";
echo "<span class='menu-item' onclick='logout();'>Logout</span>";
echo "</div>";
if ($_SESSION["access"] > 0) {
    echo "<div class='admin'>";
    echo "<a class='menu-item' href='add_teacher_service.php'>Add Teacher</a>";
    echo "<a class='menu-item' href='add_teaching_service.php'>Add Teaching</a>";
    echo "<a class='menu-item' href='add_course_service.php'>Add Course</a>";
    echo "<a class='menu-item' href='add_courseinstance_service.php'>Add Course Instance</a>";
    echo "</div>";
}
echo "</div>";
