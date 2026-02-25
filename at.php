<?php
require_once '../config/db.php';

class BlogController {

    public function create($data) {
        global $pdo;

        $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $data['title'])));

        $stmt = $pdo->prepare("
            INSERT INTO blogs 
            (user_id,title,slug,content,featured_image,category,status) 
            VALUES (?,?,?,?,?,?,?)
        ");

        $stmt->execute([
            $_SESSION['user_id'],
            $data['title'],
            $slug,
            $data['content'],
            $data['featured_image'],
            $data['category'],
            $data['status']
        ]);

        $this->notifyFollowers($_SESSION['user_id'], $data['title']);
    }

    private function notifyFollowers($authorId, $title) {
        global $pdo;

        $followers = $pdo->prepare("SELECT follower_id FROM follows WHERE following_id = ?");
        $followers->execute([$authorId]);

        foreach($followers as $follower) {
            $stmt = $pdo->prepare("INSERT INTO notifications (user_id,message) VALUES (?,?)");
            $stmt->execute([$follower['follower_id'], "New post: ".$title]);
        }
    }
}