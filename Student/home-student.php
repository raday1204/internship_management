<?php
include('../database.php');

$conn->set_charset("utf8mb4");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, true);

    $username = $request['username'];
    $username = mysqli_real_escape_string($conn, $username);

    // Use the received username to fetch user-specific data
    $sql = "SELECT * FROM users WHERE username = '$username'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        $_SESSION['username'] = $row['username'];
        $response = [
            'loggedIn' => true,
            'username' => $_SESSION['username']
        ];
    } else {
        $response = [
            'loggedIn' => false
        ];
    }

    echo json_encode($response);
}