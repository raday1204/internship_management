<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get type_name from the request body
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    if (isset($data['type_name'])) {
        $type_name = $data['type_name'];

        // Assuming you have a column named 'type_name' in your 'company' table
        $query = "SELECT * FROM company WHERE type_name = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $type_name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $companyInformation = ['company' => []];

            while ($row = $result->fetch_assoc()) {
                // Customize the response structure based on your needs
                $rowCompany = [
                    'company_id' => $row['company_id'],
                    'company_name' => $row['company_name'],
                ];

                $companyInformation['company'][] = $rowCompany;
            }

            echo json_encode(['success' => true, 'data' => $companyInformation]);
        } else {
            echo json_encode(['success' => false, 'message' => 'No companies found for the specified type_name']);
        }

        $stmt->close();
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data format']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

$conn->close();