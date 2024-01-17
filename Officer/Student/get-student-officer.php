<?php
include('../../database.php');

// Fetch distinct values from the student table
$sql = "SELECT DISTINCT year, type_name FROM student";
$result = $conn->query($sql);
$data = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    $response = array("success" => true, "message" => "Distinct values retrieved successfully", "data" => $data);
} else {
    $response = array("success" => false, "message" => "No data found for the specified year and type_name.", "data" => array());
}

echo json_encode($response);

$conn->close();
