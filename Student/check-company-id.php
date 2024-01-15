<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

$hostAuth = "localhost";
$userAuth = "root";
$passAuth = "";
$dbname = "internship_management";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = mysqli_real_escape_string($conn, json_decode(file_get_contents("php://input"), true)['username']);

    $stmtCheckCompanyID = $conn->prepare("SELECT company_id FROM student WHERE student_code = ? AND company_id IS NOT NULL");
    $stmtCheckCompanyID->bind_param("s", $username);
    $stmtCheckCompanyID->execute();
    $resultCheckCompanyID = $stmtCheckCompanyID->get_result();

    $response = [];

    if ($resultCheckCompanyID->num_rows > 0) {
        $response['success'] = true;
        $response['hasCompanyID'] = true;
        $response['companyID'] = $resultCheckCompanyID->fetch_assoc()['company_id'];
    } else {
        $response['success'] = true;
        $response['hasCompanyID'] = false;
        $response['companyID'] = null;
    }

    $stmtCheckCompanyID->close();
    $conn->close();

    // Output the response
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
