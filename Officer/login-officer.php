<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, true);

    $hostAuth = "localhost";
    $userAuth = "root";
    $passAuth = "";
    $dbname = "internship_management";

    $conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

    if ($conn->connect_error) {
        die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
    }

    $username = mysqli_real_escape_string($conn, $request['username']);

    $sql = "SELECT username, permission FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $permission = $row['permission'];
        if ($permission === 'center') {
            $response = ['success' => true, 'message' => 'Login success'];
        } else {
            $response = ['success' => false, 'message' => 'Login failed: Insufficient permission'];
        }
    } else {
        $response = ['success' => false, 'message' => 'Login failed: User not found'];
    }

    header('Content-Type: application/json');
    echo json_encode($response);

    $conn->close();
}