<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['year']) && isset($_GET['type_name'])) {
    $year = mysqli_real_escape_string($conn, $_GET['year']);
    $type_name = mysqli_real_escape_string($conn, $_GET['type_name']);

    $studentInformation = [];

    // Query to select students without a company
    $sql = "SELECT s.*, c.company_name 
        FROM student s 
        LEFT JOIN company c ON s.company_id = c.company_id
        WHERE s.company_id = 0
        AND s.year = '$year' 
        AND s.type_name = '$type_name'";

    $result = $conn->query($sql);

    if ($result) {
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $studentInformation['data'][] = $row;
            }
            $studentInformation['success'] = true;
        } else {
            $studentInformation['error'] = 'No students found without a company selected.';
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