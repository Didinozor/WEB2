$(document).ready(function () {
    setInterval(()=>{
        for (let index = 0; index <= 6; index++) {
            let rand = Math.floor(Math.random()*100)
            // Modif du champ
            $("#temp"+index).text(rand);
            // Modification du temps par secondes
            $("#time"+index).text("Last update: "+new Date().toLocaleTimeString());
            
        }
    },1000)
    
});