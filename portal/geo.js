// linefromto





function pointVisible(point,dirGeo,fovGeo){
    var angHold
    //point must be an angle
    var geoAng=Math.acos(Math.cos(dirGeo)*Math.cos(point) + Math.sin(dirGeo)*Math.sin(point))
    return geoAng <=fovGeo 
}