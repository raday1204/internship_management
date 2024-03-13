<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['year']) && isset($_GET['type_name'])) {
    $year = mysqli_real_escape_string($conn, $_GET['year']);
    $type_name = mysqli_real_escape_string($conn, $_GET['type_name']);

    $studentInformation = [];

    // Modify your SQL query to join student and company tables based on company_id
    $sqlStudent = "SELECT s.*, c.company_name FROM student s 
                   INNER JOIN company c ON s.company_id = c.company_id
                   WHERE s.year = '$year' AND s.type_name = '$type_name'";

    $resultStudent = $conn->query($sqlStudent);

    if ($resultStudent) {
        if ($resultStudent->num_rows > 0) {
            while ($row = $resultStudent->fetch_assoc()) {
                $studentInformation['data'][] = $row;
            }
            $studentInformation['success'] = true;
        } else {
            $studentInformation['error'] = 'No data found for the given year and type_name.';
        }
    } else {
        $studentInformation['error'] = 'Query execution failed: ' . $conn->error;
    }

    $conn->close();

    header('Content-Type: application/json');
    echo json_encode($studentInformation);
} else {
    echo json_encode(['error' => 'Invalid request method or missing parameters']);
}