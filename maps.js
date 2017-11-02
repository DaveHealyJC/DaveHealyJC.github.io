var timerVar;
var timerDisp;
var totalSeconds = 0;
var canvas;             //canvas and context are declared here so that when they are assigned values later on they will have scope within 
var context;
var resumeBool=true;
var wgbBool=true;
var timeInterval;
var timeBool=false;
var totalSpaces;
var totalTurns;
var timerStartBool=false;



    



var p = {           
        y:4.5,
        x:3.5,
        dir:Math.PI/2,
        elevation : 0
    };
    p.pos=[p.y,p.x];
//portdebug
var portB = {
    lines:[],
    coords:[0,0],
    loc:false,
    orien:0,
}
var portO = {
    lines:[],
    coords:[0,0],
    loc:false,
    orien:0
}


var gateRoom=[

    {
        elevation:0,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],//14
        [0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,0,0],//15
        [0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[[3,15]],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            //portdebug
            if(w===0){
                p.y=22+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
                gameSizeJ=room[0].map.length;
                gameSizeI=room[0].map[0].length;
                timeBool=true
                if (timerStartBool===false){
                    timeInterval=setInterval(function(){dispTime()}, 1000);
                    timerStartBool=true;
                }
            }
            return
        }
    },

    {
        elevation:1,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],//15
        [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],//15
        [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],//14
        [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            if(w===0){
                p.y=10+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
            }
            return
        }
    },

    {
        elevation:2,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,0,1,1,1,0,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//14
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            if(w===0){
                p.y=10+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
            }
            return
        }
    },

    {
        elevation:3,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//14
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            if(w===0){
                p.y=10+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
            }
            return
        }
    },

    {
        elevation:4,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//14
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            if(w===0){
                p.y=10+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
            }
            return
        }
    },

    {
        elevation:5,
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//2
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//3
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0],//7
        [0,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0],//8
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//10
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//11
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//12
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//13
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//14
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//15
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//16
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //17
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      // 0                   1                   2
                                 //^//
        warpArr:[],
        warp: function(pos,pElev){
            warpArr=gateRoom[0].warpArr;
            w=warpCheck(pos)        
            if(w===0){
                p.y=10+p.y-Math.floor(p.y)
                p.x=10+p.x-Math.floor(p.x)
                p.pos=[p.y,p.x]
                p.elevation=0
                room=towerRoom;
            }
            return
        }
    }


    ];

    
////////////////////////////////////////////////////////////////////////////////

