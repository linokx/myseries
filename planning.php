<?php include('include/meta.php'); ?>
<body id="agenda">
	<?php include('include/header.php'); ?>
	<?php 
		date_default_timezone_set('Europe/Brussels');
	?>
	<h2>Mon Programme</h2>
	<ul id="series">
		<?php for($i = 0; $i<7; $i++){
			$jour = date('w',mktime(0, 0, 0, date("m")  , date("d")+$i, date("Y")));
			switch ($jour) {
				case '0':
					$class = 'Dimanche';
				break;
				case '1':
					$class = 'Lundi';
				break;
				case '2':
					$class = 'Mardi';
				break;
				case '3':
					$class = 'Mercredi';
				break;
				case '4':
					$class = 'Jeudi';
				break;
				case '5':
					$class = 'Vendredi';
				break;
				case '6':
					$class = 'Samedi';
				break;
				
				default:
					# code...
					break;
			}
			?>
			<li id="jour-<?php echo $jour; ?>">
				<h3><?php echo $class; ?></h3>
			</li>
			<?php
		}
		?>
		<li id="soon">
			<h3>À venir</h3>
		</li>
	</ul>
<?php include('include/footer.php'); ?>