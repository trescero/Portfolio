<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Derek Samson | Portfolio</title>
    <meta name="description" content="Derek Samson - Portfolio">
    <link rel="stylesheet" href="/styles/main.css" />
    <script src="/scripts/main.js" defer></script>
  </head>
  <body>
    <header class="header" data-component="Header" data-threshold="0.1">
      <div class="wrapper wrapper-header">
        <a href="/#" class="logo">
          DS
        </a>
        <nav class="nav_primary" id="nav">
          <ul>
            <li><a href="/#projects" class="link id-link" title="">Projets</a></li>
            <li><a href="/#about" class="link id-link" title="">À propos</a></li>
            <li><a href="#" class="link">Contact</a></li>
          </ul>
        </nav>  
        <button id="headerButton" aria-label="Menu de navigation Mobile" class="header__toggle js-toggle">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>

    <div class="bg"></div>

    <section class="contact">
        <div class="wrapper wrapper-content">
            <div class="section-title">
                <h1>Contactez-Moi</h1>
            </div>

            <div class="contact-page">
                <div class="contact-left">
<?php
include "class/gbi_portfolio.class.php";

if(isset($_GET["action"]) && (!empty($_GET["action"]))) {
    $action = $_GET["action"];
    if($action === 'send' ){
        $reservation = new tim_form();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $reservation->assignPostVariables();
            $to = $reservation->tim_form_courriel;
            $cc = tim_form::COURRIEL_CC;
            $bcc = NULL;
            $subject = "contact -  {$reservation->tim_form_nom} ";
            $reservation->envoyerEmail($to, $cc, $bcc, $subject);
            $tim_form_html = $reservation->afficherHTML();
            echo $tim_form_html;
        }
    }
} else {
?>
                    <form action="index.php?action=send" method="post" class="form__simple" autocomplete="off">
                        <div class="form__body">

                            <div class="input">
                                <label class="input__label" for="name">Nom &#38; Prénom</label>
                                <input class="input__element" type="text" name="tim_form_nom" id="name" placeholder="Votre nom complet" required />
                                <p class="error_text">Veuillez remplir ce champ.</p>
                            </div>

                            <div class="input">
                                <label class="input__label" for="email">Adresse courriel</label>
                                <input class="input__element" type="email" name="tim_form_courriel" id="email" placeholder="ex: bobtremblay@gmail.com" required />
                                <p class="error_text">Veuillez entrer une adresse courriel valide.</p>
                            </div>

                            <div class="input">
                                <label class="input__label" for="message">Message</label>
                                <textarea class="input__element" name="tim_form_commentaires" id="message" rows="5" required></textarea>
                                <p class="error_text">Veuillez remplir ce champ.</p>
                            </div>

                            <footer class="form_footer">
                                <button class="button button_rounded" type="submit">Soumettre</button>
                            </footer>
                        </div>

                        <div class="form__confirmation">
                            <h2>Merci</h2>
                            <h3>Votre formulaire a bien été envoyé.</h3>
                        </div>
                    </form>
<?php
}
?>
                </div>

                <div class="contact-right">
                    <div class="coords contact-section">
                        <h3>Mes coordonées:</h3>
                        <div class="contact-links">
                            <a href="mailto:derek.samson@outlook.com" class="link contact-link link-left">
                                <svg class="icon">
                                    <use href="#icon-mail"></use>
                                </svg>
                                derek.samson@outlook.com
                            </a>
                            <a href="/Curriculum Vitae.pdf" target="_blank" class="link contact-link link-left">
                                <svg class="icon">
                                    <use href="#icon-download"></use>
                                </svg>
                                Curriculum Vitae
                            </a>
                        </div>
                    </div>

                    <div class="socials contact-section">
                        <h3>Mes réseaux:</h3>
                        <ul class="contact-socials">
                            <li><a href="https://www.instagram.com/derek_.samson/" target="_blank" class="link contact-link link-left">
                                <svg class="icon">
                                    <use href="#icon-instagram"></use>
                                </svg>
                                Instagram
                            </a></li>
                            <li><a href="https://www.linkedin.com/in/derek-samson/" target="_blank" class="link contact-link link-left">
                                <svg class="icon">
                                    <use href="#icon-linkedin"></use>
                                </svg>
                                LinkedIn
                            </a></li>
                            <li><a href="https://github.com/trescero" target="_blank" class="link contact-link link-left">
                                <svg class="icon">
                                    <use href="#icon-github"></use>
                                </svg>
                                GitHub
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    
  </body>
</html>