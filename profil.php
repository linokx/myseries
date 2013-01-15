<?php
if(!isset($_GET['request'])) $_GET['request'] = "normal";
if($_GET['request'] != 'ajax'){
	
include('include/meta.php'); ?>

<body id="profil">
	<?php include('include/header.php'); ?>
	<h2>Mes Favoris</h2>
	<ul id="favoris">
		<?php } ?>
		
	<?php if($_GET['request'] != 'ajax'){ ?>
	</ul>
	<div id="delete">
		<p>Voulez-vous vraiment arreter de suivre cette serie ?</p>
		<button class="confirm">Ne plus suivre</button><button class="cancel">Annuler</button>
	</div>
	<?php include('include/footer.php'); ?>
<?php } ?>