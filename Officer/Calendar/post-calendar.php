<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header("Content-Type: application/json");

// Function to get the PDF path
function getPDFPath($year, $term)
{
    // Assuming the PDFs are stored in the assets/pdfs directory
    $pdfDirectory = 'C:/xampp/htdocs/PJ/Frontend/src/assets/pdfs';

    // Construct the PDF file path
    $pdfPath = "{$pdfDirectory}/{$year}_{$term}.pdf";

    // Check if the PDF file exists
    if (file_exists($pdfPath)) {
        return $pdfPath;
    } else {
        // Return false if the PDF file is not found
        return false;
    }
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

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if the 'year' and 'term' parameters are set in the POST request body
    if (isset($_POST['year']) && isset($_POST['term'])) {
        $year = mysqli_real_escape_string($conn, $_POST['year']);
        $term = mysqli_real_escape_string($conn, $_POST['term']);

        // Construct the PDF file path using the getPDFPath function
        $pdfPath = getPDFPath($year, $term);

        $response = [
            'success' => false,
            'data' => null,
            'error' => null,
        ];

        // Check if the PDF file exists
        if ($pdfPath) {
            $response['success'] = true;
            $response['data'] = [
                'pdfPath' => 'http://localhost/PJ/Frontend/src/assets/pdfs/' . basename($pdfPath),
            ];
        } else {
            $response['error'] = 'PDF file not found';
        }
    } else {
        $response = [
            'success' => false,
            'data' => null,
            'error' => 'Missing parameters (year and/or term)',
        ];
    }

    // Close the database connection
    $conn->close();

    echo json_encode($response);
}
