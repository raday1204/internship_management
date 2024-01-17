<?php
include('../../database.php');

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Sanitize and validate input
    $year = mysqli_real_escape_string($conn, $_POST['year']);
    $type_name = mysqli_real_escape_string($conn, $_POST['type_name']);

    // Initialize response array
    $response = [];

    // Retrieve company information
    $sqlCompany = "SELECT * FROM company WHERE year = ? AND type_name = ?";
    $stmtCompany = $conn->prepare($sqlCompany);
    $stmtCompany->bind_param("ss", $year, $type_name);

    if ($stmtCompany->execute()) {
        $resultCompany = $stmtCompany->get_result();

        if ($resultCompany->num_rows > 0) {
            while ($rowCompany = $resultCompany->fetch_assoc()) {
                $company_id = $rowCompany['company_id'];

                // Retrieve information from the company table
                $companyInformation['company'][] = $rowCompany;

                // Retrieve information from the student table
                $sqlStudent = "SELECT * FROM student WHERE company_id = ?";
                $stmtStudent = $conn->prepare($sqlStudent);
                $stmtStudent->bind_param("i", $company_id);

                if ($stmtStudent->execute()) {
                    $resultStudent = $stmtStudent->get_result();

                    if ($resultStudent->num_rows > 0) {
                        while ($rowStudent = $resultStudent->fetch_assoc()) {
                            $companyInformation['students'][] = $rowStudent;
                        }
                    }
                } else {
                    $response['error'] = "Error fetching student data: " . $stmtStudent->error;
                }

                $stmtStudent->close();

                // Retrieve information from the need_student table
                $sqlNeedStudent = "SELECT * FROM need_student WHERE company_id = ?";
                $stmtNeedStudent = $conn->prepare($sqlNeedStudent);
                $stmtNeedStudent->bind_param("i", $company_id);

                if ($stmtNeedStudent->execute()) {
                    $resultNeedStudent = $stmtNeedStudent->get_result();

                    if ($resultNeedStudent->num_rows > 0) {
                        while ($rowNeedStudent = $resultNeedStudent->fetch_assoc()) {
                            $companyInformation['need_student'][] = $rowNeedStudent;
                        }
                    }
                } else {
                    $response['error'] = "Error fetching need_student data: " . $stmtNeedStudent->error;
                }

                $stmtNeedStudent->close();
            }

            $response['success'] = true;
            $response['data'] = $companyInformation;
        } else {
            $response['error'] = "No data found for the specified parameters";
        }
    } else {
        $response['error'] = "Error fetching company data: " . $stmtCompany->error;
    }

    $stmtCompany->close();

    $conn->close();

    // Output the response
    echo json_encode($response);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
