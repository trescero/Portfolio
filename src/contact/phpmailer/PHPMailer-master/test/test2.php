<?php
ini_set('display_errors', 1);  // Affiche les erreurs sur la page
ini_set('display_startup_errors', 1);  // Affiche les erreurs lors du démarrage
error_reporting(E_ALL);  // Rapporter toutes les erreurs (E_ALL)

// Inclure les fichiers nécessaires de PHPMailer
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Créer un nouvel objet PHPMailer
$mail = new PHPMailer(true);

try {
    echo '<p>debut du test</p>';

    $datetime = date('Y-m-d H:i:s');
    echo "<p>Date: $datetime</p>";

    // Configuration de base sans serveur SMTP

    $mail->isSMTP();                                      // Utilise SMTP
    $mail->Host       = 'test2.imbert.ca';                 // Serveur SMTP (exemple: Gmail)
    $mail->SMTPAuth   = true;                             // Activer l'authentification SMTP
    $mail->Username   = 'test@tim2.imbert.ca';            // Ton adresse email Gmail
    $mail->Password   = '#Luminy11#';               // Ton mot de passe Gmail ou mot de passe d'application
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;   // Activer le chiffrement TLS
    $mail->Port       = 465;                              // Port TCP à utiliser (TLS)


    
    // Définir les paramètres de l'email
    $mail->setFrom('test@tim2.imbert.ca', 'bernard imbert');
    $mail->addAddress('bernard@imbert.ca', 'Bernard imbert');
    $mail->Subject = 'Test d\'envoi avec PHPMailer sans SMTP';
    $mail->Body    = 'Ceci est un message de test envoyé avec PHPMailer sans spécifier de serveur SMTP.';
    
    // Envoyer l'email
    $mail->send();
    echo 'L\'email a été envoyé avec succès !';
} catch (Exception $e) {
    echo "L'email n'a pas pu être envoyé. Erreur: {$mail->ErrorInfo}";
}