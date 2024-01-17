<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$hostAuth = "localhost";
$userAuth = "root";
$passAuth = "";
$dbname = "internship_management";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

// Check if type_name is provided in the query parameters
if (isset($_GET['type_name'])) {
    $type_name = mysqli_real_escape_string($conn, $_GET['type_name']);

    $sql_get_company = "SELECT DISTINCT company_name FROM company WHERE type_name = ?";
    $stmt_get_company = $conn->prepare($sql_get_company);

    if ($stmt_get_company === false) {
        $response = array("success" => false, "message" => "Prepare failed: " . $conn->error);
    } else {
        $stmt_get_company->bind_param("s", $type_name);

        if ($stmt_get_company->execute()) {
            $result = $stmt_get_company->get_result();

            if ($result->num_rows > 0) {
                $data = array();
                while ($row = $result->fetch_assoc()) {
                    $data[] = array("companyName" => $row['company_name']);
                }
                $response = array("success" => true, "message" => "Company names for the specified type_name retrieved successfully", "data" => $data);
            } else {
                $response = array("success" => false, "message" => "No data found for the specified parameters");
            }
        } else {
            $response = array("success" => false, "message" => "Error fetching company data: " . $stmt_get_company->error);
        }
        $response["selectedCompanyNames"] = $data;
        $stmt_get_company->close();
    }
} else {
    $response = array("success" => false, "message" => "Type name not provided in the query parameters");
}

echo json_encode($response);

$conn->close();
?>