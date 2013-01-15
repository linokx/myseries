<?php
if(!isset($_GET['request'])) $_GET['request'] = "normal";
if($_GET['request'] != 'ajax'){

include('include/meta.php'); ?>

<body id="saison">
	<?php include('include/header.php'); ?>
	<?php } ?>
	<h2>Chargement...</h2>
	<div id="saisons">
		<ul class="episodes">
		</ul>
		
	<?php if($_GET['request'] != 'ajax'){ ?>
	</div>
<?php include('include/footer.php'); ?>
<?php } ?>