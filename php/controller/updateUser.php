<?php

include '../access/server.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $username = $_POST['username'] ?? null;
    $name = $_POST['name'] ?? null;
    $birth = $_POST['date'] ?? null;
    $address = $_POST['address'] ?? null;
    $walletAddress = $_POST['walletAddress'] ?? null;

    if (empty($username)) {

        echo json_encode([
            'success' => false,
            'message' => 'Invalid Username'
        ]);

        exit();

    }

    $img_id = null;

    if (isset($_FILES['img']) && $_FILES['img']['error'] === 0) {

        $img_tmp_name = $_FILES['img']['tmp_name'];
    
        if (is_uploaded_file($img_tmp_name)) {
            
            $img_data = file_get_contents($img_tmp_name);
    
            $img_id = $img_data;
    
        } else {
    
            echo json_encode([
                'success' => false,
                'message' => 'Img failed to Upload'
            ]);
            exit();
        }

        $stmt = $pdo->prepare("UPDATE user_tbl SET name = :name, address = :address, birth = :birth, profile_pic = :profile_pic, shop_wallet_address = :walletAddress WHERE username = :username");
        $stmt->execute([
            ':name' => $name,
            ':address' => $address,
            ':birth' => $birth,
            ':username' => $username,
            ':walletAddress' => $walletAddress
            ':profile_pic' => $img_id
        ]);

        if ($stmt) {

            echo json_encode([
                'success' => true,
                'message' => 'User Updated Successfully'
            ]);

        } else {

            echo json_encode([
                'success' => false,
                'message' => 'Somethings not right'
            ]);

        }
    
    } else {
    
        echo json_encode([
            'success' => false,
            'message' => 'No Img File Uploaded'
        ]);
        exit();
    
    }




} else {

    echo json_encode([
        'success' => false,
        'message' => 'Error While Updating'
    ]);

    exit();

}

?>
