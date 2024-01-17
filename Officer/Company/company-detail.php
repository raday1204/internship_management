<?php
include('../../database.php');

if (isset($_GET['company_id'])) {
    $company_id = $_GET['company_id'];

    // Query to fetch company data
    $sql_company = "SELECT company_id, year, type_name, company_name, send_name, send_coordinator, send_position, send_tel, 
    send_email, send_mobile, company_building, company_job FROM company WHERE company_id = ?";
    $stmt_company = $conn->prepare($sql_company);
    $stmt_company->bind_param("i", $company_id);

    if ($stmt_company->execute()) {
        $result_company = $stmt_company->get_result();
        $company_data = $result_company->fetch_assoc();
    } else {
        $response = array("success" => false, "message" => "Error fetching company data: " . $conn->error);
        echo json_encode($response);
        exit();
    }

    // Query to fetch need_student data
    $sql_internal = "SELECT number_student_train, date_addtraining, date_endtraining FROM need_student WHERE company_id = ?";
    $stmt_internal = $conn->prepare($sql_internal);
    $stmt_internal->bind_param("i", $company_id);

    if ($stmt_internal->execute()) {
        $result_internal = $stmt_internal->get_result();
        $need_student_data = $result_internal->fetch_assoc();
    } else {
        $response = array("success" => false, "message" => "Error fetching need_student data: " . $conn->error);
        echo json_encode($response);
        exit();
    }

    $response = array(
        "success" => true,
        "data" => array(
            "company" => $company_data,
            "need_student" => $need_student_data ? $need_student_data : []
        )
    );

    echo json_encode($response);
} else {
    $response = array("success" => false, "message" => "Invalid request data");
    echo json_encode($response);
}

$conn->close();
