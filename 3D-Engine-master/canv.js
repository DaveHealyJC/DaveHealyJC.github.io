(function() {

    var critters = [];
    var interval_id;
    document.addEventListener('DOMContentLoaded', init, false);
    
    function init() {
        canvas = document.querySelector('canvas');
        context = canvas.getContext('2d');
        width = canvas.width;
        height = canvas.height;
        create_critters();
        canvas.addEventListener('click', handle_click, false);
        clearInterval(interval_id);
        interval_id = window.setInterval(draw_critters, 33);
    }
    
    function getRandomNumber(min, max){
        return Math.round(Math.random() * (max-min)) + min;
    }
    
    function create_critters() {
        for (var i=0; i<10; i+=1) {
            var critterSize = getRandomNumber(2, 50);
            var critter = {
                size : critterSize,
                x : getRandomNumber(0, width-critterSize),
                y : getRandomNumber(0, height-critterSize),
                alive : true
            };
            critters.push(critter);
        }
    }
    
    function draw_critters() {
        context.clearRect(0,0,width,height);
        context.fillStyle = 'yellow';
        for (var i=0; i < critters.length; i+=1){
            if (critters[i].alive === true){
                context.fillRect(critters[i].x, critters[i].y, critters[i].size, critters[i].size);
            } 
        }
    }
    
    function handle_click(event) {
        var click_x = get_click_x(event);
        var click_y = get_click_y(event);
        for (var i=0; i<critters.length; i+=1){
            if (click_x<critters[i].x || click_x > critters[i].x+critters[i].size || click_y<critters[i].y || click_y > critters[i].y+critters[i].size) {
                continue;
            } else {
                critters[i].alive = false;
            }
        }
    }
        
    function get_click_x(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientX - rect.left;
        return x;
    }
    
    function get_click_y(event) {
        var rect = canvas.getBoundingClientRect();
        var x = event.clientY - rect.top;
        return x;
    }
    

})();