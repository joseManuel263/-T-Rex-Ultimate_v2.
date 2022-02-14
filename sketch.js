//0501bank
//joseManuel263
//https://josemanuel263.github.io/trex-v.2/
var STATE = 2;
var PLAY = 1;
var END = 0;
var gameState = STATE;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var highScore;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  obstacle7 = loadImage("obstacle7.png");
  obstacle8 = loadImage("obstacle8.png");
  obstacle9 = loadImage("obstacle9.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  var message = "This is a message";
  console.log(message)
  
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 0.5;
  
  ground = createSprite(width,height-75,20,30);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(width/2,height-10,width,125)
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("circle",0,-5,50);
  trex.debug = false;
  
  score = 0;
  highScore = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  textSize(32);
  text("(っ＾▿＾)۶🍸🌟🍺٩(˘◡˘ )", 400,50);
  text("Score: "+score+".",155,75);
  text("High Score: "+highScore+".",805,75);

  if(gameState === STATE){
    text('Para empezar presiona "Space" o toca una vez la pantalla.\nPara salta presiona "Space" o toca una vez la pantalla.\nPara "super salto" presiona "Space + c" o toca dos vez la pantalla.\n\nCuidado no debes tocar ni un obstáculo.\n\n"BUENA SUERTE" ٩(˘◡˘)۶',width/9,height/3);
    gameOver.visible = false;
    restart.visible = false;

    if(touches.length > 0 || keyDown("SPACE")) {
    gameState = END;
    touches = [];
    }
  }

  else if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100);
    //scoring
    score = score + Math.round(frameRate()/30);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.length > 0 || keyDown("SPACE")) && trex.y >= height-120) {
        jumpSound.play()
        trex.velocityY = -10;
        touches = [];
    }

    if((touches.length > 1 || keyDown("SPACE") && keyDown("c")) && trex.y >= height-120) {
      jumpSound.play()
      trex.velocityY = -15;
      touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)&& trex.y >= 100){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play();
        if(score > highScore){
          highScore = score;
        }
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)||
     keyDown("space")&&gameState==END) {
      reset();
    }


  drawSprites();
}

function reset(){
  gameState=PLAY;
  score=0;
  trex.changeAnimation("running",trex_running)
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
}


function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(width,height-95,20,30);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,9));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      case 7: obstacle.addImage(obstacle7);
              break;
      case 8: obstacle.addImage(obstacle8);
              break;
      case 9: obstacle.addImage(obstacle9);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = width/2;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}
