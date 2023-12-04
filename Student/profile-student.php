<?php
session_start();
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

if (isset($_SESSION["username"]) || isset($_GET["username"])) {
    $username = isset($_SESSION["username"]) ? $_SESSION["username"] : $_GET["username"];

    $hostAuth = "localhost";
    $userAuth = "root";
    $passAuth = "";
    $dbname = "internship_management";

    $conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

    if ($conn->connect_error) {
        die(json_encode(array("error" => "Connection failed: " . $conn->connect_error)));
    }

    $username = $conn->real_escape_string($username);

    $sql = "SELECT users.username, student.* 
            FROM users 
            LEFT JOIN student ON users.username = student.student_code 
            WHERE student.student_code = '$username'";

    $result = $conn->query($sql);

    if ($result && $result->num_rows === 1) {
        $studentData = $result->fetch_assoc();

        if ($studentData['username'] === $studentData['student_code']) {
            echo json_encode($studentData);
        } else {
            echo json_encode(array("error" => "Username does not match student_code."));
        }
    } else {
        echo json_encode(array("error" => "No student data found for this user."));
    }

    mysqli_close($conn);
} else {
    echo json_encode(array("error" => "No username provided."));
}
?>