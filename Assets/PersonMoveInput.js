//speed variables
var speed = 0.5;

//movement variables
var startPos = Vector3.zero;
var trans = 0.0;
var xMove = 0.0;
var zMove = 0.0;

//target variables
var target : Transform;
var goBack = false;

//position variables
var bound1 = 0.46;
var bound2 = 1.22;
var bound3 = 3.66;
var sqrLen = 0.0;

function Start(){
	//random returns a float f such that 0 <= f <= 1
	//var rand = Random.value;
	//movement in x direction
	//transform into a value between -.5 and .5 (+/- 45 degrees)
	//trans = rand - 0.5;
	
	//determine random speed (at least 0.3 so it's not completely tedious)
	//rand = Random.value;
	//speed = rand + 0.3;
	
	//determine random starting position within bounding box
	// -2 < x < 2
	// -11 < z < -10
	//rand = Random.value;
	//var startX = 3*rand - 2;
	//rand = Random.value;
	//var startZ = -1*rand - 10;
	//startPos = new Vector3(startX, 0.33, startZ);
	//transform.position = startPos;
}
function Update () {
		xMove = 0.05*Input.GetAxis ("Horizontal");
		zMove = 0.05*Input.GetAxis ("Vertical");

	
		transform.Translate(xMove, 0, zMove);
}
