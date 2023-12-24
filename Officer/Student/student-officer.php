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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $year = mysqli_real_escape_string($conn, $_POST['year']);
    $type_name = mysqli_real_escape_string($conn, $_POST['type_name']);

    $studentInformation = [];

    $sqlStudent = "SELECT * FROM student WHERE year = '$year' AND type_name = '$type_name'";
    $resultStudent = $conn->query($sqlStudent);

    if ($resultStudent) {
        if ($resultStudent->num_rows > 0) {
            while ($row = $resultStudent->fetch_assoc()) {
                $studentInformation['student'][] = $row;
            }
        } else {
            $studentInformation = ['error' => 'No data found for the given year and type_name.'];
        }
    } else {
        $studentInformation = ['error' => 'Query execution failed: ' . $conn->error];
    }

    $conn->close();

    echo json_encode($studentInformation);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
