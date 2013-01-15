//http://api.betaseries.com/shows/display/dexter.json?key=2c9616d370cc

( function ( $ ) {
	"use strict";

	// --- global vars
	var apercu,
		$zone,
		skey='2c9616d370cc',
		sKeyWord,
		$page,
		sPage,
		$exPage = $('#accueil'),
		sExPage = 'Accueil',
		dataLocal,
		memory,
		oListeSerie;

	// --- methods
	var getURL_param = function(){
		var url = window.location.search;
		if(url != null){
			url = url.replace(/\?/gi,'');
			var aUrl = url.split('&');
			var l = aUrl.length;
			var aParam = [];
			for(var i=0; i<l; i++){
				var param = aUrl[i].split('=');
				aParam[param[0]] = param[1];
			}
			return aParam;
		}
		else{
			return null;
		}

	}; //getURL_param

	var checkPage = function(e){
		e.preventDefault();
		console.log(e);
		sPage = (e.currentTarget.offsetParent.localName == 'nav') ? e.currentTarget.innerHTML : e.currentTarget.className;
		if(sExPage != sPage){
			if(sPage == 'Accueil'){
				$page = $('#accueil');
				$exPage.css({'width':'50%'});
				$('#content').css({width:'200%'});
				$page.css({'display':'inline-block','width':'49%'});
				$('#content').css({marginLeft:'-100%'});

				$('#content').animate({marginLeft:0},400,function(){
					$page.css({'width':'100%'});
					$('#content').css({width:'100%'});
					$exPage.hide();
					$exPage = $page;
					sExPage = sPage;
				});
				
			}
			else{
				switch(sPage){
					case 'Favoris':
						$page = $('#profil').remove();
						$('#content').append($page);
						favoris();
					break;
					case 'Liste':
						$page = $('#liste').remove();
						$('#content').append($page);
						liste();
					break;
					case 'Planning':
						$page = $('#planning').remove();
						$('#content').append($page);
						agenda();
					break;
					case 'serie':
						$page = $('#fiche').remove();
						$('#content').append($page);
						fiche(e.currentTarget.title);
					break;
					default:
					break;
				}
				console.log($page);
				$exPage.css({'width':'50%'});
				$page.css({'display':'inline-block','width':'49%'});
				$('#content').css({width:'200%'});
				$('#content').animate({marginLeft:'-100%'},200,function(){
					$exPage.hide();
					sExPage = sPage;
					$exPage = $page;
					$page.css({'width':'100%'});
					$('#content').css({marginLeft:0,width:'100%'});
				});
			}
		}
		/*sPage = $('body').attr('id');
		switch(sPage){
			case 'accueil':
			break;
			case 'fiche':
				fiche();
			break;
			case 'liste':
				liste();
			break;
			case 'saison':
				saison();
			break;
			case 'agenda':
				agenda();
			break;
			case 'profil':
				favoris();
			break;
			default:
			break;
		}*/
	}; //checkPage

	var saveLocal = function(obj){
		window.localStorage.setItem('series',JSON.stringify(obj));
	}; // saveLocal

	var readLocal = function(){
		dataLocal = JSON.parse(window.localStorage.getItem('series'));
	}; // readLocal

	var inList = function(url){
		for(var i in dataLocal){
			if(dataLocal[i].url == url){
				return true;
			}
		}
		return false;
	} // inList

	var fiche = function(title){
		console.log(title);
		var info,
			saisons;
		$.ajax({
			url: 'http://api.betaseries.com/shows/display/'+title+'.json?key='+skey,
			dataType: 'jsonp',
			type:'POST',
			success: function(data){
				info = data.root.show;
				$zone = $('body');
				if(info.banner != undefined){
					$('#description').hide().append('<img src="'+info.banner.replace('https:','http:')+'"/>').fadeIn();
				}
				$('#fiche').find('h2').text(info.title).find('canvas').append('<p>'+info.description+'</p>');
				saisons = 0;
				for(var i in info.seasons) saisons++;
				var nbreEpisode = 0;
				for(var i in info.seasons){
					$('#saisons').append('<li><a href="saison.php?title='+title+'&saison='+i+'">Saison '+i+' <span>('+info.seasons[i].episodes+' episodes)</span></a></li>');
					nbreEpisode+= info.seasons[i].episodes;
				}
				$('#description').append('<p>'+info.description+'</p><div>'+saisons+' saisons,'+nbreEpisode+' épisodes</div>');
				if(inList(info.url)){
					$('.add_serie').attr('class','del_serie').text('Ne plus suivre');
				}
				$zone.on('click','.add_serie',function(e){
		    		e.preventDefault();
		    		addSerie({'url':info.url,'title':info.title});
		    		$(this).text('Ne plus suivre').attr('class','del_serie');
		    	});
		    	$zone.on('click','.del_serie',function(e){
		    		e.preventDefault();
		    		deleteSerie('',info.url);
		    		$(this).text('Suivre la serie').attr('class','add_serie');
		    	});
			}
		});
	}; //fiche;

	var liste = function(){
		var params = getURL_param(),
			title = params['title'],
			$zone = $('#result'),
			i,
			jInfos;

		//$("#keyWord").val(title);

		var url = (title == null)? 'display/all.json?key='+skey : 'search.json?key='+skey+'&title='+title;
		//if($('#result').find('li').length == 0){
			$.ajax({
				url:'http://api.betaseries.com/shows/'+url,
				dataType: 'jsonp',
				type:'POST',
				cache:'true',
				jsonpCallback:'mySeries',
				success: function(data){
					jInfos = data.root.shows;
					var oListeSerie = jInfos,
						$zone = $('#result');
					i=0;
					$zone.find('li').remove().on('click','a',checkPage);
					listerSeries(i,jInfos,$zone);
				}
			});
			$('#page').on('click','.icon-right',function(){
				$zone.fadeOut('fast',function(){
					$(this).find('li').remove();
					i+=10;
					listerSeries(i,jInfos,$zone);
				});
			});
			$('#page').on('click','.icon-left',function(){
				$zone.fadeOut('fast',function(){
					$(this).find('li').remove();
					i-=10;
					listerSeries(i,jInfos,$zone);
				});
			});
		//}
	}; //liste

	var listerSeries = function(page,infos,zone){
		console.log(infos);
		var max = (page+10 > infos.length)?infos.length:page+10,
			oFav;
		
		for(var i = page; i<max; i++){
			oFav = (inList(infos[i].url)) ? {'class':'delete','text':'X'} : {'class':'add','text':'Add'};
			zone.append('<li data-url="'+infos[i].url+'" data-title="'+infos[i].title+'"><a href="fiche.php?title='+infos[i].url+'">'+infos[i].title+'</a><a class="'+oFav.class+'">'+oFav.text+'</a></li>');
		}
		zone.on('click','.add',function(){
			addSerie({'url':$(this).parent().attr('data-url'),'title':$(this).parent().attr('data-title')});
			$(this).attr('class','delete').html('X');
		});
		zone.on('click','.delete',function(){
			deleteSerie($(this).parent(),$(this).parent().attr('data-url'));
			$(this).attr('class','add').html('Add');
		});
		paging(page,infos.length);
		
		zone.fadeIn('fast');
	}; //listerSeries

	var paging = function(i,info){
		if(i>0){
			$('.icon-left').show();
		}
		else{
			$('.icon-left').hide();
		}
		if(i<(info-10)){
			$('.icon-right').show();
		}
		else{
			$('.icon-right').hide();
		}
		var iPage = (i/10)+1;
		$('#page').find('span').text(iPage+'/'+(Math.round(info/10)+1));
	} // paging

	var saison = function(){
		var params = getURL_param();
		var title = params['title'],
			saison = (params['saison']>0)?params['saison']:1;
		$.ajax({
			url:'http://api.betaseries.com/shows/episodes/'+title+'.json?key='+skey+'&season='+saison+'&hide_notes=1',
			dataType: 'jsonp',
			type:'POST',
			jsonpCallback:'mySeries',
			success: function(data){
				var infos = data.root.seasons[0].episodes,
					titre,
					description;						
					$('#saison').find('h2').html('<a href="fiche.php?title='+title+'">'+infos[0].show+'</a>: Saison&nbsp;'+saison);

				for(var i in infos){
					titre = (infos[i].title == '') ?"Épisode n°"+infos[i].episode : infos[i].title;
					description = (infos[i].description == '') ? 'Aucune description disponible.':infos[i].description;
					$('.episodes').append('<li>'+titre+' <p><span>('+infos[i].number+')</span><br/>'+description+'</p></li>');
				}
				$('.episodes').on('click','li',function(){
					$(this).parent().find('p').slideUp('normal').parent().removeClass('active');
					var p = $(this).find('p');
					if(p.css('display') != 'block'){
						p.slideDown().parent().addClass('active');
					}
				})
			}
		})
	}; //saison

	var recherche = function(e){
		e.preventDefault();
		sKeyWord = $("#keyWord").val();
		if(sKeyWord.length >1){
			window.location = "liste.php?title="+sKeyWord;
		}
		else{
			$(this).find('span').text('Vous devez écrire au moins 2 caractères.');
		}
	}; //recherche

	var agenda = function(){
		var series = JSON.parse(localStorage.getItem('series')),
			$zone;
		$('#planning').find('a').remove();
		$.ajax({
			url:'http://api.betaseries.com/planning/general.json?key='+skey,
			dataType: 'jsonp',
			type:'POST',
			success: function(data){
				var infos = data.root.planning,
					mtn = new Date().getTime(),
					diffusion,
					series = JSON.parse(window.localStorage.getItem('series'));
				for(var i in infos){
					for(var j in series){
						if(series[j].url == infos[i].url){
							diffusion = infos[i].date*1000;
							if(diffusion > mtn){
								var date = new Date(diffusion);
								if(diffusion < (mtn+(7*24*60*60*1000))){
										$zone = $('#jour-'+date.getDay());
									}
									else{
										$zone = $('#soon');
									}
									$zone.append('<p><a href="saison.php?title='+infos[i].url+'&saison='+infos[i].season+'">'+infos[i].show+' - '+infos[i].title+'</a></p>');
							}
						}
					}
				}
					
			}
		});
	}; // agenda

	var favoris = function(){
		var infos = dataLocal,
			$zone = $('#favoris'),
			$serie,
			sUrl;
			$zone.find('*').remove();
		for(var i in infos){
			$zone.append('<li data-url="'+infos[i].url+'"><a class="serie" href="fiche.php?title='+infos[i].url+'" title="'+infos[i].url+'">'+infos[i].title+'</a><a href="#" class="delete">X</a></li>');
		}
		$('.serie').on('click',checkPage);

		$zone.on('click','.delete',function(){
			$serie = $(this).parent();
			sUrl = $serie.attr('data-url');
			$('#delete, #cache').fadeIn('fast');
			$('.cancel').on('click',function(){
				$('#delete, #cache').fadeOut('fast');
			});
			$('.confirm').on('click',function(){
				deleteSerie($serie, sUrl);
			});
			
		});
	}; // profil

	var deleteSerie = function(serie, url){
		if(sPage == 'profil'){
			$('#delete, #cache').fadeOut('fast',function(){
				serie.slideUp();
			});
		}
		delete dataLocal[url];
		saveLocal(dataLocal);
	} // deleteSerie

    var addSerie = function(infos){
		var monobjet = initSerie();
		monobjet[infos.url] = {
			'description':infos.description,
			'banner':infos.banner,
			'seasons':infos.seasons,
			'status':infos.status,
			'title':infos.title,
			'url':infos.url
		};
		saveLocal(monobjet);
    }; // addSerie

    var initSerie = function(){
    	if(dataLocal == null){
    		return {};
    	}
    	else{
    		return dataLocal;
    	}
    }; // initSerie


	$( function () {

		// --- onload routines
		readLocal();
		$(".recherche").on('click',function(e){
			e.preventDefault();
			$("#searchBar").slideDown().on('submit',recherche);
		});
		$('nav').on('click','a',checkPage);
		//checkPage();
	} );

}( jQuery ) );