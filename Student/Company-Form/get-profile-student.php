<?php
include('../../database.php');

if (isset($_SESSION["username"])) {
    $username = $_SESSION["username"];
} elseif (isset($_GET["username"])) {
    $username = $_GET["username"];
} else {
    echo json_encode(array("error" => "No username provided."));
    exit();
}

$username = $conn->real_escape_string($username);

$sql = "SELECT users.username, student.*, depart.depart_name
        FROM users 
        LEFT JOIN student ON users.username = student.student_code 
        LEFT JOIN depart ON student.depart_code = depart.depart_code
        WHERE student.student_code = '$username'";

$result = $conn->query($sql);

if ($result && $result->num_rows === 1) {
    $studentData = $result->fetch_assoc();
    $response = [
        'success' => true,
        'data' => $studentData,
    ];
    echo json_encode($response);
} else {
    echo json_encode(array("error" => "No student data found for this user."));
}

mysqli_close($conn);