var testRoom=[

    {
        elevation:0,

        /*
        map : [
        [0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0],//1
        [0,0,1,1,1,1,1,0,0],//2
        [0,0,1,1,1,1,1,0,0],//3
        [0,0,1,1,1,1,1,0,0],//4
        [0,0,1,1,1,1,1,0,0],//5
        [0,0,1,1,1,1,1,0,0],//6
        [0,0,0,0,0,0,0,0,0],//7        
        [0,0,0,0,0,0,0,0,0],//8      
    ],// 0,1,2,3,4,5,6,7,8
        */                  

        ///*
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//2
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//3
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//4
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//5
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//7
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],//8
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],//9
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0],//0
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//1
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//2
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//3
        [0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0],//4
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//5
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //6
    ],// 0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7
      //                     1                   2                   3

       //*/            
        warpArr:[],
        warp: function(pos,pElev){
            var curr;
            var dest;
            warpArr=testRoom[0].warpArr;
            w=warpCheck(pos);
            if (w>=0 && inArray(warpArr[w][0],[portB.coords[0],portO.coords[0]],'sing') && inArray(warpArr[w][1],[portB.coords[1],portO.coords[1]],'sing')){
                if(warpArr[w][0]==portB.coords[0] && warpArr[w][1]==portB.coords[1]){
                    curr=portB;
                    dest=portO;
                }
                else{
                    curr=portO;
                    dest=portB;
                }
                switch(curr.orien-dest.orien) {
                    case 1:
                        p.dir=modAr(p.dir+Math.PI/2);
                        break;
                    case -1:
                        p.dir=modAr(p.dir-Math.PI/2);
                        break;
                    case 0:
                        p.dir=modAr(p.dir+Math.PI);
                        break;
                    case 2:
                        p.dir=p.dir;
                        break;
                    case -2:
                        p.dir=p.dir;
                        break;
                }
                var displaceMod=0.02
                switch(dest.orien){
                    case 0:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]-displaceMod;
                        break;
                    case 1:
                        p.y=dest.coords[0]+1+displaceMod;
                        p.x=dest.coords[1]+1-(p.x-Math.floor(p.x));
                        break;
                    case 2:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]+1+displaceMod;
                        break;
                    case 3:
                        p.y=dest.coords[0]-displaceMod;
                        p.x=dest.coords[1]+(p.x-Math.floor(p.x));
                }


                p.pos=[p.y,p.x];
            }
            return
        }
    
    
    }
    /*
    },
    {
        elevation:1,              

        //
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//2
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//3
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//4
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//5
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//7
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//8
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //9
    ],// 0,1,2,3,4,5,6,7,8,9
      //         

       //           
        warpArr:[],
        warp: function(pos,pElev){
            var curr;
            var dest;
            warpArr=testRoom[0].warpArr;
            w=warpCheck(pos);
            if (w>=0 && inArray(warpArr[w][0],[portB.coords[0],portO.coords[0]],'sing') && inArray(warpArr[w][1],[portB.coords[1],portO.coords[1]],'sing')){
                if(warpArr[w][0]==portB.coords[0] && warpArr[w][1]==portB.coords[1]){
                    curr=portB;
                    dest=portO;
                }
                else{
                    curr=portO;
                    dest=portB;
                }
                switch(curr.orien-dest.orien) {
                    case 1:
                        p.dir=modAr(p.dir+Math.PI/2);
                        break;
                    case -1:
                        p.dir=modAr(p.dir-Math.PI/2);
                        break;
                    case 0:
                        p.dir=modAr(p.dir+Math.PI);
                        break;
                    case 2:
                        p.dir=p.dir;
                        break;
                    case -2:
                        p.dir=p.dir;
                        break;
                }
                var displaceMod=0.02
                switch(dest.orien){
                    case 0:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]-displaceMod;
                        break;
                    case 1:
                        p.y=dest.coords[0]+1+displaceMod;
                        p.x=dest.coords[1]+1-(p.x-Math.floor(p.x));
                        break;
                    case 2:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]+1+displaceMod;
                        break;
                    case 3:
                        p.y=dest.coords[0]-displaceMod;
                        p.x=dest.coords[1]+(p.x-Math.floor(p.x));
                }


                p.pos=[p.y,p.x];
            }
            return
        }
    
    
    
    },

    {
        elevation:2,

                

        //
        map : [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//0
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//1
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//2
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//3
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//4
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//5
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//6
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],//7
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],//8
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0] //9
    ],// 0,1,2,3,4,5,6,7,8,9
      //         

       //          
        warpArr:[],
        warp: function(pos,pElev){
            var curr;
            var dest;
            warpArr=testRoom[0].warpArr;
            w=warpCheck(pos);
            if (w>=0 && inArray(warpArr[w][0],[portB.coords[0],portO.coords[0]],'sing') && inArray(warpArr[w][1],[portB.coords[1],portO.coords[1]],'sing')){
                if(warpArr[w][0]==portB.coords[0] && warpArr[w][1]==portB.coords[1]){
                    curr=portB;
                    dest=portO;
                }
                else{
                    curr=portO;
                    dest=portB;
                }
                switch(curr.orien-dest.orien) {
                    case 1:
                        p.dir=modAr(p.dir+Math.PI/2);
                        break;
                    case -1:
                        p.dir=modAr(p.dir-Math.PI/2);
                        break;
                    case 0:
                        p.dir=modAr(p.dir+Math.PI);
                        break;
                    case 2:
                        p.dir=p.dir;
                        break;
                    case -2:
                        p.dir=p.dir;
                        break;
                }
                var displaceMod=0.02
                switch(dest.orien){
                    case 0:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]-displaceMod;
                        break;
                    case 1:
                        p.y=dest.coords[0]+1+displaceMod;
                        p.x=dest.coords[1]+1-(p.x-Math.floor(p.x));
                        break;
                    case 2:
                        p.y=dest.coords[0]+(p.y-Math.floor(p.y));
                        p.x=dest.coords[1]+1+displaceMod;
                        break;
                    case 3:
                        p.y=dest.coords[0]-displaceMod;
                        p.x=dest.coords[1]+(p.x-Math.floor(p.x));
                }


                p.pos=[p.y,p.x];
            }
            return
        }
    
    
    
    }
    */
    
    ];







    
////////////////////////////////////////////////////////////////////////////
    
    
    
    
    
    
    
var room=testRoom;
var gameSizeJ=room[0].map.length;
var gameSizeI=room[0].map[0].length;
    
    
    


function warpCheck(pos){
    for(w=0;w<warpArr.length;w++){
        if (Math.floor(pos[0])===warpArr[w][0] && Math.floor(pos[1])===warpArr[w][1]){
            return w;
        }
    }
    return -1;

}


    
function modAr(num){
        return num=((num+Math.PI*2)%(Math.PI*2))
    }
    
    




    function randNum(min, max) {
            return Math.round(Math.random()*(max-min))+min;
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