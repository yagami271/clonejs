/**
 * Created by yagami on 29/04/2017.
 */


function toogleIcone(elt){
    alert(elt);
}

function couleurIcone(elt){
    alert(elt)
}

function testFunction(id){
    alert(id)
}

function multiParametres(elt1,elt2){
    alert(elt1)
    alert(elt2)
}


function ajouterHebergement(){
    //get the nb element
    var arrayHTMLTag = ['input','a']; // you must give array of html Tag where your function javasript are, for exemple input,a,select,div...etc
    var oldId = parseInt($('#hebergements_multi>div:last').prop('id').split('_')[1]);
    // get the new id of the cloned element
    var newIndex = oldId+1;
    // clone and delete all input value
    var clone = $('#hebergement_'+oldId).clone().find('input').val("").end();
    // delete value of textarea if exist
    clone = clone.find('textarea').val("").end()
    // update new id of the new element (the big div that contain all your inputs)
    clone.removeAttr("id").uniqueId().attr("id" , "hebergement_"+newIndex)

    //clone ids, names, fonctions
    cloneMultiElement(clone,newIndex,oldId,arrayHTMLTag);

    // ADD EXCEPTION
    // this part it depend to your code
    clone.find("h2[id=name_hebergement_"+newIndex+']').text('hebergement '+(newIndex+1));
    clone.find("a.black-text").removeClass("black-text").addClass("grey-text");
    $('#hebergements_multi').append(clone)
    //if you have datepicker ou or an autocomplte you must instant it after insert in dom
    //generate instance like datepicker autocomplte place ...etc
    // here you generate instanace of datapicker ou autocomplte :)
}