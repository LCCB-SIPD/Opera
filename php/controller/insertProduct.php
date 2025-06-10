<?php 

include '../access/server.php';

if ($_SERVER["REQUEST_METHOD"] == 'POST') {

    $prd_name = $_POST['prd_name'] ?? null;
    $prd_price = $_POST['prd_price'] ?? null;
    $user_id = $_POST['userId'] ?? null;
    $username = $_POST['username'] ?? null;
    $quantity = $_POST['quantity'] ?? null;
    $categories = $_POST['categories'] ?? null;

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
    
    } else {
    
        echo json_encode([
            'success' => false,
            'message' => 'No Img File Uploaded'
        ]);
        exit();
    
    }

    if (empty($user_id) || empty($username)) {

        echo json_encode([
            'success' => false,
            'message' => 'Undifined Users'
        ]);
        exit();
    }
    
    $stmt2 = $pdo->prepare('SELECT * FROM user_tbl WHERE username = :username LIMIT 1');
    
    $stmt2->execute([
        ':username' => $username
    ]);
    
    $rows = $stmt2->fetch(PDO::FETCH_ASSOC);
    
    if(empty($rows['shop_wallet_address'])) {
        
        echo json_encode([
            'success' => false,
            'message' => 'Please Update Your Shop Address'
        ]);
        
        exit;
        
    }
    
    
    $stmt = $pdo->prepare('INSERT INTO product_tbl (
        name,
        price,
        owner_id,
        owner_user,
        quantity,
        categories,
        product_pic
    ) VALUES (
        :name,
        :price,
        :owner_id,
        :owner_user,
        :quantity,
        :categories,
        :product_pic
    )');

    $stmt->execute([
        ':name' => $prd_name,
        ':price' => $prd_price,
        ':owner_id' => $user_id,
        ':owner_user' => $username,
        ':quantity' => $quantity,
        ':categories' => $categories,
        ':product_pic' => $img_id
    ]);
    
    if ($stmt) {
    
        echo json_encode([
            'success' => true,
            'message' => 'Uploaded Successfully'
        ]);
    
    } else {
    
        echo json_encode([
            'success' => false,
            'message' => 'Failed to Sell'
        ]);
    
    }

} else {

    echo json_encode([
        'success' => false,
        'message' => 'Method POST Error'
    ]);
    exit();

}

?>
