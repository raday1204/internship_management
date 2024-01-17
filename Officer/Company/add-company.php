<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode raw JSON data from the request
    $postdata = file_get_contents("php://input");
    $request = json_decode($postdata, true);
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

    $sql_insert_company = "INSERT INTO company (year, type_name, term, company_name, 
    send_name, send_coordinator, send_position, send_tel, send_email, send_mobile) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt_insert_company = $conn->prepare($sql_insert_company);

    if ($stmt_insert_company === false) {
        die("Prepare failed: " . $conn->error);
    }

    $stmt_insert_company->bind_param(
        "ssssssssss",
        $year,
        $type_name,
        $term,
        $company_name,
        $send_name,
        $send_coordinator,
        $send_position,
        $send_tel,
        $send_email,
        $send_mobile
    );

    if ($stmt_insert_company->execute()) {
        $company_id = $stmt_insert_company->insert_id;

        $response = array("success" => true, "company_id" => $company_id, "year" => $year, "type_name" => $type_name, "message" => "Company data inserted successfully");
    } else {
        $response = array("success" => false, "message" => "Error adding company data: " . $stmt_insert_company->error);
    }

    $stmt_insert_company->close();
    $conn->close();
    echo json_encode($response);
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    echo json_encode($response);
}