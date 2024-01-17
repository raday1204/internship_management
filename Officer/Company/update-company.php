<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $company_id = $_POST['company_id'];
    $company_building = $_POST['company_building'];
    $company_job = $_POST['company_job'];

    // This is an update operation
    $sql_update_company = "UPDATE company SET company_building = ?, company_job = ? WHERE company_id = ?";
    $stmt_update_company = $conn->prepare($sql_update_company);

    if ($stmt_update_company === false) {
        $response = array("success" => false, "message" => "Prepare failed: " . $conn->error);
        http_response_code(500);
        echo json_encode($response);
        exit();
    }

    $stmt_update_company->bind_param("ssi", $company_building, $company_job, $company_id);

    if ($stmt_update_company->execute()) {
        $response = array("success" => true, "message" => "Company data updated successfully");
        echo json_encode($response);
    } else {
        $response = array("success" => false, "message" => "Error updating data in the company table: " . $stmt_update_company->error);
        http_response_code(500);
        echo json_encode($response);
    }

    $stmt_update_company->close();
    $conn->close();
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    http_response_code(400);
    echo json_encode($response);
}
