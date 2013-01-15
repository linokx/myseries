<?php
if(!isset($_GET['request'])) $_GET['request'] = "normal";
if($_GET['request'] != 'ajax'){
	
include('include/meta.php'); ?>

<body id="liste">
	<?php include('include/header.php'); ?>
	<ul id="series">
		<?php } ?>
		
	<?php if($_GET['request'] != 'ajax'){ ?>
	</ul>
	<div id="page"><i class="icon-left"></i> Page <span>en chargement...</span> <i class="icon-right"></i></div>
	<?php include('include/footer.php'); ?>
<?php } ?>