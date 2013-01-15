<?php include('include/meta.php'); ?>

<body>
	<?php include('include/header.php'); ?>
	<div id="content">
		<div id="accueil">
			<h2>Bienvenue sur l'application MySeries</h2>
			<div>
				<p>Cherchez vos séries préférées, ajoutez les à votre agenda et ne manquer plus une diffusion</p>
			</div>
		</div>
		<div id="profil">
			<h2>Mes Favoris</h2>
			<ul id="favoris">
			</ul>
			<div id="delete">
				<p>Voulez-vous vraiment arreter de suivre cette serie ?</p>
				<button class="confirm">Ne plus suivre</button><button class="cancel">Annuler</button>
			</div>
		</div>
		<div id="planning">
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
		</div>
		<div id="liste">
			<ul id="result">
			</ul>
			<div id="page">
				<i class="icon-left"></i> Page <span>en chargement...</span> <i class="icon-right"></i>
			</div>
		</div>
		<div id="fiche">
			<h2>Chargement...</h2>
			<div id="description">
			</div>
			<a href="#" class="add_serie">Suivre la serie</a>
			<ul id="saisons">
			</ul>
		</div>
	</div>
<?php include('include/footer.php'); ?>