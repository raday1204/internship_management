<?php
include('../../database.php');

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($data->studentCode)) {
        $studentCode = $conn->real_escape_string($data->studentCode);

        if (isset($data->newStatus)) {
            $newStatus = $conn->real_escape_string($data->newStatus);
            $sqlCompanyStatus = "UPDATE training SET company_status = ? WHERE student_code = ?";
            $stmtCompanyStatus = $conn->prepare($sqlCompanyStatus);

            if ($stmtCompanyStatus) {
                $stmtCompanyStatus->bind_param("ss", $newStatus, $studentCode);

                if (!$stmtCompanyStatus->execute()) {
                    die(json_encode(["error" => "Error updating company status: " . $stmtCompanyStatus->error]));
                }

                $stmtCompanyStatus->close();
            } else {
                die(json_encode(["error" => "Prepare failed: " . $conn->error]));
            }
        }

        if (isset($data->newAssessmentStatus)) {
            $newAssessmentStatus = $conn->real_escape_string($data->newAssessmentStatus);
            $sqlAssessmentStatus = "UPDATE training SET assessment_status = ? WHERE student_code = ?";
            $stmtAssessmentStatus = $conn->prepare($sqlAssessmentStatus);

            if ($stmtAssessmentStatus) {
                $stmtAssessmentStatus->bind_param("ss", $newAssessmentStatus, $studentCode);

                if (!$stmtAssessmentStatus->execute()) {
                    die(json_encode(["error" => "Error updating assessment status: " . $stmtAssessmentStatus->error]));
                }

                $stmtAssessmentStatus->close();
            } else {
                die(json_encode(["error" => "Prepare failed: " . $conn->error]));
            }
        }

        echo json_encode(["success" => true, "studentCode" => $studentCode]);
    } else {
        echo json_encode(["error" => "Invalid input data."]);
    }

    // Close the connection
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
