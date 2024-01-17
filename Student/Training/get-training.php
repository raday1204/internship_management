<?php
include('../../database.php');

if (isset($_SESSION["username"]) || isset($_GET["username"])) {
    $username = isset($_SESSION["username"]) ? $_SESSION["username"] : $_GET["username"];

    $username = $conn->real_escape_string($username);

    $sql = "SELECT users.username, company.company_id, company.company_name, company.company_building, training.*
            FROM users 
            LEFT JOIN student ON users.username = student.student_code 
            LEFT JOIN company ON student.company_id = company.company_id
            LEFT JOIN training ON student.company_id = training.company_id
            WHERE users.username = '$username'";

    $result = $conn->query($sql);

    if ($result && $result->num_rows === 1) {
        $row = $result->fetch_assoc();

        $response = array(
            'success' => true,
            'data' => array(
                'company_id' => $row['company_id'],
                'company_name' => $row['company_name'],
                'company_building' => $row['company_building']
            )
        );

        echo json_encode($response);
    } else {
        echo json_encode(array("error" => "No student data found for this user."));
    }

    mysqli_close($conn);
} else {
    echo json_encode(array("error" => "No username provided."));
}
