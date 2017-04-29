/*
	 CloneJS - version beta 1.0 29/04/2017

	 Copyright (c) 2017, ABDALLAH Ismaile
	 All rights reserved.
	 Redistribution and use in source and binary forms, with or without
	 modification, are permitted provided that the following conditions are met:

	 * Redistributions of source code must retain the above copyright
	 notice, this list of conditions and the following disclaimer.
	 * Redistributions in binary form must reproduce the above copyright
	 notice, this list of conditions and the following disclaimer in the
	 documentation and/or other materials provided with the distribution.
	 * Neither the name of the University of California, Berkeley nor the
	 names of its contributors may be used to endorse or promote products
	 derived from this software without specific prior written permission.

	 THIS SOFTWARE IS PROVIDED BY THE REGENTS AND CONTRIBUTORS ``AS IS'' AND ANY
	 EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
	 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
	 DISCLAIMED. IN NO EVENT SHALL THE REGENTS AND CONTRIBUTORS BE LIABLE FOR ANY
	 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
	 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */



/**
 * split only last caratre
 * thank to stackoverflow :)
 * @param limiter
 * @param str
 * @returns {[*,*]}
 */
function splitLast(limiter,str){
	var rest = str.substring(0, str.lastIndexOf(limiter) + 1);
	var last = str.substring(str.lastIndexOf(limiter) + 1, str.length);
	return [rest,last];
}
/**
 *
 * @param thisID id  should be like foo_2
 * @param newIndex
 * @returns {*}
 */
function cloneID(thisID,newIndex){
	var newIdElt = splitLast('_',thisID)[0]+newIndex;
	return  newIdElt
}

/**
 *
 * @param thisName then name input should be like hebergements[0][commentaire_hebergement]
 * @param newIndex
 * @param oldIndex
 * @returns {string}
 * @constructor
 */
function CloneName(thisName,newIndex,oldIndex){
	thisNameArray = thisName.split('['+oldIndex+']')
	return thisNameArray[0]+'['+newIndex+']'+thisNameArray[1];
}



_EVENT_JS = ['onclick','oncontextmenu','ondblclick','onmousedown','onmouseenter','onmouseleave','onmousemove',
             'onmouseover','onmouseout','onmouseup','onkeydown','onkeypress','onkeyup','onabort','onbeforeunload',
             'onerror','onhashchange','onload','onpageshow','onpagehide','onresize','onscroll','onunload','onblur',
             'onchange','onfocus','onfocusin','onfocusout','oninput','oninvalid','onreset','onsearch','onselect',
             'onsubmit','ondrag','ondragend','ondragenter','ondragleave','ondragover','ondragstart','ondrop','oncopy','oncut','onpaste','onafterprint',
             'onafterprint','onbeforeprint','onabort','oncanplay','oncanplaythrough','ondurationchange','onemptied','onended','onerror','onloadeddata',
             'onloadedmetadata','onloadstart','onpause','onplay','onplaying','onprogress','onratechange','onseeked','onseeking',
             'onstalled','onsuspend','onsuspend','onvolumechange','onwaiting'];

_HTML_TAG = ['doctype','abbr','acronym','address','a','applet','area','b','base','basefont','bdo','bgsound','big','blink',
             'blockquote','body','br','button','caption','center','cite','code','col','colgroup','commment','dd','del','dfn',
             'dir','div','dl','dt','em','embed','fieldset','font','form','frame','frameset','h1','h2','h3','h4','h5','h6',
             'head','hr','html','i','iframe','img','input','ins','isindex','kbd','label','layer','legend','li','link','map',
             'marquee','menu','meta','nextid','nobr','noembed','noframes','noscript','object','ol','option','p','param','pre','q'
             ,'s','samp','script','select','small','span','strike','strong','style','sub','sup','table','tbody','td','textarea',
             'tfoot','th','thead','title','tr','tt','u','ul','var','wbr','xmp'];

function cloneMultiElement(clone,newIndex,oldId,arrayHTML_TAG){
	if(typeof arrayHTML_TAG != 'undefined' ){
        _HTML_TAG = arrayHTML_TAG;
	}

	clone.find('*').each(function(){
		if(this.id != ""){
			var  NewID =  cloneID(this.id,newIndex);
			for(var i =0 ; i<_EVENT_JS.length; i++){
				// update fonction  
				for(var j=0;j<_HTML_TAG.length;j++){
					eventJs = clone.find(_HTML_TAG[j]+'[id='+this.id+']').attr(_EVENT_JS[i]);
					if(typeof eventJs !== 'undefined'){
						clone.find(_HTML_TAG[j]+'[id='+this.id+']').attr(_EVENT_JS[i],CloneFonction(eventJs,newIndex,oldId));
					}
				}
			}
			clone.find('label[for='+this.id+']').attr('for',NewID); // les label for 
			this.id = NewID;
		}
		if(typeof this.name !== 'undefined'){
			if(this.name !=""){
				this.name= CloneName(this.name,newIndex,oldId); // les names 
			}
		}
	})
	
	clone.find("div.error-list").remove();
	clone.find("textarea.error").removeClass('error');
	clone.find("input.error").removeClass('error');
}


function CloneFonction(fonction,newIndex,oldIndex){
    if(typeof fonction !== 'undefined'){
        var retour =  "";
        if(fonction.indexOf(";") !== -1){ // si on trouve un ; alors plusieur fonctions
            var arrayParms = fonction.split(";");
            arrayParms.forEach(function(elt){
                if(elt != ""){
                    retour += CloneParaFonction(elt,newIndex,oldIndex)+";";
                }

            });
            retour = retour.slice(0,-1);
        }else{
            retour = CloneParaFonction(fonction,newIndex,oldIndex);
        }

        return retour;
    }
}



function CloneParaFonction(fonction,newIndex,oldIndex){
	
	var parametres = fonction.substring(fonction.indexOf("(")+1, fonction.indexOf(")") ) ; // récuprer la ou les parametre(s)
	var fonctionName = fonction.substring(0,fonction.indexOf("(")+1); // récupérer le nom de la fonction 
	
	var retour = "";
	if(parametres != ""){ // fonction sans parametre
		if(parametres.indexOf(",") !== -1){ // si plusieurs parametre alors on split sur la , 
			var arrayParams = parametres.split(',');
			arrayParams.forEach(function(elt){
				retour += updatePara(elt,newIndex,oldIndex)+","; 
				})
			 	retour = retour.slice(0,-1);
		}else{
			retour = updatePara(parametres,newIndex,oldIndex);
			
		}
	} 
	
	
	return fonctionName+retour+")"; // le retour c'est la concaténation  de non la fonction avec les nouveaux parametre et un ) pour fermer la fonction 
}


/** 
 * il faut impérativement lors du clone que les element doivent être séparer par un _ underscor e
 * exemple mon_id_element_101
 * @param str id must be separated by _ like foo_toto_1
 * @param newIndex
 * @param oldIndex
 * @returns 
 */
function updatePara(str,newIndex,oldIndex){
	if(str !=  "''"){ // attention pas touche '' pour lui c'est une string deux deux caratère
		if(str.indexOf("_") !== -1){ 
			return cloneID(str,newIndex)+'\''; // ps il est impossible d'avoir les meme id donc pour cloner il faut qu'il soit séparée par un underscore _
		}else{
			return newIndex; // si y a pas de underscore _ alors on déduit directement que c'est juste un id avec un chiffre donc on return le newIndex 
		}
	}else{
		return "''";
	}
	
}



