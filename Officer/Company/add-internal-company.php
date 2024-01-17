<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Decode raw JSON data from the request
$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);

// ... (existing code)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Validate and sanitize inputs
    $company_id = isset($_POST['company_id']) ? $conn->real_escape_string($_POST['company_id']) : "";
    $number_student_train = isset($_POST['number_student_train']) ? $conn->real_escape_string($_POST['number_student_train']) : "";
    $date_addtraining = isset($_POST['date_addtraining']) ? $conn->real_escape_string($_POST['date_addtraining']) : "";
    $date_endtraining = isset($_POST['date_endtraining']) ? $conn->real_escape_string($_POST['date_endtraining']) : "";


    // Insert data into the need_student table
    $sql_insert_need_student = "INSERT INTO need_student (company_id, number_student_train, date_addtraining, date_endtraining ) VALUES (?, ?, ?, ?)";
    $stmt_insert_need_student = $conn->prepare($sql_insert_need_student);

    if ($stmt_insert_need_student === false) {
        die(json_encode(array("success" => false, "message" => "Prepare failed: " . $conn->error)));
    } else {
        $stmt_insert_need_student->bind_param("isss", $company_id, $number_student_train, $date_addtraining, $date_endtraining);

        if ($stmt_insert_need_student->execute()) {
            $response = array("success" => true, "message" => "Data inserted into need_student table successfully");
        } else {
            $response = array("success" => false, "message" => "Error adding data to need_student table: " . $stmt_insert_need_student->error);
        }

        $stmt_insert_need_student->close();
    }

    $conn->close();
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    http_response_code(400);
}

echo json_encode($response);