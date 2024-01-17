<?php
include('../../database.php');

// Check if company_id is provided in the query parameters
if (isset($_GET['company_id'])) {
    // Retrieve company data based on company_id

    // Sanitize input to prevent SQL injection
    $company_id = mysqli_real_escape_string($conn, $_GET['company_id']);
    $sql_get_company = "SELECT year, type_name FROM company WHERE year = ? AND type_name = ?";
    $stmt_get_company = $conn->prepare($sql_get_company);

    if ($stmt_get_company === false) {
        $response = array("success" => false, "message" => "Prepare failed: " . $conn->error);
    } else {
        $stmt_get_company->bind_param("ss", $year, $type_name);

        if ($stmt_get_company->execute()) {
            $result = $stmt_get_company->get_result();

            if ($result->num_rows > 0) {
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
                $response = array("success" => true, "message" => "Company data retrieved successfully", "company" => $data);
            } else {
                $response = array("success" => false, "message" => "No data found for the specified parameters");
            }
        } else {
            $response = array("success" => false, "message" => "Error fetching company data: " . $stmt_get_company->error);
        }

        $stmt_get_company->close();
    }
} else {
    // Fetch distinct values from the company table
    $sql = "SELECT DISTINCT year, type_name, term, company_name, company_building FROM company";
    $result = $conn->query($sql);
    $data = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Fetch distinct type names from the type table
    $sql_type = "SELECT DISTINCT type_name FROM type";
    $result_type = $conn->query($sql_type);

    if ($result_type->num_rows > 0) {
        while ($row_type = $result_type->fetch_assoc()) {
            $data_type[] = $row_type['type_name'];
        }
    }

    // Merge the data arrays
    $response = array("success" => true, "message" => "Data retrieved successfully", "data" => $data, "type_names" => $data_type);
}

echo json_encode($response);

$conn->close();
