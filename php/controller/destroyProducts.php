<?php

include '../access/server.php'; 
include '../access/nodejs.php'; 

class ProductManager {
    private $pdo;
    private $data;

    public function __construct($pdo, $data) {
        $this->pdo = $pdo;
        $this->data = $data;
    }

    public function deleteProduct() {
        $id = $this->data['id'] ?? null;

        if (empty($id)) {
            return $this->response(false, 'id Undefined');
        }

        $stmt = $this->pdo->prepare("DELETE FROM product_tbl WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);

        if ($stmt->rowCount() > 0) {
            return $this->response(true, 'Deleted Successfully');
        } else {
            return $this->response(false, 'Nothing was deleted');
        }
    }

    private function response($success, $message) {
        echo json_encode([
            'success' => $success,
            'message' => $message
        ]);
        exit();
    }
}

$input = json_decode(file_get_contents("php://input"), true);

$manager = new ProductManager($pdo, $input);
$manager->deleteProduct();

?>
