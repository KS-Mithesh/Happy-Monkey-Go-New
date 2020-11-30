var gameState="play";
var ground,invisibleGround;
var monkey , monkey_running , monkey_collided;
var bananaImage, obstacleImage;
var bananaGroup, obstacleGroup;
var randBanana,bananaPosition;
var survivalTime=0,score=0;
var gameover,gameoverImage,restart,restartImage;

function preload(){
  
  
  monkey_running  = loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  monkey_collided = loadAnimation("sprite_3.png");
  
  bananaImage   = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
 
  gameoverImage = loadImage("gameOver.png");
  restartImage  = loadImage("restart.png");
  
}

function setup() {
  createCanvas(400,400);

  ground = createSprite(100,350,800,7);
  
  invisibleGround = createSprite(100,350,800,20);
  invisibleGround.visible=false;
  
  monkey = createSprite(100,350,10,10);
  monkey.addAnimation("running monkey",monkey_running);
  monkey.addAnimation("stopped",monkey_collided);
  monkey.scale=0.1;
  //monkey.debug=true;
  
  gameover = createSprite(200,150,10,10);
  gameover.addImage("gameover",gameoverImage);
  gameover.scale=0.9;
  ////////////////////////////////////////////
  restart = createSprite(200,215,10,10);
  restart.addImage("restart",restartImage);
  restart.scale=0.8;
  
  bananaGroup = createGroup();
  obstacleGroup = createGroup();
}


function draw() {
  background("white");
  
  if(gameState=="play") {
    
    //Jumping program
    if(keyDown("space")&&monkey.isTouching(invisibleGround)) {
    monkey.velocityY=-13;
  }
    
    bananas();   //banana spawning
    obstacles();   //rock spawning
    
    //increase survival time
    if(frameCount%60==0) {
    survivalTime = survivalTime + 1;
  }
      
    //add score if touching banana
    if(monkey.isTouching(bananaGroup)) {
      bananaGroup.destroyEach();
      score = score + 1;
    }
    
    //change gameState to "end" when is touching obstacle
    if(monkey.isTouching(obstacleGroup)) {
      gameState="end";
    }

    camera.position.y=monkey.y;
    
    gameover.visible = false;
    restart.visible =  false;
    
    monkey.velocityY=monkey.velocityY+0.8;
    
  }
  else if(gameState=="end") {
    
    monkey.changeAnimation("stopped",monkey_collided);
    
    //stop the objects
    monkey.velocityY=0;
    obstacleGroup.setLifetimeEach(-1);
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setLifetimeEach(-1);
    bananaGroup.setVelocityXEach(0);
    
    gameover.visible = true;
    restart.visible =  true;
    
    if(mousePressedOver(restart)) {
      reset();
      gameState="play";
    }
    
  }
  
  monkey.collide(ground);
  
  //Survival Time
  textSize(25);fill("black");stroke("black");
  text("Survival Time: "+survivalTime,100,50);
  //score
  textSize(25);fill("black");stroke("black");
  text("Score: "+score,150,385);
  
  drawSprites();
}

function obstacles() {
  if (frameCount%100==0) {
    var obstacle = createSprite(450,329,10,10);
    obstacle.depth =monkey.depth - 1;
    //obstacle.debug=true;
    obstacle.setCollider("circle",0,0,125);
    obstacle.addImage("obstacle",obstacleImage);
    obstacle.scale=0.1;
    obstacle.velocityX = -5;
    obstacleGroup.add(obstacle);
  }
}
function bananas() {
  randBanana = Math.round(random(1,2));
  switch(randBanana){
    case 1:
      bananaPosition = 300;
        break;
    case 2:
      bananaPosition = 200;
      break;
      }
  
  if (frameCount%bananaPosition==0) {
        var banana = createSprite(450,250,10,10);
        //banana.debug=true;
        banana.setCollider("rectangle",0,0,600,400);
        banana.addImage("banana",bananaImage);
        bananaGroup.add(banana);
        banana.velocityX = -5;
        banana.scale=0.1;
  }
}

function reset() {
  survivalTime = 0;
  
  score = 0;
  
  obstacleGroup.destroyEach();
  
  bananaGroup.destroyEach();
  
  monkey.changeAnimation("running monkey",monkey_running);
}