<?php
include('../../database.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Process form data
    $relation_date = $_POST['relation_date'];
    $relation_content = $_POST['relation_content'];

    $upload_path = '';

    if (isset($_FILES['file']) && $_FILES['file']['error'] == UPLOAD_ERR_OK) {
        $file_name = $_FILES['file']['name'];
        $file_tmp = $_FILES['file']['tmp_name'];
        $file_size = $_FILES['file']['size'];

        // Validate file size (adjust as needed)
        $max_size = 5 * 1024 * 1024; // 5 MB

        if ($file_size <= $max_size) {
            // Validate file type using finfo_file
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $file_mime_type = finfo_file($finfo, $file_tmp);
            finfo_close($finfo);

            if (
                $file_mime_type === 'image/jpeg'
                || $file_mime_type === 'image/jpg'
                || $file_mime_type === 'image/gif'
                || $file_mime_type === 'image/png'
                || $file_mime_type === 'application/pdf'
                || $file_mime_type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                || $file_mime_type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                || $file_mime_type === 'application/msword'
            ) {
                // Move the uploaded file to the desired directory
                $upload_path = '/xampp/htdocs/PJ/Backend/Officer/uploads/' . $file_name;
                if (move_uploaded_file($file_tmp, $upload_path)) {
                    // Use prepared statements to prevent SQL injection
                    $insert_query = "INSERT INTO relation (relation_date, relation_content, relation_pic) 
                                    VALUES (?, ?, ?)";
                    $stmt = $conn->prepare($insert_query);
                    $stmt->bind_param("sss", $relation_date, $relation_content, $upload_path);

                    if ($stmt->execute()) {
                        echo json_encode(['success' => true, 'message' => 'Data saved successfully']);
                        exit;
                    } else {
                        echo json_encode(['success' => false, 'message' => 'Error inserting data: ' . $stmt->error]);
                        exit;
                    }
                } else {
                    die(json_encode(['success' => false, 'message' => 'Error moving uploaded file']));
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Invalid file type']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Invalid file size']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error uploading file']);
    }
    exit();
} else {
    // Handle invalid request method
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    // Exit the script after sending the JSON response
    exit();
}

$conn->close();
