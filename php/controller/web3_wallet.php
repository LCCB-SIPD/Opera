<?php

include '../access/nodejs.php';
include '../access/server.php';


class Web3WalletConnect {

    private $pdo;
    private $data;

    public function __construct($pdo, $data) {
        $this->pdo = $pdo;
        $this->data = $data;
    }

    public function save_wallet() {
        $walletAddress = $this->data["address"] ?? null;
        $user_Id = $this->data["user_id"] ?? null;

        if (empty($walletAddress)) {
            return $this->response(false, 'Address Not Found!!');
        }

        if (empty($user_Id)) {
            return $this->respones(false, 'User Not Found');
        }

        $stmt = $this->pdo->prepare("UPDATE user_tbl SET web_wallet = :web_wallet WHERE id = :user_id");
        $stmt->execute([
            ':web_wallet' => $walletAddress,
            ':user_id' => $user_Id
        ]);

        if ($stmt) {
            return $this->response(true, "Wallet Saved Successfully");
        } else {
            return $this->response(false, "Unknown Error");
        }

        

    }

    private function response($success, $message) {
        echo json_encode([
            'success' => $success,
            'message' => $message
        ]);
        exit;
    }

}

$input = json_decode(file_get_contents("php://input"), true);

$manager = new Web3WalletConnect($pdo, $data);

$manager->save_wallet();


?>