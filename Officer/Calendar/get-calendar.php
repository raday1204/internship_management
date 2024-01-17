<?php
include('../../database.php');

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    // Check if the 'year' and 'term' parameters are set in the URL
    if (isset($_GET['year']) && isset($_GET['term'])) {
        $year = mysqli_real_escape_string($conn, $_GET['year']);
        $term = mysqli_real_escape_string($conn, $_GET['term']);

        // Construct the PDF file path using the getPDFPath function
        $pdfPath = getPDFPath($year, $term);

        $response = [
            'success' => false,
            'data' => null,
            'error' => null,
        ];

        // Check if the PDF file exists
        if ($pdfPath) {
            $pdfContent = file_get_contents($pdfPath);

            if ($pdfContent !== false) {
                $response['success'] = true;
                $response['data'] = [
                    'pdfContent' => base64_encode($pdfContent),
                ];
            } else {
                $response['error'] = 'Error reading PDF file';
            }
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