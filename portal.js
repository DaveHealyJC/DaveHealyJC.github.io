//notepad

//end button (play again)

//comment out cgitb.enable when done



(function() {


    var gloBool;
    var globalCon;
    var timeBool=null;
    var width;
    var height;
    var playInterval;
    var res;
    var i;
    var j;
    var mapCanvas;
    var mapContext;
    //length of diagonal line from corner to corner on map
    var mapDiag = Math.sqrt(Math.pow(150,2)+Math.pow(150,2));
    //array of all keys currently pressed
    var keysPressed=[];
    var fadeBool=false;
    var fadePerc=100
    var fadeCount=0

    //The following object contains information about the different types of blocks and methods which take point
    //modifiers as inputs while the player is moving and return true or false depending on what type of block it is
    //testing collision for 
    var bInfo={
        impassableArr:[0,6],
        freeFromAboveArr:[1,2,3,4,5],
        retBool:false,
        wall : function(y,x,elevation){
            bInfo.retBool=false
            if (bInfo.impassableArr.indexOf(room[elevation].map[Math.floor(p.y+y)][Math.floor(p.x+x)])!==-1){
                bInfo.retBool = true;
            }
            if (elevation<room.length-1 && (room[elevation].map[Math.floor(p.y)][Math.floor(p.x)]===2 || room[elevation].map[Math.floor(p.y)][Math.floor(p.x)]===3) && bInfo.impassableArr.indexOf(room[elevation].map[Math.floor(p.y+y)][Math.floor(p.x+x)])!==-1 && Math.floor(p.y)===Math.floor(p.y+y)){
                bInfo.retBool = false;
            }
            return bInfo.retBool;
        },
        pit : function(y,x,elevation){
            bInfo.retBool=false
            if (elevation>=1 && bInfo.freeFromAboveArr.indexOf(room[elevation-1].map[Math.floor(p.y+y)][Math.floor(p.x+x)])!==-1){
                bInfo.retBool = true
            }
            if(elevation>=1 && (room[elevation-1].map[Math.floor(p.y+y)][Math.floor(p.x+x)]===2 || room[elevation-1].map[Math.floor(p.y+y)][Math.floor(p.x+x)]===3) && Math.floor(p.y)===Math.floor(p.y+y)){
                bInfo.retBool = false
            }
            return bInfo.retBool;
        }
    }

	
	
	
	
	
	
    

    
    document.addEventListener('DOMContentLoaded', init, false);

    function init() {

        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        mapCanvas = document.getElementById('map');
        mapContext = mapCanvas.getContext('2d');
        mapContext.fillStyle = 'black';
        context.lineWidth=1;
        floorBranch(keysPressed,resumeBool)
        playInterval=setInterval(function(){floorBranch(keysPressed,resumeBool)}, 33);



    }
    
    
    document.addEventListener('keydown', function(kDown) {
        if (!(inArray(kDown.keyCode,keysPressed,'sing'))){
            keysPressed.push(kDown.keyCode);
        }
    });



/////////////////////////////////////////////////////

    document.addEventListener('keyup', function(kUp) {
        var index=keysPressed.indexOf(kUp.keyCode);
        if (index>-1) {
            keysPressed.splice(index,1);
        }
    });







    function floorBranch(key,resumeBool){
        //executed every 33ms. sets new position and direction and then calls the draw function
        //for each floor
        var intPts=pointAhead();
        OP(intPts);
        if (resumeBool){
        if (key.length===0){
            globalCon=false;
        }
        else{
            globalCon=true;
        }

        pElev=Math.floor(p.elevation);
        room[pElev].warp(p.pos,pElev);
        pElev=Math.floor(p.elevation);
        var floor=room[pElev].map;
        var floorDown;
        var closeFlag=false;
        var floorIter;
        var yMod
        var yC
        var xMod
        var xC
        if(pElev>=1){
            floorDown=room[pElev-1].map;
        }
        else{
            floorDown=room[pElev].map;

        }
        context.clearRect(0, 0, width, height); 
        context.fillStyle = fadeBlack('00','00','CD');                         //'DarkTurquoise';//00 CE D1
        context.fillRect(0, 0, width, height/2);
        context.fillStyle = fadeBlack('7C','FC','00');  'LawnGreen';//7C FC 00
        context.fillRect(0, height/2, width, height/2);
        mapContext.beginPath();
        mapContext.moveTo(0,0);
        mapContext.lineTo(0,height);
        mapContext.lineTo(width,height);
        mapContext.lineTo(width,0);
        mapContext.stroke();


        //This if/else alters the players elevation if they are standing on a ramp(which is '2' on the 2d array maps)
        //Their elevation is increased or decreased depending on how far along the ramp they are. i.e. if elevation
        //started at 2 and they are 40% along a ramp leading to elevation 3, their elevation will be 2.4
        if (floor[Math.floor(p.y)][Math.floor(p.x)]===2){
            p.elevation=Math.floor(p.elevation)+p.x-Math.floor(p.x);
        }
        else if(floorDown[Math.floor(p.y)][Math.floor(p.x)]===2){
            p.elevation=p.elevation-1+p.x-Math.floor(p.x);

        }
        else if(floor[Math.floor(p.y)][Math.floor(p.x)]===3){
            p.elevation=Math.floor(p.elevation)+Math.ceil(p.x)-p.x;

        }
        else if(floorDown[Math.floor(p.y)][Math.floor(p.x)]===3){
            p.elevation=p.elevation-1+Math.ceil(p.x)-p.x;
        }
        else{
            p.elevation=Math.round(p.elevation);
        }    


        //65('a') and 68('d') change direction
        if (inArray(65,keysPressed,'sing')){
            p.dir=modAr(p.dir+(Math.PI/33));
        }
        if (inArray(68,keysPressed,'sing')){
            p.dir=modAr(p.dir-(Math.PI/33));
        }
        //There was a bug where due to internal rounding errors, instead of hitting 0 degrees after a full
        //revolution, it would sometimes end up on 359.99999... which led to some strange bugs. This following
        //if statement pushes p.dir to 360 (0 after modular arithmetic) if it goes above 6.28 radians (~359.8 degrees).
        //As the turns are in steps of pi/33 (around 5.5 degrees) this won't "skip" any turn frames
        if (p.dir>6.28){
            p.dir=0;
        }
        if((toDegrees(p.dir)%90)<0.5 || (toDegrees(p.dir)%90)>89.5){
            p.dir=toRadians(toDegrees(p.dir)+1);
        }
        p.slope=math.tan(p.dir)





        // 87 is 'w' for move forward. If the player collides with an impassable surface like a wall
        //then the player loses velocity in the x/y direction (whichever direction the wall is located in) but
        //retains velocity in the other direction and "slides" along the wall.
        //'s', 'a' and 'd' also make use of this sliding mechanic
        if (inArray(87,keysPressed,'sing')){
            yMod=-0.1*Math.sin(p.dir)
            yC=-0.15*Math.sin(p.dir)
            xMod=0.1*Math.cos(p.dir)
            xC=0.15*Math.cos(p.dir)

            if(!bInfo.wall(yC,0,pElev) && !bInfo.pit(yC,0,pElev)){
                    p.y=p.y+yMod;
                }
            if(!bInfo.wall(0,xC,pElev)&& !bInfo.pit(0,xC,pElev)){
                    p.x=p.x+xMod;
            }
            p.pos=[p.y,p.x];
        }

        //83 is 's' for backward move
        if (inArray(83,keysPressed,'sing')){
            yMod=0.1*Math.sin(p.dir)
            yC=0.15*Math.sin(p.dir)
            xMod=-0.1*Math.cos(p.dir)
            xC=-0.15*Math.cos(p.dir)

            if(!bInfo.wall(yC,0,pElev) && !bInfo.pit(yC,0,pElev)){
                    p.y=p.y+yMod;
                }
            if(!bInfo.wall(0,xC,pElev)&& !bInfo.pit(0,xC,pElev)){
                    p.x=p.x+xMod;
            }
            p.pos=[p.y,p.x];
        }


        //69 is 'e' for right strafe
        if (inArray(69,keysPressed,'sing')){
            yMod=0.1*Math.sin(modAr(p.dir+Math.PI/2))
            yC=0.15*Math.sin(modAr(p.dir+Math.PI/2))
            xMod=-0.1*Math.cos(modAr(p.dir+Math.PI/2))
            xC=-0.15*Math.cos(modAr(p.dir+Math.PI/2))

            if(!bInfo.wall(yC,0,pElev) && !bInfo.pit(yC,0,pElev)){
                    p.y=p.y+yMod;
                }
            if(!bInfo.wall(0,xC,pElev)&& !bInfo.pit(0,xC,pElev)){
                    p.x=p.x+xMod;
            }
            p.pos=[p.y,p.x];
        }

        //81 is 'q' for left strafe
        if (inArray(81,keysPressed,'sing')){
            yMod=0.1*Math.sin(modAr(p.dir-Math.PI/2))
            yC=0.15*Math.sin(modAr(p.dir-Math.PI/2))
            xMod=-0.1*Math.cos(modAr(p.dir-Math.PI/2))
            xC=-0.15*Math.cos(modAr(p.dir-Math.PI/2))

            if(!bInfo.wall(yC,0,pElev) && !bInfo.pit(yC,0,pElev)){
                    p.y=p.y+yMod;
                }
            if(!bInfo.wall(0,xC,pElev)&& !bInfo.pit(0,xC,pElev)){
                    p.x=p.x+xMod;
            }
            p.pos=[p.y,p.x];
        }


        if (inArray(76,keysPressed,'sing')){
            if (room===mazeRoom && (p.elevation===0 || p.elevation===1)){
                p.x=2.5
                p.y=2.5
                p.dir=0
                p.elevation=0;
                p.pos=[p.y,p.x]

            }
            if (room===anteRoom){
                p.x=13.5;
                p.y=24.5;
                p.dir=Math.PI/2;
                p.pos=[p.y,p.x];
                p.elevation=4;
                room=towerRoom;
                gameSizeJ=room[0].map.length;
                gameSizeI=room[0].map[0].length;

            }
            if (room===towerRoom && p.elevation===4 && p.y<23.5){
                p.y=6.5
                p.x=13.5
                p.dir=Math.PI/2
                p.pos=[p.y,p.x]
            }
        }


		


		//if the player is so close to a wall that they can only see that wall and coordinates inside that block,
        //the screen is cleared. 
        //This is necessary because when neither near corner of a block can be seen, it cannot (or is very difficult to be) be drawn. The user will
        //not know that the screen has simply been cleared as they will believe that they only see white because the 
        //wall is filling the screen.
        //when closeFlag is true, the other drawing functions will be skipped
		var slopeLeft=-(Math.tan(modAr(p.dir+Math.PI/4)));
		var slopeRight=-(Math.tan(modAr(p.dir-Math.PI/4)));
        if(p.dir>=Math.PI/4 && p.dir<3*Math.PI/4 && floor[Math.floor(p.y)-1][Math.floor(p.x)]===0){
			xInt0=(Math.floor(p.y)-p.y)/slopeLeft+p.x;
			xInt0=trigCorrect(xInt0);
			xInt1=(Math.floor(p.y)-p.y)/slopeRight+p.x;
			xInt1=trigCorrect(xInt1);
			if (Math.floor(xInt0)===Math.floor(xInt1)){
				context.fillStyle=fadeBlack('FF','FF','FF');
                context.fillRect(0,0,width,height);
				updateMap(floor);
				closeFlag=true;
			}
				
		}
		else if(p.dir>=3*Math.PI/4 && p.dir<5*Math.PI/4 && floor[Math.floor(p.y)][Math.floor(p.x)-1]===0){
			yInt0=(Math.floor(p.x)-p.x)*slopeLeft+p.y;
			yInt0=trigCorrect(yInt0);
			yInt1=(Math.floor(p.x)-p.x)*slopeRight+p.y;
			yInt1=trigCorrect(yInt1);
			if (Math.floor(yInt0)===Math.floor(yInt1)){
				context.fillStyle=fadeBlack('FF','FF','FF');
                context.fillRect(0,0,width,height);
				updateMap(floor);				
				closeFlag=true;
			}
		}
		else if(p.dir>=5*Math.PI/4 && p.dir<7*Math.PI/4 && floor[Math.ceil(p.y)][Math.floor(p.x)]===0){
			xInt0=(Math.ceil(p.y)-p.y)/slopeLeft+p.x;
			xInt0=trigCorrect(xInt0);
			xInt1=(Math.ceil(p.y)-p.y)/slopeRight+p.x;
			xInt1=trigCorrect(xInt1);
			if (Math.floor(xInt0)===Math.floor(xInt1)){
				context.fillStyle=fadeBlack('FF','FF','FF');
                context.fillRect(0,0,width,height);
				updateMap(floor);
				closeFlag=true;
			}
				
		}
		else if((p.dir>=7*Math.PI/4 || p.dir<1*Math.PI/4) && floor[Math.floor(p.y)][Math.ceil(p.x)]===0 && floor[Math.floor(p.y)][Math.floor(p.x)]!==2){ //rampclose
			yInt0=(Math.ceil(p.x)-p.x)*slopeLeft+p.y;
			yInt0=trigCorrect(yInt0);
			yInt1=(Math.ceil(p.x)-p.x)*slopeRight+p.y;
			yInt1=trigCorrect(yInt1);
			if (Math.floor(yInt0)===Math.floor(yInt1)){
				context.fillStyle=fadeBlack('FF','FF','FF');
                context.fillRect(0,0,width,height);
				updateMap(floor);
				closeFlag=true;
			}
		}
	


        //This if statement and nested for loops iterate through the floors drawing them one by one.
        //Starts with further floors and ends with the player's current floor
        //starts with the highest floor which the player is not on and decrements floors until
        //the floor directly above the player is reached.
        //then it goes to the lowest floor the player is not on and iterates to the player's floor
        //with p=player elevation and n=total floors: n, n-1, n-1, ... p+2, p+1, 0, 1, 2, ... p-1, p.
        //map is updated after final floor is drawn and displays the floor the player is on
		if(!(closeFlag)){
            for(floorIter=room.length-1;floorIter>Math.round(p.elevation);floorIter--){
                draw(room[floorIter].map,room[floorIter].elevation);
            }
            for(floorIter=0;floorIter<=Math.round(p.elevation);floorIter++){
                draw(room[floorIter].map,room[floorIter].elevation);
            }
            updateMap(room[Math.floor(p.elevation)].map);
		}
    }

    }



    function draw(floor,elevation){
        //Does the drawing for each floor
        gloBool=false

        var fDist=(elevation-p.elevation)
        var perpDist
        var x=1;
        var y=1;
        var pointList=[]
        var distList=[]
        var lineList=[]
        var iLine
        var floorList=[]
        var cornerList=[]
		var rampList=[]
        //var pointCheck
        //populate pointList and distList. list of visable points and their perpendicular distances
        for (j=1;j<gameSizeJ;j++){
            for (i=1;i<gameSizeI;i++){
                if (pointVisible([j,i])){
                    pointList.push([j,i])
                    distList.push(perpDistance([j,i]))
                }
            }
        }


        //populate lineList
        for (j=1;j<gameSizeJ-1;j++){
            for (i=1;i<gameSizeI-1;i++){
                if (pti(0,0)!==1 && (inArray([j,i],pointList)||inArray([j+1,i],pointList)||inArray([j,i+1],pointList)||inArray([j+1,i+1],pointList))){
                    //if a block has at least one point in vision
                    if (pti(0,0)===0 && pti(y,0)!==0 && p.pos[0]>j+1){
                        if(ptv(y,0)!=ptv(y,x)){
                            if(inArray([j+1,i],pointList)){
                                lineList.push([[j+1,i],partial([j+1,i],[j+1,i+1])])

                            }
                            else{
                                lineList.push([[j+1,i+1],partial([j+1,i+1],[j+1,i])])
                            }                             
                        }

                        else if (ptv(y,0)===ptv(y,x) && ptv(y,0) ===true){
                            if (perpDistance([j+1,i])>perpDistance([j+1,i+1])){
                                lineList.push([[j+1,i],[j+1,i+1]])
                            }
                            else{
                                lineList.push([[j+1,i+1],[j+1,i]])
                            }
                        }
                    }
                    if (pti(0,0)===0 && pti(0,x)!==0 && p.pos[1]>i+1){
                        if(ptv(0,x)!=ptv(y,x)){

                            if (inArray([j,i+1],pointList)){
                                lineList.push([[j,i+1],partial([j,i+1],[j+1,i+1])])
                            }
                            else{
                                lineList.push([[j+1,i+1],partial([j+1,i+1],[j,i+1])])
                            }

                        }
                        else if (ptv(0,x)===ptv(y,x) && ptv(0,x) ===true){
                            if (perpDistance([j,i+1])>perpDistance([j+1,i+1])){
                                lineList.push([[j,i+1],[j+1,i+1]])
                            }
                            else{
                                lineList.push([[j+1,i+1],[j,i+1]])
                            }
                        }
                        
                    }

                    if (pti(0,0)===0 && pti(-y,0)!==0 && p.pos[0]<j){
                        if(ptv(0,0)!=ptv(0,x)){
                            if (inArray([j,i],pointList)){
                                lineList.push([[j,i],partial([j,i],[j,i+1])])
                            }
                            else{
                                lineList.push([[j,i+1],partial([j,i+1],[j,i])])
                            }
                        }
                        else if (ptv(0,0)===ptv(0,x) && ptv(0,0)===true){
                        
                        if (perpDistance([j,i])>perpDistance([j,i+1])){
                                lineList.push([[j,i],[j,i+1]])
                            }
                            else{
                                lineList.push([[j,i+1],[j,i]])
                            }
                        
                        }
                    }

                    if (pti(0,0)===0 && pti(0,-x)!==0 && p.pos[1]<i){
                        if(ptv(0,0)!=ptv(y,0)){
                            if (inArray([j,i],pointList)){
                                lineList.push([[j,i],partial([j,i],[j+1,i])])

                            }
                            else{
                                lineList.push([[j+1,i],partial([j+1,i],[j,i])])
                            }
                        }
                        else if (ptv(0,0)===ptv(y,0) && ptv(0,0) ===true){
                        
                            if (perpDistance([j,i])>perpDistance([j+1,i])){
                                    lineList.push([[j,i],[j+1,i]])
                                }
                                else{
                                    lineList.push([[j+1,i],[j,i]])
                                }
                        }
                    }


                    //ceilings and floors     //>0.5?
                    if (pti(0,0)===0 && fDist>0.5){
                        if (room[elevation-1].map[j][i]!==0){
                            if (!(inArray([j,i],pointList))){
                                pointList.push([j,i])
                                distList.push(perpDistance([j,i]))
                            }
                            lineList.push([[j,i],'ceiling'])
                        }
                    }


                    if (ptiW(0,0) && fDist<-0.5){
                        if (room[elevation+1].map[j][i]!==0){
                            if (!(inArray([j,i],pointList))){
                                pointList.push([j,i])
                                distList.push(perpDistance([j,i]))
                            }
                            lineList.push([[j,i],'floor'])
                        }
                    }
                    

                    //corners
                    if(pti(0,0)===0 && (pti(-y,0)===0 && pti(0,-x)===0)||(pti(-y,0)!==0 && pti(0,-x)!==0)){
                        cornerList.push([j,i])
                    }
                    if(pti(0,0)===0 && (pti(-y,0)===0 && pti(0,x)===0)||(pti(-y,0)!==0 && pti(0,x)!==0)){
                        cornerList.push([j,i+1])
                    }
                    if(pti(0,0)===0 && (pti(y,0)===0 && pti(0,-x)===0)||(pti(y,0)!==0 && pti(0,-x)!==0)){
                        cornerList.push([j+1,i])
                    }
                    if(pti(0,0)===0 && (pti(y,0)===0 && pti(0,x)===0)||(pti(y,0)!==0 && pti(0,x)!==0)){
                        cornerList.push([j+1,i+1])
                    }




                    // RAMPS
                    if (pti(0,0)>=2 && pti(0,0)<=5){
                        if (!(inArray([j,i],pointList))){
                                pointList.push([j,i])
                                distList.push(perpDistance([j,i]))
                            }
                            if(pti(0,0)===2){
                                lineList.push([[j,i],'ramp',2])

                            }
                            if(pti(0,0)===3){
                                lineList.push([[j,i],'ramp',3])

                            }
                            if(pti(0,0)===4){
                                lineList.push([[j,i],'ramp',4])

                            }
                            if(pti(0,0)===5){
                                lineList.push([[j,i],'ramp',5])

                            }
                    }
                }
            }
        }
        




        for (iSweep=0;iSweep<distList.length;iSweep++){
            ptIndex=maxIndex(distList);
            pointCheck=pointList[ptIndex];
            for (iLine=0;iLine<lineList.length;iLine++){
                if (lineList[iLine][0][0]===pointCheck[0] && lineList[iLine][0][1]===pointCheck[1]){
					//floor
                    if (lineList[iLine][1]==='floor'){
                        floorList.push([pointCheck,fDist,'floor',0])
                    }
                    //ceiling
                    else if (lineList[iLine][1]==='ceiling'){
                        floorList.push([pointCheck,fDist,'ceiling',0])
                    }
					//do ramps now if p.elevation is round (not between floors). Do it later if between floors so
					//that ramps are then drawn last
                    else if (lineList[iLine][1]==='ramp' && Math.floor(p.elevation)===p.elevation){
                        lineOnFloor(pointCheck,fDist,'ramp',elevation,lineList[iLine][2])

                    }
					else if(lineList[iLine][1]==='ramp' && Math.floor(p.elevation)!==p.elevation){
                        lineOnFloor(pointCheck,fDist,'ramp',elevation,lineList[iLine][2])
						//rampList=[pointCheck,fDist,'ramp',elevation,lineList[iLine][2]] uses if below
						}
                    //normal wall
                    else{
                        point1=lineList[iLine][0]
                        point2=lineList[iLine][1]
                        lineFromTo(point1,point2,cornerList,fDist,elevation)
                    }
                }
            }


            distList[ptIndex]=-5
        }

        for (iSweep=0;iSweep<floorList.length;iSweep++){
            lineOnFloor(floorList[iSweep][0],floorList[iSweep][1],floorList[iSweep][2],elevation,floorList[iSweep][3])
        }


        


        function pti(y,x){
            //Takes the y and x modifiers of a point and returns the modified point's value in 'floor'
            var yChange=j+y
            var xChange=i+x
            return floor[yChange][xChange]
        }

        //funptiw
        function ptiW(y,x){
            //Takes the y and x modifiers of a point and returns the modified point's value in 'floor'
            var yChange=j+y
            var xChange=i+x
            return floor[yChange][xChange]===0 || floor[yChange][xChange]===6
        }

        function ptv(y,x){
            //Takes the y and x modifiers of a point and returns true if the point is in vision and false otherwise
            yChange=j+y
            xChange=i+x
            point=angleAround([yChange,xChange])+Math.PI*2
            return Math.acos(Math.cos(p.dir)*Math.cos(point) + Math.sin(p.dir)*Math.sin(point)) <= Math.PI/4
        }
    }

    //funpartial
    function partial(pt1,pt2){
        if (pointVisible(pt1)&& pointVisible(pt2)){
            return(pt2)
        }

        var slopeLeft=-(Math.tan(modAr(p.dir+Math.PI/4)))
        var slopeRight=-(Math.tan(modAr(p.dir-Math.PI/4)))
        slopeLeft=trigCorrect(slopeLeft,'ang')
        slopeRight=trigCorrect(slopeRight,'ang')

        var xInt0
        var xInt0In=false
        var xInt1
        var xInt1In=false
        var yInt0
        var yInt0In=false
        var yInt1
        var yInt1In=false
        //lEqn=(i-p.y)/slope+p.x
       if(pt1[0]===pt2[0]){
            xInt0=(pt1[0]-p.y)/slopeLeft+p.x
            xInt0=trigCorrect(xInt0)
            xInt1=(pt1[0]-p.y)/slopeRight+p.x
            xInt1=trigCorrect(xInt1)
            if ((xInt0>= Math.min(pt1[1],pt2[1]))&&(xInt0<=Math.max(pt1[1],pt2[1]))){
                xInt0In=true
            }
            if ((xInt1>= Math.min(pt1[1],pt2[1]))&&(xInt1<=Math.max(pt1[1],pt2[1]))){
                xInt1In=true
            }
            if(xInt0In && !(xInt1In)){
                return [pt1[0],xInt0]
            }
            if(!(xInt0In) && xInt1In){
                return [pt1[0],xInt1]
            }
            
            if(xInt0In && xInt1In){
				if(p.dir>Math.PI/2 && p.dir <(3*Math.PI/2)){
					return [pt1[0],Math.min(xInt0,xInt1)]
				}
				else{
					return [pt1[0],Math.max(xInt0,xInt1)]
				}
            }
        }





        else{
            yInt0=(pt1[1]-p.x)*slopeLeft+p.y
            yInt0=trigCorrect(yInt0)
            yInt1=(pt1[1]-p.x)*slopeRight+p.y
            yInt1=trigCorrect(yInt1)
            if ((yInt0>= Math.min(pt1[0],pt2[0]))&&(yInt0<=Math.max(pt1[0],pt2[0]))){
                yInt0In=true
            }
            if ((yInt1>= Math.min(pt1[0],pt2[0]))&&(yInt1<=Math.max(pt1[0],pt2[0]))){
                yInt1In=true
            }
            if(yInt0In && !(yInt1In)){
                return [yInt0,pt1[1]]
            }
            if(!(yInt0In) && yInt1In){
                return [yInt1,pt1[1]]
            }
			
			
			
            if(yInt0In && yInt1In){
                if(p.dir>0 && p.dir <(Math.PI)){
					return [Math.min(yInt0,yInt1),pt1[1]]
				}
				else{
					return [Math.max(yInt0,yInt1),pt1[1]]
				}
            }
        }
        return(pt2)
    }

    //funtrigCorrect    
    function trigCorrect(val,type){
        if (type==='ang'){
            val=toDegrees(val)
        }
        if (val>Math.floor(val) && val<Math.floor(val)+0.0001){
            val=(Math.floor(val))
        }
        if (val<Math.ceil(val) && val>Math.ceil(val)-0.0001){
            val=(Math.ceil(val))
        }
        if (type==='ang'){
            return toRadians(val)
        }
        return val

    }


    //funlineFromTo
    function lineFromTo(point1,point2,cornerList,fDist,elevation){
        var j1=point1[0]
        var i1=point1[1]
        var j2=point2[0]
        var i2=point2[1]
        var outerCheck
        var innerCheck
        var jMin=Math.floor(Math.min(j1,j2))
        var iMin=Math.floor(Math.min(i1,i2))
        if (typeof point1==='object'){
            point1=cornerLineCoords(point1,fDist)
            point2=cornerLineCoords(point2,fDist)
        }
        var point1Y1=point1[0]
        var point1Y2=point1[1]
        var point2Y1=point2[0]
        var point2Y2=point2[1]
        var point1X=point1[2]
        var point2X=point2[2]

        //hide                   placeholdermod
        context.fillStyle=fadeBlack('FF','FF','FF');
        context.beginPath();
        context.moveTo(point1X, point1Y1);
        context.lineTo(point1X, point1Y2);
        context.lineTo(point2X, point2Y2);
        context.lineTo(point2X, point2Y1);
        context.closePath();
        context.fill();
        
        //top  
        if(elevation===room.length-1 || (room[elevation].map[jMin][iMin]===0 && room[elevation+1].map[jMin][iMin]===1)){
            context.beginPath();
            context.moveTo(point1X, point1Y1);
            context.lineTo(point2X, point2Y1);
            context.stroke();
        }
        
        //tops from positive j
        
        if (elevation!==room.length-1 && p.pos[0]>jMin && j1===j2){
            outerCheck=room[elevation].map[jMin-1][iMin]===0 && room[elevation+1].map[jMin-1][iMin]===1
            innerCheck=room[elevation].map[jMin-1][iMin]===0 && room[elevation+1].map[jMin][iMin]===0
            if(outerCheck||innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y1);
                context.lineTo(point2X, point2Y1);
                context.stroke();
            }
        }
        //tops from negative j
        else if (elevation!==room.length-1 && p.pos[0]<jMin && j1===j2){
            innerCheck=room[elevation].map[jMin][iMin]===0 && room[elevation+1].map[jMin-1][iMin]===0
            if(innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y1);
                context.lineTo(point2X, point2Y1);
                context.stroke();
            }
        }


        //tops from positive i
        if (elevation!==room.length-1 && p.pos[1]>iMin && i1===i2){
            outerCheck=room[elevation].map[jMin][iMin-1]===0 && room[elevation+1].map[jMin][iMin-1]===1
            innerCheck=room[elevation].map[jMin][iMin-1]===0 && room[elevation+1].map[jMin][iMin]===0
            if(outerCheck||innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y1);
                context.lineTo(point2X, point2Y1);
                context.stroke();
            }
        }
        //tops from negative i
        else if (elevation!==room.length-1 && p.pos[1]<iMin && i1===i2){
            innerCheck=room[elevation].map[jMin][iMin]===0 && room[elevation+1].map[jMin][iMin-1]===0
            if(innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y1);
                context.lineTo(point2X, point2Y1);
                context.stroke();
            }
        }
        
        //bottom
        if(elevation===0 || (room[elevation].map[jMin][iMin]===0 && room[elevation-1].map[jMin][iMin]===1)){
            context.beginPath();
            context.moveTo(point1X, point1Y2);
            context.lineTo(point2X, point2Y2);
            context.stroke();
        }  
        
        //bottom from positive j
        if (elevation!==0 && p.pos[0]>jMin && j1===j2){
            outerCheck=room[elevation].map[jMin-1][iMin]===0 && room[elevation-1].map[jMin-1][iMin]===1
            innerCheck=room[elevation].map[jMin-1][iMin]===0 && room[elevation-1].map[jMin][iMin]===0
            if(outerCheck||innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y2);
                context.lineTo(point2X, point2Y2);
                context.stroke();
            }
        }
        //bottom from negative j
        else if (elevation!==0 && p.pos[0]<jMin && j1===j2){
            innerCheck=room[elevation].map[jMin][iMin]===0 && room[elevation-1].map[jMin-1][iMin]===0
            if(innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y2);
                context.lineTo(point2X, point2Y2);
                context.stroke();
            }
        }
        //bottom from positive i
        if (elevation!==0 && p.pos[1]>iMin && i1===i2){
            outerCheck=room[elevation].map[jMin][iMin-1]===0 && room[elevation-1].map[jMin][iMin-1]===1
            innerCheck=room[elevation].map[jMin][iMin-1]===0 && room[elevation-1].map[jMin][iMin]===0
            if(outerCheck||innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y2);
                context.lineTo(point2X, point2Y2);
                context.stroke();
            }
        }
        //bottom from positive i
        if (elevation!==0 && p.pos[1]<iMin && i1===i2){
            innerCheck=room[elevation].map[jMin][iMin]===0 && room[elevation-1].map[jMin][iMin-1]===0
            if(innerCheck){
                context.beginPath();
                context.moveTo(point1X, point1Y2);
                context.lineTo(point2X, point2Y2);
                context.stroke();
            }
        } 
        
        //corner
        if (inArray([j1,i1],cornerList)){
            lineOnCorner([j1,i1],fDist)
        }
        if (inArray([j2,i2],cornerList)){
            lineOnCorner([j2,i2],fDist)
        }



    }


    //funfade
    function fadeBlack(col1,col2,col3){
        if (fadeBool===true){
            col1=parseInt(col1, 16)
            col1=Math.floor(col1*(fadePerc/100))
            col1=col1.toString(16)
            if(col1.length===1){
                col1='0'+col1
            }
            col2=parseInt(col2, 16)
            col2=Math.floor(col2*(fadePerc/100))
            col2=col2.toString(16)
            if(col2.length===1){
                col2='0'+col2
            }
            col3=parseInt(col3, 16)
            col3=Math.floor(col3*(fadePerc/100))
            col3=col3.toString(16)
            if(col3.length===1){
                col3='0'+col3
            }
            return '#'+col1+col2+col3

        }
        else{
            return '#'+col1+col2+col3
        }

    }


    //funlineOnCorner
    function lineOnCorner(point1,fDist){
        if (typeof point1==='object'){
            point1=cornerLineCoords(point1,fDist)
        }

        var point1Y1=point1[0]
        var point1Y2=point1[1]
        var point1X=point1[2]
        context.beginPath();
        context.moveTo(point1X, point1Y1);
        context.lineTo(point1X, point1Y2);
        context.stroke();
        
    }



    function toDegrees (angle) {
        return angle * (180 / Math.PI);
    }

    function toRadians (angle) {
        return angle * (Math.PI / 180);
    }

    function modAr(num){
        return num=((num+Math.PI*2)%(Math.PI*2))
    }

    //funangleAround
    function angleAround(point){
        var slope=-((point[0]-p.pos[0])/(point[1]-p.pos[1]));

        var angle=(Math.atan(slope));
        if (point[1]<p.pos[1]){
            angle+=Math.PI;
        }
        return modAr(angle);
    }

    //funpointVisible
    function pointVisible(point,side){
        var angHold
        if (typeof point==='object'){
            point=angleAround(point)+Math.PI*2
        }
        if(side==='left'){
            sideMod=Math.PI/4
        }
        else if(side==='right'){
            sideMod=-Math.PI/4
        }
        else{
            sideMod=0
        }
        angHold=Math.cos(p.dir+sideMod)*Math.cos(point) + Math.sin(p.dir+sideMod)*Math.sin(point)
        if(Math.abs(angHold)>1){
            return true
        }
        return trigCorrect(Math.acos(Math.cos(p.dir+sideMod)*Math.cos(point) + Math.sin(p.dir+sideMod)*Math.sin(point)),'ang')<= Math.PI/4
    }

    function pointAhead(){
        var yInt;
        var xInt;
        //y=mx+c
        var c = -p.slope*(p.x);
        intPts=[];
        for(var iInt=0;iInt<gameSizeI;iInt++){
            //y=m(iInt)+c
            yInt=p.slope*(iInt)+c;
            intPts.push([yInt,iInt]);
        }
        for(var jInt=0;jInt<gameSizeJ;jInt++){
            //y=mx+c
            //mx=y-c
            //x=(y-c)/m
            xInt=(jInt-c)/m;
            intPts.push([jInt,xInt]);
        }
        return intPts;
    }

    //Math.tan(p.dir*(180/Math.PI))

    //funcornerLineCoords
    function cornerLineCoords(point,fDist,floorArg){
        var center=p.pos
        var ptAngle=angleAround(point)
        var perpAngle
        var smallRatio
        var ratio
        var sideLength
        var ptY1
        var ptY2
        var xCoord
        var floorHeight

        perpAngle=Math.abs(ptAngle-(modAr(p.dir+Math.PI/4)-Math.PI/4))
        //QUICKFIX START
        if(p.dir>=(7*Math.PI/4) && ptAngle<p.dir && ptAngle>=(6*Math.PI/4)){
            perpAngle=p.dir-ptAngle
        }
        //QUICKFIX END
        perpDist = (Math.sqrt(Math.pow(point[0]-center[0],2)+Math.pow(point[1]-center[1],2)))*Math.cos(perpAngle)

        smallRatio=(Math.sqrt(Math.pow(point[0]-center[0],2)+Math.pow(point[1]-center[1],2)))*Math.sin(perpAngle)
        ratio=smallRatio/perpDist

        if(ptAngle>p.dir||((ptAngle<Math.PI/2 && ptAngle+Math.PI/4>(modAr(p.dir+Math.PI/4))))){
            xCoord=(width/2)-((width/2)*(ratio))
        }
        else if(ptAngle<p.dir||((p.dir<Math.PI/2 && p.dir+Math.PI/4>(modAr(ptAngle+Math.PI/4))))){
            xCoord=(width/2)+((width/2)*(ratio))
        }
        else{
            xCoord=width/2
        }
        //Have xCoord and perpDist
        sideLength=height/(2*perpDist);
        
        ptY1=(((2*perpDist)-1)/2)*sideLength
        ptY2=(((2*perpDist)+1)/2)*sideLength
        floorHeight=Math.abs(ptY1-ptY2)


        if(fDist!==0 && floorArg!=='floor' && floorArg!=='ceiling'&& floorArg!=='ramp'){
            ptY1=ptY1-floorHeight*fDist
            ptY2=ptY2-floorHeight*fDist
        }

        //Checks for perpDist<0.1 are for situations where the player is standing almost right above or below the
        //edge of a floor which results in a tiny perpDist and massive sidelength, so large that the Y1 and Y2 
        //coordinates result in NaN. In this case they are set to either '0' or 'height' depending on surface
        else if(fDist!==0 && floorArg==='ceiling'){
            if(perpDist<0.0001 || isNaN(perpDist)){
                ptY1=0
                ptY2=0
                xCoord='xReplace'
            }
            else{   
                ptY1=ptY1-floorHeight*(fDist-1)
                ptY2=ptY2-floorHeight*(fDist-1)
            }
        }
        else if(fDist!==0 && floorArg==='floor' || floorArg==='ramp'){
            if(perpDist<0.0001 || isNaN(perpDist)){
                ptY1=height
                ptY2=height
                xCoord='xReplace'
            }
            else{
                ptY1=ptY1-floorHeight*(fDist)
                ptY2=ptY2-floorHeight*(fDist)
            }
        }




        //placeholdermod
        return [Math.round(ptY1)-1,Math.round(ptY2),Math.round(xCoord),floorHeight]
    }

    //funperpDistance
    function perpDistance(point){
        var center=p.pos
        var ptAngle=angleAround(point)
        var perpAngle
        perpAngle=Math.abs(ptAngle-(modAr(p.dir+Math.PI/4)-Math.PI/4))
        //QUICKFIX START
        if(p.dir>=(7*Math.PI/4) && ptAngle<p.dir && ptAngle>=(6*Math.PI/4)){
            perpAngle=p.dir-ptAngle
        }
        //QUICKFIX END
        perpDist = (Math.sqrt(Math.pow(point[0]-center[0],2)+Math.pow(point[1]-center[1],2)))*Math.cos(perpAngle)
        return perpDist   
    }

    function maxIndex(array){
        var index = 0;
        var max = -4.9;
        for (i=0; i<array.length; i++){
            if (array[i] > max){
               max = array[i];
               index = i;
            }
        }
        return index;
    }

    function updateMap(floor) {
        mapContext.clearRect(0, 0, 150, 150); 
        for (y = 0; y < gameSizeJ; y++) {
            for (x = 0; x < gameSizeI; x++) {
                if (floor[y][x]===0){
                    mapContext.fillRect(x*150/gameSizeI, y*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
               }
           }

        }
        mapContext.fillStyle = 'red';
        if(room===gateRoom){
            mapContext.fillRect(15*150/gameSizeI, 3*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
        }
        else if(room===towerRoom){
            if (Math.floor(p.elevation)===0){
                mapContext.fillRect(15*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===1){
                mapContext.fillRect(19*150/gameSizeI, 3*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===2){
                mapContext.fillRect(4*150/gameSizeI, 24*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===3){
                mapContext.fillRect(10*150/gameSizeI, 24*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===4){
                mapContext.fillRect(12*150/gameSizeI, 2*150/gameSizeJ, 3*150/gameSizeI, 4*150/gameSizeJ);
                mapContext.fillRect(11*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
                mapContext.fillRect(15*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
        }
        else if(room===mazeRoom){
            if (Math.floor(p.elevation)===0){
                mapContext.fillRect(15*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
                mapContext.fillStyle='grey';
                mapContext.fillRect(3*150/gameSizeI, 3*150/gameSizeJ, 18*150/gameSizeI, 18*150/gameSizeJ)
                mapContext.fillStyle='red';
            }
            if (Math.floor(p.elevation)===1 && p.y>25){
                mapContext.fillRect(4*150/gameSizeI, 27*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===1 && p.y>3){
                mapContext.fillRect(11*150/gameSizeI, 22*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===1){
                mapContext.fillRect(17*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===2 && p.y<5){
                mapContext.fillRect(19*150/gameSizeI, 2*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            else if (Math.floor(p.elevation)===2){
                mapContext.fillRect(17*150/gameSizeI, 27*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
            if (Math.floor(p.elevation)===3){
                mapContext.fillRect(20*150/gameSizeI, 27*150/gameSizeJ, 150/gameSizeI, 150/gameSizeJ);
            }
        }

        mapContext.lineWidth=3;
        mapContext.strokeStyle = 'orange';
        mapContext.beginPath();
        mapContext.moveTo((p.pos[1]+100/gameSizeI*Math.cos(p.dir+Math.PI/7))*150/gameSizeI,(p.pos[0]-100/gameSizeI*Math.sin(p.dir+Math.PI/7))*150/gameSizeJ);
        mapContext.lineTo((p.pos[1])*150/gameSizeI,(p.pos[0])*150/gameSizeJ);
        mapContext.lineTo((p.pos[1]+100/gameSizeI*Math.cos(p.dir-Math.PI/7))*150/gameSizeI,(p.pos[0]-100/gameSizeI*Math.sin(p.dir-Math.PI/7))*150/gameSizeJ);
        mapContext.closePath();
        mapContext.stroke();
        mapContext.lineWidth=1;
        mapContext.fillStyle = 'orange';
        mapContext.strokeStyle = 'black';
        mapContext.beginPath();
        mapContext.arc(p.x*150/gameSizeI,p.y*150/gameSizeJ,150/gameSizeI,0,2*Math.PI);
        mapContext.fill();
        mapContext.stroke();
        mapContext.fillStyle = 'black';
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


    function OP(conArg){
        if(globalCon){
                console.log(conArg)
            }
    }

    function OPOP(conArg){
        if(gloBool && globalCon){
                console.log(conArg)
            }
    }






    //funlineOnFloor
    function lineOnFloor(pointCheck,fDist,surface,elevation,dir){
        if(room[elevation].map[pointCheck[0]][pointCheck[1]]!==6 || (room[elevation].map[pointCheck[0]][pointCheck[1]]===6 && fDist===-1 && ((Math.abs(pointCheck[0]-p.pos[0])<2&& Math.abs(pointCheck[1]-p.pos[1])<2)||((pointCheck[0]===Math.floor(p.pos[0])&&Math.abs(pointCheck[1]-p.pos[1])<3) || (pointCheck[1]===Math.floor(p.pos[1])&&Math.abs(pointCheck[0]-p.pos[0])<3))))){                                                                 
            var h={
                c0p:0,
                c01p:0,
                c1p:0,
                c12p:0,
                c2p:0,
                c23p:0,
                c3p:0,
                c30p:0
            }
            var hRamp
            var iHw;
            var heightMod=0;
            var c0p=[pointCheck[0],pointCheck[1]];
            var c01p='n';
            var c1p=[pointCheck[0]+1,pointCheck[1]];
            var c12p='n';
            var c2p=[pointCheck[0]+1,pointCheck[1]+1];
            var c23p='n';
            var c3p=[pointCheck[0],pointCheck[1]+1];
            var c30p='n';

            var hA=[c0p,c01p,c1p,c12p,c2p,c23p,c3p,c30p];

            var c0pVis=pointVisible(c0p);
            var c1pVis=pointVisible(c1p);
            var c2pVis=pointVisible(c2p);
            var c3pVis=pointVisible(c3p);

            var visArr=[c0pVis,c1pVis,c2pVis,c3pVis];
            var visCount=0;
            //get count
            for(var iH=0;iH<visArr.length;iH++){
                if(visArr[iH]===true){
                    visCount++;
                }
            }

            //if one
            if(visCount===1){
                for(iH=0;iH<visArr.length;iH++){
                    if(visArr[iH]===true){
                        //got index
                        hI=iH*2;
                        break
                    }
                }

                hA[mA(hI-1)]=partial(hA[mA(hI-2)],hA[mA(hI)]);
                hA[mA(hI-2)]=hA[mA(hI-1)];
                hA[mA(hI-3)]=hA[mA(hI-1)];
                hA[mA(hI+1)]=partial(hA[mA(hI)],hA[mA(hI+2)]);
                hA[mA(hI+2)]=hA[mA(hI+1)];
                if (pointVisible(hA[mA(hI-3)],'left')){
                    hA[mA(hI-4)]=[p.y-(0.1*Math.sin(modAr(p.dir+Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir+Math.PI/4)))];
                }
                else{
                    hA[mA(hI-4)]=[p.y-(0.1*Math.sin(modAr(p.dir-Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir-Math.PI/4)))];
                    
                }
                if (pointVisible(hA[mA(hI+2)],'left')){
                    hA[mA(hI+3)]=[p.y-(0.1*Math.sin(modAr(p.dir+Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir+Math.PI/4)))];
                }
                else{
                    hA[mA(hI+3)]=[p.y-(0.1*Math.sin(modAr(p.dir-Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir-Math.PI/4)))];
                }
            }

            else if(visCount===2){
                for(iH=0;iH<visArr.length;iH++){
                    if(visArr[iH]===true && visArr[((iH+1+visArr.length)%visArr.length)]===true){
                        //got index
                        hI=iH*2;
                        break
                    }
                }

                hA[mA(hI)]= hA[mA(hI)];
                hA[mA(hI+1)]=hA[mA(hI)];
                hA[mA(hI+2)]=hA[mA(hI+2)];
                hA[mA(hI+3)]=partial(hA[mA(hI+2)],hA[mA(hI+4)]);
                hA[mA(hI-1)]=partial(hA[mA(hI-2)],hA[mA(hI)]);
                

                if (pointVisible(hA[mA(hI+3)],'left')){
                    hA[mA(hI+4)]=[p.y-(0.1*Math.sin(modAr(p.dir+Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir+Math.PI/4)))];
                }
                else{
                    hA[mA(hI+4)]=[p.y-(0.1*Math.sin(modAr(p.dir-Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir-Math.PI/4)))];
                    
                }
                if (pointVisible(hA[mA(hI-1)],'left')){
                    hA[mA(hI-2)]=[p.y-(0.1*Math.sin(modAr(p.dir+Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir+Math.PI/4)))];
                }
                else{
                    hA[mA(hI-2)]=[p.y-(0.1*Math.sin(modAr(p.dir-Math.PI/4))),p.x+(0.1*Math.cos(modAr(p.dir-Math.PI/4)))];
                }
                hA[mA(hI+5)]=hA[mA(hI+4)];
            }


            c0p=hA[0];
            c01p=hA[1];
            c1p=hA[2];
            c12p=hA[3];
            c2p=hA[4];
            c23p=hA[5];
            c3p=hA[6];
            c30p=hA[7];
            hRamp=hA;


            c0p=cornerLineCoords(c0p,fDist,surface)
            c1p=cornerLineCoords(c1p,fDist,surface)
            c2p=cornerLineCoords(c2p,fDist,surface)
            c3p=cornerLineCoords(c3p,fDist,surface)

            if (c01p==='n'){
                c01p=c0p;
            }
            else{
                c01p=cornerLineCoords(c01p,fDist,surface)
            }

            if (c12p==='n'){
                c12p=c1p;
            }
            else{
                c12p=cornerLineCoords(c12p,fDist,surface)
            }

            if (c23p==='n'){
                c23p=c2p;
            }
            else{
                c23p=cornerLineCoords(c23p,fDist,surface)
            }

            if (c30p==='n'){
                c30p=c3p;
            }
            else{
                c30p=cornerLineCoords(c30p,fDist,surface)
            }


            hA=[c0p,c01p,c1p,c12p,c2p,c23p,c3p,c30p]
            for(iH=0;iH<hA.length-1;iH++){
                if(hA[iH][2]==='xReplace'){
                    if(hA[mA(iH-1)][0]>0 && hA[mA(iH-1)][0]<height){
                        hA[iH][2]=hA[mA(iH-1)][2]
                    }
                    else{
                        iHw=iH
                        while(hA[iHw][2]==='xReplace'){
                            iHw=mA(iHw+1)
                        }
                        hA[iH][2]=hA[iHw][2]
                    }
                }
                hA[iH][2]===Math.round(hA[iH][2])
                
            }

            if(surface==='ramp'){
                gloBool=false
    		
                if(dir===2){
                    h.c30p=(Math.ceil(hRamp[7][1])-hRamp[7][1])*c30p[3];
                    h.c0p=c0p[3];
                    h.c01p=c01p[3];
                    h.c1p=c1p[3];
                    h.c12p=(Math.ceil(hRamp[3][1])-hRamp[3][1])*c12p[3];
                    if(h.c12p===0){
                        h.c12p=c12p[3]        //special case. c12 should never be 0 for ramp===2 as c12 will always be between levels

                    }
                }
                if(dir===3){
                    h.c12p=(Math.ceil(hRamp[7][1])-hRamp[7][1])*c12p[3];
                    h.c2p=c2p[3];
                    h.c23p=c23p[3];
                    h.c3p=c3p[3];
                    h.c30p=(Math.ceil(hRamp[3][1])-hRamp[3][1])*c30p[3];
                    if(h.c30p===0){
                        h.c30p=c30p[3]        //special case. c30 should never be 0 for ramp===3 as c30 will always be between levels

                    }
                }
            }


            if(room[elevation].map[pointCheck[0]][pointCheck[1]]===6){
                context.fillStyle=fadeBlack('B2','22','22');;
            }
            else{
                context.fillStyle=fadeBlack('FF','FF','FF');
            }
            context.beginPath();
            context.moveTo(c0p[2],c0p[0]+h.c0p);
            context.lineTo(c01p[2],c01p[0]+h.c01p); 
            context.lineTo(c1p[2],c1p[0]+h.c1p);
            context.lineTo(c12p[2],c12p[0]+h.c12p);
            context.lineTo(c2p[2],c2p[0]+h.c2p);
            context.lineTo(c23p[2],c23p[0]+h.c23p);
            context.lineTo(c3p[2],c3p[0]+h.c3p);
            context.lineTo(c30p[2],c30p[0]+h.c30p);
            context.closePath();
            context.fill()

            context.strokeStyle=fadeBlack('FF','FF','FF');
            context.lineWidth=2
            context.beginPath();
            context.moveTo(c0p[2],c0p[0]+h.c0p);
            context.lineTo(c01p[2],c01p[0]+h.c01p); 
            context.lineTo(c1p[2],c1p[0]+h.c1p);
            context.lineTo(c12p[2],c12p[0]+h.c12p);
            context.lineTo(c2p[2],c2p[0]+h.c2p);
            context.lineTo(c23p[2],c23p[0]+h.c23p);
            context.lineTo(c3p[2],c3p[0]+h.c3p);
            context.lineTo(c30p[2],c30p[0]+h.c30p);
            context.closePath();
            context.fill()
            context.strokeStyle="black"
            context.lineWidth=1

            if(surface==='ramp'){
                context.moveTo(c0p[2],c0p[0]+h.c0p);
                context.lineTo(c01p[2],c01p[0]+h.c01p); 
                context.lineTo(c1p[2],c1p[0]+h.c1p);
                context.lineTo(c12p[2],c12p[0]+h.c12p);
                context.lineTo(c2p[2],c2p[0]+h.c2p);
                context.lineTo(c23p[2],c23p[0]+h.c23p);
                context.lineTo(c3p[2],c3p[0]+h.c3p);
                context.lineTo(c30p[2],c30p[0]+h.c30p);

                context.closePath();
                context.stroke();
            }
            else{
                if(!(room[elevation].map[pointCheck[0]][pointCheck[1]-1]===0)){
                    context.beginPath();
                    context.moveTo(c0p[2],c0p[0]+h.c0p);
                    context.lineTo(c01p[2],c01p[0]+h.c01p);
                    context.stroke();

                    context.beginPath();
                    context.moveTo(c01p[2],c01p[0]+h.c01p); 
                    context.lineTo(c1p[2],c1p[0]+h.c1p);
                    context.stroke();
                }
                
                if(!(room[elevation].map[pointCheck[0]+1][pointCheck[1]]===0)){
                    context.beginPath();
                    context.moveTo(c1p[2],c1p[0]+h.c1p);
                    context.lineTo(c12p[2],c12p[0]+h.c12p);
                    context.stroke();

                    context.beginPath();
                    context.moveTo(c12p[2],c12p[0]+h.c12p);
                    context.lineTo(c2p[2],c2p[0]+h.c2p);
                    context.stroke();
                }

                if(!(room[elevation].map[pointCheck[0]][pointCheck[1]+1]===0)){
                    context.beginPath();
                    context.moveTo(c2p[2],c2p[0]+h.c2p);
                    context.lineTo(c23p[2],c23p[0]+h.c23p);
                    context.stroke();

                    context.beginPath();
                    context.moveTo(c23p[2],c23p[0]+h.c23p);
                    context.lineTo(c3p[2],c3p[0]+h.c3p);
                    context.stroke();
                }

                if(!(room[elevation].map[pointCheck[0]-1][pointCheck[1]]===0)){
                    context.beginPath();
                    context.moveTo(c3p[2],c3p[0]+h.c3p);
                    context.lineTo(c30p[2],c30p[0]+h.c30p);
                    context.stroke();

                    context.beginPath();
                    context.moveTo(c30p[2],c30p[0]+h.c30p);
                    context.lineTo(c0p[2],c0p[0]+h.c0p);
                    context.stroke();
                }
            }


            function mA(num){
                return (num+hA.length)%hA.length
            }
        }
    }


})();
