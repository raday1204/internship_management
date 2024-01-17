<?php
include('../../database.php');

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
