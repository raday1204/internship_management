<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Decode raw JSON data from the request
$postdata = file_get_contents("php://input");
$request = json_decode($postdata, true);

$company_id = null;
$response_company = array("success" => false, "message" => "Unexpected error");
$response_need_student = array("success" => false, "message" => "Unexpected error");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $year = $_POST['year'];
    $type_name = $_POST['type_name'];
    $term = $_POST['term'];
    $company_name = $_POST['company_name'];
    $send_name = $_POST['send_name'];
    $send_coordinator = $_POST['send_coordinator'];
    $send_position = $_POST['send_position'];
    $send_tel = $_POST['send_tel'];
    $send_email = $_POST['send_email'];
    $send_mobile = $_POST['send_mobile'];
    $type_position = $_POST['type_position'];
    $type_special = $_POST['type_special'];

    // This is an insert operation
    $sql_insert_company = "INSERT INTO company (year, type_name, term, company_name, 
    send_name, send_coordinator, send_position, send_tel, send_email, send_mobile,
    type_position, type_special) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt_insert_company = $conn->prepare($sql_insert_company);

    if ($stmt_insert_company === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt_insert_company->bind_param(
        "ssssssssssss",
        $year,
        $type_name,
        $term,
        $company_name,
        $send_name,
        $send_coordinator,
        $send_position,
        $send_tel,
        $send_email,
        $send_mobile,
        $type_position,
        $type_special
    );

    if ($stmt_insert_company->execute()) {
        $company_id = $conn->insert_id; // Get the last inserted ID

        $response_company = array("success" => true, "company_id" => $company_id, "type_name" => $type_name, "message" => "Company data inserted successfully");
    } else {
        $response_company = array("success" => false, "message" => "Error adding company data: " . $stmt_insert_company->error);
    }

    $stmt_insert_company->close();

    $date_addtraining = $_POST['date_addtraining'];
    $date_endtraining = $_POST['date_endtraining'];

    $sql_insert_need_student = "INSERT INTO need_student (company_id, date_addtraining, date_endtraining) VALUES (?, ?, ?)";
    $stmt_insert_need_student = $conn->prepare($sql_insert_need_student);

    if ($stmt_insert_need_student === false) {
        die(json_encode(array("success" => false, "message" => "Prepare failed: " . $conn->error)));
    } else {
        $stmt_insert_need_student->bind_param("iss", $company_id, $date_addtraining, $date_endtraining);

        if ($stmt_insert_need_student->execute()) {
            $response_need_student = array("success" => true, "message" => "Data inserted into need_student table successfully");
        } else {
            $response_need_student = array("success" => false, "message" => "Error adding data to need_student table: " . $stmt_insert_need_student->error);
        }

        $stmt_insert_need_student->close();
    }

    $conn->close();
}

// Combine both responses into a final response
$response = array_merge($response_company, $response_need_student);

echo json_encode($response);
