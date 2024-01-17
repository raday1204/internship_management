<?php
include('../../database.php');

// Function to get the PDF path
function getPDFPath($year, $term)
{
    $pdfDirectory = 'C:/xampp/htdocs/PJ/Frontend/src/assets/pdfs';

    // Construct the PDF file path
    $pdfPath = "{$pdfDirectory}/{$year}_{$term}.pdf";

    if (file_exists($pdfPath)) {
        return $pdfPath;
    } else {
        return false;
    }
}
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
    $conn->close();

    echo json_encode($response);
}