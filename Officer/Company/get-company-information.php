<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

$hostAuth = "localhost";
$userAuth = "root";
$passAuth = "";
$dbname = "internship_management";

$conn = new mysqli($hostAuth, $userAuth, $passAuth, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->set_charset("utf8mb4");

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $year = mysqli_real_escape_string($conn, $_GET['year']);
    $type_name = mysqli_real_escape_string($conn, $_GET['type_name']);

    // Initialize response array
    $response = [];

    // Retrieve company information using prepared statement
    $sqlCompany = "SELECT company_id, company_name, company_building, company_job, send_name, year FROM company WHERE year = ? AND type_name = ?";
    $stmtCompany = $conn->prepare($sqlCompany);
    $stmtCompany->bind_param("ss", $year, $type_name);

    if ($stmtCompany->execute()) {
        $resultCompany = $stmtCompany->get_result();

        if ($resultCompany->num_rows > 0) {
            while ($rowCompany = $resultCompany->fetch_assoc()) {
                $company_id = $rowCompany['company_id'];

                // Retrieve information from the need_student table using prepared statement
                $stmtNeedStudents = $conn->prepare("SELECT * FROM need_student WHERE company_id = ?");
                $stmtNeedStudents->bind_param("s", $company_id);
                $stmtNeedStudents->execute();
                $resultNeedStudents = $stmtNeedStudents->get_result();
                $needStudent = fetchRecords($resultNeedStudents);

                // Retrieve information from the student table using prepared statement
                $stmtStudents = $conn->prepare("SELECT student_code, student_name, student_lastname, student_mobile, student.depart_code, depart.depart_name FROM student 
                LEFT JOIN depart ON student.depart_code = depart.depart_code
                WHERE student.company_id = ?");
                $stmtStudents->bind_param("s", $company_id);
                $stmtStudents->execute();
                $resultStudents = $stmtStudents->get_result();

                $students = [];

                // Check if there are students
                if ($resultStudents->num_rows > 0) {
                    // Loop through students
                    while ($rowStudent = $resultStudents->fetch_assoc()) {
                        $student_code = $rowStudent['student_code'];

                        // Retrieve information from the training table using prepared statement
                        $stmtTraining = $conn->prepare("SELECT * FROM training WHERE student_code = ? AND company_id = ?");
                        $stmtTraining->bind_param("ss", $student_code, $company_id);
                        $stmtTraining->execute();
                        $resultTraining = $stmtTraining->get_result();
                        $training = fetchRecords($resultTraining);

                        $students[] = [
                            'student_code' => $student_code,
                            'student_name' => $rowStudent['student_name'],
                            'student_lastname' => $rowStudent['student_lastname'],
                            'student_mobile' => $rowStudent['student_mobile'],
                            'depart_name' => $rowStudent['depart_name'],
                            'training' => $training,
                            'company_status' => isset($training[0]['company_status']) ? $training[0]['company_status'] : null,
                        ];
                    }
                }

                $response[] = [
                    'company' => $rowCompany,
                    'students' => $students,
                    'need_students' => $needStudent
                ];
            }
        } else {
            $response['error'] = "No data found for the specified parameters";
        }
    } else {
        $response['error'] = "Error executing the prepared statement";
    }

    $stmtCompany->close();
    $conn->close();

    // Output the response
    echo json_encode(['success' => true, 'data' => $response]);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}

function fetchRecords($result)
{
    $records = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $records[] = $row;
        }
    }

    return $records;
}
