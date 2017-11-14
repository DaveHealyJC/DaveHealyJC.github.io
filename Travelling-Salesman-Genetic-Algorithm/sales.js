//optimization: sort gen before adding to newgen in evolve?
//populations divisible by 3
//console.log(JSON.stringify(newFit));

(function() {
    var width;
    var height;
    var pop;
    var gen;
    var mutNum;
    var debugVar=false;
    var evoTimer;
    var genNum=0;
    var genField;
    var topField;
    var avgField;
    var pop;
    var mutNum;
    var speedField;
    var t0;
    var t1;
    var bestFitArr=[];
    var avgFitArr=[];
    var offset=0;
    var yAx;

    //////////////////////////////////////
    var locs=[];
    var topFitness=0;
    var homeCity=false;
    var bestWidth;
    var bestHeight;


    
    document.addEventListener('DOMContentLoaded', init, false);

    function init() {
        bestInGen =  document.getElementById('bestInGenCan');
        bestInGenCon =  bestInGen.getContext('2d');
        bestYet = document.getElementById('bestYetCan');
        bestWidth=bestYet.width;
        bestHeight=bestYet.height;
        bestYetCon = bestYet.getContext('2d');
        bestYetCon.strokeRect(0,0,bestWidth,bestHeight)
        graph = document.getElementById('graphCan');
        graphCon = graph.getContext('2d');

        bestYet.addEventListener("click", onClick, false);

        var popField=document.querySelector('.popField');
        var mutField=document.querySelector('.mutField');
        genField=document.querySelector('.genField');
        avgField=document.querySelector('.avgField');
        topField=document.querySelector('.topField');
        maxField=document.querySelector('.maxField');
        speedField=document.querySelector('.speedField');

        home=document.getElementById("home");//.checked = true;
        home.addEventListener("change", checkFunc, false);
        //var home=document.getElementById('box');
        //OP(home.clicked)



        var startBut=document.querySelector('.startBut');
        startBut.addEventListener('click', startFun);
        var resetBut=document.querySelector('.resetBut');
        resetBut.addEventListener('click', resetFun);

        function startFun(){
            pop=Number(popField.value);
            gen=firstGen(pop,genNum,[]);
            genNum=1;
            var speedVal=Number(speedField.value);
            mutNum=(Number(mutField.value))/100;
            evoTimer = window.setInterval(function () {       
                gen=evolve(gen,mutNum)}, speedVal);    
        }


        function resetFun(){
            bestFitArr=[];
            avgFitArr=[];
            genNum=0;
            clearInterval(evoTimer);     
            botContext.clearRect(0,0,width,height);
        }
    }

    function onClick(event){
        var x = event.x;
        var y = event.y;
        x -= bestYet.offsetLeft;
        y -= bestYet.offsetTop;
        if (home.checked){
            if(homeCity===false){
                homeCity=[x,y]
            }
            else{
                bestYetCon.clearRect(0,0,bestWidth,bestHeight)
                bestYetCon.strokeRect(0,0,bestWidth,bestHeight)
                for(var i=0;i<locs.length;i++){
                    bestYetCon.fillStyle='black';
                    bestYetCon.beginPath();
                    bestYetCon.arc(locs[i][0],locs[i][1],3,0,2*Math.PI);
                    bestYetCon.fill();
                    bestYetCon.fillStyle='red';
                }
                homeCity=[x,y]
            }

        }
        else{
            locs.push([x,y]);
        }
        bestYetCon.beginPath();
        bestYetCon.arc(x,y,3,0,2*Math.PI);
        bestYetCon.fill();
    }

    function checkFunc(event){
        if(home.checked){
            bestYetCon.fillStyle='red';
        }
        else{
            bestYetCon.fillStyle='black';
        }
    }

    
    function firstGen(pop,genNum,newGen) {

        var indiv;

        var genFinal=[];
        var bestFit=-1;
        var avgFit=0;
        var gen=[];
        //if(homeCity!==false){
        //    gen.push(homeCity)
        //}


        
        for (var i=0;i<pop;i++){
            if(genNum==0){
                gen.push(individual(genNum));
            }
            else{
                gen.push(individual(genNum,newGen[i]))
            }
            if(bestFit==-1){
                bestFit=0;
            }
            else{
                if(gen[i][0]<gen[bestFit][0]){
                    bestFit=i;
                }
            }
            avgFit+=gen[i][0]
        }
        avgFit=avgFit/pop;

        //sorting
        genFinal.push(gen[bestFit])
        gen.splice(bestFit,1)
        while (gen.length>0){
            bestFit=0;
            for (var i=1;i<gen.length;i++){
                if(gen[i][0]<gen[bestFit][0]){
                    bestFit=i;
                }
            }
            genFinal.push(gen[bestFit]);
            gen.splice(bestFit,1);
        }

        order=genFinal[0][1];
        bestInGenCon.clearRect(0, 0, bestInGen.width, bestInGen.height);
        for(var i=1; i<locs.length; i++) {
            bestInGenCon.beginPath();
            bestInGenCon.moveTo(locs[order[i-1]][0], locs[order[i-1]][1]);
            bestInGenCon.lineTo(locs[order[i]][0], locs[order[i]][1]);
            bestInGenCon.stroke();
        }
        if(genNum===0 || genFinal[0][0]<topFitness){
            topFitness=genFinal[0][0]
            bestYetCon.clearRect(0, 0, bestYet.width, bestYet.height)
            for(var i=1; i<locs.length; i++) {
                bestYetCon.beginPath();
                bestYetCon.moveTo(locs[order[i-1]][0], locs[order[i-1]][1]);
                bestYetCon.lineTo(locs[order[i]][0], locs[order[i]][1]);
                bestYetCon.stroke();
            }
        }

        genField.textContent=('Generation:   '+String(genNum))
        avgField.textContent=('avgFitness:   '+String(avgFit));
        topField.textContent=('topFitness:   '+String(genFinal[bestFit][0]));

        for(var i=0;i<locs.length;i++){
            bestYetCon.beginPath();
            bestYetCon.arc(locs[i][0],locs[i][1],3,0,2*Math.PI);
            bestYetCon.fill();
        }

        return genFinal;
        
    }

    function individual(genId,indiv){
        var order=[];
        var locsTmp=[];
        var fitness=0;
        for(var i=0;i<locs.length;i++){
            locsTmp.push(i);
        }
        for (i=0;i<locs.length;i++){
            if(genNum==0){
                var ind=getRandomNumber(0, locsTmp.length-1)
                order.push(locsTmp[ind])
                locsTmp.splice(ind,1)
            }
            else{
                order.push(indiv[i])
            }
            if(i!=0){
                var ind1=order[i];
                var ind0=order[i-1];
                fitness+=Math.sqrt(Math.pow((locs[ind0][0]-locs[ind1][0]),2)+Math.pow(((locs[ind0][1]-locs[ind1][1])),2))
            }
        }          
        return [fitness,order];
    }








    function evolve(gen,mutNum){
        //resetting fillstyle
        bestYetCon.fillStyle='black'
        genNum++;
        var repeat;
        var newGenFin=[];

        newGen=gen.slice(0,Math.round(gen.length/2));
        //at this point we have enough fitness values

        newGenCross=[]
        for (i=0;i<2;i++){
            for (var iCross=0;iCross<newGen.length;iCross++){
                while (true){
                    var jCross=getRandomNumber(0, newGen.length-1);
                    if (jCross!==iCross){
                        break;
                    }
                }
                child=crossover(newGen[iCross][1],newGen[jCross][1],mutNum);
                newGenCross.push(child);  
            }
        }

        gen=firstGen(pop,genNum,newGenCross)



        return gen;
    }


    function crossover(p1,p2,mutNum){
        //var child=crossover([0,1,2,3,4,5],[4,1,5,3,0,2],0)
        var p1Ind;
        var p1Len;
        var child=[];
        var poss=[];
        var possInd;
        for(var i=0;i<p1.length;i++){
            child.push(-1);
            poss.push(i);
        }
        //select an ind from p1
        //     [0,1,2,3,4,5,6,7,8]
        p1Ind=getRandomNumber(0, p1.length-1);


        for(var i=p1Ind;i<p1.length;i++){
            child[i]=p1[i];
            poss.splice(poss.indexOf(p1[i]),1);
        }


        for(var i=0;i<child.length;i++){
            if(child[i]==-1 && (!inArray(p2[i],child,'sing'))){
                child[i]=p2[i]
                poss.splice(poss.indexOf(p2[i]),1);
            }
        }

        while(poss.length>0){
            possInd=getRandomNumber(0, poss.length-1);
            child[child.indexOf(-1)]=poss[possInd];
            poss.splice(possInd,1);
        }

        //mutating
        for (var i=0;i<locs.length;i++){
            var mutCheck=Math.random();
            if (mutCheck<mutNum){
                while(true){
                    var mutSwap=getRandomNumber(0, child.length-1);
                    if(mutSwap!=i){
                        break
                    }
                }
                var mutTmp=child[i];
                child[i]=child[mutSwap];
                child[mutSwap]=mutTmp;
            }
        }
        return child;

    }


    function inArray(smallArray,bigArray,sing){
        var iInArr
        var jInArr
        var inFlag=true
        if(sing==='sing'){
            for(iInArr = 0; iInArr < bigArray.length; iInArr++){
                if (smallArray===bigArray[iInArr]){
                    return true
                }
            }
            return false
        }
        for(iInArr = 0; iInArr < bigArray.length; iInArr++){
            if(smallArray.length === bigArray[iInArr].length){ 
                if ((smallArray[0] === bigArray[iInArr][0])&&(smallArray[1] === bigArray[iInArr][1])){
                    return true
                }
            }
        }
        return false;
    }


    function getRandomNumber(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    function OP(a){
        console.log(JSON.stringify(a));

    }
    
   
    
})();




